/* ============================================================
   COLOR ENGINE CORE — 诊断 · 校正 · 色阶生成 · 主调度
   依赖：color-math.js（先加载）
   ============================================================ */

// ── OKLCH 色相分类 & 最优区间 ────────────────────────

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

// ── 中性色阶推导（亮色模式 - 拱形 C 曲线 + 文字绝对中性）───

function generateNeutralsLight(accentH) {
  const brandHue = accentH;
  const label = isWarmHue(accentH) ? '暖灰系 (Warm Gray)' : '冷灰系 (Cool Gray)';

  const levels = [
    { name: 'neutral-0',   l: 0.99, usage: '页面背景' },
    { name: 'neutral-50',  l: 0.97, usage: '卡片 / 容器背景' },
    { name: 'neutral-100', l: 0.94, usage: '悬停态背景' },
    { name: 'neutral-200', l: 0.88, usage: '边框 / 分割线' },
    { name: 'neutral-300', l: 0.68, usage: '占位文字 / 禁用态' },
    { name: 'neutral-400', l: 0.48, usage: '次要文字 / 图标' },
    { name: 'neutral-500', l: 0.26, usage: '主要文字' },
    { name: 'neutral-600', l: 0.13, usage: '标题 / 高强调文字' },
  ];

  const colors = levels.map(item => {
    let finalC = 0;
    let finalH = brandHue;

    if (item.l >= 0.90) {
      const t = (0.99 - item.l) / (0.99 - 0.90);
      finalC = lerp(0.004, 0.008, t);
    } else if (item.l >= 0.65) {
      if (item.l >= 0.88) {
        const t = (0.90 - item.l) / (0.90 - 0.88);
        finalC = lerp(0.008, 0.012, t);
      } else {
        const t = (0.88 - item.l) / (0.88 - 0.65);
        finalC = lerp(0.012, 0.008, t);
      }
    } else if (item.l >= 0.50) {
      const t = (item.l - 0.50) / (0.65 - 0.50);
      finalC = lerp(0.0, 0.008, t);
      finalH = brandHue * t;
    } else {
      finalC = 0;
      finalH = 0;
    }

    let hex = oklchToHex(item.l, finalC, finalH);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: finalC, H: finalH },
      usage: item.usage
    };
  });

  return { label, baseH: brandHue, colors };
}

// ── 中性色阶推导（暗色模式 - 品牌色温保留 + 文字绝对中性）───

function generateNeutralsDark(accentH) {
  const neutralH = accentH;

  const levels = [
    { name: 'neutral-0',   l: 0.10, usage: '暗色页面背景' },
    { name: 'neutral-50',  l: 0.14, usage: '暗色卡片 / 容器' },
    { name: 'neutral-100', l: 0.20, usage: '暗色悬停态' },
    { name: 'neutral-200', l: 0.28, usage: '暗色边框 / 分割线' },
    { name: 'neutral-300', l: 0.48, usage: '暗色占位 / 禁用' },
    { name: 'neutral-400', l: 0.68, usage: '暗色次要文字' },
    { name: 'neutral-500', l: 0.86, usage: '暗色主要文字' },
    { name: 'neutral-600', l: 0.95, usage: '暗色高强调文字' },
  ];

  return levels.map(item => {
    let finalC = 0;
    let finalH = neutralH;

    if (item.l <= 0.30) {
      const t = (item.l - 0.10) / (0.30 - 0.10);
      finalC = lerp(0.006, 0.009, t);
    } else if (item.l <= 0.55) {
      const t = (0.55 - item.l) / (0.55 - 0.30);
      finalC = lerp(0.0, 0.009, t);
      finalH = neutralH * t;
    } else {
      finalC = 0;
      finalH = 0;
    }

    let hex = oklchToHex(item.l, finalC, finalH);
    return {
      name: item.name,
      hex,
      hsl: hexToHsl(hex),
      oklch: { L: item.l, C: finalC, H: finalH },
      usage: item.usage
    };
  });
}

// ── 辅助色（同源辅助） ──────────────────────────────

function generateSecondaryLight(accentOklch) {
  const { L, C, H } = accentOklch;
  return [
    { name: 'secondary-50',  l: 0.92, c: C * 0.20, usage: '大面积辅助背景' },
    { name: 'secondary-100', l: 0.82, c: C * 0.35, usage: '卡片头部 / 信息条' },
    { name: 'secondary-200', l: 0.70, c: C * 0.50, usage: '选中态 / 标签高亮' },
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

function generateSecondaryDark(accentOklch) {
  const { L, C, H } = accentOklch;
  return [
    { name: 'secondary-50',  l: 0.18, c: C * 0.18, usage: '暗色辅助背景' },
    { name: 'secondary-100', l: 0.25, c: C * 0.25, usage: '暗色卡片头部' },
    { name: 'secondary-200', l: 0.34, c: C * 0.35, usage: '暗色选中态' },
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

function generateAdjacentLight(accentOklch) {
  const { L, C, H } = accentOklch;
  const adjH = (H + 30) % 360;
  return [
    { name: 'adjacent-50',  l: 0.92, c: C * 0.20, usage: '邻近辅助背景' },
    { name: 'adjacent-100', l: 0.80, c: C * 0.35, usage: '邻近卡片头部' },
    { name: 'adjacent-200', l: 0.68, c: C * 0.50, usage: '邻近选中态' },
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

function generateAdjacentDark(accentOklch) {
  const { L, C, H } = accentOklch;
  const adjH = (H + 30) % 360;
  return [
    { name: 'adjacent-50',  l: 0.18, c: C * 0.16, usage: '暗色邻近背景' },
    { name: 'adjacent-100', l: 0.25, c: C * 0.22, usage: '暗色邻近头部' },
    { name: 'adjacent-200', l: 0.34, c: C * 0.30, usage: '暗色邻近选中' },
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

function generateWarmContrastLight(accentOklch) {
  const { C } = accentOklch;
  const isAccentCool = !isWarmHue(accentOklch.H);
  const contrastH = isAccentCool ? 45 : 225; // 冷强调色→暖米辅助, 暖强调色→冷灰蓝辅助
  return [
    { name: 'contrast-50',  l: 0.92, c: C * 0.20, usage: '冷暖对比辅助背景' },
    { name: 'contrast-100', l: 0.80, c: C * 0.32, usage: '冷暖对比卡片头部' },
    { name: 'contrast-200', l: 0.68, c: C * 0.45, usage: '冷暖对比选中态' },
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

function generateWarmContrastDark(accentOklch) {
  const { C } = accentOklch;
  const isAccentCool = !isWarmHue(accentOklch.H);
  const contrastH = isAccentCool ? 45 : 225;
  return [
    { name: 'contrast-50',  l: 0.18, c: C * 0.14, usage: '暗色对比辅助背景' },
    { name: 'contrast-100', l: 0.25, c: C * 0.20, usage: '暗色对比卡片头部' },
    { name: 'contrast-200', l: 0.34, c: C * 0.28, usage: '暗色对比选中态' },
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
      h = (h + 32) % 360;
    }

    let baseHex = oklchToHex(l, c, h);
    let subtleHex = oklchToHex(0.95, c * 0.22, h);

    return {
      ...f,
      base: { hex: baseHex, hsl: hexToHsl(baseHex), oklch: { L: l, C: c, H: h } },
      subtle: { hex: subtleHex, hsl: hexToHsl(subtleHex), oklch: { L: 0.95, C: c * 0.22, H: h } }
    };
  });

  return adjusted.map(f => {
    let darkL = clamp(f.base.oklch.L + 0.08, 0.48, 0.65);
    let darkC = f.base.oklch.C * 0.78;
    let darkBaseHex = oklchToHex(darkL, darkC, f.base.oklch.H);
    let darkSubtleHex = oklchToHex(0.18, darkC * 0.28, f.base.oklch.H);

    return {
      ...f,
      dark: {
        base: { hex: darkBaseHex, hsl: hexToHsl(darkBaseHex), oklch: { L: darkL, C: darkC, H: f.base.oklch.H } },
        subtle: { hex: darkSubtleHex, hsl: hexToHsl(darkSubtleHex), oklch: { L: 0.18, C: darkC * 0.28, H: f.base.oklch.H } }
      }
    };
  });
}

// ── 对比度自检 ────────────────────────────────────

function verifyContrast(neutralsL, neutralsD, accentScaleL, accentScaleD) {
  // APCA 阈值: ≥75 正文, ≥60 大号文字, ≥45 非内容文字
  const checks = [];

  // 亮色模式四对
  const bgLight   = neutralsL.colors[0].hex; // 页面底
  const cardLight = neutralsL.colors[1].hex; // 卡片
  const pairs = [
    { label: '正文 on 页面底',     text: neutralsL.colors[6].hex, bg: bgLight,   mode: 'light', threshold: 75 },
    { label: '正文 on 卡片',       text: neutralsL.colors[6].hex, bg: cardLight, mode: 'light', threshold: 75 },
    { label: '次要文字 on 页面底', text: neutralsL.colors[5].hex, bg: bgLight,   mode: 'light', threshold: 75 },
    { label: '标题字 on 页面底',   text: neutralsL.colors[7].hex, bg: bgLight,   mode: 'light', threshold: 60 },
    // 暗色模式四对
    { label: '正文 on 暗底',     text: neutralsD[5].hex, bg: neutralsD[0].hex, mode: 'dark', threshold: 75 },
    { label: '正文 on 暗色卡片', text: neutralsD[5].hex, bg: neutralsD[1].hex, mode: 'dark', threshold: 75 },
    { label: '次要文字 on 暗底', text: neutralsD[4].hex, bg: neutralsD[0].hex, mode: 'dark', threshold: 75 },
    { label: '标题字 on 暗底',   text: neutralsD[7].hex, bg: neutralsD[0].hex, mode: 'dark', threshold: 60 },
  ];

  pairs.forEach(p => {
    const apca = Math.abs(calculateApca(p.text, p.bg));
    const wcag = wcagContrast(p.text, p.bg);
    const wcagPass = p.threshold === 75 ? wcag >= 4.5 : wcag >= 3.0;
    const apcaPass = apca >= p.threshold;
    checks.push({ ...p, apca, wcag, wcagPass, apcaPass, pass: wcagPass && apcaPass });
  });

  return checks;
}

// ── 多色权重评分 ────────────────────────────────────

function accentSuitability(oklch) {
  const lScore = 1 - Math.abs(oklch.L - 0.54) / 0.54;
  const cScore = Math.min(oklch.C / 0.22, 1);
  return lScore * 0.5 + cScore * 0.5;
}

// ── 主生成调度 ──────────────────────────────────────

function generate() {
  const groups = document.querySelectorAll('.input-color-group');
  const colors = [];

  groups.forEach(g => {
    const hexInput = g.querySelector('.hex-input');
    const weightInput = g.querySelector('.weight-input');
    const hex = hexInput.value.trim();
    if (!hex || !/^#[0-9a-fA-F]{6}$/.test(hex)) return;
    const oklch = hexToOklch(hex);
    if (!oklch) return;
    colors.push({
      hex,
      oklch,
      hsl: hexToHsl(hex),
      weight: parseFloat(weightInput.value) || 0,
      index: parseInt(g.dataset.index)
    });
  });

  if (colors.length === 0) { alert('请至少输入一个有效的十六进制颜色值，如 #2563EB'); return; }

  // 归一化权重
  const totalWeight = colors.reduce((s, c) => s + c.weight, 0);
  colors.forEach(c => { c.weight = totalWeight > 0 ? c.weight / totalWeight : 1 / colors.length; });

  // Step 1: 诊断
  const diagnoses = colors.map(c => ({
    ...c,
    diagnosis: diagnoseColor(c.oklch),
    suitability: accentSuitability(c.oklch)
  }));

  // Step 2: 选最佳候选
  let best = diagnoses[0];
  diagnoses.forEach(d => {
    const score = d.suitability * d.weight;
    if (score > best.suitability * best.weight) best = d;
  });

  // Step 3: 计算美丽强调色
  const accent = computeBeautifulAccent(best.oklch);

  // Step 4: 强调色阶
  const accentScaleLight = generateAccentScaleLight(accent.oklch);
  const accentScaleDark = generateAccentScaleDark(accent.oklch);

  // Step 5: 中性色
  const neutralsLight = generateNeutralsLight(accent.oklch.H);
  const neutralsDark = generateNeutralsDark(accent.oklch.H);

  // Step 6: 辅助色（同源 + 邻近 + 冷暖对比 + 灰色）
  const secondaryLight = generateSecondaryLight(accent.oklch);
  const secondaryDark = generateSecondaryDark(accent.oklch);
  const adjacentLight = generateAdjacentLight(accent.oklch);
  const adjacentDark = generateAdjacentDark(accent.oklch);
  const warmContrastLight = generateWarmContrastLight(accent.oklch);
  const warmContrastDark = generateWarmContrastDark(accent.oklch);
  const graySecondaryLight = generateGraySecondaryLight();
  const graySecondaryDark = generateGraySecondaryDark();

  // Step 7: 功能色
  const functional = generateFunctionalColors(accent.oklch.H);

  // Step 8: 文字对比色
  const textOnAccentLight = accent.textContrastOnAccent;
  const apcaDarkWhite = Math.abs(calculateApca('#FFFFFF', accentScaleDark[2].hex));
  const apcaDarkSlate = Math.abs(calculateApca('#0F172A', accentScaleDark[2].hex));
  const textOnAccentDark = apcaDarkWhite >= apcaDarkSlate ? '#FFFFFF' : '#0F172A';

  // Step 9: 对比度自检
  const contrastChecks = verifyContrast(neutralsLight, neutralsDark, accentScaleLight, accentScaleDark);

  // ── 渲染 ──
  document.getElementById('results').style.display = 'block';

  renderAnalysis(diagnoses, best, accent, contrastChecks);
  renderAccent(accentScaleLight, accentScaleDark);
  renderNeutrals(neutralsLight, neutralsDark);
  renderSecondary(secondaryLight, secondaryDark, adjacentLight, adjacentDark, warmContrastLight, warmContrastDark, graySecondaryLight, graySecondaryDark);
  renderFunctional(functional);
  renderComponents(accentScaleLight, accentScaleDark, neutralsLight, neutralsDark, functional, textOnAccentLight, textOnAccentDark, secondaryLight, secondaryDark);
  renderCSS(accentScaleLight, accentScaleDark, neutralsLight, neutralsDark, secondaryLight, secondaryDark, functional, textOnAccentLight, textOnAccentDark);
  renderTokenTable(accentScaleLight, accentScaleDark, neutralsLight, neutralsDark, secondaryLight, secondaryDark, functional, textOnAccentLight, textOnAccentDark);

  document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setPreviewTheme('light', document.querySelector('#theme-toggle .theme-toggle-btn'));
}
