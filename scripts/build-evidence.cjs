// Reproducible static fixtures use the same calculation and export pipeline as the UI.
// 用法：node scripts/build-evidence.cjs [baseline|stage-1|stage-2|stage-3]
const fs = require('node:fs');
const path = require('node:path');
const { loadEngine, root } = require('../tests/engine.cjs');
const stage = process.argv[2] || 'stage-1';
const dir = path.join(root, 'tests/evidence', stage);
fs.mkdirSync(dir, {recursive:true});
const baseline = stage === 'baseline';
const useRegions = !baseline && stage !== 'stage-1';
const useTypography = stage === 'stage-3';
const {run} = loadEngine(baseline ? dir : root);

const BLUE = '#2563eb';
const CASES = {
  baseline: [
    {style:'standard', mode:'persuade', strategy:'committed', theme:'light'},
    {style:'standard', mode:'operate',  strategy:'committed', theme:'light'}
  ],
  'stage-1': [
    {style:'standard',  mode:'persuade',   strategy:'committed',  theme:'light'},
    {style:'standard',  mode:'operate',    strategy:'restrained', theme:'light'},
    {style:'glass',     mode:'operate',    strategy:'committed',  theme:'dark'},
    {style:'editorial', mode:'read',       strategy:'restrained', theme:'light'},
    {style:'soft',      mode:'experience', strategy:'committed',  theme:'light'}
  ],
  // 同一页面、同一数据与排版，只切换策略；另含亮色品牌、深色品牌与接近功能色的品牌
  'stage-2': [
    {style:'standard', mode:'persuade', strategy:'restrained',   theme:'light'},
    {style:'standard', mode:'persuade', strategy:'committed',    theme:'light'},
    {style:'standard', mode:'persuade', strategy:'full-palette', theme:'light'},
    {style:'standard', mode:'persuade', strategy:'drenched',     theme:'light'},
    {style:'standard', mode:'operate',  strategy:'restrained',   theme:'light'},
    {style:'standard', mode:'operate',  strategy:'committed',    theme:'light'},
    {style:'standard', mode:'operate',  strategy:'full-palette', theme:'light'},
    {style:'standard', mode:'operate',  strategy:'drenched',     theme:'light'},
    {style:'glass',    mode:'operate',  strategy:'committed',    theme:'dark'},
    {style:'glass',    mode:'persuade', strategy:'drenched',     theme:'dark'},
    {style:'soft',     mode:'persuade', strategy:'committed',    theme:'light', brand:'#f59e0b'},
    {style:'editorial',mode:'persuade', strategy:'drenched',     theme:'light', brand:'#4c1d95'},
    {style:'standard', mode:'persuade', strategy:'committed',    theme:'light', brand:'#16a34a'},
    {style:'editorial',mode:'read',     strategy:'restrained',   theme:'light'},
    {style:'soft',     mode:'experience',strategy:'committed',   theme:'light'}
  ],
  'stage-3': [
    {style:'standard', mode:'persuade', strategy:'committed',    theme:'light'},
    {style:'standard', mode:'operate',  strategy:'restrained',   theme:'light'},
    {style:'editorial',mode:'read',     strategy:'restrained',   theme:'light'},
    {style:'editorial',mode:'read',     strategy:'restrained',   theme:'dark'},
    {style:'soft',     mode:'experience',strategy:'committed',   theme:'light'},
    {style:'glass',    mode:'operate',  strategy:'committed',    theme:'dark'},
    {style:'spectrum', mode:'persuade', strategy:'committed',    theme:'light'},
    {style:'standard', mode:'persuade', strategy:'drenched',     theme:'light', brand:'#f59e0b'}
  ]
};
const cases = CASES[stage] || CASES['stage-1'];

const links = [];
for (const c of cases) {
  const {style, mode, strategy, theme} = c;
  const brand = c.brand || BLUE;
  const name = [style, mode, strategy, theme].concat(c.brand ? [brand.slice(1)] : []).join('-');
  const html = run(`(() => {
    currentDemoStyle=${JSON.stringify(style)};currentDemoType=${JSON.stringify(mode==='operate'?'app':'landing')};
    currentStrategy=${JSON.stringify(strategy)};strategyExplicit=true;
    const accent=computeBeautifulAccent(hexToOklch(${JSON.stringify(brand)}));
    const sys=computeSystem(accent.oklch,{textOnAccentLight:accent.textContrastOnAccent,design:{style:${JSON.stringify(style)},mode:${JSON.stringify(mode)},strategy:${JSON.stringify(strategy)},strategyExplicit:true}});
    const scale=generateSpaceScale(4),tokens=buildTokenMap(sys,scale,generateSpaceSemanticTokens(scale,sys.design));
    let body=currentDemoType==='app'?appDemoHTML():landingDemoHTML();
    const cls='ce-surface ce-style-'+currentDemoStyle;
    body=body.replace(/class="ce-(landing|app)"/, 'class="ce-$1 '+cls+'" data-ce-mode="${mode}" data-ce-strategy="${strategy}"');
    ${!baseline ? `if('${mode}'==='read') body='<main class="ce-surface ce-style-${style}" data-ce-mode="read"><article class="ce-prose"><h1>把每一次转化算清楚：一份给团队的阅读指南</h1><p>更新于 2026 年 9 月 · 阅读约 6 分钟</p><h2>先理解指标，再决定行动</h2><p>月活跃用户、整体转化率与平均客单价，分别描述不同阶段的业务情况。将数字放回时间与渠道的上下文，才能理解变化意味着什么。</p><p>这是一段用于排版验证的合成内容，不构成真实业务结论。当标题较长、正文包含 API、CSV 和 128.4k 等混排内容时，仍应保持稳定的节奏。</p><h2>报表访问设置</h2><form><label>报表名称 <input value="每周增长概览（中文与 API 混排）"></label><p>说明：设置页中的标签沿用操作页面的字体，不使用展示字体。</p><button type="button">保存设置</button></form></article></main>';
    if('${mode}'==='experience') body='<main class="ce-surface ce-style-${style}" data-ce-mode="experience"><h1>看见变化的形状</h1><figure class="ce-work">'+pulseChartSVG()+'<figcaption>转化趋势 · 合成示例</figcaption></figure><p>同一品牌下的展示页面：让作品的比例决定画面，说明保持可读。</p></main>';` : ''}
    ${useRegions ? `body=applyRegionPlan(body,sys.regions,'${mode}',${JSON.stringify(style)});` : ''}
    const css=buildCSSExport(sys,tokens)+buildDemoCSS()+demoStyleCSS(currentDemoStyle)${!baseline?'+buildModeCSS(sys.design,scale)':''}${useRegions?'+buildRegionCSS(sys.regions)':''}${useTypography?'+buildFontCSS(sys.design)':''};
    const canvasCls=${useRegions}&&sys.regions.plan.canvas?' class="ce-region-canvas"':'';
    return '<!doctype html><html lang="zh-CN" data-theme="${theme}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${name}</title><style>'+css+'body{margin:0;padding:32px;background:var(--color-bg-primary)}@media(max-width:600px){body{padding:16px}}*{box-sizing:border-box}</style><body'+canvasCls+'>'+body+'</body></html>';
  })()`);
  fs.writeFileSync(path.join(dir, name + '.html'), html);
  const prompt = run(`(() => { const a=computeBeautifulAccent(hexToOklch(${JSON.stringify(brand)}));const s=computeSystem(a.oklch,{design:{style:${JSON.stringify(style)},mode:${JSON.stringify(mode)},strategy:${JSON.stringify(strategy)},strategyExplicit:true}});const sc=generateSpaceScale(4);const t=buildTokenMap(s,sc,generateSpaceSemanticTokens(sc,s.design)); return buildStylePromptExport(t,s); })()`);
  fs.writeFileSync(path.join(dir, name + '.md'), prompt);
  links.push(`<li><a href="${name}.html">${name}</a></li>`);
}
fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html><meta charset="utf-8"><title>${stage}</title><h1>${stage}</h1><ul>${links.join('')}</ul>`);
console.log(`Wrote ${cases.length} fixture pairs to ${dir}`);
