/* ============================================================
   COLOR ENGINE DEMO — 组件案例系统（同一 tokens 的 7 种风格世界）
   依赖：color-math.js, color-engine-core.js, color-engine-render.js, design-profiles.js
   职责：共享骨架 CSS、每种风格的案例页（着陆页 / 工作台）、风格缩略预览、
        同一内容的比较样张、规则条。风格的「世界变量 + 作用域样式」全部来自
        design-profiles.js——本文件不重复定义风格样式，只负责组装页面。
   ============================================================ */

let currentDemoType = 'landing';
let currentDemoStyle = DEFAULT_STYLE;
let _lastDemoTokens = null;

/* ── 共享骨架 CSS：所有风格共用同一份结构与变量层 ────────────
   风格差异通过 .ce-style-* 覆盖变量实现；未启用某风格时它的一组
   通用构件（作品 / 色块 / 书页）不产生任何视觉影响。
   字体全部系统原生栈（零依赖、离线一致），数据一律等宽 + tabular。 */
function buildDemoCSS() {
  return `
    .ce-landing, .ce-app {
      --ce-display: ${STYLE_FONT_ROLES.geometric};
      --ce-body: ${STYLE_FONT_ROLES.systemSans};
      --ce-mono: ${STYLE_FONT_ROLES.mono};
      --ce-r-sm: 3px;                 /* 按钮 / 输入 / 侧栏项 */
      --ce-r-md: 6px;                 /* 面板 / 应用壳 */
      --ce-line: 1px;                 /* 边框粗细 */
      --ce-dot-r: 1px;                /* 状态点圆角 */
      --ce-border-c: var(--color-border);
      --ce-card-bg: var(--color-bg-secondary);
      --ce-shadow-btn: 0 1px 0 rgba(0,0,0,.08), 0 2px 10px color-mix(in srgb, var(--color-accent-base) 32%, transparent);
      --ce-shadow-inset: inset 0 2px 4px rgba(0,0,0,.14);
      /* 材料语义层：默认跟随 tokens，材料主导的风格（褐页等）自行覆盖 */
      --ce-page: var(--color-bg-primary);
      --ce-rule: var(--color-border);
      --ce-ink: var(--color-text-emphasis);
      --ce-ink-2: var(--color-text-secondary);
      --ce-ghost: var(--color-text-muted);
      --ce-frame: var(--color-bg-tertiary);
      --ce-glass-bg: var(--color-bg-secondary);
      --ce-glass-edge: transparent;
      --ce-hard-x: 0px; --ce-hard-y: 0px; --ce-hard-c: transparent;
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
    .ce-text-link { color: var(--color-accent-active); font-weight: 600; font-size: .9rem; text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--color-accent-base) 45%, transparent); text-underline-offset: 4px; cursor: pointer; }
    .ce-text-link:hover { text-decoration-color: var(--color-accent-base); }

    /* ── 着陆页骨架 ── */
    .ce-landing { max-width: 920px; margin: 0 auto; padding: var(--space-2xl) 0 var(--space-5xl); display: flex; flex-direction: column; gap: var(--space-6xl); }
    .ce-topbar { display: flex; align-items: center; gap: var(--space-md); }
    .ce-logo { display: inline-flex; align-items: center; gap: 9px; text-decoration: none; color: inherit; }
    .ce-logo-mark { display: inline-flex; }
    .ce-logo-name { font-family: var(--ce-display); font-weight: 700; font-size: .92rem; letter-spacing: .04em; }
    .ce-logo-sub { font-family: var(--ce-mono); font-size: .6rem; letter-spacing: .12em; color: var(--color-text-secondary); text-transform: uppercase; }
    .ce-nav { display: flex; gap: var(--space-md); margin-left: var(--space-lg); }
    .ce-nav-link { font-size: .84rem; font-weight: 500; color: var(--color-text-secondary); cursor: pointer; padding: 4px 2px; border-bottom: 1px solid transparent; }
    .ce-nav-link:hover { color: var(--color-text-primary); border-bottom-color: var(--ce-border-c); }
    .ce-spacer { flex: 1; }

    .ce-hero { display: grid; grid-template-columns: 1.05fr .95fr; gap: var(--space-3xl); align-items: center; }
    @media (max-width: 680px) { .ce-hero { grid-template-columns: 1fr; } }
    .ce-hero-title { font-family: var(--ce-display); font-weight: 700; font-size: clamp(1.85rem, 4.2vw, 2.9rem); line-height: 1.12; letter-spacing: -.02em; color: var(--color-text-emphasis); max-width: 18ch; }
    .ce-hero-sub { margin-top: var(--space-md); color: var(--color-text-secondary); font-size: .98rem; line-height: 1.7; max-width: 46ch; }
    .ce-hero-actions { display: flex; align-items: center; gap: var(--space-md); margin-top: var(--space-lg); flex-wrap: wrap; }
    .ce-hero-meta { margin-top: var(--space-lg); font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .05em; color: var(--color-text-secondary); display: flex; gap: var(--space-sm); flex-wrap: wrap; }

    .ce-prism { margin: 0; position: relative; min-width: 0; }
    .ce-prism svg { display: block; width: 100%; height: auto; }
    .ce-prism img { display: block; width: 100%; height: auto; }
    .ce-prism-caption, .ce-fig-cap { font-family: var(--ce-mono); font-size: .64rem; letter-spacing: .05em; color: var(--color-text-secondary); margin-top: 8px; text-align: center; }

    /* ── 数据板 ── */
    .ce-plate { border-top: var(--ce-line) solid var(--ce-border-c); padding-top: var(--space-2xl); }
    .ce-plate-no { display: none; font-family: var(--ce-mono); font-size: .6rem; letter-spacing: .18em; color: var(--color-text-secondary); margin-bottom: 10px; }
    .ce-plate-head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap; margin-bottom: var(--space-md); }
    .ce-plate-title { font-family: var(--ce-display); font-size: 1.25rem; font-weight: 700; letter-spacing: -.01em; color: var(--color-text-emphasis); }
    .ce-plate-epoch { font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .06em; color: var(--color-text-secondary); }
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

    /* ── 分栏与目录 ── */
    .ce-split { display: grid; grid-template-columns: 1.1fr .9fr; gap: var(--space-4xl); align-items: start; }
    @media (max-width: 680px) { .ce-split { grid-template-columns: 1fr; } }
    .ce-split-title { font-family: var(--ce-display); font-size: 1.25rem; font-weight: 700; letter-spacing: -.01em; color: var(--color-text-emphasis); }
    .ce-split-copy { margin-top: var(--space-sm); color: var(--color-text-secondary); font-size: .92rem; line-height: 1.7; max-width: 52ch; }
    .ce-catalog { margin-top: var(--space-md); display: flex; flex-direction: column; }
    .ce-catalog-item { display: flex; gap: var(--space-sm); align-items: baseline; padding: 7px 0; border-bottom: var(--ce-line) solid var(--ce-border-c); font-size: .84rem; }
    .ce-catalog-item:last-child { border-bottom: none; }
    .ce-catalog-key { font-family: var(--ce-mono); font-size: .7rem; font-weight: 600; color: var(--color-text-secondary); flex-shrink: 0; width: 74px; }
    .ce-catalog-val { color: var(--color-text-secondary); }

    .ce-window { position: relative; padding-left: var(--space-lg); }
    .ce-window::before { content: ""; position: absolute; left: 0; top: 6px; bottom: 6px; width: var(--ce-line); background: var(--ce-border-c); }
    .ce-window-row { display: flex; align-items: center; gap: var(--space-sm); padding: 7px 0 7px var(--space-md); font-size: .8rem; color: var(--color-text-secondary); }
    .ce-window-dot { width: 7px; height: 7px; border-radius: var(--ce-dot-r); background: var(--ce-border-c); flex-shrink: 0; }
    .ce-window-row.booked .ce-window-dot { background: var(--color-accent-base); }
    .ce-window-row.booked { color: var(--color-text-primary); }
    .ce-window-time { font-family: var(--ce-mono); font-size: .7rem; color: var(--color-text-secondary); margin-left: auto; }

    .ce-footer { border-top: var(--ce-line) solid var(--ce-border-c); padding-top: var(--space-md); display: flex; justify-content: space-between; gap: var(--space-md); flex-wrap: wrap; font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .04em; color: var(--color-text-secondary); }

    /* ── 工作台骨架 ── */
    .ce-app { display: grid; grid-template-columns: 212px 1fr; min-height: 560px; border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-md); overflow: hidden; background: var(--color-bg-primary); }
    @media (max-width: 760px) { .ce-app { grid-template-columns: 1fr; } }
    .ce-sidebar { border-right: var(--ce-line) solid var(--ce-border-c); padding: var(--space-lg) var(--space-md); display: flex; flex-direction: column; gap: var(--space-lg); background: var(--color-bg-secondary); }
    .ce-side-nav { display: flex; flex-direction: column; gap: 2px; }
    .ce-side-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: var(--ce-r-sm); border-left: 1px solid transparent; font-size: .84rem; font-weight: 500; color: var(--color-text-secondary); cursor: pointer; }
    .ce-side-item:hover { background: var(--color-bg-tertiary); color: var(--color-text-primary); }
    .ce-side-item.is-active { border-left-color: var(--color-accent-base); background: var(--color-bg-tertiary); color: var(--color-text-primary); font-weight: 600; }
    .ce-side-foot { margin-top: auto; font-family: var(--ce-mono); font-size: .62rem; letter-spacing: .05em; color: var(--color-text-secondary); padding: 8px 12px; }

    .ce-app-main { display: flex; flex-direction: column; min-width: 0; }
    .ce-app-topbar { display: flex; align-items: center; gap: var(--space-md); padding: var(--space-md) var(--space-lg); border-bottom: var(--ce-line) solid var(--ce-border-c); }
    .ce-app-title { font-family: var(--ce-display); font-size: 1.02rem; font-weight: 700; letter-spacing: -.01em; color: var(--color-text-emphasis); }
    .ce-app-sub { font-family: var(--ce-mono); font-size: .64rem; letter-spacing: .05em; color: var(--color-text-secondary); margin-left: 10px; }
    .ce-search { margin-left: auto; }
    .ce-search input { font-family: var(--ce-body); font-size: .8rem; color: var(--color-text-primary); background: var(--color-bg-secondary); border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-sm); padding: 7px 12px; width: 200px; }
    .ce-search input::placeholder { color: var(--color-text-muted); }
    .ce-search input:focus { outline: 2px solid var(--color-accent-base); outline-offset: 1px; border-color: transparent; }
    .ce-user { font-family: var(--ce-mono); font-size: .7rem; color: var(--color-text-secondary); white-space: nowrap; }

    .ce-app-grid { display: grid; grid-template-columns: 300px 1fr; gap: var(--space-md); padding: var(--space-md) var(--space-lg) var(--space-lg); }
    @media (max-width: 860px) { .ce-app-grid { grid-template-columns: 1fr; } }
    .ce-panel { border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-md); background: var(--ce-card-bg); min-width: 0; }
    .ce-panel-main { grid-row: span 2; }
    .ce-panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-sm); padding: 12px 16px; border-bottom: var(--ce-line) solid var(--ce-border-c); flex-wrap: wrap; }
    .ce-panel-title { font-family: var(--ce-display); font-size: .84rem; font-weight: 700; color: var(--color-text-emphasis); }
    .ce-panel-count { font-family: var(--ce-mono); font-size: .64rem; color: var(--color-text-secondary); }
    .ce-panel-body { padding: 8px 16px 16px; }
    .ce-target { display: flex; align-items: center; gap: 10px; padding: 9px 4px; border-bottom: var(--ce-line) solid var(--ce-border-c); font-size: .8rem; }
    .ce-target:last-child { border-bottom: none; }
    .ce-target-desig { font-family: var(--ce-mono); font-size: .74rem; color: var(--color-text-primary); }
    .ce-target-status { margin-left: auto; font-size: .68rem; font-weight: 600; color: var(--color-text-secondary); }
    .ce-target-status::before { content: ""; display: inline-block; width: 6px; height: 6px; border-radius: var(--ce-dot-r); background: var(--color-text-muted); margin-right: 6px; }
    .ce-target-status.ok::before { background: var(--color-success); }
    .ce-target-status.run::before { background: var(--color-accent-base); }

    .ce-figure { width: 100%; display: block; }
    .ce-figure-legend { display: flex; gap: var(--space-lg); margin-top: 10px; font-family: var(--ce-mono); font-size: .62rem; letter-spacing: .04em; color: var(--color-text-secondary); flex-wrap: wrap; }
    .ce-figure-legend b { color: var(--color-text-secondary); font-weight: 500; }
    .ce-panel-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: .78rem; color: var(--color-text-secondary); }
    .ce-panel-row + .ce-panel-row { border-top: var(--ce-line) solid var(--ce-border-c); }

    /* ── 世界化区块 ── */
    .ce-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
    @media (max-width: 680px) { .ce-metrics { grid-template-columns: 1fr; } }
    .ce-metric { display: flex; flex-direction: column; gap: 4px; padding: 18px 20px; background: var(--ce-card-bg); border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-md); }
    .ce-metric-num { font-family: var(--ce-display); font-size: 1.55rem; font-weight: 700; letter-spacing: -.02em; color: var(--color-text-emphasis); font-variant-numeric: tabular-nums; }
    .ce-metric-label { font-family: var(--ce-mono); font-size: .62rem; letter-spacing: .08em; color: var(--color-text-secondary); }
    .ce-metric-delta { font-size: .72rem; font-weight: 600; color: var(--color-success); }
    .ce-quote { margin: 0; padding: var(--space-2xl) var(--space-3xl); border-left: var(--ce-line) solid var(--color-accent-base); font-family: var(--ce-display); font-size: 1.12rem; line-height: 1.8; color: var(--color-text-emphasis); }
    .ce-quote cite { display: block; margin-top: 10px; font-family: var(--ce-mono); font-size: .66rem; font-style: normal; letter-spacing: .1em; color: var(--color-text-secondary); }
    .ce-feat-card { display: flex; flex-direction: column; gap: 12px; padding: 22px 20px; background: var(--ce-card-bg); border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-md); }
    .ce-feat-title { font-family: var(--ce-display); font-size: 1rem; font-weight: 700; color: var(--color-text-emphasis); }
    .ce-feat-copy { font-size: .84rem; line-height: 1.65; color: var(--color-text-secondary); }
    .ce-card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
    @media (max-width: 680px) { .ce-card-grid { grid-template-columns: 1fr; } }
    .ce-card-grid .ce-feat-card { margin: 0; }

    /* ── 通用构件：作品 / 色块 / 书页 / 表单 / 空状态 ── */
    .ce-field { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
    .ce-input { flex: 1; min-width: 0; font-family: var(--ce-body); font-size: .8rem; color: var(--color-text-primary); background: var(--color-bg-secondary); border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-sm); padding: 7px 12px; }
    .ce-input::placeholder { color: var(--color-text-muted); }
    .ce-input:focus { outline: 2px solid var(--color-accent-base); outline-offset: 1px; border-color: transparent; }
    .ce-empty { display: flex; flex-direction: column; gap: 4px; align-items: center; justify-content: center; padding: 22px 12px; border: 1px dashed var(--ce-border-c); color: var(--color-text-muted); font-size: .78rem; text-align: center; }

    /* 加载态与错误态：与空状态同一套尺寸语言，风格只改颜色与圆角，不各写一遍。
       三者成组出现——列表加载中、加载失败、加载成功但为空，是同一块区域的三种结局。 */
    .ce-loading { display: flex; flex-direction: column; gap: 8px; padding: 20px 12px; color: var(--color-text-muted); font-size: .78rem; text-align: center; }
    .ce-loading-bar { position: relative; height: 4px; overflow: hidden; background: var(--color-bg-tertiary); border-radius: var(--ce-r-sm); }
    .ce-loading-bar::after { content: ""; position: absolute; inset: 0 auto 0 0; width: 36%; background: var(--color-accent-base); animation: ceLoadSlide 1.5s ease-in-out infinite; }
    @keyframes ceLoadSlide { from { transform: translateX(-100%); } to { transform: translateX(280%); } }
    @media (prefers-reduced-motion: reduce) {
      /* 不加动画时用满宽的静态条表达「正在进行」，而不是留一个空槽 */
      .ce-loading-bar::after { animation: none; width: 100%; opacity: .45; }
    }
    .ce-error { display: flex; flex-direction: column; gap: 6px; padding: 16px 14px; border: var(--ce-line) solid var(--color-error); background: var(--color-error-subtle); color: var(--color-text-primary); font-size: .8rem; border-radius: var(--ce-r-sm); }
    .ce-error-title { display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--color-text-emphasis); }
    .ce-error-title::before { content: ""; width: 7px; height: 7px; flex: none; background: var(--color-error); border-radius: 50%; }
    .ce-error-actions { display: flex; align-items: center; gap: 12px; }

    .ce-works { display: grid; grid-template-columns: repeat(6, 1fr); gap: var(--space-lg); }
    /* figure 默认带 UA 外边距，会把作品宽度缩掉 80px；这里统一归零 */
    .ce-work { margin: 0; min-width: 0; }
    /* 列跨度只在 .ce-works 内生效：.ce-work 也可能出现在别处（例如展厅首屏主图），
       在非作品网格里带 span 会把宿主网格撑成多余列，导致同格内容被挤成一列一字 */
    .ce-works .ce-work { grid-column: span 3; }
    .ce-works .ce-work.is-wide { grid-column: span 6; }
    .ce-works .ce-work.is-third { grid-column: span 2; }
    .ce-work-frame { position: relative; overflow: hidden; background: var(--ce-frame); }
    .ce-work-frame img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .ce-work-cap { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-sm); margin-top: 10px; }
    .ce-work-name { font-size: .86rem; font-weight: 600; color: var(--color-text-primary); }
    .ce-work-meta { font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .04em; color: var(--color-text-secondary); }
    .ce-work-note { font-size: .76rem; color: var(--color-text-secondary); margin-top: 2px; }
    .ce-work-row { display: flex; align-items: center; gap: 12px; padding: 10px 2px; border-top: var(--ce-line) solid var(--ce-border-c); }
    .ce-work-row:first-child { border-top: 0; }
    .ce-work-thumb { width: 56px; height: 40px; flex-shrink: 0; overflow: hidden; background: var(--ce-frame); }
    .ce-work-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }
    .ce-work-row-name { font-size: .82rem; color: var(--color-text-primary); }
    .ce-work-row-meta { font-family: var(--ce-mono); font-size: .64rem; color: var(--color-text-secondary); }
    .ce-work-row-state { margin-left: auto; font-size: .68rem; font-weight: 600; color: var(--color-text-secondary); }
    .ce-filter-row { display: flex; gap: var(--space-md); margin-bottom: 6px; font-size: .76rem; color: var(--color-text-secondary); flex-wrap: wrap; }

    .ce-block { padding: var(--space-2xl) var(--space-xl); }
    .ce-block-title { font-family: var(--ce-display); font-weight: 700; font-size: 1.3rem; line-height: 1.12; }
    .ce-block-copy { margin-top: 8px; font-size: .88rem; line-height: 1.65; }
    .ce-block-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-lg); align-items: start; }

    .ce-sheet { padding: var(--space-2xl) var(--space-3xl); }
    .ce-chapter-no { display: block; font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .14em; color: var(--color-text-secondary); text-transform: uppercase; }
    .ce-page-no { font-family: var(--ce-mono); font-size: .64rem; letter-spacing: .12em; color: var(--color-text-muted); }
    .ce-sheet-foot { display: flex; align-items: center; justify-content: space-between; gap: var(--space-md); margin-top: var(--space-lg); }
    .ce-archive-row { display: flex; align-items: baseline; gap: var(--space-sm); padding: 7px 0; font-size: .82rem; }
    .ce-archive-no { font-family: var(--ce-mono); font-size: .68rem; flex-shrink: 0; width: 76px; color: var(--color-text-muted); }
    .ce-archive-lead { flex: 1; border-bottom: 1px dotted var(--ce-border-c); transform: translateY(-3px); }
    .ce-archive-val { color: var(--color-text-primary); }
    .ce-archive-note { font-size: .72rem; color: var(--color-text-muted); }

    /* ── 工具自身构件：不进导出（导出只含案例组件样式） ── */
    @media (max-width: 680px) {
      .ce-row { grid-template-columns: 90px 1fr 90px; }
      .ce-row .ce-row-spec { display: none; }
      .ce-search input { width: 130px; }
    }
    @media (max-width: 560px) {
      .ce-topbar { flex-wrap: wrap; row-gap: 8px; }
    }
  `;
}

/* 工具自身预览构件：风格缩略图与比较样张的水位样式。
   刻意与组件 CSS 分开——导出给 AI 的内容里不应包含工具内部布局。 */
function buildToolPreviewCSS() {
  return `
    /* 预览容器：只属于工具页面，导出内容里不出现（接收方不该依赖工具内部选择器） */
    #comp-preview-card {
      transition: background .3s, color .3s;
      background: var(--color-bg-primary);
      color: var(--color-text-primary);
    }
    #comp-preview-card * { box-sizing: border-box; }

    /* 缩略预览：真实样式 2.5× 内容 + 0.4 缩放，保证与完整案例一致 */
    .ce-thumb { position: relative; height: 126px; overflow: hidden; background: var(--color-bg-primary); }
    .ce-thumb-inner { width: 250%; transform: scale(.4); transform-origin: 0 0; }
    .ce-thumb-inner .ce-landing { max-width: none; margin: 0; padding: var(--space-xl) var(--space-xl) 0; gap: var(--space-xl); }
    /* 缩略图里 vw 指的是真实视口，不是缩略图宽度——必须在这里改成固定字号。
       否则用 vw 定义大标题的风格（如构色的 clamp(2.2rem, 6.2vw, 4.1rem)）会按 1440px
       视口算出 65px 字，塞进 390px 宽的缩略图里直接溢出。
       选择器要写满三层：风格规则是「.ce-style-x .ce-hero-title」两个类，
       同权重下后者（在 allStylesCSS 里）排在后面就会赢，所以这里必须更高一层。 */
    .ce-thumb-inner .ce-landing .ce-hero-title { font-size: 1.55rem; line-height: 1.06; max-width: none; }
    .ce-thumb-inner .ce-landing .ce-hero-sub { font-size: .88rem; max-width: none; }

    /* 同一内容的比较样张：差异只能来自排版、材料与构图 */
    .ce-compare-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(232px, 1fr)); gap: var(--space-lg); }
    .ce-compare-cell { border: 1px solid var(--color-border); background: var(--color-bg-primary); }
    .ce-compare-label { display: flex; align-items: baseline; gap: 8px; padding: 9px 12px; border-bottom: 1px solid var(--color-border); font-size: .72rem; font-weight: 700; }
    .ce-compare-label span { font-family: var(--ce-mono, monospace); font-size: .6rem; letter-spacing: .08em; color: var(--color-text-secondary); font-weight: 400; }
    .ce-compare-page { padding: var(--space-lg); gap: var(--space-lg); }
    .ce-compare-page .ce-hero-title { font-size: 1.3rem; line-height: 1.15; }
    .ce-compare-page .ce-hero-sub { font-size: .8rem; margin-top: 8px; }
    .ce-compare-page .ce-hero-actions { margin-top: var(--space-md); }
    .ce-compare-page .ce-metrics { grid-template-columns: 1fr 1fr; gap: var(--space-sm); }
    .ce-compare-page .ce-metric { padding: 10px 12px; }
    .ce-compare-page .ce-metric-num { font-size: 1.05rem; }
    .ce-compare-page .ce-row { grid-template-columns: 1fr 68px 76px; padding: 9px 2px; }
    .ce-compare-page .ce-row-spec { display: none; }
  `;
}

/* 全部风格的世界变量 + 作用域样式：缩略预览与比较样张需要同一份 */
function allStylesCSS() {
  return buildProfilesCSS();
}

/* 预览区样式（预览 / 缩略图 / 比较样张共用；样式元素留在文档作用域内） */
function previewCSS() {
  return buildDemoCSS() + '\n' + buildToolPreviewCSS() + '\n' + allStylesCSS();
}

/* 导出给 AI 的组件 CSS：共享骨架 + 仅当前风格的世界变量与作用域样式（去重） */
function exportComponentCSS(styleId) {
  const id = normalizeStyleId(styleId);
  return buildDemoCSS().trim() + '\n\n/* ══ ' + getProfile(id).name + '（' + getProfile(id).en + '）世界变量 ══ */\n' +
    profileWorldCSS(id) + '\n\n/* ══ ' + getProfile(id).name + ' 作用域样式 ══ */\n' + profileScopedCSS(id) + '\n';
}

/* ── 共享图形资源 ──────────────────────────────────
   ceSpecDefs 与 specStripSVG 是标准 / 暖糖 / 书卷 / 流光共用的资源：
   光谱案例移除后它们仍有依赖，因此保留（清理前先检查依赖）。
   spectrumPlotSVG 只被已删除的光谱工作台使用，故一并移除。 */

function ceSpecDefs() {
  return '<svg width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<defs><linearGradient id="ce-spec" x1="0" y1="0" x2="1" y2="0">' +
    '<stop offset="0" style="stop-color:var(--color-accent-subtle)"/>' +
    '<stop offset=".5" style="stop-color:var(--color-accent-base)"/>' +
    '<stop offset="1" style="stop-color:var(--color-accent-active)"/>' +
    '</linearGradient></defs></svg>';
}

function specStripSVG(notches) {
  return '<svg class="ce-row-spec" viewBox="0 0 220 18" preserveAspectRatio="none" aria-hidden="true">' +
    '<rect y="7" width="220" height="4" style="fill:url(#ce-spec)"/>' +
    notches.map(n => '<rect x="' + n.x + '" y="5.5" width="' + (n.w || 3) + '" height="7" style="fill:var(--color-text-primary);opacity:.8"/>').join('') +
    '</svg>';
}

// 标准：增长分析平台 —— 折线趋势图
function pulseChartSVG() {
  return '<svg class="ce-figure" viewBox="0 0 460 120" role="img" aria-label="转化率周趋势折线图">' +
    '<line x1="20" y1="30" x2="440" y2="30" stroke="var(--color-border)" stroke-width="1"/>' +
    '<line x1="20" y1="60" x2="440" y2="60" stroke="var(--color-border)" stroke-width="1"/>' +
    '<line x1="20" y1="90" x2="440" y2="90" stroke="var(--color-border)" stroke-width="1"/>' +
    '<line x1="20" y1="50" x2="440" y2="50" stroke="var(--color-border)" stroke-width="1" stroke-dasharray="3 5" opacity=".7"/>' +
    '<polyline points="30,95 95,88 160,70 225,76 290,58 355,44 420,32" fill="none" stroke="var(--color-accent-base)" stroke-width="2" stroke-linejoin="round"/>' +
    '<circle cx="420" cy="32" r="3.5" fill="var(--color-accent-base)"/>' +
    '<text x="30" y="108" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9">W1</text>' +
    '<text x="145" y="108" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9">W3</text>' +
    '<text x="260" y="108" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9">W5</text>' +
    '<text x="400" y="108" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9">W7</text>' +
    '</svg>';
}

// 暖糖：睡眠与放松 —— 4-7-8 呼吸圆环
function breathRingSVG() {
  return '<svg class="ce-figure" viewBox="0 0 460 120" role="img" aria-label="四七-八呼吸练习圆环，进度四分之三">' +
    '<circle cx="230" cy="60" r="40" fill="none" stroke="var(--color-border)" stroke-width="3"/>' +
    '<circle cx="230" cy="60" r="40" fill="none" stroke="var(--color-accent-base)" stroke-width="3" stroke-linecap="round" stroke-dasharray="188 64" transform="rotate(-90 230 60)"/>' +
    '<text x="230" y="58" fill="var(--color-text-emphasis)" font-family="var(--ce-display)" font-size="22" font-weight="700" text-anchor="middle">4-7-8</text>' +
    '<text x="230" y="76" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9" text-anchor="middle">吸 4s · 停 7s · 呼 8s</text>' +
    '<circle cx="318" cy="60" r="4" fill="var(--color-accent-base)"/>' +
    '<circle cx="338" cy="60" r="4" fill="var(--color-accent-base)" opacity=".55"/>' +
    '<circle cx="358" cy="60" r="4" fill="var(--color-border)"/>' +
    '<circle cx="378" cy="60" r="4" fill="var(--color-border)"/>' +
    '</svg>';
}

// 流光：AI 智能排程 —— 数据管线节点图（唯一动效：主路径走线）
function nexusGraphSVG() {
  return '<svg class="ce-figure" viewBox="0 0 460 120" role="img" aria-label="数据源经过智能体汇聚后输出的管线示意图">' +
    '<path d="M70 25 L215 55" stroke="var(--color-border)" stroke-width="1.2"/>' +
    '<path d="M70 60 L215 60" stroke="var(--color-border)" stroke-width="1.2"/>' +
    '<path d="M70 95 L215 65" stroke="var(--color-border)" stroke-width="1.2"/>' +
    '<path class="ce-flow-path" d="M245 60 L400 60" stroke="var(--color-accent-base)" stroke-width="1.5" stroke-dasharray="18 18"/>' +
    '<circle cx="245" cy="60" r="3" fill="var(--color-accent-base)"/>' +
    '<circle cx="70" cy="25" r="7" fill="var(--color-bg-secondary)" stroke="var(--color-border)" stroke-width="1.5"/>' +
    '<circle cx="70" cy="60" r="7" fill="var(--color-bg-secondary)" stroke="var(--color-border)" stroke-width="1.5"/>' +
    '<circle cx="70" cy="95" r="7" fill="var(--color-bg-secondary)" stroke="var(--color-border)" stroke-width="1.5"/>' +
    '<circle cx="230" cy="60" r="10" fill="var(--color-bg-secondary)" stroke="var(--color-accent-base)" stroke-width="1.5"/>' +
    '<circle cx="410" cy="60" r="8" fill="var(--color-bg-secondary)" stroke="var(--color-accent-2)" stroke-width="1.5"/>' +
    '<text x="70" y="14" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9" text-anchor="middle">S1</text>' +
    '<text x="70" y="82" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9" text-anchor="middle">S2</text>' +
    '<text x="70" y="117" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9" text-anchor="middle">S3</text>' +
    '<text x="230" y="49" fill="var(--color-text-primary)" font-family="var(--ce-mono)" font-size="9" text-anchor="middle">ROUTER</text>' +
    '<text x="410" y="49" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9" text-anchor="middle">OUT</text>' +
    '</svg>';
}

// 书卷：城市生活月刊 —— 刊头
function mastheadSVG() {
  return '<svg class="ce-figure" viewBox="0 0 460 120" role="img" aria-label="刊头：第七卷城市夜航专题">' +
    '<text x="40" y="86" fill="var(--color-text-emphasis)" font-family="var(--ce-display)" font-size="68" font-weight="700">07</text>' +
    '<line x1="150" y1="24" x2="150" y2="92" stroke="var(--color-border)" stroke-width="1"/>' +
    '<text x="172" y="56" fill="var(--color-text-emphasis)" font-family="var(--ce-display)" font-size="17">城市夜航</text>' +
    '<text x="172" y="78" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="10" letter-spacing="1">VOL.07 · 2026 年 8 月号</text>' +
    '<line x1="40" y1="100" x2="420" y2="100" stroke="var(--color-border)" stroke-width="1"/>' +
    '<text x="40" y="114" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9" letter-spacing="1">夜航者的城市 · 守夜人 · 天亮之前</text>' +
    '</svg>';
}

// 褐页：档案与旧书 —— 展开的书页（线稿用材料墨色，只有印章用品牌色）
function sepiaFolioSVG() {
  var lines = '';
  for (var i = 0; i < 6; i++) {
    var y = 44 + i * 13;
    lines += '<line x1="52" y1="' + y + '" x2="206" y2="' + y + '" stroke="var(--ce-rule)" stroke-width="1"/>';
    lines += '<line x1="254" y1="' + y + '" x2="' + (i === 5 ? 340 : 408) + '" y2="' + y + '" stroke="var(--ce-rule)" stroke-width="1"/>';
  }
  return '<svg class="ce-figure" viewBox="0 0 460 150" role="img" aria-label="展开的书页线稿，含页码与藏书印">' +
    '<rect x="30" y="16" width="400" height="118" fill="none" stroke="var(--ce-rule)" stroke-width="1"/>' +
    '<line x1="230" y1="16" x2="230" y2="134" stroke="var(--ce-rule)" stroke-width="1"/>' +
    lines +
    '<line x1="52" y1="30" x2="150" y2="30" stroke="var(--ce-ink-2)" stroke-width="2"/>' +
    '<line x1="254" y1="30" x2="330" y2="30" stroke="var(--ce-ink-2)" stroke-width="2"/>' +
    '<circle cx="396" cy="112" r="13" fill="none" stroke="var(--color-accent-base)" stroke-width="1.4"/>' +
    '<text x="396" y="116" fill="var(--color-accent-base)" font-family="var(--ce-mono)" font-size="8" text-anchor="middle">藏</text>' +
    '<text x="52" y="128" fill="var(--ce-ghost)" font-family="var(--ce-mono)" font-size="8" letter-spacing="1">P. 012</text>' +
    '</svg>';
}

// 构色：海报式排版 —— 三块纯色构成的平面
function posterMarkSVG() {
  return '<svg class="ce-figure" viewBox="0 0 460 150" role="img" aria-label="海报构图：实色方块、墨色圆与描边三角">' +
    '<rect x="8" y="10" width="140" height="130" fill="var(--color-accent-base)"/>' +
    '<circle cx="230" cy="75" r="62" fill="var(--color-text-emphasis)"/>' +
    '<path d="M448 10 L448 140 L330 140 Z" fill="none" stroke="var(--color-text-emphasis)" stroke-width="2"/>' +
    '<line x1="8" y1="146" x2="452" y2="146" stroke="var(--color-text-emphasis)" stroke-width="2"/>' +
    '</svg>';
}

/* ── 展厅：作品数据与容器 ──────────────────────────────
   素材为项目自制的演示图形（assets/work-demo-*.svg），可本地引用、
   不依赖远程图链；输出给 AI 时明确说明这是演示资产而非用户资产。 */

const GALLERY_WORKS = [
  { file: 'assets/work-demo-01.svg', name: '折光 · 习作一', year: '2024', medium: '数字微喷', note: '四层透明色块叠印，宽幅装裱', size: 'is-wide' },
  { file: 'assets/work-demo-02.svg', name: '潮线', year: '2023', medium: '丝网版画', note: '夜色底上的三重潮线', size: '' },
  { file: 'assets/work-demo-03.svg', name: '网格习作', year: '2024', medium: '纸上丙烯', note: '删格与保留的对照', size: '' },
  { file: 'assets/work-demo-04.svg', name: '静物 · 三件', year: '2022', medium: '布面油画', note: '竖幅 3:4，暖底冷物', size: 'is-tall' },
  { file: 'assets/work-demo-05.svg', name: '留白', year: '2024', medium: '孔版印刷', note: '正方形构图，四边对角', size: 'is-square' },
  { file: 'assets/work-demo-06.svg', name: '断面', year: '2023', medium: '装置记录', note: '四段色柱的高度关系', size: 'is-wide' }
];

function galleryWorkInnerHTML(work) {
  return '<div class="ce-work-frame"><img src="' + work.file + '" alt="作品演示：' + escapeHtml(work.name) + '" loading="lazy"></div>' +
    '<figcaption>' +
      '<div class="ce-work-cap"><span class="ce-work-name">' + escapeHtml(work.name) + '</span>' +
      '<span class="ce-work-meta">' + escapeHtml(work.year) + ' · ' + escapeHtml(work.medium) + '</span></div>' +
      '<div class="ce-work-note">' + escapeHtml(work.note) + '</div>' +
    '</figcaption>';
}

function galleryWorkHTML(work) {
  return '<figure class="ce-work ' + (work.size || '') + '">' + galleryWorkInnerHTML(work) + '</figure>';
}

/* ── 着陆页：标准 / 暖糖 / 书卷保持既有内容与编排 ──────── */

function standardLandingHTML() {
  return '<div class="ce-landing">' +
    '<nav class="ce-topbar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 16 L9 9 L13 13 L20 5" stroke="var(--color-accent-base)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="20" cy="5" r="2" fill="var(--color-accent-base)"/></svg>' +
        '<span class="ce-logo-name">PULSE</span>' +
        '<span class="ce-logo-sub">增长分析平台</span>' +
      '</a>' +
      '<nav class="ce-nav">' +
        '<span class="ce-nav-link" data-token="neutral-400">看板</span>' +
        '<span class="ce-nav-link" data-token="neutral-400">报表</span>' +
        '<span class="ce-nav-link" data-token="neutral-400">数据源</span>' +
      '</nav>' +
      '<span class="ce-spacer"></span>' +
      '<button class="ce-btn ce-btn-ghost ce-btn-sm">登录</button>' +
      '<button class="ce-btn ce-btn-accent ce-btn-sm" data-token="accent-200">创建看板</button>' +
    '</nav>' +
    '<header class="ce-hero">' +
      '<div>' +
        '<h1 class="ce-hero-title" data-token="neutral-600">把每一次转化<br>算清楚</h1>' +
        '<p class="ce-hero-sub" data-token="neutral-400">PULSE 把渠道、漏斗与留存收进同一张报表。接入数据源，几分钟内得到可分享的增长看板。</p>' +
        '<div class="ce-hero-actions">' +
          '<button class="ce-btn ce-btn-accent ce-btn-lg" data-token="accent-200">创建看板</button>' +
          '<a class="ce-text-link" data-token="accent-200">查看示例报表</a>' +
        '</div>' +
        '<div class="ce-hero-meta"><span>30 天试用</span><span>·</span><span>500+ 团队</span><span>·</span><span>SOC2</span></div>' +
      '</div>' +
      '<figure class="ce-prism">' + pulseChartSVG() +
        '<figcaption class="ce-prism-caption">渠道 → 漏斗 → 留存 · 每周自动同步</figcaption>' +
      '</figure>' +
    '</header>' +
    '<section class="ce-metrics">' +
      '<div class="ce-metric"><span class="ce-metric-num">128.4k</span><span class="ce-metric-label">月活跃用户</span><span class="ce-metric-delta">▲ 12% 环比</span></div>' +
      '<div class="ce-metric"><span class="ce-metric-num">4.2%</span><span class="ce-metric-label">整体转化率</span><span class="ce-metric-delta">▲ 0.6pt 环比</span></div>' +
      '<div class="ce-metric"><span class="ce-metric-num">¥38.6</span><span class="ce-metric-label">平均客单价</span><span class="ce-metric-delta">▲ 5% 环比</span></div>' +
    '</section>' +
    '<section class="ce-plate">' +
      '<div class="ce-plate-head">' +
        '<h2 class="ce-plate-title">本周报表</h2>' +
        '<span class="ce-plate-epoch">W25 · 5 月 20 日 — 26 日</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">渠道转化日报</span>' + specStripSVG([{x: 52}, {x: 118, w: 4}]) +
        '<span class="ce-row-time">09:00 更新</span>' +
        '<span class="ce-row-status is-success">已就绪</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">漏斗分析周报</span>' + specStripSVG([{x: 74}, {x: 141, w: 3}]) +
        '<span class="ce-row-time">周一 08:30</span>' +
        '<span class="ce-row-status is-accent">已共享</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">留存 Cohort 双周报</span>' + specStripSVG([{x: 40}, {x: 96}, {x: 160, w: 4}]) +
        '<span class="ce-row-time">周五 17:00</span>' +
        '<span class="ce-row-status">待审核</span>' +
      '</div>' +
      '<div class="ce-row ce-row-empty"></div>' +
    '</section>' +
    '<section class="ce-split">' +
      '<div>' +
        '<h2 class="ce-split-title">接入的数据源</h2>' +
        '<p class="ce-split-copy" data-token="neutral-400">每个数据源按晚归档，与采集状态、更新频率一同入档，报表直接调用。</p>' +
        '<div class="ce-catalog">' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">CSV-UPLOAD</span><span class="ce-catalog-val" data-token="neutral-400">手工上传 · 按需同步</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">API-WEBHOOK</span><span class="ce-catalog-val" data-token="neutral-400">事件流 · 实时</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">DB-SYNC</span><span class="ce-catalog-val" data-token="neutral-400">数据库直连 · 每 15 分钟</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="ce-window">' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>BI 团队<span class="ce-window-time">09:00</span></div>' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>增长组<span class="ce-window-time">10:30</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>管理层<span class="ce-window-time">周五</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>外部审计<span class="ce-window-time">月末</span></div>' +
      '</div>' +
    '</section>' +
    '<footer class="ce-footer">' +
      '<span>PULSE · 增长分析平台</span>' +
      '<span>示例数据为合成演示，非真实业务记录</span>' +
    '</footer>' +
  '</div>';
}

function softLandingHTML() {
  return '<div class="ce-landing">' +
    '<nav class="ce-topbar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4a8 8 0 1 0 7.2 11.2A7 7 0 0 1 12 4z" stroke="var(--color-accent-base)" stroke-width="1.8" stroke-linejoin="round"/></svg>' +
        '<span class="ce-logo-name">舒心</span>' +
        '<span class="ce-logo-sub">睡眠与放松</span>' +
      '</a>' +
      '<nav class="ce-nav">' +
        '<span class="ce-nav-link">练习</span>' +
        '<span class="ce-nav-link">睡眠</span>' +
        '<span class="ce-nav-link">课程</span>' +
      '</nav>' +
      '<span class="ce-spacer"></span>' +
      '<button class="ce-btn ce-btn-ghost ce-btn-sm">登录</button>' +
      '<button class="ce-btn ce-btn-accent ce-btn-sm">开始练习</button>' +
    '</nav>' +
    '<header class="ce-hero">' +
      '<div>' +
        '<h1 class="ce-hero-title">睡个好觉，<br>从今晚开始</h1>' +
        '<p class="ce-hero-sub">舒心把呼吸练习、睡眠记录与放松课程收进同一个温暖的地方。三分钟，找回你的节奏。</p>' +
        '<div class="ce-hero-actions">' +
          '<button class="ce-btn ce-btn-accent ce-btn-lg">开始今晚练习</button>' +
          '<a class="ce-text-link">了解更多</a>' +
        '</div>' +
        '<div class="ce-hero-meta"><span>4.9 分</span><span>·</span><span>120 万用户</span><span>·</span><span>7 天免费</span></div>' +
      '</div>' +
      '<figure class="ce-prism">' + breathRingSVG() +
        '<figcaption class="ce-prism-caption">今晚练习 · 4-7-8 呼吸 · 4 分钟</figcaption>' +
      '</figure>' +
    '</header>' +
    '<section class="ce-plate">' +
      '<div class="ce-plate-head">' +
        '<h2 class="ce-plate-title">今晚的计划</h2>' +
        '<span class="ce-plate-epoch">DAY 5 · 连续打卡 · 21:30 开始</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">呼吸练习</span>' + specStripSVG([{x: 52}, {x: 118, w: 4}]) +
        '<span class="ce-row-time">4 分钟</span>' +
        '<span class="ce-row-status is-success">已完成</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">睡前拉伸</span>' + specStripSVG([{x: 74}, {x: 141, w: 3}]) +
        '<span class="ce-row-time">8 分钟</span>' +
        '<span class="ce-row-status is-accent">进行中</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">白噪音</span>' + specStripSVG([{x: 40}, {x: 96}, {x: 160, w: 4}]) +
        '<span class="ce-row-time">30 分钟</span>' +
        '<span class="ce-row-status">待开始</span>' +
      '</div>' +
      '<div class="ce-row ce-row-empty"></div>' +
    '</section>' +
    '<section class="ce-split">' +
      '<div>' +
        '<h2 class="ce-split-title">本周课程</h2>' +
        '<p class="ce-split-copy">每晚一节短课，跟随引导慢慢放松身体与思绪，睡眠记录自动入档。</p>' +
        '<div class="ce-catalog">' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">MON</span><span class="ce-catalog-val">睡前拉伸 · 8 分钟</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">WED</span><span class="ce-catalog-val">正念冥想 · 10 分钟</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">FRI</span><span class="ce-catalog-val">深度睡眠导引 · 12 分钟</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="ce-window">' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>今晚 · 呼吸练习<span class="ce-window-time">21:30</span></div>' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>明晚 · 睡前拉伸<span class="ce-window-time">22:00</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>周三 · 正念冥想<span class="ce-window-time">21:45</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>周五 · 深度睡眠<span class="ce-window-time">22:10</span></div>' +
      '</div>' +
    '</section>' +
    '<footer class="ce-footer">' +
      '<span>舒心 · 睡眠与放松</span>' +
      '<span>示例数据为合成演示，非真实健康记录</span>' +
    '</footer>' +
  '</div>';
}

function editorialLandingHTML() {
  return '<div class="ce-landing">' +
    '<nav class="ce-topbar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 4v16M5 4h9a3 3 0 0 1 3 3v13M5 8h9M5 12h9M5 16h7" stroke="var(--color-accent-base)" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
        '<span class="ce-logo-name">知卷</span>' +
        '<span class="ce-logo-sub">城市生活月刊</span>' +
      '</a>' +
      '<nav class="ce-nav">' +
        '<span class="ce-nav-link">本期</span>' +
        '<span class="ce-nav-link">专栏</span>' +
        '<span class="ce-nav-link">存档</span>' +
      '</nav>' +
      '<span class="ce-spacer"></span>' +
      '<button class="ce-btn ce-btn-ghost ce-btn-sm">登录</button>' +
      '<button class="ce-btn ce-btn-accent ce-btn-sm">订阅月刊</button>' +
    '</nav>' +
    '<header class="ce-hero">' +
      '<div>' +
        '<h1 class="ce-hero-title">城市夜航</h1>' +
        '<p class="ce-hero-sub">当城市入睡，另一群人开始工作——送奶工、急诊医生与巡夜人。本期我们跟随他们走过三班夜色。</p>' +
        '<div class="ce-hero-actions">' +
          '<button class="ce-btn ce-btn-accent ce-btn-lg">阅读本期</button>' +
          '<a class="ce-text-link">订阅月刊</a>' +
        '</div>' +
        '<div class="ce-hero-meta"><span>VOL.07</span><span>·</span><span>2026 年 8 月号</span><span>·</span><span>¥18</span></div>' +
      '</div>' +
      '<figure class="ce-prism">' + mastheadSVG() +
        '<figcaption class="ce-prism-caption">卷首语 · 编辑部</figcaption>' +
      '</figure>' +
    '</header>' +
    '<section class="ce-plate">' +
      '<div class="ce-plate-head">' +
        '<h2 class="ce-plate-title">本期要点</h2>' +
        '<span class="ce-plate-epoch">三篇主文 · 七十二页</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">夜航者的城市</span>' + specStripSVG([{x: 52}, {x: 118, w: 4}]) +
        '<span class="ce-row-time">陈默 · P.18</span>' +
        '<span class="ce-row-status is-success">已刊</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">急诊室的第三班</span>' + specStripSVG([{x: 74}, {x: 141, w: 3}]) +
        '<span class="ce-row-time">林晚 · P.34</span>' +
        '<span class="ce-row-status is-accent">连载</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">送奶工时刻</span>' + specStripSVG([{x: 40}, {x: 96}, {x: 160, w: 4}]) +
        '<span class="ce-row-time">周叙 · P.52</span>' +
        '<span class="ce-row-status">预告</span>' +
      '</div>' +
    '</section>' +
    '<blockquote class="ce-quote">' +
      '城市的夜晚，是写给清醒者的长信。' +
      '<cite>—— 卷首语 · 编辑部</cite>' +
    '</blockquote>' +
    '<section class="ce-split">' +
      '<div>' +
        '<h2 class="ce-split-title">本期专栏</h2>' +
        '<p class="ce-split-copy">夜间摄影、城市切片与夜航地图三个专栏，以图与文记录天亮前的城市。</p>' +
        '<div class="ce-catalog">' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">影集</span><span class="ce-catalog-val">夜间摄影 · 十二帧</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">随笔</span><span class="ce-catalog-val">城市切片 · 三则</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">地图</span><span class="ce-catalog-val">夜航地图 · 跨页</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="ce-window">' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>卷一 · 夜航<span class="ce-window-time">P.6</span></div>' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>卷二 · 守夜人<span class="ce-window-time">P.18</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>卷三 · 天亮前<span class="ce-window-time">P.52</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>别册 · 夜航地图<span class="ce-window-time">附赠</span></div>' +
      '</div>' +
    '</section>' +
    '<footer class="ce-footer">' +
      '<span>知卷 · 城市生活月刊</span>' +
      '<span>示例内容为合成演示，非真实刊物</span>' +
    '</footer>' +
  '</div>';
}

/* ── 着陆页：流光（本轮重做） ──────────────────────────
   重做要点：干净底色 → 清晰分组 → 最后加光效。
   保留业务事实（数据源 / 智能体 / 延迟），删掉全页多色径向光斑与按钮呼吸辉光；
   玻璃只出现在顶栏与主视觉卡，其余表面稳定可读。 */

function glassLandingHTML() {
  return '<div class="ce-landing">' +
    '<nav class="ce-topbar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.4" stroke="var(--color-accent-base)" stroke-width="1.8"/><path d="M12 8.6V4.2M12 19.8v-4.4M15.4 12h4.4M4.2 12h4.4" stroke="var(--color-text-secondary)" stroke-width="1.2" opacity=".55"/></svg>' +
        '<span class="ce-logo-name">NEXUS</span>' +
        '<span class="ce-logo-sub">AI 智能排程平台</span>' +
      '</a>' +
      '<nav class="ce-nav">' +
        '<span class="ce-nav-link">智能体</span>' +
        '<span class="ce-nav-link">数据流</span>' +
        '<span class="ce-nav-link">监控</span>' +
      '</nav>' +
      '<span class="ce-spacer"></span>' +
      '<button class="ce-btn ce-btn-ghost ce-btn-sm">登录</button>' +
      '<button class="ce-btn ce-btn-accent ce-btn-sm">创建智能体</button>' +
    '</nav>' +
    '<header class="ce-hero">' +
      '<div>' +
        '<h1 class="ce-hero-title">让每个模型<br>自动接管对的数据流</h1>' +
        '<p class="ce-hero-sub">NEXUS 把数据接入、模型调度与运行监控收进同一块面板。连接数据源，几分钟内得到一条自动化的智能体管线。</p>' +
        '<div class="ce-hero-actions">' +
          '<button class="ce-btn ce-btn-accent ce-btn-lg">创建智能体</button>' +
          '<a class="ce-text-link">查看运行示例</a>' +
        '</div>' +
        '<div class="ce-hero-meta"><span>延迟 42ms</span><span>·</span><span>128 个智能体在线</span><span>·</span><span>UTC+8</span></div>' +
      '</div>' +
      '<figure class="ce-prism">' + nexusGraphSVG() +
        '<figcaption class="ce-prism-caption">数据源 → ROUTER → 输出 · 实时管线</figcaption>' +
      '</figure>' +
    '</header>' +
    '<section class="ce-metrics">' +
      '<div class="ce-metric"><span class="ce-metric-num">42ms</span><span class="ce-metric-label">平均延迟</span><span class="ce-metric-delta">▼ 6ms 本周</span></div>' +
      '<div class="ce-metric"><span class="ce-metric-num">1.2k/s</span><span class="ce-metric-label">吞吐量</span><span class="ce-metric-delta">▲ 8% 本周</span></div>' +
      '<div class="ce-metric"><span class="ce-metric-num">99.97%</span><span class="ce-metric-label">成功率</span><span class="ce-metric-delta">持平 上周</span></div>' +
    '</section>' +
    '<section class="ce-plate">' +
      '<div class="ce-plate-head">' +
        '<h2 class="ce-plate-title">运行中的智能体</h2>' +
        '<span class="ce-plate-epoch">PIPELINE 07 · 3 个任务</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">NLP-ROUTER</span>' + specStripSVG([{x: 52}, {x: 118, w: 4}]) +
        '<span class="ce-row-time">42ms</span>' +
        '<span class="ce-row-status is-success">运行中</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">EMBED-BATCH</span>' + specStripSVG([{x: 74}, {x: 141, w: 3}]) +
        '<span class="ce-row-time">118ms</span>' +
        '<span class="ce-row-status is-accent">调度中</span>' +
      '</div>' +
      '<div class="ce-row">' +
        '<span class="ce-row-desig">VISION-QUEUE</span>' + specStripSVG([{x: 40}, {x: 96}, {x: 160, w: 4}]) +
        '<span class="ce-row-time">—</span>' +
        '<span class="ce-row-status">待接入</span>' +
      '</div>' +
      '<div class="ce-row ce-row-empty"></div>' +
    '</section>' +
    '<section class="ce-split">' +
      '<div>' +
        '<h2 class="ce-split-title">接入的数据源</h2>' +
        '<p class="ce-split-copy">每个数据源按需接入管线，与模型状态、延迟、成本一同入档，下次调度直接调用。</p>' +
        '<div class="ce-catalog">' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">STR-01</span><span class="ce-catalog-val">订单流 · 实时同步</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">VEC-DB</span><span class="ce-catalog-val">向量库增量 · 每 5 分钟</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">LOG-SINK</span><span class="ce-catalog-val">日志归档 · 批量</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="ce-window">' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>数据清洗 · J1<span class="ce-window-time">22:40</span></div>' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>向量化 · J3<span class="ce-window-time">00:10</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>模型微调 · J5<span class="ce-window-time">02:30</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>结果校验<span class="ce-window-time">04:45</span></div>' +
      '</div>' +
    '</section>' +
    '<footer class="ce-footer">' +
      '<span>NEXUS · AI 智能排程平台</span>' +
      '<span>示例数据为合成演示，非真实运行记录</span>' +
    '</footer>' +
  '</div>';
}

/* ── 着陆页：褐页（新增） ──────────────────────────────
   目标：整页暖褐纸面 + 书页版心 + 档案条目，与「书卷」的当代编辑感清楚区分。
   材料色由风格自带（不随品牌色变化），品牌色只用于行动与标记。 */

function sepiaLandingHTML() {
  return '<div class="ce-landing">' +
    '<nav class="ce-topbar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" stroke="var(--color-accent-base)" stroke-width="1.4"/><path d="M8 8h8M8 12h8M8 16h4" stroke="var(--ce-ink-2)" stroke-width="1.2"/></svg>' +
        '<span class="ce-logo-name">藏卷</span>' +
        '<span class="ce-logo-sub">档案与旧书</span>' +
      '</a>' +
      '<nav class="ce-nav">' +
        '<span class="ce-nav-link">馆藏</span>' +
        '<span class="ce-nav-link">展览</span>' +
        '<span class="ce-nav-link">借阅</span>' +
      '</nav>' +
      '<span class="ce-spacer"></span>' +
      '<button class="ce-btn ce-btn-ghost ce-btn-sm">登录</button>' +
      '<button class="ce-btn ce-btn-accent ce-btn-sm">预约到馆</button>' +
    '</nav>' +
    '<header class="ce-hero ce-sheet">' +
      '<span class="ce-chapter-no">Chapter 01 · 卷首</span>' +
      '<h1 class="ce-hero-title">在褐色的纸面上，<br>读一座城的旧事</h1>' +
      '<p class="ce-hero-sub">藏卷收录地方志、私人信札与旧刊残页，共 12,480 卷。每份文献都保留原纸的颜色与折痕，也保留它被谁读过的痕迹。</p>' +
      '<div class="ce-hero-actions">' +
        '<button class="ce-btn ce-btn-accent ce-btn-lg">开始检索馆藏</button>' +
        '<a class="ce-text-link">查看入藏说明</a>' +
      '</div>' +
      '<div class="ce-hero-meta"><span>馆藏 12,480 卷</span><span>·</span><span>1912 — 1998</span><span>·</span><span>每周三闭馆</span></div>' +
      '<div class="ce-sheet-foot">' +
        '<span class="ce-page-no">P. 012</span>' +
        '<span class="ce-chapter-no">Sepia Archive</span>' +
        '<span class="ce-page-no">共 288 页</span>' +
      '</div>' +
    '</header>' +
    '<section class="ce-plate">' +
      '<span class="ce-chapter-no">Chapter 02 · 目录</span>' +
      '<div class="ce-plate-head">' +
        '<h2 class="ce-plate-title">本辑目录</h2>' +
        '<span class="ce-plate-epoch">五篇 · 每篇附注释</span>' +
      '</div>' +
      '<div class="ce-archive-row"><span class="ce-archive-no">稿 001</span><span class="ce-archive-val">地方志 · 城西水道记</span><span class="ce-archive-lead"></span><span class="ce-page-no">P. 018</span></div>' +
      '<div class="ce-archive-row"><span class="ce-archive-no">函 014</span><span class="ce-archive-val">私人信札 · 民国二十六年</span><span class="ce-archive-lead"></span><span class="ce-page-no">P. 042</span></div>' +
      '<div class="ce-archive-row"><span class="ce-archive-no">刊 007</span><span class="ce-archive-val">旧刊残页 · 城南画报</span><span class="ce-archive-lead"></span><span class="ce-page-no">P. 096</span></div>' +
      '<div class="ce-archive-row"><span class="ce-archive-no">契 021</span><span class="ce-archive-val">地契与票据 · 附印花</span><span class="ce-archive-lead"></span><span class="ce-page-no">P. 148</span></div>' +
      '<div class="ce-archive-row"><span class="ce-archive-no">影 032</span><span class="ce-archive-val">影集 · 河埠旧影十二帧</span><span class="ce-archive-lead"></span><span class="ce-page-no">P. 216</span></div>' +
    '</section>' +
    '<figure class="ce-prism ce-sheet">' + sepiaFolioSVG() +
      '<figcaption class="ce-prism-caption">卷首插图 · 展开的书页（页边与藏书印）</figcaption>' +
    '</figure>' +
    '<blockquote class="ce-quote">纸的颜色会变，字里的意思不会。<cite>—— 卷二 · 编者按</cite></blockquote>' +
    '<section class="ce-split">' +
      '<div>' +
        '<h2 class="ce-split-title">馆藏说明</h2>' +
        '<p class="ce-split-copy">每份文献登记档号、年代与纸张状态，注释与原稿分开保存；检索结果按入藏时间排序，可直接预约到馆查阅。</p>' +
        '<div class="ce-archive-row"><span class="ce-archive-no">状态</span><span class="ce-archive-val">第 4 辑已编目</span><span class="ce-archive-lead"></span><span class="ce-archive-note">2026.06</span></div>' +
        '<div class="ce-archive-row"><span class="ce-archive-no">修复</span><span class="ce-archive-val">影集 032 补纸完成</span><span class="ce-archive-lead"></span><span class="ce-archive-note">本周</span></div>' +
        '<div class="ce-archive-row"><span class="ce-archive-no">开放</span><span class="ce-archive-val">全部辑次可借阅</span><span class="ce-archive-lead"></span><span class="ce-archive-note">周二至周日</span></div>' +
      '</div>' +
      '<div class="ce-window">' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>稿 001 · 已到馆<span class="ce-window-time">09:30</span></div>' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>函 014 · 修复中<span class="ce-window-time">本周</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>刊 007 · 待编目<span class="ce-window-time">下周</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>契 021 · 待扫描<span class="ce-window-time">十月</span></div>' +
      '</div>' +
    '</section>' +
    '<footer class="ce-footer">' +
      '<span>藏卷 · 档案与旧书</span>' +
      '<span>示例内容为合成演示，非真实文献记录</span>' +
    '</footer>' +
  '</div>';
}

/* ── 着陆页：构色（新增） ──────────────────────────────
   大字 + 实色色块 + 方角硬投影 + 不对称构图；
   色块有信息职责（主题活动 / 行动），不做无内容的装饰拼贴。 */

function posterLandingHTML() {
  return '<div class="ce-landing">' +
    '<nav class="ce-topbar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" fill="var(--color-accent-base)"/><path d="M8 16l4-8 4 8z" fill="var(--color-text-emphasis)"/></svg>' +
        '<span class="ce-logo-name">开物</span>' +
        '<span class="ce-logo-sub">创意工作室</span>' +
      '</a>' +
      '<nav class="ce-nav">' +
        '<span class="ce-nav-link">作品</span>' +
        '<span class="ce-nav-link">展览</span>' +
        '<span class="ce-nav-link">关于</span>' +
      '</nav>' +
      '<span class="ce-spacer"></span>' +
      '<button class="ce-btn ce-btn-ghost ce-btn-sm">登录</button>' +
      '<button class="ce-btn ce-btn-accent ce-btn-sm">联系合作</button>' +
    '</nav>' +
    '<header class="ce-hero">' +
      '<div>' +
        '<h1 class="ce-hero-title">把想法<br>做成一张<br>能被记住的图</h1>' +
        '<p class="ce-hero-sub">开物是一个做海报与视觉识别的小工作室。十二年来只做一件事：让一张纸在一秒钟内被记住。</p>' +
        '<div class="ce-hero-actions">' +
          '<button class="ce-btn ce-btn-accent ce-btn-lg">看作品</button>' +
          '<a class="ce-text-link">预约沟通</a>' +
        '</div>' +
        '<div class="ce-hero-meta"><span>12 年</span><span>·</span><span>240 场</span><span>·</span><span>38 城</span></div>' +
      '</div>' +
      '<figure class="ce-prism">' + posterMarkSVG() +
        '<figcaption class="ce-prism-caption">构图习作 · 方块 / 墨圆 / 描边三角</figcaption>' +
      '</figure>' +
    '</header>' +
    '<section class="ce-block-grid">' +
      '<div class="ce-block ce-block--accent">' +
        '<h2 class="ce-block-title">第七届城市海报展</h2>' +
        '<p class="ce-block-copy">10.12 — 11.03 · 市立美术馆 B 厅 · 免费入场，逢周一闭馆。展出来自 38 座城市的三百张海报原作。</p>' +
      '</div>' +
      '<div class="ce-block ce-block--ink">' +
        '<h2 class="ce-block-title">工作坊</h2>' +
        '<p class="ce-block-copy">每周六 14:00 · 每场 20 人 · 现场制版与套色，带走自己印的那一张。</p>' +
      '</div>' +
    '</section>' +
    '<section class="ce-metrics">' +
      '<div class="ce-metric"><span class="ce-metric-num">240</span><span class="ce-metric-label">合作场次</span><span class="ce-metric-delta">覆盖 38 城</span></div>' +
      '<div class="ce-metric"><span class="ce-metric-num">3 天</span><span class="ce-metric-label">首稿交付</span><span class="ce-metric-delta">含两轮修改</span></div>' +
      '<div class="ce-metric"><span class="ce-metric-num">6 人</span><span class="ce-metric-label">工作室规模</span><span class="ce-metric-delta">设计与制版各半</span></div>' +
    '</section>' +
    '<section class="ce-card-grid">' +
      '<div class="ce-feat-card"><h3 class="ce-feat-title">品牌视觉</h3><p class="ce-feat-copy">标志、字体与色块规范一次做全，附制版文件与印刷建议。</p></div>' +
      '<div class="ce-feat-card"><h3 class="ce-feat-title">展览空间</h3><p class="ce-feat-copy">从主视觉到墙面排版与导视，现场尺寸先量后做。</p></div>' +
      '<div class="ce-feat-card"><h3 class="ce-feat-title">印刷顾问</h3><p class="ce-feat-copy">纸张、专色与套印顺序，按预算给方案并跟机打样。</p></div>' +
    '</section>' +
    '<blockquote class="ce-quote">先让它被看见，再谈它好不好看。<cite>—— 工作室手记</cite></blockquote>' +
    '<footer class="ce-footer">' +
      '<span>开物 · 创意工作室</span>' +
      '<span>示例内容为合成演示，非真实业务记录</span>' +
    '</footer>' +
  '</div>';
}

/* ── 着陆页：展厅（新增） ──────────────────────────────
   首屏就是作品；导航与说明安静；作品尺寸关系构成识别度。
   素材为项目自制演示图形，本地引用（不使用远程图链）。 */

function galleryLandingHTML() {
  return '<div class="ce-landing">' +
    '<nav class="ce-topbar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="2.5" width="19" height="19" stroke="var(--color-text-primary)" stroke-width="1.2"/><rect x="7" y="7" width="10" height="10" fill="var(--color-accent-base)"/></svg>' +
        '<span class="ce-logo-name">白盒</span>' +
        '<span class="ce-logo-sub">当代艺术空间</span>' +
      '</a>' +
      '<nav class="ce-nav">' +
        '<span class="ce-nav-link">展览</span>' +
        '<span class="ce-nav-link">艺术家</span>' +
        '<span class="ce-nav-link">关于</span>' +
      '</nav>' +
      '<span class="ce-spacer"></span>' +
      '<button class="ce-btn ce-btn-ghost ce-btn-sm">登录</button>' +
      '<button class="ce-btn ce-btn-accent ce-btn-sm">预约观展</button>' +
    '</nav>' +
    '<header class="ce-hero">' +
      '<div class="ce-lead-row">' +
        '<h1 class="ce-hero-title">把作品放在<br>它应有的尺寸上</h1>' +
        '<div class="ce-hero-actions">' +
          '<button class="ce-btn ce-btn-accent ce-btn-sm">预约观展</button>' +
          '<a class="ce-text-link">查看全部作品</a>' +
        '</div>' +
      '</div>' +
      '<p class="ce-hero-sub">白盒当前展出六组作品，涵盖摄影、版画与装置。每件都标注材质与年份——先看图，再看说明。</p>' +
      '<div class="ce-hero-meta"><span>6 组作品</span><span>·</span><span>3 位艺术家</span><span>·</span><span>周二至周日 10:00 — 18:00</span></div>' +
      '<figure class="ce-work is-wide ce-lead-work">' + galleryWorkInnerHTML(GALLERY_WORKS[0]) + '</figure>' +
    '</header>' +
    '<section class="ce-works">' +
      GALLERY_WORKS.slice(1).map(galleryWorkHTML).join('') +
    '</section>' +
    '<section class="ce-split">' +
      '<div>' +
        '<h2 class="ce-split-title">布展说明</h2>' +
        '<p class="ce-split-copy">作品按撑裱尺寸排布：宽幅与竖幅交替，留白由墙面决定而非网格决定。所有图片均为演示素材，用于说明比例与说明文字的排法。</p>' +
        '<div class="ce-catalog">' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">展期</span><span class="ce-catalog-val">2026.09.05 — 11.30</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">场地</span><span class="ce-catalog-val">白盒 · 一至二层展厅</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">导览</span><span class="ce-catalog-val">每周六 15:00 · 需预约</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="ce-window">' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>折光 · 习作一<span class="ce-window-time">一层</span></div>' +
        '<div class="ce-window-row booked"><span class="ce-window-dot"></span>潮线 · 版画<span class="ce-window-time">一层</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>静物 · 三件<span class="ce-window-time">二层</span></div>' +
        '<div class="ce-window-row"><span class="ce-window-dot"></span>断面 · 装置记录<span class="ce-window-time">二层</span></div>' +
      '</div>' +
    '</section>' +
    '<footer class="ce-footer">' +
      '<span>白盒 · 当代艺术空间</span>' +
      '<span>作品图片为项目自制演示素材，非真实收藏</span>' +
    '</footer>' +
  '</div>';
}

function landingDemoHTML() {
  const builders = {
    standard: standardLandingHTML,
    soft: softLandingHTML,
    glass: glassLandingHTML,
    editorial: editorialLandingHTML,
    sepia: sepiaLandingHTML,
    poster: posterLandingHTML,
    gallery: galleryLandingHTML
  };
  return (builders[normalizeStyleId(currentDemoStyle)] || standardLandingHTML)();
}

/* ── 工作台：标准 / 暖糖 / 书卷 / 流光保持既有编排 ──────── */

function standardAppHTML() {
  return '<div class="ce-app">' +
    '<aside class="ce-sidebar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 16 L9 9 L13 13 L20 5" stroke="var(--color-accent-base)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="20" cy="5" r="2" fill="var(--color-accent-base)"/></svg>' +
        '<span class="ce-logo-name">PULSE</span>' +
      '</a>' +
      '<nav class="ce-side-nav">' +
        '<span class="ce-side-item is-active">概览</span>' +
        '<span class="ce-side-item">报表</span>' +
        '<span class="ce-side-item">数据源</span>' +
        '<span class="ce-side-item">共享</span>' +
        '<span class="ce-side-item">设置</span>' +
      '</nav>' +
      '<div class="ce-side-foot">v2.4.1 · UTC+8</div>' +
    '</aside>' +
    '<main class="ce-app-main">' +
      '<header class="ce-app-topbar">' +
        '<span class="ce-app-title">本周概览<span class="ce-app-sub">W25 · 5 月 20 日 — 26 日</span></span>' +
        '<div class="ce-search"><input type="search" placeholder="搜索报表或数据源" aria-label="搜索报表或数据源"></div>' +
        '<span class="ce-user">LIU-J · 分析师</span>' +
      '</header>' +
      '<div class="ce-app-grid">' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">报表列表</span><span class="ce-panel-count">3 份报表 · 1 份待审</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-target"><span class="ce-target-desig">渠道转化日报</span><span class="ce-target-status ok">已就绪</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">漏斗分析周报</span><span class="ce-target-status run">已共享</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">留存 Cohort 双周报</span><span class="ce-target-status">待审核</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel ce-panel-main">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">转化趋势 · 近 8 周</span><span class="ce-panel-count">目标线 4.0%</span></div>' +
          '<div class="ce-panel-body">' + pulseChartSVG() +
            '<div class="ce-figure-legend"><span><b>折线</b> 转化率</span><span><b>虚线</b> 目标</span><span><b>圆点</b> 本周</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">关键指标</span><span class="ce-panel-count">本周</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>月活跃用户<span class="ce-window-time">128.4k</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>整体转化率<span class="ce-window-time">4.2%</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>平均客单价<span class="ce-window-time">¥38.6</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>流失预警<span class="ce-window-time">2 个渠道</span></div>' +
          '</div>' +
        '</section>' +
      '</div>' +
    '</main>' +
  '</div>';
}

function softAppHTML() {
  return '<div class="ce-app">' +
    '<aside class="ce-sidebar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 4a8 8 0 1 0 7.2 11.2A7 7 0 0 1 12 4z" stroke="var(--color-accent-base)" stroke-width="1.8" stroke-linejoin="round"/></svg>' +
        '<span class="ce-logo-name">舒心</span>' +
      '</a>' +
      '<nav class="ce-side-nav">' +
        '<span class="ce-side-item is-active">今日</span>' +
        '<span class="ce-side-item">课程</span>' +
        '<span class="ce-side-item">睡眠</span>' +
        '<span class="ce-side-item">呼吸</span>' +
        '<span class="ce-side-item">设置</span>' +
      '</nav>' +
      '<div class="ce-side-foot">v2.4.1 · 会员</div>' +
    '</aside>' +
    '<main class="ce-app-main">' +
      '<header class="ce-app-topbar">' +
        '<span class="ce-app-title">今日练习<span class="ce-app-sub">DAY 5 · 连续打卡</span></span>' +
        '<div class="ce-search"><input type="search" placeholder="搜索课程" aria-label="搜索课程"></div>' +
        '<span class="ce-user">LIU-J · 会员</span>' +
      '</header>' +
      '<div class="ce-app-grid">' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">今日计划</span><span class="ce-panel-count">3 项练习 · 42 分钟</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-target"><span class="ce-target-desig">呼吸练习</span><span class="ce-target-status ok">已完成</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">睡前拉伸</span><span class="ce-target-status run">进行中</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">白噪音</span><span class="ce-target-status">待开始</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel ce-panel-main">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">呼吸练习 · 4-7-8</span><span class="ce-panel-count">第 2 轮 · 共 4 轮</span></div>' +
          '<div class="ce-panel-body">' + breathRingSVG() +
            '<div class="ce-figure-legend"><span><b>圆环</b> 本轮进度</span><span><b>圆点</b> 节拍</span><span><b>数字</b> 呼吸节奏</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">本周数据</span><span class="ce-panel-count">7 月 20 日 — 26 日</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>练习天数<span class="ce-window-time">5 天</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>平均睡眠<span class="ce-window-time">7.2h</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>入睡用时<span class="ce-window-time">18 分钟</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>连续打卡<span class="ce-window-time">5 天</span></div>' +
          '</div>' +
        '</section>' +
      '</div>' +
    '</main>' +
  '</div>';
}

function glassAppHTML() {
  return '<div class="ce-app">' +
    '<aside class="ce-sidebar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.4" stroke="var(--color-accent-base)" stroke-width="1.8"/><path d="M12 8.6V4.2M12 19.8v-4.4M15.4 12h4.4M4.2 12h4.4" stroke="var(--color-text-secondary)" stroke-width="1.2" opacity=".55"/></svg>' +
        '<span class="ce-logo-name">NEXUS</span>' +
      '</a>' +
      '<nav class="ce-side-nav">' +
        '<span class="ce-side-item is-active">概览</span>' +
        '<span class="ce-side-item">智能体</span>' +
        '<span class="ce-side-item">数据流</span>' +
        '<span class="ce-side-item">任务</span>' +
        '<span class="ce-side-item">监控</span>' +
      '</nav>' +
      '<div class="ce-side-foot">v2.4.1 · UTC+8</div>' +
    '</aside>' +
    '<main class="ce-app-main">' +
      '<header class="ce-app-topbar">' +
        '<span class="ce-app-title">管线监控<span class="ce-app-sub">PIPELINE 07 · 3 个任务</span></span>' +
        '<div class="ce-search"><input type="search" placeholder="搜索智能体或数据源" aria-label="搜索智能体或数据源"></div>' +
        '<span class="ce-user">LIU-J · 值班</span>' +
      '</header>' +
      '<div class="ce-app-grid">' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">智能体列表</span><span class="ce-panel-count">3 个智能体 · 1 个空闲</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-target"><span class="ce-target-desig">NLP-ROUTER</span><span class="ce-target-status ok">运行中</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">EMBED-BATCH</span><span class="ce-target-status run">调度中</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">VISION-QUEUE</span><span class="ce-target-status">待接入</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel ce-panel-main">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">实时管线 · NLP-ROUTER</span><span class="ce-panel-count">BATCH 2048 · 吞吐 1.2k/s</span></div>' +
          '<div class="ce-panel-body">' + nexusGraphSVG() +
            '<div class="ce-figure-legend"><span><b>圆点</b> 数据源 / 智能体</span><span><b>连线</b> 数据流</span><span><b>走线</b> 主路径</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">实时指标</span><span class="ce-panel-count">近 5 分钟</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>平均延迟<span class="ce-window-time">42ms</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>吞吐量<span class="ce-window-time">1.2k req/s</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>成功率<span class="ce-window-time">99.97%</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>失败重试<span class="ce-window-time">3 次</span></div>' +
          '</div>' +
        '</section>' +
      '</div>' +
    '</main>' +
  '</div>';
}

function editorialAppHTML() {
  return '<div class="ce-app">' +
    '<aside class="ce-sidebar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 4v16M5 4h9a3 3 0 0 1 3 3v13M5 8h9M5 12h9M5 16h7" stroke="var(--color-accent-base)" stroke-width="1.6" stroke-linejoin="round"/></svg>' +
        '<span class="ce-logo-name">知卷</span>' +
      '</a>' +
      '<nav class="ce-side-nav">' +
        '<span class="ce-side-item is-active">版面</span>' +
        '<span class="ce-side-item">稿件</span>' +
        '<span class="ce-side-item">图库</span>' +
        '<span class="ce-side-item">排期</span>' +
        '<span class="ce-side-item">设置</span>' +
      '</nav>' +
      '<div class="ce-side-foot">v2.4.1 · 编辑部</div>' +
    '</aside>' +
    '<main class="ce-app-main">' +
      '<header class="ce-app-topbar">' +
        '<span class="ce-app-title">本期版面<span class="ce-app-sub">VOL.07 · 8 月号</span></span>' +
        '<div class="ce-search"><input type="search" placeholder="搜索稿件或作者" aria-label="搜索稿件或作者"></div>' +
        '<span class="ce-user">陈默 · 编辑</span>' +
      '</header>' +
      '<div class="ce-app-grid">' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">稿件队列</span><span class="ce-panel-count">3 篇主文 · 1 篇待定稿</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-target"><span class="ce-target-desig">夜航者的城市</span><span class="ce-target-status ok">已排版</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">急诊室的第三班</span><span class="ce-target-status run">审校中</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">送奶工时刻</span><span class="ce-target-status">待定稿</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel ce-panel-main">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">版面样张 · 刊头</span><span class="ce-panel-count">VOL.07 · 72 页</span></div>' +
          '<div class="ce-panel-body">' + mastheadSVG() +
            '<div class="ce-figure-legend"><span><b>刊号</b> 卷期数字</span><span><b>标题</b> 专题名</span><span><b>发丝线</b> 刊头分隔</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">排期</span><span class="ce-panel-count">8 月号</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>截稿<span class="ce-window-time">8/10</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>校对<span class="ce-window-time">8/14</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>付印<span class="ce-window-time">8/18</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>上市<span class="ce-window-time">8/21</span></div>' +
          '</div>' +
        '</section>' +
      '</div>' +
    '</main>' +
  '</div>';
}

/* ── 工作台：褐页（新增）——资料 / 收藏目录任务
   验证列表、筛选、输入、状态与空状态，操作区保持清楚紧凑。 */

function sepiaAppHTML() {
  return '<div class="ce-app">' +
    '<aside class="ce-sidebar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="3.5" width="17" height="17" stroke="var(--color-accent-base)" stroke-width="1.4"/><path d="M8 8h8M8 12h8M8 16h4" stroke="var(--ce-ink-2)" stroke-width="1.2"/></svg>' +
        '<span class="ce-logo-name">藏卷</span>' +
      '</a>' +
      '<nav class="ce-side-nav">' +
        '<span class="ce-side-item is-active">编目</span>' +
        '<span class="ce-side-item">馆藏</span>' +
        '<span class="ce-side-item">借阅</span>' +
        '<span class="ce-side-item">修复</span>' +
        '<span class="ce-side-item">设置</span>' +
      '</nav>' +
      '<div class="ce-side-foot">v1.2 · 馆内系统</div>' +
    '</aside>' +
    '<main class="ce-app-main">' +
      '<header class="ce-app-topbar">' +
        '<span class="ce-app-title">编目工作台<span class="ce-app-sub">第 4 辑 · 2026 年 8 月</span></span>' +
        '<div class="ce-search"><input type="search" placeholder="搜索档号或题名" aria-label="搜索档号或题名"></div>' +
        '<span class="ce-user">陈默 · 编目</span>' +
      '</header>' +
      '<div class="ce-app-grid">' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">待编目</span><span class="ce-panel-count">3 件 · 1 件修复中</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-filter-row"><span class="is-on">全部</span><span>稿</span><span>函</span><span>刊</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">稿 001 · 城西水道记</span><span class="ce-target-status ok">已入库</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">函 014 · 民国信札</span><span class="ce-target-status run">修复中</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">刊 007 · 城南画报</span><span class="ce-target-status">待编目</span></div>' +
            /* 加载态与空状态同区出现：这一块还在校验，另一块已经确认是空的 */
            '<div class="ce-loading"><div class="ce-loading-bar"></div><span>正在校验第 4 辑档号…</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel ce-panel-main">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">书页样张 · 稿 001</span><span class="ce-panel-count">版心 288 页</span></div>' +
          '<div class="ce-panel-body">' + sepiaFolioSVG() +
            '<div class="ce-figure-legend"><span><b>版心</b> 双线页边</span><span><b>页码</b> 等宽小字</span><span><b>印章</b> 品牌色标记</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">登记新条目</span><span class="ce-panel-count">档号自动生成</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>在库<span class="ce-window-time">12,468 卷</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>修复中<span class="ce-window-time">6 卷</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>外借<span class="ce-window-time">4 卷</span></div>' +
            '<div class="ce-field"><input class="ce-input" type="text" placeholder="题名，如：河埠旧影" aria-label="新增条目题名"><button class="ce-btn ce-btn-accent ce-btn-sm">登记</button></div>' +
            '<div class="ce-empty"><span>本周暂无待编目文献</span><span class="ce-page-no">全部条目已入库</span></div>' +
          '</div>' +
        '</section>' +
      '</div>' +
    '</main>' +
  '</div>';
}

/* ── 工作台：构色（新增）——形状语言保留，规模收紧，表格/表单/导航易扫 ── */

function posterAppHTML() {
  return '<div class="ce-app">' +
    '<aside class="ce-sidebar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" fill="var(--color-accent-base)"/><path d="M8 16l4-8 4 8z" fill="var(--color-text-emphasis)"/></svg>' +
        '<span class="ce-logo-name">开物</span>' +
      '</a>' +
      '<nav class="ce-side-nav">' +
        '<span class="ce-side-item is-active">排期</span>' +
        '<span class="ce-side-item">活动</span>' +
        '<span class="ce-side-item">报名</span>' +
        '<span class="ce-side-item">物料</span>' +
        '<span class="ce-side-item">设置</span>' +
      '</nav>' +
      '<div class="ce-side-foot">v1.2 · 工作室</div>' +
    '</aside>' +
    '<main class="ce-app-main">' +
      '<header class="ce-app-topbar">' +
        '<span class="ce-app-title">活动排期<span class="ce-app-sub">秋季 · 4 场</span></span>' +
        '<div class="ce-search"><input type="search" placeholder="搜索活动或客户" aria-label="搜索活动或客户"></div>' +
        '<span class="ce-user">LIU-J · 主理人</span>' +
      '</header>' +
      '<div class="ce-app-grid">' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">活动列表</span><span class="ce-panel-count">4 场 · 1 场待确认</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-filter-row"><span class="is-on">全部</span><span>展览</span><span>工作坊</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">城市海报展</span><span class="ce-target-status ok">已确认</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">制版工作坊</span><span class="ce-target-status run">报名中</span></div>' +
            '<div class="ce-target"><span class="ce-target-desig">高校讲座</span><span class="ce-target-status">待确认</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel ce-panel-main">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">主视觉稿 · 海报展</span><span class="ce-panel-count">3 版 · 第 2 版选用</span></div>' +
          '<div class="ce-panel-body">' + posterMarkSVG() +
            '<div class="ce-figure-legend"><span><b>方块</b> 主色块</span><span><b>墨圆</b> 主题字底</span><span><b>描边</b> 信息区</span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">报名与物料</span><span class="ce-panel-count">本周</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>报名<span class="ce-window-time">128 / 160</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>海报印刷<span class="ce-window-time">已交付</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>导视物料<span class="ce-window-time">待打样</span></div>' +
            '<div class="ce-field"><input class="ce-input" type="text" placeholder="新活动名称" aria-label="新活动名称"><button class="ce-btn ce-btn-accent ce-btn-sm">新建</button></div>' +
          '</div>' +
        '</section>' +
      '</div>' +
    '</main>' +
  '</div>';
}

/* ── 工作台：展厅（新增）——作品管理；媒体是内容，不牺牲操作效率 ── */

function galleryAppHTML() {
  return '<div class="ce-app">' +
    '<aside class="ce-sidebar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="2.5" width="19" height="19" stroke="var(--color-text-primary)" stroke-width="1.2"/><rect x="7" y="7" width="10" height="10" fill="var(--color-accent-base)"/></svg>' +
        '<span class="ce-logo-name">白盒</span>' +
      '</a>' +
      '<nav class="ce-side-nav">' +
        '<span class="ce-side-item is-active">作品</span>' +
        '<span class="ce-side-item">展览</span>' +
        '<span class="ce-side-item">图库</span>' +
        '<span class="ce-side-item">装裱</span>' +
        '<span class="ce-side-item">设置</span>' +
      '</nav>' +
      '<div class="ce-side-foot">v1.2 · 空间系统</div>' +
    '</aside>' +
    '<main class="ce-app-main">' +
      '<header class="ce-app-topbar">' +
        '<span class="ce-app-title">作品库<span class="ce-app-sub">6 组 · 24 张</span></span>' +
        '<div class="ce-search"><input type="search" placeholder="搜索作品或艺术家" aria-label="搜索作品或艺术家"></div>' +
        '<span class="ce-user">LIU-J · 策展</span>' +
      '</header>' +
      '<div class="ce-app-grid">' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">作品列表</span><span class="ce-panel-count">6 组 · 1 组待补图</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-filter-row"><span class="is-on">全部</span><span>摄影</span><span>版画</span><span>装置</span></div>' +
            '<div class="ce-work-row"><div class="ce-work-thumb"><img src="assets/work-demo-01.svg" alt=""></div><div><div class="ce-work-row-name">折光 · 习作一</div><div class="ce-work-row-meta">2024 · 数字微喷 · 1200×520</div></div><span class="ce-work-row-state">已装裱</span></div>' +
            '<div class="ce-work-row"><div class="ce-work-thumb"><img src="assets/work-demo-02.svg" alt=""></div><div><div class="ce-work-row-name">潮线</div><div class="ce-work-row-meta">2023 · 丝网版画 · 800×600</div></div><span class="ce-work-row-state">在展</span></div>' +
            '<div class="ce-work-row"><div class="ce-work-thumb"><img src="assets/work-demo-04.svg" alt=""></div><div><div class="ce-work-row-name">静物 · 三件</div><div class="ce-work-row-meta">2022 · 布面油画 · 600×800</div></div><span class="ce-work-row-state">待装裱</span></div>' +
            '<div class="ce-work-row"><div class="ce-work-thumb"></div><div><div class="ce-work-row-name">未命名 · 待补图</div><div class="ce-work-row-meta">缺图 · 仅有清单记录</div></div><span class="ce-work-row-state">待补</span></div>' +
            /* 错误态：作品管理里最真实的失败是「缩略图没同步上」，不是泛泛的「出错了」 */
            '<div class="ce-error"><span class="ce-error-title">缩略图同步失败 · 3 组</span><span>展签与尺寸已入库，仅预览图缺失，不影响展出排期。</span><span class="ce-error-actions"><button class="ce-btn ce-btn-sm">重新同步</button><a class="ce-text-link">查看记录</a></span></div>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel ce-panel-main">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">当前作品 · 折光 习作一</span><span class="ce-panel-count">2024 · 数字微喷</span></div>' +
          '<div class="ce-panel-body">' +
            '<figure class="ce-prism"><img src="assets/work-demo-01.svg" alt="作品演示：折光 · 习作一"><figcaption class="ce-prism-caption">宽幅 16:7 · 撑裱后 1200 × 520 mm</figcaption></figure>' +
          '</div>' +
        '</section>' +
        '<section class="ce-panel">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">作品信息</span><span class="ce-panel-count">6 个字段</span></div>' +
          '<div class="ce-panel-body">' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>比例<span class="ce-window-time">16:7 宽幅</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot" style="background:var(--color-accent-base)"></span>版本<span class="ce-window-time">3 / 8</span></div>' +
            '<div class="ce-panel-row"><span class="ce-window-dot"></span>保险估值<span class="ce-window-time">待补充</span></div>' +
            '<div class="ce-field"><input class="ce-input" type="text" placeholder="新增作品名称" aria-label="新增作品名称"><button class="ce-btn ce-btn-accent ce-btn-sm">上传</button></div>' +
          '</div>' +
        '</section>' +
      '</div>' +
    '</main>' +
  '</div>';
}

function appDemoHTML() {
  const builders = {
    standard: standardAppHTML,
    soft: softAppHTML,
    glass: glassAppHTML,
    editorial: editorialAppHTML,
    sepia: sepiaAppHTML,
    poster: posterAppHTML,
    gallery: galleryAppHTML
  };
  return (builders[normalizeStyleId(currentDemoStyle)] || standardAppHTML)();
}

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
      '<div class="ce-landing ce-style-' + p.id + '">' +
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
      '<div class="ce-landing ce-style-' + p.id + ' ce-compare-page">' +
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

