/* ============================================================
   COLOR ENGINE INTERACT — 交互 · Logo 取色 · 持久化 · 全屏 · 启动
   依赖：全部引擎脚本（最后加载，注册 DOMContentLoaded 启动）
   ============================================================ */

let currentPreviewTheme = 'light';

function setPreviewTheme(theme, btn) {
  currentPreviewTheme = theme;
  const card = document.getElementById('comp-preview-card');
  if (card) card.setAttribute('data-theme', theme);
  const overlay = document.getElementById('fullscreen-overlay');
  if (overlay) overlay.setAttribute('data-theme', theme);

  // 同步两个工具栏（示例区 + 全屏浮层）的激活态，btn 可能为 null（generate 静默调用）
  document.querySelectorAll('#theme-toggle .theme-toggle-btn, #fs-theme-toggle .theme-toggle-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
  });
}

// ── 全屏预览：克隆当前示例到固定覆盖层，占满整个视口 ──

function openFullscreenPreview() {
  const overlay = document.getElementById('fullscreen-overlay');
  const demo = document.getElementById('component-demo');
  if (!overlay || !demo) return;

  document.getElementById('fullscreen-demo').innerHTML = demo.innerHTML;
  overlay.setAttribute('data-theme', currentPreviewTheme);
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // 锁住主页面滚动
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

// ── Token 单一数据源 ────────────────────────────────
// buildTokenMap 产出唯一的 token 定义；组件 Demo 变量、CSS 导出、对照表全部从这里派生，
// 避免同一映射维护三份拷贝后互相不一致

function copyCSS() {
  const code = document.getElementById('css-code').textContent;
  const showFeedback = () => {
    const btn = document.querySelector('.copy-btn');
    const orig = btn.textContent;
    btn.textContent = '✓ 已复制!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  };
  // 降级方案：clipboard API 不可用（file:// 等环境）时用 execCommand 兜底
  const fallbackCopy = () => {
    const ta = document.createElement('textarea');
    ta.value = code;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); showFeedback(); } catch (e) { alert('复制失败，请手动选择代码复制'); }
    ta.remove();
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(showFeedback, fallbackCopy);
  } else {
    fallbackCopy();
  }
}

function syncHexInput(colorPicker) {
  const group = colorPicker.closest('.input-color-group');
  const hexInput = group.querySelector('.hex-input');
  hexInput.value = colorPicker.value;
}

function syncColorPicker(hexInput) {
  const val = hexInput.value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    const group = hexInput.closest('.input-color-group');
    const colorPicker = group.querySelector('input[type="color"]');
    colorPicker.value = val;
  }
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
  container.appendChild(createColorGroup(existing.length, '#E5E7EB', ''));
}

// ── 输入与开关状态持久化 ─────────────────────────────

const STORAGE_KEY = 'color-engine-state-v1';

function saveState() {
  try {
    const groups = Array.from(document.querySelectorAll('.input-color-group')).map(g => ({
      hex: g.querySelector('.hex-input').value,
      weight: g.querySelector('.weight-input').value
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      groups,
      register: currentRegister,
      strategy: currentStrategy,
      baseUnit: spaceBaseUnit,
      demoType: currentDemoType,
      demoStyle: currentDemoStyle
    }));
  } catch (e) { /* localStorage 不可用（隐私模式等）时静默跳过 */ }
}

function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const s = JSON.parse(raw);
    if (!s || !Array.isArray(s.groups) || s.groups.length === 0) return false;
    if (!s.groups.every(g => /^#[0-9a-fA-F]{6}$/.test(g.hex))) return false;

    const container = document.getElementById('color-inputs');
    container.innerHTML = '';
    s.groups.forEach((g, i) => container.appendChild(createColorGroup(i, g.hex, g.weight)));

    if (s.register === 'brand' || s.register === 'product') currentRegister = s.register;
    if (['restrained', 'committed', 'full-palette', 'drenched'].indexOf(s.strategy) !== -1) currentStrategy = s.strategy;
    if (s.baseUnit === 4 || s.baseUnit === 8) spaceBaseUnit = s.baseUnit;
    if (s.demoType === 'landing' || s.demoType === 'app') currentDemoType = s.demoType;
    if (['spectrum', 'standard', 'soft', 'glass', 'editorial'].indexOf(s.demoStyle) !== -1) currentDemoStyle = s.demoStyle;
    applyToggleState();
    return true;
  } catch (e) { return false; }
}

function applyToggleState() {
  const setActive = (selector, val) => {
    document.querySelectorAll(selector).forEach(b => b.classList.toggle('active', b.dataset.val === String(val)));
  };
  setActive('#register-toggle .theme-toggle-btn', currentRegister);
  setActive('#strategy-toggle .theme-toggle-btn', currentStrategy);
  setActive('#base-unit-toggle .theme-toggle-btn', spaceBaseUnit);
  setActive('#demo-type-toggle .theme-toggle-btn', currentDemoType);
  setActive('#demo-style-toggle .theme-toggle-btn', currentDemoStyle);
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
}

// ── Logo 取色 ──────────────────────────────────────

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

  // Build color list, merge close colors
  let colors = [];
  for (const [, v] of colorMap) {
    colors.push({
      hex: '#' + [Math.round(v.sr/v.count), Math.round(v.sg/v.count), Math.round(v.sb/v.count)].map(n => n.toString(16).padStart(2,'0')).join(''),
      pct: (v.count / total) * 100
    });
  }

  // Merge similar colors（OKLab 感知距离，阈值 0.06 ≈ 肉眼几乎无差）
  const merged = mergeExtractedColors(colors, 0.06);
  merged.sort((a, b) => b.pct - a.pct);
  const top = merged.filter(c => c.pct >= 1).slice(0, 4);

  autoFillFromLogo(top);
}

// ── OKLab 辅助（OKLCH 已有转换，这里只做距离与混合） ──

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
        // 按面积占比做 OKLab 加权混合，感知上比 RGB 平均更接近人眼观感
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

  // Remove existing color groups except the first
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

  // Trigger generate
  if (typeof generate === 'function') generate();
}

// ── 实时调色滑块 ────────────────────────────────────

var _tweakTimer = null;
var _tweakDirty = false;
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
}

function onTweakInput() {
  _tweakDirty = true;
  var h = parseFloat(document.getElementById('tweak-h').value);
  var c = parseFloat(document.getElementById('tweak-c').value);
  var l = parseFloat(document.getElementById('tweak-l').value);
  updateTweakLabels(h, c, l);
  var statusEl = document.getElementById('tweak-status');
  if (statusEl) statusEl.textContent = '调整中...';

  if (_tweakTimer) clearTimeout(_tweakTimer);
  _tweakTimer = setTimeout(function() {
    if (typeof retweak === 'function') {
      retweak(h, c, l);
    }
    if (statusEl) statusEl.textContent = '';
    _tweakDirty = false;
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

// ── 双向高亮：色块 ↔ 组件案例 ──────────────────────

function setupBidirectionalHighlight() {
  // 色块 hover → 组件高亮
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

  // 组件元素 hover → 色块高亮
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

// ── 启动 ────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  restoreState(); // 恢复上次输入与开关状态（直接设置变量，不触发 generate）

  generate(true); // 静默初始化：不滚动、不重置预览主题

  // 绑定实时调色滑块事件
  ['tweak-h', 'tweak-c', 'tweak-l'].forEach(function(id) {
    var slider = document.getElementById(id);
    if (slider) slider.addEventListener('input', onTweakInput);
  });

  // 手动编辑色值/权重后自动保存（回车或失焦触发）
  document.getElementById('color-inputs').addEventListener('change', function(e) {
    if (e.target.matches('.hex-input, .weight-input')) saveState();
  });
});

