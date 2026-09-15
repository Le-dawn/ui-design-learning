/* ============================================================
   COLOR ENGINE DEMO · FIGURES — 案例图形与作品数据
   依赖：无（纯 SVG 字符串与数据；颜色一律走 var(--color-*)，不写色值）
   职责：各案例共用的图形——谱线带 / 折线趋势 / 呼吸环 / 数据管线 / 报头 /
        书页 / 海报标记，以及展厅作品清单与容器。图形是几何，不是插画。
   ============================================================ */

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
