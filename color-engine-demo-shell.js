/* ============================================================
   COLOR ENGINE DEMO · SHELL — 预览外壳与渲染入口
   依赖：上面四个 demo 文件 + design-profiles.js + color-engine-render.js
   职责：演示状态（当前风格 / 用途 / 最近一次 tokens）、风格选择卡与缩略预览、
        同一内容的比较样张、规则条，以及 renderComponents 渲染入口与
        setDemoType / setDemoStyle 两个切换函数。
   ============================================================ */

let currentDemoType = 'landing';
let currentDemoStyle = DEFAULT_STYLE;
let _lastDemoTokens = null;

/* ── 风格缩略预览：从真实样式生成 ────────────────────────
   内容 4× 宽后用 transform: scale(.25) 缩到卡片里，因此缩略图与完整案例
   共用同一份类、同一份世界变量——不会出现"宣传图与案例不一致"。 */

function thumbMediaFor(style) {
  const media = {
    standard: pulseChartSVG,
    soft: breathRingSVG,
    glass: nexusGraphSVG,
    editorial: mastheadSVG,
    sepia: sepiaFolioSVG,
    poster: posterMarkSVG,
    gallery: function () { return '<img src="assets/work-demo-02.svg" alt="">'; }
  };
  return (media[style] || pulseChartSVG)();
}

function thumbRowFor(style) {
  if (style === 'poster') {
    return '<section class="ce-block-grid">' +
      '<div class="ce-block ce-block--accent"><h2 class="ce-block-title">色块承担分区</h2><p class="ce-block-copy">一块说主题，一块放行动。</p></div>' +
      '<div class="ce-block ce-block--ink"><h2 class="ce-block-title">方角硬投影</h2><p class="ce-block-copy">0 圆角 + 2px 描边。</p></div>' +
    '</section>';
  }
  if (style === 'sepia') {
    return '<section class="ce-plate">' +
      '<div class="ce-archive-row"><span class="ce-archive-no">稿 001</span><span class="ce-archive-val">地方志 · 城西水道记</span><span class="ce-archive-lead"></span><span class="ce-page-no">P. 018</span></div>' +
      '<div class="ce-archive-row"><span class="ce-archive-no">函 014</span><span class="ce-archive-val">私人信札 · 民国二十六年</span><span class="ce-archive-lead"></span><span class="ce-page-no">P. 042</span></div>' +
      '<div class="ce-archive-row"><span class="ce-archive-no">刊 007</span><span class="ce-archive-val">旧刊残页 · 城南画报</span><span class="ce-archive-lead"></span><span class="ce-page-no">P. 096</span></div>' +
    '</section>';
  }
  if (style === 'editorial') {
    return '<section class="ce-plate">' +
      '<div class="ce-catalog-item"><span class="ce-catalog-key">专栏</span><span class="ce-catalog-val">夜间摄影 · 十二帧</span></div>' +
      '<div class="ce-catalog-item"><span class="ce-catalog-key">随笔</span><span class="ce-catalog-val">城市切片 · 三则</span></div>' +
      '<div class="ce-catalog-item"><span class="ce-catalog-key">地图</span><span class="ce-catalog-val">夜航地图 · 跨页</span></div>' +
    '</section>';
  }
  if (style === 'gallery') {
    return '<section class="ce-works">' + GALLERY_WORKS.slice(1, 3).map(galleryWorkHTML).join('') + '</section>';
  }
  return '<section class="ce-metrics">' +
    '<div class="ce-metric"><span class="ce-metric-num">128.4k</span><span class="ce-metric-label">月活跃用户</span><span class="ce-metric-delta">▲ 12%</span></div>' +
    '<div class="ce-metric"><span class="ce-metric-num">4.2%</span><span class="ce-metric-label">整体转化率</span><span class="ce-metric-delta">▲ 0.6pt</span></div>' +
    '<div class="ce-metric"><span class="ce-metric-num">¥38.6</span><span class="ce-metric-label">平均客单价</span><span class="ce-metric-delta">▲ 5%</span></div>' +
  '</section>';
}

function styleThumbInner(style) {
  const p = getProfile(style);
  // aria-hidden：缩略图是「画面」，读屏由卡片自身的名称与说明承担，避免读出两遍内容
  return '<div class="ce-thumb" aria-hidden="true">' +
    '<div class="ce-thumb-inner">' +
      '<div class="ce-landing ce-style-' + p.id + '"><div class="ce-column">' +
        '<nav class="ce-topbar">' +
          '<a class="ce-logo" href="#"><span class="ce-logo-name">' + p.name + '</span><span class="ce-logo-sub">' + p.en + '</span></a>' +
          '<nav class="ce-nav"><span class="ce-nav-link">导航一</span><span class="ce-nav-link">导航二</span></nav>' +
          '<span class="ce-spacer"></span>' +
          '<button class="ce-btn ce-btn-accent ce-btn-sm">主要行动</button>' +
        '</nav>' +
        '<header class="ce-hero' + (p.id === 'sepia' ? ' ce-sheet' : '') + '">' +
          '<div>' +
            '<h1 class="ce-hero-title">标题在这里，<br>看字形与分量</h1>' +
            '<p class="ce-hero-sub">同一段文字排七次，差异只该来自排版、材料与构图。</p>' +
            '<div class="ce-hero-actions"><button class="ce-btn ce-btn-accent ce-btn-sm">主按钮</button><a class="ce-text-link">次要链接</a></div>' +
          '</div>' +
          '<figure class="ce-prism">' + thumbMediaFor(p.id) + '</figure>' +
        '</header>' +
        thumbRowFor(p.id) +
      '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
}

/* 风格选择卡：用 div[role=radio] 承载，不用 <button>。
   原因：缩略图本身就是一段真实页面（里面有按钮和链接），把缩略图放进 <button>
   会被 HTML 解析器在内层 <button> 处提前闭合外层按钮，内容散成兄弟节点、布局整块塌掉。
   键盘可达性用 roving tabindex + 方向键自己实现。 */
function renderStylePicker() {
  const picker = document.getElementById('style-picker');
  if (!picker) return;
  picker.innerHTML = STYLE_IDS.map(function (id) {
    const p = getProfile(id);
    return '<div class="ce-style-card" role="radio" aria-checked="false" tabindex="-1" data-style="' + p.id + '" ' +
      'onclick="setDemoStyle(\'' + p.id + '\', this)" title="' + escapeHtml(p.tagline) + '">' +
      styleThumbInner(p.id) +
      '<span class="ce-style-meta"><b>' + escapeHtml(p.name) + '</b><i>' + escapeHtml(p.en) + '</i></span>' +
      '<span class="ce-style-desc">' + escapeHtml(p.tagline) + '</span>' +
    '</div>';
  }).join('');
  picker.onkeydown = onStylePickerKeydown;
  updateStylePickerActive();
}

function stylePickerCards() {
  const picker = document.getElementById('style-picker');
  return picker ? Array.prototype.slice.call(picker.querySelectorAll('.ce-style-card')) : [];
}

function onStylePickerKeydown(e) {
  const cards = stylePickerCards();
  if (!cards.length) return;
  const here = cards.indexOf(document.activeElement);
  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
  if (step) {
    e.preventDefault();
    const next = cards[(here + step + cards.length) % cards.length] || cards[0];
    next.focus();
    return;
  }
  if (e.key === 'Home' || e.key === 'End') {
    e.preventDefault();
    cards[e.key === 'Home' ? 0 : cards.length - 1].focus();
    return;
  }
  if ((e.key === ' ' || e.key === 'Enter') && here !== -1) {
    e.preventDefault();
    setDemoStyle(cards[here].dataset.style, cards[here]);
  }
}

function updateStylePickerActive() {
  const picker = document.getElementById('style-picker');
  if (!picker) return;
  const active = normalizeStyleId(currentDemoStyle);
  stylePickerCards().forEach(function (card) {
    const on = card.dataset.style === active;
    card.classList.toggle('is-active', on);
    card.setAttribute('aria-checked', on ? 'true' : 'false');
    // roving tabindex：只有选中项在 Tab 序里，组内用方向键移动
    card.setAttribute('tabindex', on ? '0' : '-1');
  });
  // 缩略图跟随当前预览主题，颜色与主预览一致
  picker.setAttribute('data-theme', previewTheme());
}

function previewTheme() {
  return window._previewTheme === 'dark' ? 'dark' : 'light';
}

/* ── 同一内容的比较样张：差异必须来自排版、材料与构图 ──── */

function compareSampleHTML() {
  return STYLE_IDS.map(function (id) {
    const p = getProfile(id);
    return '<div class="ce-compare-cell" data-theme="' + previewTheme() + '">' +
      '<div class="ce-compare-label">' + escapeHtml(p.name) + ' <span>' + escapeHtml(p.en) + '</span></div>' +
      '<div class="ce-landing ce-style-' + p.id + ' ce-compare-page"><div class="ce-column">' +
        /* 标题里主动断行：中文在无断点时会逐字折行，等格宽下会断出「算清 / 楚」这种半个词。
           真实案例里每套标题也都是显式 <br>，这里保持一致，顺带让七个格子折行位置可比。 */
        '<h3 class="ce-hero-title">把每一次转化<br>算清楚</h3>' +
        '<p class="ce-hero-sub">同一段内容、同一组 tokens，只换风格：先看标题与正文，再看卡片与状态。</p>' +
        '<div class="ce-hero-actions">' +
          '<button class="ce-btn ce-btn-accent ce-btn-sm">主要行动</button>' +
          '<a class="ce-text-link">次要链接</a>' +
        '</div>' +
        '<div class="ce-metrics">' +
          '<div class="ce-metric"><span class="ce-metric-num">128.4k</span><span class="ce-metric-label">月活跃用户</span></div>' +
          '<div class="ce-metric"><span class="ce-metric-num">4.2%</span><span class="ce-metric-label">整体转化率</span></div>' +
        '</div>' +
        '<div class="ce-row">' +
          '<span class="ce-row-desig">渠道转化日报</span>' +
          '<span class="ce-row-time">09:00</span>' +
          '<span class="ce-row-status is-success">已就绪</span>' +
        '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');
}

function renderCompareSample() {
  const el = document.getElementById('compare-sample');
  if (!el) return;
  el.setAttribute('data-theme', previewTheme());
  if (el.dataset.rendered !== '1') {
    el.innerHTML = compareSampleHTML();
    el.dataset.rendered = '1';
  }
}

/* ── 规则条：随风格切换的设计约定文本（与 STYLES.md 一致） ── */

function updateRulesStrip(style) {
  const p = getProfile(style);
  const titleEl = document.getElementById('rules-strip-title');
  const itemsEl = document.getElementById('rules-strip-items');
  if (!titleEl || !itemsEl) return;
  const head = p.name + '世界 · ' + p.tagline + ' ';
  if (titleEl.firstChild && titleEl.firstChild.nodeType === 3) titleEl.firstChild.nodeValue = head;
  else titleEl.insertBefore(document.createTextNode(head), titleEl.firstChild);
  itemsEl.innerHTML = profileRules(p.id).map(function (r) {
    return '<div class="rules-strip-item"><b class="rs-k">' + r[0] + '</b>' + r[1] + '</div>';
  }).join('');
}

/* ── 渲染入口 ──────────────────────────────────────── */

function renderComponents(tokens) {
  _lastDemoTokens = tokens;
  currentDemoStyle = normalizeStyleId(currentDemoStyle);
  if (currentDemoType !== 'app') currentDemoType = 'landing';

  const tokenStyle = document.getElementById('generated-tokens');
  if (tokenStyle) {
    const colorTokens = tokens.filter(t => t.light && String(t.light).startsWith('#'));
    const cssVarsLight = tokens.map(t => `${t.name}: ${t.light};`).join('\n');
    const cssVarsDark = colorTokens.map(t => `${t.name}: ${t.dark};`).join('\n');
    // [data-theme="light"] 与 :root 同源：让缩略预览 / 比较样张可以强制浅色
    tokenStyle.textContent =
      ':root, [data-theme="light"] { ' + cssVarsLight + ' }\n' +
      '[data-theme="dark"] { ' + cssVarsDark + ' }';
  }

  // 骨架 + 七种风格样式：只放一份在文档作用域，预览 / 缩略图 / 比较样张 / 全屏共用
  const cssEl = document.getElementById('ce-demo-css');
  if (cssEl) cssEl.textContent = previewCSS();
  const defsEl = document.getElementById('ce-demo-defs');
  if (defsEl) defsEl.innerHTML = ceSpecDefs();

  const demo = document.getElementById('component-demo');
  if (demo) {
    demo.innerHTML = (currentDemoType === 'app' ? appDemoHTML() : landingDemoHTML());
    const demoRoot = demo.querySelector('.ce-landing, .ce-app');
    if (demoRoot) demoRoot.classList.add('ce-style-' + currentDemoStyle);
  }

  const picker = document.getElementById('style-picker');
  if (picker) {
    if (!picker.dataset.rendered) {
      renderStylePicker();
      picker.dataset.rendered = '1';
    } else {
      updateStylePickerActive();
    }
  }
  renderCompareSample();
  updateRulesStrip(currentDemoStyle);
  if (typeof updateTryColorUI === 'function') updateTryColorUI();

  if (typeof setupBidirectionalHighlight === 'function') setupBidirectionalHighlight();
}

function setDemoType(type, btn) {
  currentDemoType = type === 'app' ? 'app' : 'landing';
  const btns = document.querySelectorAll('#demo-type-toggle .theme-toggle-btn');
  btns.forEach(b => b.classList.toggle('active', b.dataset.val === currentDemoType));
  if (_lastDemoTokens) renderComponents(_lastDemoTokens);
  if (typeof saveState === 'function') saveState();
}

function setDemoStyle(style, btn) {
  const id = normalizeStyleId(style);
  const changed = id !== currentDemoStyle;
  currentDemoStyle = id;
  updateStylePickerActive();
  updateRulesStrip(id);
  // 品牌色未显式设置时，切换风格套用该风格自己的默认品牌色（重算由 interact 完成）
  const regenerated = (changed && typeof onStyleChanged === 'function') ? onStyleChanged(id) === true : false;
  if (!regenerated && _lastDemoTokens) renderComponents(_lastDemoTokens);
  if (typeof saveState === 'function') saveState();
}

