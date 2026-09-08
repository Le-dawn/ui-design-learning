// 第三阶段验收：只用导出产物（CSS 导出 + 排版角色 + 区域类）搭一个干净页面，
// 不引入工具自身的 demo 样式，验证字体、区域与角色在“干净环境”中成立。
const fs = require('node:fs');
const path = require('node:path');
const { loadEngine, root } = require('../tests/engine.cjs');
const { run } = loadEngine();
const dir = path.join(root, 'tests/evidence/stage-3');
fs.mkdirSync(dir, { recursive: true });

const css = run(`(() => {
  const a = computeBeautifulAccent(hexToOklch('#2563eb'));
  const s = computeSystem(a.oklch, { textOnAccentLight: a.textContrastOnAccent, design: { style: 'editorial', mode: 'read', strategy: 'committed', strategyExplicit: true } });
  const sc = generateSpaceScale(4);
  const t = buildTokenMap(s, sc, generateSpaceSemanticTokens(sc, s.design));
  return buildCSSExport(s, t);
})()`);
fs.writeFileSync(path.join(dir, 'export-only.css'), css);

const html = `<!doctype html><html lang="zh-CN" data-theme="light"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>只用导出产物的干净页面</title>
<link rel="stylesheet" href="export-only.css">
<body style="margin:0;background:var(--color-bg-primary)">
<main class="ce-surface ce-style-editorial" data-ce-mode="read" style="padding:var(--space-3xl) var(--space-2xl)">
  <h1>把每一次转化算清楚</h1>
  <p>月活跃用户、整体转化率与平均客单价，分别描述不同阶段的业务情况。将数字放回时间与渠道的上下文，才能理解变化意味着什么。</p>
  <h2>报表访问设置</h2>
  <form><label>报表名称 <input value="每周增长概览（中文与 API 混排）"></label>
  <button type="button" class="ce-btn">保存设置</button></form>
  <p class="ce-type-data">128.4k · 4.2% · ¥38.6 · 09:00</p>
</main>
<section class="ce-region-brand" style="padding:var(--space-2xl);margin:var(--space-2xl)">
  <h2 style="margin:0 0 var(--space-sm)">品牌区域内的同一套组件</h2>
  <p style="margin:0 0 var(--space-md)">区域类重映射语义变量后，按钮与文字自动适配。</p>
  <button type="button" class="ce-btn">主操作</button>
</section>
</body></html>`;
fs.writeFileSync(path.join(dir, 'export-only.html'), html);
console.log('Wrote export-only.html / export-only.css');
