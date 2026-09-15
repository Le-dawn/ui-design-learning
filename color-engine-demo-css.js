/* ============================================================
   COLOR ENGINE DEMO · CSS — 共享骨架样式与导出 CSS
   依赖：design-profiles.js（buildProfilesCSS / profileWorldCSS / profileScopedCSS）
   职责：七种风格共用的组件骨架 CSS（buildDemoCSS）、工具预览构件
        （buildToolPreviewCSS：缩略图 / 比较样张），以及预览与导出的组合入口
        （allStylesCSS / previewCSS / exportComponentCSS）。
        风格的「世界变量 + 作用域样式」不在这里，来自 design-profiles.js。
   ============================================================ */

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

    /* ── 着陆页骨架：页面层 + 版心层 ──
       页面层（.ce-landing）满宽，材料主导的风格（褐页）在这里铺整页底色；
       版心层（.ce-column）只负责正文列宽与纵向节奏。底色绝不挂在版心上，
       否则容器比版心宽时，纸面会缩成中间一条褐。 */
    .ce-landing { padding: var(--space-2xl) 0 var(--space-5xl); }
    .ce-column { max-width: 920px; margin: 0 auto; display: flex; flex-direction: column; gap: var(--space-6xl); }
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
    .ce-thumb-inner .ce-landing { padding: var(--space-xl) var(--space-xl) 0; }
    .ce-thumb-inner .ce-column { max-width: none; gap: var(--space-xl); }
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
    .ce-compare-page { padding: var(--space-lg); }
    .ce-compare-page .ce-column { gap: var(--space-lg); }
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
