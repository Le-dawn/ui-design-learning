/* 青冈 · 两页共用的交互脚本（原生 JS，无依赖、无网络请求）
   阅读页：阅读进度条 + 目录当前章节
   作品页：作品详情弹层 + 复制联系邮箱
   两页共用：亮/暗主题切换（尊重系统偏好，记住用户选择） */
(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var win = window;

  /* ------------------------------------------------------------ 主题切换 */
  var THEME_KEY = 'ce-theme';
  var toggles = Array.prototype.slice.call(doc.querySelectorAll('[data-theme-toggle]'));

  function readTheme() {
    try { return win.localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function saveTheme(value) {
    try { win.localStorage.setItem(THEME_KEY, value); } catch (e) { /* 隐私模式下忽略 */ }
  }
  function applyTheme(theme) {
    var dark = theme === 'dark';
    if (dark) { root.setAttribute('data-theme', 'dark'); } else { root.removeAttribute('data-theme'); }
    toggles.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(dark));
      btn.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
      var label = btn.querySelector('[data-theme-label]');
      if (label) { label.textContent = dark ? '浅色' : '深色'; }
    });
  }
  applyTheme(readTheme() === 'dark' ? 'dark' : 'light');
  toggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      saveTheme(next);
    });
  });

  /* -------------------------------------------------- 阅读页：进度与目录 */
  var bar = doc.querySelector('[data-progress-bar]');
  var sections = Array.prototype.slice.call(doc.querySelectorAll('[data-section]'));
  if (bar && sections.length) {
    var links = {};
    sections.forEach(function (section) {
      links[section.id] = doc.querySelector('.ce-toc-link[href="#' + section.id + '"]');
    });
    var currentId = null;

    var update = function () {
      var max = doc.documentElement.scrollHeight - win.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, win.scrollY / max)) : 0;
      bar.style.width = (ratio * 100).toFixed(2) + '%';

      var line = win.scrollY + win.innerHeight * 0.28;
      var nextId = sections[0].id;
      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top + win.scrollY <= line) { nextId = section.id; }
      });
      if (nextId !== currentId) {
        if (currentId && links[currentId]) {
          links[currentId].classList.remove('is-current');
          links[currentId].removeAttribute('aria-current');
        }
        if (links[nextId]) {
          links[nextId].classList.add('is-current');
          links[nextId].setAttribute('aria-current', 'true');
        }
        currentId = nextId;
      }
    };

    update();
    win.addEventListener('scroll', update, { passive: true });
    win.addEventListener('resize', update);
  }

  /* ------------------------------------------------ 作品页：作品详情弹层 */
  var dialog = doc.querySelector('[data-work-dialog]');
  if (dialog) {
    var mediaSlot = dialog.querySelector('[data-dialog-media]');
    var titleSlot = dialog.querySelector('[data-dialog-title]');
    var descSlot = dialog.querySelector('[data-dialog-desc]');
    var yearSlot = dialog.querySelector('[data-dialog-year]');
    var mediumSlot = dialog.querySelector('[data-dialog-medium]');
    var closeBtn = dialog.querySelector('[data-dialog-close]');
    var lastTrigger = null;
    var canModal = typeof dialog.showModal === 'function';

    var fill = function (work) {
      var art = work.querySelector('.ce-work-media svg');
      if (mediaSlot) {
        mediaSlot.textContent = '';
        if (art) { mediaSlot.appendChild(art.cloneNode(true)); }
      }
      if (titleSlot) { titleSlot.textContent = work.getAttribute('data-work-title') || ''; }
      if (descSlot) { descSlot.textContent = work.getAttribute('data-work-desc') || ''; }
      if (yearSlot) { yearSlot.textContent = work.getAttribute('data-work-year') || ''; }
      if (mediumSlot) { mediumSlot.textContent = work.getAttribute('data-work-medium') || ''; }
    };

    var open = function (work, trigger) {
      fill(work);
      lastTrigger = trigger;
      if (canModal) {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
        dialog.classList.add('is-fallback-open');
      }
    };

    var close = function () {
      if (canModal) {
        dialog.close();
      } else {
        dialog.removeAttribute('open');
        dialog.classList.remove('is-fallback-open');
        if (lastTrigger) { lastTrigger.focus(); }
      }
    };

    Array.prototype.forEach.call(doc.querySelectorAll('.ce-work-open, .ce-work-title-btn'), function (trigger) {
      trigger.addEventListener('click', function () {
        var work = trigger.closest('[data-work]');
        if (work) { open(work, trigger); }
      });
    });

    if (closeBtn) { closeBtn.addEventListener('click', close); }

    dialog.addEventListener('click', function (event) {
      if (event.target === dialog) { close(); }
    });

    if (!canModal) {
      dialog.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') { close(); }
      });
    }

    dialog.addEventListener('close', function () {
      if (lastTrigger) { lastTrigger.focus(); }
    });
  }

  /* ---------------------------------------------- 作品页：复制联系邮箱 */
  var copyBtn = doc.querySelector('[data-copy-email]');
  var copyStatus = doc.querySelector('[data-copy-status]');
  if (copyBtn && copyStatus) {
    var timer = null;

    var setStatus = function (message, state) {
      copyStatus.textContent = message;
      if (state) { copyStatus.setAttribute('data-state', state); } else { copyStatus.removeAttribute('data-state'); }
      if (timer) { win.clearTimeout(timer); }
      if (message) {
        timer = win.setTimeout(function () {
          copyStatus.textContent = '';
          copyStatus.removeAttribute('data-state');
        }, 3200);
      }
    };

    var legacyCopy = function (text) {
      var field = doc.createElement('textarea');
      field.value = text;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.top = '-1000px';
      doc.body.appendChild(field);
      field.select();
      var ok = false;
      try { ok = doc.execCommand('copy'); } catch (e) { ok = false; }
      doc.body.removeChild(field);
      return ok;
    };

    copyBtn.addEventListener('click', function () {
      var text = copyBtn.getAttribute('data-copy-email') || '';
      var done = function () { setStatus('已复制到剪贴板：' + text, 'success'); };
      var failed = function () { setStatus('复制失败，请手动选中邮箱地址后复制。', 'error'); };

      if (win.navigator.clipboard && win.navigator.clipboard.writeText) {
        win.navigator.clipboard.writeText(text).then(done, function () {
          if (legacyCopy(text)) { done(); } else { failed(); }
        });
      } else if (legacyCopy(text)) {
        done();
      } else {
        failed();
      }
    });
  }
})();
