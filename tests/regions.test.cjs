const test = require('node:test');
const assert = require('node:assert/strict');
const { loadEngine } = require('./engine.cjs');
const engine = loadEngine();
const run = engine.run;

// 代表输入：亮色、深色、高色度、接近功能色、近中性
const BRANDS = [
  ['亮蓝', '#2563eb'], ['浅黄', '#facc15'], ['深紫', '#4c1d95'],
  ['高彩度品红', '#db2777'], ['接近成功色', '#16a34a'], ['接近错误色', '#dc2626'],
  ['近中性灰蓝', '#64748b'], ['暖橙', '#ea580c']
];

test('区域前景在最终 Hex 上满足对比度：正文/行动/行动文字/边框/功能色，亮暗主题与四种策略全覆盖', () => {
  const failures = run(`(() => {
    const brands = ${JSON.stringify(BRANDS)};
    const out = [];
    for (const [bn, hex] of brands) {
      const acc = computeBeautifulAccent(hexToOklch(hex));
      for (const strategy of ['restrained', 'committed', 'full-palette', 'drenched']) {
        const sys = computeSystem(acc.oklch, { textOnAccentLight: acc.textContrastOnAccent, design: { strategy, strategyExplicit: true } });
        for (const theme of ['light', 'dark']) {
          for (const kind of Object.keys(sys.regions.themes[theme])) {
            const s = sys.regions.themes[theme][kind];
            const apca = Math.abs(calculateApca(s.textSecondary.hex, s.bg.hex));
            if (!s.text.pass) out.push(bn + ' ' + strategy + ' ' + theme + ' ' + kind + ' text');
            if (!(s.textSecondary.ratio >= 4.5 || apca >= 60)) out.push(bn + ' ' + strategy + ' ' + theme + ' ' + kind + ' secondary');
            if (!s.action.pass) out.push(bn + ' ' + strategy + ' ' + theme + ' ' + kind + ' action');
            if (!s.actionText.pass) out.push(bn + ' ' + strategy + ' ' + theme + ' ' + kind + ' actionText');
            if (!s.border.pass) out.push(bn + ' ' + strategy + ' ' + theme + ' ' + kind + ' border');
            for (const [fn, f] of Object.entries(s.functional)) if (!f.pass) out.push(bn + ' ' + strategy + ' ' + theme + ' ' + kind + ' ' + fn);
            // 行动必须与区域背景分离，且不能与背景同色
            if (s.action.hex === s.bg.hex) out.push(bn + ' ' + strategy + ' ' + theme + ' ' + kind + ' action-same-as-bg');
          }
        }
      }
    }
    return out;
  })()`);
  assert.deepEqual([...failures], []);
});

test('策略决定区域构成：克制不铺画布、投入一个品牌区、全色板两区、浸染染色画布', () => {
  const plans = run(`(() => {
    const out = {};
    for (const strategy of ['restrained', 'committed', 'full-palette', 'drenched']) {
      const sys = computeSystem(hexToOklch('#2563eb'), { design: { strategy, strategyExplicit: true } });
      out[strategy] = { kinds: Object.keys(sys.regions.themes.light), canvas: sys.regions.plan.canvas, brand: sys.regions.plan.brand, auxiliary: sys.regions.plan.auxiliary };
    }
    return out;
  })()`);
  assert.deepEqual([...plans.restrained.kinds], ['brand']);
  assert.equal(plans.restrained.canvas, false);
  assert.equal(plans.restrained.brand, 'subtle');
  assert.deepEqual([...plans.committed.kinds], ['brand']);
  assert.equal(plans.committed.brand, 'large');
  assert.deepEqual([...plans['full-palette'].kinds], ['brand', 'auxiliary']);
  assert.deepEqual([...plans.drenched.kinds], ['canvas', 'brand']);
  assert.equal(plans.drenched.canvas, true);
});

test('策略之间画面差异来自区域：浸染画布自身染色，投入/全色板品牌区域面积显著', () => {
  const res = run(`(() => {
    const out = {};
    for (const strategy of ['restrained', 'committed', 'full-palette', 'drenched']) {
      const sys = computeSystem(hexToOklch('#2563eb'), { design: { strategy, strategyExplicit: true } });
      const light = sys.regions.themes.light;
      out[strategy] = {
        brandChroma: light.brand.bg.oklch.C,
        brandL: light.brand.bg.oklch.L,
        canvas: light.canvas ? { c: light.canvas.bg.oklch.C, L: light.canvas.bg.oklch.L } : null,
        auxiliaryHue: light.auxiliary ? light.auxiliary.hue : null,
        brandHue: light.brand.hue
      };
    }
    return out;
  })()`);
  // 克制：近中性；投入/浸染：明显色度
  assert.ok(res.restrained.brandChroma < 0.03, '克制品牌区域应为近中性');
  assert.ok(res.committed.brandChroma > 0.10, '投入品牌区域应有明确色度');
  assert.ok(res.drenched.brandChroma > 0.10, '浸染品牌区域应有明确色度');
  // 浸染：画布本身染色且为浅色底
  assert.ok(res.drenched.canvas && res.drenched.canvas.c > 0.03, '浸染画布必须自身染色');
  assert.ok(res.drenched.canvas.L > 0.6, '亮色模式下浸染画布应为浅色');
  // 全色板：辅助区域与品牌区域色相不同
  assert.ok(res['full-palette'].auxiliaryHue !== null);
  assert.notEqual(res['full-palette'].auxiliaryHue, res['full-palette'].brandHue);
});

test('区域规则进入所有出口：CSS 变量与区域类、组件示例、提示词、JSON、Tailwind', () => {
  run(`var sys=computeSystem(hexToOklch('#2563eb'),{design:{strategy:'full-palette',strategyExplicit:true}});
    var scale=generateSpaceScale(4);var tokens=buildTokenMap(sys,scale,generateSpaceSemanticTokens(scale,sys.design));`);
  const css = run('buildCSSExport(sys,tokens)');
  assert.ok(css.includes('--region-brand-bg'));
  assert.ok(css.includes('.ce-region-brand {'));
  assert.ok(css.includes('.ce-region-auxiliary {'));
  assert.ok(css.includes('--color-accent-base: var(--region-brand-action)'));
  assert.ok(css.includes('--color-success: var(--region-brand-success)'));

  const prompt = run('buildStylePromptExport(tokens,sys)');
  assert.ok(prompt.includes('## 区域配色'));
  assert.ok(prompt.includes('.ce-region-brand'));
  assert.ok(prompt.includes('主行动必须与所在区域背景可分辨'));

  const json = JSON.parse(run('buildJSONTokens(tokens,sys)'));
  assert.equal(json.regions.sets.light.brand.bg, run('sys.regions.themes.light.brand.bg.hex'));
  assert.equal(json.regions.plan.auxiliary, true);
  assert.ok(json.regions.sets.light.auxiliary.text);

  const comp = run('buildComponentCSSExport(sys)');
  assert.ok(comp.includes('ce-region-brand'));

  const tw = run('buildTailwindConfig(tokens,sys)');
  assert.ok(tw.includes('region-brand-bg'));
});
