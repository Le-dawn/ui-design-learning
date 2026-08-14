/* ============================================================
   SPACE ENGINE CORE — 间距阶梯 · 语义映射
   设计原则：网格基线 → 12 级等比阶梯 → 语义 Token
   ============================================================ */

// 全局基准单位 (4px 精细 / 8px 标准)
let spaceBaseUnit = 4;

// ── 间距阶梯生成 ────────────────────────────────────

function generateSpaceScale(baseUnit) {
  let multipliers;

  if (baseUnit <= 4) {
    // 4px 精细模式 — 偶数递增，覆盖常用间距
    multipliers = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24];
  } else {
    // 8px 标准模式 — 严格 8px 网格倍数
    multipliers = [0.5, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15];
  }

  const names = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl'];
  const REM_BASE = 16;

  return multipliers.map((m, i) => {
    const px = Math.round(baseUnit * m);
    const rem = px / REM_BASE;
    return {
      name: 'space-' + names[i],
      px,
      rem: parseFloat(rem.toFixed(3)),
      remStr: Number.isInteger(rem) ? rem + 'rem' : parseFloat(rem.toFixed(3)) + 'rem',
      step: i
    };
  });
}

// ── 语义 Token 映射 ──────────────────────────────────

function generateSpaceSemanticTokens(scale) {
  const find = function(stepName) {
    return scale.find(function(item) { return item.name === stepName; }) || scale[0];
  };

  return [
    { token: '--space-button-padding-x',    from: find('space-md'),   usage: '按钮左右内边距' },
    { token: '--space-button-padding-y',    from: find('space-sm'),   usage: '按钮上下内边距' },
    { token: '--space-input-padding-x',     from: find('space-md'),   usage: '输入框左右内边距' },
    { token: '--space-input-padding-y',     from: find('space-sm'),   usage: '输入框上下内边距' },
    { token: '--space-card-padding',        from: find('space-lg'),   usage: '卡片内边距' },
    { token: '--space-card-gap',            from: find('space-md'),   usage: '卡片间水平间距' },
    { token: '--space-section-gap',         from: find('space-3xl'),  usage: '大区块垂直间距' },
    { token: '--space-container-padding',   from: find('space-lg'),   usage: '页面容器左右留白' },
    { token: '--space-inline-gap',          from: find('space-sm'),   usage: '行内元素横向间距 (gap)' },
    { token: '--space-stack-gap',           from: find('space-md'),   usage: '堆叠元素纵向间距' },
    { token: '--space-icon-size-sm',        from: find('space-md'),   usage: '小图标尺寸' },
    { token: '--space-icon-size-md',        from: find('space-xl'),   usage: '中图标尺寸' },
    { token: '--space-icon-size-lg',        from: find('space-3xl'),  usage: '大图标尺寸' },
    { token: '--space-focus-ring-offset',   from: find('space-xs'),   usage: '聚焦环外偏移量' },
  ];
}

// ── 切换基准单位 ────────────────────────────────────

function setSpaceBaseUnit(val, btn) {
  spaceBaseUnit = val;

  // 更新按钮高亮
  var btns = document.querySelectorAll('#base-unit-toggle .theme-toggle-btn');
  btns.forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');

  // 自动重新生成（静默：不滚动、不重置预览主题）
  if (typeof generate === 'function') generate(true);
}
