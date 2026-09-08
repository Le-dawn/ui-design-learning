(() => {
  'use strict';
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('chenghe-theme') || 'light'; } catch (_) {}
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('.theme-toggle').forEach(button => {
      button.setAttribute('aria-label', theme === 'dark' ? '切换为亮色主题' : '切换为暗色主题');
      button.querySelector('.theme-label').textContent = theme === 'dark' ? '亮色' : '暗色';
    });
  }
  applyTheme(savedTheme === 'dark' ? 'dark' : 'light');
  document.querySelectorAll('.theme-toggle').forEach(button => button.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('chenghe-theme', next); } catch (_) {}
  }));
  const records = [
    {title:'产品需求评审与决策记录规范', date:'09 月 08 日 10:30', author:'陈晨', status:'已发布', body:'每次需求评审应记录问题背景、讨论结论和负责人。对于暂时未决的事项，补充下一次确认的时间，并关联原始讨论。'},
    {title:'跨团队项目交接时如何完整保留需求背景、关键决策与未解决问题', date:'09 月 08 日 09:15', author:'周宁', status:'待审核', body:'交接文档先说明项目目标与当前进度，再列出关键决策的依据。未解决问题应标明影响范围和后续负责人，便于接手团队持续推进。'},
    {title:'API / CSV 数据导出指南', date:'09 月 08 日 08:45', author:'林晓', status:'已发布', body:'异常处理：当导出失败时，先检查任务状态。如果记录量超过单次上限，请按日期分段导出。导出后核对字段名称与筛选范围；缺少字段时，检查导出配置是否包含该字段。当前版本 v1.3，关联问答：导出后为什么缺少字段？'},
    {title:'新成员第一周：产品团队协作手册', date:'09 月 07 日 16:20', author:'许言', status:'已发布', body:'先了解团队正在推进的项目，再阅读需求评审和发布流程。遇到问题时，优先查找已有知识，并把文档未覆盖的部分记录下来。'},
    {title:'用户反馈分类与处理流程', date:'09 月 07 日 14:00', author:'陈晨', status:'待审核', body:'反馈按使用问题、功能需求与异常报告分类。保留用户描述和上下文，确认影响范围后关联相应需求或问题记录。'},
    {title:'九月产品迭代复盘笔记', date:'09 月 06 日 11:30', author:'林晓', status:'草稿', body:'本次复盘关注需求变更和跨团队沟通。待补充：每项改进对应的负责人、验证方式，以及下一次回顾时间。'}
  ];
  const list = document.getElementById('records');
  if (!list) return;
  const search = document.getElementById('knowledge-search');
  const filters = [...document.querySelectorAll('[data-status]')];
  let status = '全部';
  const statusClass = value => value === '已发布' ? 'published' : value === '待审核' ? 'review' : '';
  function render() {
    const query = search.value.trim().toLocaleLowerCase();
    list.replaceChildren();
    let count = 0;
    records.forEach((record, index) => {
      if ((status !== '全部' && record.status !== status) || !record.title.toLocaleLowerCase().includes(query)) return;
      count++;
      const button = document.createElement('button');
      button.className = 'record'; button.type = 'button'; button.dataset.record = index;
      const text = document.createElement('span');
      const title = document.createElement('span'); title.className = 'record-title'; title.textContent = record.title;
      const meta = document.createElement('span'); meta.className = 'record-meta'; meta.textContent = `${record.date} · ${record.author}`;
      const badge = document.createElement('span'); badge.className = `badge ${statusClass(record.status)}`; badge.textContent = record.status;
      text.append(title, meta); button.append(text, badge); list.append(button);
    });
    document.getElementById('result-count').textContent = `${count} 条知识`;
    document.getElementById('empty').hidden = count !== 0;
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.status === status)));
  }
  search.addEventListener('input', render);
  filters.forEach(button => button.addEventListener('click', () => { status = button.dataset.status; render(); }));
  document.getElementById('reset-search').addEventListener('click', () => { search.value = ''; status = '全部'; render(); search.focus(); });
  const dialog = document.getElementById('record-dialog');
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-record]');
    if (!trigger) return;
    const record = records[Number(trigger.dataset.record)];
    document.getElementById('dialog-title').textContent = record.title;
    document.getElementById('dialog-meta').textContent = `${record.author} · ${record.date} 更新`;
    document.getElementById('dialog-body').textContent = record.body;
    const badge = document.getElementById('dialog-status'); badge.textContent = record.status; badge.className = `badge ${statusClass(record.status)}`;
    dialog.showModal();
  });
  document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
  render();
})();
