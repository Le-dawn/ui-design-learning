const test = require('node:test');
const assert = require('node:assert/strict');
const { loadEngine } = require('./engine.cjs');
const engine = loadEngine();
const run = engine.run;
test('mode defaults differ; explicit strategy wins; invalid options safely resolve', () => {
  assert.equal(run("resolveDesignProfile({pageType:'app'}).strategy"), 'restrained');
  assert.equal(run("resolveDesignProfile({pageType:'landing'}).strategy"), 'committed');
  assert.equal(run("resolveDesignProfile({pageType:'app',strategy:'drenched',strategyExplicit:true}).strategy"), 'drenched');
  assert.equal(run("resolveDesignProfile({mode:'invalid',style:'invalid'}).style"), 'spectrum');
});
test('all style, mode, strategy, theme combinations have complete role values and no duplicate tokens', () => {
  assert.equal(run(`(() => {
    let count=0;
    for(const style of Object.keys(DESIGN_STYLES)) for(const mode of Object.keys(DESIGN_MODES))
    for(const strategy of Object.keys(DESIGN_STRATEGIES)) for(const theme of ['light','dark']) {
      const sys=computeSystem(hexToOklch('#2563eb'),{design:{style,mode,strategy,strategyExplicit:true,theme}});
      const scale=generateSpaceScale(4); const t=buildTokenMap(sys,scale,generateSpaceSemanticTokens(scale));
      if(new Set(t.map(x=>x.name)).size!==t.length || t.some(x=>!x.light || !x.dark)) throw Error('invalid tokens');
      if(sys.design.mode!==mode || sys.design.strategy!==strategy) throw Error('profile lost');
      if(mode==='operate' && sys.design.surface.displaySize.includes('clamp')) throw Error('unstable UI scale');
      count++;
    }return count;
  })()`), 160);
});
test('CSS, context and JSON retain all four modes and actual style radii', () => {
  run(`var sys=computeSystem(hexToOklch('#2563eb'),{design:{style:'soft'}});
    var scale=generateSpaceScale(4);var tokens=buildTokenMap(sys,scale,generateSpaceSemanticTokens(scale));`);
  assert.equal(run("tokens.find(t=>t.name==='--radius-sm').light"), '14px');
  const css=run('buildCSSExport(sys,tokens)');
  const prompt=run('buildStylePromptExport(tokens,sys)');
  for(const mode of ['persuade','operate','read','experience']) {
    assert.ok(css.includes(`data-ce-mode="${mode}"`)); assert.ok(prompt.includes(mode));
  }
  assert.ok(!prompt.includes('不得重排骨架')); assert.ok(!prompt.includes('参照天文观测'));
  const json=JSON.parse(run('buildJSONTokens(tokens,sys)'));
  assert.equal(json.tokens['--radius-sm'].light,'14px');
  assert.equal(json.modes.operate.profile.strategy,'restrained');
  assert.ok(run('buildComponentCSSExport(sys)').includes('.ce-style-soft'));
});
