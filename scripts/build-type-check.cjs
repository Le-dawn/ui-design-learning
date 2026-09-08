// 第三阶段验收辅助：关闭颜色与装饰，只比较中文排版关系；并覆盖生僻字与浏览器放大。
const fs = require('node:fs');
const path = require('node:path');
const { loadEngine, root } = require('../tests/engine.cjs');
const { run } = loadEngine();
const dir = path.join(root, 'tests/evidence/stage-3');
fs.mkdirSync(dir, { recursive: true });

const STYLES = ['spectrum', 'standard', 'soft', 'glass', 'editorial'];
const HEAD = '把每一次转化算清楚';
const BODY = '月活跃用户、整体转化率与平均客单价，分别描述不同阶段的业务情况。将数字放回时间与渠道的上下文，才能理解变化意味着什么。';
const RARE = '龘齉爨蠡彧燚犇淼鑫垚烜翀翾蘅懿曦';

const blocks = STYLES.map(style => {
  const f = run('fontStacks(' + JSON.stringify(style) + ')');
  const traits = run('STYLE_FONTS[' + JSON.stringify(style) + '].traits');
  const w = run('STYLE_FONTS[' + JSON.stringify(style) + '].displayWeight');
  const t = run('STYLE_FONTS[' + JSON.stringify(style) + '].displayTracking');
  return `<section>
  <p class="tag">${style} · ${traits}</p>
  <h1 style="font-family:${f.display};font-weight:${w};letter-spacing:${t}">${HEAD}</h1>
  <p class="body" style="font-family:${f.body}">${BODY}</p>
  <p class="data" style="font-family:${f.data}">128.4k · 4.2% · ¥38.6 · 09:00 · API / CSV</p>
  <p class="rare" style="font-family:${f.body}">生僻字：${RARE}</p>
</section>`;
}).join('\n');

const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>中文排版对照 · 关闭颜色与装饰</title>
<style>
  /* 关闭颜色与装饰：全部灰度，只保留字体、字号、字重、字距、行高与行宽 */
  html { color: #111; background: #fff; }
  body { margin: 0; padding: 32px; max-width: 760px; }
  section { padding: 28px 0; border-top: 1px solid #ddd; }
  section:first-of-type { border-top: 0; }
  .tag { font: 400 12px/1.6 ui-monospace, monospace; color: #666; margin: 0 0 10px; letter-spacing: .02em; }
  h1 { font-size: 2.25rem; line-height: 1.16; margin: 0 0 12px; max-width: 14em; text-wrap: balance; }
  .body { font-size: 1rem; line-height: 1.75; max-width: 32em; margin: 0 0 8px; }
  .data { font-size: .875rem; line-height: 1.4; font-variant-numeric: tabular-nums; margin: 0 0 8px; }
  .rare { font-size: .875rem; line-height: 1.8; margin: 0; }
</style>
<body>${blocks}</body></html>`;

fs.writeFileSync(path.join(dir, 'type-only-styles.html'), html);
console.log('Wrote type-only-styles.html');
