/* ============================================================
   COLOR ENGINE DEMO · APP — 七种风格的工作台案例
   依赖：color-engine-demo-figures.js（图形）、design-profiles.js（风格注册表）
   职责：侧栏 + 顶栏 + 面板网格的同一套骨架，七种风格各自的任务编排
        （增长分析 / 睡眠课程 / 排程 / 数据编目 / 资料目录 / 海报展 / 作品管理）。
        appDemoHTML() 按 currentDemoStyle 派发。
   ============================================================ */

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
