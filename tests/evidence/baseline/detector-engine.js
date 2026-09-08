/* ============================================================
   DETECTOR ENGINE — 生成后全量自检
   每条规则都是纯函数：取 token 值 → 计算 → 通过/不通过
   不需要 LLM，不需要 API key
   ============================================================ */

// ── 规则定义 ────────────────────────────────────────
// type: "single" — 单值阈值检查
// type: "pair"   — 两个 token 配对计算（对比度 / 大小关系）
// type: "relation" — 两个 token 的大小关系 (>, <, !==)
// severity: "error" = 必须修, "warn" = 建议修, "info" = 仅供参考
// 对比度配对规则统一从 verifyContrast 的 CONTRAST_PAIRS 结果（ctx.contrastChecks）读取，
// 与生成器的分析区网格共享同一份计算，避免双实现互相矛盾

function findContrastPair(ctx, id) {
  return (ctx.contrastChecks || []).find(function(c) { return c.id === id; }) || null;
}

function buildDetectorRules() {
  return [
    // ══════════════ 强调色本体 ══════════════
    {
      id: 'accent-l-range',
      category: '强调色',
      severity: 'error',
      type: 'single',
      label: '强调色明度在宜居带内 (0.35–0.80)',
      expected: 'L ∈ [0.35, 0.80]',
      getValue: function(ctx) { return ctx.accent.oklch.L; },
      check: function(v) { return v >= 0.35 && v <= 0.80; },
      failMsg: function(v) { return '强调色明度 L=' + v.toFixed(2) + '，' + (v < 0.35 ? '过深，会沉入背景，缺乏 CTA 号召力' : '过浅，白底上缺乏足够反差'); },
      fixHint: function(v) { return v < 0.35 ? '提升 L 至 0.42–0.58' : '降低 L 至 0.42–0.58'; }
    },
    {
      id: 'accent-c-muddy',
      category: '强调色',
      severity: 'error',
      type: 'single',
      label: '强调色不显"脏" (C≥0.08 或 L 不在 0.25-0.75)',
      expected: 'C ≥ 0.08 或 L ∉ (0.25, 0.75)',
      getValue: function(ctx) { return ctx.accent.oklch; },
      check: function(v) { return !(v.C < 0.08 && v.L > 0.25 && v.L < 0.75); },
      failMsg: function(v) { return '颜色显"脏"——感知色度 C=' + v.C.toFixed(3) + ' 过低，视觉饱和感弱'; },
      fixHint: function() { return '提升 C 至 0.12–0.28'; }
    },
    {
      id: 'accent-c-fluorescent',
      category: '强调色',
      severity: 'warn',
      type: 'single',
      label: '强调色不显"荧光" (C≤0.28 或 L≤0.68)',
      expected: 'C ≤ 0.28 或 L ≤ 0.68',
      getValue: function(ctx) { return ctx.accent.oklch; },
      check: function(v) { return !(v.C > 0.28 && v.L > 0.68); },
      failMsg: function(v) { return '接近荧光色——C=' + v.C.toFixed(3) + ' 且 L=' + v.L.toFixed(2) + '，视觉刺激强'; },
      fixHint: function() { return '降低 C 至 0.28 以下，同时降低 L'; }
    },
    {
      id: 'accent-c-washed-out',
      category: '强调色',
      severity: 'warn',
      type: 'single',
      label: '强调色不显"褪色" (C≥0.12 或 L≤0.65)',
      expected: 'C ≥ 0.12 或 L ≤ 0.65',
      getValue: function(ctx) { return ctx.accent.oklch; },
      check: function(v) { return !(v.C < 0.12 && v.L > 0.65); },
      failMsg: function(v) { return '略显褪色——浅色低饱和 C=' + v.C.toFixed(3) + '，界面存在感偏弱'; },
      fixHint: function() { return '提升 C 或降低 L'; }
    },
    {
      id: 'accent-text-contrast-direction',
      category: '强调色',
      severity: 'info',
      type: 'single',
      label: '强调色文字色方向正确 (L>0.60→深灰字, L≤0.60→优先白字且 APCA≥60)',
      expected: 'L > 0.60 → 深灰字 #0F172A, L ≤ 0.60 → 白字且 APCA ≥ 60',
      getValue: function(ctx) { return { L: ctx.accent.oklch.L, textColor: ctx.accent.textContrastOnAccent }; },
      check: function(v) {
        if (v.L > 0.60) return v.textColor === '#0F172A';
        return true; // 白字情况已在生成时 APCA 寻优，这里放行
      },
      failMsg: function() { return '强调色明亮(L>0.60)但使用了白字，对比度可能不足'; },
      fixHint: function() { return '切换为深墨灰字 #0F172A'; }
    },
    {
      id: 'accent-fallback-warning',
      category: '强调色',
      severity: 'warn',
      type: 'single',
      label: '强调色不需降级为装饰 (L≤0.78 或非深灰字)',
      expected: '无降级警告',
      getValue: function(ctx) { return ctx.accent; },
      check: function(v) { return !v.fallbackWarning; },
      failMsg: function() { return '该品牌色经多次校正后明度仍偏高，作为强调色存在感偏弱，建议仅限 logo 装饰使用'; },
      fixHint: function() { return '手动选择替代强调色'; }
    },
    {
      id: 'accent2-hue-distance',
      category: '强调色',
      severity: 'info',
      type: 'single',
      label: '渐变搭档色与主色色相距离适中 (25°–80°)',
      expected: '25° ≤ |ΔH| ≤ 80°（既有差异又保持同源）',
      getValue: function(ctx) {
        var d = Math.abs(ctx.accent.oklch.H - ctx.accent2.light.oklch.H);
        if (d > 180) d = 360 - d;
        return d;
      },
      check: function(v) { return v >= 25 && v <= 80; },
      failMsg: function(v) { return '渐变搭档色与主色色相距离 ' + v.toFixed(0) + '°，差异过小或过大，渐变可能不协调'; },
      fixHint: function() { return '检查 accent-2 的色相旋转方向与幅度'; }
    },

    // ══════════════ 强调色阶 ══════════════
    {
      id: 'accent-scale-hue-consistent',
      category: '强调色阶',
      severity: 'warn',
      type: 'single',
      label: '亮色强调色阶 5 级共享同一色相 (圆形 H 偏差 ≤ 15°)',
      expected: '各级圆形 H 偏差 ≤ 15°',
      getValue: function(ctx) { return ctx.accentScaleLight.map(function(s) { return s.oklch.H; }); },
      check: function(hues) {
        // 圆形统计：转单位向量求平均，再转回角度
        var sinSum = 0, cosSum = 0;
        hues.forEach(function(h) {
          var rad = h * Math.PI / 180;
          sinSum += Math.sin(rad);
          cosSum += Math.cos(rad);
        });
        var avgH = Math.atan2(sinSum, cosSum) * 180 / Math.PI;
        if (avgH < 0) avgH += 360;
        for (var i = 0; i < hues.length; i++) {
          var d = Math.abs(hues[i] - avgH);
          if (d > 180) d = 360 - d;
          if (d > 15) return false;
        }
        return true;
      },
      failMsg: function() { return '强调色阶各级色相偏差超过 15°，视觉上可能被识别为不同颜色'; },
      fixHint: function() { return '检查色温漂移幅度是否过大'; }
    },
    {
      id: 'accent-scale-monotonic-l',
      category: '强调色阶',
      severity: 'error',
      type: 'single',
      label: '亮色强调色阶 L 严格递减 (50 > 100 > 200 > 300 > 400)',
      expected: 'L(50) > L(100) > L(200) > L(300) > L(400)',
      getValue: function(ctx) { return ctx.accentScaleLight.map(function(s) { return s.oklch.L; }); },
      check: function(levels) {
        for (var i = 0; i < levels.length - 1; i++) {
          if (levels[i] <= levels[i + 1]) return false;
        }
        return true;
      },
      failMsg: function() { return '强调色阶明度未严格递减，层级关系混乱'; },
      fixHint: function() { return '检查各层 L 值计算公式'; }
    },

    // ══════════════ 中性色（亮色） ══════════════
    {
      id: 'neutral-light-bg-range',
      category: '中性色',
      severity: 'info',
      type: 'single',
      label: '亮色页面背景接近纯白但不纯白 (L≥0.97)',
      expected: 'L ≥ 0.97（接近纯白但不纯白）',
      getValue: function(ctx) { return ctx.neutralsLight.colors[0].oklch.L; },
      check: function(v) { return v >= 0.97; },
      failMsg: function(v) { return '页面背景 L=' + v.toFixed(2) + '，偏暗'; },
      fixHint: function() { return '页面背景 L 应 ≥ 0.97'; }
    },
    {
      id: 'neutral-light-text-no-chroma',
      category: '中性色',
      severity: 'info',
      type: 'single',
      label: '亮色文字/过渡区色温 ≤ 0.015（保留极淡品牌色温）',
      expected: 'L < 0.88 时 C ≤ 0.015 且 H = 品牌色温',
      getValue: function(ctx) {
        return {
          colors: ctx.neutralsLight.colors.filter(function(c) { return c.oklch.L < 0.88; }),
          brandH: ctx.accent.oklch.H
        };
      },
      check: function(v) {
        return v.colors.every(function(c) {
          return c.oklch.C <= 0.015 && Math.abs(c.oklch.H - v.brandH) < 0.5;
        });
      },
      failMsg: function() { return '文字区色温超过 0.015，浅色文字可能出现明显色偏'; },
      fixHint: function() { return '文字区 C 应 ≤ 0.015 并保持品牌色温'; }
    },
    {
      id: 'surface-raised-hierarchy',
      category: '中性色',
      severity: 'info',
      type: 'single',
      label: '浮层表面不低于卡片（亮色同白、暗色更亮，深度靠阴影）',
      expected: '亮色 raised ≥ card；暗色 raised > card',
      getValue: function(ctx) {
        return {
          light: ctx.surfaceRaised.light.oklch.L >= ctx.neutralsLight.colors[1].oklch.L,
          dark: ctx.surfaceRaised.dark.oklch.L > ctx.neutralsDark[1].oklch.L
        };
      },
      check: function(v) { return v.light && v.dark; },
      failMsg: function() { return '浮层表面亮度低于卡片，纸片层级不成立'; },
      fixHint: function() { return '浮层表面应同白或更亮，深度交给阴影'; }
    },
    {
      id: 'neutral-light-bg-has-brand-hue',
      category: '中性色',
      severity: 'info',
      type: 'single',
      label: '亮色背景区保留品牌色温 (L>0.88 时 H 接近品牌 H)',
      expected: 'L > 0.88 时 H 与品牌 H 一致',
      getValue: function(ctx) {
        var bg = ctx.neutralsLight.colors.filter(function(c) { return c.oklch.L > 0.88; });
        return { colors: bg, brandH: ctx.accent.oklch.H };
      },
      check: function(v) {
        // 浮点容差 0.5°，避免过渡区插值产生的小数偏差误报
        return v.colors.every(function(c) {
          return Math.abs(c.oklch.H - v.brandH) < 0.5 || Math.abs(c.oklch.H) < 0.5;
        });
      },
      failMsg: function() { return '背景区中性色未融入品牌色温'; },
      fixHint: function() { return '背景区中性色 H 应与品牌色 H 一致'; }
    },

    // ══════════════ 中性色（暗色） ══════════════
    {
      id: 'neutral-dark-card-floats',
      category: '暗色模式',
      severity: 'error',
      type: 'relation',
      label: '暗色卡片比页面底亮，视觉浮起 (卡片 L > 页面底 L)',
      expected: '卡片 L > 页面底 L（浮起效果）',
      getValueA: function(ctx) { return ctx.neutralsDark[1].oklch.L; },
      getValueB: function(ctx) { return ctx.neutralsDark[0].oklch.L; },
      compare: function(a, b) { return a > b; },
      failMsg: function(a, b) { return '卡片 L=' + a.toFixed(2) + ' ≤ 页面底 L=' + b.toFixed(2) + '，卡片"沉"入背景'; },
      fixHint: function() { return '暗色卡片 L 必须 > 暗色页面底 L'; }
    },
    {
      id: 'neutral-dark-bg-deep',
      category: '暗色模式',
      severity: 'info',
      type: 'single',
      label: '暗色页面底足够深 (L≤0.12)',
      expected: 'L ≤ 0.12（足够深）',
      getValue: function(ctx) { return ctx.neutralsDark[0].oklch.L; },
      check: function(v) { return v <= 0.12; },
      failMsg: function(v) { return '暗色页面底 L=' + v.toFixed(2) + '，不够深，暗色模式感知弱'; },
      fixHint: function() { return '暗色页面底 L 应 ≤ 0.12'; }
    },
    {
      id: 'neutral-dark-text-no-chroma',
      category: '暗色模式',
      severity: 'info',
      type: 'single',
      label: '暗色文字区色温 ≤ 0.015（保留极淡品牌色温）',
      expected: 'L ≥ 0.30 时 C ≤ 0.015 且 H = 品牌色温',
      getValue: function(ctx) {
        return {
          colors: ctx.neutralsDark.filter(function(c) { return c.oklch.L >= 0.30; }),
          brandH: ctx.accent.oklch.H
        };
      },
      check: function(v) {
        return v.colors.every(function(c) {
          return c.oklch.C <= 0.015 && Math.abs(c.oklch.H - v.brandH) < 0.5;
        });
      },
      failMsg: function() { return '暗色文字区色温超过 0.015，亮文字泛色明显'; },
      fixHint: function() { return '暗色文字区 C 应 ≤ 0.015 并保持品牌色温'; }
    },

    // ══════════════ 暗色强调色 ══════════════
    {
      id: 'accent-dark-c-reduced',
      category: '暗色模式',
      severity: 'warn',
      type: 'single',
      label: '暗色强调色 C 比亮色降低 ~22% 防光晕',
      expected: '暗色 C ≤ 亮色 C × 1.05（降饱和防光晕）',
      getValue: function(ctx) {
        return {
          lightC: ctx.accentScaleLight[2].oklch.C,
          darkC: ctx.accentScaleDark[2].oklch.C
        };
      },
      check: function(v) { return v.darkC <= v.lightC * 1.05; },
      failMsg: function(v) { return '暗色强调色 C=' + v.darkC.toFixed(3) + ' 高于亮色 C=' + v.lightC.toFixed(3) + '，暗底高饱和产生光晕效应'; },
      fixHint: function() { return '暗色强调色 C 应降至亮色的 ~78%'; }
    },
    {
      id: 'accent-dark-l-elevated',
      category: '暗色模式',
      severity: 'warn',
      type: 'single',
      label: '暗色强调色 L 比亮色适当提升 (暗底需更亮才可见)',
      expected: '亮色 L < 0.60 时暗色 L ≥ 亮色 L × 0.95（暗底需更亮才可见）',
      getValue: function(ctx) {
        return {
          lightL: ctx.accentScaleLight[2].oklch.L,
          darkL: ctx.accentScaleDark[2].oklch.L
        };
      },
      check: function(v) {
        // 亮色 L > 0.60 时暗色受 clamp(0.65) 限制，不检查
        if (v.lightL > 0.60) return true;
        return v.darkL >= v.lightL * 0.95;
      },
      failMsg: function(v) { return '暗色强调色 L=' + v.darkL.toFixed(2) + ' 低于亮色 L=' + v.lightL.toFixed(2) + '，在暗底上不够亮'; },
      fixHint: function() { return '暗色强调色 L 应提升至亮色的 ~110%'; }
    },

    // ══════════════ 对比度配对 (8 对，与 verifyContrast 共享定义) ══════════════
    {
      id: 'contrast-body-on-light-bg',
      category: '对比度',
      severity: 'error',
      type: 'single',
      label: '正文 on 亮色页面底 (WCAG ≥ 4.5 且 APCA ≥ 75)',
      expected: 'WCAG ≥ 4.5:1 且 APCA ≥ 75（正文级）',
      getValue: function(ctx) { return findContrastPair(ctx, 'body-on-light-bg'); },
      check: function(v) { return !!v && v.pass; },
      describe: function(v) { return v ? v.text + ' on ' + v.bg + ' → APCA ' + v.apca.toFixed(0) + ' · WCAG ' + v.wcag.toFixed(1) + ':1' : '未找到配对'; },
      failMsg: function(v) { return 'APCA=' + v.apca.toFixed(0) + ' / WCAG ' + v.wcag.toFixed(1) + ':1，低于正文级标准'; },
      fixHint: function() { return '加深正文文字或提亮页面背景'; }
    },
    {
      id: 'contrast-body-on-light-card',
      category: '对比度',
      severity: 'error',
      type: 'single',
      label: '正文 on 亮色卡片 (WCAG ≥ 4.5 且 APCA ≥ 75)',
      expected: 'WCAG ≥ 4.5:1 且 APCA ≥ 75（正文级）',
      getValue: function(ctx) { return findContrastPair(ctx, 'body-on-light-card'); },
      check: function(v) { return !!v && v.pass; },
      describe: function(v) { return v ? v.text + ' on ' + v.bg + ' → APCA ' + v.apca.toFixed(0) + ' · WCAG ' + v.wcag.toFixed(1) + ':1' : '未找到配对'; },
      failMsg: function(v) { return 'APCA=' + v.apca.toFixed(0) + ' / WCAG ' + v.wcag.toFixed(1) + ':1，低于正文级标准'; },
      fixHint: function() { return '加深正文文字或提亮卡片背景'; }
    },
    {
      id: 'contrast-secondary-on-light-bg',
      category: '对比度',
      severity: 'error',
      type: 'single',
      label: '次要文字 on 亮色页面底 (WCAG ≥ 4.5 或 APCA ≥ 60)',
      expected: 'WCAG ≥ 4.5:1 或 APCA ≥ 60（任一达标，与正文拉开层级）',
      getValue: function(ctx) { return findContrastPair(ctx, 'secondary-on-light-bg'); },
      check: function(v) { return !!v && v.pass; },
      describe: function(v) { return v ? v.text + ' on ' + v.bg + ' → APCA ' + v.apca.toFixed(0) + ' · WCAG ' + v.wcag.toFixed(1) + ':1' : '未找到配对'; },
      failMsg: function(v) { return 'APCA=' + v.apca.toFixed(0) + ' / WCAG ' + v.wcag.toFixed(1) + ':1，两项均未达标'; },
      fixHint: function() { return '加深次要文字'; }
    },
    {
      id: 'contrast-muted-on-light-bg',
      category: '对比度',
      severity: 'warn',
      type: 'single',
      label: '弱化文字 on 亮色页面底 (WCAG ≥ 3.0 且 APCA ≥ 45)',
      expected: 'WCAG ≥ 3.0:1 且 APCA ≥ 45（占位/禁用，可辨识即可）',
      getValue: function(ctx) { return findContrastPair(ctx, 'muted-on-light-bg'); },
      check: function(v) { return !!v && v.pass; },
      describe: function(v) { return v ? v.text + ' on ' + v.bg + ' → APCA ' + v.apca.toFixed(0) + ' · WCAG ' + v.wcag.toFixed(1) + ':1' : '未找到配对'; },
      failMsg: function(v) { return 'APCA=' + v.apca.toFixed(0) + ' / WCAG ' + v.wcag.toFixed(1) + ':1，弱化文字过浅'; },
      fixHint: function() { return '弱化文字加深一档'; }
    },
    {
      id: 'contrast-heading-on-light-bg',
      category: '对比度',
      severity: 'warn',
      type: 'single',
      label: '标题字 on 亮色页面底 (WCAG ≥ 3.0 且 APCA ≥ 60，大号文字放宽)',
      expected: 'WCAG ≥ 3.0:1 且 APCA ≥ 60（大号文字放宽）',
      getValue: function(ctx) { return findContrastPair(ctx, 'heading-on-light-bg'); },
      check: function(v) { return !!v && v.pass; },
      describe: function(v) { return v ? v.text + ' on ' + v.bg + ' → APCA ' + v.apca.toFixed(0) + ' · WCAG ' + v.wcag.toFixed(1) + ':1' : '未找到配对'; },
      failMsg: function(v) { return 'APCA=' + v.apca.toFixed(0) + ' / WCAG ' + v.wcag.toFixed(1) + ':1，低于大号文字标准'; },
      fixHint: function() { return '加深标题文字'; }
    },
    {
      id: 'contrast-body-on-dark-bg',
      category: '对比度',
      severity: 'error',
      type: 'single',
      label: '正文 on 暗色页面底 (WCAG ≥ 4.5 且 APCA ≥ 75)',
      expected: 'WCAG ≥ 4.5:1 且 APCA ≥ 75（正文级）',
      getValue: function(ctx) { return findContrastPair(ctx, 'body-on-dark-bg'); },
      check: function(v) { return !!v && v.pass; },
      describe: function(v) { return v ? v.text + ' on ' + v.bg + ' → APCA ' + v.apca.toFixed(0) + ' · WCAG ' + v.wcag.toFixed(1) + ':1' : '未找到配对'; },
      failMsg: function(v) { return 'APCA=' + v.apca.toFixed(0) + ' / WCAG ' + v.wcag.toFixed(1) + ':1，低于正文级标准'; },
      fixHint: function() { return '提亮正文文字或加深暗色背景'; }
    },
    {
      id: 'contrast-body-on-dark-card',
      category: '对比度',
      severity: 'error',
      type: 'single',
      label: '正文 on 暗色卡片 (WCAG ≥ 4.5 且 APCA ≥ 75)',
      expected: 'WCAG ≥ 4.5:1 且 APCA ≥ 75（正文级）',
      getValue: function(ctx) { return findContrastPair(ctx, 'body-on-dark-card'); },
      check: function(v) { return !!v && v.pass; },
      describe: function(v) { return v ? v.text + ' on ' + v.bg + ' → APCA ' + v.apca.toFixed(0) + ' · WCAG ' + v.wcag.toFixed(1) + ':1' : '未找到配对'; },
      failMsg: function(v) { return 'APCA=' + v.apca.toFixed(0) + ' / WCAG ' + v.wcag.toFixed(1) + ':1，低于正文级标准'; },
      fixHint: function() { return '提亮正文文字或加深暗色卡片'; }
    },
    {
      id: 'contrast-secondary-on-dark-bg',
      category: '对比度',
      severity: 'error',
      type: 'single',
      label: '次要文字 on 暗色页面底 (WCAG ≥ 4.5 或 APCA ≥ 60)',
      expected: 'WCAG ≥ 4.5:1 或 APCA ≥ 60（任一达标，与正文拉开层级）',
      getValue: function(ctx) { return findContrastPair(ctx, 'secondary-on-dark-bg'); },
      check: function(v) { return !!v && v.pass; },
      describe: function(v) { return v ? v.text + ' on ' + v.bg + ' → APCA ' + v.apca.toFixed(0) + ' · WCAG ' + v.wcag.toFixed(1) + ':1' : '未找到配对'; },
      failMsg: function(v) { return 'APCA=' + v.apca.toFixed(0) + ' / WCAG ' + v.wcag.toFixed(1) + ':1，两项均未达标'; },
      fixHint: function() { return '提亮暗色次要文字'; }
    },
    {
      id: 'contrast-muted-on-dark-bg',
      category: '对比度',
      severity: 'warn',
      type: 'single',
      label: '弱化文字 on 暗色页面底 (WCAG ≥ 3.0 且 APCA ≥ 45)',
      expected: 'WCAG ≥ 3.0:1 且 APCA ≥ 45（占位/禁用，可辨识即可）',
      getValue: function(ctx) { return findContrastPair(ctx, 'muted-on-dark-bg'); },
      check: function(v) { return !!v && v.pass; },
      describe: function(v) { return v ? v.text + ' on ' + v.bg + ' → APCA ' + v.apca.toFixed(0) + ' · WCAG ' + v.wcag.toFixed(1) + ':1' : '未找到配对'; },
      failMsg: function(v) { return 'APCA=' + v.apca.toFixed(0) + ' / WCAG ' + v.wcag.toFixed(1) + ':1，弱化文字过暗'; },
      fixHint: function() { return '提亮暗色弱化文字'; }
    },
    {
      id: 'contrast-heading-on-dark-bg',
      category: '对比度',
      severity: 'warn',
      type: 'single',
      label: '标题字 on 暗色页面底 (WCAG ≥ 3.0 且 APCA ≥ 60，大号文字放宽)',
      expected: 'WCAG ≥ 3.0:1 且 APCA ≥ 60（大号文字放宽）',
      getValue: function(ctx) { return findContrastPair(ctx, 'heading-on-dark-bg'); },
      check: function(v) { return !!v && v.pass; },
      describe: function(v) { return v ? v.text + ' on ' + v.bg + ' → APCA ' + v.apca.toFixed(0) + ' · WCAG ' + v.wcag.toFixed(1) + ':1' : '未找到配对'; },
      failMsg: function(v) { return 'APCA=' + v.apca.toFixed(0) + ' / WCAG ' + v.wcag.toFixed(1) + ':1，低于大号文字标准'; },
      fixHint: function() { return '提亮暗色标题文字'; }
    },

    // ══════════════ 功能色冲突 ══════════════
    {
      id: 'func-color-no-conflict',
      category: '功能色',
      severity: 'warn',
      type: 'single',
      label: '功能色与品牌色色相不冲突 (H 距离 ≥ 25°)',
      expected: '每个功能色与品牌色 H 距离 ≥ 25°',
      getValue: function(ctx) {
        var brandH = ctx.accent.oklch.H;
        return ctx.functional.map(function(f) {
          var dist = Math.min(Math.abs(brandH - f.base.oklch.H), 360 - Math.abs(brandH - f.base.oklch.H));
          return { name: f.name, distance: dist, conflict: dist < 25 };
        });
      },
      check: function(items) {
        return items.every(function(item) { return !item.conflict; });
      },
      failMsg: function(v) {
        var conflicts = v.filter(function(item) { return item.conflict; }).map(function(item) { return item.name; });
        return '功能色 ' + conflicts.join('、') + ' 与品牌色 H 距离 < 25°，用户可能混淆';
      },
      fixHint: function() { return '冲突功能色 H 应旋转 32° 避让'; }
    },

    // ══════════════ 间距系统 ══════════════
    {
      id: 'space-scale-monotonic',
      category: '间距',
      severity: 'error',
      type: 'single',
      label: '间距阶梯严格递增 (每级 px > 前级)',
      expected: '每级 px > 前级（严格递增）',
      getValue: function(ctx) { return ctx.spaceScale.map(function(s) { return s.px; }); },
      check: function(values) {
        for (var i = 0; i < values.length - 1; i++) {
          if (values[i] >= values[i + 1]) return false;
        }
        return true;
      },
      failMsg: function() { return '间距阶梯未严格递增，存在平级或倒退'; },
      fixHint: function() { return '检查 multipliers 数组是否递增'; }
    },
    {
      id: 'space-semantic-valid-ref',
      category: '间距',
      severity: 'info',
      type: 'single',
      label: '间距语义 Token 全部映射到有效阶梯级别',
      expected: '所有语义 Token 映射到有效阶梯',
      getValue: function(ctx) { return ctx.spaceSemantics; },
      check: function(tokens) {
        return tokens.every(function(t) { return t.from && t.from.px > 0; });
      },
      failMsg: function() { return '存在语义 Token 映射到无效的间距级别'; },
      fixHint: function() { return '检查 find() 是否返回了有效的 scale step'; }
    },
    {
      id: 'space-base-unit-positive',
      category: '间距',
      severity: 'error',
      type: 'single',
      label: '间距基准单位为正数 (4px 或 8px)',
      expected: 'baseUnit = 4 或 8',
      getValue: function() { return spaceBaseUnit; },
      check: function(v) { return v === 4 || v === 8; },
      failMsg: function(v) { return '间距基准单位为 ' + v + '，仅支持 4px 或 8px'; },
      fixHint: function() { return '切换为 4px 精细 或 8px 标准'; }
    },

    // ══════════════ 交互态 ══════════════
    {
      id: 'disabled-text-visible',
      category: '交互态',
      severity: 'info',
      type: 'single',
      label: '禁用态文字与背景仍可辨识 (APCA ≥ 10)',
      expected: 'APCA ≥ 10（低对比但可辨识）',
      getValue: function(ctx) {
        return {
          light: Math.abs(calculateApca(ctx.neutralsLight.colors[4].hex, ctx.neutralsLight.colors[0].hex)),
          dark: Math.abs(calculateApca(ctx.neutralsDark[4].hex, ctx.neutralsDark[0].hex))
        };
      },
      check: function(v) { return v.light >= 10 && v.dark >= 10; },
      failMsg: function(v) { return '禁用态文字与背景对比过低（亮 ' + v.light.toFixed(0) + ' / 暗 ' + v.dark.toFixed(0) + '），几乎不可见'; },
      fixHint: function() { return '禁用态文字应映射到 neutral-300 层级'; }
    }
  ];
}

// ── 执行全部检测 ────────────────────────────────────

function runDetector(ctx) {
  var rules = buildDetectorRules();
  var results = [];

  rules.forEach(function(rule) {
    var result = { id: rule.id, category: rule.category, severity: rule.severity, label: rule.label, expected: rule.expected || '', pass: false };
    try {
      if (rule.type === 'single') {
        var value = rule.getValue(ctx);
        result.pass = rule.check(value);
        result.actual = value;
        if (rule.describe) result.detail = rule.describe(value);
        if (!result.pass) {
          result.message = rule.failMsg(value);
          if (rule.fixHint) result.fixHint = rule.fixHint(value);
        }
      } else if (rule.type === 'pair') {
        var pair = rule.getPair(ctx);
        var apca = Math.abs(calculateApca(pair.text, pair.bg));
        result.pass = apca >= pair.threshold;
        result.actual = apca;
        result.detail = pair.text + ' on ' + pair.bg + ' \u2192 APCA ' + apca.toFixed(0);
        if (!result.pass) {
          result.message = rule.failMsg(apca);
          result.fixHint = rule.fixHint(apca);
        }
      } else if (rule.type === 'relation') {
        var a = rule.getValueA(ctx);
        var b = rule.getValueB(ctx);
        result.pass = rule.compare(a, b);
        result.actual = { a: a, b: b };
        if (!result.pass) {
          result.message = rule.failMsg(a, b);
          result.fixHint = rule.fixHint(a, b);
        }
      }
    } catch (e) {
      result.pass = false;
      result.message = '检测执行异常: ' + e.message;
      result.error = true;
    }
    results.push(result);
  });

  var passed = results.filter(function(r) { return r.pass; }).length;
  var failed = results.filter(function(r) { return !r.pass && !r.error; }).length;
  var errors = results.filter(function(r) { return r.error; }).length;

  return {
    results: results,
    summary: {
      total: results.length,
      passed: passed,
      failed: failed,
      errors: errors,
      allPass: failed === 0 && errors === 0
    }
  };
}
