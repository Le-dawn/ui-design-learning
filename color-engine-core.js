/* ============================================================
   COLOR ENGINE CORE — 状态 · 实时调色 · 主调度（唯一管线入口）
   依赖：color-math.js, color-engine-palette.js（先加载，运行时引用）
   ============================================================ */

let currentStrategy = 'committed'; // 'restrained' | 'committed' | 'full-palette' | 'drenched'

let lastAccentOklch = null;

function retweak(hOverride, cOverride, lOverride) {
  if (!lastAccentOklch) return;

  // 与生成路径一致的物理约束：防止 L 顶到 0.82 与 accent-100 平级、C 越界产生荧光
  const tweakedOklch = {
    L: clamp(lOverride !== undefined ? lOverride : lastAccentOklch.L, 0.30, 0.80),
    C: clamp(cOverride !== undefined ? cOverride : lastAccentOklch.C, 0.05, 0.28),
    H: (((hOverride !== undefined ? hOverride : lastAccentOklch.H) % 360) + 360) % 360
  };

  // 滑块与标签同步到 clamp 后的实际值
  syncTweakSliders(tweakedOklch);

  // 重新构建 accent 对象（不含原始诊断信息）
  const tweakedHex = oklchToHex(tweakedOklch.L, tweakedOklch.C, tweakedOklch.H);
  const tweakedAccent = {
    oklch: tweakedOklch,
    hex: tweakedHex,
    originalHex: tweakedHex,
    originalOklch: { ...tweakedOklch },
    hsl: hexToHsl(tweakedHex),
    originalHsl: hexToHsl(tweakedHex),
    adjustments: [{ param: 'Manual', from: '', to: '', reason: '实时滑块微调' }],
    hueCategory: getOklchRange(tweakedOklch.H).name,
    textContrastOnAccent: tweakedOklch.L > 0.60 ? '#0F172A' : '#FFFFFF',
    fallbackWarning: null
  };

  // 完整重建色彩系统并渲染（间距保持上次生成值）
  const sys = computeSystem(tweakedOklch, { textOnAccentLight: tweakedAccent.textContrastOnAccent });
  renderSystem(sys, window._lastSpaceScale || [], window._lastSpaceSemantics || []);

  // 更新分析区强调色信息（按 id 定位，不再误写多色选择区块）
  const accentDetail = document.getElementById('accent-detail');
  if (accentDetail) accentDetail.innerHTML = accentDetailHTML(tweakedAccent, 'tweak');

  // 重跑 Detector，保证实时调色后自检结果不过期
  const detectorResults = runDetector(buildDetectorCtx(tweakedAccent, sys, window._lastSpaceScale || [], window._lastSpaceSemantics || []));
  renderDetectorSummary(detectorResults);

  // 渲染重建了 DOM 节点，色块↔组件双向高亮需重新绑定
  setupBidirectionalHighlight();
}

// ── 分析区「强调色」明细（generate 与 retweak 共用） ──

function accentDetailHTML(accent, mode) {
  let html = '品牌色 ' + escapeHtml(accent.originalHex) +
    '（L:' + accent.originalOklch.L.toFixed(2) + ' C:' + accent.originalOklch.C.toFixed(3) + ' H:' + Math.round(accent.originalOklch.H) + '°）➔ 强调色 ' + escapeHtml(accent.hex) +
    '（L:' + accent.oklch.L.toFixed(2) + ' C:' + accent.oklch.C.toFixed(3) + ' H:' + Math.round(accent.oklch.H) + '°）<br>' +
    '<span class="desc">色相划分：' + escapeHtml(accent.hueCategory) + (mode === 'tweak' ? ' · 实时滑块微调模式' : '') + '</span>';

  if (accent.adjustments.length > 0) {
    accent.adjustments.forEach(a => {
      html += '<br><span style="color:var(--ui-accent)">↳ ' + escapeHtml(a.reason) + '：' + escapeHtml(a.param) + ' 的参数更新了（' + escapeHtml(a.from) + ' → ' + escapeHtml(a.to) + '）</span>';
    });
  } else {
    html += '<br><span style="color:var(--color-success)">↳ 品牌色各项参数已在最优感知区间，无需任何调整</span>';
  }

  html += '<br><span style="color:var(--ui-accent)">↳ 交互文字安全：亮色模式下，主按钮建议搭配 ' +
    (accent.textContrastOnAccent === '#FFFFFF' ? '白字 (#FFFFFF)' : '深墨灰字 (#0F172A)') +
    ' 以确保通过对比度安全校验</span>';

  if (accent.fallbackWarning) {
    html += '<br><span style="color:var(--color-error)">⚠ ' + escapeHtml(accent.fallbackWarning) + '</span>';
  }
  return html;
}

function setStrategy(val, btn) {
  currentStrategy = val;
  var btns = document.querySelectorAll('#strategy-toggle .theme-toggle-btn');
  btns.forEach(function(b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  if (typeof generate === 'function') generate(true); // 静默：不滚动、不重置预览主题
}

// ── OKLCH 色相分类 & 最优区间 ────────────────────────

function accentSuitability(oklch) {
  const lScore = 1 - Math.abs(oklch.L - 0.54) / 0.54;
  const cScore = Math.min(oklch.C / 0.22, 1);
  return lScore * 0.5 + cScore * 0.5;
}

// ── 色彩系统计算（generate 与 retweak 共用的唯一管线） ──

function computeSystem(accentOklch, opts) {
  // 物理约束保护：与 computeBeautifulAccent 的 clamp 一致，
  // 防止实时调色拖出破坏色阶单调性（accent-100 固定 L=0.82）或荧光感的越界值
  const ok = {
    L: clamp(accentOklch.L, 0.30, 0.80),
    C: clamp(accentOklch.C, 0.05, 0.28),
    H: ((accentOklch.H % 360) + 360) % 360
  };

  const accentScaleLight = generateAccentScaleLight(ok);
  const accentScaleDark = generateAccentScaleDark(ok);
  const neutralsLight = generateNeutralsLight(ok.H);
  const neutralsDark = generateNeutralsDark(ok.H);
  const secondaryLight = generateSecondaryLight(ok);
  const secondaryDark = generateSecondaryDark(ok);
  const adjacentLight = generateAdjacentLight(ok);
  const adjacentDark = generateAdjacentDark(ok);
  const warmContrastLight = generateWarmContrastLight(ok);
  const warmContrastDark = generateWarmContrastDark(ok);
  const graySecondaryLight = generateGraySecondaryLight();
  const graySecondaryDark = generateGraySecondaryDark();
  const functional = generateFunctionalColors(ok.H);

  // 渐变搭档色 accent-2：冷色向紫(+40°)、暖色向红(-40°)，与主色同 C/L，构成品牌渐变对
  const accent2H = ((ok.H + (ok.H >= 180 ? 40 : -40)) + 360) % 360;
  const accent2DarkL = clamp(ok.L * 1.10, 0.46, 0.65);
  const accent2 = {
    light: { oklch: { L: ok.L, C: ok.C, H: accent2H }, hex: oklchToHex(ok.L, ok.C, accent2H) },
    dark: { oklch: { L: accent2DarkL, C: ok.C * 0.78, H: accent2H }, hex: oklchToHex(accent2DarkL, ok.C * 0.78, accent2H) }
  };

  // 浮层表面：亮色与卡片同白（深度交给阴影 shadow-md/lg），暗色比卡片更亮
  // 表面色温峰值随策略缩放（克制 ×0.5 自然得到"产品级"淡色温）
  const raisedCLight = 0.10 * clamp(0.020 * getStrategyFactor(), 0, 0.028);
  const raisedCDark = 0.5 * clamp(0.014 * getStrategyFactor(), 0, 0.022);
  const surfaceRaised = {
    light: { oklch: { L: 1.0, C: raisedCLight, H: ok.H }, hex: oklchToHex(1.0, raisedCLight, ok.H) },
    dark: { oklch: { L: 0.17, C: raisedCDark, H: ok.H }, hex: oklchToHex(0.17, raisedCDark, ok.H) }
  };

  // 亮色文字色由调用方传入（生成路径带 APCA 寻优，调色路径用简单 L 阈值）
  const textOnAccentLight = opts && opts.textOnAccentLight
    ? opts.textOnAccentLight
    : (ok.L > 0.60 ? '#0F172A' : '#FFFFFF');
  const apcaDarkWhite = Math.abs(calculateApca('#FFFFFF', accentScaleDark[2].hex));
  const apcaDarkSlate = Math.abs(calculateApca('#0F172A', accentScaleDark[2].hex));
  const textOnAccentDark = apcaDarkWhite >= apcaDarkSlate ? '#FFFFFF' : '#0F172A';

  const contrastChecks = verifyContrast(neutralsLight, neutralsDark);

  return {
    accentOklch: ok,
    accentScaleLight, accentScaleDark,
    neutralsLight, neutralsDark,
    secondaryLight, secondaryDark,
    adjacentLight, adjacentDark,
    warmContrastLight, warmContrastDark,
    graySecondaryLight, graySecondaryDark,
    functional,
    accent2, surfaceRaised,
    textOnAccentLight, textOnAccentDark,
    contrastChecks
  };
}

// ── Detector 上下文组装 ─────────────────────────────

function buildDetectorCtx(accent, sys, spaceScale, spaceSemantics) {
  return {
    accent: accent,
    accentScaleLight: sys.accentScaleLight,
    accentScaleDark: sys.accentScaleDark,
    neutralsLight: sys.neutralsLight,
    neutralsDark: sys.neutralsDark,
    functional: sys.functional,
    accent2: sys.accent2,
    surfaceRaised: sys.surfaceRaised,
    contrastChecks: sys.contrastChecks,
    spaceScale: spaceScale,
    spaceSemantics: spaceSemantics
  };
}

// ── 渲染统一入口（Token 单一数据源派生） ─────────────

function renderSystem(sys, spaceScale, spaceSemantics) {
  const tokens = buildTokenMap(sys, spaceScale, spaceSemantics);
  renderAccent(sys.accentScaleLight, sys.accentScaleDark);
  renderNeutrals(sys.neutralsLight, sys.neutralsDark);
  renderSecondary(sys.secondaryLight, sys.secondaryDark, sys.adjacentLight, sys.adjacentDark, sys.warmContrastLight, sys.warmContrastDark, sys.graySecondaryLight, sys.graySecondaryDark);
  renderFunctional(sys.functional);
  renderComponents(tokens);
  renderExport(sys, tokens);
  renderTokenTable(tokens);
}

// ── 主生成调度 ──────────────────────────────────────

function generate(silent) {
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
  lastAccentOklch = { L: accent.oklch.L, C: accent.oklch.C, H: accent.oklch.H };

  // Step 4-9: 完整色彩系统（唯一管线）
  const sys = computeSystem(accent.oklch, { textOnAccentLight: accent.textContrastOnAccent });

  // Step 10: 间距系统生成
  const spaceScale = generateSpaceScale(spaceBaseUnit);
  const spaceSemantics = generateSpaceSemanticTokens(spaceScale);
  window._lastSpaceScale = spaceScale;
  window._lastSpaceSemantics = spaceSemantics;

  // Step 11: Detector 全量自检
  const detectorResults = runDetector(buildDetectorCtx(accent, sys, spaceScale, spaceSemantics));

  // ── 渲染 ──
  document.getElementById('results').style.display = 'block';

  renderAnalysis(diagnoses, best, accent, sys.contrastChecks, detectorResults);
  renderSystem(sys, spaceScale, spaceSemantics);
  renderSpaceScale(spaceScale);
  renderSpaceSemantics(spaceSemantics);

  // 只有用户显式点击「生成」才滚动并重置预览主题；开关切换 / 初始化静默执行
  if (!silent) {
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    setPreviewTheme('light', document.querySelector('#theme-toggle .theme-toggle-btn'));
  }

  // 初始化实时调色滑块并绑定事件
  if (typeof initTweakSliders === 'function') initTweakSliders(lastAccentOklch);
  if (typeof setupBidirectionalHighlight === 'function') setupBidirectionalHighlight();
  // 策略/间距基准状态行（开关切换走 generate，这里统一刷新反馈）
  if (typeof updateTweakContext === 'function') updateTweakContext();

  // 持久化当前输入与开关状态
  if (typeof saveState === 'function') saveState();
}
