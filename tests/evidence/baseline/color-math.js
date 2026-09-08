/* ============================================================
   COLOR MATH — OKLCH ↔ RGB ↔ Hex 转换及 APCA 对比度引擎
   ============================================================ */

// ── 核心 Gamma 校正与反校正 ────────────────────────

function srgbToLinear(c) {
  let v = c / 255;
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c) {
  let v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.max(0, Math.min(255, Math.round(v * 255)));
}

// ── 线性 RGB ↔ Oklab ──────────────────────────────

function rgbToOklab(r, g, b) {
  let lr = srgbToLinear(r);
  let lg = srgbToLinear(g);
  let lb = srgbToLinear(b);

  let l = lr * 0.4122214708 + lg * 0.5363325363 + lb * 0.0514459929;
  let m = lr * 0.2119034982 + lg * 0.6806995478 + lb * 0.1073969540;
  let s = lr * 0.0883024619 + lg * 0.2817188376 + lb * 0.6299787005;

  let l_ = Math.cbrt(l);
  let m_ = Math.cbrt(m);
  let s_ = Math.cbrt(s);

  let oklabL = l_ * 0.2104542553 + m_ * 0.7936177850 - s_ * 0.0040720468;
  let oklabA = l_ * 1.9779984951 - m_ * 2.4285922050 + s_ * 0.4505937099;
  let oklabB = l_ * 0.0259040371 + m_ * 0.7827717662 - s_ * 0.8086757660;

  return { L: oklabL, a: oklabA, b: oklabB };
}

function oklabToRgb(L, a, b) {
  let l_ = L + a * 0.3963377774 + b * 0.2158037573;
  let m_ = L - a * 0.1055613458 - b * 0.0638541728;
  let s_ = L - a * 0.0894841775 - b * 1.2914855480;

  let l = l_ * l_ * l_;
  let m = m_ * m_ * m_;
  let s = s_ * s_ * s_;

  let lr = l * 4.0767416621 - m * 3.3077115913 + s * 0.2309699292;
  let lg = -l * 1.2684380046 + m * 2.6097574011 - s * 0.3413193965;
  let lb = -l * 0.0041960863 - m * 0.7034186147 + s * 1.7076147010;

  return {
    r: linearToSrgb(lr),
    g: linearToSrgb(lg),
    b: linearToSrgb(lb)
  };
}

// ── Oklab ↔ OKLCH ──────────────────────────────────

function oklabToOklch(L, a, b) {
  let C = Math.sqrt(a * a + b * b);
  let H = C > 0.0001 ? Math.atan2(b, a) * (180 / Math.PI) : 0;
  if (H < 0) H += 360;
  return { L, C, H };
}

function oklchToOklab(L, C, H) {
  let hRad = H * (Math.PI / 180);
  let a = C * Math.cos(hRad);
  let b = C * Math.sin(hRad);
  return { L, a, b };
}

// ── Hex ↔ RGB ──────────────────────────────────────

function hexToRgb(hex) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  if (!r) return null;
  return { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) };
}

function rgbToHex(r, g, b) {
  const toHex = n => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
}

// ── Hex ↔ OKLCH ────────────────────────────────────

function hexToOklch(hex) {
  let rgb = hexToRgb(hex);
  if (!rgb) return null;
  let lab = rgbToOklab(rgb.r, rgb.g, rgb.b);
  return oklabToOklch(lab.L, lab.a, lab.b);
}

// 将 OKLCH 转换为 Hex（集成保明度和色相的 Chroma 色域裁剪二分算法）
function oklchToHex(L, C, H) {
  let lab = oklchToOklab(L, C, H);
  let rgb = oklabToRgb(lab.L, lab.a, lab.b);

  // 如果在 sRGB 色域内，直接输出
  if (rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255) {
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  }

  // 二分查找限制 Chroma，保持感知明度 L 和色相 H 绝对对齐
  let lowC = 0;
  let highC = C;
  let bestRgb = { r: 128, g: 128, b: 128 };

  for (let i = 0; i < 12; i++) {
    let midC = (lowC + highC) / 2;
    let testLab = oklchToOklab(L, midC, H);
    let testRgb = oklabToRgb(testLab.L, testLab.a, testLab.b);

    if (testRgb.r >= 0 && testRgb.r <= 255 && testRgb.g >= 0 && testRgb.g <= 255 && testRgb.b >= 0 && testRgb.b <= 255) {
      bestRgb = testRgb;
      lowC = midC;
    } else {
      highC = midC;
    }
  }

  return rgbToHex(bestRgb.r, bestRgb.g, bestRgb.b);
}

// ── Hex ↔ HSL（保留用于兼容显示）─────────────────────

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  return rgbToHsl(rgb.r, rgb.g, rgb.b);
}

// ── APCA 视觉对比度计算器 (WCAG 3.0 感知规范) ────────

function calculateApca(txtHex, bgHex) {
  let txtRgb = hexToRgb(txtHex);
  let bgRgb = hexToRgb(bgHex);
  if (!txtRgb || !bgRgb) return 0;

  let yTxt = 0.2126729 * srgbToLinear(txtRgb.r) + 0.7151522 * srgbToLinear(txtRgb.g) + 0.0721750 * srgbToLinear(txtRgb.b);
  let yBg = 0.2126729 * srgbToLinear(bgRgb.r) + 0.7151522 * srgbToLinear(bgRgb.g) + 0.0721750 * srgbToLinear(bgRgb.b);

  // 阈值处理，防止超暗颜色对比度计算失真
  let yTxtClamped = yTxt > 0.022 ? yTxt : yTxt + Math.pow(0.022 - yTxt, 1.414);
  let yBgClamped = yBg > 0.022 ? yBg : yBg + Math.pow(0.022 - yBg, 1.414);

  let contrast = 0;

  // APCA 核心对比度公式 (不对称极性计算)
  if (yBgClamped > yTxtClamped) {
    contrast = (Math.pow(yBgClamped, 0.56) - Math.pow(yTxtClamped, 0.62)) * 161.8;
  } else {
    contrast = (Math.pow(yBgClamped, 0.62) - Math.pow(yTxtClamped, 0.56)) * 161.8;
  }

  if (Math.abs(contrast) < 7.5) return 0;
  return contrast;
}

// ── WCAG 2.1 对比度 ────────────────────────────────

function wcagContrast(hex1, hex2) {
  const rgb1 = hexToRgb(hex1), rgb2 = hexToRgb(hex2);
  if (!rgb1 || !rgb2) return 0;
  const l1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
  const lighter = Math.max(l1, l2), darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// ── 通用数学工具 ────────────────────────────────────

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function lerp(a, b, t) { return a + (b - a) * t; }
