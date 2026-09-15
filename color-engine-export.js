/* ============================================================
   COLOR ENGINE EXPORT — 导出层
   主出口：一次复制给 AI（tokens + 当前风格 + 组件 CSS + 用途规则 + 资源说明）
   高级出口：CSS 变量 / 组件 CSS / 风格提示词 / Tailwind / JSON（保持可用）
   依赖：color-math.js, design-profiles.js, color-engine-demo.js
   ============================================================ */

let currentExportFormat = 'ai';
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
  if (!codeEl) return;
  if (currentExportFormat === 'tailwind') {
    codeEl.textContent = buildTailwindConfig(tokens);
  } else if (currentExportFormat === 'json') {
    codeEl.textContent = buildJSONTokens(tokens);
  } else if (currentExportFormat === 'component') {
    codeEl.textContent = buildComponentCSSExport();
  } else if (currentExportFormat === 'prompt') {
    codeEl.textContent = buildStylePromptExport(tokens);
  } else if (currentExportFormat === 'css') {
    codeEl.textContent = buildCSSExport(sys, tokens);
  } else {
    codeEl.textContent = buildAIPromptExport(tokens);
  }
}

// 主复制入口使用的内容（与导出区「一次复制给 AI」完全同源）
function currentAIPrompt() {
  return _lastExport ? buildAIPromptExport(_lastExport.tokens) : '';
}

const TOKEN_GROUP_LABELS = {
  accent: '强调色', neutral: '中性色', state: '交互态', secondary: '辅助色',
  functional: '功能色', elevation: '阴影与层级', radius: '圆角',
  typography: '排版', 'space-scale': '间距阶梯', 'space-semantic': '间距语义'
};
const TOKEN_GROUP_ORDER = ['accent', 'neutral', 'state', 'secondary', 'functional', 'elevation', 'radius', 'typography', 'space-scale', 'space-semantic'];

// 项目级页面清单：四种用途由统一配置管理，每种风格给出各自的适配规则
const PROJECT_PAGES = PAGE_PURPOSES;

/* ══════════════════════════════════════════════════════════
   主出口：一次复制给 AI
   只包含当前风格所需的样式与共享基础（不把七套案例代码全带上）
   ══════════════════════════════════════════════════════════ */

function buildAIPromptExport(tokens) {
  const id = normalizeStyleId(currentDemoStyle);
  const p = getProfile(id);

  const lines = [];
  lines.push('# 设计任务：一套 tokens + 一种风格，贯穿整个项目');
  lines.push('');
  lines.push('把下面整段内容交给 AI，并在同一段里附上你的业务需求（要做什么产品、有哪些页面、什么内容）。');
  lines.push('这段内容已经自洽：tokens、风格规则、必须保留的特征、组件 CSS、四种用途的做法、资源与回退都在里面，');
  lines.push('**不需要用户再补组件 CSS 或解释设计术语**。');
  lines.push('');
  lines.push('注意：文中出现的示例品牌（' + exampleBrands() + '）、示例数据与示例作品只是「案例演示」，');
  lines.push('用于说明排版与组件用量，**不是你要实现的真实需求**，请全部替换为业务真实内容。');

  // ── 1. 最小接入 ──
  lines.push('');
  lines.push('## 1. 最小接入方式');
  lines.push('');
  lines.push('```html');
  lines.push('<!-- 亮色 -->');
  lines.push('<html lang="zh-CN" data-theme="light">');
  lines.push('  <body class="ce-style-' + id + '">        <!-- 风格类：整站只挂一次 -->');
  lines.push('    <main class="ce-landing">…</main>  <!-- 用途类：营销页 -->');
  lines.push('    <main class="ce-app">…</main>      <!-- 用途类：工作台 -->');
  lines.push('  </body>');
  lines.push('</html>');
  lines.push('');
  lines.push('<!-- 暗色：只改根节点属性，组件样式不写第二套 -->');
  lines.push('<html lang="zh-CN" data-theme="dark">');
  lines.push('```');
  lines.push('');
  lines.push('- 第 2 节的 tokens 以 CSS 变量提供，**只能使用这些变量**，不得自造颜色 / 间距 / 字号 / 圆角 / 阴影');
  lines.push('- 第 4 节的组件 CSS 直接粘贴；第 5 节的四种用途骨架按你的页面套用，不要逐页发明样式');
  lines.push('- 主题切换只切 `data-theme`；`--color-*` 的暗色值已在 tokens 里给出');
  lines.push('- 若需要改变版式（例如把列表改成时间线），由你修改页面结构；**只换 CSS 变量无法完成所有风格转换**');

  // ── 2. tokens ──
  lines.push('');
  lines.push('## 2. 设计 tokens（唯一视觉取值来源）');
  TOKEN_GROUP_ORDER.forEach(g => {
    const items = tokens.filter(t => t.group === g);
    if (!items.length) return;
    lines.push('');
    lines.push('### ' + (TOKEN_GROUP_LABELS[g] || g));
    items.forEach(t => {
      const isColor = t.light && String(t.light).startsWith('#');
      if (isColor) {
        lines.push('- `' + t.name + '`: ' + t.light + '（亮）/ ' + t.dark + '（暗）— ' + t.usage);
      } else {
        lines.push('- `' + t.name + '`: ' + t.light + ' — ' + t.usage);
      }
    });
  });

  // ── 3. 风格 ──
  lines.push('');
  lines.push('## 3. 风格：' + p.name + '（' + p.en + '）· ' + p.tagline);
  lines.push('');
  lines.push('适用场景：' + p.scene + '。不适用：' + p.avoid + '。');
  lines.push('');
  lines.push('**字体角色**：' + p.fontNote + '。');
  lines.push('');
  lines.push('**材料与品牌色的分工**：' + p.materialNote + '。');
  lines.push('');
  lines.push(profilePromptBody(id));

  // ── 4. 组件 CSS ──
  lines.push('');
  lines.push('## 4. 组件 CSS（与预览案例完全同一份）');
  lines.push('');
  lines.push('```css');
  lines.push(exportComponentCSS(id).trim());
  lines.push('```');

  // ── 5. 四种用途 ──
  lines.push('');
  lines.push('## 5. 页面用途规则（四种用途统一管理，不要另起第二套风格）');
  PROJECT_PAGES.forEach(pg => {
    lines.push('');
    lines.push('### ' + pg.name + '（`.ce-' + purposeClass(pg.id) + '` 骨架：' + pg.spec + '）');
    lines.push('- 本风格的做法：' + (profilePurposeLine(id, pg.id) || '按骨架推导，视觉全部来自 tokens 与风格规则'));
  });

  // ── 6. 亮暗主题 ──
  lines.push('');
  lines.push('## 6. 亮暗主题');
  lines.push('- 只切 `data-theme="light"` / `data-theme="dark"`；组件 CSS 与结构完全不动');
  lines.push('- 暗色不是亮色的反转：暗色下用 tokens 给出的暗色值，阴影加深、强调色降饱和防光晕');
  if (p.materialOverrides) {
    lines.push('- 本风格的材料色自带两套（见组件 CSS 中 `[data-theme="dark"] .ce-style-' + id + '`）：暗色是深底 + 暖浅字，不是普通黑白主题');
  }
  lines.push('- 两套主题都要实际检查一次：文字对比、边框可见性、状态色是否仍可辨识');

  // ── 7. 资源与回退 ──
  lines.push('');
  lines.push('## 7. 资源与回退（哪些东西不需要你提供、哪些必须替换）');
  lines.push('- **字体**：三声部全部是系统原生栈（展示 / 正文 / 数据），无需引入任何 webfont，离线一致。换字体只需改 `--ce-display` / `--ce-body` / `--ce-mono` 三个变量');
  lines.push('- **图标**：统一描边 SVG（1.2–1.8px 线宽），不用 emoji、不用位图图标');
  lines.push('- **图片**：案例里的作品图是项目自制的演示素材（`assets/work-demo-01…06.svg`），**不能当作你的内容**；请替换为你的真实素材。缺图时用虚线占位框标注，不要用装饰插画凑数');
  lines.push('- **玻璃 / 模糊**：`backdrop-filter` 不被支持时用 `@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px)))` 把玻璃面还原成不透明表面（`--color-bg-secondary`）+ 描边 + 投影。**不要只写半透明背景就了事**：没有 blur 时底层正文会直接穿过导航条，两行字叠在一起谁也读不了');
  lines.push('- **动效**：唯一进场/持续动效都要配 `prefers-reduced-motion: reduce` 关闭');

  // ── 8. 边界 ──
  lines.push('');
  lines.push('## 8. 必须保留 vs 可自行安排');
  lines.push('- **必须保留**：第 3 节「必须保留的特征」、tokens 的语义与用法、四种用途的骨架方式、组件复用（不逐页另起炉灶）');
  lines.push('- **可自行安排**：内容与文案、页面数量、业务功能与数据结构；布局可按业务调整，但不得引入 tokens 之外的视觉值');
  lines.push('- 业务事实以你的需求为准：不要沿用案例里的品牌名、指标数字、人物与作品');

  // ── 9. 交付与自检 ──
  lines.push('');
  lines.push('## 9. 交付与自检');
  lines.push('- 交付物：全站共享 CSS + 各页面 HTML，亮暗双主题，中文文案');
  lines.push('- 自检清单：① 首屏主次是否清楚（一个主角元素）② 窄屏 390px 是否折行且无横向溢出（本套样式在该宽度已实测为 0 溢出）③ 中文长标题是否换行且不撑破容器 ④ hover / active / focus / disabled 是否都有定义 ⑤ 颜色是否全部来自 tokens ⑥ 是否只用了一种风格');
  lines.push('- 如果你无法在浏览器中渲染验证，请明确说明哪些部分未经渲染验证，不要默认通过');
  return lines.join('\n');
}

function purposeClass(id) {
  return id === 'marketing' ? 'landing' : (id === 'app' ? 'app' : id);
}

function exampleBrands() {
  const names = [];
  STYLE_IDS.forEach(function (id) {
    const n = { standard: 'PULSE', soft: '舒心', glass: 'NEXUS', editorial: '知卷', sepia: '藏卷', poster: '开物', gallery: '白盒' }[id];
    if (names.indexOf(n) === -1) names.push(n);
  });
  return names.join(' / ');
}

/* ── 高级出口 1：风格提示词（tokens + 全站风格 brief） ── */

function buildStylePromptExport(tokens) {
  const id = normalizeStyleId(currentDemoStyle);
  const p = getProfile(id);
  const focusPage = currentDemoType === 'app' ? 'app' : 'landing';

  const lines = [];
  lines.push('# 设计任务：全站统一风格（作用于整个项目）');
  lines.push('请为整个项目设计一套统一视觉语言：以下风格与 tokens 作用于项目的**全部页面**——' +
    '营销页、工作台、阅读页、展示页都必须遵守，而不是只做一个单页。' +
    '当前以「' + (focusPage === 'app' ? '工作台' : '着陆页') + '」为主角示例页：先把它完整做到位，其余页面按同一套规则推导。');
  lines.push('');
  lines.push('## 设计 tokens（必须严格遵守，不得自造颜色 / 间距 / 字号 / 圆角 / 阴影）');
  TOKEN_GROUP_ORDER.forEach(g => {
    const items = tokens.filter(t => t.group === g);
    if (!items.length) return;
    lines.push('');
    lines.push('### ' + (TOKEN_GROUP_LABELS[g] || g));
    items.forEach(t => {
      const isColor = t.light && String(t.light).startsWith('#');
      if (isColor) lines.push('- `' + t.name + '`: ' + t.light + '（亮）/ ' + t.dark + '（暗）— ' + t.usage);
      else lines.push('- `' + t.name + '`: ' + t.light + ' — ' + t.usage);
    });
  });
  lines.push('');
  lines.push('## 风格：' + p.name + '（' + p.en + '）');
  lines.push(profilePromptBody(id));
  lines.push('');
  lines.push('## 页面清单（同一风格贯穿全站，每页先按骨架搭结构再填内容）');
  PROJECT_PAGES.forEach(pg => {
    lines.push('- ' + pg.name + '：' + pg.spec + (pg.id === focusPage ? '（当前主角示例页：先完整做到位）' : ''));
  });
  lines.push('');
  lines.push('## 约束');
  lines.push('- 只使用上面给出的 tokens，不得自造任何颜色、间距、字号、圆角、阴影');
  lines.push('- 组件全站复用同一实现（见「组件 CSS」导出），不逐页发明');
  lines.push('- 不用渐变文字；不用 emoji 做图标（用统一描边 SVG）');
  lines.push('- 一屏一个主角元素；内容用中文');
  return lines.join('\n');
}

/* ── 高级出口 2：组件 CSS ── */

function buildComponentCSSExport() {
  const id = normalizeStyleId(currentDemoStyle);
  const p = getProfile(id);
  return '/* ═══════════════════════════════════════════\n' +
    '   Color Engine — 组件 CSS（' + p.name + ' · ' + p.en + '）\n' +
    '   配合「CSS 变量」导出一起使用：先复制 :root / [data-theme="dark"]，再复制本文件\n' +
    '   字体：系统原生栈，零依赖（展示 ' + p.en + ' 栈 · 正文系统无衬线 · 数据系统等宽）\n' +
    '   所有取值都引用 CSS 变量，换肤只改变量不碰组件\n' +
    '   风格约定：' + p.rules.map(r => r[0]).join(' / ') + '\n' +
    '   ═══════════════════════════════════════════ */\n\n' +
    exportComponentCSS(id);
}

/* ── 高级出口 3：Tailwind config ── */

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

/* ── 高级出口 4：W3C Design Tokens JSON ── */

function buildJSONTokens(tokens) {
  const out = { color: {}, dimension: {}, string: {} };
  tokens.forEach(t => {
    const key = t.name.replace(/^--color-/, '').replace(/^--space-/, '').replace(/^--radius-/, 'radius.').replace(/^--shadow-/, 'shadow.').replace(/^--gradient-/, 'gradient.').replace(/^--/, '');
    const isColor = t.light && t.light.charAt(0) === '#';
    if (isColor) {
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

/* ── 高级出口 5：CSS 变量 ── */

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
