/* ============================================================
   COLOR ENGINE DEMO — 组件案例系统（同一 tokens 的 5 种风格世界）
   依赖：color-math.js, color-engine-core.js, color-engine-render.js
   ============================================================ */

let currentDemoType = 'landing';
let currentDemoStyle = 'spectrum';
let _lastDemoTokens = null;

function buildDemoCSS() {
  return `
    #comp-preview-card {
      transition: background .3s, color .3s;
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
    }
    #comp-preview-card * { box-sizing: border-box; }

    /* ── 世界变量层：同一份 HTML + 同一组 tokens，风格 = 覆盖这层变量 ──
       spectrum  纸面工业：发丝线 / 3px 倒角 / mono 数据（默认）
       soft      暖糖消费：大圆角 / 柔影 / 圆点状态
       glass     流光科技：玻璃模糊 / 辉光 / 渐变光斑
       editorial 书卷内容：衬线标题 / 大留白 / 无阴影
       standard  标准：现代 SaaS 通用面貌（无主题化装饰） */
    .ce-landing, .ce-app {
      --ce-display: "Geologica", -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
      --ce-body: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      --ce-mono: "IBM Plex Mono", "SF Mono", "Fira Code", ui-monospace, monospace;
      --ce-r-sm: 3px;                 /* 按钮 / 输入 / 侧栏项 */
      --ce-r-md: 6px;                 /* 面板 / 应用壳 */
      --ce-line: 1px;                 /* 边框粗细 */
      --ce-border-c: var(--color-border);
      --ce-card-bg: var(--color-bg-secondary);
      --ce-dot-r: 1px;                /* 状态点圆角 */
      --ce-shadow-btn: 0 1px 0 rgba(0,0,0,.08), 0 2px 10px color-mix(in srgb, var(--color-accent-base) 32%, transparent);
      --ce-shadow-inset: inset 0 2px 4px rgba(0,0,0,.14);
      font-family: var(--ce-body);
      font-variant-numeric: tabular-nums;
    }
    .ce-landing :focus-visible, .ce-app :focus-visible { outline: 2px solid var(--color-accent-base); outline-offset: 2px; }

    /* ── 共享控件 ── */
    .ce-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; border: none; border-radius: var(--ce-r-sm); font-family: var(--ce-body); font-weight: 600; cursor: pointer; text-decoration: none; transition: background .15s, box-shadow .15s, transform .15s; }
    .ce-btn-sm { padding: 8px 16px; font-size: .84rem; }
    .ce-btn-lg { padding: 13px 28px; font-size: .95rem; }
    .ce-btn-accent { background: var(--color-accent-base); color: var(--color-accent-on-accent); box-shadow: var(--ce-shadow-btn); }
    .ce-btn-accent:hover { background: var(--color-accent-hover); }
    .ce-btn-accent:active { transform: translateY(1px); box-shadow: var(--ce-shadow-inset); }
    .ce-btn-ink { background: var(--color-text-emphasis); color: var(--color-bg-primary); }
    .ce-btn-ink:hover { background: var(--color-text-primary); }
    .ce-btn-ghost { background: transparent; color: var(--color-text-secondary); }
    .ce-btn-ghost:hover { background: var(--color-bg-tertiary); color: var(--color-text-primary); }
    .ce-btn[disabled] { opacity: .45; cursor: not-allowed; box-shadow: none; }
    .ce-text-link { color: var(--color-accent-base); font-weight: 600; font-size: .9rem; text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--color-accent-base) 40%, transparent); text-underline-offset: 4px; cursor: pointer; }
    .ce-text-link:hover { text-decoration-color: var(--color-accent-base); }

    /* ── 着陆页 ── */
    .ce-landing { max-width: 920px; margin: 0 auto; padding: var(--space-2xl) 0 var(--space-5xl); display: flex; flex-direction: column; gap: var(--space-6xl); }
    .ce-topbar { display: flex; align-items: center; gap: var(--space-md); }
    .ce-logo { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; color: inherit; }
    .ce-logo-mark { display: inline-flex; }
    .ce-logo-name { font-family: var(--ce-display); font-weight: 700; font-size: .92rem; letter-spacing: .04em; }
    .ce-logo-sub { font-family: var(--ce-mono); font-size: .6rem; letter-spacing: .12em; color: var(--color-text-muted); text-transform: uppercase; }
    .ce-nav { display: flex; gap: var(--space-md); margin-left: var(--space-lg); }
    .ce-nav-link { font-size: .84rem; font-weight: 500; color: var(--color-text-secondary); cursor: pointer; padding: 4px 2px; border-bottom: 1px solid transparent; }
    .ce-nav-link:hover { color: var(--color-text-primary); border-bottom-color: var(--ce-border-c); }
    .ce-spacer { flex: 1; }

    .ce-hero { display: grid; grid-template-columns: 1.05fr .95fr; gap: var(--space-3xl); align-items: center; }
    @media (max-width: 680px) { .ce-hero { grid-template-columns: 1fr; } }
    .ce-hero-title { font-family: var(--ce-display); font-weight: 700; font-size: clamp(1.85rem, 4.2vw, 2.9rem); line-height: 1.12; letter-spacing: -.02em; color: var(--color-text-emphasis); max-width: 18ch; }
    .ce-hero-sub { margin-top: var(--space-md); color: var(--color-text-secondary); font-size: .98rem; line-height: 1.7; max-width: 46ch; }
    .ce-hero-actions { display: flex; align-items: center; gap: var(--space-md); margin-top: var(--space-lg); }
    .ce-hero-meta { margin-top: var(--space-lg); font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .05em; color: var(--color-text-muted); display: flex; gap: var(--space-sm); flex-wrap: wrap; }

    .ce-prism { margin: 0; position: relative; }
    .ce-prism svg { display: block; width: 100%; height: auto; }
    .ce-prism-caption { font-family: var(--ce-mono); font-size: .64rem; letter-spacing: .05em; color: var(--color-text-muted); margin-top: 8px; text-align: center; }
    .ce-band { opacity: 0; transform: translateX(-8px); animation: ceBandIn .5s cubic-bezier(.22,.9,.3,1) forwards; }
    @keyframes ceBandIn { to { opacity: 1; transform: translateX(0); } }
    @media (prefers-reduced-motion: reduce) { .ce-band { opacity: 1; transform: none; animation: none; } }

    /* ── 观测排程数据板 ── */
    .ce-plate { border-top: var(--ce-line) solid var(--ce-border-c); padding-top: var(--space-2xl); }
    .ce-plate-head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap; margin-bottom: var(--space-md); }
    .ce-plate-title { font-family: var(--ce-display); font-size: 1.25rem; font-weight: 700; letter-spacing: -.01em; color: var(--color-text-emphasis); }
    .ce-plate-epoch { font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .06em; color: var(--color-text-muted); }
    .ce-row { display: grid; grid-template-columns: 110px 1fr 130px 96px; gap: var(--space-md); align-items: center; padding: 12px 8px; transition: background .12s; }
    .ce-row + .ce-row { border-top: var(--ce-line) solid var(--ce-border-c); }
    .ce-row:hover { background: var(--color-bg-tertiary); }
    .ce-row-desig { font-family: var(--ce-mono); font-size: .78rem; font-weight: 500; color: var(--color-text-primary); }
    .ce-row-spec { height: 18px; width: 100%; }
    .ce-row-time { font-family: var(--ce-mono); font-size: .72rem; color: var(--color-text-secondary); text-align: right; }
    .ce-row-status { display: inline-flex; align-items: center; gap: 7px; font-size: .74rem; font-weight: 600; color: var(--color-text-secondary); }
    .ce-row-status::before { content: ""; width: 7px; height: 7px; background: var(--color-text-muted); border-radius: var(--ce-dot-r); }
    .ce-row-status.is-accent::before { background: var(--color-accent-base); }
    .ce-row-status.is-success::before { background: var(--color-success); }
    .ce-row-empty { color: var(--color-text-muted); grid-template-columns: 1fr; justify-items: center; padding: 20px 8px; font-size: .78rem; }
    .ce-row-empty::before { content: "∅ 空窗口等待分配"; font-family: var(--ce-mono); letter-spacing: .04em; }

    /* ── 谱线库 / 今夜窗口 分栏 ── */
    .ce-split { display: grid; grid-template-columns: 1.1fr .9fr; gap: var(--space-4xl); align-items: start; }
    @media (max-width: 680px) { .ce-split { grid-template-columns: 1fr; } }
    .ce-split-title { font-family: var(--ce-display); font-size: 1.25rem; font-weight: 700; letter-spacing: -.01em; color: var(--color-text-emphasis); }
    .ce-split-copy { margin-top: var(--space-sm); color: var(--color-text-secondary); font-size: .92rem; line-height: 1.7; max-width: 52ch; }
    .ce-catalog { margin-top: var(--space-md); display: flex; flex-direction: column; }
    .ce-catalog-item { display: flex; gap: var(--space-sm); align-items: baseline; padding: 7px 0; border-bottom: var(--ce-line) solid var(--ce-border-c); font-size: .84rem; }
    .ce-catalog-item:last-child { border-bottom: none; }
    .ce-catalog-key { font-family: var(--ce-mono); font-size: .7rem; color: var(--color-accent-base); flex-shrink: 0; width: 74px; }
    .ce-catalog-val { color: var(--color-text-secondary); }

    .ce-window { position: relative; padding-left: var(--space-lg); }
    .ce-window::before { content: ""; position: absolute; left: 0; top: 6px; bottom: 6px; width: var(--ce-line); background: var(--ce-border-c); }
    .ce-window-row { display: flex; align-items: center; gap: var(--space-sm); padding: 7px 0 7px var(--space-md); font-size: .8rem; color: var(--color-text-secondary); }
    .ce-window-dot { width: 7px; height: 7px; border-radius: var(--ce-dot-r); background: var(--ce-border-c); flex-shrink: 0; }
    .ce-window-row.booked .ce-window-dot { background: var(--color-accent-base); }
    .ce-window-row.booked { color: var(--color-text-primary); }
    .ce-window-time { font-family: var(--ce-mono); font-size: .7rem; color: var(--color-text-muted); margin-left: auto; }

    .ce-footer { border-top: var(--ce-line) solid var(--ce-border-c); padding-top: var(--space-md); display: flex; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap; font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .04em; color: var(--color-text-muted); }

    /* ── 工作台（Operate）── */
    .ce-app { display: grid; grid-template-columns: 212px 1fr; min-height: 560px; border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-md); overflow: hidden; background: var(--color-bg-primary); }
    @media (max-width: 760px) { .ce-app { grid-template-columns: 1fr; } }
    .ce-sidebar { border-right: var(--ce-line) solid var(--ce-border-c); padding: var(--space-lg) var(--space-md); display: flex; flex-direction: column; gap: var(--space-lg); background: var(--color-bg-secondary); }
    .ce-side-nav { display: flex; flex-direction: column; gap: 2px; }
    .ce-side-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: var(--ce-r-sm); border-left: 1px solid transparent; font-size: .84rem; font-weight: 500; color: var(--color-text-secondary); cursor: pointer; }
    .ce-side-item:hover { background: var(--color-bg-tertiary); color: var(--color-text-primary); }
    .ce-side-item.is-active { border-left-color: var(--color-accent-base); background: var(--color-bg-tertiary); color: var(--color-text-primary); font-weight: 600; }
    .ce-side-foot { margin-top: auto; font-family: var(--ce-mono); font-size: .62rem; letter-spacing: .05em; color: var(--color-text-muted); padding: 8px 12px; }

    .ce-app-main { display: flex; flex-direction: column; min-width: 0; }
    .ce-app-topbar { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md) var(--space-lg); border-bottom: var(--ce-line) solid var(--ce-border-c); }
    .ce-app-title { font-family: var(--ce-display); font-size: 1.02rem; font-weight: 700; letter-spacing: -.01em; color: var(--color-text-emphasis); }
    .ce-app-sub { font-family: var(--ce-mono); font-size: .64rem; letter-spacing: .05em; color: var(--color-text-muted); margin-left: 10px; }
    .ce-search { margin-left: auto; }
    .ce-search input { font-family: var(--ce-body); font-size: .8rem; color: var(--color-text-primary); background: var(--color-bg-secondary); border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-sm); padding: 7px 12px; width: 200px; }
    .ce-search input::placeholder { color: var(--color-text-muted); }
    .ce-search input:focus { outline: 2px solid var(--color-accent-base); outline-offset: 1px; border-color: transparent; }
    .ce-user { font-family: var(--ce-mono); font-size: .7rem; color: var(--color-text-secondary); white-space: nowrap; }

    .ce-app-grid { display: grid; grid-template-columns: 300px 1fr; gap: var(--space-md); padding: var(--space-md) var(--space-lg) var(--space-lg); }
    @media (max-width: 860px) { .ce-app-grid { grid-template-columns: 1fr; } }
    .ce-panel { border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-md); background: var(--ce-card-bg); }
    .ce-panel-spectrum { grid-row: span 2; }
    .ce-panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-sm); padding: 12px 16px; border-bottom: var(--ce-line) solid var(--ce-border-c); }
    .ce-panel-title { font-family: var(--ce-display); font-size: .84rem; font-weight: 700; color: var(--color-text-emphasis); }
    .ce-panel-count { font-family: var(--ce-mono); font-size: .64rem; color: var(--color-text-muted); }
    .ce-panel-body { padding: 8px 16px 16px; }
    .ce-target { display: flex; align-items: center; gap: 10px; padding: 9px 4px; border-bottom: var(--ce-line) solid var(--ce-border-c); font-size: .8rem; }
    .ce-target:last-child { border-bottom: none; }
    .ce-target-desig { font-family: var(--ce-mono); font-size: .74rem; color: var(--color-text-primary); }
    .ce-target-status { margin-left: auto; font-size: .68rem; font-weight: 600; color: var(--color-text-secondary); }
    .ce-target-status::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: var(--ce-dot-r); background: var(--color-text-muted); margin-right: 6px; }
    .ce-target-status.ok::before { background: var(--color-success); }
    .ce-target-status.run::before { background: var(--color-accent-base); }

    .ce-spectrum { width: 100%; display: block; }
    .ce-spectrum-legend { display: flex; gap: var(--space-lg); margin-top: 10px; font-family: var(--ce-mono); font-size: .62rem; letter-spacing: .04em; color: var(--color-text-muted); flex-wrap: wrap; }
    .ce-spectrum-legend b { color: var(--color-text-secondary); font-weight: 500; }

    .ce-panel-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: .78rem; color: var(--color-text-secondary); }
    .ce-panel-row + .ce-panel-row { border-top: var(--ce-line) solid var(--ce-border-c); }

    @media (max-width: 680px) {
      .ce-row { grid-template-columns: 90px 1fr 90px; }
      .ce-row .ce-row-spec { display: none; }
      .ce-search input { width: 130px; }
    }
  `;
}

// ── 风格系统：同一份 HTML + 同一组 tokens，不同视觉世界 ──
// 每个风格 = 世界变量覆盖 + 专属规则。切换风格只换 CSS，不动结构、不动 token。

function demoStyleCSS(style) {
  const css = {
    // 暖糖：消费级亲切感 —— 大圆角、柔影、圆点状态、浅边框
    soft: `
      .ce-style-soft { --ce-r-sm: 14px; --ce-r-md: 20px; --ce-line: 1px; --ce-dot-r: 50%; --ce-card-bg: var(--color-surface-raised); --ce-border-c: color-mix(in srgb, var(--color-border) 55%, transparent); --ce-shadow-btn: 0 1px 2px rgba(0,0,0,.06), 0 6px 18px color-mix(in srgb, var(--color-accent-base) 26%, transparent); --ce-shadow-inset: inset 0 2px 4px rgba(0,0,0,.08); }
      .ce-style-soft .ce-btn-accent:hover { transform: translateY(-1px); }
      .ce-style-soft .ce-panel, .ce-style-soft .ce-app { box-shadow: 0 12px 32px -14px color-mix(in srgb, var(--color-text-emphasis) 22%, transparent); }
      .ce-style-soft .ce-hero-title { letter-spacing: -.01em; }
      .ce-style-soft .ce-logo-name { letter-spacing: .06em; }
    `,
    // 流光：AI / SaaS 科技感 —— 玻璃模糊、辉光按钮、渐变光斑
    glass: `
      .ce-style-glass { --ce-r-sm: 10px; --ce-r-md: 16px; --ce-line: 1px; --ce-dot-r: 50%; --ce-card-bg: color-mix(in srgb, var(--color-bg-secondary) 76%, transparent); --ce-shadow-btn: 0 0 0 1px color-mix(in srgb, var(--color-accent-base) 20%, transparent), 0 8px 26px color-mix(in srgb, var(--color-accent-base) 42%, transparent); --ce-shadow-inset: inset 0 1px 2px rgba(0,0,0,.12); }
      .ce-style-glass .ce-hero { position: relative; }
      .ce-style-glass .ce-hero::before { content: ""; position: absolute; z-index: 0; left: -15%; top: -45%; width: 70%; height: 130%; background: radial-gradient(closest-side, color-mix(in srgb, var(--color-accent-subtle) 65%, transparent), transparent 75%); pointer-events: none; }
      .ce-style-glass .ce-hero > * { position: relative; z-index: 1; }
      .ce-style-glass .ce-app, .ce-style-glass .ce-panel { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); }
      .ce-style-glass .ce-hero-title { letter-spacing: -.015em; }
    `,
    // 书卷：内容 / 品牌 —— 衬线标题、大留白、无阴影、强调克制
    editorial: `
      .ce-style-editorial { --ce-r-sm: 2px; --ce-r-md: 4px; --ce-line: 1px; --ce-dot-r: 1px; --ce-display: "Songti SC", "Noto Serif SC", Georgia, "Times New Roman", serif; --ce-shadow-btn: none; --ce-shadow-inset: none; }
      .ce-landing.ce-style-editorial { gap: var(--space-7xl); }
      .ce-style-editorial .ce-hero-title { letter-spacing: 0; }
      .ce-style-editorial .ce-logo-name { font-family: var(--ce-display); letter-spacing: .04em; }
      .ce-style-editorial .ce-btn { letter-spacing: .04em; }
      .ce-style-editorial .ce-btn-accent { box-shadow: none; }
      .ce-style-editorial .ce-panel, .ce-style-editorial .ce-app { box-shadow: none; }
    `,
    // 标准：现代 SaaS 通用面貌 —— 白卡浮浅底、适中圆角、柔和双层阴影、零装饰
    // 风格体系里的「中间值」：无主题化字体/网格/印章，任何产品拿起来都能用
    standard: `
      .ce-style-standard {
        --ce-r-sm: 8px; --ce-r-md: 12px; --ce-line: 1px; --ce-dot-r: 50%;
        --ce-display: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
        --ce-border-c: var(--color-border);
        --ce-card-bg: var(--color-bg-secondary);
        --ce-shadow-btn: 0 1px 2px rgba(0,0,0,.05), 0 4px 12px color-mix(in srgb, var(--color-accent-base) 22%, transparent);
        --ce-shadow-inset: inset 0 1px 2px rgba(0,0,0,.08);
      }
      /* 卡片统一：柔和双层阴影，hover 轻微上浮 */
      .ce-style-standard .ce-panel, .ce-app.ce-style-standard {
        box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 8px 24px -12px color-mix(in srgb, var(--color-text-emphasis) 14%, transparent);
        transition: box-shadow .15s, transform .15s;
      }
      .ce-style-standard .ce-panel:hover { transform: translateY(-1px); box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 12px 28px -12px color-mix(in srgb, var(--color-text-emphasis) 18%, transparent); }
      .ce-style-standard .ce-btn-accent:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 6px 16px color-mix(in srgb, var(--color-accent-base) 28%, transparent); }
      .ce-style-standard .ce-btn-accent:active { transform: translateY(0); box-shadow: var(--ce-shadow-inset); }
      /* 行悬停：浅背景（标准列表交互） */
      .ce-style-standard .ce-row:hover { background: var(--color-bg-tertiary); }
      /* 标题：常规字距，克制的层级 */
      .ce-style-standard .ce-hero-title { letter-spacing: -.015em; }
    `
  };
  return css[style] || '';
}
function renderComponents(tokens) {
  _lastDemoTokens = tokens;
  const tokenStyle = document.getElementById('generated-tokens');
  const colorTokens = tokens.filter(t => t.light && String(t.light).startsWith('#'));

  // Demo 变量从 Token 单一数据源派生（与 CSS 导出、对照表同源）。
  // 注意：:root 必须注入全部 token（颜色 + 间距 + 排版 + 圆角 + 阴影），
  // 示例 CSS 引用 var(--space-*) 才能生效——只注入颜色会让所有间距塌成 0
  const cssVarsLight = tokens.map(t => `${t.name}: ${t.light};`).join('\n');
  // 暗色块只需覆盖随主题变化的颜色；间距/排版等主题无关 token 在 :root 定义后自动继承
  const cssVarsDark = colorTokens.map(t => `${t.name}: ${t.dark};`).join('\n');

  tokenStyle.textContent = `
    :root { ${cssVarsLight} }
    [data-theme="dark"] { ${cssVarsDark} }
  `;

  const demo = document.getElementById('component-demo');
  demo.innerHTML = '<style>' + buildDemoCSS() + demoStyleCSS(currentDemoStyle) + '</style>' + ceSpecDefs() +
    (currentDemoType === 'app' ? appDemoHTML() : landingDemoHTML());

  // 风格 class 挂到示例根元素：全屏克隆时自动携带
  const demoRoot = demo.querySelector('.ce-landing, .ce-app');
  if (demoRoot) demoRoot.classList.add('ce-style-' + currentDemoStyle);

  // 色块 ↔ 组件双向高亮：demo 重新渲染后需重新绑定
  if (typeof setupBidirectionalHighlight === 'function') setupBidirectionalHighlight();
}

function setDemoType(type, btn) {
  currentDemoType = type;
  const btns = document.querySelectorAll('#demo-type-toggle .theme-toggle-btn');
  btns.forEach(b => b.classList.toggle('active', b.dataset.val === type));
  if (_lastDemoTokens) renderComponents(_lastDemoTokens);
  if (typeof saveState === 'function') saveState();
}

function setDemoStyle(style, btn) {
  currentDemoStyle = style;
  const btns = document.querySelectorAll('#demo-style-toggle .theme-toggle-btn');
  btns.forEach(b => b.classList.toggle('active', b.dataset.val === style));
  if (_lastDemoTokens) renderComponents(_lastDemoTokens);
  if (typeof saveState === 'function') saveState();
}

// ── 光谱渐变定义（两个示例共用同一 id） ──────────────

function ceSpecDefs() {
  return '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<defs><linearGradient id="ce-spec" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" style="stop-color:var(--color-accent-subtle)"/>' +
    '<stop offset=".5" style="stop-color:var(--color-accent-base)"/>' +
    '<stop offset="1" style="stop-color:var(--color-accent-active)"/>' +
    '</linearGradient></defs></svg>';
}

// ── 着陆页：棱镜色散 = 机制的戏剧化演示 ───────────────

function prismSVG() {
  return '<svg viewBox="0 0 600 300" role="img" aria-label="品牌光经过棱镜分散为整套色阶" fill="none">' +
    '<rect x="26" y="143" width="150" height="14" rx="2" style="fill:var(--color-accent-base)"/>' +
    '<path d="M206 96 L206 204 L300 150 Z" style="fill:var(--color-bg-secondary);stroke:var(--color-text-primary)" stroke-width="1.5" stroke-linejoin="round"/>' +
    '<polygon class="ce-band" style="fill:var(--color-accent-subtle);animation-delay:.05s" points="300,150 540,58 540,104"/>' +
    '<polygon class="ce-band" style="fill:var(--color-focus-ring);animation-delay:.14s" points="300,150 540,104 540,134"/>' +
    '<polygon class="ce-band" style="fill:var(--color-accent-base);animation-delay:.23s" points="300,150 540,134 540,184"/>' +
    '<polygon class="ce-band" style="fill:var(--color-accent-hover);animation-delay:.32s" points="300,150 540,184 540,214"/>' +
    '<polygon class="ce-band" style="fill:var(--color-accent-active);animation-delay:.41s" points="300,150 540,214 540,262"/>' +
    '<text x="548" y="87" class="ce-band" style="animation-delay:.05s;fill:var(--color-text-muted);font-family:var(--ce-mono);font-size:10px">subtle</text>' +
    '<text x="548" y="125" class="ce-band" style="animation-delay:.14s;fill:var(--color-text-muted);font-family:var(--ce-mono);font-size:10px">focus</text>' +
    '<text x="548" y="165" class="ce-band" style="animation-delay:.23s;fill:var(--color-text-primary);font-family:var(--ce-mono);font-size:10px">base</text>' +
    '<text x="548" y="205" class="ce-band" style="animation-delay:.32s;fill:var(--color-text-primary);font-family:var(--ce-mono);font-size:10px">hover</text>' +
    '<text x="548" y="244" class="ce-band" style="animation-delay:.41s;fill:var(--color-text-primary);font-family:var(--ce-mono);font-size:10px">active</text>' +
    '</svg>';
}

function specStripSVG(notches) {
  return '<svg class="ce-row-spec" viewBox="0 0 220 18" preserveAspectRatio="none" aria-hidden="true">' +
    '<rect y="7" width="220" height="4" style="fill:url(#ce-spec)"/>' +
    notches.map(n => '<rect x="' + n.x + '" y="5.5" width="' + (n.w || 3) + '" height="7" style="fill:var(--color-text-primary);opacity:.8"/>').join('') +
    '</svg>';
}

function landingDemoHTML() {
  return '<div class="ce-landing">' +
    '<nav class="ce-topbar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 17L10.5 5h3L20 17" stroke="var(--color-accent-base)" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 17L12 9l3.5 8" stroke="var(--color-text-secondary)" stroke-width="1.1" stroke-linejoin="round" opacity=".55"/></svg>' +
        '<span class="ce-logo-name">SOLSTICE</span>' +
        '<span class="ce-logo-sub">天文观测平台</span>' +
      '</a>' +
      '<nav class="ce-nav">' +
        '<span class="ce-nav-link" data-token="neutral-400">观测计划</span>' +
        '<span class="ce-nav-link" data-token="neutral-400">谱线库</span>' +
        '<span class="ce-nav-link" data-token="neutral-400">数据流</span>' +
      '</nav>' +
      '<span class="ce-spacer"></span>' +
      '<button class="ce-btn ce-btn-ghost ce-btn-sm">登录</button>' +
      '<button class="ce-btn ce-btn-accent ce-btn-sm" data-token="accent-200">创建计划</button>' +
    '</nav>' +
    '<header class="ce-hero">' +
      '<div>' +
        '<h1 class="ce-hero-title" data-token="neutral-600">让每一夜观测<br>排在正确的星下</h1>' +
        '<p class="ce-hero-sub" data-token="neutral-400">Solstice 把望远镜排程、目标光谱与协作记录收进同一张星图。输入观测目标，几分钟内得到可用窗口与光谱预测。</p>' +
        '<div class="ce-hero-actions">' +
          '<button class="ce-btn ce-btn-accent ce-btn-lg" data-token="accent-200">创建观测计划</button>' +
          '<a class="ce-text-link" data-token="accent-200">查看示例计划</a>' +
        '</div>' +
        '<div class="ce-hero-meta"><span>EPOCH 2026.4</span><span>·</span><span>12 台望远镜在线</span><span>·</span><span>UTC+8</span></div>' +
      '</div>' +
      '<figure class="ce-prism">' + prismSVG() +
        '<figcaption class="ce-prism-caption">品牌光 → 棱镜 → 5 级强调色阶</figcaption>' +
      '</figure>' +
    '</header>' +
    '<section class="ce-plate">' +
      '<div class="ce-plate-head">' +
        '<h2 class="ce-plate-title">今晚的观测排程</h2>' +
        '<span class="ce-plate-epoch">NIGHT 1 · 2026-08-13 · 22:00 — 06:00</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">NGC 7023</span>' + specStripSVG([{x: 52}, {x: 118, w: 4}]) +
        '<span class="ce-row-time">22:40 — 00:10</span>' +
        '<span class="ce-row-status is-success">已排定</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">M57</span>' + specStripSVG([{x: 74}, {x: 141, w: 3}]) +
        '<span class="ce-row-time">00:10 — 01:50</span>' +
        '<span class="ce-row-status is-accent">观测中</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">IC 5146</span>' + specStripSVG([{x: 40}, {x: 96}, {x: 160, w: 4}]) +
        '<span class="ce-row-time">02:30 — 04:10</span>' +
        '<span class="ce-row-status">待审批</span>' +
      '</div>' +
      '<div class="ce-row ce-row-empty"></div>' +
    '</section>' +
    '<section class="ce-split">' +
      '<div>' +
        '<h2 class="ce-split-title">谱线库</h2>' +
        '<p class="ce-split-copy" data-token="neutral-400">每个目标的光谱预测按晚归档，与天气、月相、设备状态一同入档，下次排程直接调用。</p>' +
        '<div class="ce-catalog">' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">H-ALPHA</span><span class="ce-catalog-val" data-token="neutral-400">656.3 nm 发射线 · 星云目标确认</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">OIII</span><span class="ce-catalog-val" data-token="neutral-400">500.7 nm 双线 · 行星状星云判据</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">SII</span><span class="ce-catalog-val" data-token="neutral-400">671.6 nm 双线 · 超新星遗迹筛查</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="ce-window">' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>深空窄带 · T1<span class="ce-window-time">22:40</span></div>' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>系外行星凌日 · T3<span class="ce-window-time">00:10</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>广域巡天 · T5<span class="ce-window-time">02:30</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>校准与维护<span class="ce-window-time">04:45</span></div>' +
      '</div>' +
    '</section>' +
    '<footer class="ce-footer">' +
      '<span>SOLSTICE · 天文观测平台</span>' +
      '<span>示例数据为合成演示，非真实观测记录</span>' +
    '</footer>' +
  '</div>';
}

// ── 工作台：光谱查看器 ───────────────────────────────

function spectrumPlotSVG() {
  const W = 460;
  const X = n => ((n - 380) / 300) * (W - 20) + 10;
  const ticks = [380, 430, 480, 530, 580, 630, 680];
  const tickG = ticks.map(n =>
    '<g><line x1="' + X(n).toFixed(1) + '" y1="10" x2="' + X(n).toFixed(1) + '" y2="92" stroke="var(--color-border)" stroke-width="1"/>' +
    '<text x="' + X(n).toFixed(1) + '" y="108" fill="var(--color-text-muted)" font-family="var(--ce-mono)" font-size="9" text-anchor="middle">' + n + '</text></g>'
  ).join('');
  const hAlpha = X(656.3).toFixed(1);
  return '<svg class="ce-spectrum" viewBox="0 0 ' + W + ' 120" role="img" aria-label="NGC 7023 合成光谱，含吸收线与 H-ALPHA 标记线">' +
    tickG +
    '<rect y="30" width="' + W + '" height="36" style="fill:url(#ce-spec)"/>' +
    '<rect x="' + X(452).toFixed(1) + '" y="26" width="5" height="44" style="fill:var(--color-text-primary);opacity:.82"/>' +
    '<rect x="' + X(517).toFixed(1) + '" y="26" width="6" height="44" style="fill:var(--color-text-primary);opacity:.82"/>' +
    '<rect x="' + X(589).toFixed(1) + '" y="26" width="4" height="44" style="fill:var(--color-text-primary);opacity:.82"/>' +
    '<line x1="' + hAlpha + '" y1="16" x2="' + hAlpha + '" y2="78" stroke="var(--color-accent-base)" stroke-width="1.5"/>' +
    '<text x="' + hAlpha + '" y="13" fill="var(--color-accent-base)" font-family="var(--ce-mono)" font-size="9" text-anchor="middle">Hα 656.3</text>' +
    '</svg>';
}

function appDemoHTML() {
  return '<div class="ce-app">' +
    '<aside class="ce-sidebar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 17L10.5 5h3L20 17" stroke="var(--color-accent-base)" stroke-width="1.8" stroke-linejoin="round"/><path d="M8.5 17L12 9l3.5 8" stroke="var(--color-text-secondary)" stroke-width="1.1" stroke-linejoin="round" opacity=".55"/></svg>' +
        '<span class="ce-logo-name">SOLSTICE</span>' +
      '</a>' +
      '<nav class="ce-side-nav">' +
        '<span class="ce-side-item is-active" data-token="accent-200">观测计划</span>' +
        '<span class="ce-side-item" data-token="neutral-400">谱线库</span>' +
        '<span class="ce-side-item" data-token="neutral-400">目标管理</span>' +
        '<span class="ce-side-item" data-token="neutral-400">排程日历</span>' +
        '<span class="ce-side-item" data-token="neutral-400">数据流</span>' +
      '</nav>' +
      '<div class="ce-side-foot">v2.4.1 · UTC+8</div>' +
    '</aside>' +
    '<main class="ce-app-main">' +
      '<header class="ce-app-topbar">' +
        '<span class="ce-app-title">今夜排程<span class="ce-app-sub">NIGHT 1 · 8 月 13 日</span></span>' +
        '<div class="ce-search"><input type="search" placeholder="搜索目标（如 NGC 7023）" aria-label="搜索目标"></div>' +
        '<span class="ce-user" data-token="neutral-400">LIU-J · 值班</span>' +
      '</header>' +
      '<div class="ce-app-grid">' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">目标列表</span><span class="ce-panel-count" data-token="neutral-300">3 个目标 · 1 个空窗</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-target"><span class="ce-target-desig">NGC 7023</span><span class="ce-target-status ok">已排定</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">M57</span><span class="ce-target-status run">观测中</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">IC 5146</span><span class="ce-target-status">待审批</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel ce-panel-spectrum">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">光谱查看器 · NGC 7023</span><span class="ce-panel-count" data-token="neutral-300">RES 1200 · 曝光 1800s</span></div>' +
          '<div class="ce-panel-body">' + spectrumPlotSVG() +
            '<div class="ce-spectrum-legend"><span><b>色带</b> 合成光谱</span><span><b>竖线</b> 吸收线</span><span><b>红线</b> H-ALPHA 656.3 nm</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">今夜窗口</span><span class="ce-panel-count" data-token="neutral-300">晴 · 视宁度良</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>深空窄带<span class="ce-window-time">22:40</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>系外行星凌日<span class="ce-window-time">00:10</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>广域巡天<span class="ce-window-time">02:30</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>校准与维护<span class="ce-window-time">04:45</span></div>' +
          '</div>' +
        '</section>' +
      '</div>' +
    '</main>' +
  '</div>';
}
// ── 主题切换（示例卡片与全屏预览共享同一状态） ────────

