/* ============================================================
   DESIGN PROFILES — 风格注册表（单一数据源）
   7 种风格：标准 / 暖糖 / 流光 / 书卷 / 褐页 / 构色 / 展厅
   本文件只放数据与纯函数，不碰 DOM。职责：
     · 风格身份（名称、一句话、适用与反例）与默认品牌色
     · 世界变量层（圆角 / 边框 / 字体 / 阴影 / 材料色）
     · 作用域样式（只作用于自己的 .ce-style-*，不污染其他风格）
     · 材料色与品牌色的分工（褐页 / 展厅等材料主导风格）
     · 规则条文本、给 AI 的提示词（必须保留 / 组合方法 / 反例）
     · 四种页面用途的适配规则
   依赖：无（color-engine-demo.js / color-engine-export.js 引用它）
   ============================================================ */

/* 阵容与回退：光谱已移除，旧状态中的 spectrum 一律映射到标准 */
const DEFAULT_STYLE = 'standard';
const STYLE_IDS = ['standard', 'soft', 'glass', 'editorial', 'sepia', 'poster', 'gallery'];
const LEGACY_STYLE_ALIASES = {
  spectrum: 'standard',      // 已移除的生成风格：统一回退到标准
  brutalism: 'poster',
  brutal: 'poster',
  galleryWhite: 'gallery',
  warm: 'soft'
};

/* 四种页面用途：同一风格在四类任务下的适配规则由各风格提供 */
const PAGE_PURPOSES = [
  { id: 'marketing', name: '营销页', spec: '顶栏 + 主视觉 + 价值区块 + 行动区 + 页脚' },
  { id: 'app', name: '工作台 / 操作页', spec: '侧栏 + 顶栏（标题/搜索/用户）+ 内容面板网格' },
  { id: 'reading', name: '阅读 / 长文页', spec: '标题区 + 正文限宽列 + 引文/注释 + 相关条目' },
  { id: 'showcase', name: '展示 / 作品页', spec: '作品网格（尺寸关系）+ 说明 + 轻量导航' }
];

const STYLE_FONT_ROLES = {
  serifCJK: '"Songti SC", "Noto Serif SC", "Source Han Serif SC", "STSong", "SimSun", Georgia, "Times New Roman", serif',
  systemSans: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
  geometric: '"Avenir Next", "Bahnschrift", "Segoe UI", -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif',
  rounded: '"SF Pro Rounded", "Segoe UI Variable", "Segoe UI", -apple-system, "PingFang SC", sans-serif',
  neoGrotesk: '"Helvetica Neue", "Segoe UI Variable", "Segoe UI", -apple-system, "PingFang SC", sans-serif',
  heavySans: '"Helvetica Neue", "Arial Black", "Segoe UI", -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif',
  mono: '"SF Mono", "Cascadia Code", Consolas, ui-monospace, Menlo, monospace'
};

const DESIGN_PROFILES = {

  /* ── 1. 标准：现代 SaaS 通用面貌（默认风格） ───────────── */
  standard: {
    id: 'standard',
    name: '标准',
    en: 'Standard',
    tagline: '现代 SaaS 通用面貌',
    desc: '干净、可信、不抢戏。任何产品拿起来都能用，也是最不容易出错的选择。',
    scene: 'SaaS 后台、B2B 官网、管理工具、内部系统、通用 Web 应用',
    avoid: '需要强品牌记忆点的营销页（标准不制造记忆点，但也不会出错）',
    defaultAccent: '#2563EB',
    fontNote: '系统无衬线（Apple / Windows 双栈），标题加粗 + 正文常规，数字 tabular；不引入特殊字体',
    materialNote: '材料色即语义表面 token（灰底 + 白卡），品牌色只出现在行动与选中态',
    materialOverrides: false,
    world: [
      '--ce-r-sm: 8px', '--ce-r-md: 12px', '--ce-line: 1px', '--ce-dot-r: 50%',
      '--ce-border-c: var(--color-border)',
      '--ce-card-bg: var(--color-bg-secondary)',
      '--ce-display: ' + STYLE_FONT_ROLES.systemSans,
      '--ce-shadow-btn: 0 1px 2px rgba(0,0,0,.05), 0 4px 12px color-mix(in srgb, var(--color-accent-base) 22%, transparent)',
      '--ce-shadow-inset: inset 0 1px 2px rgba(0,0,0,.08)'
    ],
    css: `
      .ce-style-standard .ce-panel, .ce-app.ce-style-standard {
        box-shadow: 0 1px 2px rgba(0,0,0,.04), 0 8px 24px -12px color-mix(in srgb, var(--color-text-emphasis) 14%, transparent);
        transition: box-shadow .15s, transform .15s;
      }
      .ce-style-standard .ce-panel:hover { transform: translateY(-1px); box-shadow: 0 1px 2px rgba(0,0,0,.05), 0 12px 28px -12px color-mix(in srgb, var(--color-text-emphasis) 18%, transparent); }
      .ce-style-standard .ce-btn-accent:hover { transform: translateY(-1px); box-shadow: 0 2px 4px rgba(0,0,0,.06), 0 6px 16px color-mix(in srgb, var(--color-accent-base) 28%, transparent); }
      .ce-style-standard .ce-btn-accent:active { transform: translateY(0); box-shadow: var(--ce-shadow-inset); }
      .ce-style-standard .ce-hero-title { letter-spacing: -.015em; }
      /* 签名时刻：主视觉进场淡入上浮——全页唯一的进场动效，其余区块零动效 */
      .ce-style-standard .ce-hero { animation: ceStdFadeUp .5s cubic-bezier(.22, .9, .3, 1) both; }
      @keyframes ceStdFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
      @media (prefers-reduced-motion: reduce) { .ce-style-standard .ce-hero { animation: none; } }
    `,
    rules: [
      ['01 强调是例外', '主按钮实色、链接、选中态、焦点环，一屏 ≤ 3 处'],
      ['02 白卡浮浅底', '适中圆角（8–12px）+ 柔和双层阴影；1px 细边框'],
      ['03 系统无衬线', '标题加粗 + 正文常规，数字 tabular；不引入特殊字体'],
      ['04 交互克制', 'hover 轻微上浮 + 阴影加深，active 内凹，过渡 150ms'],
      ['05 零装饰', '无网格、无印章、无光斑、无渐变文字；图标用统一描边 SVG']
    ],
    prompt: {
      body: [
        '- 表面：浅底 + 白卡浮起（适中圆角 8–12px + 柔和双层阴影），1px 细边框',
        '- 字体：系统无衬线（Apple 栈），标题加粗 + 正文常规，数字 tabular；不引入特殊字体',
        '- 强调色：标准用法——主按钮实色、链接、选中态、焦点环，一屏 ≤ 3 处',
        '- 交互：hover 轻微上浮 + 阴影加深，active 内凹，过渡 150ms',
        '- 装饰：无网格、无印章、无光斑、无渐变文字；图标用统一描边 SVG',
        '- 气质：大多数成熟 SaaS 的通用面貌——干净、可信、不抢戏'
      ],
      keep: [
        '白卡浮在浅底之上的分层关系（卡片必须有边框 + 柔和阴影，不允许纯色贴底）',
        '8–12px 圆角区间，既不尖锐也不圆润',
        '系统无衬线三声部：标题 600–700 / 正文 400 / 数字等宽 tabular'
      ],
      compose: [
        '营销页：顶栏 → Hero（左文右图，图用真实数据可视化而非装饰插画）→ 指标条 → 数据列表 → 双栏信息 → 页脚',
        '工作台：212px 侧栏 + 顶栏 + 面板网格（列表 / 主图表 / 指标），面板之间只靠间距与阴影分层',
        '阅读页：限宽 66ch 正文列 + 1.7 行高 + 小标题分段，不要卡片包裹每一段',
        '展示页：等宽卡片网格，图片用 16:10 裁切，说明文字两行以内'
      ],
      avoid: ['给每个区块都加装饰性渐变', '一个屏里出现三种以上圆角值', '用彩色小图标卡平铺充当内容']
    },
    purposes: {
      marketing: 'Hero 左文右图，主 CTA 实色；区块之间 ≥48px，白卡承担内容分组',
      app: '侧栏 212px + 顶栏 + 面板网格；行悬停浅底，激活项用左边线 + 加粗',
      reading: '正文列限宽 66ch、行高 1.7；标题与正文间距 8–12px，不用卡片包裹段落',
      showcase: '等宽卡片网格，缩略图 16:10，说明两行以内，hover 只加深阴影'
    }
  },

  /* ── 2. 暖糖：消费级圆润 ───────────────────────────── */
  soft: {
    id: 'soft',
    name: '暖糖',
    en: 'Soft',
    tagline: '消费级亲切感',
    desc: '大圆角、柔和多层阴影、圆点状态——安全、好接近，适合面向普通用户的产品。',
    scene: 'C 端产品、教育、健康、电商、社区',
    avoid: '数据密集的管理后台、严肃企业工具（大圆角会显得不专业）',
    defaultAccent: '#EF7B57',
    fontNote: '圆润无衬线（SF Pro Rounded / Segoe UI Variable 系统栈），字距可放宽，少用等宽字体',
    materialNote: '材料色是浮起表面（surface-raised）与柔影，品牌色可活泼但一屏仍 ≤ 3 处',
    materialOverrides: false,
    world: [
      '--ce-r-sm: 14px', '--ce-r-md: 20px', '--ce-line: 1px', '--ce-dot-r: 50%',
      '--ce-card-bg: var(--color-surface-raised)',
      '--ce-border-c: color-mix(in srgb, var(--color-border) 55%, transparent)',
      '--ce-display: ' + STYLE_FONT_ROLES.rounded,
      '--ce-shadow-btn: 0 1px 2px rgba(0,0,0,.06), 0 6px 18px color-mix(in srgb, var(--color-accent-base) 26%, transparent)',
      '--ce-shadow-inset: inset 0 2px 4px rgba(0,0,0,.08)'
    ],
    css: `
      .ce-style-soft .ce-panel, .ce-app.ce-style-soft {
        box-shadow: 0 12px 32px -14px color-mix(in srgb, var(--color-text-emphasis) 22%, transparent);
      }
      .ce-style-soft .ce-hero-title { letter-spacing: -.01em; }
      .ce-style-soft .ce-logo-name { letter-spacing: .06em; }
      /* 签名时刻：弹性按压——消费产品的回弹手感（overshoot 曲线） */
      .ce-style-soft .ce-btn { transition: transform .22s cubic-bezier(.34, 1.56, .64, 1), box-shadow .15s, background .15s; }
      .ce-style-soft .ce-btn-accent:hover { transform: scale(1.045); }
      .ce-style-soft .ce-btn-accent:active { transform: scale(.95) translateY(1px); }
      /* 列表卡片化：让大圆角与柔影有落点（无卡列表包成一张 raised 卡片） */
      .ce-style-soft .ce-window { background: var(--color-surface-raised); border: 1px solid var(--ce-border-c); border-radius: var(--ce-r-md); padding: 16px 18px; box-shadow: 0 12px 32px -14px color-mix(in srgb, var(--color-text-emphasis) 20%, transparent); }
      .ce-style-soft .ce-window::before { display: none; }
      .ce-style-soft .ce-window-row { padding-left: 0; }
      @media (prefers-reduced-motion: reduce) {
        .ce-style-soft .ce-btn { transition: background .15s; }
        .ce-style-soft .ce-btn-accent:hover, .ce-style-soft .ce-btn-accent:active { transform: none; }
      }
    `,
    rules: [
      ['01 大圆角 + 柔影', '14–20px 圆角，多层柔和阴影（模糊 10–30px、低透明度）'],
      ['02 圆润无衬线', '字距可放宽，少用等宽字体；状态点圆形'],
      ['03 强调可活泼', '按钮、徽章、图标底都能用，但一屏仍不超过 3 处'],
      ['04 弹性手感', 'hover 上浮 1px，按压下沉回弹（overshoot 曲线），过渡 150ms'],
      ['05 气质', '亲切、安全、值得信任——像健康 / 教育类 App']
    ],
    prompt: {
      body: [
        '- 表面：大圆角（14–20px）+ 柔和多层阴影（模糊 10–30px、低透明度）+ 浅色细边框；状态点圆形',
        '- 字体：圆润无衬线，字距可放宽，少用等宽字体',
        '- 强调色：可以更活泼——按钮、徽章、图标底都能用，但一屏仍不超过 3 处',
        '- 微交互：hover 上浮 1px，按压下沉，过渡 150ms',
        '- 气质：亲切、安全、值得信任，像健康 / 教育类 App'
      ],
      keep: ['14–20px 大圆角', '柔和多层阴影（模糊 ≥10px、低透明度）', '圆形状态点与圆点节拍'],
      compose: [
        '营销页：Hero 用一张主视觉 + 一句人话；下方时间线/计划列表必须包成 raised 卡片，让柔影有落点',
        '工作台：卡片化面板，行距放宽，减少表格线，用留白与圆角分组',
        '阅读页：正文限宽 60ch、行高 1.8，标题圆润不刺眼，不用高对比黑标题',
        '展示页：大圆角图片框 + 柔和阴影，图片周围留出 ≥16px 呼吸空间'
      ],
      avoid: ['细发丝线与小圆角（会毁掉圆润感）', '密集表格线', '高饱和荧光色大面积铺底']
    },
    purposes: {
      marketing: 'Hero 主视觉 + 人话标题；计划/时间线列表包成 raised 卡片，柔影有落点',
      app: '卡片化面板 + 放宽行距；少用表格线，状态用圆点',
      reading: '正文限宽 60ch、行高 1.8；标题不用纯黑，用最深文字色',
      showcase: '大圆角图片框 + 柔和阴影，图片四周留 ≥16px 呼吸空间'
    }
  },

  /* ── 3. 流光：玻璃科技（本轮重做） ─────────────────── */
  glass: {
    id: 'glass',
    name: '流光',
    en: 'Glass',
    tagline: '清透玻璃 · 单一光效 · 明确主角',
    desc: '先用干净底色与清晰层次建立页面，再让一处光效做主角；玻璃只用于导航、主视觉与浮层。',
    scene: 'AI 产品、SaaS 官网、金融科技、数据管线类产品',
    avoid: '长文阅读产品（玻璃与光效会干扰阅读）',
    defaultAccent: '#6D5BF6',
    fontNote: '现代几何无衬线（Helvetica Neue / Segoe UI 系统栈），标题字距略收紧',
    materialNote: '材料色是不透明稳定表面；玻璃是局部构件而非全页底色，光效只用一个色相',
    materialOverrides: false,
    world: [
      '--ce-r-sm: 10px', '--ce-r-md: 16px', '--ce-line: 1px', '--ce-dot-r: 50%',
      '--ce-border-c: var(--color-border)',
      '--ce-card-bg: var(--color-bg-secondary)',
      '--ce-glass-bg: color-mix(in srgb, var(--color-bg-secondary) 74%, transparent)',
      '--ce-glass-edge: rgba(255,255,255,.26)',
      '--ce-display: ' + STYLE_FONT_ROLES.neoGrotesk,
      '--ce-shadow-btn: 0 0 0 1px color-mix(in srgb, var(--color-accent-base) 22%, transparent), 0 6px 18px color-mix(in srgb, var(--color-accent-base) 32%, transparent)',
      '--ce-shadow-inset: inset 0 1px 2px rgba(0,0,0,.10)'
    ],
    css: `
      /* ① 干净底色：全页一个不透明基底，没有大范围多色径向光斑 */
      .ce-landing.ce-style-glass, .ce-app.ce-style-glass { background: var(--color-bg-primary); }

      /* ② 唯一主光效区域：hero 的视觉区，只用强调色一个色相（不与辅助色混合） */
      .ce-style-glass .ce-hero { position: relative; }
      .ce-style-glass .ce-hero::before {
        content: ""; position: absolute; z-index: 0;
        /* 横向不外溢：光池是绝对定位的，左右各出 8% 会在窄屏把文档撑出横向滚动条。
           而渐变在半径 68% 处就透明了（中心 42% + 0.68×58% = 81%），根本用不到这点出血。 */
        inset: -18% 0 -6% 0;
        background: radial-gradient(58% 74% at 42% 4%, color-mix(in srgb, var(--color-accent-subtle) 78%, transparent), transparent 68%);
        pointer-events: none;
      }
      .ce-style-glass .ce-hero > * { position: relative; z-index: 1; }

      /* ③ 玻璃只出现在三处：导航、主视觉卡、重点展示面板 */
      .ce-style-glass .ce-topbar {
        padding: 10px 14px;
        background: var(--ce-glass-bg);
        border: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
        border-radius: var(--ce-r-md);
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        box-shadow: inset 0 1px 0 var(--ce-glass-edge);
        /* 导航条是粘性的，内容会真的从它下面穿过——这才是「前后遮挡」。
           不做粘性时玻璃条底下永远只有平底色，backdrop-filter 等于没在用，
           玻璃就退化成一块带边框的白卡片。 */
        position: sticky; top: 8px; z-index: 20;
      }
      .ce-style-glass .ce-prism {
        margin: 0; padding: 20px 20px 14px;
        background: var(--ce-glass-bg);
        border: 1px solid color-mix(in srgb, var(--color-border) 78%, transparent);
        border-radius: var(--ce-r-md);
        backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
        box-shadow: inset 0 1px 0 var(--ce-glass-edge), 0 18px 48px -26px color-mix(in srgb, var(--color-text-emphasis) 38%, transparent);
      }
      .ce-app.ce-style-glass .ce-app-topbar {
        background: var(--ce-glass-bg);
        backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        box-shadow: inset 0 1px 0 var(--ce-glass-edge);
      }
      .ce-app.ce-style-glass .ce-panel-main {
        background: var(--ce-glass-bg);
        backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
        box-shadow: inset 0 1px 0 var(--ce-glass-edge);
      }
      /* 工作台侧面与其他面板保持稳定可读表面（表格 / 输入 / 长文本不透明） */
      .ce-app.ce-style-glass .ce-sidebar { background: var(--color-bg-secondary); }

      /* ④ 唯一动效：服务于主视觉的管线描线；取消按钮持续呼吸辉光 */
      .ce-style-glass .ce-flow-path { animation: ceFlow 2.6s linear infinite; }
      @keyframes ceFlow { from { stroke-dashoffset: 18; } to { stroke-dashoffset: 0; } }
      @media (prefers-reduced-motion: reduce) { .ce-style-glass .ce-flow-path { animation: none; } }

      /* ⑤ 无模糊支持时的回退：把玻璃还原成实表面。
         玻璃面本身是 26% 透明的，只有在 blur 把它背后的东西糊掉时才成立。
         浏览器支持 backdrop-filter 时这条路不走；不支持时（或用户把模糊关掉、省电模式、
         某些内嵌 WebView）如果继续用半透明色，底下的正文会直接透过导航条，
         标题和导航字叠在一起谁也读不了——A/B 截图 variants__glass-scrolled(-no-blur) 就是这个现象。
         所以这里不是「加个保险」，是补上 README 里早就声称、但实际并不存在的那个回退。 */
      @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
        .ce-style-glass .ce-topbar,
        .ce-style-glass .ce-prism,
        .ce-app.ce-style-glass .ce-app-topbar,
        .ce-app.ce-style-glass .ce-panel-main {
          background: var(--color-bg-secondary);
          /* blur 没了，靠描边与投影把「一块浮起来的板」说清楚 */
          border-color: var(--color-border);
          box-shadow: 0 12px 32px -20px color-mix(in srgb, var(--color-text-emphasis) 34%, transparent);
        }
      }
    `,
    rules: [
      ['01 先干净，再发光', '底色不透明、层级清楚，光效最后加；去掉渐变后内容层次仍然成立'],
      ['02 一个主光效区', '全页只允许一处光效主角，且只用一个色相；不做多色径向叠加'],
      ['03 玻璃是局部', '玻璃只用于导航、主视觉与重点展示；表格/输入/长文用稳定表面'],
      ['04 有作者的运动', '唯一动效服务于主视觉；按钮不做持续呼吸辉光'],
      ['05 玻璃要有厚度', 'inset 顶部高光 + 清晰轮廓 + 前后遮挡，而不是灰色半透明雾']
    ],
    prompt: {
      body: [
        '- 表面：不透明稳定底色 + 局部玻璃构件（backdrop-filter blur 12–16px）+ 1px 半透明描边 + 大圆角（10–16px）',
        '- 玻璃范围：只用于顶栏导航、主视觉卡、一个重点展示面板；表格 / 输入 / 长文本 / 侧栏一律不透明',
        '- 光效：全页只有一处主光效区域，且只用主强调色一个色相（可用强调色的浅色档），不做多色径向叠加',
        '- 玻璃细节：inset 0 1px 0 白色高光制造边缘厚度；主按钮带强调色偏移辉光（不是纯光环）',
        '- 动效：唯一动效服务于主视觉（管线走线/数据流动），取消按钮持续呼吸；全部动画配 prefers-reduced-motion 关闭',
        '- 回退：玻璃面必须配 @supports not (backdrop-filter) 分支还原成实表面——半透明只在有 blur 时成立，没有 blur 时文字会穿过导航条',
        '- 字体：现代几何无衬线，标题字距略收紧',
        '- 气质：AI 产品、未来感——清透、精致、光为内容服务'
      ],
      keep: [
        '一处主光效区域 + 单一色相关系（这是本风格的识别点，不能扩散成全页多色光斑）',
        '玻璃构件的三重特征：半透明表面 + 1px 半透明描边 + inset 顶部高光',
        '不透明与半透明的对比：必须有一部分界面是实的，玻璃才成立'
      ],
      compose: [
        '营销页：玻璃顶栏 → Hero（左侧文案 + 右侧玻璃主视觉卡，光效只在主视觉后方）→ 不透明指标条 → 不透明数据列表 → 双栏 → 页脚',
        '工作台：不透明侧栏 + 玻璃顶栏 + 网格面板；只有「主视觉/重点展示」面板是玻璃，其余（列表、指标、表单）保持实表面',
        '阅读页：本风格不适合长文；如必须使用，正文区用不透明表面与 1.7 行高，玻璃只留在顶栏',
        '展示页：作品框用不透明表面，玻璃只做悬浮工具条/浮层；禁止在作品上叠彩色光斑'
      ],
      avoid: ['多个大范围径向渐变叠加（页面会发灰变脏）', '每个面板/按钮/卡片都发光', '把所有表面都做成半透明灰']
    },
    purposes: {
      marketing: '玻璃顶栏 + Hero（左文 + 右玻璃主视觉）+ 一处主光效；下方指标与列表用不透明表面',
      app: '不透明侧栏 + 玻璃顶栏；仅重点展示面板玻璃，列表/指标/表单实表面',
      reading: '不推荐长文；必须使用时正文区不透明、行高 1.7，玻璃只留顶栏',
      showcase: '作品框不透明；玻璃只做悬浮工具条与浮层，不在作品上叠光斑'
    }
  },

  /* ── 4. 书卷：编辑内容 ─────────────────────────────── */
  editorial: {
    id: 'editorial',
    name: '书卷',
    en: 'Editorial',
    tagline: '当代编辑与杂志',
    desc: '衬线标题、大留白、几乎无阴影——内容有分量，界面主动退场。',
    scene: '内容平台、媒体、品牌官网、文档站、博客',
    avoid: '数据面板、需要一眼扫完的操作界面（衬线加大留白会拖慢扫描）',
    defaultAccent: '#9B3B2E',
    fontNote: '中文衬线标题（宋体 / STSong）+ 英文衬线（Georgia）；数据声部也用衬线，杂志里的数字是文字不是仪表',
    materialNote: '材料色是纸白底与细线分隔；强调色全场最多 1 处',
    materialOverrides: false,
    world: [
      '--ce-r-sm: 2px', '--ce-r-md: 4px', '--ce-line: 1px', '--ce-dot-r: 1px',
      '--ce-display: ' + STYLE_FONT_ROLES.serifCJK,
      '--ce-mono: ' + STYLE_FONT_ROLES.serifCJK,
      '--ce-shadow-btn: none',
      '--ce-shadow-inset: none'
    ],
    css: `
      .ce-landing.ce-style-editorial { gap: var(--space-7xl); }
      .ce-style-editorial .ce-hero-title { letter-spacing: 0; }
      .ce-style-editorial .ce-logo-name { font-family: var(--ce-display); letter-spacing: .04em; }
      .ce-style-editorial .ce-btn { letter-spacing: .04em; }
      .ce-style-editorial .ce-btn-accent { box-shadow: none; }
      .ce-style-editorial .ce-panel, .ce-app.ce-style-editorial { box-shadow: none; }
      /* 签名时刻：笔墨下划线——链接与导航下划线从左到右生长，hover 才出现 */
      .ce-style-editorial .ce-nav-link { border-bottom: 0; position: relative; }
      .ce-style-editorial .ce-text-link, .ce-style-editorial .ce-nav-link { position: relative; text-decoration: none; }
      .ce-style-editorial .ce-text-link::after, .ce-style-editorial .ce-nav-link::after { content: ""; position: absolute; left: 0; bottom: -3px; height: 1px; width: 100%; background: var(--color-accent-base); transform: scaleX(0); transform-origin: left; transition: transform .3s cubic-bezier(.22, .9, .3, 1); }
      .ce-style-editorial .ce-text-link:hover::after, .ce-style-editorial .ce-nav-link:hover::after { transform: scaleX(1); }
      @media (prefers-reduced-motion: reduce) {
        .ce-style-editorial .ce-text-link::after, .ce-style-editorial .ce-nav-link::after { transition: none; transform: none; }
      }
    `,
    rules: [
      ['01 衬线声音', '中文宋体 / 英文 Georgia；标题不收紧字距，正文行高 1.7'],
      ['02 强调全场最多 1 处', '链接或 CTA 二选一，其余全部中性'],
      ['03 大留白', '区块间距 ≥ 80px，标题与正文间 8–12px；宁可空，不可挤'],
      ['04 几乎无阴影', '纯色底 + 1px 细线分隔；圆角 2–4px 或直角'],
      ['05 气质', '杂志、出版社、编辑部——克制、慢、有分量']
    ],
    prompt: {
      body: [
        '- 表面：纯色底 + 1px 细线分隔，几乎不用阴影；圆角 2–4px 或直角',
        '- 字体：衬线显示字体（中文宋体 / 英文 Georgia 类），标题不收紧字距，正文行高 1.7',
        '- 强调色：全场最多 1 处（链接或 CTA 二选一）',
        '- 留白：区块间距 ≥ 80px，标题与正文间 8–12px；宁可空，不可挤',
        '- 气质：杂志、出版社、编辑部'
      ],
      keep: ['衬线标题 + 衬线数字（本风格不用等宽字体读数据）', '区块间距 ≥80px 的大留白', '零阴影 + 1px 细线分隔'],
      compose: [
        '营销页：刊头式 Hero（大字号刊号或专题名 + 发丝线 + 卷期信息）→ 本期要点（篇目 + 作者 + 页码）→ 引文块 → 专栏分栏',
        '工作台：稿件队列 / 版面样张 / 排期三栏；表格降级为行 + 细线，不用卡片凸起',
        '阅读页：这是本风格的主场——正文限宽 68ch、行高 1.75、段间距 1em，引文块左侧 accent 细线',
        '展示页：图文交替，图片通栏或半栏，说明文字用衬线小字，不用悬浮遮罩'
      ],
      avoid: ['阴影、圆角胶囊、彩色区块', '一屏多处强调色', '把数字塞进等宽字体（那是仪器语言）']
    },
    purposes: {
      marketing: '刊头式 Hero + 发丝线 + 卷期信息；本期要点列表 + 引文块；区块间距 ≥80px',
      app: '稿件队列/版面/排期三栏，行 + 细线代替卡片凸起，强调色只留一处',
      reading: '正文限宽 68ch、行高 1.75；引文块用左侧 1px 强调线，脚注/出处用衬线小字',
      showcase: '图文交替（通栏/半栏），说明用衬线小字，不用悬浮遮罩与阴影'
    }
  },

  /* ── 5. 褐页：暖褐纸面、旧书与档案（新增） ───────────── */
  sepia: {
    id: 'sepia',
    name: '褐页',
    en: 'Sepia',
    tagline: '暖褐纸面 · 旧书与档案',
    desc: '整页暖褐纸底、深褐墨字、书页版心与档案条目——材料本身就是风格，与书卷的当代编辑感明确分开。',
    scene: '档案与史料、旧书与出版、读书笔记、家谱与收藏目录、有历史感的文化品牌',
    avoid: '需要高饱和品牌色主导的营销页；低彩度暖褐底会压低鲜艳色的作用',
    defaultAccent: '#8A5A2B',
    fontNote: '中文衬线标题 + 适合阅读的正文（宋体 / 思源宋体栈）；编号、档号与页码用等宽，构成次级节奏',
    materialNote: '材料色是风格自有的暖褐纸面（不随品牌色变化）；品牌色只用于行动、标记与状态，绝不把整页染成品牌色',
    materialOverrides: true,
    world: [
      '--ce-r-sm: 2px', '--ce-r-md: 3px', '--ce-line: 1px', '--ce-dot-r: 50%',
      '--ce-card-bg: var(--ce-page)',
      '--ce-border-c: var(--ce-rule)',
      '--ce-display: ' + STYLE_FONT_ROLES.serifCJK,
      '--ce-body: ' + STYLE_FONT_ROLES.serifCJK,
      '--ce-mono: ' + STYLE_FONT_ROLES.mono,
      '--ce-shadow-btn: none',
      '--ce-shadow-inset: none',
      '/* 材料色：风格自有，明暗两套 */',
      '--ce-paper: #F2E3CB',
      '--ce-page: #FBF5E9',
      '--ce-rule: #D7C2A0',
      '--ce-ink: #382B1E',
      '--ce-ink-2: #6A5540',
      '--ce-ghost: #8C7355'
    ],
    css: `
      /* 暗色材料：深褐表面 + 暖浅字，不是普通黑白主题 */
      [data-theme="dark"] .ce-style-sepia {
        --ce-paper: #1C1510; --ce-page: #251C15; --ce-rule: #4A3928;
        --ce-ink: #F1E4CE; --ce-ink-2: #C3AC8C; --ce-ghost: #9C8567;
      }

      /* ① 材料承担整页底色：褐在底上，不是只有按钮是棕色 */
      .ce-landing.ce-style-sepia, .ce-app.ce-style-sepia { background: var(--ce-paper); color: var(--ce-ink); }
      .ce-style-sepia .ce-hero-title, .ce-style-sepia .ce-plate-title, .ce-style-sepia .ce-split-title,
      .ce-style-sepia .ce-app-title, .ce-style-sepia .ce-panel-title, .ce-style-sepia .ce-feat-title,
      .ce-style-sepia .ce-metric-num, .ce-style-sepia .ce-logo-name, .ce-style-sepia .ce-target-desig,
      .ce-style-sepia .ce-block-title { color: var(--ce-ink); }
      .ce-style-sepia .ce-hero-sub, .ce-style-sepia .ce-split-copy, .ce-style-sepia .ce-catalog-val,
      .ce-style-sepia .ce-row-time, .ce-style-sepia .ce-window-row, .ce-style-sepia .ce-plate-epoch,
      .ce-style-sepia .ce-footer, .ce-style-sepia .ce-hero-meta, .ce-style-sepia .ce-nav-link,
      .ce-style-sepia .ce-panel-count, .ce-style-sepia .ce-panel-row, .ce-style-sepia .ce-user,
      .ce-style-sepia .ce-fig-cap, .ce-style-sepia .ce-work-meta, .ce-style-sepia .ce-work-note { color: var(--ce-ink-2); }
      .ce-style-sepia .ce-panel, .ce-style-sepia .ce-metric, .ce-style-sepia .ce-feat-card,
      .ce-style-sepia .ce-sheet, .ce-style-sepia .ce-search input {
        background: var(--ce-page); border-color: var(--ce-rule); box-shadow: none;
      }
      .ce-style-sepia .ce-row:hover, .ce-style-sepia .ce-side-item:hover, .ce-style-sepia .ce-side-item.is-active {
        background: color-mix(in srgb, var(--ce-rule) 34%, transparent);
      }
      .ce-style-sepia .ce-sidebar { background: color-mix(in srgb, var(--ce-rule) 24%, var(--ce-page)); }

      /* ② 书页版心：双线页边 + 章节号 + 页码 */
      .ce-style-sepia .ce-hero { grid-template-columns: 1fr; }
      .ce-style-sepia .ce-sheet { position: relative; padding: var(--space-2xl) var(--space-3xl); border: var(--ce-line) solid var(--ce-rule); }
      .ce-style-sepia .ce-sheet::before { content: ""; position: absolute; inset: 9px; border: 1px solid color-mix(in srgb, var(--ce-rule) 62%, transparent); pointer-events: none; }
      .ce-style-sepia .ce-chapter-no { font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .2em; color: var(--ce-ink-2); text-transform: uppercase; }
      .ce-style-sepia .ce-page-no { font-family: var(--ce-mono); font-size: .64rem; letter-spacing: .14em; color: var(--ce-ghost); }
      .ce-style-sepia .ce-sheet-foot { display: flex; align-items: center; justify-content: space-between; gap: var(--space-md); margin-top: var(--space-lg); padding-top: 10px; border-top: 1px solid var(--ce-rule); font-family: var(--ce-mono); font-size: .64rem; letter-spacing: .12em; color: var(--ce-ghost); }
      .ce-style-sepia .ce-plate { border-top: 3px double var(--ce-rule); }
      .ce-style-sepia .ce-hero-title { letter-spacing: 0; line-height: 1.24; }
      .ce-style-sepia .ce-hero-sub { line-height: 1.9; }

      /* ③ 档案条目：档号 + 点线引导 + 值 */
      .ce-style-sepia .ce-archive-row { display: flex; align-items: baseline; gap: var(--space-sm); padding: 7px 0; font-size: .82rem; }
      .ce-style-sepia .ce-archive-no { font-family: var(--ce-mono); font-size: .68rem; letter-spacing: .1em; color: var(--ce-ghost); flex-shrink: 0; width: 76px; }
      .ce-style-sepia .ce-archive-lead { flex: 1; border-bottom: 1px dotted color-mix(in srgb, var(--ce-rule) 92%, transparent); transform: translateY(-3px); }
      .ce-style-sepia .ce-archive-val { color: var(--ce-ink); }
      .ce-style-sepia .ce-archive-note { font-size: .72rem; color: var(--ce-ghost); }

      /* ④ 强调色只做行动与标记，纸面不被染掉 */
      .ce-style-sepia .ce-btn { letter-spacing: .06em; }
      .ce-style-sepia .ce-btn-accent { box-shadow: none; }
    `,
    rules: [
      ['01 材料先行', '整页暖褐纸面 + 深褐墨字；褐色在底色和边界上，不是只有按钮是棕色'],
      ['02 书页构成', '双线版心 + 章节号 + 页码 + 档案条目点线引导，避免白卡换底色'],
      ['03 衬线双声部', '衬线标题与正文；编号/档号/页码用等宽，形成次级节奏'],
      ['04 品牌色有限', '自定义色只用于行为与标记（按钮 / 链接 / 选中态），纸面保持褐'],
      ['05 气质', '旧书、档案、读者的书桌——安静、有年份感、可长读']
    ],
    prompt: {
      body: [
        '- 表面：整页暖褐纸面（浅色约 #F2E3CB 底 / #FBF5E9 书页，深色约 #1C1510 底 / #251C15 书页），深褐墨字（浅色 #382B1E，深色 #F1E4CE）；不用阴影，用 1px 暖褐细线与双层版心边框分层',
        '- 构成：书页版心（外层实线 + 内层细线的双线框）、章节号（CHAPTER 01 类等宽小字）、页码、档案条目（档号 + 点线引导 + 值）',
        '- 字体：中文衬线标题与正文（宋体 / 思源宋体类），正文行高 1.85–1.9；编号、档号、页码用等宽字体',
        '- 强调色：只用于主按钮、链接、选中态与状态标记；不要用品牌色给整页或大区块染底',
        '- 圆角：2–3px 或直角；不使用大圆角与胶囊',
        '- 气质：旧书、档案馆、私人藏书——安静、有年份感、适合长读'
      ],
      keep: [
        '整页暖褐纸面（材料色固定，不随品牌色改变）——这是本风格的识别点',
        '书页构成：双线版心 / 章节号 / 页码 / 档案条目点线，而不是普通卡片换底色',
        '衬线标题与正文 + 等宽编号的双声部',
        '品牌色只出现在行为与标记上，纸面不被染掉'
      ],
      compose: [
        '营销页：书页版心包住 Hero（章节号 + 衬线大标题 + 引言 + 主按钮）→ 目录式要点（编号 + 点线引导 + 页码）→ 引文块 → 档案条目分栏 → 页脚含页码',
        '工作台：资料/收藏目录——左侧分组导航，主区是档案条目列表（档号 + 名称 + 年代 + 状态），筛选与搜索用细线框输入，选中态用浅褐底而非彩色填充',
        '阅读页：正文限宽 64ch、行高 1.9、段间 1em；章节号与页码固定在版心上下，注释用更小的褐灰字',
        '展示页：图版页（图 + 图注 + 档号），图片加 1px 褐线描边，不用阴影或彩色遮罩'
      ],
      avoid: ['给暖褐背景套用「低彩度=脏色」的判定', '圆角胶囊与大阴影', '用品牌色大面积铺底或做渐变背景']
    },
    purposes: {
      marketing: '书页版心 Hero（章节号 + 衬线标题 + 引言）→ 目录要点（编号 + 点线）→ 引文 → 档案条目分栏 → 页码',
      app: '资料/收藏目录：分组导航 + 档案条目列表（档号 + 名称 + 年代 + 状态），浅褐选中态，细线框输入',
      reading: '正文限宽 64ch、行高 1.9、段间 1em；版心上下放章节号与页码，注释用褐灰小字',
      showcase: '图版页：图 + 图注 + 档号，图片 1px 褐线描边，无阴影无彩色遮罩'
    }
  },

  /* ── 6. 构色：鲜明色块、海报式排版（新增） ────────────── */
  poster: {
    id: 'poster',
    name: '构色',
    en: 'Poster',
    tagline: '鲜明色块 · 海报式排版',
    desc: '大字、实色色块、方角硬投影与有节奏的不对称构图——把平面构成当作主角。',
    scene: '文化活动、创意产品、展览与演出、创作者与工作室官网、品牌活动页',
    avoid: '信息密度极高的后台（色块与硬投影会干扰扫描）；需要安静克制的产品',
    defaultAccent: '#E23A2E',
    fontNote: '系统几何无衬线拉到大字重（800–900）；标题紧字距、行高压到 1.0；正文回到常规字重',
    materialNote: '材料色是少量纯色区块（强调色 + 墨色 + 辅助色三选）；不用多色渐变制造热闹',
    materialOverrides: false,
    world: [
      '--ce-r-sm: 0px', '--ce-r-md: 0px', '--ce-line: 2px', '--ce-dot-r: 0',
      '--ce-border-c: var(--color-text-emphasis)',
      '--ce-card-bg: var(--color-bg-secondary)',
      '--ce-display: ' + STYLE_FONT_ROLES.heavySans,
      '--ce-hard-x: 6px', '--ce-hard-y: 6px', '--ce-hard-c: var(--color-text-emphasis)',
      '--ce-shadow-btn: 4px 4px 0 var(--color-text-emphasis)',
      '--ce-shadow-inset: none'
    ],
    css: `
      /* ① 大字：标题是主视觉的一部分 */
      .ce-style-poster .ce-hero-title { font-size: clamp(2.2rem, 6.2vw, 4.1rem); line-height: .98; font-weight: 900; letter-spacing: -.02em; max-width: 15ch; }
      .ce-style-poster .ce-hero { align-items: start; }
      .ce-style-poster .ce-hero-sub { font-size: .95rem; line-height: 1.7; }
      .ce-style-poster .ce-plate-title, .ce-style-poster .ce-split-title { font-weight: 900; letter-spacing: -.01em; }
      .ce-style-poster .ce-logo-name { font-weight: 900; letter-spacing: .02em; }

      /* ② 色块语言：少量纯色、有目的的分区 */
      .ce-style-poster .ce-block { padding: var(--space-2xl) var(--space-xl); border: var(--ce-line) solid var(--color-text-emphasis); }
      .ce-style-poster .ce-block--accent { background: var(--color-accent-base); color: var(--color-accent-on-accent); border-color: var(--color-accent-base); }
      .ce-style-poster .ce-block--ink { background: var(--color-text-emphasis); color: var(--color-bg-primary); border-color: var(--color-text-emphasis); }
      .ce-style-poster .ce-block--soft { background: var(--color-surface-secondary); color: var(--color-text-emphasis); }
      .ce-style-poster .ce-block-title { font-family: var(--ce-display); font-weight: 900; font-size: 1.5rem; line-height: 1.06; letter-spacing: -.01em; }
      .ce-style-poster .ce-block-copy { margin-top: 8px; font-size: .88rem; line-height: 1.65; }
      .ce-style-poster .ce-block-grid { display: grid; grid-template-columns: 1.55fr 1fr; gap: var(--space-lg); align-items: start; }
      @media (max-width: 680px) { .ce-style-poster .ce-block-grid { grid-template-columns: 1fr; } }

      /* ③ 方角 + 硬投影：少量构件承担，不做满页 */
      .ce-style-poster .ce-metric, .ce-style-poster .ce-feat-card, .ce-style-poster .ce-quote {
        border: var(--ce-line) solid var(--color-text-emphasis);
        box-shadow: var(--ce-hard-x) var(--ce-hard-y) 0 var(--ce-hard-c);
        background: var(--ce-card-bg);
      }
      .ce-style-poster .ce-btn { border: var(--ce-line) solid var(--color-text-emphasis); border-radius: 0; }
      .ce-style-poster .ce-btn-ghost { border-color: transparent; }
      .ce-style-poster .ce-btn-accent { border-color: var(--color-text-emphasis); }
      .ce-style-poster .ce-btn-accent:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--color-text-emphasis); }
      .ce-style-poster .ce-btn-accent:active { transform: translate(2px, 2px); box-shadow: none; }
      .ce-style-poster .ce-nav-link { border-bottom: 0; font-weight: 700; padding: 4px 8px; }
      .ce-style-poster .ce-nav-link:hover { background: var(--color-text-emphasis); color: var(--color-bg-primary); }
      .ce-style-poster .ce-text-link { text-decoration-thickness: 2px; }

      /* ④ 工作台收紧：保留形状语言，缩小标题与装饰规模 */
      .ce-app.ce-style-poster .ce-side-item.is-active { background: var(--color-accent-base); color: var(--color-accent-on-accent); border-left-color: transparent; font-weight: 700; }
      .ce-app.ce-style-poster .ce-app-title { font-size: .95rem; }
      .ce-app.ce-style-poster .ce-panel { border: var(--ce-line) solid var(--color-text-emphasis); box-shadow: 3px 3px 0 var(--ce-hard-c); }
      .ce-app.ce-style-poster .ce-panel-title { font-size: .78rem; font-weight: 800; letter-spacing: 0; }
      .ce-app.ce-style-poster .ce-search input { border: var(--ce-line) solid var(--color-text-emphasis); border-radius: 0; }
      .ce-app.ce-style-poster .ce-target { padding: 9px 4px; }
      .ce-app.ce-style-poster .ce-btn { box-shadow: none; }
      .ce-app.ce-style-poster .ce-btn-accent:hover { transform: none; box-shadow: 3px 3px 0 var(--ce-hard-c); }
      .ce-style-poster .ce-row-status::before { border-radius: 0; }
    `,
    rules: [
      ['01 大字与色块', '标题拉到大字重 800–900；色块是主视觉，不用渐变或倾斜制造热闹'],
      ['02 少量纯色', '只允许强调色 / 墨色 / 辅助色三种实色分区，一屏色块 ≤ 3 块'],
      ['03 方角硬投影', '0 圆角 + 2px 描边 + 偏移硬投影（如 6px 6px 0 墨色）'],
      ['04 不对称构图', '网格用 1.55fr : 1fr 之类的比例，区块尺寸有意不等'],
      ['05 工作台收敛', '保留形状语言，缩小标题与装饰规模，表格/表单/导航保持易扫']
    ],
    prompt: {
      body: [
        '- 表面：0 圆角 + 2px 描边 + 偏移硬投影（6px 6px 0 墨色）；实色色块承担分区，不用阴影模糊',
        '- 排版：标题字重 800–900、行高 0.98–1.05、字距略收紧；正文回到 400 常规字重与 1.65 行高',
        '- 色块：一屏 ≤ 3 块实色（主强调色 / 墨色 / 辅助色），每块有明确信息职责，不做装饰拼贴',
        '- 构图：不对称网格（例如 1.55fr : 1fr），区块高度有意不等，形成节奏',
        '- 交互：hover 位移 ‑2px 并把硬投影加到 6px，active 位移 +2px 且投影归零',
        '- 气质：文化活动海报、创意工作室——直接、响亮、有作者意图'
      ],
      keep: ['0 圆角 + 2px 描边 + 偏移硬投影', '大字重标题（800–900）与压到 1.0 附近的行高', '少量纯色块分区，而不是满页彩色'],
      compose: [
        '营销页：Hero（大字标题 + 一行说明 + 方角主按钮）→ 色块网格（1.55fr:1fr，主色块讲主题、墨色块放行动）→ 指标条（硬投影）→ 双栏 → 页脚',
        '工作台：形状语言保留但规模收紧——面板 2px 描边 + 3px 硬投影、标题降到 0.78rem、导航激活项用实色块填充，表格与表单保持易扫',
        '阅读页：不推荐；必须使用时正文回到常规字重与 1.7 行高，色块只用于首屏与章节封面',
        '展示页：作品用方角实色底框 + 硬投影，每行不超过两件，说明文字压在一行'
      ],
      avoid: ['多色渐变与随意倾斜', '到处粗描边与硬投影（会变吵）', '用装饰性几何拼贴代替内容']
    },
    purposes: {
      marketing: '大字 Hero + 1.55fr:1fr 色块网格（主色块讲主题、墨块放行动）+ 硬投影指标条',
      app: '保留方角/描边/硬投影但规模收紧：面板 3px 硬投影、标题 0.78rem、激活项实色填充，表格易扫',
      reading: '不推荐；必须用时正文常规字重 + 行高 1.7，色块只留在首屏与章节封面',
      showcase: '作品方角实色底框 + 硬投影，每行 ≤2 件，说明压一行'
    }
  },

  /* ── 7. 展厅：作品主导、界面退后（新增） ──────────────── */
  gallery: {
    id: 'gallery',
    name: '展厅',
    en: 'Gallery',
    tagline: '作品主导 · 界面退后',
    desc: '首屏就是作品，尺寸关系与留白构成识别度；导航与说明保持安静，不跟作品抢色。',
    scene: '作品集与摄影、设计工作室、美术馆与展览、项目管理中的素材与版本',
    avoid: '没有视觉素材的产品（本风格的成立前提是有作品可展示）；数据密集型后台',
    defaultAccent: '#2F6F6B',
    fontNote: '安静的系统无衬线，标题不追求体量；作品说明用更小的字与等宽元信息',
    materialNote: '材料色是中性的展示表面（浅灰框、无阴影）；作品自带颜色时，外围界面不再叠加大面积竞争性配色',
    materialOverrides: false,
    world: [
      '--ce-r-sm: 2px', '--ce-r-md: 4px', '--ce-line: 1px', '--ce-dot-r: 50%',
      '--ce-border-c: color-mix(in srgb, var(--color-border) 70%, transparent)',
      '--ce-card-bg: var(--color-bg-secondary)',
      '--ce-frame: var(--color-bg-tertiary)',
      '--ce-display: ' + STYLE_FONT_ROLES.systemSans,
      '--ce-shadow-btn: 0 1px 2px rgba(0,0,0,.05)',
      '--ce-shadow-inset: inset 0 1px 2px rgba(0,0,0,.08)'
    ],
    css: `
      /* ① 首屏直接是作品：身份行压成一条，主图占满内容宽度 */
      .ce-style-gallery .ce-hero { grid-template-columns: 1fr; gap: var(--space-lg); }
      .ce-style-gallery .ce-hero-title { font-size: clamp(1.55rem, 3.2vw, 2.3rem); font-weight: 600; letter-spacing: -.01em; max-width: 26ch; }
      .ce-style-gallery .ce-hero-sub { max-width: 58ch; font-size: .94rem; }
      .ce-style-gallery .ce-hero-actions { margin-top: var(--space-md); }
      .ce-style-gallery .ce-hero-meta { margin-top: var(--space-sm); }
      .ce-style-gallery .ce-lead-row { display: flex; align-items: flex-end; justify-content: space-between; gap: var(--space-lg); flex-wrap: wrap; }
      .ce-style-gallery .ce-lead-row .ce-hero-title { flex: 1 1 24ch; min-width: 0; max-width: none; }
      .ce-style-gallery .ce-lead-row .ce-hero-actions { margin-top: 0; flex-shrink: 0; }
      .ce-style-gallery .ce-lead-work .ce-work-frame { aspect-ratio: 16 / 7; }
      @media (max-width: 680px) { .ce-style-gallery .ce-lead-work .ce-work-frame { aspect-ratio: 4 / 3; } }

      /* ② 作品网格：尺寸关系承载识别度，而不是卡片装饰
         列跨度只在 .ce-works 内生效——首屏主图同样挂在 .ce-work 上，不能被网格规则带走 */
      .ce-style-gallery .ce-works { display: grid; grid-template-columns: repeat(12, 1fr); gap: var(--space-xl) var(--space-md); }
      .ce-style-gallery .ce-works .ce-work { grid-column: span 6; }
      .ce-style-gallery .ce-works .ce-work.is-wide { grid-column: span 12; }
      .ce-style-gallery .ce-works .ce-work.is-third { grid-column: span 4; }
      @media (max-width: 680px) {
        .ce-style-gallery .ce-works .ce-work, .ce-style-gallery .ce-works .ce-work.is-third { grid-column: span 12; }
      }
      .ce-style-gallery .ce-work-frame { position: relative; overflow: hidden; background: var(--ce-frame); aspect-ratio: 4 / 3; }
      .ce-style-gallery .ce-work.is-wide .ce-work-frame { aspect-ratio: 16 / 7; }
      .ce-style-gallery .ce-work.is-tall .ce-work-frame { aspect-ratio: 3 / 4; }
      .ce-style-gallery .ce-work.is-square .ce-work-frame { aspect-ratio: 1 / 1; }
      .ce-style-gallery .ce-work-frame img { display: block; width: 100%; height: 100%; object-fit: cover; transition: transform .45s cubic-bezier(.22, .9, .3, 1); }
      .ce-style-gallery .ce-work:hover .ce-work-frame img { transform: scale(1.02); }
      .ce-style-gallery .ce-work-cap { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-sm); margin-top: 10px; }
      .ce-style-gallery .ce-work-name { font-size: .86rem; font-weight: 600; color: var(--color-text-primary); }
      .ce-style-gallery .ce-work-meta { font-family: var(--ce-mono); font-size: .66rem; letter-spacing: .04em; color: var(--color-text-secondary); }
      .ce-style-gallery .ce-work-note { font-size: .76rem; color: var(--color-text-secondary); margin-top: 2px; }
      .ce-style-gallery .ce-work.is-missing .ce-work-frame { display: flex; align-items: center; justify-content: center; border: 1px dashed var(--ce-border-c); }
      .ce-style-gallery .ce-work.is-missing .ce-work-frame::after { content: "缺图 · 待补素材"; font-family: var(--ce-mono); font-size: .66rem; color: var(--color-text-muted); }
      @media (prefers-reduced-motion: reduce) { .ce-style-gallery .ce-work-frame img { transition: none; } }

      /* ③ 界面退后：无卡片阴影，中性表面 */
      .ce-style-gallery .ce-panel, .ce-app.ce-style-gallery { box-shadow: none; }
      .ce-app.ce-style-gallery .ce-side-item.is-active { background: var(--color-text-emphasis); color: var(--color-bg-primary); border-left-color: transparent; }
      .ce-style-gallery .ce-panel-main { background: var(--ce-card-bg); }

      /* ④ 工作台：缩略图 + 行，媒体是内容不牺牲操作效率 */
      .ce-style-gallery .ce-work-row { display: flex; align-items: center; gap: 12px; padding: 10px 2px; border-top: var(--ce-line) solid var(--ce-border-c); }
      .ce-style-gallery .ce-work-row:first-child { border-top: 0; }
      .ce-style-gallery .ce-work-thumb { width: 56px; height: 40px; flex-shrink: 0; overflow: hidden; background: var(--ce-frame); }
      .ce-style-gallery .ce-work-thumb img { display: block; width: 100%; height: 100%; object-fit: cover; }
      .ce-style-gallery .ce-work-thumb:empty::after { content: "缺图"; display: flex; align-items: center; justify-content: center; height: 100%; font-family: var(--ce-mono); font-size: .6rem; color: var(--color-text-muted); }
      .ce-style-gallery .ce-work-row-name { font-size: .82rem; color: var(--color-text-primary); }
      .ce-style-gallery .ce-work-row-meta { font-family: var(--ce-mono); font-size: .64rem; color: var(--color-text-secondary); }
      .ce-style-gallery .ce-work-row-state { margin-left: auto; font-size: .68rem; font-weight: 600; color: var(--color-text-secondary); }
      .ce-style-gallery .ce-filter-row { display: flex; gap: var(--space-md); margin-bottom: 6px; font-size: .76rem; color: var(--color-text-secondary); }
      .ce-style-gallery .ce-filter-row .is-on { color: var(--color-text-primary); font-weight: 600; box-shadow: inset 0 -2px 0 var(--color-accent-base); }
    `,
    rules: [
      ['01 作品即主角', '首屏直接出现足够大的作品，不先铺营销标语与指标卡'],
      ['02 尺寸构成识别', '作品宽 / 高 / 标准三种比例混合排布，用尺寸关系而不是卡片装饰'],
      ['03 界面退后', '中性展示表面、无卡片阴影；作品自带颜色时外围不再叠竞争性配色'],
      ['04 说明要安静', '作品名 + 年份 + 材质用更小的字；元信息用等宽小字'],
      ['05 素材要真实', '使用可本地引用的素材；缺图有占位，长标题不撑破容器']
    ],
    prompt: {
      body: [
        '- 表面：中性展示表面（浅灰框 + 无阴影），圆角 2–4px；分区分隔只用 1px 细线',
        '- 首屏：直接是作品——一个大尺寸主作品 + 2–3 个次级作品，标题与说明安静地待在上下方',
        '- 作品排布：用 12 栏网格混合三种比例（宽幅 16:7 / 标准 4:3 / 竖幅 3:4），尺寸关系构成节奏',
        '- 说明：作品名（0.86rem / 600）+ 年份与材质（等宽 0.66rem / 次要色）+ 一行补充说明',
        '- 交互：hover 时图片轻微放大（≤1.02）与说明显现，不用阴影与位移',
        '- 占位：缺图用虚线框 + 「缺图」标注；长标题单行省略，不撑破容器',
        '- 气质：美术馆、作品集、档案展览——界面退后，作品说话'
      ],
      keep: ['首屏就是作品（不允许先用标语与指标卡占满）', '中性展示表面 + 无卡片阴影', '作品尺寸比例混合排布的节奏'],
      compose: [
        '营销页：安静标题 + 说明 → 作品网格（1 个宽幅 + 2 个标准 + 3 个三分之一）→ 过程说明 → 页脚；营销话术压到最少',
        '工作台：作品管理——筛选行 + 缩略图列表（缩略图 56×40 + 名称 + 尺寸 + 状态 + 操作），或网格/列表切换；媒体是内容，不牺牲操作效率',
        '阅读页：说明与方法论文本限宽 64ch，图片通栏插入，图注在图片下方小字',
        '展示页：本风格主场——主作品 + 作品集网格 + 单个作品详情（多图纵排 + 图注 + 年份）'
      ],
      avoid: ['没有素材时用图标卡与营销指标卡凑首屏', '给作品框加阴影或彩色遮罩', '把作品当装饰缩小成图标']
    },
    purposes: {
      marketing: '安静标题 + 作品网格（1 宽幅 + 2 标准 + 3 三分之一）→ 过程说明；话术压到最少',
      app: '作品管理：筛选行 + 缩略图列表（56×40 缩略图 + 名称 + 尺寸 + 状态 + 操作），媒体是内容',
      reading: '说明文本限宽 64ch，图片通栏，图注用图片下方小字',
      showcase: '主作品 + 作品集网格 + 单作品详情（多图纵排 + 图注 + 年份）'
    }
  }
};

/* ── 纯函数区 ─────────────────────────────────────── */

// 旧 id / 未知值 / 大小写不一致统一归一到有效风格
function normalizeStyleId(id) {
  if (!id) return DEFAULT_STYLE;
  const key = String(id).trim().toLowerCase();
  if (STYLE_IDS.indexOf(key) !== -1) return key;
  if (LEGACY_STYLE_ALIASES[key] && STYLE_IDS.indexOf(LEGACY_STYLE_ALIASES[key]) !== -1) {
    return LEGACY_STYLE_ALIASES[key];
  }
  return DEFAULT_STYLE;
}

function isKnownStyleId(id) {
  return !!id && STYLE_IDS.indexOf(String(id).trim().toLowerCase()) !== -1;
}

function getProfile(id) {
  return DESIGN_PROFILES[normalizeStyleId(id)];
}

// 世界变量 → `.ce-style-x { ... }`（示例根元素上的类，与主题属性无关）
// 纯注释条目不加分号（保留分组注释的可读性）
function profileWorldCSS(id) {
  const p = getProfile(id);
  const body = p.world.map(function (decl) {
    const t = String(decl).trim();
    if (t.indexOf('/*') === 0) return t;
    return t.replace(/;\s*$/, '') + ';';
  }).join('\n  ');
  return '.ce-style-' + p.id + ' {\n  ' + body + '\n}';
}

// 作用域样式：只作用于自己的 .ce-style-*，不写全局选择器
function profileScopedCSS(id) {
  return getProfile(id).css.trim();
}

function buildProfilesCSS(ids) {
  const list = ids && ids.length ? ids : STYLE_IDS;
  return list.map(function (id) {
    return '/* ══ ' + getProfile(id).name + '（' + getProfile(id).en + '）══ */\n' +
      profileWorldCSS(id) + '\n' + profileScopedCSS(id);
  }).join('\n\n');
}

function profileRules(id) {
  return getProfile(id).rules;
}

// 给 AI 的提示词正文（不含 tokens）：风格规则 + 必须保留 + 组合方法 + 反例
function profilePromptBody(id) {
  const p = getProfile(id);
  const lines = [];
  lines.push(p.prompt.body.join('\n'));
  lines.push('');
  lines.push('### 必须保留的特征（改业务可以，改这些等于换风格）');
  p.prompt.keep.forEach(function (x) { lines.push('- ' + x); });
  lines.push('');
  lines.push('### 具体组合方法（按此推导，而不是套用示例内容）');
  p.prompt.compose.forEach(function (x) { lines.push('- ' + x); });
  lines.push('');
  lines.push('### 反例（出现任一即视为未执行本风格）');
  p.prompt.avoid.forEach(function (x) { lines.push('- ' + x); });
  return lines.join('\n');
}

function profilePurposeLine(id, purposeId) {
  const p = getProfile(id);
  return (p.purposes && p.purposes[purposeId]) || '';
}
