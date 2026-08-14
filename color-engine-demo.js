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
       standard  标准：现代 SaaS 通用面貌（无主题化装饰）
       字体全部系统原生栈（零依赖、离线一致）：展示声部双平台可辨，
       数据一律系统等宽 + tabular-nums */
    .ce-landing, .ce-app {
      --ce-display: "Avenir Next", "Bahnschrift", "Segoe UI", -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif;
      --ce-body: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
      --ce-mono: "SF Mono", "Cascadia Code", Consolas, ui-monospace, Menlo, monospace;
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
    /* 链接文字用强调色阶最深档（accent-active），小字链接达到 AA 对比度 */
    .ce-text-link { color: var(--color-accent-active); font-weight: 600; font-size: .9rem; text-decoration: underline; text-decoration-color: color-mix(in srgb, var(--color-accent-base) 45%, transparent); text-underline-offset: 4px; cursor: pointer; }
    .ce-text-link:hover { text-decoration-color: var(--color-accent-base); }

    /* ── 着陆页 ── */
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
    .ce-hero-actions { display: flex; align-items: center; gap: var(--space-md); margin-top: var(--space-lg); }
    .ce-hero-meta { margin-top: var(--space-lg); font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .05em; color: var(--color-text-secondary); display: flex; gap: var(--space-sm); flex-wrap: wrap; }

    .ce-prism { margin: 0; position: relative; }
    .ce-prism svg { display: block; width: 100%; height: auto; }
    .ce-prism-caption { font-family: var(--ce-mono); font-size: .64rem; letter-spacing: .05em; color: var(--color-text-secondary); margin-top: 8px; text-align: center; }
    /* 棱镜五带：默认静态；进场时刻只属于光谱世界（见 spectrum 覆盖层） */
    .ce-band { opacity: 1; transform: none; }

    /* ── 观测排程数据板 ── */
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

    /* ── 谱线库 / 今夜窗口 分栏 ── */
    .ce-split { display: grid; grid-template-columns: 1.1fr .9fr; gap: var(--space-4xl); align-items: start; }
    @media (max-width: 680px) { .ce-split { grid-template-columns: 1fr; } }
    .ce-split-title { font-family: var(--ce-display); font-size: 1.25rem; font-weight: 700; letter-spacing: -.01em; color: var(--color-text-emphasis); }
    .ce-split-copy { margin-top: var(--space-sm); color: var(--color-text-secondary); font-size: .92rem; line-height: 1.7; max-width: 52ch; }
    .ce-catalog { margin-top: var(--space-md); display: flex; flex-direction: column; }
    .ce-catalog-item { display: flex; gap: var(--space-sm); align-items: baseline; padding: 7px 0; border-bottom: var(--ce-line) solid var(--ce-border-c); font-size: .84rem; }
    .ce-catalog-item:last-child { border-bottom: none; }
    /* 强调色纪律：目录键降为次要文字（mono 加粗保留声部），accent 只留语义位置 */
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

    /* ── 工作台（Operate）── */
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
    .ce-panel { border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-md); background: var(--ce-card-bg); }
    .ce-panel-spectrum { grid-row: span 2; }
    .ce-panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-sm); padding: 12px 16px; border-bottom: var(--ce-line) solid var(--ce-border-c); }
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

    .ce-spectrum { width: 100%; display: block; }
    .ce-spectrum-legend { display: flex; gap: var(--space-lg); margin-top: 10px; font-family: var(--ce-mono); font-size: .62rem; letter-spacing: .04em; color: var(--color-text-secondary); flex-wrap: wrap; }
    .ce-spectrum-legend b { color: var(--color-text-secondary); font-weight: 500; }

    .ce-panel-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: .78rem; color: var(--color-text-secondary); }
    .ce-panel-row + .ce-panel-row { border-top: var(--ce-line) solid var(--ce-border-c); }

    /* ── 世界化区块类：基础样式全部走世界变量，视觉自动跟随风格 ── */
    .ce-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
    @media (max-width: 680px) { .ce-metrics { grid-template-columns: 1fr; } }
    .ce-metric { display: flex; flex-direction: column; gap: 4px; padding: 18px 20px; background: var(--ce-card-bg); border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-md); }
    .ce-metric-num { font-family: var(--ce-display); font-size: 1.55rem; font-weight: 700; letter-spacing: -.02em; color: var(--color-text-emphasis); font-variant-numeric: tabular-nums; }
    .ce-metric-label { font-family: var(--ce-mono); font-size: .62rem; letter-spacing: .08em; color: var(--color-text-secondary); }
    .ce-metric-delta { font-size: .72rem; font-weight: 600; color: var(--color-success); }
    .ce-quote { margin: 0; padding: var(--space-2xl) var(--space-3xl); border-left: var(--ce-line) solid var(--color-accent-base); font-family: var(--ce-display); font-size: 1.12rem; line-height: 1.8; color: var(--color-text-emphasis); }
    .ce-quote cite { display: block; margin-top: 10px; font-family: var(--ce-mono); font-size: .66rem; font-style: normal; letter-spacing: .1em; color: var(--color-text-secondary); }
    .ce-feat-card { display: flex; flex-direction: column; gap: 12px; padding: 22px 20px; background: var(--ce-card-bg); border: var(--ce-line) solid var(--ce-border-c); border-radius: var(--ce-r-md); }
    .ce-feat-icon { width: 32px; height: 32px; }
    .ce-feat-title { font-family: var(--ce-display); font-size: 1rem; font-weight: 700; color: var(--color-text-emphasis); }
    .ce-feat-copy { font-size: .84rem; line-height: 1.65; color: var(--color-text-secondary); }
    .ce-card-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); }
    @media (max-width: 680px) { .ce-card-grid { grid-template-columns: 1fr; } }
    .ce-card-grid .ce-feat-card { margin: 0; }

    @media (max-width: 680px) {
      .ce-row { grid-template-columns: 90px 1fr 90px; }
      .ce-row .ce-row-spec { display: none; }
      .ce-search input { width: 130px; }
    }
    /* 窄屏顶栏折行：topbar 按钮不再溢出卡片 */
    @media (max-width: 560px) {
      .ce-topbar { flex-wrap: wrap; row-gap: 8px; }
    }
  `;
}

// ── 风格系统：同一份 HTML + 同一组 tokens，不同视觉世界 ──
// 每个风格 = 世界变量覆盖 + 专属规则。切换风格只换 CSS，不动结构、不动 token。

function demoStyleCSS(style) {
  const css = {
    // ── 光谱：默认风格（无变量覆盖），仅签名魔法 ──
    // 签名魔法 1：行对焦 —— 仪器式聚焦反馈（悬停行时数据列依次点亮）
    // 签名魔法 2：图版编号 PLATE 01/02（科学图版语言，只在光谱世界显示）
    // 签名魔法 3：棱镜五带进场（全页唯一的进场时刻，其余世界静态）
    spectrum: `
      .ce-style-spectrum .ce-row:hover .ce-row-desig { color: var(--color-accent-base); }
      .ce-style-spectrum .ce-row:hover .ce-row-spec { filter: contrast(1.3) saturate(1.2); }
      .ce-style-spectrum .ce-row:hover .ce-row-time { color: var(--color-text-primary); }
      /* 标题刻度线：仪器铭牌感 */
      .ce-style-spectrum .ce-hero-title { position: relative; padding-bottom: 14px; }
      .ce-style-spectrum .ce-hero-title::after { content: ""; position: absolute; left: 0; bottom: 0; height: 2px; width: 56px; background: var(--color-accent-base); }
      /* 图版编号只在光谱世界出现 */
      .ce-style-spectrum .ce-plate-no { display: block; }
      /* 棱镜五带进场：光谱独占的进场时刻 */
      .ce-style-spectrum .ce-band { opacity: 0; transform: translateX(-8px); animation: ceBandIn .5s cubic-bezier(.22,.9,.3,1) forwards; }
      @keyframes ceBandIn { to { opacity: 1; transform: translateX(0); } }
      @media (prefers-reduced-motion: reduce) {
        .ce-style-spectrum .ce-band { opacity: 1; transform: none; animation: none; }
      }
    `,
    // 暖糖：消费级亲切感 —— 大圆角、柔影、圆点状态、浅边框
    soft: `
      .ce-style-soft { --ce-r-sm: 14px; --ce-r-md: 20px; --ce-line: 1px; --ce-dot-r: 50%; --ce-card-bg: var(--color-surface-raised); --ce-border-c: color-mix(in srgb, var(--color-border) 55%, transparent); --ce-shadow-btn: 0 1px 2px rgba(0,0,0,.06), 0 6px 18px color-mix(in srgb, var(--color-accent-base) 26%, transparent); --ce-shadow-inset: inset 0 2px 4px rgba(0,0,0,.08); --ce-display: "SF Pro Rounded", "Segoe UI Variable", "Segoe UI", -apple-system, "PingFang SC", sans-serif; }
      .ce-style-soft .ce-panel, .ce-app.ce-style-soft { box-shadow: 0 12px 32px -14px color-mix(in srgb, var(--color-text-emphasis) 22%, transparent); }
      .ce-style-soft .ce-hero-title { letter-spacing: -.01em; }
      .ce-style-soft .ce-logo-name { letter-spacing: .06em; }
      /* 签名魔法：弹性按压 —— 消费产品的回弹手感（overshoot 曲线） */
      .ce-style-soft .ce-btn { transition: transform .22s cubic-bezier(.34, 1.56, .64, 1), box-shadow .15s, background .15s; }
      .ce-style-soft .ce-btn-accent:hover { transform: scale(1.045); }
      .ce-style-soft .ce-btn-accent:active { transform: scale(.95) translateY(1px); }
      /* 今夜窗口卡片化：让柔影/大圆角有落点（着陆页唯一的卡片面） */
      .ce-style-soft .ce-window { background: var(--color-surface-raised); border: 1px solid var(--ce-border-c); border-radius: var(--ce-r-md); padding: 16px 18px; box-shadow: 0 12px 32px -14px color-mix(in srgb, var(--color-text-emphasis) 20%, transparent); }
      .ce-style-soft .ce-window::before { display: none; }
      .ce-style-soft .ce-window-row { padding-left: 0; }
      @media (prefers-reduced-motion: reduce) {
        .ce-style-soft .ce-btn { transition: background .15s; }
        .ce-style-soft .ce-btn-accent:hover, .ce-style-soft .ce-btn-accent:active { transform: none; }
      }
    `,
    // 流光：AI / SaaS 科技感 —— 玻璃模糊、辉光按钮、渐变光斑
    glass: `
      .ce-style-glass { --ce-r-sm: 10px; --ce-r-md: 16px; --ce-line: 1px; --ce-dot-r: 50%; --ce-card-bg: color-mix(in srgb, var(--color-bg-secondary) 76%, transparent); --ce-shadow-btn: 0 0 0 1px color-mix(in srgb, var(--color-accent-base) 20%, transparent), 0 8px 26px color-mix(in srgb, var(--color-accent-base) 42%, transparent); --ce-shadow-inset: inset 0 1px 2px rgba(0,0,0,.12); --ce-display: "Helvetica Neue", "Segoe UI Variable", "Segoe UI", -apple-system, "PingFang SC", sans-serif; }
      /* 玻璃必须糊到东西：app 壳铺渐变光景（accent-subtle + accent-2 双 radial），
         半透明面板 + blur 才有物可糊。sidebar 不透明、主区透明 → 玻璃只出现在内容区 */
      .ce-app.ce-style-glass { background:
        radial-gradient(52% 46% at 16% 8%, color-mix(in srgb, var(--color-accent-subtle) 62%, transparent), transparent 72%),
        radial-gradient(46% 56% at 88% 92%, color-mix(in srgb, var(--color-accent-2) 48%, transparent), transparent 72%),
        var(--color-bg-primary); }
      .ce-app.ce-style-glass .ce-panel { backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); box-shadow: inset 0 1px 0 rgba(255,255,255,.26); }
      /* 顶栏玻璃化：横贯光景上方，blur 可见 */
      .ce-app.ce-style-glass .ce-app-topbar { background: color-mix(in srgb, var(--color-bg-secondary) 52%, transparent); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); }
      /* 着陆页 hero 光景移到 prism 玻璃卡片正后方（右侧 radial 用 accent-2） */
      .ce-style-glass .ce-hero { position: relative; }
      .ce-style-glass .ce-hero::before { content: ""; position: absolute; z-index: 0; inset: -8% -4%; background:
        radial-gradient(42% 52% at 16% 22%, color-mix(in srgb, var(--color-accent-subtle) 72%, transparent), transparent 74%),
        radial-gradient(38% 50% at 80% 46%, color-mix(in srgb, var(--color-accent-2) 46%, transparent), transparent 72%);
        pointer-events: none; }
      .ce-style-glass .ce-hero > * { position: relative; z-index: 1; }
      .ce-style-glass .ce-prism { margin: 0; padding: 20px 20px 12px; background: color-mix(in srgb, var(--color-bg-secondary) 58%, transparent); border: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent); border-radius: var(--ce-r-md); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); box-shadow: inset 0 1px 0 rgba(255,255,255,.26); }
      .ce-style-glass .ce-prism-caption { margin-top: 10px; }
      .ce-style-glass .ce-hero-title { letter-spacing: -.015em; }
      /* 签名魔法：CTA 辉光呼吸 —— AI 产品的招牌光效（主光晕带偏移，非纯光环） */
      .ce-style-glass .ce-btn-accent { animation: ceGlassPulse 3.2s ease-in-out infinite; }
      @keyframes ceGlassPulse {
        0%, 100% { box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-accent-base) 20%, transparent), 0 6px 18px color-mix(in srgb, var(--color-accent-base) 30%, transparent); }
        50% { box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-accent-base) 28%, transparent), 0 10px 32px color-mix(in srgb, var(--color-accent-base) 52%, transparent); }
      }
      @media (prefers-reduced-motion: reduce) { .ce-style-glass .ce-btn-accent { animation: none; } }
    `,
    // 书卷：内容 / 品牌 —— 衬线标题、大留白、无阴影、强调克制
    editorial: `
      .ce-style-editorial { --ce-r-sm: 2px; --ce-r-md: 4px; --ce-line: 1px; --ce-dot-r: 1px; --ce-display: "Songti SC", "Noto Serif SC", "STSong", "SimSun", Georgia, "Times New Roman", serif; --ce-mono: "Songti SC", "Noto Serif SC", "STSong", "SimSun", Georgia, "Times New Roman", serif; --ce-shadow-btn: none; --ce-shadow-inset: none; }
      .ce-landing.ce-style-editorial { gap: var(--space-7xl); }
      .ce-style-editorial .ce-hero-title { letter-spacing: 0; }
      .ce-style-editorial .ce-logo-name { font-family: var(--ce-display); letter-spacing: .04em; }
      .ce-style-editorial .ce-btn { letter-spacing: .04em; }
      .ce-style-editorial .ce-btn-accent { box-shadow: none; }
      .ce-style-editorial .ce-panel, .ce-app.ce-style-editorial { box-shadow: none; }
      /* 签名魔法：笔墨下划线 —— 链接与导航下划线从左到右生长（纸张笔墨感） */
      .ce-style-editorial .ce-nav-link { border-bottom: 0; position: relative; }
      .ce-style-editorial .ce-text-link, .ce-style-editorial .ce-nav-link { position: relative; text-decoration: none; }
      .ce-style-editorial .ce-text-link::after, .ce-style-editorial .ce-nav-link::after { content: ""; position: absolute; left: 0; bottom: -3px; height: 1px; width: 100%; background: var(--color-accent-base); transform: scaleX(0); transform-origin: left; transition: transform .3s cubic-bezier(.22, .9, .3, 1); }
      .ce-style-editorial .ce-text-link:hover::after, .ce-style-editorial .ce-nav-link:hover::after { transform: scaleX(1); }
      @media (prefers-reduced-motion: reduce) {
        .ce-style-editorial .ce-text-link::after, .ce-style-editorial .ce-nav-link::after { transition: none; transform: none; }
      }
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
      /* 签名魔法：主视觉进场淡入上浮 —— 全页唯一的进场时刻 */
      .ce-style-standard .ce-hero { animation: ceStdFadeUp .5s cubic-bezier(.22, .9, .3, 1) both; }
      @keyframes ceStdFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) { .ce-style-standard .ce-hero { animation: none; } }
    `
  };
  return css[style] || '';
}

// ── 规则条：随风格切换的「设计约定」教学文本（与 STYLES.md 保持一致）──

const RULES_BY_STYLE = {
  spectrum: {
    title: '光谱世界 · 纸面工业',
    rules: [
      ['01 强调是例外', '彩色只出现在语义位置（主按钮 / 链接 / 选中态 / 状态点），一屏 ≤ 3 处'],
      ['02 数据即读数', '数据 / 编号 / 时间一律等宽 tabular；字重分级，别让同一字重从头走到尾'],
      ['03 发丝线结构', '全部结构靠 1px 发丝边框与纸白分层；3px 倒角，禁用圆角胶囊'],
      ['04 深度靠线不靠色', '偏移阴影 + 发丝线；无渐变、无光斑、无装饰彩虹'],
      ['05 气质', '像天文台控制台——数据可信，界面退后']
    ]
  },
  standard: {
    title: '标准世界 · 现代 SaaS',
    rules: [
      ['01 强调是例外', '主按钮实色、链接、选中态、焦点环，一屏 ≤ 3 处'],
      ['02 白卡浮浅底', '适中圆角（8–12px）+ 柔和双层阴影；1px 细边框'],
      ['03 系统无衬线', '标题加粗 + 正文常规，数字 tabular；不引入特殊字体'],
      ['04 交互克制', 'hover 轻微上浮 + 阴影加深，active 内凹，过渡 150ms'],
      ['05 零装饰', '无网格、无印章、无光斑、无渐变文字；图标用统一描边 SVG']
    ]
  },
  soft: {
    title: '暖糖世界 · 消费级圆润',
    rules: [
      ['01 大圆角 + 柔影', '14–20px 圆角，多层柔和阴影（模糊 10–30px、低透明度）'],
      ['02 圆润无衬线', '字距可放宽，少用等宽字体；状态点圆形'],
      ['03 强调可活泼', '按钮、徽章、图标底都能用，但一屏仍不超过 3 处'],
      ['04 弹性手感', 'hover 上浮 1px，按压下沉回弹（overshoot 曲线），过渡 150ms'],
      ['05 气质', '亲切、安全、值得信任——像健康 / 教育类 App']
    ]
  },
  glass: {
    title: '流光世界 · 玻璃科技',
    rules: [
      ['01 玻璃面板', '半透明表面 + backdrop-filter blur 14–18px + 1px 半透明描边'],
      ['02 光效有作者', 'CTA 辉光呼吸带偏移；光斑只在大区块顶部，发光不刺眼'],
      ['03 标题收紧', '现代几何无衬线，标题字距略收紧'],
      ['04 强调克制', '一屏 ≤ 3 处，光效是唯一持续动效'],
      ['05 气质', 'AI 产品、未来感——玻璃要糊得到东西，否则删掉 blur']
    ]
  },
  editorial: {
    title: '书卷世界 · 编辑内容',
    rules: [
      ['01 衬线声音', '中文宋体 / 英文 Georgia；标题不收紧字距，正文行高 1.7'],
      ['02 强调全场最多 1 处', '链接或 CTA 二选一，其余全部中性'],
      ['03 大留白', '区块间距 ≥ 80px，标题与正文间 8–12px；宁可空，不可挤'],
      ['04 几乎无阴影', '纯色底 + 1px 细线分隔；圆角 2–4px 或直角'],
      ['05 气质', '杂志、出版社、编辑部——克制、慢、有分量']
    ]
  }
};

function updateRulesStrip(style) {
  const conf = RULES_BY_STYLE[style] || RULES_BY_STYLE.spectrum;
  const titleEl = document.getElementById('rules-strip-title');
  const itemsEl = document.getElementById('rules-strip-items');
  if (!titleEl || !itemsEl) return;
  titleEl.firstChild.nodeValue = conf.title + ' ';
  itemsEl.innerHTML = conf.rules.map(r =>
    '<div class="rules-strip-item"><b class="rs-k">' + r[0] + '</b>' + r[1] + '</div>'
  ).join('');
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

  // 规则条随风格切换（restoreState 直接改 currentDemoStyle 也经由此路径刷新）
  updateRulesStrip(currentDemoStyle);

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
    '<text x="548" y="87" class="ce-band" style="animation-delay:.05s;fill:var(--color-text-secondary);font-family:var(--ce-mono);font-size:10px">subtle</text>' +
    '<text x="548" y="125" class="ce-band" style="animation-delay:.14s;fill:var(--color-text-secondary);font-family:var(--ce-mono);font-size:10px">focus</text>' +
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
  // 内容世界化：每个世界一段自己的页面（同一套类 + 同一组 tokens，不同编排）
  if (currentDemoStyle === 'glass') return glassLandingHTML();
  if (currentDemoStyle === 'standard') return standardLandingHTML();
  if (currentDemoStyle === 'soft') return softLandingHTML();
  if (currentDemoStyle === 'editorial') return editorialLandingHTML();
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
      '<span class="ce-plate-no">PLATE 01</span>' +
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
        '<span class="ce-plate-no">PLATE 02</span>' +
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

// ── 流光 · AI 产品叙事（内容世界化样板） ─────────────
// 同一个结构骨架、同一组 tokens，内容换成 AI 智能排程平台——证明"一组 tokens，五种感受"。

function nexusGraphSVG() {
  return '<svg class="ce-spectrum" viewBox="0 0 460 120" role="img" aria-label="数据源经过智能体汇聚后输出的管线示意图">' +
    '<path d="M70 25 L215 55" stroke="var(--color-border)" stroke-width="1.2"/>' +
    '<path d="M70 60 L215 60" stroke="var(--color-border)" stroke-width="1.2"/>' +
    '<path d="M70 95 L215 65" stroke="var(--color-border)" stroke-width="1.2"/>' +
    '<path d="M245 60 L400 60" stroke="var(--color-accent-base)" stroke-width="1.5"/>' +
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
        '<p class="ce-hero-sub">NEXUS 把数据接入、模型调度与运行监控收进同一块玻璃面板。连接数据源，几分钟内得到自动化的智能体管线。</p>' +
        '<div class="ce-hero-actions">' +
          '<button class="ce-btn ce-btn-accent ce-btn-lg">创建智能体</button>' +
          '<a class="ce-text-link">查看运行示例</a>' +
        '</div>' +
        '<div class="ce-hero-meta"><span>LATENCY 42ms</span><span>·</span><span>128 个智能体在线</span><span>·</span><span>UTC+8</span></div>' +
      '</div>' +
      '<figure class="ce-prism">' + nexusGraphSVG() +
        '<figcaption class="ce-prism-caption">数据源 → 智能体 → 输出 · 实时管线</figcaption>' +
      '</figure>' +
    '</header>' +
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
        '<p class="ce-split-copy">每个数据源按需接入智能体管线，与模型状态、延迟、成本一同入档，下次调度直接调用。</p>' +
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
        '<section class="ce-panel ce-panel-spectrum">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">实时管线 · NLP-ROUTER</span><span class="ce-panel-count">BATCH 2048 · 吞吐 1.2k/s</span></div>' +
          '<div class="ce-panel-body">' + nexusGraphSVG() +
            '<div class="ce-spectrum-legend"><span><b>圆点</b> 数据源 / 智能体</span><span><b>连线</b> 数据流</span><span><b>红线</b> 主路径</span></div>' +
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

// ── 标准 · 增长分析平台（内容世界化） ───────────────

function pulseChartSVG() {
  return '<svg class="ce-spectrum" viewBox="0 0 460 120" role="img" aria-label="转化率周趋势折线图">' +
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

function standardLandingHTML() {
  return '<div class="ce-landing">' +
    '<nav class="ce-topbar">' +
      '<a class="ce-logo" href="#">' +
        '<svg class="ce-logo-mark" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 16 L9 9 L13 13 L20 5" stroke="var(--color-accent-base)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/><circle cx="20" cy="5" r="2" fill="var(--color-accent-base)"/></svg>' +
        '<span class="ce-logo-name">PULSE</span>' +
        '<span class="ce-logo-sub">增长分析平台</span>' +
      '</a>' +
      '<nav class="ce-nav">' +
        '<span class="ce-nav-link">看板</span>' +
        '<span class="ce-nav-link">报表</span>' +
        '<span class="ce-nav-link">数据源</span>' +
      '</nav>' +
      '<span class="ce-spacer"></span>' +
      '<button class="ce-btn ce-btn-ghost ce-btn-sm">登录</button>' +
      '<button class="ce-btn ce-btn-accent ce-btn-sm">创建看板</button>' +
    '</nav>' +
    '<header class="ce-hero">' +
      '<div>' +
        '<h1 class="ce-hero-title">把每一次转化<br>算清楚</h1>' +
        '<p class="ce-hero-sub">PULSE 把渠道、漏斗与留存收进同一张报表。接入数据源，几分钟内得到可分享的增长看板。</p>' +
        '<div class="ce-hero-actions">' +
          '<button class="ce-btn ce-btn-accent ce-btn-lg">创建看板</button>' +
          '<a class="ce-text-link">查看示例报表</a>' +
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
        '<p class="ce-split-copy">每个数据源按晚归档，与采集状态、更新频率一同入档，报表直接调用。</p>' +
        '<div class="ce-catalog">' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">CSV-UPLOAD</span><span class="ce-catalog-val">手工上传 · 按需同步</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">API-WEBHOOK</span><span class="ce-catalog-val">事件流 · 实时</span></div>' +
          '<div class="ce-catalog-item"><span class="ce-catalog-key">DB-SYNC</span><span class="ce-catalog-val">数据库直连 · 每 15 分钟</span></div>' +
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
        '<section class="ce-panel ce-panel-spectrum">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">转化趋势 · 近 8 周</span><span class="ce-panel-count">目标线 4.0%</span></div>' +
          '<div class="ce-panel-body">' + pulseChartSVG() +
            '<div class="ce-spectrum-legend"><span><b>折线</b> 转化率</span><span><b>虚线</b> 目标</span><span><b>圆点</b> 本周</span></div>' +
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

// ── 暖糖 · 睡眠与放松（内容世界化） ──────────────────

function breathRingSVG() {
  return '<svg class="ce-spectrum" viewBox="0 0 460 120" role="img" aria-label="四七-八呼吸练习圆环，进度四分之三">' +
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
        '<section class="ce-panel ce-panel-spectrum">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">呼吸练习 · 4-7-8</span><span class="ce-panel-count">第 2 轮 · 共 4 轮</span></div>' +
          '<div class="ce-panel-body">' + breathRingSVG() +
            '<div class="ce-spectrum-legend"><span><b>圆环</b> 本轮进度</span><span><b>圆点</b> 节拍</span><span><b>数字</b> 呼吸节奏</span></div>' +
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

// ── 书卷 · 城市生活月刊（内容世界化） ───────────────

function mastheadSVG() {
  return '<svg class="ce-spectrum" viewBox="0 0 460 120" role="img" aria-label="刊头：第七卷城市夜航专题">' +
    '<text x="40" y="86" fill="var(--color-text-emphasis)" font-family="var(--ce-display)" font-size="68" font-weight="700">07</text>' +
    '<line x1="150" y1="24" x2="150" y2="92" stroke="var(--color-border)" stroke-width="1"/>' +
    '<text x="172" y="56" fill="var(--color-text-emphasis)" font-family="var(--ce-display)" font-size="17">城市夜航</text>' +
    '<text x="172" y="78" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="10" letter-spacing="1">VOL.07 · 2026 年 8 月号</text>' +
    '<line x1="40" y1="100" x2="420" y2="100" stroke="var(--color-border)" stroke-width="1"/>' +
    '<text x="40" y="114" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9" letter-spacing="1">夜航者的城市 · 守夜人 · 天亮之前</text>' +
    '</svg>';
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
        '<section class="ce-panel ce-panel-spectrum">' +
          '<div class="ce-panel-head"><span class="ce-panel-title">版面样张 · 刊头</span><span class="ce-panel-count">VOL.07 · 72 页</span></div>' +
          '<div class="ce-panel-body">' + mastheadSVG() +
            '<div class="ce-spectrum-legend"><span><b>刊号</b> 卷期数字</span><span><b>标题</b> 专题名</span><span><b>发丝线</b> 刊头分隔</span></div>' +
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

// ── 工作台：光谱查看器 ───────────────────────────────

function spectrumPlotSVG() {
  const W = 460;
  const X = n => ((n - 380) / 300) * (W - 20) + 10;
  const ticks = [380, 430, 480, 530, 580, 630, 680];
  const tickG = ticks.map(n =>
    '<g><line x1="' + X(n).toFixed(1) + '" y1="10" x2="' + X(n).toFixed(1) + '" y2="92" stroke="var(--color-border)" stroke-width="1"/>' +
    '<text x="' + X(n).toFixed(1) + '" y="108" fill="var(--color-text-secondary)" font-family="var(--ce-mono)" font-size="9" text-anchor="middle">' + n + '</text></g>'
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
  // 内容世界化：每个世界一段自己的工作台（同一套类 + 同一组 tokens，不同编排）
  if (currentDemoStyle === 'glass') return glassAppHTML();
  if (currentDemoStyle === 'standard') return standardAppHTML();
  if (currentDemoStyle === 'soft') return softAppHTML();
  if (currentDemoStyle === 'editorial') return editorialAppHTML();
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
