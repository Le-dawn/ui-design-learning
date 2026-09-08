/* 品牌语言与页面用途：纯配置/纯解析。示例业务不进入设计契约。 */
const DESIGN_STYLES = {
  spectrum: { name: '光谱', character: '清晰的仪器刻度、精确的线条和数据对齐', radius: ['3px', '6px', '6px'], material: '薄边界和少量偏移阴影；结构由清晰分组承担', display: '"Avenir Next", "Bahnschrift", "PingFang SC", sans-serif' },
  standard: { name: '标准', character: '清楚、可信、熟悉的产品界面', radius: ['8px', '12px', '12px'], material: '平静表面、适中圆角；层次只在需要区分内容时出现', display: '-apple-system, "Segoe UI", "PingFang SC", sans-serif' },
  soft: { name: '暖糖', character: '饱满的字形、舒展的曲线和温和的分组', radius: ['14px', '20px', '20px'], material: '柔和表面与圆角；操作密集时保留曲线语言并收紧间距', display: '"SF Pro Rounded", "Segoe UI", "PingFang SC", sans-serif' },
  glass: { name: '流光', character: '透明叠层与清晰的前景，光效集中在重要内容', radius: ['10px', '16px', '16px'], material: '展示区域可用透明与模糊；表格、表单、长文使用稳定不透明表面', display: '"Helvetica Neue", "Segoe UI", "PingFang SC", sans-serif' },
  editorial: { name: '书卷', character: '标题、正文与留白形成编辑节奏', radius: ['2px', '4px', '4px'], material: '少阴影、细分隔；阅读正文重视行宽，操作区域重视扫描', display: '"Songti SC", "SimSun", Georgia, serif' }
};

const DESIGN_MODES = {
  persuade: {
    name: '营销说服', purpose: '理解价值、查看真实证明并决定是否行动', defaultStrategy: 'committed',
    displaySize: 'clamp(2.25rem, 4.8vw, 4rem)', titleSize: '1.75rem', sectionSize: '1.375rem', bodySize: '1rem', labelSize: '0.875rem', metaSize: '0.75rem',
    displayLeading: '1.16', bodyLeading: '1.75', displayWeight: '700', displayTracking: '-0.025em', titleMeasure: '14em', proseMeasure: '32em', container: '72rem',
    sectionStep: 'space-8xl', panelStep: 'space-2xl', stackStep: 'space-md', controlStep: 'space-sm',
    motion: '一次与核心展示有关的运动；其他交互提供短反馈', motionDuration: '220ms',
    layout: '从价值主张到具体证明再到行动；按需求选择主视觉和布局，不固定双栏 Hero。',
    density: '首屏主次明确；证明区可以密集，章节之间保留呼吸。',
    color: '品牌区域可承担显著面积；主行动必须与所在背景区分。'
  },
  operate: {
    name: '工作操作', purpose: '快速扫描当前状态、定位结果并完成操作', defaultStrategy: 'restrained',
    displaySize: '1.5rem', titleSize: '1.25rem', sectionSize: '1.125rem', bodySize: '0.9375rem', labelSize: '0.875rem', metaSize: '0.75rem',
    displayLeading: '1.4', bodyLeading: '1.6', displayWeight: '650', displayTracking: '0em', titleMeasure: 'none', proseMeasure: '38em', container: '90rem',
    sectionStep: 'space-2xl', panelStep: 'space-lg', stackStep: 'space-sm', controlStep: 'space-sm',
    motion: '仅状态、反馈、展开与加载；无持续辉光或页面入场演出', motionDuration: '160ms',
    layout: '按任务重要性排列结果、筛选、数据与操作；导航和表格使用熟悉结构，侧栏在窄屏重排。',
    density: '稳定行高、列对齐；关键结果显眼，辅助记录紧凑，图表面积匹配信息量。',
    color: '默认克制；明确选择强色策略时，重点报告区用强色，输入与数据表面保持可读。'
  },
  read: {
    name: '内容阅读', purpose: '持续理解正文并在章节之间导航', defaultStrategy: 'restrained',
    displaySize: '2.25rem', titleSize: '1.75rem', sectionSize: '1.375rem', bodySize: '1.0625rem', labelSize: '0.875rem', metaSize: '0.8125rem',
    displayLeading: '1.4', bodyLeading: '1.9', displayWeight: '650', displayTracking: '0em', titleMeasure: '18em', proseMeasure: '34em', container: '68rem',
    sectionStep: 'space-6xl', panelStep: 'space-2xl', stackStep: 'space-lg', controlStep: 'space-sm',
    motion: '阅读位置和导航反馈；正文不作进场动画', motionDuration: '160ms',
    layout: '正文是中心，目录和旁注服务阅读；中文正文目标约 28–36 个全角字/行，随字号和视口收缩。',
    density: '段内连续，段间适度分开；章节标题上方留白大于下方，长文不装进重复卡片。',
    color: '正文表面低干扰；强品牌色可用于封面或章节引导，链接与当前阅读位置可辨。'
  },
  experience: {
    name: '作品展示', purpose: '查看作品、媒体或过程并理解其关系', defaultStrategy: 'committed',
    displaySize: 'clamp(2.5rem, 6vw, 5.5rem)', titleSize: '2rem', sectionSize: '1.375rem', bodySize: '1rem', labelSize: '0.875rem', metaSize: '0.75rem',
    displayLeading: '1.12', bodyLeading: '1.75', displayWeight: '700', displayTracking: '-0.025em', titleMeasure: '12em', proseMeasure: '30em', container: '90rem',
    sectionStep: 'space-8xl', panelStep: 'space-2xl', stackStep: 'space-md', controlStep: 'space-sm',
    motion: '一个与作品浏览或转换有关的关键运动；内容默认可见', motionDuration: '240ms',
    layout: '作品决定比例、留白和浏览顺序；展示对象从首屏开始占据主位，不强制营销 Hero 或指标卡。',
    density: '让展示对象拥有足够尺寸，辅助说明服从作品；作品信息不靠装饰替代。',
    color: '色彩跟随作品和品牌区域；界面前景与媒体分离，确保导航可辨。'
  }
};

/* 字体角色：中文展示 / 中文正文 / 拉丁展示 / 数字数据。
   交付顺序为「平台原生中文字体优先，Noto 作为确定回退」：
   - 原生 PingFang SC / Microsoft YaHei / Songti SC 是各平台自带、渲染成熟的中文字体，不是碰巧安装的字体；
   - Noto Sans SC / Noto Serif SC（OFL-1.1）提供跨平台一致的兜底与可选品牌展示字体；
   - 拉丁展示与数字数据按风格区分，数字统一 tabular-nums 供表格对齐。
   实测（macOS 15，Chrome）：sans 风格的汉字段落均落到 PingFang SC；书卷落到 Songti SC。
   Windows 实际字形未在本环境验证，仅按系统字体名给出回退顺序。 */
const STYLE_FONTS = {
  spectrum: {
    latinDisplay: '"Avenir Next", "Inter", "Segoe UI", sans-serif',
    cnDisplay: '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif',
    cnBody: '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif',
    data: '"SF Mono", Menlo, "Cascadia Code", Consolas, ui-monospace, monospace',
    traits: '几何骨架、字面偏窄、笔画粗细均匀；标题收紧字距，数字用等宽表格式',
    displayWeight: '700', displayTracking: '-0.01em'
  },
  standard: {
    latinDisplay: '-apple-system, "Segoe UI", "Inter", sans-serif',
    cnDisplay: '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif',
    cnBody: '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif',
    data: '"SF Mono", Menlo, "Cascadia Code", Consolas, ui-monospace, monospace',
    traits: '中性无衬线、字面标准、笔画均匀；依靠字号与字重建立层级',
    displayWeight: '700', displayTracking: '-0.015em'
  },
  soft: {
    latinDisplay: '"SF Pro Rounded", "Nunito", "Segoe UI Variable", "Segoe UI", sans-serif',
    cnDisplay: '"Hiragino Sans GB", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif',
    cnBody: '"Hiragino Sans GB", "PingFang SC", "Noto Sans SC", "Microsoft YaHei", sans-serif',
    data: '"SF Mono", Menlo, "Cascadia Code", Consolas, ui-monospace, monospace',
    traits: '人文无衬线、字面偏宽、字腔开、重心居中；中文圆体需可选展示字体，缺失时用人文无衬线',
    displayWeight: '600', displayTracking: '0em'
  },
  glass: {
    latinDisplay: '"Helvetica Neue", "Inter", "Segoe UI", sans-serif',
    cnDisplay: '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif',
    cnBody: '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif',
    data: '"SF Mono", Menlo, "Cascadia Code", Consolas, ui-monospace, monospace',
    traits: '细笔画、字面偏窄、留白大；标题用细字重并放宽字距',
    displayWeight: '300', displayTracking: '0.01em'
  },
  editorial: {
    latinDisplay: 'Georgia, "Source Serif 4", "Times New Roman", serif',
    cnDisplay: '"Songti SC", "Noto Serif SC", STSong, SimSun, Georgia, serif',
    cnBody: '"Songti SC", "Noto Serif SC", STSong, SimSun, Georgia, serif',
    data: 'Georgia, "Songti SC", ui-monospace, monospace',
    traits: '衬线、横细竖粗、有书写感；正文用宋体保持阅读节奏，数据保留衬线数字',
    displayWeight: '700', displayTracking: '0em'
  }
};

// 可选品牌展示字体：平台无法表达风格时按需自托管，缺失时回退到上面的原生栈
const OPTIONAL_WEBFONTS = {
  'Noto Sans SC': {
    license: 'OFL-1.1', family: 'Noto Sans SC', weights: '400 / 500 / 700',
    source: 'https://fonts.google.com/noto/specimen/Noto+Sans+SC',
    note: '跨平台无衬线兜底与暖糖风格的圆润替代；完整字重约 5–8MB（woff2 全量），按 unicode-range 自托管时可只取常用字。'
  },
  'Noto Serif SC': {
    license: 'OFL-1.1', family: 'Noto Serif SC', weights: '400 / 600 / 700',
    source: 'https://fonts.google.com/noto/specimen/Noto+Serif+SC',
    note: '书卷风格的展示与正文衬线；Windows 缺 Songti SC 时提供确定字形。'
  }
};

// 中文排版角色：字体、字重、字号、行高、字距、行宽与换行策略
const TYPE_ROLES = {
  display:  { label: '展示标题', font: 'display', weight: 'var(--type-display-weight)', size: 'var(--type-display-size)', leading: 'var(--type-display-leading)', tracking: 'var(--type-display-tracking)', measure: 'var(--measure-title)', wrap: 'text-wrap: balance; 允许 2–3 行，不在词内断行' },
  title:    { label: '页面标题', font: 'display', weight: '650', size: 'var(--type-title-size)', leading: '1.35', tracking: '0', measure: 'var(--measure-title)', wrap: 'text-wrap: balance' },
  section:  { label: '区块标题', font: 'display', weight: '650', size: 'var(--type-section-size)', leading: '1.45', tracking: '0', measure: 'var(--measure-title)', wrap: 'text-wrap: balance' },
  body:     { label: '正文', font: 'body', weight: '400', size: 'var(--type-body-size)', leading: 'var(--type-body-leading)', tracking: '0', measure: 'var(--measure-prose)', wrap: 'text-wrap: pretty; 中文按字换行，行末不孤悬标点' },
  label:    { label: '标签与控件', font: 'body', weight: '600', size: 'var(--type-label-size)', leading: '1.5', tracking: '0', measure: 'none', wrap: '不换行或按词换行，长文案优先换行不缩字号' },
  meta:     { label: '辅助说明', font: 'body', weight: '400', size: 'var(--type-meta-size)', leading: '1.6', tracking: '0', measure: 'var(--measure-prose)', wrap: '允许换行' },
  data:     { label: '数据与代码', font: 'data', weight: '500', size: 'var(--type-label-size)', leading: '1.4', tracking: '0.01em', measure: 'none', wrap: 'tabular-nums；表格、指标、时间记录对齐' }
};

const DESIGN_STRATEGIES = {
  restrained: { name: '克制', description: '中性画布与内容表面，颜色只出现在主操作与状态上' },
  committed: { name: '投入', description: '一整块品牌区域承担视觉重点，其余区域保持中性' },
  'full-palette': { name: '全色板', description: '品牌区域、辅助内容区域与行动各有稳定颜色角色' },
  drenched: { name: '浸染', description: '画布本身染色，表面用同色系深浅分层，前景与行动保持清晰' }
};

// 混合文字栈：拉丁字体在前、中文字体在后，缺字时按顺序回退
function fontStacks(style) {
  const f = STYLE_FONTS[style] || STYLE_FONTS.spectrum;
  const merge = (latin, cjk) => {
    const seen = new Set();
    return (latin.replace(/,\s*(sans-serif|serif|monospace)\s*$/i, '') + ', ' + cjk)
      .split(',').map(s => s.trim()).filter(s => {
        const key = s.replace(/["']/g, '').toLowerCase();
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      }).join(', ');
  };
  return { display: merge(f.latinDisplay, f.cnDisplay), body: f.cnBody, data: f.data };
}

function buildFontTokens(profile) {
  const f = STYLE_FONTS[profile.style] || STYLE_FONTS.spectrum;
  const s = fontStacks(profile.style);
  const t = (name, value, usage) => ({ name: name, light: value, dark: value, usage: usage, group: 'font' });
  return [
    t('--font-display', s.display, profile.identity.name + '展示字体。' + f.traits),
    t('--font-body', s.body, '中文正文字体'),
    t('--font-data', s.data, '数据与代码字体，配合 tabular-nums'),
    t('--font-cn-display', f.cnDisplay, '中文展示字体（缺字回退顺序）'),
    t('--font-cn-body', f.cnBody, '中文正文字体（缺字回退顺序）'),
    t('--font-latin-display', f.latinDisplay, '拉丁展示字体')
  ];
}

// 排版角色与中文规则：字号/行高/字距/行宽/换行 + 标点与数字对齐
function buildFontCSS(profile) {
  const f = STYLE_FONTS[profile.style] || STYLE_FONTS.spectrum;
  const faces = Object.entries(OPTIONAL_WEBFONTS).map(([name, w]) =>
    '/* 可选品牌展示字体：' + name + '（' + w.license + '，' + w.weights + '）\n' +
    '   ' + w.note + '\n' +
    '   获取：' + w.source + '；自托管时按需裁剪并保留本 unicode-range。 */\n' +
    '@font-face {\n' +
    '  font-family: "' + name + '";\n' +
    '  src: local("' + name + '"), url("./fonts/' + name.replace(/\s+/g, '') + '.woff2") format("woff2");\n' +
    '  font-weight: 400 700;\n' +
    '  font-display: swap;\n' +
    '  unicode-range: U+3000-303F, U+4E00-9FFF, U+FF00-FFEF;\n' +
    '}').join('\n\n');
  const role = (key, r) => '.' + 'ce-type-' + key + ' { font-family: var(--font-' + r.font + '); font-weight: ' + r.weight + '; font-size: ' + r.size + '; line-height: ' + r.leading + '; letter-spacing: ' + r.tracking + ';' +
    (r.measure !== 'none' ? ' max-width: ' + r.measure + ';' : '') + ' }';
  const roles = Object.entries(TYPE_ROLES).map(([k, r]) => role(k, r)).join('\n');
  return '/* ' + profile.identity.name + '中文排版：' + f.traits + '\n' +
    '   字体缺失或离线时按 var(--font-*) 中的回退顺序落到平台原生中文字体，标题不因缺字溢出。 */\n' +
    faces + '\n\n' + roles + '\n' +
    '/* 中文标点与换行：行末不孤悬标点，标题平衡断行，正文按字换行 */\n' +
    '.ce-prose :is(p, li, blockquote) { text-spacing-trim: space-first; hanging-punctuation: allow-end; text-wrap: pretty; }\n' +
    ':is(.ce-type-display, .ce-type-title, .ce-type-section) { text-wrap: balance; overflow-wrap: anywhere; }\n' +
    '/* 数字对齐：表格、指标、时间记录统一等宽数字 */\n' +
    ':is(.ce-type-data, .ce-metric-num, .ce-row-time, .ce-panel-count, .ce-target-status) { font-variant-numeric: tabular-nums; }\n';
}

function resolveDesignProfile(options = {}) {
  const style = DESIGN_STYLES[options.style] ? options.style : 'spectrum';
  const mode = DESIGN_MODES[options.mode] ? options.mode : options.pageType === 'app' ? 'operate' : 'persuade';
  const explicit = options.strategyExplicit === true && !!DESIGN_STRATEGIES[options.strategy];
  const strategy = explicit ? options.strategy : DESIGN_MODES[mode].defaultStrategy;
  return {
    version: 1, brand: options.brand || null, style, mode, strategy,
    requestedStrategy: explicit ? options.strategy : null, strategySource: explicit ? 'user' : 'mode',
    theme: options.theme === 'dark' ? 'dark' : 'light',
    identity: { ...DESIGN_STYLES[style], radius: [...DESIGN_STYLES[style].radius] },
    surface: { ...DESIGN_MODES[mode] },
    strategyDescription: DESIGN_STRATEGIES[strategy].description,
    precedence: '需求事实与用户明确选择 → 品牌共性 → 页面用途默认 → 主题。用途调整尺度与密度，不替换品牌。'
  };
}

function currentDesignOptions() {
  return {
    style: typeof currentDemoStyle === 'undefined' ? 'spectrum' : currentDemoStyle,
    pageType: typeof currentDemoType === 'undefined' ? 'landing' : currentDemoType,
    strategy: typeof currentStrategy === 'undefined' ? 'committed' : currentStrategy,
    strategyExplicit: typeof strategyExplicit !== 'undefined' && strategyExplicit,
    theme: typeof currentPreviewTheme === 'undefined' ? 'light' : currentPreviewTheme
  };
}

function modeTokenValues(profile, scale) {
  const m = profile.surface;
  const step = name => (scale.find(s => s.name === name) || {}).remStr || '1rem';
  return {
    '--type-display-size': m.displaySize, '--type-title-size': m.titleSize, '--type-section-size': m.sectionSize,
    '--type-body-size': m.bodySize, '--type-label-size': m.labelSize, '--type-meta-size': m.metaSize,
    '--type-display-leading': m.displayLeading, '--type-body-leading': m.bodyLeading,
    '--type-display-weight': m.displayWeight, '--type-display-tracking': m.displayTracking,
    '--measure-title': m.titleMeasure, '--measure-prose': m.proseMeasure, '--layout-content-width': m.container,
    '--layout-section-gap': step(m.sectionStep), '--layout-panel-padding': step(m.panelStep),
    '--layout-stack-gap': step(m.stackStep), '--layout-control-padding': step(m.controlStep),
    '--motion-feedback-duration': m.motionDuration
  };
}

function buildDesignTokens(profile, scale) {
  const tokens = Object.entries(modeTokenValues(profile, scale)).map(([name, value]) => ({ name, light: value, dark: value, usage: profile.surface.name + '用途角色', group: 'surface' }));
  ['sm', 'md', 'lg'].forEach((name, i) => tokens.push({ name: '--radius-' + name, light: profile.identity.radius[i], dark: profile.identity.radius[i], usage: profile.identity.name + '品牌形状', group: 'radius' }));
  tokens.push(...buildFontTokens(profile));
  return tokens;
}

function tokenDeclarations(tokens, theme) {
  return tokens.filter(t => t[theme] && t[theme] !== '—').map(t => '  ' + t.name + ': ' + t[theme] + ';').join('\n');
}

function buildModeCSS(profile, scale) {
  return Object.keys(DESIGN_MODES).map(mode => {
    const p = resolveDesignProfile({ ...profile, mode, strategyExplicit: profile.strategySource === 'user' });
    const declarations = Object.entries(modeTokenValues(p, scale)).map(([name, value]) => '  ' + name + ': ' + value + ';').join('\n');
    return '[data-ce-mode="' + mode + '"] {\n' + declarations + '\n}';
  }).join('\n\n') + `
/* 用途作用于页面根；局部组件继承所属页面，不另造品牌。 */
.ce-surface { font-family: var(--ce-body, var(--font-body)); font-size: var(--type-body-size); line-height: var(--type-body-leading); color: var(--color-text-primary); }
.ce-surface :is(h1,h2,h3,p,figure) { margin: 0; }
.ce-surface :is(h1,.ce-hero-title) { font-family: var(--ce-display, var(--font-display)); font-size: var(--type-display-size); line-height: var(--type-display-leading); font-weight: var(--ce-display-weight, var(--type-display-weight)); letter-spacing: var(--ce-display-tracking, var(--type-display-tracking)); max-width: var(--measure-title); text-wrap: balance; overflow-wrap: anywhere; }
.ce-surface :is(h2,.ce-split-title) { font-family: var(--ce-display, var(--font-display)); font-size: var(--type-section-size); line-height: 1.45; }
.ce-surface :is(p,.ce-hero-sub,.ce-split-copy) { font-size: var(--type-body-size); line-height: var(--type-body-leading); max-width: var(--measure-prose); overflow-wrap: anywhere; text-wrap: pretty; }
.ce-surface :is(.ce-metric-num,.ce-row-time,.ce-panel-count,.ce-target-status,.ce-plate-epoch,.ce-app-sub,.ce-hero-meta) { font-family: var(--ce-mono, var(--font-data)); font-variant-numeric: tabular-nums; }
.ce-surface.ce-landing { max-width: var(--layout-content-width); gap: var(--layout-section-gap); padding: var(--space-2xl) 0 var(--space-5xl); }
.ce-surface .ce-hero-sub { margin-top: var(--space-lg); }
.ce-surface :is(.ce-panel,.ce-app-main,.ce-hero > *, .ce-split > *) { min-width: 0; }
.ce-surface :is(.ce-btn,.ce-search input) { font-family: var(--ce-body); font-size: var(--type-label-size); line-height: 1.5; }
.ce-surface :is(.ce-btn,.ce-side-item) { transition-duration: var(--motion-feedback-duration); }
.ce-surface[data-ce-mode="operate"] { --ce-display: var(--ce-body); --ce-display-weight: 650; --ce-display-tracking: 0em; }
.ce-surface[data-ce-mode="operate"] .ce-app-title { font-family: var(--ce-body); font-size: var(--type-title-size); }
.ce-surface[data-ce-mode="operate"] :is(.ce-panel-title,.ce-target,.ce-panel-row,.ce-side-item) { font-family: var(--ce-body); font-size: var(--type-label-size); }
.ce-surface[data-ce-mode="operate"] :is(.ce-panel-count,.ce-target-status,.ce-app-sub) { font-size: var(--type-meta-size); }
.ce-surface[data-ce-mode="operate"] :is(.ce-btn,.ce-band,.ce-panel,.ce-text-link::after,.ce-nav-link::after) { animation: none; }
.ce-surface[data-ce-mode="operate"] :is(.ce-btn:hover,.ce-panel:hover) { transform: none; }
.ce-surface[data-ce-mode="operate"] :is(.ce-panel,.ce-app-topbar) { backdrop-filter: none; -webkit-backdrop-filter: none; background: var(--color-bg-secondary); }
.ce-surface[data-ce-mode="operate"] .ce-panel-body { padding: var(--layout-panel-padding); }
.ce-surface[data-ce-mode="operate"] .ce-app-grid { gap: var(--layout-stack-gap); align-items: start; }
.ce-surface[data-ce-mode="operate"] .ce-panel-spectrum { grid-row: span 2; }
.ce-surface[data-ce-mode="read"] { max-width: var(--layout-content-width); margin-inline: auto; }
.ce-surface[data-ce-mode="read"] .ce-prose { max-width: var(--measure-prose); margin-inline: auto; }
.ce-surface[data-ce-mode="read"] .ce-prose p + p { margin-top: 1em; }
.ce-surface[data-ce-mode="read"] .ce-prose h2 { margin: 2.5em 0 .8em; }
.ce-surface[data-ce-mode="read"] :is(.ce-band,.ce-btn) { animation: none; }
.ce-surface[data-ce-mode="experience"] .ce-work { margin: 0; }
.ce-surface[data-ce-mode="experience"] .ce-work :is(img,video,svg) { display: block; width: 100%; height: auto; }
.ce-surface :is(input,button,select,textarea) { max-width: 100%; }
@media (max-width: 760px) {
  .ce-surface.ce-app { grid-template-columns: minmax(0,1fr); }
  .ce-surface .ce-sidebar { border-right: 0; border-bottom: 1px solid var(--color-border); }
  .ce-surface .ce-side-nav { flex-direction: row; flex-wrap: wrap; }
  .ce-surface .ce-side-foot { display: none; }
  .ce-surface .ce-app-topbar { flex-wrap: wrap; }
  .ce-surface .ce-app-grid { grid-template-columns: minmax(0,1fr); }
}
@media (prefers-reduced-motion: reduce) { .ce-surface :is(.ce-band,.ce-btn,.ce-panel) { animation: none; transform: none; } }
`;
}
