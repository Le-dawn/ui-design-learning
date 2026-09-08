# 设计任务：全站统一风格（作用于整个项目）
请为整个项目设计一套统一视觉语言：以下风格与 tokens 作用于项目的**全部页面**——着陆页、工作台、列表/表格页、表单/设置页、弹层、空状态都必须遵守，而不是只做一个单页。当前以「工作台」为主角示例页：先把它完整做到位，其余页面按同一套规则推导。输出全站共享 CSS + 各页面 HTML（亮色 / 暗色 data-theme="dark" 双主题）。

## 设计 tokens（必须严格遵守，不得自造颜色 / 间距 / 字号 / 圆角 / 阴影）

### 强调色
- `--color-accent-base`: #2563eb（亮）/ #487be3（暗）— 主强调色（主按钮、激活链接）
- `--color-accent-hover`: #073ecf（亮）/ #6d99f4（暗）— 强调色悬停态
- `--color-accent-active`: #011d7d（亮）/ #afcbff（暗）— 强调色按压态
- `--color-accent-subtle`: #d7edff（亮）/ #021736（暗）— 浅色强调背景（标签底色）
- `--color-accent-on-accent`: #FFFFFF（亮）/ #FFFFFF（暗）— 主按钮上的对比前景文字（自适应 APCA）
- `--color-focus-ring`: #94c6ff（亮）/ #123a79（暗）— 输入框/按钮聚焦环
- `--color-accent-2`: #8b41d5（亮）/ #9562d1（暗）— 渐变搭档色（主色 ±40° 色相，与主色同明度色度）
- `--gradient-brand`: linear-gradient(135deg, var(--color-accent-base), var(--color-accent-2)) — 品牌主渐变（Hero / 主 CTA 背景）

### 中性色
- `--color-bg-primary`: #f8faff（亮）/ #020307（暗）— 页面背景基底
- `--color-bg-secondary`: #feffff（亮）/ #07090d（暗）— 卡片 / 容器表面层
- `--color-bg-tertiary`: #f3f7fe（亮）/ #141619（暗）— 悬停态背景
- `--color-border`: #d1d8e5（亮）/ #28292a（暗）— 边框与分割线
- `--color-text-primary`: #222428（亮）/ #ced1d6（暗）— 正文主要文字
- `--color-text-secondary`: #66696e（亮）/ #a8abb0（暗）— 次要描述文字与小图标
- `--color-text-muted`: #8c8f95（亮）/ #6e7278（暗）— 输入框占位字与禁用态文字
- `--color-text-emphasis`: #06070a（亮）/ #eceff4（暗）— 标题与高强调文字
- `--color-surface-raised`: #feffff（亮）/ #0e0f13（暗）— 浮层表面（弹窗 / Popover / 下拉）

### 交互态
- `--color-disabled-bg`: #f8faff（亮）/ #020307（暗）— 禁用态背景色
- `--color-disabled-text`: #8c8f95（亮）/ #6e7278（暗）— 禁用态文字颜色（neutral-300 占位级，可辨识）
- `--color-disabled-border`: #d1d8e5（亮）/ #28292a（暗）— 禁用态边框颜色
- `--focus-ring-shadow`: 0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 45%, transparent) — 聚焦环（颜色 + 宽度 + 偏移三件套）

### 辅助色
- `--color-surface-secondary`: #d6e5ff（亮）/ #081123（暗）— 同源大面积辅助背景色
- `--color-surface-secondary-hover`: #aac5f6（亮）/ #13213b（暗）— 同源辅助卡片/悬停层
- `--color-surface-secondary-active`: #7b9ee2（亮）/ #23375f（暗）— 同源辅助选中/高亮态

### 功能色
- `--color-success`: #297d0f（亮）/ #559247（暗）— 确认与成功反馈状态色
- `--color-success-subtle`: #ddf8d7（亮）/ #061603（暗）— 成功反馈淡底背景
- `--color-warning`: #e17b00（亮）/ #c87a14（暗）— 警告与提醒状态色
- `--color-warning-subtle`: #ffe7c7（亮）/ #200b00（暗）— 警告提醒淡底背景
- `--color-error`: #bb061e（亮）/ #c64d49（暗）— 报错与危险删除状态色
- `--color-error-subtle`: #ffdfd9（亮）/ #250505（暗）— 报错危险淡底背景
- `--color-info`: #0077c1（亮）/ #008fc9（暗）— 提示信息与常规通知状态色
- `--color-info-subtle`: #c9f6ff（亮）/ #001424（暗）— 信息提示淡底背景

### 阴影与层级
- `--shadow-color`: color-mix(in srgb, var(--color-text-emphasis) 12%, transparent) — 阴影基底色（派生自最深文字色，暗色模式加深）
- `--shadow-sm`: 0 1px 2px 0 var(--shadow-color) — 轻阴影（卡片）
- `--shadow-md`: 0 2px 4px -1px var(--shadow-color), 0 4px 8px -1px var(--shadow-color) — 中阴影（下拉 / 浮层）
- `--shadow-lg`: 0 8px 16px -2px var(--shadow-color), 0 4px 8px -2px var(--shadow-color) — 重阴影（弹窗 / 悬浮）
- `--shadow-inset`: inset 0 2px 4px color-mix(in srgb, var(--color-text-emphasis) 8%, transparent) — 按压态凹陷（按钮 :active）

### 圆角
- `--radius-sm`: 3px — 仪器倒角（标签 / 输入框）
- `--radius-md`: 4px — 中倒角（按钮 / 卡片）
- `--radius-lg`: 6px — 大倒角（弹窗 / Hero）
- `--radius-inner`: 4px — 嵌套倒角（卡片内嵌按钮 / 标签，外层圆角 − 间距）

### 排版
- `--text-xs`: 0.75rem — 辅助说明 / 标签
- `--text-sm`: 0.875rem — 次要文字 / 按钮
- `--text-base`: 1rem — 正文
- `--text-lg`: 1.125rem — 卡片标题
- `--text-xl`: 1.5rem — 区块标题
- `--text-2xl`: 2rem — 页面标题
- `--text-3xl`: 2.5rem — Hero 标题
- `--leading-tight`: 1.25 — 标题行高
- `--leading-normal`: 1.6 — 正文行高
- `--font-medium`: 500 — 中字重（导航 / 标签）
- `--font-semibold`: 600 — 半粗（卡片标题）
- `--font-bold`: 700 — 粗体（大标题 / 数字）

### 间距阶梯
- `--space-xs`: 0.25rem — space-xs 间距阶梯
- `--space-sm`: 0.5rem — space-sm 间距阶梯
- `--space-md`: 0.75rem — space-md 间距阶梯
- `--space-lg`: 1rem — space-lg 间距阶梯
- `--space-xl`: 1.25rem — space-xl 间距阶梯
- `--space-2xl`: 1.5rem — space-2xl 间距阶梯
- `--space-3xl`: 2rem — space-3xl 间距阶梯
- `--space-4xl`: 2.5rem — space-4xl 间距阶梯
- `--space-5xl`: 3rem — space-5xl 间距阶梯
- `--space-6xl`: 4rem — space-6xl 间距阶梯
- `--space-7xl`: 5rem — space-7xl 间距阶梯
- `--space-8xl`: 6rem — space-8xl 间距阶梯

### 间距语义
- `--space-button-padding-x`: 0.75rem — 按钮左右内边距
- `--space-button-padding-y`: 0.5rem — 按钮上下内边距
- `--space-input-padding-x`: 0.75rem — 输入框左右内边距
- `--space-input-padding-y`: 0.5rem — 输入框上下内边距
- `--space-card-padding`: 1rem — 卡片内边距
- `--space-card-gap`: 0.75rem — 卡片间水平间距
- `--space-section-gap`: 2rem — 大区块垂直间距
- `--space-container-padding`: 1rem — 页面容器左右留白
- `--space-inline-gap`: 0.5rem — 行内元素横向间距 (gap)
- `--space-stack-gap`: 0.75rem — 堆叠元素纵向间距
- `--space-icon-size-sm`: 0.75rem — 小图标尺寸
- `--space-icon-size-md`: 1.25rem — 中图标尺寸
- `--space-icon-size-lg`: 2rem — 大图标尺寸
- `--space-focus-ring-offset`: 0.25rem — 聚焦环外偏移量

## 风格
- 表面：浅底 + 白卡浮起（适中圆角 8–12px + 柔和双层阴影），1px 细边框
- 字体：系统无衬线（Apple 栈），标题加粗 + 正文常规，数字 tabular；不引入特殊字体
- 强调色：标准用法——主按钮实色、链接、选中态、焦点环，一屏 ≤ 3 处
- 交互：hover 轻微上浮 + 阴影加深，active 内凹，过渡 150ms
- 装饰：无网格、无印章、无光斑、无渐变文字；图标用统一描边 SVG
- 气质：大多数成熟 SaaS 的通用面貌——干净、可信、不抢戏

## 页面清单（同一风格贯穿全站，每页先按骨架搭结构再填内容）
- 着陆页：顶栏导航 + Hero 主视觉 + 内容数据区 + 双栏信息区 + 页脚
- 工作台：左侧导航 + 顶栏（标题/搜索/用户）+ 内容面板网格（当前示例页：先完整做到位）
- 列表 / 表格页：工具栏 + 数据表格（行状态 + 操作列）+ 空状态
- 表单 / 设置页：分组卡片（标签 + 输入 + 辅助说明）+ 主 / 次按钮区
- 弹层 / 菜单：浮层表面 + 阴影过渡 + ESC 关闭
- 空状态 / 错误页：图标 + 一句话 + 单个主行动

## 全站规则
- 单一风格源：整个项目只存在这一种风格；所有页面共享同一组 tokens 与同一套组件规范，页内不出现任何未在 tokens 中定义的视觉值
- 组件复用：按钮、输入框、卡片、表格、导航等组件全站复用同一实现（见「组件 CSS」导出），不逐页发明、不逐页另起炉灶
- 结构先于装饰：每页先按页面清单对应的骨架搭结构，再填内容；不得重排骨架，不得在单页里开「风格分支」

## 约束
- 只使用上面给出的 tokens，不得自造任何颜色、间距、字号、圆角、阴影
- 不用渐变文字；不用 emoji 做图标（用统一描边 SVG）
- 阴影必须有偏移 + 模糊（除非风格提示明确要求硬阴影）
- 一屏一个主角元素；内容用中文，可参照天文观测 / 数据平台类文案

## 参考
如需组件级参考代码，请同时复制「组件 CSS」导出并粘贴。