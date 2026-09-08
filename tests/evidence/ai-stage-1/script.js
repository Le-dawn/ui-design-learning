'use strict';
(() => {
  const tabs = [...document.querySelectorAll('[data-preview-tab]')];
  function activateTab(tab) {
    tabs.forEach(item => {
      const selected = item === tab;
      item.setAttribute('aria-selected', String(selected));
      item.tabIndex = selected ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activateTab(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = tabs[(index + 1) % tabs.length];
      if (event.key === 'ArrowLeft') next = tabs[(index - 1 + tabs.length) % tabs.length];
      if (event.key === 'Home') next = tabs[0];
      if (event.key === 'End') next = tabs[tabs.length - 1];
      if (next) { event.preventDefault(); activateTab(next); next.focus(); }
    });
  });
  const list = document.getElementById('record-list');
  if (!list) return;
  const records = [
    {id:'release',title:'产品发布与回滚指南',date:'9 月 8 日',author:'林晓',status:'published',category:'发布规范 · v1.3',heading:'第 3 节 · 异常处理与回滚条件',body:'先向内部空间开放灰度发布，确认关键流程后，再逐步扩大范围。若核心流程无法完成，应立即暂停扩量并回滚至上一稳定版本，再补充异常记录。',detail:'回滚完成后，负责人需验证核心流程、同步处理结果，并记录异常出现的环境与复现步骤。重新发布前，须由相关模块负责人共同确认。',question:'发布后出现异常，什么时候回滚？',history:'v1.3 · 9 月 8 日 · 林晓：明确核心流程异常时的回滚条件，并关联异常处理问答。v1.2 · 9 月 5 日 · 陈一：补充灰度发布检查步骤。'},
    {id:'csv',title:'API / CSV 数据导入与字段映射说明',date:'9 月 8 日',author:'陈一',status:'published',category:'接口与数据 · v1.2',heading:'字段映射与导入检查',body:'API 与 CSV 导入共用字段命名约定。导入前请确认必填字段完整、日期格式一致，并将源字段映射到对应的知识字段。CSV 文件使用 UTF-8 编码。',detail:'正式导入前，先用少量记录检查映射结果。若存在无法识别的字段，请保留源文件并在检查表中记录问题，确认后重新导入。',question:'为什么导入后部分字段为空？',history:'v1.2 · 9 月 8 日 · 陈一：补充 CSV 编码说明与字段缺失排查步骤。'},
    {id:'handover',title:'跨部门需求评审后，如何确认责任人、验收标准与变更通知范围',date:'9 月 7 日',author:'许然',status:'review',category:'协作流程 · v0.4',heading:'评审结束后的确认清单',body:'评审主持人整理结论后，逐项确认负责人和验收标准。每项工作须有明确的负责角色，并说明完成后由谁验收。存在争议的内容应独立列为待确认事项。',detail:'涉及范围变化时，同步通知产品、设计、研发与相关业务负责人。通知中保留原结论、变化原因和本次决定，便于之后追溯。',question:'评审后的变更应该通知谁？',history:'v0.4 · 9 月 7 日 · 许然：补充责任确认与变更通知范围，目前待审核。'},
    {id:'interview',title:'用户访谈记录归档约定',date:'9 月 6 日',author:'周宁',status:'draft',category:'用户研究 · v0.2',heading:'让访谈发现有据可查',body:'每份访谈记录注明访谈主题、日期与整理人。将受访者原话与研究者理解分开记录，避免在后续引用时混淆事实和判断。',detail:'归档前移除不必要的个人信息。将关键发现关联到对应需求，并附上记录段落，供团队在决策时回看。本文仍在整理中。',question:'访谈发现应该如何关联需求？',history:'v0.2 · 9 月 6 日 · 周宁：整理归档结构，内容尚为草稿。'},
    {id:'onboarding',title:'新成员入组：从这里了解产品',date:'9 月 5 日',author:'林晓',status:'published',category:'团队入门 · v1.0',heading:'先了解团队，再开始协作',body:'欢迎加入产品团队。可以从产品目标、当前协作流程和发布规范开始阅读，建立对团队工作的整体认识。阅读中遇到问题，请记下对应文档与具体段落。',detail:'完成首次阅读后，与协作同事确认自己负责的模块、近期任务与沟通方式。让问题留在知识旁，下一位成员也能从中受益。',question:'新成员应该先看哪些知识？',history:'v1.0 · 9 月 5 日 · 林晓：发布团队入门阅读说明。'},
    {id:'questions',title:'发布流程待确认事项',date:'9 月 4 日',author:'陈一',status:'review',category:'发布规范 · v0.3',heading:'本周需要核对的事项',body:'请各模块负责人核对灰度发布检查项，确认当前执行步骤与文档一致。对需要调整的内容，说明对应模块、现有做法以及建议变更的原因。',detail:'当前待确认内容包括发布前检查责任人与回滚后验证范围。审核完成后，将确认结论合并至正式发布指南，并在版本记录中保留来处。',question:'核对后发现文档和实际流程不一致怎么办？',history:'v0.3 · 9 月 4 日 · 陈一：汇总发布规范核对事项，等待模块负责人确认。'}
  ];
  const statusLabels = {published:'已发布',review:'待审核',draft:'草稿'};
  const search = document.getElementById('knowledge-search');
  const filters = [...document.querySelectorAll('[data-filter]')];
  let activeFilter = 'all';
  const create = (tag, className, text) => { const element = document.createElement(tag); if (className) element.className = className; if (text !== undefined) element.textContent = text; return element; };
  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    const visible = records.filter(record => (activeFilter === 'all' || record.status === activeFilter) && record.title.toLocaleLowerCase().includes(query));
    list.replaceChildren();
    visible.forEach(record => {
      const row = create('div','record-row'); row.setAttribute('role','row');
      const titleCell = create('div'); titleCell.setAttribute('role','cell');
      const button = create('button','record-title',record.title); button.type = 'button'; button.dataset.doc = record.id;
      titleCell.append(button,create('span','record-category',record.category)); row.append(titleCell);
      const date = create('span','record-date',record.date); date.setAttribute('role','cell');
      const author = create('span','record-author',record.author); author.setAttribute('role','cell');
      const status = create('span',`badge ${record.status}`,statusLabels[record.status]); status.setAttribute('role','cell');
      row.append(date,author,status); list.append(row);
    });
    document.getElementById('result-count').textContent = `${visible.length} 条知识${query ? ' · 搜索结果' : ''}`;
    document.getElementById('empty-state').hidden = visible.length > 0;
    document.querySelector('.record-table').hidden = visible.length === 0;
    filters.forEach(button => { const selected = button.dataset.filter === activeFilter; button.classList.toggle('active',selected); button.setAttribute('aria-pressed',String(selected)); });
  }
  filters.forEach(button => button.addEventListener('click', () => { activeFilter = button.dataset.filter; render(); }));
  search.addEventListener('input',render);
  document.getElementById('reset-search').addEventListener('click', () => { activeFilter = 'all'; search.value = ''; render(); search.focus(); });
  const reader = document.getElementById('reader');
  function openRecord(id) {
    const record = records.find(item => item.id === id);
    if (!record) return;
    document.getElementById('reader-title').textContent = record.title;
    document.getElementById('reader-meta').textContent = `${record.author} · 更新于 ${record.date} · ${statusLabels[record.status]} · ${record.category}`;
    const content = document.getElementById('reader-content');
    content.replaceChildren(create('h3','',record.heading),create('p','',record.body),create('p','reader-callout',record.question),create('p','',record.detail));
    document.getElementById('reader-history').textContent = record.history;
    reader.querySelector('details').open = false;
    if (!reader.open) { reader.showModal(); document.body.style.overflow = 'hidden'; }
  }
  document.addEventListener('click', event => { const trigger = event.target.closest('[data-doc]'); if (trigger) openRecord(trigger.dataset.doc); });
  document.getElementById('close-reader').addEventListener('click', () => reader.close());
  document.getElementById('done-reader').addEventListener('click', () => reader.close());
  reader.addEventListener('close', () => { document.body.style.overflow = ''; });
  reader.addEventListener('click', event => { if (event.target === reader) { const bounds = reader.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) reader.close(); } });
  document.addEventListener('keydown', event => { if (event.key === '/' && !reader.open && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) && !event.ctrlKey && !event.metaKey && !event.altKey) { event.preventDefault(); search.focus(); } });
  render();
  const requested = new URLSearchParams(window.location.search).get('doc');
  if (requested) openRecord(requested);
})();
