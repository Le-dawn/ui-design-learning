const test = require('node:test');
const assert = require('node:assert/strict');
const { loadEngine } = require('./engine.cjs');
const engine = loadEngine();
const run = engine.run;

test('每种风格都给出四个字体角色与可回退的中文字体栈', () => {
  const res = run(`(() => {
    const out = {};
    for (const style of Object.keys(DESIGN_STYLES)) {
      const s = fontStacks(style);
      out[style] = { display: s.display, body: s.body, data: s.data, traits: STYLE_FONTS[style].traits };
    }
    return out;
  })()`);
  for (const style of ['spectrum', 'standard', 'soft', 'glass', 'editorial']) {
    const s = res[style];
    assert.ok(s.display.length > 20, style + ' 缺展示字体栈');
    assert.ok(s.body.length > 20, style + ' 缺正文字体栈');
    assert.ok(s.data.includes('monospace') || s.data.includes('ui-monospace'), style + ' 数据字体需可回退到等宽');
    assert.ok(s.traits && s.traits.length > 8, style + ' 缺字形特征描述');
    // 中文字体必须显式出现在栈里，不能只依赖系统默认
    assert.ok(/PingFang SC|Songti SC|Microsoft YaHei|Hiragino Sans GB|Noto/.test(s.body), style + ' 中文正文栈缺中文字体');
    assert.ok(/sans-serif|serif/.test(s.body), style + ' 中文正文栈缺通用回退');
  }
  // 书卷用衬线中文字形，其余用无衬线；不为凑数强上五套字体
  assert.ok(res.editorial.body.includes('Songti SC') && res.editorial.body.includes('serif'));
  assert.ok(res.standard.body.includes('PingFang SC') && res.standard.body.includes('sans-serif'));
  assert.ok(!res.standard.body.includes('Songti SC'));
});

test('排版角色覆盖字体、字重、字号、行高、字距、行宽与换行策略', () => {
  const roles = run('TYPE_ROLES');
  for (const key of ['display', 'title', 'section', 'body', 'label', 'meta', 'data']) {
    const r = roles[key];
    assert.ok(r, '缺角色 ' + key);
    assert.ok(r.font && r.weight && r.size && r.leading && r.tracking && r.measure && r.wrap, key + ' 角色字段不完整');
    assert.ok(r.label, key + ' 缺中文名称');
  }
  // 正文行宽按全角字控制，不是英文 ch
  const profile = run("resolveDesignProfile({mode:'read'})");
  assert.equal(profile.surface.proseMeasure, '34em');
  assert.ok(Number(profile.surface.bodyLeading) >= 1.8, '中文阅读行高应比拉丁正文更松');
});

test('字体进入所有出口：字体 token、@font-face、排版角色类与提示词', () => {
  run(`var sys=computeSystem(hexToOklch('#2563eb'),{design:{style:'editorial',mode:'read'}});
    var scale=generateSpaceScale(4);var tokens=buildTokenMap(sys,scale,generateSpaceSemanticTokens(scale,sys.design));`);
  const fontTokens = run("tokens.filter(t=>t.group==='font').map(t=>t.name)");
  assert.deepEqual([...fontTokens].sort(), ['--font-body', '--font-cn-body', '--font-cn-display', '--font-data', '--font-display', '--font-latin-display']);

  const css = run('buildCSSExport(sys,tokens)');
  assert.ok(css.includes('@font-face'));
  assert.ok(css.includes('Noto Serif SC'));
  assert.ok(css.includes('.ce-type-display'));
  assert.ok(css.includes('.ce-type-data'));
  assert.ok(css.includes('tabular-nums'));
  assert.ok(css.includes('--font-display:'));

  const prompt = run('buildStylePromptExport(tokens,sys)');
  assert.ok(prompt.includes('## 字体与中文排版'));
  assert.ok(prompt.includes('tablular-nums') || prompt.includes('tabular-nums'));
  assert.ok(prompt.includes('中文行宽'));

  const json = JSON.parse(run('buildJSONTokens(tokens,sys)'));
  assert.ok(json.fonts.stacks.body.includes('Songti SC'));
  assert.ok(json.fonts.roles.body.leading);
  assert.equal(json.fonts.optional['Noto Serif SC'].license, 'OFL-1.1');

  const comp = run('buildComponentCSSExport(sys)');
  assert.ok(comp.includes('@font-face'));
  assert.ok(comp.includes('.ce-type-role') || comp.includes('.ce-type-body'));
});

test('字体栈可移植：以通用族收尾，且含跨平台中文字体，缺字不会溢出', () => {
  const res = run(`(() => {
    const out = [];
    for (const style of Object.keys(DESIGN_STYLES)) {
      const s = fontStacks(style);
      ['display', 'body', 'data'].forEach(role => {
        const stack = s[role];
        if (!/(sans-serif|serif|monospace)\\s*$/.test(stack)) out.push(style + ' ' + role + ' 未以通用族收尾');
        if (role !== 'data' && !/Microsoft YaHei|Noto Sans SC|Noto Serif SC/.test(stack)) out.push(style + ' ' + role + ' 缺跨平台中文回退');
        if (role === 'data' && !/monospace/.test(stack)) out.push(style + ' data 缺等宽回退');
      });
    }
    return out;
  })()`);
  assert.deepEqual([...res], []);
});

test('操作页面不把展示字体带进标签与数据', () => {
  const res = run(`(() => {
    const p = resolveDesignProfile({mode:'operate'});
    const css = buildModeCSS(p, generateSpaceScale(4));
    return { displayOverride: css.includes('[data-ce-mode="operate"] { --ce-display: var(--ce-body); --ce-display-weight: 650; --ce-display-tracking: 0em; }'), hasDataRole: css.includes('tabular-nums'), titleSize: p.surface.titleSize };
  })()`);
  assert.equal(res.displayOverride, true);
  assert.equal(res.hasDataRole, true);
  assert.equal(res.titleSize, '1.25rem');
});
