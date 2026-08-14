/* ============================================================
   COLOR ENGINE RENDER — 渲染函数 · Token 数据源
   依赖：color-math.js, color-engine-core.js（先加载，运行时引用）
   ============================================================ */

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ── 通用 Swatch HTML（图版编号：map 自动传入 idx） ──

function swatchHTML(item, idx) {
  return `
    <div class="swatch">
      <div class="swatch-preview" style="background:${item.hex}"></div>
      <span class="swatch-plate">${String((idx || 0) + 1).padStart(2, '0')}</span>
      <div class="swatch-info">
        <div class="name">${escapeHtml(item.name)}</div>
        <div class="hex">${escapeHtml(item.hex)}</div>
        <div class="hsl-label">L:${item.oklch.L.toFixed(2)} C:${item.oklch.C.toFixed(3)} H:${Math.round(item.oklch.H)}&deg;</div>
        ${item.usage ? `<div class="hsl-label" style="margin-top:1px">${escapeHtml(item.usage)}</div>` : ''}
      </div>
    </div>`;
}

// ── 仪器风图标（统一 1.8 描边，替代 emoji） ──────────

const UI_ICONS = {
  target: '<svg class="ai" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/><circle cx="12" cy="12" r=".4" fill="currentColor"/></svg>',
  diamond: '<svg class="ai" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5l7 5.5-7 11.5L5 9z"/></svg>',
  wrench: '<svg class="ai" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 6.5a4.5 4.5 0 0 0-6 5.6L3 17.5V21h3.5l5.4-5.5a4.5 4.5 0 0 0 5.6-6l-2.8 2.8-2.9-.7-.7-2.9z"/></svg>',
  check: '<svg class="ai" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5l5 5L20 6.5"/></svg>',
  warn: '<svg class="ai" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4L2.8 20h18.4z"/><path d="M12 10v4.6"/><path d="M12 17.6v.2"/></svg>'
};

// ── 分析诊断渲染 ────────────────────────────────────

function renderAnalysis(diagnoses, best, accent, contrastChecks, detectorResults) {
  let html = '';

  if (diagnoses.length > 1) {
    html += `<div class="analysis-item">
      <span class="icon">${UI_ICONS.target}</span>
      <div class="detail">
        从 ${diagnoses.length} 个品牌色中选出「${escapeHtml(best.hex)}」作为主强调色候选者<br>
        <span class="desc">选择依据：感知适合度 ${(best.suitability * 100).toFixed(0)}% × 权重 ${(best.weight * 100).toFixed(0)}% = 综合评分 ${(best.suitability * best.weight * 100).toFixed(0)}%</span>
      </div>
    </div>`;

    diagnoses.filter(d => d !== best).forEach(d => {
      html += `<div class="analysis-item">
        <span class="icon">${UI_ICONS.diamond}</span>
        <div class="detail">
          品牌色 ${escapeHtml(d.hex)}（${escapeHtml(getOklchRange(d.oklch.H).name)}）→ 角色规划：
          ${d.suitability > 0.4 ? '可作辅助色来源' : '建议仅限 Logo 等装饰性区域使用'}
          <span class="desc">适配度评分 ${(d.suitability * 100).toFixed(0)}%，${d.diagnosis.issues.length > 0 ? d.diagnosis.issues.map(i => escapeHtml(i.message)).join('；') : '无明显可用性缺陷'}</span>
        </div>
      </div>`;
    });
  }

  html += `<div class="analysis-item">
    <span class="icon">${UI_ICONS.wrench}</span>
    <div class="detail" id="accent-detail">${accentDetailHTML(accent)}</div>
  </div>`;

  // ── 对比度自检结果 ──
  if (contrastChecks && contrastChecks.length > 0) {
    const allPass = contrastChecks.every(c => c.pass);
    html += `<div class="analysis-item">
      <span class="icon ${allPass ? '' : 'warn'}">${allPass ? UI_ICONS.check : UI_ICONS.warn}</span>
      <div class="detail">
        对比度自检 <span style="color:${allPass ? 'var(--color-success)' : 'var(--color-error)'};font-weight:700">${allPass ? '全部通过' : '存在未达标项'}</span>
        <span class="desc">正文 WCAG+APCA 双达标 · 次要文字任一达标 · 弱化文字 ≥3.0:1</span>
        <div style="margin-top:8px;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:6px">`;

    contrastChecks.forEach(c => {
      const pass = !!c.pass;
      const chipColor = pass ? 'var(--ui-text-secondary)' : 'var(--color-error)';
      html += `<div style="font-size:.74rem;padding:7px 12px;border-radius:3px;background:var(--ui-surface);border:1px solid ${pass ? 'var(--ui-border)' : 'var(--color-error)'};display:flex;align-items:center;gap:8px">
        <span style="color:${pass ? 'var(--ui-accent)' : 'var(--color-error)'};display:inline-flex;flex-shrink:0">${pass ? UI_ICONS.check : UI_ICONS.warn}</span>
        <span style="color:${chipColor}">${escapeHtml(c.label)}</span>
        <span style="color:var(--ui-text-muted);margin-left:auto;font-family:var(--ui-font-mono);font-size:.68rem;white-space:nowrap">WCAG ${c.wcag.toFixed(1)}:1 · APCA ${c.apca.toFixed(0)}</span>
      </div>`;
    });

    html += `</div></div></div>`;
  }

  document.getElementById('analysis-content').innerHTML = html;

  // ── Detector 自检结果 ──
  if (detectorResults && detectorResults.summary) {
    renderDetectorSummary(detectorResults);
  }
}

// ── Detector 自检渲染 ──────────────────────────────

function renderDetectorSummary(detectorResults) {
  var s = detectorResults.summary;
  var summaryEl = document.getElementById('detector-summary');
  var detailsEl = document.getElementById('detector-details');
  var detailContentEl = document.getElementById('detector-detail-content');

  // 按类别分组
  var byCategory = {};
  detectorResults.results.forEach(function(r) {
    if (!byCategory[r.category]) byCategory[r.category] = [];
    byCategory[r.category].push(r);
  });

  // 摘要条（世界语言：发丝边框 + mono + 功能色，无彩色胶囊）
  var passPct = s.total > 0 ? Math.round(s.passed / s.total * 100) : 0;
  var barColor = s.allPass ? 'var(--color-success)' : s.failed > 2 ? 'var(--color-error)' : 'var(--color-warning)';
  summaryEl.innerHTML =
    '<div style="display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:3px;background:var(--ui-surface);border:1px solid var(--ui-border)">' +
      '<span style="display:inline-flex;color:' + barColor + '">' + (s.allPass ? UI_ICONS.check : UI_ICONS.warn) + '</span>' +
      '<div style="flex:1">' +
        '<span style="font-weight:700;color:var(--ui-text)">Detector 自检：' + s.passed + '/' + s.total + ' 通过</span>' +
        (s.failed > 0 ? '<span style="color:' + barColor + ';margin-left:8px;font-size:.78rem">(' + s.failed + ' 项未通过)</span>' : '') +
        (s.errors > 0 ? '<span style="color:var(--color-error);margin-left:8px;font-size:.78rem">(' + s.errors + ' 项异常)</span>' : '') +
      '</div>' +
      '<div style="width:120px;height:4px;border-radius:2px;background:var(--ui-border);overflow:hidden">' +
        '<div style="width:' + passPct + '%;height:100%;background:' + barColor + '"></div>' +
      '</div>' +
    '</div>';

  // 明细：始终显示，所有规则列出实际值 vs 期望值
  detailsEl.style.display = 'block';
  var detailHtml = '';
  Object.keys(byCategory).forEach(function(cat) {
    var catResults = byCategory[cat];
    var catFailCount = catResults.filter(function(r) { return !r.pass; }).length;
    var catColor = catFailCount === 0 ? 'var(--ui-text-secondary)' : 'var(--color-error)';
    detailHtml += '<div style="margin-bottom:16px">' +
      '<div style="font-size:.74rem;font-weight:700;color:var(--ui-text-secondary);margin-bottom:8px;text-transform:uppercase;letter-spacing:.04em;display:flex;align-items:center;gap:6px">' +
        '<span style="display:inline-flex;color:' + catColor + '">' + (catFailCount === 0 ? UI_ICONS.check : UI_ICONS.warn) + '</span> ' + cat +
        (catFailCount > 0 ? ' <span style="color:' + catColor + '">(' + catFailCount + ')</span>' : '') +
      '</div>';
    catResults.forEach(function(r) {
      var icon = r.pass ? UI_ICONS.check : UI_ICONS.warn;
      var rowColor = r.pass ? 'var(--ui-text-secondary)' : r.severity === 'error' ? 'var(--color-error)' : 'var(--color-warning)';
      var rowBorder = r.pass ? 'var(--ui-border)' : rowColor;

      // Format actual value for display
      var actualStr = '';
      if (r.actual !== undefined && r.actual !== null) {
        if (typeof r.actual === 'number') {
          actualStr = r.actual.toFixed(1);
        } else if (typeof r.actual === 'object' && !Array.isArray(r.actual) && r.actual.a !== undefined && r.actual.b !== undefined) {
          actualStr = 'a=' + r.actual.a.toFixed(3) + ', b=' + r.actual.b.toFixed(3);
        } else if (typeof r.actual === 'object' && !Array.isArray(r.actual) && r.actual.L !== undefined) {
          actualStr = 'L=' + r.actual.L.toFixed(2) + (r.actual.C !== undefined ? ' C=' + r.actual.C.toFixed(3) : '');
        } else {
          actualStr = JSON.stringify(r.actual);
        }
      }
      if (r.detail) actualStr = r.detail;

      detailHtml += '<div style="font-size:.78rem;padding:9px 14px;margin-bottom:4px;border-radius:3px;border:1px solid ' + rowBorder + ';background:var(--ui-surface)">' +
        '<div style="display:flex;align-items:flex-start;gap:8px">' +
          '<span style="display:inline-flex;color:' + rowColor + ';flex-shrink:0;margin-top:1px">' + icon + '</span>' +
          '<div style="flex:1">' +
            '<div style="font-weight:600;color:var(--ui-text)">' + escapeHtml(r.label) + '</div>' +
            '<div style="display:flex;gap:16px;margin-top:2px;font-size:.74rem;flex-wrap:wrap">' +
              '<span style="color:var(--ui-text-muted)">实际: <span style="font-family:var(--ui-font-mono);color:' + rowColor + '">' + escapeHtml(actualStr) + '</span></span>' +
              '<span style="color:var(--ui-text-muted)">期望: <span style="font-family:var(--ui-font-mono);color:var(--ui-text-secondary)">' + escapeHtml(r.expected || '-') + '</span></span>' +
            '</div>' +
            (r.message ? '<div style="color:' + rowColor + ';margin-top:2px;font-size:.74rem">' + escapeHtml(r.message) + '</div>' : '') +
            (r.fixHint ? '<div style="color:var(--ui-accent);font-size:.74rem;margin-top:2px">→ ' + escapeHtml(r.fixHint) + '</div>' : '') +
          '</div>' +
        '</div>' +
      '</div>';
    });
  });
  detailContentEl.innerHTML = detailHtml;
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

// ── 组件案例页面（完整仪表盘参考页） ──────────────────
// buildDemoCSS 是唯一一份组件 CSS：Demo 渲染与「组件 CSS 导出」共用，
// 保证你看到的组件案例和导出的代码完全一致

// ── 组件案例：克制着陆页 ──────────────────────────────
// 设计要点（这就是「怎么用」的示范）：
//   1. 强调色 ≤ 3 处：眉题文字、主 CTA、图标底色
//   2. 字号阶梯：3xl 主角标题 → base 正文 → xs 元信息
//   3. 深度靠「灰画布 + 白卡 + shadow-sm」，不靠加深卡片颜色
//   4. 间距节奏：区块间 48–64px / 卡片内 24px / 元素间 12px
// buildDemoCSS 是唯一一份组件 CSS：Demo 渲染与「组件 CSS 导出」共用

// ── 组件示例：光谱世界 · Solstice 天文观测平台 ────────
// 着陆页 + 工作台共用同一套组件语言：
// 纸面 + 发丝线 + 光谱强调 + tabular 数字 + 3px 倒角（无圆角胶囊）

function buildTokenMap(sys, spaceScale, spaceSemantics) {
  const L = sys.neutralsLight.colors;
  const D = sys.neutralsDark;
  const aL = sys.accentScaleLight;
  const aD = sys.accentScaleDark;
  const sL = sys.secondaryLight;
  const sD = sys.secondaryDark;
  const f = sys.functional;

  const colors = [
    { name: '--color-accent-base',       light: aL[2].hex, dark: aD[2].hex, usage: '主强调色（主按钮、激活链接）', group: 'accent' },
    { name: '--color-accent-hover',      light: aL[3].hex, dark: aD[3].hex, usage: '强调色悬停态', group: 'accent' },
    { name: '--color-accent-active',     light: aL[4].hex, dark: aD[4].hex, usage: '强调色按压态', group: 'accent' },
    { name: '--color-accent-subtle',     light: aL[0].hex, dark: aD[0].hex, usage: '浅色强调背景（标签底色）', group: 'accent' },
    { name: '--color-accent-on-accent',  light: sys.textOnAccentLight, dark: sys.textOnAccentDark, usage: '主按钮上的对比前景文字（自适应 APCA）', group: 'accent' },
    { name: '--color-focus-ring',        light: aL[1].hex, dark: aD[1].hex, usage: '输入框/按钮聚焦环', group: 'accent' },
    { name: '--color-bg-primary',        light: L[0].hex, dark: D[0].hex, usage: '页面背景基底', group: 'neutral' },
    { name: '--color-bg-secondary',      light: L[1].hex, dark: D[1].hex, usage: '卡片 / 容器表面层', group: 'neutral' },
    { name: '--color-bg-tertiary',       light: L[2].hex, dark: D[2].hex, usage: '悬停态背景', group: 'neutral' },
    { name: '--color-border',            light: L[3].hex, dark: D[3].hex, usage: '边框与分割线', group: 'neutral' },
    { name: '--color-text-primary',      light: L[6].hex, dark: D[6].hex, usage: '正文主要文字', group: 'neutral' },
    { name: '--color-text-secondary',    light: L[5].hex, dark: D[5].hex, usage: '次要描述文字与小图标', group: 'neutral' },
    { name: '--color-text-muted',        light: L[4].hex, dark: D[4].hex, usage: '输入框占位字与禁用态文字', group: 'neutral' },
    { name: '--color-text-emphasis',     light: L[7].hex, dark: D[7].hex, usage: '标题与高强调文字', group: 'neutral' },
    { name: '--color-disabled-bg',       light: L[0].hex, dark: D[0].hex, usage: '禁用态背景色', group: 'state' },
    { name: '--color-disabled-text',     light: L[4].hex, dark: D[4].hex, usage: '禁用态文字颜色（neutral-300 占位级，可辨识）', group: 'state' },
    { name: '--color-disabled-border',   light: L[3].hex, dark: D[3].hex, usage: '禁用态边框颜色', group: 'state' },
    { name: '--color-surface-secondary', light: sL[0].hex, dark: sD[0].hex, usage: '同源大面积辅助背景色', group: 'secondary' },
    { name: '--color-surface-secondary-hover', light: sL[1].hex, dark: sD[1].hex, usage: '同源辅助卡片/悬停层', group: 'secondary' },
    { name: '--color-surface-secondary-active', light: sL[2].hex, dark: sD[2].hex, usage: '同源辅助选中/高亮态', group: 'secondary' },
    { name: '--color-success',        light: f[0].base.hex, dark: f[0].dark.base.hex, usage: '确认与成功反馈状态色', group: 'functional' },
    { name: '--color-success-subtle', light: f[0].subtle.hex, dark: f[0].dark.subtle.hex, usage: '成功反馈淡底背景', group: 'functional' },
    { name: '--color-warning',        light: f[1].base.hex, dark: f[1].dark.base.hex, usage: '警告与提醒状态色', group: 'functional' },
    { name: '--color-warning-subtle', light: f[1].subtle.hex, dark: f[1].dark.subtle.hex, usage: '警告提醒淡底背景', group: 'functional' },
    { name: '--color-error',          light: f[2].base.hex, dark: f[2].dark.base.hex, usage: '报错与危险删除状态色', group: 'functional' },
    { name: '--color-error-subtle',   light: f[2].subtle.hex, dark: f[2].dark.subtle.hex, usage: '报错危险淡底背景', group: 'functional' },
    { name: '--color-info',           light: f[3].base.hex, dark: f[3].dark.base.hex, usage: '提示信息与常规通知状态色', group: 'functional' },
    { name: '--color-info-subtle',    light: f[3].subtle.hex, dark: f[3].dark.subtle.hex, usage: '信息提示淡底背景', group: 'functional' },

    // ── 美学扩展：渐变搭档 / 品牌渐变 / 浮层表面 ──
    { name: '--color-accent-2',     light: sys.accent2.light.hex, dark: sys.accent2.dark.hex, usage: '渐变搭档色（主色 ±40° 色相，与主色同明度色度）', group: 'accent' },
    { name: '--gradient-brand',     light: 'linear-gradient(135deg, var(--color-accent-base), var(--color-accent-2))', dark: 'linear-gradient(135deg, var(--color-accent-base), var(--color-accent-2))', usage: '品牌主渐变（Hero / 主 CTA 背景）', group: 'accent' },
    { name: '--color-surface-raised', light: sys.surfaceRaised.light.hex, dark: sys.surfaceRaised.dark.hex, usage: '浮层表面（弹窗 / Popover / 下拉）', group: 'neutral' },

    // ── 美学扩展：阴影与层级 ──
    { name: '--shadow-color',       light: 'color-mix(in srgb, var(--color-text-emphasis) 12%, transparent)', dark: 'color-mix(in srgb, var(--color-text-emphasis) 16%, transparent)', usage: '阴影基底色（派生自最深文字色，暗色模式加深）', group: 'elevation' },
    { name: '--shadow-sm',          light: '0 1px 2px 0 var(--shadow-color)', dark: '0 1px 2px 0 var(--shadow-color)', usage: '轻阴影（卡片）', group: 'elevation' },
    { name: '--shadow-md',          light: '0 2px 4px -1px var(--shadow-color), 0 4px 8px -1px var(--shadow-color)', dark: '0 2px 4px -1px var(--shadow-color), 0 4px 8px -1px var(--shadow-color)', usage: '中阴影（下拉 / 浮层）', group: 'elevation' },
    { name: '--shadow-lg',          light: '0 8px 16px -2px var(--shadow-color), 0 4px 8px -2px var(--shadow-color)', dark: '0 8px 16px -2px var(--shadow-color), 0 4px 8px -2px var(--shadow-color)', usage: '重阴影（弹窗 / 悬浮）', group: 'elevation' },

    // ── 美学扩展：圆角 ──
    { name: '--radius-sm',          light: '3px', dark: '3px', usage: '仪器倒角（标签 / 输入框）', group: 'radius' },
    { name: '--radius-md',          light: '4px', dark: '4px', usage: '中倒角（按钮 / 卡片）', group: 'radius' },
    { name: '--radius-lg',          light: '6px', dark: '6px', usage: '大倒角（弹窗 / Hero）', group: 'radius' },
    { name: '--radius-inner',       light: '4px', dark: '4px', usage: '嵌套倒角（卡片内嵌按钮 / 标签，外层圆角 − 间距）', group: 'radius' },

    // ── 美学扩展：交互态补充 ──
    { name: '--focus-ring-shadow',  light: '0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 45%, transparent)', dark: '0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 45%, transparent)', usage: '聚焦环（颜色 + 宽度 + 偏移三件套）', group: 'state' },
    { name: '--shadow-inset',       light: 'inset 0 2px 4px color-mix(in srgb, var(--color-text-emphasis) 8%, transparent)', dark: 'inset 0 2px 4px color-mix(in srgb, var(--color-text-emphasis) 10%, transparent)', usage: '按压态凹陷（按钮 :active）', group: 'elevation' },

    // ── 排版系统（好看的 80% 来自字号对比） ──
    { name: '--text-xs',   light: '0.75rem',  dark: '0.75rem',  usage: '辅助说明 / 标签', group: 'typography' },
    { name: '--text-sm',   light: '0.875rem', dark: '0.875rem', usage: '次要文字 / 按钮', group: 'typography' },
    { name: '--text-base', light: '1rem',     dark: '1rem',     usage: '正文', group: 'typography' },
    { name: '--text-lg',   light: '1.125rem', dark: '1.125rem', usage: '卡片标题', group: 'typography' },
    { name: '--text-xl',   light: '1.5rem',   dark: '1.5rem',   usage: '区块标题', group: 'typography' },
    { name: '--text-2xl',  light: '2rem',     dark: '2rem',     usage: '页面标题', group: 'typography' },
    { name: '--text-3xl',  light: '2.5rem',   dark: '2.5rem',   usage: 'Hero 标题', group: 'typography' },
    { name: '--leading-tight',  light: '1.25', dark: '1.25', usage: '标题行高', group: 'typography' },
    { name: '--leading-normal', light: '1.6',  dark: '1.6',  usage: '正文行高', group: 'typography' },
    { name: '--font-medium',    light: '500', dark: '500', usage: '中字重（导航 / 标签）', group: 'typography' },
    { name: '--font-semibold',  light: '600', dark: '600', usage: '半粗（卡片标题）', group: 'typography' },
    { name: '--font-bold',      light: '700', dark: '700', usage: '粗体（大标题 / 数字）', group: 'typography' },
  ];

  const spacing = spaceScale.map(s => ({
    name: '--' + s.name, light: s.remStr, dark: '—', pxVal: s.px, usage: s.name + ' 间距阶梯', group: 'space-scale'
  }));
  const semantic = spaceSemantics.map(t => ({
    name: t.token, light: t.from.remStr, dark: '—', pxVal: t.from.px, usage: t.usage, group: 'space-semantic'
  }));

  return colors.concat(spacing, semantic);
}

// ── Token 导出（CSS / Tailwind / JSON 三种格式） ─────

function renderTokenTable(tokens) {
  document.getElementById('token-table-body').innerHTML = tokens.map(function(t) {
    var isColor = t.light && t.light.charAt(0) === '#';
    var lightVal = isColor ? t.light : (t.pxVal !== undefined ? t.pxVal + 'px / ' + t.light : t.light);
    var lightCell = isColor
      ? '<div class="color-cell"><span class="color-dot" style="background:' + t.light + '"></span>' + t.light + '</div>'
      : '<span style="font-family:SF Mono,Fira Code,monospace;font-size:.78rem">' + lightVal + '</span>';
    var darkCell = isColor
      ? '<div class="color-cell"><span class="color-dot" style="background:' + t.dark + '"></span>' + t.dark + '</div>'
      : '<span style="font-family:SF Mono,Fira Code,monospace;font-size:.78rem;color:var(--ui-text-muted)">' + t.dark + '</span>';
    return '<tr>' +
      '<td><code>' + escapeHtml(t.name) + '</code></td>' +
      '<td>' + lightCell + '</td>' +
      '<td>' + darkCell + '</td>' +
      '<td style="color:var(--ui-text-secondary)">' + escapeHtml(t.usage) + '</td>' +
    '</tr>';
  }).join('');
}

// ── 间距阶梯可视化 ──────────────────────────────

function renderSpaceScale(scale) {
  if (!scale || !scale.length) return;

  // Label
  var label = document.getElementById('spacing-label');
  if (label) {
    label.textContent = '· 基于 ' + spaceBaseUnit + 'px 网格 · ' + scale.length + ' 级阶梯';
  }

  // Bar chart
  var maxPx = scale[scale.length - 1].px;
  var containerMaxWidth = 380; // approximate px width for 100% bar

  var html = '';
  scale.forEach(function(item) {
    var barWidth = Math.max(3, (item.px / maxPx) * containerMaxWidth * 0.85);
    html += '<div class="space-bar-row">' +
      '<span class="space-bar-label">' + item.name + '</span>' +
      '<span class="space-bar" style="width:' + barWidth.toFixed(0) + 'px"></span>' +
      '<span class="space-bar-value">' + item.px + 'px</span>' +
      '<span class="space-bar-rem">' + item.remStr + '</span>' +
    '</div>';
  });

  var lightEl = document.getElementById('spacing-scale-light');
  if (lightEl) lightEl.innerHTML = html;
  flipSpaceBars(lightEl);

  // Preview card showing semantic usage
  var previewHtml = '';
  var previewItems = [
    { label: '页面容器 padding', value: findSpaceStep(scale, 'space-lg') },
    { label: '卡片 padding', value: findSpaceStep(scale, 'space-lg') },
    { label: '卡片 gap', value: findSpaceStep(scale, 'space-md') },
    { label: '按钮 padding-x', value: findSpaceStep(scale, 'space-md') },
    { label: '按钮 padding-y', value: findSpaceStep(scale, 'space-sm') },
    { label: '区块 section gap', value: findSpaceStep(scale, 'space-3xl') },
    { label: '行内 inline gap', value: findSpaceStep(scale, 'space-sm') },
  ];

  var previewMaxPx = previewItems.reduce(function(m, item) { return Math.max(m, item.value ? item.value.px : 0); }, 0);

  previewItems.forEach(function(item) {
    if (!item.value) return;
    var barWidth = Math.max(3, (item.value.px / previewMaxPx) * containerMaxWidth * 0.7);
    previewHtml += '<div class="space-bar-row">' +
      '<span class="space-bar-label">' + item.label + '</span>' +
      '<span class="space-bar" style="width:' + barWidth.toFixed(0) + 'px;opacity:0.22;background:var(--ui-accent)"></span>' +
      '<span class="space-bar-value">' + item.value.px + 'px</span>' +
    '</div>';
  });

  var previewEl = document.getElementById('spacing-preview-viz');
  if (previewEl) { previewEl.innerHTML = '<div class="space-preview-card" style="padding:16px">' + previewHtml + '</div>'; flipSpaceBars(previewEl); }
}

// 间距条动画：transform scaleX（避免 width 布局动画）
function flipSpaceBars(root) {
  if (!root || !root.querySelector) return;
  var bars = root.querySelectorAll('.space-bar');
  if (!bars.length) return;
  bars.forEach(function(b) { b.style.transform = 'scaleX(0)'; });
  requestAnimationFrame(function() {
    bars.forEach(function(b) { b.style.transform = ''; });
  });
}

function findSpaceStep(scale, name) {
  for (var i = 0; i < scale.length; i++) {
    if (scale[i].name === name) return scale[i];
  }
  return scale[0];
}

// ── 间距语义 Token 表 ──────────────────────────────

function renderSpaceSemantics(tokens) {
  if (!tokens || !tokens.length) return;

  var tbody = document.getElementById('space-token-table-body');
  if (!tbody) return;

  tbody.innerHTML = tokens.map(function(t) {
    return '<tr>' +
      '<td><code>' + escapeHtml(t.token) + '</code></td>' +
      '<td>' + t.from.px + 'px</td>' +
      '<td>' + t.from.remStr + '</td>' +
      '<td style="color:var(--ui-text-muted)"><code>' + escapeHtml(t.from.name) + '</code></td>' +
      '<td style="color:var(--ui-text-secondary)">' + escapeHtml(t.usage) + '</td>' +
    '</tr>';
  }).join('');
}

// ── 工具操作 ────────────────────────────────────────

