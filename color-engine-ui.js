/* ============================================================
   COLOR ENGINE UI — 渲染函数 · 交互逻辑
   依赖：color-math.js, color-engine-core.js（先加载）
   ============================================================ */

// ── 通用 Swatch HTML ────────────────────────────────

function swatchHTML(item) {
  return `
    <div class="swatch">
      <div class="swatch-preview" style="background:${item.hex}"></div>
      <div class="swatch-info">
        <div class="name">${item.name}</div>
        <div class="hex">${item.hex}</div>
        <div class="hsl-label">L:${item.oklch.L.toFixed(2)} C:${item.oklch.C.toFixed(3)} H:${Math.round(item.oklch.H)}&deg;</div>
        ${item.usage ? `<div class="hsl-label" style="margin-top:1px">${item.usage}</div>` : ''}
      </div>
    </div>`;
}

// ── 分析诊断渲染 ────────────────────────────────────

function renderAnalysis(diagnoses, best, accent, contrastChecks) {
  let html = '';

  if (diagnoses.length > 1) {
    html += `<div class="analysis-item">
      <span class="icon">🎯</span>
      <div class="detail">
        从 ${diagnoses.length} 个品牌色中选出「${best.hex}」作为主强调色候选者<br>
        <span class="desc">选择依据：感知适合度 ${(best.suitability * 100).toFixed(0)}% × 权重 ${(best.weight * 100).toFixed(0)}% = 综合评分 ${(best.suitability * best.weight * 100).toFixed(0)}%</span>
      </div>
    </div>`;

    diagnoses.filter(d => d !== best).forEach(d => {
      html += `<div class="analysis-item">
        <span class="icon">🔹</span>
        <div class="detail">
          品牌色 ${d.hex}（${getOklchRange(d.oklch.H).name}）→ 角色规划：
          ${d.suitability > 0.4 ? '可作辅助色来源' : '建议仅限 Logo 等装饰性区域使用'}
          <span class="desc">适配度评分 ${(d.suitability * 100).toFixed(0)}%，${d.diagnosis.issues.length > 0 ? d.diagnosis.issues.map(i => i.message).join('；') : '无明显可用性缺陷'}</span>
        </div>
      </div>`;
    });
  }

  html += `<div class="analysis-item">
    <span class="icon">🔧</span>
    <div class="detail">
      品牌色 ${accent.originalHex}（L:${accent.originalOklch.L.toFixed(2)} C:${accent.originalOklch.C.toFixed(3)} H:${Math.round(accent.originalOklch.H)}°）➔ 强调色 ${accent.hex}（L:${accent.oklch.L.toFixed(2)} C:${accent.oklch.C.toFixed(3)} H:${Math.round(accent.oklch.H)}°）<br>
      <span class="desc">色相划分：${accent.hueCategory}`;

  if (accent.adjustments.length > 0) {
    accent.adjustments.forEach(a => {
      html += `<br><span style="color:var(--ui-accent)">↳ ${a.reason}：${a.param} 的参数更新了（${a.from} → ${a.to}）</span>`;
    });
  } else {
    html += `<br><span style="color:#059669">↳ 品牌色各项参数已在最优感知区间，无需任何调整</span>`;
  }

  html += `<br><span style="color:#2563EB">↳ 交互文字安全：亮色模式下，主按钮建议搭配 ${accent.textContrastOnAccent === '#FFFFFF' ? '白字 (#FFFFFF)' : '深墨灰字 (#0F172A)'} 以确保通过对比度安全校验</span>`;

  if (accent.fallbackWarning) {
    html += `<br><span style="color:#EF4444">⚠ ${accent.fallbackWarning}</span>`;
  }

  html += `</span></div></div>`;

  // ── 对比度自检结果 ──
  if (contrastChecks && contrastChecks.length > 0) {
    const allPass = contrastChecks.every(c => c.pass);
    html += `<div class="analysis-item">
      <span class="icon">${allPass ? '✅' : '⚠️'}</span>
      <div class="detail">
        对比度自检 <span style="color:${allPass ? '#059669' : '#EF4444'};font-weight:700">${allPass ? '全部通过' : '存在未达标项'}</span>
        <span class="desc">WCAG 2.1 AA + APCA (WCAG 3.0) 双重标准</span>
        <div style="margin-top:8px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px">`;

    contrastChecks.forEach(c => {
      const icon = c.pass ? '✓' : '✗';
      const color = c.pass ? '#059669' : '#EF4444';
      html += `<div style="font-size:.78rem;padding:6px 10px;border-radius:6px;background:${c.mode==='dark'?'#1F2937':'#F8F9FA'};border:1px solid ${c.pass?'#D1FAE5':'#FEE2E2'}">
        <span style="color:${color};font-weight:600">${icon}</span>
        <span style="color:${c.mode==='dark'?'#D1D5DB':'#374151'}">${c.label}</span>
        <span style="color:${c.mode==='dark'?'#9CA3AF':'#6B7280'};float:right">WCAG ${c.wcag.toFixed(1)}:1 · APCA ${c.apca.toFixed(0)}</span>
      </div>`;
    });

    html += `</div></div></div>`;
  }

  document.getElementById('analysis-content').innerHTML = html;
}

// ── 色阶区渲染 ──────────────────────────────────────

function renderAccent(light, dark) {
  document.getElementById('accent-light').innerHTML = light.map(swatchHTML).join('');
  document.getElementById('accent-dark').innerHTML = dark.map(swatchHTML).join('');
}

function renderNeutrals(light, dark) {
  document.getElementById('neutral-label').textContent = '· ' + light.label;
  document.getElementById('neutral-light').innerHTML = light.colors.map(swatchHTML).join('');
  document.getElementById('neutral-dark').innerHTML = dark.map(swatchHTML).join('');
}

function renderSecondary(sLight, sDark, aLight, aDark, wcLight, wcDark, grayLight, grayDark) {
  document.getElementById('secondary-light').innerHTML = sLight.map(swatchHTML).join('');
  document.getElementById('secondary-dark').innerHTML = sDark.map(swatchHTML).join('');
  document.getElementById('adjacent-light').innerHTML = aLight.map(swatchHTML).join('');
  document.getElementById('adjacent-dark').innerHTML = aDark.map(swatchHTML).join('');
  document.getElementById('warm-contrast-light').innerHTML = (wcLight || []).map(swatchHTML).join('');
  document.getElementById('warm-contrast-dark').innerHTML = (wcDark || []).map(swatchHTML).join('');
  document.getElementById('gray-secondary-light').innerHTML = (grayLight || []).map(swatchHTML).join('');
  document.getElementById('gray-secondary-dark').innerHTML = (grayDark || []).map(swatchHTML).join('');
}

// ── 功能色渲染 ──────────────────────────────────────

function renderFunctional(func) {
  const lightHTML = func.map(f => `
    <div class="swatch">
      <div class="swatch-preview" style="background:${f.base.hex};display:flex;gap:4px;align-items:flex-end;padding:8px">
        <div style="width:50%;height:50%;border-radius:4px 4px 0 0;background:${f.subtle.hex}"></div>
      </div>
      <div class="swatch-info">
        <div class="name">${f.label}</div>
        <div class="hex">${f.base.hex}</div>
        <div class="hsl-label">淡: ${f.subtle.hex}</div>
      </div>
    </div>`).join('');

  const darkHTML = func.map(f => `
    <div class="swatch">
      <div class="swatch-preview" style="background:${f.dark.base.hex};display:flex;gap:4px;align-items:flex-end;padding:8px">
        <div style="width:50%;height:50%;border-radius:4px 4px 0 0;background:${f.dark.subtle.hex}"></div>
      </div>
      <div class="swatch-info">
        <div class="name">${f.label} 暗</div>
        <div class="hex">${f.dark.base.hex}</div>
        <div class="hsl-label">淡: ${f.dark.subtle.hex}</div>
      </div>
    </div>`).join('');

  document.getElementById('functional-light').innerHTML = lightHTML;
  document.getElementById('functional-dark').innerHTML = darkHTML;
}

// ── 组件案例渲染 ────────────────────────────────────

function renderComponents(accentL, accentD, neutralsL, neutralsD, functional, textOnAccentLight, textOnAccentDark, secL, secD) {
  const tokenStyle = document.getElementById('generated-tokens');

  const cssVarsLight = [
    `--color-accent-base: ${accentL[2].hex};`,
    `--color-accent-hover: ${accentL[3].hex};`,
    `--color-accent-active: ${accentL[4].hex};`,
    `--color-accent-subtle: ${accentL[0].hex};`,
    `--color-accent-on-accent: ${textOnAccentLight};`,
    `--color-bg-primary: ${neutralsL.colors[0].hex};`,
    `--color-bg-secondary: ${neutralsL.colors[1].hex};`,
    `--color-bg-tertiary: ${neutralsL.colors[2].hex};`,
    `--color-border: ${neutralsL.colors[3].hex};`,
    `--color-text-primary: ${neutralsL.colors[6].hex};`,
    `--color-text-secondary: ${neutralsL.colors[5].hex};`,
    `--color-text-muted: ${neutralsL.colors[4].hex};`,
    `--color-text-emphasis: ${neutralsL.colors[7].hex};`,
    `--color-surface-secondary: ${secL[0].hex};`,
    `--color-surface-secondary-hover: ${secL[1].hex};`,
    `--color-surface-secondary-active: ${secL[2].hex};`,
    `--color-focus-ring: ${accentL[1].hex};`,
    `--color-disabled-bg: ${neutralsL.colors[0].hex};`,
    `--color-disabled-text: ${neutralsL.colors[2].hex};`,
    `--color-disabled-border: ${neutralsL.colors[3].hex};`,
    `--color-success: ${functional[0].base.hex};`,
    `--color-success-subtle: ${functional[0].subtle.hex};`,
    `--color-warning: ${functional[1].base.hex};`,
    `--color-warning-subtle: ${functional[1].subtle.hex};`,
    `--color-error: ${functional[2].base.hex};`,
    `--color-error-subtle: ${functional[2].subtle.hex};`,
    `--color-info: ${functional[3].base.hex};`,
    `--color-info-subtle: ${functional[3].subtle.hex};`,
  ].join('\n');

  const cssVarsDark = [
    `--color-accent-base: ${accentD[2].hex};`,
    `--color-accent-hover: ${accentD[3].hex};`,
    `--color-accent-active: ${accentD[4].hex};`,
    `--color-accent-subtle: ${accentD[0].hex};`,
    `--color-accent-on-accent: ${textOnAccentDark};`,
    `--color-bg-primary: ${neutralsD[0].hex};`,
    `--color-bg-secondary: ${neutralsD[1].hex};`,
    `--color-bg-tertiary: ${neutralsD[2].hex};`,
    `--color-border: ${neutralsD[3].hex};`,
    `--color-text-primary: ${neutralsD[5].hex};`,
    `--color-text-secondary: ${neutralsD[4].hex};`,
    `--color-text-muted: ${neutralsD[3].hex};`,
    `--color-text-emphasis: ${neutralsD[7].hex};`,
    `--color-surface-secondary: ${secD[0].hex};`,
    `--color-surface-secondary-hover: ${secD[1].hex};`,
    `--color-surface-secondary-active: ${secD[2].hex};`,
    `--color-focus-ring: ${accentD[1].hex};`,
    `--color-disabled-bg: ${neutralsD[0].hex};`,
    `--color-disabled-text: ${neutralsD[3].hex};`,
    `--color-disabled-border: ${neutralsD[2].hex};`,
    `--color-success: ${functional[0].dark.base.hex};`,
    `--color-success-subtle: ${functional[0].dark.subtle.hex};`,
    `--color-warning: ${functional[1].dark.base.hex};`,
    `--color-warning-subtle: ${functional[1].dark.subtle.hex};`,
    `--color-error: ${functional[2].dark.base.hex};`,
    `--color-error-subtle: ${functional[2].dark.subtle.hex};`,
    `--color-info: ${functional[3].dark.base.hex};`,
    `--color-info-subtle: ${functional[3].dark.subtle.hex};`,
  ].join('\n');

  tokenStyle.textContent = `
    :root { ${cssVarsLight} }
    [data-theme="dark"] { ${cssVarsDark} }
  `;

  document.getElementById('component-demo').innerHTML = `
    <style>
      #comp-preview-card {
        transition: background .3s, color .3s;
        background: var(--color-bg-primary);
        color: var(--color-text-primary);
      }
      .demo-card {
        background: var(--color-bg-secondary);
        border: 1px solid var(--color-border);
        border-radius: 12px;
        padding: 24px;
        max-width: 400px;
        box-shadow: 0 1px 3px rgba(0,0,0,.06);
      }
      .demo-card-header {
        font-weight: 700;
        font-size: 1rem;
        margin-bottom: 8px;
        color: var(--color-text-primary);
      }
      .demo-card-body {
        font-size: .88rem;
        color: var(--color-text-secondary);
        line-height: 1.6;
        margin-bottom: 16px;
      }
      .demo-btn-primary {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 20px;
        background: var(--color-accent-base);
        color: var(--color-accent-on-accent);
        border: none;
        border-radius: 8px;
        font-size: .88rem;
        font-weight: 600;
        cursor: pointer;
        transition: background .15s;
      }
      .demo-btn-primary:hover { background: var(--color-accent-hover); }
      .demo-btn-outline {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 20px;
        background: transparent;
        color: var(--color-accent-base);
        border: 1.5px solid var(--color-accent-base);
        border-radius: 8px;
        font-size: .88rem;
        font-weight: 600;
        cursor: pointer;
        transition: all .15s;
      }
      .demo-btn-outline:hover { background: var(--color-accent-subtle); }
      .demo-btn-ghost {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 16px;
        background: transparent;
        color: var(--color-text-secondary);
        border: none;
        border-radius: 8px;
        font-size: .88rem;
        font-weight: 500;
        cursor: pointer;
      }
      .demo-btn-ghost:hover { background: var(--color-bg-tertiary); color: var(--color-text-primary); }
      .demo-btn-disabled {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 20px;
        background: var(--color-disabled-bg);
        color: var(--color-disabled-text);
        border: 1px solid var(--color-disabled-border);
        border-radius: 8px;
        font-size: .88rem;
        font-weight: 600;
        cursor: not-allowed;
      }
      .demo-input {
        width: 100%;
        padding: 10px 14px;
        border: 1.5px solid var(--color-border);
        border-radius: 8px;
        font-size: .9rem;
        background: var(--color-bg-primary);
        color: var(--color-text-primary);
        outline: none;
        transition: border-color .15s, box-shadow .15s;
      }
      .demo-input:focus {
        border-color: var(--color-accent-base);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent-base) 15%, transparent);
      }
      .demo-input::placeholder { color: var(--color-text-muted); }
      .demo-label {
        display: block;
        font-size: .82rem;
        font-weight: 600;
        color: var(--color-text-secondary);
        margin-bottom: 6px;
      }
      .demo-badge {
        display: inline-flex;
        align-items: center;
        padding: 3px 10px;
        border-radius: 100px;
        font-size: .74rem;
        font-weight: 600;
        white-space: nowrap;
      }
      .demo-badge.success { background: var(--color-success-subtle); color: var(--color-success); }
      .demo-badge.warning { background: var(--color-warning-subtle); color: var(--color-warning); }
      .demo-badge.error   { background: var(--color-error-subtle);   color: var(--color-error); }
      .demo-badge.info    { background: var(--color-info-subtle);    color: var(--color-info); }
      .demo-badge.accent  { background: var(--color-accent-subtle);  color: var(--color-accent-base); }

      .demo-alert {
        padding: 14px 18px;
        border-radius: 10px;
        border-left: 4px solid var(--color-info);
        background: var(--color-info-subtle);
        color: var(--color-text-primary);
        font-size: .86rem;
        line-height: 1.5;
      }
      .demo-alert strong { color: var(--color-info); }
    </style>

    <div class="comp-label">按钮</div>
    <div class="comp-row">
      <button class="demo-btn-primary">主要操作</button>
      <button class="demo-btn-outline">次要操作</button>
      <button class="demo-btn-ghost">文字按钮</button>
      <button class="demo-btn-disabled">禁用状态</button>
    </div>

    <div class="comp-label" style="margin-top:20px">卡片</div>
    <div class="comp-row">
      <div class="demo-card">
        <div class="demo-card-header">项目标题</div>
        <div class="demo-card-body">这是一段正文内容，展示主要文字和次要信息的层次关系。卡片使用中性色背景和边框。</div>
        <button class="demo-btn-primary">确认</button>
        <button class="demo-btn-ghost" style="margin-left:8px">取消</button>
      </div>
    </div>

    <div class="comp-label" style="margin-top:20px">输入框</div>
    <div class="comp-row" style="max-width:400px;width:100%">
      <div style="width:100%">
        <label class="demo-label">邮箱地址</label>
        <input class="demo-input" type="email" placeholder="请输入邮箱地址">
      </div>
    </div>

    <div class="comp-label" style="margin-top:20px">标签 / 徽章</div>
    <div class="comp-row">
      <span class="demo-badge accent">品牌</span>
      <span class="demo-badge success">成功</span>
      <span class="demo-badge warning">警告</span>
      <span class="demo-badge error">错误</span>
      <span class="demo-badge info">信息</span>
    </div>

    <div class="comp-label" style="margin-top:20px">提示条</div>
    <div class="demo-alert" style="max-width:500px">
      <strong>提示：</strong>这是一条信息提示，使用功能色（info）的左边框和浅色背景，引导用户注意但不打断操作。
    </div>
  `;
}

// ── 主题切换 ────────────────────────────────────────

function setPreviewTheme(theme, btn) {
  const card = document.getElementById('comp-preview-card');
  card.setAttribute('data-theme', theme);

  const btns = document.querySelectorAll('#theme-toggle .theme-toggle-btn');
  btns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

// ── CSS 变量导出 ────────────────────────────────────

function renderCSS(accentL, accentD, neutralsL, neutralsD, secL, secD, functional, textOnAccentLight, textOnAccentDark) {
  const lines = [
    '/* ═══════════════════════════════════════════',
    '   Color Engine — 自动生成的 CSS 变量',
    '   复制到你的 :root 和 [data-theme="dark"] 中使用',
    '   ═══════════════════════════════════════════ */',
    '',
    ':root {',
    '  /* —— 强调色 —— */',
    `  --color-accent-base:    ${accentL[2].hex};   /* 主按钮、链接 */`,
    `  --color-accent-hover:   ${accentL[3].hex};   /* 悬停态 */`,
    `  --color-accent-active:  ${accentL[4].hex};   /* 按压态 */`,
    `  --color-accent-subtle:  ${accentL[0].hex};   /* 浅色强调背景 */`,
    `  --color-accent-surface: ${accentL[0].hex};   /* 标签底色 */`,
    `  --color-accent-on-accent: ${textOnAccentLight}; /* 主按钮上的对比前景文字 */`,
    `  --color-focus-ring:    ${accentL[1].hex};   /* 聚焦环（输入框/按钮 focus） */`,
    '',
    '  /* —— 中性色 (融入环境色相) —— */',
    `  --color-bg-primary:     ${neutralsL.colors[0].hex};   /* 页面背景 */`,
    `  --color-bg-secondary:   ${neutralsL.colors[1].hex};   /* 卡片背景 */`,
    `  --color-bg-tertiary:    ${neutralsL.colors[2].hex};   /* 悬停态背景 */`,
    `  --color-border:         ${neutralsL.colors[3].hex};   /* 边框、分割线 */`,
    `  --color-text-muted:     ${neutralsL.colors[4].hex};   /* 占位文字、禁用 */`,
    `  --color-text-secondary: ${neutralsL.colors[5].hex};   /* 次要文字、图标 */`,
    `  --color-text-primary:   ${neutralsL.colors[6].hex};   /* 主要文字 */`,
    `  --color-text-emphasis:  ${neutralsL.colors[7].hex};   /* 标题、高强调 */`,
    '',
    '  /* —— 交互态 —— */',
    `  --color-disabled-bg:      ${neutralsL.colors[0].hex};   /* 禁用态背景 */`,
    `  --color-disabled-text:    ${neutralsL.colors[2].hex};   /* 禁用态文字 */`,
    `  --color-disabled-border:  ${neutralsL.colors[3].hex};   /* 禁用态边框 */`,
    '',
    '  /* —— 辅助色 (同源弱色度) —— */',
    `  --color-surface-secondary:       ${secL[0].hex};   /* 大面积辅助背景 */`,
    `  --color-surface-secondary-hover: ${secL[1].hex};   /* 辅助卡片头部 */`,
    `  --color-surface-secondary-active: ${secL[2].hex};  /* 选中态 */`,
    '',
    '  /* —— 功能色 —— */',
    `  --color-success:        ${functional[0].base.hex};`,
    `  --color-success-subtle: ${functional[0].subtle.hex};`,
    `  --color-warning:        ${functional[1].base.hex};`,
    `  --color-warning-subtle: ${functional[1].subtle.hex};`,
    `  --color-error:          ${functional[2].base.hex};`,
    `  --color-error-subtle:   ${functional[2].subtle.hex};`,
    `  --color-info:           ${functional[3].base.hex};`,
    `  --color-info-subtle:    ${functional[3].subtle.hex};`,
    '}',
    '',
    '[data-theme="dark"] {',
    '  /* —— 强调色（暗色：降饱和防光晕） —— */',
    `  --color-accent-base:    ${accentD[2].hex};`,
    `  --color-accent-hover:   ${accentD[3].hex};`,
    `  --color-accent-active:  ${accentD[4].hex};`,
    `  --color-accent-subtle:  ${accentD[0].hex};`,
    `  --color-accent-surface: ${accentD[0].hex};`,
    `  --color-accent-on-accent: ${textOnAccentDark}; /* 暗色按钮上的对比前景文字 */`,
    `  --color-focus-ring:    ${accentD[1].hex};   /* 暗色聚焦环 */`,
    '',
    '  /* —— 中性色（暗色：深度=亮度，融入科技 Slate/Coal 暗底） —— */',
    `  --color-bg-primary:     ${neutralsD[0].hex};   /* 暗色页面底（最深） */`,
    `  --color-bg-secondary:   ${neutralsD[1].hex};   /* 暗色卡片（比底浅） */`,
    `  --color-bg-tertiary:    ${neutralsD[2].hex};   /* 暗色悬停 */`,
    `  --color-border:         ${neutralsD[3].hex};`,
    `  --color-text-muted:     ${neutralsD[3].hex};`,
    `  --color-text-secondary: ${neutralsD[4].hex};`,
    `  --color-text-primary:   ${neutralsD[5].hex};   /* 暗色主文字（亮） */`,
    `  --color-text-emphasis:  ${neutralsD[7].hex};   /* 暗色标题、高强调 */`,
    '',
    '  /* —— 交互态（暗色） —— */',
    `  --color-disabled-bg:      ${neutralsD[0].hex};   /* 暗色禁用态背景 */`,
    `  --color-disabled-text:    ${neutralsD[3].hex};   /* 暗色禁用态文字 */`,
    `  --color-disabled-border:  ${neutralsD[2].hex};   /* 暗色禁用态边框 */`,
    '',
    '  /* —— 辅助色（暗色：深底 + 低饱和） —— */',
    `  --color-surface-secondary:       ${secD[0].hex};`,
    `  --color-surface-secondary-hover: ${secD[1].hex};`,
    `  --color-surface-secondary-active: ${secD[2].hex};`,
    '',
    '  /* —— 功能色（暗色） —— */',
    `  --color-success:        ${functional[0].dark.base.hex};`,
    `  --color-success-subtle: ${functional[0].dark.subtle.hex};`,
    `  --color-warning:        ${functional[1].dark.base.hex};`,
    `  --color-warning-subtle: ${functional[1].dark.subtle.hex};`,
    `  --color-error:          ${functional[2].dark.base.hex};`,
    `  --color-error-subtle:   ${functional[2].dark.subtle.hex};`,
    `  --color-info:           ${functional[3].dark.base.hex};`,
    `  --color-info-subtle:    ${functional[3].dark.subtle.hex};`,
    '}',
  ];

  document.getElementById('css-code').textContent = lines.join('\n');
}

// ── Token 对照表 ────────────────────────────────────

function renderTokenTable(accentL, accentD, neutralsL, neutralsD, secL, secD, functional, textOnAccentLight, textOnAccentDark) {
  const rows = [
    ['--color-accent-base',    accentL[2].hex, accentD[2].hex, '主强调色（主按钮、激活链接）'],
    ['--color-accent-hover',   accentL[3].hex, accentD[3].hex, '强调色悬停态'],
    ['--color-accent-active',  accentL[4].hex, accentD[4].hex, '强调色按压态'],
    ['--color-accent-subtle',  accentL[0].hex, accentD[0].hex, '浅色强调背景'],
    ['--color-accent-on-accent', textOnAccentLight, textOnAccentDark, '主按钮之上的前景文字（自适应 APCA）'],
    ['--color-focus-ring',     accentL[1].hex, accentD[1].hex, '输入框/按钮聚焦环'],
    ['--color-bg-primary',     neutralsL.colors[0].hex, neutralsD[0].hex, '页面背景基底'],
    ['--color-bg-secondary',   neutralsL.colors[1].hex, neutralsD[1].hex, '卡片 / 容器表面层'],
    ['--color-bg-tertiary',    neutralsL.colors[2].hex, neutralsD[2].hex, '悬停态背景'],
    ['--color-border',         neutralsL.colors[3].hex, neutralsD[3].hex, '边框与分割线'],
    ['--color-text-primary',   neutralsL.colors[6].hex, neutralsD[5].hex, '正文主要文字'],
    ['--color-text-secondary', neutralsL.colors[5].hex, neutralsD[4].hex, '次要描述文字与小图标'],
    ['--color-text-muted',     neutralsL.colors[4].hex, neutralsD[3].hex, '输入框占位字与禁用态文字'],
    ['--color-text-emphasis',  neutralsL.colors[7].hex, neutralsD[7].hex, '标题与高强调文字'],
    ['--color-disabled-bg',    neutralsL.colors[0].hex, neutralsD[0].hex, '禁用态背景色'],
    ['--color-disabled-text',  neutralsL.colors[2].hex, neutralsD[3].hex, '禁用态文字颜色'],
    ['--color-disabled-border', neutralsL.colors[3].hex, neutralsD[2].hex, '禁用态边框颜色'],
    ['--color-surface-secondary', secL[0].hex, secD[0].hex, '同源大面积辅助背景色'],
    ['--color-surface-secondary-hover', secL[1].hex, secD[1].hex, '同源辅助卡片/悬停层'],
    ['--color-surface-secondary-active', secL[2].hex, secD[2].hex, '同源辅助选中/高亮态'],
    ['--color-success',        functional[0].base.hex, functional[0].dark.base.hex, '确认与成功反馈状态色'],
    ['--color-success-subtle', functional[0].subtle.hex, functional[0].dark.subtle.hex, '成功反馈淡底背景'],
    ['--color-warning',        functional[1].base.hex, functional[1].dark.base.hex, '警告与提醒状态色'],
    ['--color-warning-subtle', functional[1].subtle.hex, functional[1].dark.subtle.hex, '警告提醒淡底背景'],
    ['--color-error',          functional[2].base.hex, functional[2].dark.base.hex, '报错与危险删除状态色'],
    ['--color-error-subtle',   functional[2].subtle.hex, functional[2].dark.subtle.hex, '报错危险淡底背景'],
    ['--color-info',           functional[3].base.hex, functional[3].dark.base.hex, '提示信息与常规通知状态色'],
    ['--color-info-subtle',    functional[3].subtle.hex, functional[3].dark.subtle.hex, '信息提示淡底背景'],
  ];

  document.getElementById('token-table-body').innerHTML = rows.map(r => `
    <tr>
      <td><code>${r[0]}</code></td>
      <td><div class="color-cell"><span class="color-dot" style="background:${r[1]}"></span>${r[1]}</div></td>
      <td><div class="color-cell"><span class="color-dot" style="background:${r[2]}"></span>${r[2]}</div></td>
      <td style="color:var(--ui-text-secondary)">${r[3]}</td>
    </tr>
  `).join('');
}

// ── 工具操作 ────────────────────────────────────────

function copyCSS() {
  const code = document.getElementById('css-code').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector('.copy-btn');
    const orig = btn.textContent;
    btn.textContent = '✓ 已复制!';
    setTimeout(() => { btn.textContent = orig; }, 2000);
  });
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

function addColorInput() {
  const container = document.getElementById('color-inputs');
  const existing = container.querySelectorAll('.input-color-group');
  if (existing.length >= 4) { alert('最多支持 4 个品牌色'); return; }

  const index = existing.length;
  const div = document.createElement('div');
  div.className = 'input-color-group';
  div.dataset.index = index;
  div.innerHTML = `
    <div class="label-row">
      <label>颜色 ${index + 1}（配角）</label>
      <button class="remove-btn" onclick="removeColorInput(this)">✕ 删除</button>
    </div>
    <div class="input-row">
      <input type="color" value="#E5E7EB" onchange="syncHexInput(this)">
      <input type="text" value="#E5E7EB" placeholder="#000000" class="hex-input" onchange="syncColorPicker(this)">
      <input type="number" value="" min="0" max="100" placeholder="%" class="weight-input">
      <span class="pct-sign">%</span>
    </div>
  `;
  container.appendChild(div);
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

  dropZone.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.borderColor = 'var(--ui-accent)';
    this.style.background = '#EEF2FF';
  });
  dropZone.addEventListener('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.borderColor = 'var(--ui-border)';
    this.style.background = 'var(--ui-bg)';
  });
  dropZone.addEventListener('drop', function(e) {
    e.preventDefault();
    e.stopPropagation();
    this.style.borderColor = 'var(--ui-border)';
    this.style.background = 'var(--ui-bg)';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleLogoFile(file);
  });
})();

function handleLogoFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() { extractLogoColors(img); };
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

  // Merge similar colors (threshold = step * 1.5 in RGB distance)
  const merged = mergeExtractedColors(colors, step * 1.5);
  merged.sort((a, b) => b.pct - a.pct);
  const top = merged.filter(c => c.pct >= 1).slice(0, 4);

  autoFillFromLogo(top);
}

function mergeExtractedColors(colors, threshold) {
  if (colors.length <= 1) return colors;
  const merged = [];
  const used = new Set();
  for (let i = 0; i < colors.length; i++) {
    if (used.has(i)) continue;
    let base = { ...colors[i] };
    used.add(i);
    for (let j = i + 1; j < colors.length; j++) {
      if (used.has(j)) continue;
      const hex1 = hexToRgb(base.hex);
      const hex2 = hexToRgb(colors[j].hex);
      if (!hex1 || !hex2) continue;
      const dist = Math.sqrt((hex1.r-hex2.r)**2 + (hex1.g-hex2.g)**2 + (hex1.b-hex2.b)**2);
      if (dist < threshold) {
        const total = base.pct + colors[j].pct;
        base.hex = '#' + [Math.round((hexToRgb(base.hex).r * base.pct + hex2.r * colors[j].pct) / total), Math.round((hexToRgb(base.hex).g * base.pct + hex2.g * colors[j].pct) / total), Math.round((hexToRgb(base.hex).b * base.pct + hex2.b * colors[j].pct) / total)].map(n => n.toString(16).padStart(2,'0')).join('');
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

// ── 启动 ────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  generate();
});
