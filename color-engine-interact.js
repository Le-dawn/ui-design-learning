/* ============================================================
   COLOR ENGINE INTERACT — 交互 · Logo 取色 · 持久化 · 全屏 · 启动
   依赖：全部引擎脚本（最后加载，注册 DOMContentLoaded 启动）
   本文件负责：预览主题、全屏、复制、品牌色是否显式设置的判定、
   风格切换时套用该风格的默认品牌色、单份本地状态恢复与旧值兼容。
   ============================================================ */

let currentPreviewTheme = 'light';
let brandColorExplicit = false;   // 用户是否显式设置过品牌色（决定切换风格时是否改用风格默认色）

window._previewTheme = currentPreviewTheme;

function setPreviewTheme(theme, btn) {
  currentPreviewTheme = theme === 'dark' ? 'dark' : 'light';
  window._previewTheme = currentPreviewTheme;
  const card = document.getElementById('comp-preview-card');
  if (card) card.setAttribute('data-theme', currentPreviewTheme);
  const overlay = document.getElementById('fullscreen-overlay');
  if (overlay) overlay.setAttribute('data-theme', currentPreviewTheme);
  // 缩略图与比较样张跟随同一主题，保证颜色与主预览一致
  const picker = document.getElementById('style-picker');
  if (picker) picker.setAttribute('data-theme', currentPreviewTheme);
  const compare = document.getElementById('compare-sample');
  if (compare) compare.setAttribute('data-theme', currentPreviewTheme);

  document.querySelectorAll('#theme-toggle .theme-toggle-btn, #fs-theme-toggle .theme-toggle-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === currentPreviewTheme);
  });
}

// ── 全屏预览：克隆当前案例到固定覆盖层（样式在文档作用域，克隆无需再带样式） ──

function openFullscreenPreview() {
  const overlay = document.getElementById('fullscreen-overlay');
  const demo = document.getElementById('component-demo');
  if (!overlay || !demo) return;

  document.getElementById('fullscreen-demo').innerHTML = demo.innerHTML;
  overlay.setAttribute('data-theme', currentPreviewTheme);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;

  document.querySelectorAll('#fs-theme-toggle .theme-toggle-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === currentPreviewTheme);
  });
}

function closeFullscreenPreview() {
  const overlay = document.getElementById('fullscreen-overlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeFullscreenPreview();
});

/* ── 复制（clipboard + file:// 兜底） ─────────────────── */

function copyText(text, onDone) {
  const fallback = function () {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); onDone(); } catch (e) { alert('复制失败，请手动选择内容复制'); }
    ta.remove();
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onDone, fallback);
  } else {
    fallback();
  }
}

// 主出口：一次复制给 AI（tokens + 风格 + 组件 CSS + 用途规则）
function copyAIPrompt() {
  const code = typeof currentAIPrompt === 'function' ? currentAIPrompt() : '';
  const stateEl = document.getElementById('copy-ai-state');
  if (!code) { alert('内容还没准备好，请稍后重试'); return; }
  copyText(code, function () {
    if (!stateEl) return;
    stateEl.textContent = '✓ 已复制完整内容（' + (code.length / 1000).toFixed(1) + 'k 字符，含 tokens + 风格 + 组件）';
    setTimeout(function () { stateEl.textContent = ''; }, 3200);
  });
}

function copyCSS() {
  const code = document.getElementById('css-code').textContent;
  copyText(code, function () {
    const btn = document.querySelector('.copy-btn');
    if (!btn) return;
    const orig = btn.textContent;
    btn.textContent = '✓ 已复制!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
}

/* ── 品牌色输入 ───────────────────────────────────────── */

function syncHexInput(colorPicker) {
  const group = colorPicker.closest('.input-color-group');
  const hexInput = group.querySelector('.hex-input');
  hexInput.value = colorPicker.value;
  markBrandColorExplicit();
}

function syncColorPicker(hexInput) {
  const val = hexInput.value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    const group = hexInput.closest('.input-color-group');
    const colorPicker = group.querySelector('input[type="color"]');
    colorPicker.value = val;
    markBrandColorExplicit();
  }
}

function markBrandColorExplicit() {
  if (brandColorExplicit) return;
  brandColorExplicit = true;
  if (typeof saveState === 'function') saveState();
}

// 构造单个品牌色输入组（addColorInput 与 localStorage 恢复共用）
function createColorGroup(index, hex, weight) {
  const div = document.createElement('div');
  div.className = 'input-color-group';
  div.dataset.index = index;
  div.innerHTML = `
    <div class="label-row">
      <label>颜色 ${index + 1}（${index === 0 ? '主角' : '配角'}）</label>
      ${index === 0 ? '' : '<button class="remove-btn" onclick="removeColorInput(this)">✕ 删除</button>'}
    </div>
    <div class="input-row">
      <input type="color" value="${hex}" onchange="syncHexInput(this)">
      <input type="text" value="${hex}" placeholder="#000000" class="hex-input" onchange="syncColorPicker(this)">
      <input type="number" value="${weight !== undefined && weight !== null && weight !== '' ? weight : ''}" min="0" max="100" placeholder="%" class="weight-input">
      <span class="pct-sign">%</span>
    </div>
  `;
  return div;
}

function addColorInput() {
  const container = document.getElementById('color-inputs');
  const existing = container.querySelectorAll('.input-color-group');
  if (existing.length >= 4) { alert('最多支持 4 个品牌色'); return; }
  container.appendChild(createColorGroup(existing.length, getProfile(currentDemoStyle).defaultAccent, ''));
  markBrandColorExplicit();
}

/* ── 风格切换：未显式设置品牌色时使用该风格的默认色 ────── */

function applyStyleDefaultAccent(styleId) {
  const p = getProfile(styleId);
  const first = document.querySelector('.input-color-group[data-index="0"]') || document.querySelector('.input-color-group');
  if (!first) return;
  const picker = first.querySelector('input[type="color"]');
  const hexInput = first.querySelector('.hex-input');
  const weight = first.querySelector('.weight-input');
  if (picker) picker.value = p.defaultAccent;
  if (hexInput) hexInput.value = p.defaultAccent;
  if (weight && !weight.value) weight.value = 100;
}

// setDemoStyle 在风格真的变化时回调这里；返回 true 表示已重算并重绘
function onStyleChanged(styleId) {
  updatePreviewHint();
  if (brandColorExplicit) return false;
  applyStyleDefaultAccent(styleId);
  if (typeof generate === 'function') { generate(true); return true; }
  return false;
}

function updatePreviewHint() {
  const el = document.getElementById('preview-hint');
  if (!el) return;
  const p = getProfile(currentDemoStyle);
  el.textContent = '当前：' + p.name + '（' + p.en + '）· ' + p.tagline;
}

/* ── 输入与开关状态持久化（单份状态，不含方案库） ─────── */

const STORAGE_KEY = 'color-engine-state-v1';

function saveState() {
  try {
    const groups = Array.from(document.querySelectorAll('.input-color-group')).map(g => ({
      hex: g.querySelector('.hex-input').value,
      weight: g.querySelector('.weight-input').value
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      groups,
      strategy: currentStrategy,
      baseUnit: spaceBaseUnit,
      demoType: currentDemoType,
      demoStyle: currentDemoStyle,
      brandColorExplicit: brandColorExplicit
    }));
  } catch (e) { /* localStorage 不可用（隐私模式 / file:// 限制）时静默跳过 */ }
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (!s) return false;

    // 风格：旧值 spectrum 等一律归一到当前阵容的默认风格，不要求用户处理迁移
    currentDemoStyle = normalizeStyleId(s.demoStyle);
    brandColorExplicit = s.brandColorExplicit === true;

    if (Array.isArray(s.groups) && s.groups.length > 0 && s.groups.every(g => /^#[0-9a-fA-F]{6}$/.test(g.hex))) {
      const container = document.getElementById('color-inputs');
      container.innerHTML = '';
      s.groups.forEach((g, i) => container.appendChild(createColorGroup(i, g.hex, g.weight)));
    }
    if (!brandColorExplicit) applyStyleDefaultAccent(currentDemoStyle);

    if (['restrained', 'committed', 'full-palette', 'drenched'].indexOf(s.strategy) !== -1) currentStrategy = s.strategy;
    if (s.baseUnit === 4 || s.baseUnit === 8) spaceBaseUnit = s.baseUnit;
    if (s.demoType === 'landing' || s.demoType === 'app') currentDemoType = s.demoType;

    applyToggleState();
    return true;
  } catch (e) { return false; }
}

function applyToggleState() {
  const setActive = (selector, val) => {
    document.querySelectorAll(selector).forEach(b => b.classList.toggle('active', b.dataset.val === String(val)));
  };
  setActive('#strategy-toggle .theme-toggle-btn', currentStrategy);
  setActive('#base-unit-toggle .theme-toggle-btn', spaceBaseUnit);
  setActive('#demo-type-toggle .theme-toggle-btn', currentDemoType);
  updateStylePickerActive();
  updatePreviewHint();
}

function removeColorInput(btn) {
  const container = document.getElementById('color-inputs');
  const groups = container.querySelectorAll('.input-color-group');
  if (groups.length <= 1) return;
  btn.closest('.input-color-group').remove();
  container.querySelectorAll('.input-color-group').forEach((g, i) => {
    g.dataset.index = i;
    const label = g.querySelector('label');
    label.textContent = i === 0 ? `颜色 1（主角）` : `颜色 ${i + 1}（配角）`;
  });
  markBrandColorExplicit();
}

/* ── 恢复默认色：清掉显式设置，回到当前风格的默认品牌色 ──
   与 resetTweaks 的区别：那个只把实时调色滑块拉回当前强调色，
   这个连 brandColorExplicit 一起清掉——之后切换风格又会自动套用
   各风格的默认色（即「7 个案例各自的默认色」）。 */
function useStyleDefaultAccent() {
  const container = document.getElementById('color-inputs');
  if (!container) return;

  // 只留主角：配角是用户自己加的，不清掉就回不到默认
  const groups = container.querySelectorAll('.input-color-group');
  Array.prototype.slice.call(groups, 1).forEach(g => g.remove());

  brandColorExplicit = false;
  applyStyleDefaultAccent(currentDemoStyle);
  const weight = container.querySelector('.input-color-group[data-index="0"] .weight-input');
  if (weight) weight.value = 100;

  // 静默生成：不滚动、不把预览主题切回亮色（滑块与本地状态由 generate 内部同步）
  if (typeof generate === 'function') generate(true);
}

/* ── Logo 取色 ────────────────────────────────────── */

(function() {
  const dropZone = document.getElementById('drop-zone');
  if (!dropZone) return;

  dropZone.addEventListener('click', function() {
    document.getElementById('logo-file-input').click();
  });

  ['dragover', 'dragenter'].forEach(type => {
    dropZone.addEventListener(type, function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.add('dragover');
    });
  });
  ['dragleave', 'drop'].forEach(type => {
    dropZone.addEventListener(type, function(e) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.remove('dragover');
    });
  });
  dropZone.addEventListener('drop', function(e) {
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleLogoFile(file);
  });
})();

function handleLogoFile(file) {
  if (!file) return;
  if (!file.type.startsWith('image/')) { alert('请选择图片文件'); return; }
  if (file.size > 15 * 1024 * 1024) { alert('图片过大（超过 15MB），请压缩后重试'); return; }
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() { extractLogoColors(img); };
    img.onerror = function() { alert('图片解码失败，请更换文件'); };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function extractLogoColors(img) {
  const maxDim = 300;
  const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.round(img.naturalWidth * scale);
  const h = Math.round(img.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, w, h);
  const pixels = ctx.getImageData(0, 0, w, h).data;

  const step = 24;
  const colorMap = new Map();
  let total = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i], g = pixels[i+1], b = pixels[i+2], a = pixels[i+3];
    if (a < 128) continue;
    total++;
    const qr = Math.round(r / step) * step;
    const qg = Math.round(g / step) * step;
    const qb = Math.round(b / step) * step;
    const key = `${qr},${qg},${qb}`;
    const entry = colorMap.get(key);
    if (entry) {
      entry.count++; entry.sr += r; entry.sg += g; entry.sb += b;
    } else {
      colorMap.set(key, { count: 1, sr: r, sg: g, sb: b });
    }
  }

  if (total === 0) return;

  let colors = [];
  for (const [, v] of colorMap) {
    colors.push({
      hex: '#' + [Math.round(v.sr/v.count), Math.round(v.sg/v.count), Math.round(v.sb/v.count)].map(n => n.toString(16).padStart(2,'0')).join(''),
      pct: (v.count / total) * 100
    });
  }

  const merged = mergeExtractedColors(colors, 0.06);
  merged.sort((a, b) => b.pct - a.pct);
  const top = merged.filter(c => c.pct >= 1).slice(0, 4);

  autoFillFromLogo(top);
}

/* ── OKLab 辅助（合并相近颜色用） ─────────────────── */

function hexToOklab(hex) {
  const ok = hexToOklch(hex);
  if (!ok) return null;
  return oklchToOklab(ok.L, ok.C, ok.H);
}

function oklabToHex(lab) {
  const C = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let H = Math.atan2(lab.b, lab.a) * 180 / Math.PI;
  if (H < 0) H += 360;
  return oklchToHex(lab.L, C, H);
}

function oklabDist(a, b) {
  return Math.sqrt(Math.pow(a.L - b.L, 2) + Math.pow(a.a - b.a, 2) + Math.pow(a.b - b.b, 2));
}

function mergeExtractedColors(colors, threshold) {
  if (colors.length <= 1) return colors;
  const merged = [];
  const used = new Set();
  for (let i = 0; i < colors.length; i++) {
    if (used.has(i)) continue;
    let base = { ...colors[i] };
    let baseLab = hexToOklab(base.hex);
    used.add(i);
    for (let j = i + 1; j < colors.length; j++) {
      if (used.has(j)) continue;
      const otherLab = hexToOklab(colors[j].hex);
      if (!baseLab || !otherLab) continue;
      if (oklabDist(baseLab, otherLab) < threshold) {
        const total = base.pct + colors[j].pct;
        const w = base.pct / total;
        baseLab = {
          L: baseLab.L * w + otherLab.L * (1 - w),
          a: baseLab.a * w + otherLab.a * (1 - w),
          b: baseLab.b * w + otherLab.b * (1 - w)
        };
        base.hex = oklabToHex(baseLab);
        base.pct = total;
        used.add(j);
      }
    }
    merged.push(base);
  }
  merged.sort((a, b) => b.pct - a.pct);
  return merged;
}

function autoFillFromLogo(colors) {
  if (colors.length === 0) return;
  const container = document.getElementById('color-inputs');

  const groups = container.querySelectorAll('.input-color-group');
  for (let i = groups.length - 1; i >= 1; i--) groups[i].remove();

  colors.forEach((c, i) => {
    let group;
    if (i === 0) {
      group = container.querySelector('.input-color-group[data-index="0"]');
    } else {
      addColorInput();
      group = container.querySelectorAll('.input-color-group')[i];
    }

    if (group) {
      const colorPicker = group.querySelector('input[type="color"]');
      const hexInput = group.querySelector('.hex-input');
      const weightInput = group.querySelector('.weight-input');
      if (colorPicker) colorPicker.value = c.hex;
      if (hexInput) hexInput.value = c.hex;
      if (weightInput) weightInput.value = Math.round(c.pct);
    }
  });

  brandColorExplicit = true;   // Logo 取色属于显式设置
  if (typeof generate === 'function') generate();
}

/* ── 实时调色滑块 ──────────────────────────────────── */

var _tweakTimer = null;
var _tweakDirty = false;

function updateTweakContext() {
  const el = document.getElementById('tweak-context');
  if (!el) return;
  const names = { restrained: '克制', committed: '投入', 'full-palette': '全色板', drenched: '浸染' };
  const factors = { restrained: 0.5, committed: 1.0, 'full-palette': 1.5, drenched: 2.0 };
  const name = names[currentStrategy] || currentStrategy;
  const f = factors[currentStrategy] || 1.0;
  const unit = spaceBaseUnit === 8 ? '8px 标准' : '4px 精细';
  el.textContent = '策略 ' + name + ' ×' + f + ' · 基准 ' + unit + ' · 强调色归滑块';
}

function syncTweakSliders(oklch) {
  var hSlider = document.getElementById('tweak-h');
  var cSlider = document.getElementById('tweak-c');
  var lSlider = document.getElementById('tweak-l');
  if (hSlider) hSlider.value = Math.round(oklch.H);
  if (cSlider) cSlider.value = oklch.C;
  if (lSlider) lSlider.value = oklch.L;
  updateTweakLabels(oklch.H, oklch.C, oklch.L);
}

function initTweakSliders(oklch) {
  if (!document.getElementById('tweak-h')) return;
  syncTweakSliders(oklch);
  _tweakDirty = false;
  var statusEl = document.getElementById('tweak-status');
  if (statusEl) statusEl.textContent = '';
}

function updateTweakLabels(h, c, l) {
  var hEl = document.getElementById('tweak-h-val');
  var cEl = document.getElementById('tweak-c-val');
  var lEl = document.getElementById('tweak-l-val');
  if (hEl) hEl.textContent = Math.round(h) + '°';
  if (cEl) cEl.textContent = c.toFixed(3);
  if (lEl) lEl.textContent = l.toFixed(2);

  var hex = oklchToHex(l, c, h);
  var swatch = document.getElementById('tweak-swatch');
  var hexEl = document.getElementById('tweak-hex');
  if (swatch) swatch.style.background = hex;
  if (hexEl) hexEl.textContent = hex;
}

function onTweakInput() {
  _tweakDirty = true;
  brandColorExplicit = true;   // 手动调色属于显式设置
  var h = parseFloat(document.getElementById('tweak-h').value);
  var c = parseFloat(document.getElementById('tweak-c').value);
  var l = parseFloat(document.getElementById('tweak-l').value);
  updateTweakLabels(h, c, l);
  var statusEl = document.getElementById('tweak-status');
  if (statusEl) statusEl.textContent = '调整中...';

  if (_tweakTimer) clearTimeout(_tweakTimer);
  _tweakTimer = setTimeout(function() {
    _tryAppliedSeed = null;   // 调色滑块生效后，试色带游标重新跟随渲染结果
    if (typeof retweak === 'function') {
      retweak(h, c, l);
    }
    if (statusEl) statusEl.textContent = '';
    _tweakDirty = false;
    if (typeof saveState === 'function') saveState();
  }, 80);
}

function resetTweaks() {
  if (!lastAccentOklch) return;
  syncTweakSliders(lastAccentOklch);
  if (typeof retweak === 'function') {
    retweak(lastAccentOklch.H, lastAccentOklch.C, lastAccentOklch.L);
  }
  document.getElementById('tweak-status').textContent = '已重置';
}

/* ── 试色带：在 OKLCH 宜居带上扫色，预览实时跟随 ──────
   带上的每一格 = 该色相在宜居带的理想 L/C（也就是引擎校正的目标值本身），
   所以拖到哪，页面渲染出来就是那个颜色；点一下即落成显式品牌色，
   与手填 hex 完全等价（导出、复制给 AI 都跟着走）。 */

// 某明度下这个色相在 sRGB 里能达到的最大色度（二分；宜居带的理想色度常常超出色域）
function maxChromaAt(L, h) {
  let lo = 0, hi = 0.37;
  for (let i = 0; i < 16; i++) {
    const mid = (lo + hi) / 2;
    const rt = hexToOklch(oklchToHex(L, mid, h));
    if (rt && rt.C >= mid - 0.005) lo = mid; else hi = mid;
  }
  return lo;
}

// 该色相在宜居带里"能做到的最美版本"：先试理想明度，再在明度区间内退让
function bandSeedForHue(h) {
  const hh = ((h % 360) + 360) % 360;
  const range = getOklchRange(hh);
  const tries = [range.lIdeal, range.lIdeal + 0.03, range.lIdeal - 0.03, range.lMax, range.lMin];
  for (let i = 0; i < tries.length; i++) {
    const L = tries[i];
    if (L < range.lMin || L > range.lMax) continue;
    const C = Math.min(range.cIdeal, maxChromaAt(L, hh));
    if (C >= range.cMin) return oklchToHex(L, C, hh);
  }
  return oklchToHex(range.lIdeal, range.cMin, hh);
}

// 带上一格 = 引擎渲染结果本身：先定种子，再过一遍同一条校正管线
const _tryHueCache = new Map();
function tryColorForHue(h) {
  const key = Math.round(((h % 360) + 360) % 360);
  const hit = _tryHueCache.get(key);
  if (hit) return hit;
  const seed = bandSeedForHue(key);
  const acc = computeBeautifulAccent(hexToOklch(seed));
  const out = { seed: seed, hex: acc.hex, on: acc.textContrastOnAccent };
  _tryHueCache.set(key, out);
  return out;
}

function tryColorRibbonGradient() {
  _tryHueCache.clear();
  const stops = [];
  // 1° 一档（361 个停靠点）：轨道画出来的每一格都等于点下去会渲染出的颜色
  for (let h = 0; h <= 360; h += 1) {
    stops.push(tryColorForHue(h).hex + ' ' + (h / 3.6).toFixed(3) + '%');
  }
  return 'linear-gradient(90deg, ' + stops.join(', ') + ')';
}

// 色相带边界刻度：0 / 40 / 70 / 110 / 165 / 210 / 280 / 320 / 360
const TRY_BAND_TICKS = [[0, '红'], [40, '橙'], [70, '黄'], [110, '绿'], [165, '青'], [210, '蓝'], [280, '紫'], [320, '洋红'], [360, '']];

function renderTryTicks() {
  const box = document.getElementById('try-ticks');
  if (!box) return;
  box.innerHTML = TRY_BAND_TICKS.map(function(t, i) {
    const cls = 'try-tick' + (i === 0 ? ' is-first' : '') + (i === TRY_BAND_TICKS.length - 1 ? ' is-last' : '');
    return '<span class="' + cls + '" style="left:' + (t[0] / 3.6).toFixed(3) + '%"><span>' + t[0] + '°</span></span>';
  }).join('');
}

let _tryTimer = null;
let _tryDragging = false;
let _ribbonBuiltFor = null;
let _tryAppliedSeed = null;   // 带子自己刚写进颜色输入的值（用来判断"这次渲染是不是带子造成的"）

function applyTryHue(h) {
  const first = document.querySelector('.input-color-group[data-index="0"]');
  if (!first) return;
  const hex = tryColorForHue(h).seed;
  const picker = first.querySelector('input[type="color"]');
  const hexInput = first.querySelector('.hex-input');
  if (picker) picker.value = hex;
  if (hexInput) hexInput.value = hex.toUpperCase();
  _tryAppliedSeed = hex.toUpperCase();
  markBrandColorExplicit();
  // 静默生成：不滚动、不把预览主题切回亮色
  if (typeof generate === 'function') generate(true);
}

// 度数读数：带子所在色相；管线微调过色相时补一个"渲染 N°"
function updateTryHueReadout(pos, renderedHue) {
  const el = document.getElementById('try-hue');
  if (!el) return;
  let html = 'H ' + pos + '°';
  if (typeof renderedHue === 'number') {
    const dist = Math.abs(((pos - renderedHue + 540) % 360) - 180);
    if (dist >= 1) {
      html += ' <span class="try-hue-rendered" title="引擎对这一段色相做了微调：实际渲染 ' + renderedHue + '°">→ ' + renderedHue + '°</span>';
    }
  }
  el.innerHTML = html;
}

function onTryHueInput(e) {
  _tryDragging = true;
  const h = parseFloat(e.target.value);
  // 拖动/按键当下就反馈：度数立刻走，色片与 hex 用带上那一格的预测色（整页重绘仍走 60ms 防抖）
  const t = tryColorForHue(h);
  updateTryHueReadout(Math.round(h), Math.round(hexToOklch(t.hex).H) % 360);
  const chip = document.getElementById('try-chip');
  const hexEl = document.getElementById('try-hex');
  if (chip) chip.style.background = t.hex;
  if (hexEl) hexEl.textContent = t.hex.toUpperCase();
  if (_tryTimer) clearTimeout(_tryTimer);
  _tryTimer = setTimeout(function() {
    applyTryHue(h);
    _tryDragging = false;
  }, 60);
}

// 色片与 hex 读数跟随真实渲染结果（换风格 / 换主题 / 调色后都同步）
function updateTryColorUI() {
  const ribbon = document.getElementById('hue-ribbon');
  const chip = document.getElementById('try-chip');
  const hexEl = document.getElementById('try-hex');
  if (!ribbon) return;
  // 策略变了，带上的颜色会跟着变（克制会整体收敛），需要重铺
  if (_ribbonBuiltFor !== currentStrategy) {
    ribbon.style.background = tryColorRibbonGradient();
    _ribbonBuiltFor = currentStrategy;
  }
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--color-accent-base').trim();
  if (chip) chip.style.background = accent;
  if (hexEl) hexEl.textContent = accent ? accent.toUpperCase() : '—';
  const ok = hexToOklch(accent);
  const renderedHue = ok ? Math.round(ok.H) % 360 : undefined;
  if (_tryDragging) return;   // 拖动/按键中：度数读数由 onTryHueInput 当场更新

  // 游标只在"颜色不是带子自己设的"时才回位（换风格 / 手填 hex / 恢复默认 / 实时调色）。
  // 带子设的色绝不回位：管线会把色相微调（暖区最多 20°+），拿渲染色相反写游标会让
  // 方向键原地打转——1° 一档的精度就没了。
  const hexInput = document.querySelector('.input-color-group[data-index="0"] .hex-input');
  const current = hexInput ? hexInput.value.trim().toUpperCase() : '';
  if (!(_tryAppliedSeed && current === _tryAppliedSeed) && typeof renderedHue === 'number') {
    ribbon.value = renderedHue;
    _tryAppliedSeed = null;
  }
  updateTryHueReadout(Math.round(+ribbon.value), renderedHue);
}

function initTryColorBar() {
  const ribbon = document.getElementById('hue-ribbon');
  if (!ribbon) return;
  ribbon.style.background = tryColorRibbonGradient();
  _ribbonBuiltFor = currentStrategy;
  renderTryTicks();
  updateTryHueReadout(Math.round(+ribbon.value));
  ribbon.addEventListener('input', onTryHueInput);
  ribbon.addEventListener('change', function(e) {
    _tryDragging = false;
    applyTryHue(parseFloat(e.target.value));
  });
  updateTryColorUI();
}

/* ── 双向高亮：色块 ↔ 组件案例 ────────────────────── */

function setupBidirectionalHighlight() {
  document.querySelectorAll('.swatch').forEach(function(swatch) {
    swatch.addEventListener('mouseenter', function() {
      var name = this.querySelector('.name');
      if (!name) return;
      var tokenName = name.textContent.trim();
      highlightComponentForToken(tokenName);
      this.classList.add('highlight');
    });
    swatch.addEventListener('mouseleave', function() {
      clearComponentHighlight();
      this.classList.remove('highlight');
    });
  });

  var demo = document.getElementById('component-demo');
  if (!demo) return;
  demo.querySelectorAll('[data-token]').forEach(function(el) {
    el.addEventListener('mouseenter', function() {
      var tokens = this.dataset.token.split(' ');
      tokens.forEach(function(t) { highlightSwatchForToken(t); });
      this.classList.add('demo-highlight');
    });
    el.addEventListener('mouseleave', function() {
      clearSwatchHighlight();
      this.classList.remove('demo-highlight');
    });
  });
}

function highlightComponentForToken(tokenName) {
  var demo = document.getElementById('component-demo');
  if (!demo) return;
  demo.querySelectorAll('[data-token]').forEach(function(el) {
    var tokens = el.dataset.token.split(' ');
    if (tokens.indexOf(tokenName) !== -1) el.classList.add('demo-highlight');
  });
}

function clearComponentHighlight() {
  var demo = document.getElementById('component-demo');
  if (!demo) return;
  demo.querySelectorAll('.demo-highlight').forEach(function(el) { el.classList.remove('demo-highlight'); });
}

function highlightSwatchForToken(tokenName) {
  document.querySelectorAll('.swatch .name').forEach(function(nameEl) {
    if (nameEl.textContent.trim() === tokenName) {
      nameEl.closest('.swatch').classList.add('highlight');
    }
  });
}

function clearSwatchHighlight() {
  document.querySelectorAll('.swatch.highlight').forEach(function(el) { el.classList.remove('highlight'); });
}

/* ── 启动：打开即成品 ───────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  restoreState();      // 恢复上次输入与开关状态（旧值自动归一到当前阵容）
  generate(true);      // 静默初始化：立即生成并渲染完整预览，不滚动、不重置主题
  setPreviewTheme(currentPreviewTheme);   // 同步缩略图 / 比较样张的主题
  updatePreviewHint();
  initTryColorBar();   // 试色带：宜居带光谱，拖动即换色

  ['tweak-h', 'tweak-c', 'tweak-l'].forEach(function(id) {
    var slider = document.getElementById(id);
    if (slider) slider.addEventListener('input', onTweakInput);
  });

  document.getElementById('color-inputs').addEventListener('change', function(e) {
    if (e.target.matches('.hex-input, .weight-input')) { markBrandColorExplicit(); saveState(); }
  });
});
