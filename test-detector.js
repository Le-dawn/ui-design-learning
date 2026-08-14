const fs = require('fs');
global.document = { getElementById: () => null, querySelectorAll: () => [], querySelector: () => null, addEventListener: () => {}, createElement: () => ({ getContext: () => null }) };
global.window = global;
global.navigator = { clipboard: { writeText: () => Promise.resolve() } };

function loadScript(path) {
  const src = fs.readFileSync(path, 'utf8');
  const cleaned = src
    .replace(/typeof generate === 'function'/g, 'false')
    .replace(/typeof retweak === 'function'/g, 'false')
    .replace(/typeof initTweakSliders === 'function'/g, 'false')
    .replace(/typeof setupBidirectionalHighlight === 'function'/g, 'false');
  (0, eval)(cleaned);
}
loadScript(__dirname + '/color-math.js');
loadScript(__dirname + '/color-engine-core.js');
loadScript(__dirname + '/space-engine-core.js');
loadScript(__dirname + '/detector-engine.js');

const hues = [];
for (let h = 0; h < 360; h += 5) hues.push(h);          // 72 hues
const chromas = [0.06, 0.10, 0.15, 0.20, 0.26, 0.30];   // 6 C
const lights = [0.32, 0.42, 0.52, 0.62, 0.72, 0.82];     // 6 L
const strategies = ['restrained', 'committed', 'full-palette', 'drenched'];
const registers = ['brand', 'product'];

const failures = {};
let tested = 0, skipped = 0;

registers.forEach(reg => {
  currentRegister = reg;
  strategies.forEach(strat => {
    currentStrategy = strat;
    hues.forEach(h => {
      chromas.forEach(c => {
        lights.forEach(l => {
          const hex = oklchToHex(l, c, h);
          if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) { skipped++; return; }
          tested++;

          const accent = computeBeautifulAccent({ L: l, C: c, H: h });
          const accentScaleLight = generateAccentScaleLight(accent.oklch);
          const accentScaleDark = generateAccentScaleDark(accent.oklch);
          const neutralsLight = generateNeutralsLight(accent.oklch.H);
          const neutralsDark = generateNeutralsDark(accent.oklch.H);
          const functional = generateFunctionalColors(accent.oklch.H);
          const spaceScale = generateSpaceScale(4);
          const spaceSemantics = generateSpaceSemanticTokens(spaceScale);

          const ctx = { accent, accentScaleLight, accentScaleDark, neutralsLight, neutralsDark, functional, spaceScale, spaceSemantics };
          const result = runDetector(ctx);

          result.results.forEach(r => {
            if (!r.pass && !r.error) {
              if (!failures[r.id]) failures[r.id] = [];
              if (failures[r.id].length < 3) {
                failures[r.id].push({
                  reg, strat,
                  h: Math.round(h), c: c.toFixed(2), l: l.toFixed(2), hex,
                  detail: r.detail || (r.actual ? JSON.stringify(r.actual).slice(0, 80) : ''),
                  message: r.message || ''
                });
              }
            }
          });
        });
      });
    });
  });
});

const ruleIds = Object.keys(failures).sort();
console.log(`Tested ${tested} combinations (2 registers × 4 strategies × 72H × 6C × 6L, skipped ${skipped} out-of-gamut)`);
console.log(`Rules with failures: ${ruleIds.length}\n`);

if (ruleIds.length === 0) {
  console.log('✓ All rules passed for all tested colors, registers, and strategies.');
} else {
  ruleIds.forEach(id => {
    console.log(`── ${id} (${failures[id].length}+ cases)`);
    failures[id].forEach((ex, i) => {
      console.log(`   ${i+1}. reg=${ex.reg} strat=${ex.strat} H=${ex.h}° C=${ex.c} L=${ex.l}  ${ex.message}`);
    });
    console.log('');
  });
}
