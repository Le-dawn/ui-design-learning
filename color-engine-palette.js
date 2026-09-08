/* ============================================================
   COLOR ENGINE PALETTE — 色相分类 · 诊断 · 校正 · 全部色阶推导
   依赖：color-math.js（先加载）。纯函数域，不触碰 DOM。
   ============================================================ */

function getStrategyFactor(strategy) {
  var map = { restrained: 0.5, committed: 1.0, 'full-palette': 1.5, drenched: 2.0 };
  return map[strategy || resolveDesignProfile(currentDesignOptions()).strategy] || 1.0;
}
function getStrategySecondaryFactor(strategy) {
  var map = { restrained: 0.6, committed: 1.0, 'full-palette': 1.4, drenched: 1.8 };
  return map[strategy || resolveDesignProfile(currentDesignOptions()).strategy] || 1.0;
}

// 存储上次生成的强调色 OKLCH 供实时调色使用
const OKLCH_RANGES = [
  { name: '红系 (Red)',     hLo: 0,   hHi: 40,  cMin: 0.15, cMax: 0.28, cIdeal: 0.22, lMin: 0.42, lMax: 0.58, lIdeal: 0.50 },
  { name: '橙系 (Orange)',  hLo: 40,  hHi: 70,  cMin: 0.16, cMax: 0.28, cIdeal: 0.22, lMin: 0.45, lMax: 0.62, lIdeal: 0.54 },
  { name: '黄系 (Yellow)',  hLo: 70,  hHi: 110, cMin: 0.12, cMax: 0.24, cIdeal: 0.18, lMin: 0.64, lMax: 0.82, lIdeal: 0.72 },
  { name: '绿系 (Green)',   hLo: 110, hHi: 165, cMin: 0.12, cMax: 0.25, cIdeal: 0.18, lMin: 0.42, lMax: 0.58, lIdeal: 0.52 },
  { name: '青系 (Cyan)',    hLo: 165, hHi: 210, cMin: 0.12, cMax: 0.26, cIdeal: 0.18, lMin: 0.45, lMax: 0.60, lIdeal: 0.53 },
  { name: '蓝系 (Blue)',    hLo: 210, hHi: 280, cMin: 0.15, cMax: 0.28, cIdeal: 0.22, lMin: 0.42, lMax: 0.58, lIdeal: 0.50 },
  { name: '紫系 (Purple)',  hLo: 280, hHi: 320, cMin: 0.14, cMax: 0.26, cIdeal: 0.20, lMin: 0.40, lMax: 0.56, lIdeal: 0.48 },
  { name: '洋红 (Magenta)', hLo: 320, hHi: 360, cMin: 0.15, cMax: 0.28, cIdeal: 0.22, lMin: 0.42, lMax: 0.58, lIdeal: 0.50 }
];

function getOklchRange(h) {
  for (const r of OKLCH_RANGES) {
    if (h >= r.hLo && h < r.hHi) return r;
  }
  return OKLCH_RANGES[0];
}

function isWarmHue(h) {
  return (h >= 0 && h < 110) || (h >= 320 && h <= 360);
}

// ── 诊断 ────────────────────────────────────────────

function diagnoseColor(oklch) {
  const range = getOklchRange(oklch.H);
  const issues = [];

  if (oklch.C < 0.08 && oklch.L > 0.25 && oklch.L < 0.75) {
    issues.push({ type: 'muddy', severity: 'high', message: '颜色显「脏」——感知色度(Chroma)过低、视觉饱和感弱', fix: 'boost-c' });
  }
  if (oklch.C > 0.28 && oklch.L > 0.68) {
    issues.push({ type: 'fluorescent', severity: 'medium', message: '接近荧光色——感知色度与明度都过高，视觉刺激强', fix: 'reduce-c-l' });
  }
  if (oklch.L < 0.35) {
    issues.push({ type: 'too-dark', severity: 'high', message: '过深——用作强调色会「沉」入背景，缺乏 CTA 号召力', fix: 'boost-l' });
  }
  if (oklch.L > 0.80) {
    issues.push({ type: 'too-light', severity: 'high', message: '过浅——白底上缺乏足够反差，容易看不清', fix: 'reduce-l' });
  }
  if (oklch.C < 0.12 && oklch.L > 0.65) {
    issues.push({ type: 'washed-out', severity: 'low', message: '略显褪色——浅色低饱和，界面存在感偏弱', fix: 'boost-c-reduce-l' });
  }

  return { issues, range };
}

// ── 色相偏移：检测 UI 不友好的色相并微调 ──────────

const PROBLEMATIC_HUES = [
  { hLo: 20, hHi: 45,  targetH: 55,  blend: 0.40, label: '棕褐 → 琥珀方向' },
  { hLo: 75, hHi: 105, targetH: 130, blend: 0.40, label: '橄榄 → 鲜绿方向' },
  { hLo: 60, hHi: 80,  targetH: 50,  blend: 0.35, label: '芥末黄 → 暖金方向' },
  { hLo: 265,hHi: 285, targetH: 250, blend: 0.35, label: '灰紫 → 蓝紫方向' },
];

function shiftProblematicHue(h, c, l) {
  for (const zone of PROBLEMATIC_HUES) {
    if (h >= zone.hLo && h < zone.hHi && c < 0.15 && l > 0.30 && l < 0.70) {
      // 走短弧方向混合
      let diff = zone.targetH - h;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      const newH = ((h + diff * zone.blend) + 360) % 360;
      return { shifted: true, newH, reason: zone.label };
    }
  }
  return { shifted: false, newH: h, reason: null };
}

// ── 计算美丽强调色（含 C/L 校正 + 色相偏移 + APCA 寻优）───

function computeBeautifulAccent(sourceOklch) {
  const range = getOklchRange(sourceOklch.H);
  const originalHex = oklchToHex(sourceOklch.L, sourceOklch.C, sourceOklch.H);

  let targetC = sourceOklch.C;
  let targetL = sourceOklch.L;
  let targetH = sourceOklch.H;
  const adjustments = [];

  // 1. 校正 Chroma (C)
  if (sourceOklch.C < range.cMin) {
    const boost = (range.cIdeal - sourceOklch.C) * 0.72;
    targetC = sourceOklch.C + boost;
    adjustments.push({ param: 'C', from: sourceOklch.C.toFixed(2), to: targetC.toFixed(2), reason: '色度偏低，色显不够，已提升' });
  } else if (sourceOklch.C > range.cMax) {
    const reduce = (sourceOklch.C - range.cIdeal) * 0.45;
    targetC = sourceOklch.C - reduce;
    adjustments.push({ param: 'C', from: sourceOklch.C.toFixed(2), to: targetC.toFixed(2), reason: '色度偏高，适当收敛以防亮眼' });
  }

  // 2. 校正感知明度 (L)
  if (sourceOklch.L < range.lMin) {
    const boost = (range.lIdeal - sourceOklch.L) * 0.78;
    targetL = sourceOklch.L + boost;
    adjustments.push({ param: 'L', from: sourceOklch.L.toFixed(2), to: targetL.toFixed(2), reason: '明度过低，已提亮适配 UI 交互' });
  } else if (sourceOklch.L > range.lMax) {
    const reduce = (sourceOklch.L - range.lIdeal) * 0.78;
    targetL = sourceOklch.L - reduce;
    adjustments.push({ param: 'L', from: sourceOklch.L.toFixed(2), to: targetL.toFixed(2), reason: '明度过高，加深以确保基本识别度' });
  }

  // 黄色明度额外保护
  if (range.name.includes('Yellow') && targetL < 0.65) {
    targetL = 0.68;
    adjustments.push({ param: 'L', from: sourceOklch.L.toFixed(2), to: targetL.toFixed(2), reason: '黄色需保持高明度以防脏感' });
  }

  // 克制策略：强调色整体收敛（压低 C、限制 L 区间），避免干扰操作区——克制 = 整体克制
  if (currentStrategy === 'restrained') {
    targetC = targetC * 0.85;
    targetL = clamp(targetL, 0.40, 0.72);
  }

  // 物理限制 clamp
  targetC = clamp(targetC, 0.05, 0.28);
  targetL = clamp(targetL, 0.32, 0.82);

  // 2.5. 色相偏移：部分色相即使 C/L 达标在 UI 中也显"不好看"，向邻近 UI 友好方向微调
  const hueShift = shiftProblematicHue(targetH, targetC, targetL);
  if (hueShift.shifted) {
    targetH = hueShift.newH;
    adjustments.push({ param: 'H', from: sourceOklch.H.toFixed(0) + '°', to: targetH.toFixed(0) + '°', reason: hueShift.reason });
  }

  // 3. 根据感知明度 L 自适应决定前景色和背景寻优方向
  let textContrastOnAccent = '#FFFFFF';
  let finalHex = oklchToHex(targetL, targetC, targetH);

  if (targetL > 0.60) {
    textContrastOnAccent = '#0F172A';
    targetL = clamp(targetL + 0.05, 0.65, 0.78);
    finalHex = oklchToHex(targetL, targetC, targetH);
    adjustments.push({ param: 'TextTheme', from: '白字', to: '深墨灰字', reason: '感知明度偏高(L>0.60)，为确保极佳清晰度，文字自适应反转为深墨灰字' });
  } else {
    let apcaWhite = calculateApca('#FFFFFF', finalHex);
    if (Math.abs(apcaWhite) < 60) {
      let testL = targetL;
      let found = false;
      for (let step = 0; step < 8; step++) {
        testL -= 0.035;
        if (testL < Math.max(0.35, range.lMin - 0.05)) break;
        let testHex = oklchToHex(testL, targetC, targetH);
        let apcaTest = calculateApca('#FFFFFF', testHex);
        if (Math.abs(apcaTest) >= 60) {
          targetL = testL;
          finalHex = testHex;
          found = true;
          adjustments.push({ param: 'L', from: sourceOklch.L.toFixed(2), to: targetL.toFixed(2), reason: '白字对比度不足，自动二分降暗背景' });
          break;
        }
      }

      if (!found) {
        textContrastOnAccent = '#0F172A';
        targetL = clamp(targetL + 0.15, 0.65, 0.78);
        finalHex = oklchToHex(targetL, targetC, targetH);
        adjustments.push({ param: 'TextTheme', from: '白字', to: '深墨灰字', reason: '白字对比度调优失败，强制切换为深色字' });
      }
    }
  }

  // 4. 降级警告：校正后仍不理想的情况
  let fallbackWarning = null;
  if (targetL > 0.78 && textContrastOnAccent === '#0F172A') {
    fallbackWarning = '该品牌色经多次校正后明度仍偏高，作为强调色存在感偏弱，建议仅限 logo 装饰使用或手动选择替代强调色';
  }

  return {
    oklch: { L: targetL, C: targetC, H: targetH },
    hex: finalHex,
    originalHex,
    originalOklch: { ...sourceOklch },
    hsl: hexToHsl(finalHex),
    originalHsl: hexToHsl(originalHex),
    adjustments,
    hueCategory: range.name,
    textContrastOnAccent,
    fallbackWarning
  };
}

// ── 强调色阶推导（亮色模式 - 融入温差色相漂移） ──────

function generateAccentScaleLight(accentOklch) {
  const { L, C, H } = accentOklch;

  // 暖/冷目标自适应：冷色暖化走青绿，暖色暖化走黄色
  const warmTarget = H > 180 ? 150 : 60;
  const coolTarget = H > 180 ? 280 : 220;

  const getShiftedHue = (baseH, targetH, strength) => {
    let diff = targetH - baseH;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return (baseH + diff * strength + 360) % 360;
  };

  // 微色温漂移（~1/4 原幅度）：肉眼不可辨为异色，但保留高光微暖的底层感知
  const steps = [
    { name: 'accent-50',  l: 0.94, cRatio: 0.22, hueShift:  0.06, usage: '浅色背景 / 标签底' },
    { name: 'accent-100', l: 0.82, cRatio: 0.55, hueShift:  0.04, usage: '悬停态背景' },
    { name: 'accent-200', l: L,    cRatio: 1.0,  hueShift:  0.0,  usage: '主按钮 / 链接（强调色本体）' },
    { name: 'accent-300', l: L * 0.82, cRatio: 1.05, hueShift: -0.04, usage: '按压态 / 深悬停' },
    { name: 'accent-400', l: L * 0.55, cRatio: 0.75, hueShift: -0.06, usage: '深色文字 / 图标' },
  ];

  return steps.map(step => {
    let targetH = step.hueShift > 0 ? warmTarget : coolTarget;
    let finalH = getShiftedHue(H, targetH, Math.abs(step.hueShift));
    let finalC = C * step.cRatio;
    let hex = oklchToHex(step.l, finalC, finalH);

    return {
      name: step.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: step.l, C: finalC, H: finalH },
      usage: step.usage
    };
  });
}

// ── 强调色阶推导（暗色模式 - 降饱和防光晕） ──────────

function generateAccentScaleDark(accentOklch) {
  const { L, C, H } = accentOklch;

  const darkBaseC = C * 0.78;
  const darkBaseL = clamp(L * 1.10, 0.46, 0.65);

  const warmTarget = H > 180 ? 150 : 60;
  const coolTarget = H > 180 ? 280 : 220;

  const getShiftedHue = (baseH, targetH, strength) => {
    let diff = targetH - baseH;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    return (baseH + diff * strength + 360) % 360;
  };

  // 微色温漂移（暗色下幅度更收，防光晕效应叠加）
  const steps = [
    { name: 'accent-50',  l: clamp(darkBaseL * 0.35, 0.15, 0.24), cRatio: 0.40, hueShift:  0.05, usage: '暗色弱底' },
    { name: 'accent-100', l: clamp(darkBaseL * 0.60, 0.26, 0.38), cRatio: 0.70, hueShift:  0.03, usage: '暗色悬停底' },
    { name: 'accent-200', l: darkBaseL,                          cRatio: 1.0,  hueShift:  0.0,  usage: '暗色主按钮' },
    { name: 'accent-300', l: clamp(darkBaseL * 1.15, 0.55, 0.75), cRatio: 0.85, hueShift: -0.03, usage: '暗色悬停亮态' },
    { name: 'accent-400', l: clamp(darkBaseL * 1.40, 0.76, 0.88), cRatio: 0.50, hueShift: -0.05, usage: '暗色浅字 / 标签' },
  ];

  return steps.map(step => {
    let targetH = step.hueShift > 0 ? warmTarget : coolTarget;
    let finalH = getShiftedHue(H, targetH, Math.abs(step.hueShift));
    let finalC = darkBaseC * step.cRatio;
    let hex = oklchToHex(step.l, finalC, finalH);

    return {
      name: step.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: step.l, C: finalC, H: finalH },
      usage: step.usage
    };
  });
}

// ── 中性色阶推导（亮色模式 - 品牌色温贯穿全阶，文字带极淡色温）───

function generateNeutralsLight(accentH, strategy) {
  const brandHue = accentH;
  const label = isWarmHue(accentH) ? '暖灰系 (Warm Gray)' : '冷灰系 (Cool Gray)';

  const levels = [
    { name: 'neutral-0',   l: 0.985, usage: '页面背景（浅灰画布）' },
    { name: 'neutral-50',  l: 1.0,   usage: '卡片 / 容器背景（纯白浮起）' },
    { name: 'neutral-100', l: 0.975, usage: '悬停态背景' },
    { name: 'neutral-200', l: 0.88,  usage: '边框 / 分割线' },
    { name: 'neutral-300', l: 0.65,  usage: '占位文字 / 禁用态' },
    { name: 'neutral-400', l: 0.52,  usage: '次要文字 / 图标' },
    { name: 'neutral-500', l: 0.26,  usage: '主要文字' },
    { name: 'neutral-600', l: 0.13,  usage: '标题 / 高强调文字' },
  ];

  // 背景区色温峰值随策略缩放：committed ≈0.020（肉眼可辨的品牌色调），克制 ×0.5 自然变淡，drenched 封顶防过头
  const cPeak = clamp(0.020 * getStrategyFactor(strategy), 0, 0.028);
  // 文字区保留极淡品牌色温（≈Radix sand/olive 风格），整页色温同频，肉眼几乎无感
  const textC = 0.008;
  // 表面四层（画布/卡片/悬停/边框）的 C 占比：卡片纯白带极淡色温 → 边框最浓
  const bgRatios = [0.35, 0.10, 0.55, 1.0];

  const colors = levels.map((item, i) => {
    const finalC = i < 4 ? cPeak * bgRatios[i] : (i === 4 ? 0.010 : textC);
    const hex = oklchToHex(item.l, finalC, brandHue);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: finalC, H: brandHue },
      usage: item.usage
    };
  });

  return { label, baseH: brandHue, colors };
}

// ── 中性色阶推导（暗色模式 - 品牌色温贯穿全阶） ──

function generateNeutralsDark(accentH, strategy) {
  const brandHue = accentH;
  const cPeak = clamp(0.014 * getStrategyFactor(strategy), 0, 0.022);
  const textC = 0.008;

  const levels = [
    { name: 'neutral-0',   l: 0.10, usage: '暗色页面背景' },
    { name: 'neutral-50',  l: 0.14, usage: '暗色卡片 / 容器' },
    { name: 'neutral-100', l: 0.20, usage: '暗色悬停态' },
    { name: 'neutral-200', l: 0.28, usage: '暗色边框 / 分割线' },
    { name: 'neutral-300', l: 0.55, usage: '暗色占位 / 禁用' },
    { name: 'neutral-400', l: 0.74, usage: '暗色次要文字' },
    { name: 'neutral-500', l: 0.86, usage: '暗色主要文字' },
    { name: 'neutral-600', l: 0.95, usage: '暗色高强调文字' },
  ];

  // 暗色背景（最深的底色最浓）→ 边框近乎中性
  const bgRatios = [1.0, 0.67, 0.45, 0.22];

  return levels.map((item, i) => {
    const finalC = i < 4 ? cPeak * bgRatios[i] : (i === 4 ? 0.010 : textC);
    const hex = oklchToHex(item.l, finalC, brandHue);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: finalC, H: brandHue },
      usage: item.usage
    };
  });
}

// ── 辅助色（同源辅助） ──────────────────────────────

function generateSecondaryLight(accentOklch, strategy) {
  const { L, C, H } = accentOklch;
  const sf = getStrategySecondaryFactor(strategy);
  return [
    { name: 'secondary-50',  l: 0.92, c: C * 0.20 * sf, usage: '大面积辅助背景' },
    { name: 'secondary-100', l: 0.82, c: C * 0.35 * sf, usage: '卡片头部 / 信息条' },
    { name: 'secondary-200', l: 0.70, c: C * 0.50 * sf, usage: '选中态 / 标签高亮' },
  ].map(item => {
    let hex = oklchToHex(item.l, item.c, H);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: item.c, H }
    };
  });
}

function generateSecondaryDark(accentOklch, strategy) {
  const { L, C, H } = accentOklch;
  const sf = getStrategySecondaryFactor(strategy);
  return [
    { name: 'secondary-50',  l: 0.18, c: C * 0.18 * sf, usage: '暗色辅助背景' },
    { name: 'secondary-100', l: 0.25, c: C * 0.25 * sf, usage: '暗色卡片头部' },
    { name: 'secondary-200', l: 0.34, c: C * 0.35 * sf, usage: '暗色选中态' },
  ].map(item => {
    let hex = oklchToHex(item.l, item.c, H);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: item.c, H }
    };
  });
}

// ── 邻近色辅助（旋转 Hue） ───────────────────────────

function generateAdjacentLight(accentOklch, strategy) {
  const { L, C, H } = accentOklch;
  const adjH = (H + 30) % 360;
  const sf = getStrategySecondaryFactor(strategy);
  return [
    { name: 'adjacent-50',  l: 0.92, c: C * 0.20 * sf, usage: '邻近辅助背景' },
    { name: 'adjacent-100', l: 0.80, c: C * 0.35 * sf, usage: '邻近卡片头部' },
    { name: 'adjacent-200', l: 0.68, c: C * 0.50 * sf, usage: '邻近选中态' },
  ].map(item => {
    let hex = oklchToHex(item.l, item.c, adjH);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: item.c, H: adjH }
    };
  });
}

function generateAdjacentDark(accentOklch, strategy) {
  const { L, C, H } = accentOklch;
  const adjH = (H + 30) % 360;
  const sf = getStrategySecondaryFactor(strategy);
  return [
    { name: 'adjacent-50',  l: 0.18, c: C * 0.16 * sf, usage: '暗色邻近背景' },
    { name: 'adjacent-100', l: 0.25, c: C * 0.22 * sf, usage: '暗色邻近头部' },
    { name: 'adjacent-200', l: 0.34, c: C * 0.30 * sf, usage: '暗色邻近选中' },
  ].map(item => {
    let hex = oklchToHex(item.l, item.c, adjH);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: item.c, H: adjH }
    };
  });
}

// ── 冷暖对比辅助（温度反差路线） ────────────────────

function generateWarmContrastLight(accentOklch, strategy) {
  const { C } = accentOklch;
  const isAccentCool = !isWarmHue(accentOklch.H);
  const contrastH = isAccentCool ? 45 : 225;
  const sf = getStrategySecondaryFactor(strategy);
  return [
    { name: 'contrast-50',  l: 0.92, c: C * 0.20 * sf, usage: '冷暖对比辅助背景' },
    { name: 'contrast-100', l: 0.80, c: C * 0.32 * sf, usage: '冷暖对比卡片头部' },
    { name: 'contrast-200', l: 0.68, c: C * 0.45 * sf, usage: '冷暖对比选中态' },
  ].map(item => {
    let hex = oklchToHex(item.l, item.c, contrastH);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: item.c, H: contrastH }
    };
  });
}

function generateWarmContrastDark(accentOklch, strategy) {
  const { C } = accentOklch;
  const isAccentCool = !isWarmHue(accentOklch.H);
  const contrastH = isAccentCool ? 45 : 225;
  const sf = getStrategySecondaryFactor(strategy);
  return [
    { name: 'contrast-50',  l: 0.18, c: C * 0.14 * sf, usage: '暗色对比辅助背景' },
    { name: 'contrast-100', l: 0.25, c: C * 0.20 * sf, usage: '暗色对比卡片头部' },
    { name: 'contrast-200', l: 0.34, c: C * 0.28 * sf, usage: '暗色对比选中态' },
  ].map(item => {
    let hex = oklchToHex(item.l, item.c, contrastH);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: item.c, H: contrastH }
    };
  });
}

// ── 灰色路线辅助（纯中性灰分层） ────────────────────

function generateGraySecondaryLight() {
  return [
    { name: 'gray-50',  l: 0.92, c: 0, usage: '灰色辅助背景' },
    { name: 'gray-100', l: 0.82, c: 0, usage: '灰色卡片头部' },
    { name: 'gray-200', l: 0.70, c: 0, usage: '灰色选中态' },
  ].map(item => {
    let hex = oklchToHex(item.l, item.c, 0);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: item.c, H: 0 }
    };
  });
}

function generateGraySecondaryDark() {
  return [
    { name: 'gray-50',  l: 0.18, c: 0, usage: '暗色灰色辅助背景' },
    { name: 'gray-100', l: 0.25, c: 0, usage: '暗色灰色卡片头部' },
    { name: 'gray-200', l: 0.34, c: 0, usage: '暗色灰色选中态' },
  ].map(item => {
    let hex = oklchToHex(item.l, item.c, 0);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: item.c, H: 0 }
    };
  });
}

// ── 功能色（避让逻辑 + 暗色降饱和） ──────────────────

function generateFunctionalColors(accentH) {
  const funcDefs = [
    { name: 'success', h: 140, c: 0.16, l: 0.52, label: '成功' },
    { name: 'warning', h: 65,  c: 0.18, l: 0.68, label: '警告' },
    { name: 'error',   h: 25,  c: 0.20, l: 0.50, label: '错误' },
    { name: 'info',    h: 245, c: 0.18, l: 0.53, label: '信息' }
  ];

  const adjusted = funcDefs.map(f => {
    let h = f.h, c = f.c, l = f.l;
    const hDist = Math.min(Math.abs(accentH - h), 360 - Math.abs(accentH - h));
    if (hDist < 25) {
      var diff = h - accentH;
      if (diff < 0) diff += 360;
      h = diff < 180 ? (accentH + 30) % 360 : (accentH - 30 + 360) % 360;
    }

    let baseHex = oklchToHex(l, c, h);
    let subtleHex = oklchToHex(0.95, c * 0.32, h);

    return {
      ...f,
      base: { hex: baseHex, hsl: hexToHsl(baseHex), oklch: { L: l, C: c, H: h } },
      subtle: { hex: subtleHex, hsl: hexToHsl(subtleHex), oklch: { L: 0.95, C: c * 0.32, H: h } }
    };
  });

  return adjusted.map(f => {
    let darkL = clamp(f.base.oklch.L + 0.08, 0.48, 0.65);
    let darkC = f.base.oklch.C * 0.78;
    let darkBaseHex = oklchToHex(darkL, darkC, f.base.oklch.H);
    let darkSubtleHex = oklchToHex(0.18, darkC * 0.36, f.base.oklch.H);

    return {
      ...f,
      dark: {
        base: { hex: darkBaseHex, hsl: hexToHsl(darkBaseHex), oklch: { L: darkL, C: darkC, H: f.base.oklch.H } },
        subtle: { hex: darkSubtleHex, hsl: hexToHsl(darkSubtleHex), oklch: { L: 0.18, C: darkC * 0.36, H: f.base.oklch.H } }
      }
    };
  });
}

// ── 对比度自检 ────────────────────────────────────

// 共享的对比度配对定义：verifyContrast 与 Detector 的对比度规则共用同一份数据
// criteria:
//   'dual'  — WCAG 与 APCA 双达标（正文/标题这类关键阅读文本）
//   'either'— 任一达标即可（次要文字：WCAG≥4.5 或 APCA≥60，允许比正文明显浅一档，
//             形成三级文字层级而不是压平成一坨均匀的灰）
const CONTRAST_PAIRS = [
  { id: 'body-on-light-bg',      label: '正文 on 页面底',   light: true,  textIdx: 6, bgIdx: 0, wcagMin: 4.5, apcaMin: 75, criteria: 'dual' },
  { id: 'body-on-light-card',    label: '正文 on 卡片',     light: true,  textIdx: 6, bgIdx: 1, wcagMin: 4.5, apcaMin: 75, criteria: 'dual' },
  { id: 'secondary-on-light-bg', label: '次要文字 on 页面底', light: true, textIdx: 5, bgIdx: 0, wcagMin: 4.5, apcaMin: 60, criteria: 'either' },
  { id: 'muted-on-light-bg',     label: '弱化文字 on 页面底', light: true, textIdx: 4, bgIdx: 0, wcagMin: 3.0, apcaMin: 45, criteria: 'dual' },
  { id: 'heading-on-light-bg',   label: '标题字 on 页面底', light: true,  textIdx: 7, bgIdx: 0, wcagMin: 3.0, apcaMin: 60, criteria: 'dual' },
  { id: 'body-on-dark-bg',       label: '正文 on 暗底',     light: false, textIdx: 6, bgIdx: 0, wcagMin: 4.5, apcaMin: 75, criteria: 'dual' },
  { id: 'body-on-dark-card',     label: '正文 on 暗色卡片', light: false, textIdx: 6, bgIdx: 1, wcagMin: 4.5, apcaMin: 75, criteria: 'dual' },
  { id: 'secondary-on-dark-bg',  label: '次要文字 on 暗底', light: false, textIdx: 5, bgIdx: 0, wcagMin: 4.5, apcaMin: 60, criteria: 'either' },
  { id: 'muted-on-dark-bg',      label: '弱化文字 on 暗底', light: false, textIdx: 4, bgIdx: 0, wcagMin: 3.0, apcaMin: 45, criteria: 'dual' },
  { id: 'heading-on-dark-bg',    label: '标题字 on 暗底',   light: false, textIdx: 7, bgIdx: 0, wcagMin: 3.0, apcaMin: 60, criteria: 'dual' },
];

function verifyContrast(neutralsLight, neutralsDark) {
  // 三级文字层级：正文 ≥75/4.5，次要任一达标（4.5 或 60），弱化 ≥45/3.0
  return CONTRAST_PAIRS.map(p => {
    const scale = p.light ? neutralsLight.colors : neutralsDark;
    const text = scale[p.textIdx].hex;
    const bg = scale[p.bgIdx].hex;
    const apca = Math.abs(calculateApca(text, bg));
    const wcag = wcagContrast(text, bg);
    const wcagPass = wcag >= p.wcagMin;
    const apcaPass = apca >= p.apcaMin;
    const pass = p.criteria === 'either' ? (wcagPass || apcaPass) : (wcagPass && apcaPass);
    return { ...p, mode: p.light ? 'light' : 'dark', text, bg, apca, wcag, wcagPass, apcaPass, pass };
  });
}

/* ── 区域配色：策略作用于整块区域 ─────────────────────
   策略决定"哪些区域有颜色、占多大面积、前景与背景是什么关系"，
   不再只放大色阶的 C 倍数。所有前景色都在最终 Hex（含 sRGB 色域裁剪）
   上验证对比度，因此高色度、亮色、接近功能色的品牌色也有实测结论。
   区域角色：brand（品牌主区域）/ auxiliary（辅助内容区域）/ canvas（染色画布）。
   ─────────────────────────────────────────────────── */

// l = [亮色模式 L, 暗色模式 L]；cm = 品牌色 C 的倍数；c = 绝对 C；surface = 内层表面明度偏移
const REGION_SPECS = {
  restrained: {
    brand: { l: [0.968, 0.225], c: 0.012, surface: 0.022, action: 'accent' }
  },
  committed: {
    brand: { l: [0.520, 0.330], cm: 0.95, surface: 0.070 }
  },
  'full-palette': {
    brand: { l: [0.520, 0.330], cm: 0.95, surface: 0.070 },
    auxiliary: { l: [0.902, 0.212], cm: 0.30, hueShift: 32, surface: 0.040 }
  },
  drenched: {
    canvas: { l: [0.898, 0.196], cm: 0.30 },
    brand: { l: [0.430, 0.280], cm: 0.85, surface: 0.060 }
  }
};

const REGION_PLANS = {
  restrained: { canvas: false, brand: 'subtle', auxiliary: false, note: '中性画布；颜色集中在主操作与状态，不铺满区块。' },
  committed: { canvas: false, brand: 'large', auxiliary: false, note: '一个完整品牌区域承担视觉重点；其余区域保持中性。' },
  'full-palette': { canvas: false, brand: 'large', auxiliary: true, note: '品牌区域、辅助内容区域与行动色各有稳定角色。' },
  drenched: { canvas: true, brand: 'large', auxiliary: false, note: '画布本身染色，区域表面为同色系深浅。' }
};

// 区域 token 的角色顺序：名称、中文用途
const REGION_TOKEN_ROLES = [
  ['bg', '区域背景'],
  ['text', '区域正文'],
  ['text-secondary', '区域次要文字'],
  ['border', '区域边框'],
  ['surface', '区域内层表面'],
  ['action', '区域内主行动'],
  ['action-text', '区域内行动文字'],
  ['focus', '区域内焦点环']
];

function regionOklch(L, C, H) {
  return { L: clamp(L, 0, 1), C: Math.max(0, C), H: ((H % 360) + 360) % 360 };
}
function regionHex(o) { return oklchToHex(o.L, o.C, o.H); }
function regionRatio(a, b) { return wcagContrast(regionHex(a), regionHex(b)); }

// 沿明度轴把前景推离背景，直到"最终 Hex"上的对比度达标
function pushRegionContrast(fg, bg, min) {
  const dir = fg.L >= bg.L ? 1 : -1;
  let cand = regionOklch(fg.L, fg.C, fg.H);
  let ratio = regionRatio(cand, bg);
  for (let i = 0; i < 80 && ratio < min; i++) {
    cand = regionOklch(cand.L + dir * 0.012, cand.C * 0.99, cand.H);
    ratio = regionRatio(cand, bg);
    if (cand.L <= 0.004 || cand.L >= 0.996) break;
  }
  return { oklch: cand, hex: regionHex(cand), ratio: ratio, pass: ratio >= min };
}

// 区域内前景：先试同色系两极，取对比更高的一侧，必要时继续推到达标
function regionForeground(bg, hue, chroma, min) {
  const tint = Math.min(chroma * 0.18, 0.022);
  const light = pushRegionContrast(regionOklch(0.985, tint, hue), bg, min);
  const dark = pushRegionContrast(regionOklch(0.145, tint, hue), bg, min);
  return light.ratio >= dark.ratio ? light : dark;
}

// 单个区域配色：背景、前景、边框、内层表面、区域内行动与功能色
function buildRegionSet(kind, spec, accent, theme) {
  const isLight = theme === 'light';
  const idx = isLight ? 0 : 1;
  const hue = ((accent.H + (spec.hueShift || 0)) % 360 + 360) % 360;
  const chroma = (spec.c != null ? spec.c : accent.C * spec.cm) * (isLight ? 1 : 0.82);

  const bg = regionOklch(spec.l[idx], chroma, hue);
  const text = regionForeground(bg, hue, chroma, 4.5);

  // 次要文字从区域前景与背景的关系推导：向背景靠一档，仍要求 WCAG≥4.5 或 APCA≥60
  const towardsBg = text.oklch.L >= bg.L ? -0.16 : 0.16;
  const secStart = regionOklch(text.oklch.L + towardsBg, Math.min(chroma * 0.5, 0.03), hue);
  const secWcag = regionRatio(secStart, bg);
  const secApca = Math.abs(calculateApca(regionHex(secStart), regionHex(bg)));
  const secondary = (secWcag >= 4.5 || secApca >= 60)
    ? { oklch: secStart, hex: regionHex(secStart), ratio: secWcag, apca: secApca, pass: true, tier: secWcag >= 4.5 ? 'wcag' : 'apca' }
    : (() => { const p = pushRegionContrast(secStart, bg, 4.5); return { ...p, apca: Math.abs(calculateApca(p.hex, regionHex(bg))), tier: 'pushed' }; })();

  const borderStart = regionOklch(bg.L + (text.oklch.L >= bg.L ? 0.14 : -0.14), Math.min(chroma * 0.6, 0.04), hue);
  const border = pushRegionContrast(borderStart, bg, 1.6);

  const surfaceOffset = spec.surface != null ? spec.surface : 0.035;
  const surface = regionOklch(clamp(bg.L + surfaceOffset, 0.02, 0.996), chroma * 0.92, hue);

  // 区域内主行动：品牌区域优先用与背景分离的表面色，克制策略保留品牌强调色
  const actionTint = Math.min(chroma * 0.15, 0.02);
  const actionCandidates = spec.action === 'accent'
    ? [{ source: '品牌强调色', o: regionOklch(accent.L, accent.C, accent.H) }, { source: '区域内深色表面', o: regionOklch(0.150, actionTint, hue) }]
    : (bg.L < 0.62
      ? [{ source: '区域内浅色表面', o: regionOklch(0.985, actionTint, hue) }, { source: '区域内深色表面', o: regionOklch(0.150, actionTint, hue) }, { source: '品牌强调色', o: regionOklch(accent.L, accent.C, accent.H) }]
      : [{ source: '区域内深色表面', o: regionOklch(0.150, actionTint, hue) }, { source: '区域内浅色表面', o: regionOklch(0.985, actionTint, hue) }, { source: '品牌强调色', o: regionOklch(accent.L, accent.C, accent.H) }]);
  let action = null;
  for (const c of actionCandidates) {
    const r = pushRegionContrast(c.o, bg, 3.0);
    if (r.pass) { action = { ...r, source: c.source }; break; }
  }
  if (!action) { const r = pushRegionContrast(regionOklch(bg.L > 0.5 ? 0.05 : 0.95, 0, hue), bg, 3.0); action = { ...r, source: '区域外极值表面' }; }
  const actionText = regionForeground(action.oklch, hue, Math.min(chroma * 0.4, 0.03), 4.5);

  // 功能色在染色区域中仍要能区分：保留色相语义，只在区域底色上调整明度
  const functional = {};
  generateFunctionalColors(hue).forEach(f => {
    const base = isLight ? f.base : f.dark.base;
    const pushed = pushRegionContrast(base.oklch, bg, 3.0);
    functional[f.name] = { hex: pushed.hex, ratio: pushed.ratio, pass: pushed.pass };
  });

  return {
    kind: kind, theme: theme, hue: hue,
    bg: { oklch: bg, hex: regionHex(bg) },
    text: text,
    textSecondary: secondary,
    border: border,
    surface: { oklch: surface, hex: regionHex(surface) },
    action: action,
    actionText: actionText,
    focus: { hex: action.hex, ratio: action.ratio, pass: action.pass },
    functional: functional
  };
}

function generateRegionColors(accentOklch, strategy) {
  const key = REGION_SPECS[strategy] ? strategy : 'committed';
  const specs = REGION_SPECS[key];
  const themes = {};
  ['light', 'dark'].forEach(theme => {
    themes[theme] = {};
    Object.keys(specs).forEach(kind => {
      themes[theme][kind] = buildRegionSet(kind, specs[kind], accentOklch, theme);
    });
  });
  return { strategy: key, plan: REGION_PLANS[key], areaNote: REGION_PLANS[key].note, themes: themes };
}

// 区域 token：普通区域继续用基础 tokens，进入区域后由局部映射切换语义
// 染色区域额外携带功能色，保证成功/警告/错误在彩色底上仍能区分
function buildRegionTokens(regions) {
  const tokens = [];
  if (!regions) return tokens;
  Object.keys(regions.themes.light).forEach(kind => {
    REGION_TOKEN_ROLES.forEach(role => {
      const key = role[0].replace(/-([a-z])/g, (m, c) => c.toUpperCase());
      const light = regions.themes.light[kind][key];
      const dark = regions.themes.dark[kind][key];
      if (!light) return;
      tokens.push({
        name: '--region-' + kind + '-' + role[0],
        light: light.hex,
        dark: dark ? dark.hex : light.hex,
        usage: light.source ? light.source : role[1],
        group: 'region'
      });
    });
    // 近中性表面沿用基础功能色；只有真正染色的区域才需要单独一档
    if (regions.themes.light[kind].bg.oklch.C <= 0.03) return;
    ['success', 'warning', 'error', 'info'].forEach(name => {
      const light = regions.themes.light[kind].functional[name];
      const dark = regions.themes.dark[kind].functional[name];
      tokens.push({
        name: '--region-' + kind + '-' + name,
        light: light.hex,
        dark: dark.hex,
        usage: '区域内' + { success: '成功', warning: '警告', error: '错误', info: '信息' }[name] + '状态色',
        group: 'region'
      });
    });
  });
  return tokens;
}

// ── 多色权重评分 ────────────────────────────────────

