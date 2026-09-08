/* ============================================================
   COLOR ENGINE EXPORT — Token 导出（CSS / 组件 / 风格提示词 / Tailwind / JSON）
   依赖：color-math.js, color-engine-core.js, color-engine-demo.js
   ============================================================ */

let currentExportFormat = 'css';
let _lastExport = null;

function setExportFormat(fmt, btn) {
  currentExportFormat = fmt;
  const btns = document.querySelectorAll('#export-toggle .theme-toggle-btn');
  btns.forEach(b => b.classList.toggle('active', b.dataset.val === fmt));
  if (_lastExport) renderExport(_lastExport.sys, _lastExport.tokens);
}

function renderExport(sys, tokens) {
  _lastExport = { sys, tokens };
  const codeEl = document.getElementById('css-code');
  if (currentExportFormat === 'tailwind') {
    codeEl.textContent = buildTailwindConfig(tokens, sys);
  } else if (currentExportFormat === 'json') {
    codeEl.textContent = buildJSONTokens(tokens, sys);
  } else if (currentExportFormat === 'component') {
    codeEl.textContent = buildComponentCSSExport(sys);
  } else if (currentExportFormat === 'prompt') {
    codeEl.textContent = buildStylePromptExport(tokens, sys);
  } else {
    codeEl.textContent = buildCSSExport(sys, tokens);
  }
}

// 所有格式消费同一设计结果。品牌固定，用途控制尺度，需求侧决定业务和页面拓扑。
const TOKEN_GROUP_LABELS = {
  accent: '强调色', neutral: '中性色', state: '交互态', secondary: '辅助色',
  functional: '功能色', elevation: '阴影与层级', radius: '形状', typography: '排版',
  surface: '页面用途', region: '区域配色', font: '字体', 'space-scale': '间距阶梯', 'space-semantic': '间距语义'
};
const TOKEN_GROUP_ORDER = Object.keys(TOKEN_GROUP_LABELS);

function exportSystem(sys) {
  return sys || (_lastExport && _lastExport.sys);
}

function buildStylePromptExport(tokens, sys) {
  sys = exportSystem(sys);
  const d = sys.design;
  const lines = [
    '# Web 设计上下文',
    '将本上下文与需求侧提供的业务需求一起使用。业务、页面数量、内容、功能与事实以需求为准；示例品牌和示例数据不属于需求。',
    '',
    '## 品牌共性',
    '- 风格：' + d.identity.name + '。' + d.identity.character,
    '- 表面语言：' + d.identity.material,
    '- 形状：' + d.identity.radius.join(' / ') + '；同类组件全站一致。',
    '- ' + d.precedence,
    '- 页面拓扑、内容顺序、主视觉表现形式由真实任务推导；不要机械复刻示例业务或强制双栏 Hero。',
    '',
    '## 自动判断页面用途',
    '先根据每页的主要任务选择下列用途。列表、表单、弹层继承所属页面用途。混合页面以主要任务为准，局部表达保持明确边界。',
    '当前预览：' + d.surface.name + '；其他页面不必采用同一用途。',
    '色彩策略：' + (d.strategySource === 'user' ? '用户明确选择“' + DESIGN_STRATEGIES[d.strategy].name + '”，各用途都保留此选择并适配区域。' : '未固定，按每页用途采用其默认策略。'),
    ''
  ];
  Object.entries(DESIGN_MODES).forEach(([mode, m]) => {
    const p = resolveDesignProfile({ ...d, mode, strategyExplicit: d.strategySource === 'user' });
    lines.push('### ' + mode + ' / ' + m.name,
      '- 目的：' + m.purpose,
      '- 布局：' + m.layout,
      '- 密度：' + m.density,
      '- 色彩：' + m.color + ' 当前适用策略：' + DESIGN_STRATEGIES[p.strategy].name + '。',
      '- 动效：' + m.motion,
      '- 显示标题 ' + m.displaySize + '；页面标题 ' + m.titleSize + '；正文 ' + m.bodySize + ' / ' + m.bodyLeading + '；正文行宽 ' + m.proseMeasure + '。',
      '- 页面根节点使用 data-ce-mode="' + mode + '"。', '');
  });
  const regionKinds = Object.keys((sys.regions || {themes:{light:{}}}).themes.light);
  lines.push('## 区域配色',
    '- 区域角色：brand（品牌主区域）、auxiliary（辅助内容区域）、canvas（画布本身）。区域类：' + (regionKinds.map(k => '.ce-region-' + k).join('、') || '当前策略不铺区域') + '。',
    '- 把区域类放在页面根或整块区块上；进入区域后，按钮、输入框、链接、边框与焦点环自动换成该区域的配对颜色，不需要为区域内组件另写一套样式。',
    '- 当前策略：' + DESIGN_STRATEGIES[d.strategy].name + '。' + (sys.regions ? sys.regions.areaNote : ''),
    '- 区域位置、面积和形状由内容重要性决定，不固定拓扑；不要给每个面板都上色，也不要用颜色数量代替层次。',
    '- 面积比例是策略建议而非硬指标：营销首屏的品牌区域可以占较大面积，工作台只让承担重点内容的区域上色，阅读页面保持低干扰。',
    '- 主行动必须与所在区域背景可分辨：品牌背景上用区域行动色，不要用与背景同色的品牌按钮。',
    '- 功能色（成功、警告、错误、信息）保持语义，不当作分区或装饰颜色；品牌装饰色也不要解释成状态。',
    '- 区域内文字、次要文字、边框与焦点环成对使用；亮暗主题各自生成层次，不机械反转。',
    '');
  const f = STYLE_FONTS[d.style];
  const stacks = fontStacks(d.style);
  lines.push('## 字体与中文排版',
    '- 字体角色：中文展示、中文正文、拉丁展示、数字数据。同一字体可以承担多个角色；不要求五种风格各用一套字体。',
    '- 当前风格字形：' + f.traits,
    '- 展示字体：`' + stacks.display + '`',
    '- 中文正文：`' + stacks.body + '`',
    '- 数据与代码：`' + stacks.data + '`，配合 font-variant-numeric: tabular-nums。',
    '- 排版角色：' + Object.values(TYPE_ROLES).map(r => r.label).join(' / ') + '；字号、行高、字距、行宽见下方字体与用途 token。',
    '- 中文行宽：正文按全角字数控制（' + d.surface.proseMeasure + '），不直接套用英文 65–75ch；阅读页面优先保证行长与段落节奏。',
    '- 换行与标点：标题平衡断行、不产生单字末行；正文按字换行、行末不孤悬标点；不用写死 <br> 维持布局。',
    '- 缺字、加载失败与离线：按字体栈的回退顺序落到平台原生中文字体（PingFang SC / Microsoft YaHei / Songti SC），标题不因缺字溢出。',
    '- 可选品牌展示字体随下方 @font-face 提供（OFL-1.1）；自托管前不影响布局与阅读。',
    '');
  lines.push('## 实施与验证',
    '- 保持品牌、颜色语义和组件语言。优先使用角色变量；内容需要的构图、展示尺寸可在用途范围内推导，新增共性规则须统一命名。',
    '- 首先确定阅读顺序、主要内容的表现形式和面积，再实现；重要性与视觉重量对应。',
    '- 有浏览器能力时检查实际首屏和窄屏：主次、字形、区域配色、长文本与交互。修正主要问题后再扩展其余页面；无渲染能力时如实标明未验证。',
    '- 图形、照片与作品必须服务业务内容；不得虚构商业事实，合成演示明确标注。',
    '- 交互完整实现默认、悬停、焦点、按压、禁用、加载、错误和空状态。尊重键盘、缩放和减少动态效果偏好。',
    '', '## 设计变量');
  TOKEN_GROUP_ORDER.forEach(group => {
    const items = tokens.filter(t => t.group === group);
    if (!items.length) return;
    lines.push('### ' + TOKEN_GROUP_LABELS[group]);
    items.forEach(t => lines.push('- `' + t.name + '`: ' + t.light + (t.dark && t.dark !== '—' && t.dark !== t.light ? '（亮） / ' + t.dark + '（暗）' : '') + ' — ' + t.usage));
  });
  lines.push('', '## 可直接使用的主题与用途 CSS',
    '外层使用 data-theme="dark" 切换暗色；页面根使用 ce-surface 和对应 data-ce-mode。组件样式可使用单独的“组件 CSS”导出。',
    '```css', buildCSSExport(sys, tokens), '```');
  return lines.join('\n');
}

function buildComponentCSSExport(sys) {
  sys = exportSystem(sys);
  const d = sys.design;
  const kinds = Object.keys((sys.regions || {themes:{light:{}}}).themes.light);
  return '/* ' + d.identity.name + '组件参考。搭配 CSS 变量导出。\n' +
    '   页面根：class="ce-surface ce-style-' + d.style + '" data-ce-mode="用途"；业务结构由需求决定。\n\n' +
    '   同一控件在普通区域与彩色区域：区域类重映射语义变量，按钮、输入框、链接自动适配。\n' +
    '   <section class="ce-panel">…<button class="ce-btn ce-btn-accent">主操作</button></section>\n' +
    (kinds.length ? '   <section class="ce-panel ce-region-' + kinds[0] + '">…<button class="ce-btn ce-btn-accent">主操作</button></section>\n' : '') +
    '   可用区域类：' + (kinds.map(k => '.ce-region-' + k).join('、') || '当前策略不铺区域') + ' */\n' +
    buildDemoCSS() + demoStyleCSS(d.style) + buildModeCSS(d, generateSpaceScale(spaceBaseUnit)) + buildRegionCSS(sys.regions) + buildFontCSS(d);
}

function buildCSSExport(sys, tokens) {
  const lines = ['/* Color Engine：共享品牌、双主题、四种页面用途。 */', ':root {'];
  TOKEN_GROUP_ORDER.forEach(group => {
    const items = tokens.filter(t => t.group === group);
    if (!items.length) return;
    lines.push('  /* ' + TOKEN_GROUP_LABELS[group] + ' */');
    items.forEach(t => lines.push('  ' + t.name + ': ' + t.light + '; /* ' + t.usage + ' */'));
  });
  lines.push('}', '[data-theme="dark"] {', tokenDeclarations(tokens, 'dark'), '}',
    buildModeCSS(sys.design, generateSpaceScale(spaceBaseUnit)), buildRegionCSS(sys.regions), buildFontCSS(sys.design));
  return lines.join('\n');
}

// Tailwind 3.x theme.extend；主题和用途选择器由配套 CSS 提供。
function buildTailwindConfig(tokens, sys) {
  const colors = {}, spacing = {}, borderRadius = {}, fontSize = {}, boxShadow = {};
  tokens.forEach(t => {
    if (t.name.startsWith('--color-')) colors[t.name.slice(8)] = 'var(' + t.name + ')';
    else if (t.name.startsWith('--region-')) colors[t.name.slice(2)] = 'var(' + t.name + ')';
    else if (t.name.startsWith('--space-')) spacing[t.name.slice(8)] = 'var(' + t.name + ')';
    else if (t.name.startsWith('--radius-')) borderRadius[t.name.slice(9)] = 'var(' + t.name + ')';
    else if (/^--type-.*-size$/.test(t.name)) fontSize[t.name.slice(7, -5)] = 'var(' + t.name + ')';
    else if (t.name.startsWith('--shadow-') && t.name !== '--shadow-color') boxShadow[t.name.slice(9)] = 'var(' + t.name + ')';
  });
  return '/* Tailwind 3.x：同时引入“CSS 变量”导出；data-theme 与 data-ce-mode 由该 CSS 实现。 */\n' +
    'module.exports = ' + JSON.stringify({ theme: { extend: { colors, spacing, borderRadius, fontSize, boxShadow } } }, null, 2) + ';';
}

// 项目交换格式：显式携带主题、用途与品牌配置，不伪装为只有颜色的标准 DTCG 文件。
function buildJSONTokens(tokens, sys) {
  sys = exportSystem(sys);
  const byName = Object.fromEntries(tokens.map(t => [t.name, { light: t.light, dark: t.dark === '—' ? t.light : t.dark, group: t.group, description: t.usage }]));
  const regionSets = sys.regions ? {
    plan: sys.regions.plan,
    area: sys.regions.areaNote,
    sets: Object.fromEntries(['light', 'dark'].map(theme => [theme, Object.fromEntries(
      Object.entries(sys.regions.themes[theme]).map(([kind, set]) => [kind, {
        bg: set.bg.hex, text: set.text.hex, textSecondary: set.textSecondary.hex, border: set.border.hex,
        surface: set.surface.hex, action: set.action.hex, actionText: set.actionText.hex, focus: set.focus.hex,
        functional: Object.fromEntries(Object.entries(set.functional).map(([k, v]) => [k, v.hex]))
      }])
    )]))
  } : null;
  const fonts = {
    traits: (STYLE_FONTS[sys.design.style] || STYLE_FONTS.spectrum).traits,
    stacks: fontStacks(sys.design.style),
    roles: Object.fromEntries(Object.entries(TYPE_ROLES).map(([k, r]) => [k, { label: r.label, font: r.font, weight: r.weight, size: r.size, leading: r.leading, tracking: r.tracking, measure: r.measure, wrap: r.wrap }])),
    optional: OPTIONAL_WEBFONTS
  };
  return JSON.stringify({ format: 'color-engine-design-context', version: 1, design: sys.design, regions: regionSets, fonts: fonts,
    modes: Object.fromEntries(Object.keys(DESIGN_MODES).map(mode => {
      const profile = resolveDesignProfile({ ...sys.design, mode, strategyExplicit: sys.design.strategySource === 'user' });
      return [mode, { profile, tokens: modeTokenValues(profile, generateSpaceScale(spaceBaseUnit)) }];
    })), tokens: byName }, null, 2);
}
