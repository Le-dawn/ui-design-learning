const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function loadEngine(dir = root) {
  const context = vm.createContext({ console });
  const html = fs.readFileSync(path.join(dir, 'color-engine.html'), 'utf8');
  for (const [, file] of html.matchAll(/<script src="([^"]+)"/g)) {
    if (file.split('?')[0] === 'color-engine-interact.js') continue;
    vm.runInContext(fs.readFileSync(path.join(dir, file.split('?')[0]), 'utf8'), context, { filename: file });
  }
  return { run: source => vm.runInContext(source, context), context };
}
module.exports = { loadEngine, root };
