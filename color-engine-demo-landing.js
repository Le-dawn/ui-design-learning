/* ============================================================
   COLOR ENGINE DEMO · LANDING — 七种风格的着陆页案例
   依赖：color-engine-demo-figures.js（图形）、design-profiles.js（风格注册表）
   职责：同一套骨架（.ce-landing 页面层 + .ce-column 版心层）上的七套内容与
        编排；风格差异全部交给 .ce-style-* 作用域样式，本文件不写颜色字面量。
        landingDemoHTML() 按 currentDemoStyle 派发。
   ============================================================ */

/* ── 着陆页：标准 / 暖糖 / 书卷保持既有内容与编排 ──────── */

function standardLandingHTML() {
  return '<div class="ce-landing"><div class="ce-column">' +
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
  '</div></div>';
}

function softLandingHTML() {
  return '<div class="ce-landing"><div class="ce-column">' +
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
  '</div></div>';
}

function editorialLandingHTML() {
  return '<div class="ce-landing"><div class="ce-column">' +
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
  '</div></div>';
}

/* ── 着陆页：流光（本轮重做） ──────────────────────────
   重做要点：干净底色 → 清晰分组 → 最后加光效。
   保留业务事实（数据源 / 智能体 / 延迟），删掉全页多色径向光斑与按钮呼吸辉光；
   玻璃只出现在顶栏与主视觉卡，其余表面稳定可读。 */

function glassLandingHTML() {
  return '<div class="ce-landing"><div class="ce-column">' +
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
  '</div></div>';
}

/* ── 着陆页：褐页（新增） ──────────────────────────────
   目标：整页暖褐纸面 + 书页版心 + 档案条目，与「书卷」的当代编辑感清楚区分。
   材料色由风格自带（不随品牌色变化），品牌色只用于行动与标记。 */

function sepiaLandingHTML() {
  return '<div class="ce-landing"><div class="ce-column">' +
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
  '</div></div>';
}

/* ── 着陆页：构色（新增） ──────────────────────────────
   大字 + 实色色块 + 方角硬投影 + 不对称构图；
   色块有信息职责（主题活动 / 行动），不做无内容的装饰拼贴。 */

function posterLandingHTML() {
  return '<div class="ce-landing"><div class="ce-column">' +
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
  '</div></div>';
}

/* ── 着陆页：展厅（新增） ──────────────────────────────
   首屏就是作品；导航与说明安静；作品尺寸关系构成识别度。
   素材为项目自制演示图形，本地引用（不使用远程图链）。 */

function galleryLandingHTML() {
  return '<div class="ce-landing"><div class="ce-column">' +
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
  '</div></div>';
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
