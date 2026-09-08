/* 澄禾演示 · 交互脚本（原生 JS，无框架、无依赖、无网络请求）
   landing.html：答案来处的一次性展示动效
   app.html    ：状态筛选、标题搜索、空结果恢复、记录详情展开 */
(function () {
  'use strict';

  var doc = document;
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ------------------------------------------------------------------
     营销页：与核心展示有关的一次运动（答案来处逐条显现）
     ------------------------------------------------------------------ */
  var trace = doc.querySelector('.ce-trace');
  if (trace) {
    var revealTrace = function () { trace.classList.add('is-revealed'); };
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        for (var i = 0; i < entries.length; i += 1) {
          if (entries[i].isIntersecting) {
            revealTrace();
            io.disconnect();
            break;
          }
        }
      }, { threshold: 0.3 });
      io.observe(trace);
      /* 兜底：即使观察器不触发，内容也不会长期不可见 */
      window.setTimeout(revealTrace, 2500);
    } else {
      revealTrace();
    }
  }

  /* ------------------------------------------------------------------
     工作台
     ------------------------------------------------------------------ */
  var list = doc.getElementById('record-list');
  if (!list) return;

  var records = Array.prototype.slice.call(list.querySelectorAll('[data-record]'));
  var chips = Array.prototype.slice.call(doc.querySelectorAll('[data-filter]'));
  var searchForm = doc.getElementById('search-form');
  var searchInput = doc.getElementById('knowledge-search');
  var searchClear = doc.getElementById('search-clear');
  var countEl = doc.getElementById('list-count');
  var emptyEl = doc.getElementById('list-empty');
  var emptyHint = doc.getElementById('empty-hint');
  var emptyReset = doc.getElementById('empty-reset');
  var emptyClearQuery = doc.getElementById('empty-clear-query');
  var recordsPanel = doc.getElementById('records');

  var total = records.length;
  var STATUS_LABEL = { all: '全部', published: '已发布', pending: '待整理', draft: '草稿' };
  var state = { status: 'all', query: '' };

  function normalize(text) {
    return String(text || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function recordMatches(record) {
    if (state.status !== 'all' && record.getAttribute('data-status') !== state.status) return false;
    var q = normalize(state.query);
    if (!q) return true;
    return normalize(record.getAttribute('data-title')).indexOf(q) !== -1;
  }

  function collapse(record) {
    var btn = record.querySelector('.ce-record-main');
    var detail = record.querySelector('.ce-record-detail');
    if (!btn || !detail) return;
    record.classList.remove('is-open');
    btn.setAttribute('aria-expanded', 'false');
    detail.hidden = true;
  }

  function collapseAll(except) {
    records.forEach(function (record) {
      if (record !== except) collapse(record);
    });
  }

  function expand(record) {
    var btn = record.querySelector('.ce-record-main');
    var detail = record.querySelector('.ce-record-detail');
    if (!btn || !detail) return;
    collapseAll(record);
    record.classList.add('is-open');
    btn.setAttribute('aria-expanded', 'true');
    detail.hidden = false;
  }

  function render() {
    var shown = 0;

    records.forEach(function (record) {
      var visible = recordMatches(record);
      record.hidden = !visible;
      if (!visible) collapse(record);
      if (visible) shown += 1;
    });

    var label = shown === total
      ? '共 ' + total + ' 条记录'
      : '显示 ' + shown + ' / 共 ' + total + ' 条记录';
    if (state.status !== 'all') label += ' · ' + STATUS_LABEL[state.status];
    countEl.textContent = label;

    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('data-filter') === state.status));
    });

    var isEmpty = shown === 0;
    list.hidden = isEmpty;
    emptyEl.hidden = !isEmpty;

    if (isEmpty) {
      emptyHint.textContent = state.query
        ? '没有标题包含「' + state.query.trim() + '」的记录。可以清空关键词，或把状态筛选切回「全部」。'
        : '当前筛选条件下没有记录。把状态筛选切回「全部」即可看到全部 ' + total + ' 条。';
      emptyClearQuery.hidden = !state.query;
    }

    searchClear.hidden = !state.query;
  }

  function scrollToRecords() {
    if (!recordsPanel) return;
    recordsPanel.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  }

  function focusFirstVisible() {
    for (var i = 0; i < records.length; i += 1) {
      if (!records[i].hidden) {
        var btn = records[i].querySelector('.ce-record-main');
        if (btn) btn.focus({ preventScroll: true });
        return;
      }
    }
  }

  function resetAll(options) {
    var opts = options || {};
    state.status = 'all';
    state.query = '';
    if (searchInput) searchInput.value = '';
    render();
    if (opts.scroll) scrollToRecords();
    if (opts.focusSearch && searchInput) searchInput.focus({ preventScroll: true });
  }

  function jumpToRecord(id) {
    var record = list.querySelector('[data-id="' + id + '"]');
    if (!record) return;

    /* 目标被当前筛选或搜索隐藏时，先恢复可见 */
    if (record.hidden) {
      state.status = 'all';
      state.query = '';
      if (searchInput) searchInput.value = '';
      render();
    }

    expand(record);
    record.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });

    record.classList.remove('is-flash');
    void record.offsetWidth; /* 重启动画 */
    record.classList.add('is-flash');
    window.setTimeout(function () { record.classList.remove('is-flash'); }, 950);

    var btn = record.querySelector('.ce-record-main');
    if (btn) btn.focus({ preventScroll: true });
  }

  /* --- 状态筛选 --- */
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      state.status = chip.getAttribute('data-filter');
      render();
    });
  });

  /* --- 标题搜索 --- */
  if (searchForm) {
    searchForm.addEventListener('submit', function (event) { event.preventDefault(); });
  }
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.query = searchInput.value;
      render();
    });
    searchInput.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && searchInput.value !== '') {
        event.preventDefault();
        state.query = '';
        searchInput.value = '';
        render();
      }
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', function () {
      state.query = '';
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus({ preventScroll: true });
      }
      render();
    });
  }

  /* --- 记录详情展开 / 收起 --- */
  records.forEach(function (record) {
    var btn = record.querySelector('.ce-record-main');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (btn.getAttribute('aria-expanded') === 'true') {
        collapse(record);
      } else {
        expand(record);
      }
    });
  });

  /* --- 空结果恢复入口 --- */
  if (emptyReset) {
    emptyReset.addEventListener('click', function () {
      resetAll();
      scrollToRecords();
      focusFirstVisible();
    });
  }
  if (emptyClearQuery) {
    emptyClearQuery.addEventListener('click', function () {
      state.query = '';
      if (searchInput) searchInput.value = '';
      render();
      if (searchInput) searchInput.focus({ preventScroll: true });
    });
  }

  /* --- 品牌区域中的跳转与快捷操作 --- */
  Array.prototype.slice.call(doc.querySelectorAll('[data-jump]')).forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      jumpToRecord(link.getAttribute('data-jump'));
    });
  });

  Array.prototype.slice.call(doc.querySelectorAll('[data-reset]')).forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      resetAll();
      scrollToRecords();
    });
  });

  Array.prototype.slice.call(doc.querySelectorAll('[data-filter-jump]')).forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.status = btn.getAttribute('data-filter-jump');
      state.query = '';
      if (searchInput) searchInput.value = '';
      render();
      scrollToRecords();
      focusFirstVisible();
    });
  });

  render();
}());
