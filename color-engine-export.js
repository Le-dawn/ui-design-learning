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
    codeEl.textContent = buildTailwindConfig(tokens);
  } else if (currentExportFormat === 'json') {
    codeEl.textContent = buildJSONTokens(tokens);
  } else if (currentExportFormat === 'component') {
    codeEl.textContent = buildComponentCSSExport();
  } else if (currentExportFormat === 'prompt') {
    codeEl.textContent = buildStylePromptExport(tokens);
  } else {
    codeEl.textContent = buildCSSExport(sys, tokens);
  }
}

// ── 风格提示词导出：tokens 具体值 + 当前风格 prompt，一键复制丢给 AI ──
// 维护提示：提示词正文与 STYLES.md 第三节保持同步

const STYLE_PROMPTS = {
  spectrum: {
    name: '光谱世界（纸面工业）',
    body: [
      '- 表面：纸白底 + 1px 发丝线边框 + 微偏移阴影；3px 小倒角，禁用圆角胶囊',
      '- 字体：展示用几何无衬线（Geologica 类），数据/时间/编号用等宽字体（IBM Plex Mono 类），数字一律 tabular；别让同一字重从头走到尾',
      '- 强调色：只出现在语义位置（主按钮 / 链接 / 选中态 / 状态点），中性色承担全部结构',
      '- 装饰：无渐变、无光斑、无 emoji；图形用统一 1.8 描边 SVG 线稿',
      '- 气质：像天文台控制台、实验室仪器——数据可信，界面退后'
    ].join('\n')
  },
  soft: {
    name: '暖糖（消费级圆润）',
    body: [
      '- 表面：大圆角（14–20px）+ 柔和多层阴影（模糊 10–30px、低透明度）+ 浅色细边框；状态点圆形',
      '- 字体：圆润无衬线，字距可放宽，少用等宽字体',
      '- 强调色：可以更活泼——按钮、徽章、图标底都能用，但一屏仍不超过 3 处',
      '- 微交互：hover 上浮 1px，按压下沉，过渡 150ms',
      '- 气质：亲切、安全、值得信任，像健康 / 教育类 App'
    ].join('\n')
  },
  glass: {
    name: '流光（玻璃科技）',
    body: [
      '- 表面：半透明玻璃面板（backdrop-filter blur 14–18px）+ 1px 半透明描边 + 大圆角（10–16px）',
      '- 光效：主 CTA 带强调色辉光（0 0 0 1px 描边 + 8–26px 彩色阴影）；大区块顶部可加径向光斑',
      '- 字体：现代几何无衬线，标题字距略收紧',
      '- 气质：AI 产品、未来感、发光但不刺眼'
    ].join('\n')
  },
  editorial: {
    name: '书卷（编辑内容）',
    body: [
      '- 表面：纯色底 + 1px 细线分隔，几乎不用阴影；圆角 2–4px 或直角',
      '- 字体：衬线显示字体（中文宋体 / 英文 Georgia 类），标题不收紧字距，正文行高 1.7',
      '- 强调色：全场最多 1 处（链接或 CTA 二选一）',
      '- 留白：区块间距 ≥ 80px，标题与正文间 8–12px；宁可空，不可挤',
      '- 气质：杂志、出版社、编辑部'
    ].join('\n')
  },
  standard: {
    name: '标准（现代 SaaS）',
    body: [
      '- 表面：浅底 + 白卡浮起（适中圆角 8–12px + 柔和双层阴影），1px 细边框',
      '- 字体：系统无衬线（Apple 栈），标题加粗 + 正文常规，数字 tabular；不引入特殊字体',
      '- 强调色：标准用法——主按钮实色、链接、选中态、焦点环，一屏 ≤ 3 处',
      '- 交互：hover 轻微上浮 + 阴影加深，active 内凹，过渡 150ms',
      '- 装饰：无网格、无印章、无光斑、无渐变文字；图标用统一描边 SVG',
      '- 气质：大多数成熟 SaaS 的通用面貌——干净、可信、不抢戏'
    ].join('\n')
  }
};

const TOKEN_GROUP_LABELS = {
  accent: '强调色', neutral: '中性色', state: '交互态', secondary: '辅助色',
  functional: '功能色', elevation: '阴影与层级', radius: '圆角',
  typography: '排版', 'space-scale': '间距阶梯', 'space-semantic': '间距语义'
};
const TOKEN_GROUP_ORDER = ['accent', 'neutral', 'state', 'secondary', 'functional', 'elevation', 'radius', 'typography', 'space-scale', 'space-semantic'];

function buildStylePromptExport(tokens) {
  const style = STYLE_PROMPTS[currentDemoStyle] || STYLE_PROMPTS.spectrum;
  const isApp = currentDemoType === 'app';
  const scene = isApp
    ? '工作台（Dashboard）：左侧导航 + 顶栏（标题/搜索/用户）+ 内容面板网格'
    : '着陆页（Landing）：顶栏导航 + Hero 主视觉 + 内容数据区 + 双栏信息区 + 页脚';

  const lines = [];
  lines.push('# 设计任务');
  lines.push('请按以下规格生成一个「' + style.name + '」风格的' + (isApp ? '工作台' : '着陆页') + '，输出单文件 HTML + CSS（含亮色与暗色 data-theme="dark" 双主题）。');
  lines.push('');
  lines.push('## 设计 tokens（必须严格遵守，不得自造颜色 / 间距 / 字号 / 圆角 / 阴影）');
  lines.push('');
  TOKEN_GROUP_ORDER.forEach(g => {
    const items = tokens.filter(t => t.group === g);
    if (!items.length) return;
    lines.push('### ' + (TOKEN_GROUP_LABELS[g] || g));
    items.forEach(t => {
      const isColor = t.light && String(t.light).startsWith('#');
      if (isColor) {
        lines.push('- `' + t.name + '`: ' + t.light + '（亮）/ ' + t.dark + '（暗）— ' + t.usage);
      } else {
        lines.push('- `' + t.name + '`: ' + t.light + ' — ' + t.usage);
      }
    });
    lines.push('');
  });
  lines.push('## 风格');
  lines.push(style.body);
  lines.push('');
  lines.push('## 页面结构');
  lines.push(scene);
  lines.push('');
  lines.push('## 约束');
  lines.push('- 只使用上面给出的 tokens，不得自造任何颜色、间距、字号、圆角、阴影');
  lines.push('- 不用渐变文字；不用 emoji 做图标（用统一描边 SVG）');
  lines.push('- 阴影必须有偏移 + 模糊（除非风格提示明确要求硬阴影）');
  lines.push('- 一屏一个主角元素；内容用中文，可参照天文观测 / 数据平台类文案');
  lines.push('');
  lines.push('## 参考');
  lines.push('如需组件级参考代码，请同时复制「组件 CSS」导出并粘贴。');
  return lines.join('\n');
}

// 组件 CSS：与组件案例页完全同一份样式，配合 CSS 变量复制即用
function buildComponentCSSExport() {
  return '/* ═══════════════════════════════════════════\n' +
    '   Color Engine — 组件 CSS（光谱世界 · Solstice 示例）\n' +
    '   配合「CSS 变量」导出一起使用：先复制 :root / [data-theme="dark"]，再复制本文件\n' +
    '   字体：Geologica（展示）/ 系统栈（正文）/ IBM Plex Mono（数据）\n' +
    '   所有值都引用 CSS 变量，换肤只改变量不碰组件\n' +
    '\n' +
    '   光谱世界设计约定（让页面不丑的最低标准）：\n' +
    '   1. 强调是例外：一屏只给主按钮 / 链接 / 选中态，彩色只在语义位置\n' +
    '   2. 字体有声音：展示 + 正文成对，数据用等宽 tabular 数字\n' +
    '   3. 组内紧、组间松：标题组 8px，卡片内 24px，区块间 ≥ 48px\n' +
    '   4. 深度靠阴影不靠色：发丝边框 + 偏移阴影，不叠圆角胶囊\n' +
    '   5. 禁止 AI 俗套：图标卡平铺、眉题 eyebrow、渐变文字、卡片套卡片\n' +
    '   ═══════════════════════════════════════════ */\n\n' +
    buildDemoCSS().trim() + '\n';
}

// Tailwind config（theme.extend 片段，colors/spacing/radius/shadow/渐变一次导出）
function buildTailwindConfig(tokens) {
  const colorGroups = { accent: {}, bg: {}, text: {}, surface: {}, border: {}, success: {}, warning: {}, error: {}, info: {} };
  tokens.forEach(t => {
    const m = /^--color-([a-z]+)-(.*)$/.exec(t.name);
    if (!m || !t.light || t.light.charAt(0) !== '#') return;
    const group = m[1];
    const name = m[2] || 'DEFAULT';
    if (!colorGroups[group]) colorGroups[group] = {};
    colorGroups[group][name] = t.light;
  });

  const accentBase = colorGroups.accent.base || '#2563eb';
  const accent2 = colorGroups.accent['2'] || accentBase;

  const shadowRgba = (token) => {
    const hex = tokens.find(t => t.name === token);
    if (!hex || !hex.light || hex.light.charAt(0) !== '#') return '0,0,0';
    const rgb = hexToRgb(hex.light);
    return rgb ? rgb.r + ',' + rgb.g + ',' + rgb.b : '0,0,0';
  };

  const lines = [];
  lines.push('/** @type {import(\'tailwindcss\').Config} */');
  lines.push('module.exports = {');
  lines.push('  theme: {');
  lines.push('    extend: {');
  lines.push('      colors: {');
  Object.keys(colorGroups).forEach(group => {
    const keys = Object.keys(colorGroups[group]);
    if (!keys.length) return;
    lines.push('        ' + group + ': {');
    keys.forEach(key => {
      lines.push('          ' + (key === 'DEFAULT' ? 'DEFAULT' : JSON.stringify(key)) + ': \'' + colorGroups[group][key] + '\',');
    });
    lines.push('        },');
  });
  lines.push('      },');
  lines.push('      borderRadius: {');
  ['sm', 'md', 'lg'].forEach(k => {
    const t = tokens.find(t => t.name === '--radius-' + k);
    if (t) lines.push('        ' + k + ': \'' + t.light + '\',');
  });
  lines.push('      },');
  lines.push('      boxShadow: {');
  ['sm', 'md', 'lg'].forEach(k => {
    const t = tokens.find(t => t.name === '--shadow-' + k);
    if (t) lines.push('        ' + k + ': \'' + t.light.replace(/var\(--shadow-color\)/g, 'rgba(' + shadowRgba('--color-text-emphasis') + ',0.08)') + '\',');
  });
  lines.push('      },');
  lines.push('      backgroundImage: {');
  lines.push('        brand: \'linear-gradient(135deg, ' + accentBase + ', ' + accent2 + ')\',');
  lines.push('      },');
  lines.push('    },');
  lines.push('  },');
  lines.push('};');
  return lines.join('\n');
}

// W3C Design Tokens JSON（颜色按组嵌套 + 双主题 light/dark，间距/圆角/阴影为 dimension/string）
function buildJSONTokens(tokens) {
  const out = { color: {}, dimension: {}, string: {} };
  tokens.forEach(t => {
    const key = t.name.replace(/^--color-/, '').replace(/^--space-/, '').replace(/^--radius-/, 'radius.').replace(/^--shadow-/, 'shadow.').replace(/^--gradient-/, 'gradient.').replace(/^--/, '');
    const isColor = t.light && t.light.charAt(0) === '#';
    if (isColor) {
      // accent-base → color.accent.base；accent-on-accent → color.accent['on-accent']
      const parts = key.split('-');
      const group = parts[0];
      const name = parts.slice(1).join('-') || 'DEFAULT';
      if (!out.color[group]) out.color[group] = {};
      out.color[group][name] = { light: t.light, dark: t.dark, type: 'color' };
    } else if (/^--radius-|^--shadow-|^--gradient-/.test(t.name) || t.light.startsWith('linear-gradient')) {
      out.string[key] = { light: t.light, dark: t.dark, type: 'string' };
    } else if (t.light && t.light.indexOf('rem') !== -1) {
      out.dimension[key] = { value: t.light, type: 'dimension' };
    } else {
      out.string[key] = { light: t.light, dark: t.dark, type: 'string' };
    }
  });
  return JSON.stringify(out, null, 2);
}

// ── CSS 变量导出 ────────────────────────────────────

function buildCSSExport(sys, tokens) {
  const lightHeaders = {
    accent: '强调色（含渐变搭档）',
    neutral: '中性色 (品牌色温贯穿)',
    state: '交互态',
    secondary: '辅助色 (同源弱色度)',
    functional: '功能色',
    elevation: '阴影与层级',
    radius: '圆角',
    typography: '排版（字号 / 行高 / 字重）',
    'space-scale': '间距系统 (基于 ' + spaceBaseUnit + 'px 网格)',
    'space-semantic': '间距语义 Token'
  };
  const darkHeaders = {
    accent: '强调色（暗色：降饱和防光晕）',
    neutral: '中性色（暗色：深度=亮度）',
    state: '交互态（暗色）',
    secondary: '辅助色（暗色：深底 + 低饱和）',
    functional: '功能色（暗色）',
    elevation: '阴影与层级（暗色：阴影加深）',
    radius: '圆角',
    typography: '排版（不随主题变化）'
  };
  const groupOrder = ['accent', 'neutral', 'state', 'secondary', 'functional', 'elevation', 'radius', 'typography', 'space-scale', 'space-semantic'];

  function block(headers, isLight) {
    const lines = [];
    groupOrder.forEach(g => {
      const items = tokens.filter(t => t.group === g);
      if (!items.length || !headers[g]) return;
      const width = Math.max(...items.map(t => t.name.length)) + 2;
      lines.push('  /* —— ' + headers[g] + ' —— */');
      items.forEach(t => {
        const comment = isLight ? '   /* ' + (t.group === 'space-scale' ? t.pxVal + 'px' : t.usage) + ' */' : '';
        lines.push('  ' + t.name.padEnd(width) + ': ' + (isLight ? t.light : t.dark) + ';' + comment);
      });
      lines.push('');
    });
    return lines;
  }

  const lines = [
    '/* ═══════════════════════════════════════════',
    '   Color Engine — 自动生成的 CSS 变量',
    '   复制到你的 :root 和 [data-theme="dark"] 中使用',
    '   ═══════════════════════════════════════════ */',
    '',
    ':root {',
    ...block(lightHeaders, true),
    '}',
    '',
    '[data-theme="dark"] {',
    ...block(darkHeaders, false),
    '}',
  ];

  return lines.join('\n');
}

// ── Token 对照表 ────────────────────────────────────

