# Web 设计上下文
将本上下文与需求侧提供的业务需求一起使用。业务、页面数量、内容、功能与事实以需求为准；示例品牌和示例数据不属于需求。

## 品牌共性
- 风格：流光。透明叠层与清晰的前景，光效集中在重要内容
- 表面语言：展示区域可用透明与模糊；表格、表单、长文使用稳定不透明表面
- 形状：10px / 16px / 16px；同类组件全站一致。
- 需求事实与用户明确选择 → 品牌共性 → 页面用途默认 → 主题。用途调整尺度与密度，不替换品牌。
- 页面拓扑、内容顺序、主视觉表现形式由真实任务推导；不要机械复刻示例业务或强制双栏 Hero。

## 自动判断页面用途
先根据每页的主要任务选择下列用途。列表、表单、弹层继承所属页面用途。混合页面以主要任务为准，局部表达保持明确边界。
当前预览：工作操作；其他页面不必采用同一用途。
色彩策略：用户明确选择“投入”，各用途都保留此选择并适配区域。

### persuade / 营销说服
- 目的：理解价值、查看真实证明并决定是否行动
- 布局：从价值主张到具体证明再到行动；按需求选择主视觉和布局，不固定双栏 Hero。
- 密度：首屏主次明确；证明区可以密集，章节之间保留呼吸。
- 色彩：品牌区域可承担显著面积；主行动必须与所在背景区分。 当前适用策略：投入。
- 动效：一次与核心展示有关的运动；其他交互提供短反馈
- 显示标题 clamp(2.25rem, 4.8vw, 4rem)；页面标题 1.75rem；正文 1rem / 1.75；正文行宽 32em。
- 页面根节点使用 data-ce-mode="persuade"。

### operate / 工作操作
- 目的：快速扫描当前状态、定位结果并完成操作
- 布局：按任务重要性排列结果、筛选、数据与操作；导航和表格使用熟悉结构，侧栏在窄屏重排。
- 密度：稳定行高、列对齐；关键结果显眼，辅助记录紧凑，图表面积匹配信息量。
- 色彩：默认克制；明确选择强色策略时，重点报告区用强色，输入与数据表面保持可读。 当前适用策略：投入。
- 动效：仅状态、反馈、展开与加载；无持续辉光或页面入场演出
- 显示标题 1.5rem；页面标题 1.25rem；正文 0.9375rem / 1.6；正文行宽 38em。
- 页面根节点使用 data-ce-mode="operate"。

### read / 内容阅读
- 目的：持续理解正文并在章节之间导航
- 布局：正文是中心，目录和旁注服务阅读；中文正文目标约 28–36 个全角字/行，随字号和视口收缩。
- 密度：段内连续，段间适度分开；章节标题上方留白大于下方，长文不装进重复卡片。
- 色彩：正文表面低干扰；强品牌色可用于封面或章节引导，链接与当前阅读位置可辨。 当前适用策略：投入。
- 动效：阅读位置和导航反馈；正文不作进场动画
- 显示标题 2.25rem；页面标题 1.75rem；正文 1.0625rem / 1.9；正文行宽 34em。
- 页面根节点使用 data-ce-mode="read"。

### experience / 作品展示
- 目的：查看作品、媒体或过程并理解其关系
- 布局：作品决定比例、留白和浏览顺序；展示对象从首屏开始占据主位，不强制营销 Hero 或指标卡。
- 密度：让展示对象拥有足够尺寸，辅助说明服从作品；作品信息不靠装饰替代。
- 色彩：色彩跟随作品和品牌区域；界面前景与媒体分离，确保导航可辨。 当前适用策略：投入。
- 动效：一个与作品浏览或转换有关的关键运动；内容默认可见
- 显示标题 clamp(2.5rem, 6vw, 5.5rem)；页面标题 2rem；正文 1rem / 1.75；正文行宽 30em。
- 页面根节点使用 data-ce-mode="experience"。

## 区域配色
- 区域角色：brand（品牌主区域）、auxiliary（辅助内容区域）、canvas（画布本身）。区域类：.ce-region-brand。
- 把区域类放在页面根或整块区块上；进入区域后，按钮、输入框、链接、边框与焦点环自动换成该区域的配对颜色，不需要为区域内组件另写一套样式。
- 当前策略：投入。一个完整品牌区域承担视觉重点；其余区域保持中性。
- 区域位置、面积和形状由内容重要性决定，不固定拓扑；不要给每个面板都上色，也不要用颜色数量代替层次。
- 面积比例是策略建议而非硬指标：营销首屏的品牌区域可以占较大面积，工作台只让承担重点内容的区域上色，阅读页面保持低干扰。
- 主行动必须与所在区域背景可分辨：品牌背景上用区域行动色，不要用与背景同色的品牌按钮。
- 功能色（成功、警告、错误、信息）保持语义，不当作分区或装饰颜色；品牌装饰色也不要解释成状态。
- 区域内文字、次要文字、边框与焦点环成对使用；亮暗主题各自生成层次，不机械反转。

## 字体与中文排版
- 字体角色：中文展示、中文正文、拉丁展示、数字数据。同一字体可以承担多个角色；不要求五种风格各用一套字体。
- 当前风格字形：细笔画、字面偏窄、留白大；标题用细字重并放宽字距
- 展示字体：`"Helvetica Neue", "Inter", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif`
- 中文正文：`"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif`
- 数据与代码：`"SF Mono", Menlo, "Cascadia Code", Consolas, ui-monospace, monospace`，配合 font-variant-numeric: tabular-nums。
- 排版角色：展示标题 / 页面标题 / 区块标题 / 正文 / 标签与控件 / 辅助说明 / 数据与代码；字号、行高、字距、行宽见下方字体与用途 token。
- 中文行宽：正文按全角字数控制（38em），不直接套用英文 65–75ch；阅读页面优先保证行长与段落节奏。
- 换行与标点：标题平衡断行、不产生单字末行；正文按字换行、行末不孤悬标点；不用写死 <br> 维持布局。
- 缺字、加载失败与离线：按字体栈的回退顺序落到平台原生中文字体（PingFang SC / Microsoft YaHei / Songti SC），标题不因缺字溢出。
- 可选品牌展示字体随下方 @font-face 提供（OFL-1.1）；自托管前不影响布局与阅读。

## 实施与验证
- 保持品牌、颜色语义和组件语言。优先使用角色变量；内容需要的构图、展示尺寸可在用途范围内推导，新增共性规则须统一命名。
- 首先确定阅读顺序、主要内容的表现形式和面积，再实现；重要性与视觉重量对应。
- 有浏览器能力时检查实际首屏和窄屏：主次、字形、区域配色、长文本与交互。修正主要问题后再扩展其余页面；无渲染能力时如实标明未验证。
- 图形、照片与作品必须服务业务内容；不得虚构商业事实，合成演示明确标注。
- 交互完整实现默认、悬停、焦点、按压、禁用、加载、错误和空状态。尊重键盘、缩放和减少动态效果偏好。

## 设计变量
### 强调色
- `--color-accent-base`: #2563eb（亮） / #487be3（暗） — 主强调色（主按钮、激活链接）
- `--color-accent-hover`: #073ecf（亮） / #6d99f4（暗） — 强调色悬停态
- `--color-accent-active`: #011d7d（亮） / #afcbff（暗） — 强调色按压态
- `--color-accent-subtle`: #d7edff（亮） / #021736（暗） — 浅色强调背景（标签底色）
- `--color-accent-on-accent`: #FFFFFF — 主按钮上的对比前景文字（自适应 APCA）
- `--color-focus-ring`: #94c6ff（亮） / #123a79（暗） — 输入框/按钮聚焦环
- `--color-accent-2`: #8b41d5（亮） / #9562d1（暗） — 渐变搭档色（主色 ±40° 色相，与主色同明度色度）
- `--gradient-brand`: linear-gradient(135deg, var(--color-accent-base), var(--color-accent-2)) — 品牌主渐变（Hero / 主 CTA 背景）
### 中性色
- `--color-bg-primary`: #f8faff（亮） / #020307（暗） — 页面背景基底
- `--color-bg-secondary`: #feffff（亮） / #07090d（暗） — 卡片 / 容器表面层
- `--color-bg-tertiary`: #f3f7fe（亮） / #141619（暗） — 悬停态背景
- `--color-border`: #d1d8e5（亮） / #28292a（暗） — 边框与分割线
- `--color-text-primary`: #222428（亮） / #ced1d6（暗） — 正文主要文字
- `--color-text-secondary`: #66696e（亮） / #a8abb0（暗） — 次要描述文字与小图标
- `--color-text-muted`: #8c8f95（亮） / #6e7278（暗） — 输入框占位字与禁用态文字
- `--color-text-emphasis`: #06070a（亮） / #eceff4（暗） — 标题与高强调文字
- `--color-surface-raised`: #feffff（亮） / #0e0f13（暗） — 浮层表面（弹窗 / Popover / 下拉）
### 交互态
- `--color-disabled-bg`: #f8faff（亮） / #020307（暗） — 禁用态背景色
- `--color-disabled-text`: #8c8f95（亮） / #6e7278（暗） — 禁用态文字颜色（neutral-300 占位级，可辨识）
- `--color-disabled-border`: #d1d8e5（亮） / #28292a（暗） — 禁用态边框颜色
- `--focus-ring-shadow`: 0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 45%, transparent) — 聚焦环（颜色 + 宽度 + 偏移三件套）
### 辅助色
- `--color-surface-secondary`: #d6e5ff（亮） / #081123（暗） — 同源大面积辅助背景色
- `--color-surface-secondary-hover`: #aac5f6（亮） / #13213b（暗） — 同源辅助卡片/悬停层
- `--color-surface-secondary-active`: #7b9ee2（亮） / #23375f（暗） — 同源辅助选中/高亮态
### 功能色
- `--color-success`: #297d0f（亮） / #559247（暗） — 确认与成功反馈状态色
- `--color-success-subtle`: #ddf8d7（亮） / #061603（暗） — 成功反馈淡底背景
- `--color-warning`: #e17b00（亮） / #c87a14（暗） — 警告与提醒状态色
- `--color-warning-subtle`: #ffe7c7（亮） / #200b00（暗） — 警告提醒淡底背景
- `--color-error`: #bb061e（亮） / #c64d49（暗） — 报错与危险删除状态色
- `--color-error-subtle`: #ffdfd9（亮） / #250505（暗） — 报错危险淡底背景
- `--color-info`: #0077c1（亮） / #008fc9（暗） — 提示信息与常规通知状态色
- `--color-info-subtle`: #c9f6ff（亮） / #001424（暗） — 信息提示淡底背景
### 阴影与层级
- `--shadow-color`: color-mix(in srgb, var(--color-text-emphasis) 12%, transparent)（亮） / color-mix(in srgb, var(--color-text-emphasis) 16%, transparent)（暗） — 阴影基底色（派生自最深文字色，暗色模式加深）
- `--shadow-sm`: 0 1px 2px 0 var(--shadow-color) — 轻阴影（卡片）
- `--shadow-md`: 0 2px 4px -1px var(--shadow-color), 0 4px 8px -1px var(--shadow-color) — 中阴影（下拉 / 浮层）
- `--shadow-lg`: 0 8px 16px -2px var(--shadow-color), 0 4px 8px -2px var(--shadow-color) — 重阴影（弹窗 / 悬浮）
- `--shadow-inset`: inset 0 2px 4px color-mix(in srgb, var(--color-text-emphasis) 8%, transparent)（亮） / inset 0 2px 4px color-mix(in srgb, var(--color-text-emphasis) 10%, transparent)（暗） — 按压态凹陷（按钮 :active）
### 形状
- `--radius-inner`: 4px — 嵌套倒角（卡片内嵌按钮 / 标签，外层圆角 − 间距）
- `--radius-sm`: 10px — 流光品牌形状
- `--radius-md`: 16px — 流光品牌形状
- `--radius-lg`: 16px — 流光品牌形状
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
### 页面用途
- `--type-display-size`: 1.5rem — 工作操作用途角色
- `--type-title-size`: 1.25rem — 工作操作用途角色
- `--type-section-size`: 1.125rem — 工作操作用途角色
- `--type-body-size`: 0.9375rem — 工作操作用途角色
- `--type-label-size`: 0.875rem — 工作操作用途角色
- `--type-meta-size`: 0.75rem — 工作操作用途角色
- `--type-display-leading`: 1.4 — 工作操作用途角色
- `--type-body-leading`: 1.6 — 工作操作用途角色
- `--type-display-weight`: 650 — 工作操作用途角色
- `--type-display-tracking`: 0em — 工作操作用途角色
- `--measure-title`: none — 工作操作用途角色
- `--measure-prose`: 38em — 工作操作用途角色
- `--layout-content-width`: 90rem — 工作操作用途角色
- `--layout-section-gap`: 1.5rem — 工作操作用途角色
- `--layout-panel-padding`: 1rem — 工作操作用途角色
- `--layout-stack-gap`: 0.5rem — 工作操作用途角色
- `--layout-control-padding`: 0.5rem — 工作操作用途角色
- `--motion-feedback-duration`: 160ms — 工作操作用途角色
### 区域配色
- `--region-brand-bg`: #225cdc（亮） / #002689（暗） — 区域背景
- `--region-brand-text`: #f2fbff — 区域正文
- `--region-brand-text-secondary`: #bcc6da — 区域次要文字
- `--region-brand-border`: #8593ab（亮） / #4f5b72（暗） — 区域边框
- `--region-brand-surface`: #3d75eb（亮） / #163f99（暗） — 区域内层表面
- `--region-brand-action`: #f3faff — 区域内浅色表面
- `--region-brand-action-text`: #090a0c — 区域内行动文字
- `--region-brand-focus`: #f3faff — 区域内焦点环
- `--region-brand-success`: #8bcd7d（亮） / #559247（暗） — 区域内成功状态色
- `--region-brand-warning`: #ffa93c（亮） / #c87a14（暗） — 区域内警告状态色
- `--region-brand-error`: #3d0000（亮） / #cd5551（暗） — 区域内错误状态色
- `--region-brand-info`: #41caff（亮） / #008fc9（暗） — 区域内信息状态色
### 字体
- `--font-display`: "Helvetica Neue", "Inter", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif — 流光展示字体。细笔画、字面偏窄、留白大；标题用细字重并放宽字距
- `--font-body`: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif — 中文正文字体
- `--font-data`: "SF Mono", Menlo, "Cascadia Code", Consolas, ui-monospace, monospace — 数据与代码字体，配合 tabular-nums
- `--font-cn-display`: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif — 中文展示字体（缺字回退顺序）
- `--font-cn-body`: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif — 中文正文字体（缺字回退顺序）
- `--font-latin-display`: "Helvetica Neue", "Inter", "Segoe UI", sans-serif — 拉丁展示字体
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
- `--space-card-padding`: 1rem — 工作操作内容表面内边距
- `--space-card-gap`: 0.75rem — 卡片间水平间距
- `--space-section-gap`: 1.5rem — 工作操作区块垂直间距
- `--space-container-padding`: 1rem — 页面容器左右留白
- `--space-inline-gap`: 0.5rem — 行内元素横向间距 (gap)
- `--space-stack-gap`: 0.5rem — 堆叠元素纵向间距
- `--space-icon-size-sm`: 0.75rem — 小图标尺寸
- `--space-icon-size-md`: 1.25rem — 中图标尺寸
- `--space-icon-size-lg`: 2rem — 大图标尺寸
- `--space-focus-ring-offset`: 0.25rem — 聚焦环外偏移量

## 可直接使用的主题与用途 CSS
外层使用 data-theme="dark" 切换暗色；页面根使用 ce-surface 和对应 data-ce-mode。组件样式可使用单独的“组件 CSS”导出。
```css
/* Color Engine：共享品牌、双主题、四种页面用途。 */
:root {
  /* 强调色 */
  --color-accent-base: #2563eb; /* 主强调色（主按钮、激活链接） */
  --color-accent-hover: #073ecf; /* 强调色悬停态 */
  --color-accent-active: #011d7d; /* 强调色按压态 */
  --color-accent-subtle: #d7edff; /* 浅色强调背景（标签底色） */
  --color-accent-on-accent: #FFFFFF; /* 主按钮上的对比前景文字（自适应 APCA） */
  --color-focus-ring: #94c6ff; /* 输入框/按钮聚焦环 */
  --color-accent-2: #8b41d5; /* 渐变搭档色（主色 ±40° 色相，与主色同明度色度） */
  --gradient-brand: linear-gradient(135deg, var(--color-accent-base), var(--color-accent-2)); /* 品牌主渐变（Hero / 主 CTA 背景） */
  /* 中性色 */
  --color-bg-primary: #f8faff; /* 页面背景基底 */
  --color-bg-secondary: #feffff; /* 卡片 / 容器表面层 */
  --color-bg-tertiary: #f3f7fe; /* 悬停态背景 */
  --color-border: #d1d8e5; /* 边框与分割线 */
  --color-text-primary: #222428; /* 正文主要文字 */
  --color-text-secondary: #66696e; /* 次要描述文字与小图标 */
  --color-text-muted: #8c8f95; /* 输入框占位字与禁用态文字 */
  --color-text-emphasis: #06070a; /* 标题与高强调文字 */
  --color-surface-raised: #feffff; /* 浮层表面（弹窗 / Popover / 下拉） */
  /* 交互态 */
  --color-disabled-bg: #f8faff; /* 禁用态背景色 */
  --color-disabled-text: #8c8f95; /* 禁用态文字颜色（neutral-300 占位级，可辨识） */
  --color-disabled-border: #d1d8e5; /* 禁用态边框颜色 */
  --focus-ring-shadow: 0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 45%, transparent); /* 聚焦环（颜色 + 宽度 + 偏移三件套） */
  /* 辅助色 */
  --color-surface-secondary: #d6e5ff; /* 同源大面积辅助背景色 */
  --color-surface-secondary-hover: #aac5f6; /* 同源辅助卡片/悬停层 */
  --color-surface-secondary-active: #7b9ee2; /* 同源辅助选中/高亮态 */
  /* 功能色 */
  --color-success: #297d0f; /* 确认与成功反馈状态色 */
  --color-success-subtle: #ddf8d7; /* 成功反馈淡底背景 */
  --color-warning: #e17b00; /* 警告与提醒状态色 */
  --color-warning-subtle: #ffe7c7; /* 警告提醒淡底背景 */
  --color-error: #bb061e; /* 报错与危险删除状态色 */
  --color-error-subtle: #ffdfd9; /* 报错危险淡底背景 */
  --color-info: #0077c1; /* 提示信息与常规通知状态色 */
  --color-info-subtle: #c9f6ff; /* 信息提示淡底背景 */
  /* 阴影与层级 */
  --shadow-color: color-mix(in srgb, var(--color-text-emphasis) 12%, transparent); /* 阴影基底色（派生自最深文字色，暗色模式加深） */
  --shadow-sm: 0 1px 2px 0 var(--shadow-color); /* 轻阴影（卡片） */
  --shadow-md: 0 2px 4px -1px var(--shadow-color), 0 4px 8px -1px var(--shadow-color); /* 中阴影（下拉 / 浮层） */
  --shadow-lg: 0 8px 16px -2px var(--shadow-color), 0 4px 8px -2px var(--shadow-color); /* 重阴影（弹窗 / 悬浮） */
  --shadow-inset: inset 0 2px 4px color-mix(in srgb, var(--color-text-emphasis) 8%, transparent); /* 按压态凹陷（按钮 :active） */
  /* 形状 */
  --radius-inner: 4px; /* 嵌套倒角（卡片内嵌按钮 / 标签，外层圆角 − 间距） */
  --radius-sm: 10px; /* 流光品牌形状 */
  --radius-md: 16px; /* 流光品牌形状 */
  --radius-lg: 16px; /* 流光品牌形状 */
  /* 排版 */
  --text-xs: 0.75rem; /* 辅助说明 / 标签 */
  --text-sm: 0.875rem; /* 次要文字 / 按钮 */
  --text-base: 1rem; /* 正文 */
  --text-lg: 1.125rem; /* 卡片标题 */
  --text-xl: 1.5rem; /* 区块标题 */
  --text-2xl: 2rem; /* 页面标题 */
  --text-3xl: 2.5rem; /* Hero 标题 */
  --leading-tight: 1.25; /* 标题行高 */
  --leading-normal: 1.6; /* 正文行高 */
  --font-medium: 500; /* 中字重（导航 / 标签） */
  --font-semibold: 600; /* 半粗（卡片标题） */
  --font-bold: 700; /* 粗体（大标题 / 数字） */
  /* 页面用途 */
  --type-display-size: 1.5rem; /* 工作操作用途角色 */
  --type-title-size: 1.25rem; /* 工作操作用途角色 */
  --type-section-size: 1.125rem; /* 工作操作用途角色 */
  --type-body-size: 0.9375rem; /* 工作操作用途角色 */
  --type-label-size: 0.875rem; /* 工作操作用途角色 */
  --type-meta-size: 0.75rem; /* 工作操作用途角色 */
  --type-display-leading: 1.4; /* 工作操作用途角色 */
  --type-body-leading: 1.6; /* 工作操作用途角色 */
  --type-display-weight: 650; /* 工作操作用途角色 */
  --type-display-tracking: 0em; /* 工作操作用途角色 */
  --measure-title: none; /* 工作操作用途角色 */
  --measure-prose: 38em; /* 工作操作用途角色 */
  --layout-content-width: 90rem; /* 工作操作用途角色 */
  --layout-section-gap: 1.5rem; /* 工作操作用途角色 */
  --layout-panel-padding: 1rem; /* 工作操作用途角色 */
  --layout-stack-gap: 0.5rem; /* 工作操作用途角色 */
  --layout-control-padding: 0.5rem; /* 工作操作用途角色 */
  --motion-feedback-duration: 160ms; /* 工作操作用途角色 */
  /* 区域配色 */
  --region-brand-bg: #225cdc; /* 区域背景 */
  --region-brand-text: #f2fbff; /* 区域正文 */
  --region-brand-text-secondary: #bcc6da; /* 区域次要文字 */
  --region-brand-border: #8593ab; /* 区域边框 */
  --region-brand-surface: #3d75eb; /* 区域内层表面 */
  --region-brand-action: #f3faff; /* 区域内浅色表面 */
  --region-brand-action-text: #090a0c; /* 区域内行动文字 */
  --region-brand-focus: #f3faff; /* 区域内焦点环 */
  --region-brand-success: #8bcd7d; /* 区域内成功状态色 */
  --region-brand-warning: #ffa93c; /* 区域内警告状态色 */
  --region-brand-error: #3d0000; /* 区域内错误状态色 */
  --region-brand-info: #41caff; /* 区域内信息状态色 */
  /* 字体 */
  --font-display: "Helvetica Neue", "Inter", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif; /* 流光展示字体。细笔画、字面偏窄、留白大；标题用细字重并放宽字距 */
  --font-body: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif; /* 中文正文字体 */
  --font-data: "SF Mono", Menlo, "Cascadia Code", Consolas, ui-monospace, monospace; /* 数据与代码字体，配合 tabular-nums */
  --font-cn-display: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif; /* 中文展示字体（缺字回退顺序） */
  --font-cn-body: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif; /* 中文正文字体（缺字回退顺序） */
  --font-latin-display: "Helvetica Neue", "Inter", "Segoe UI", sans-serif; /* 拉丁展示字体 */
  /* 间距阶梯 */
  --space-xs: 0.25rem; /* space-xs 间距阶梯 */
  --space-sm: 0.5rem; /* space-sm 间距阶梯 */
  --space-md: 0.75rem; /* space-md 间距阶梯 */
  --space-lg: 1rem; /* space-lg 间距阶梯 */
  --space-xl: 1.25rem; /* space-xl 间距阶梯 */
  --space-2xl: 1.5rem; /* space-2xl 间距阶梯 */
  --space-3xl: 2rem; /* space-3xl 间距阶梯 */
  --space-4xl: 2.5rem; /* space-4xl 间距阶梯 */
  --space-5xl: 3rem; /* space-5xl 间距阶梯 */
  --space-6xl: 4rem; /* space-6xl 间距阶梯 */
  --space-7xl: 5rem; /* space-7xl 间距阶梯 */
  --space-8xl: 6rem; /* space-8xl 间距阶梯 */
  /* 间距语义 */
  --space-button-padding-x: 0.75rem; /* 按钮左右内边距 */
  --space-button-padding-y: 0.5rem; /* 按钮上下内边距 */
  --space-input-padding-x: 0.75rem; /* 输入框左右内边距 */
  --space-input-padding-y: 0.5rem; /* 输入框上下内边距 */
  --space-card-padding: 1rem; /* 工作操作内容表面内边距 */
  --space-card-gap: 0.75rem; /* 卡片间水平间距 */
  --space-section-gap: 1.5rem; /* 工作操作区块垂直间距 */
  --space-container-padding: 1rem; /* 页面容器左右留白 */
  --space-inline-gap: 0.5rem; /* 行内元素横向间距 (gap) */
  --space-stack-gap: 0.5rem; /* 堆叠元素纵向间距 */
  --space-icon-size-sm: 0.75rem; /* 小图标尺寸 */
  --space-icon-size-md: 1.25rem; /* 中图标尺寸 */
  --space-icon-size-lg: 2rem; /* 大图标尺寸 */
  --space-focus-ring-offset: 0.25rem; /* 聚焦环外偏移量 */
}
[data-theme="dark"] {
  --color-accent-base: #487be3;
  --color-accent-hover: #6d99f4;
  --color-accent-active: #afcbff;
  --color-accent-subtle: #021736;
  --color-accent-on-accent: #FFFFFF;
  --color-focus-ring: #123a79;
  --color-bg-primary: #020307;
  --color-bg-secondary: #07090d;
  --color-bg-tertiary: #141619;
  --color-border: #28292a;
  --color-text-primary: #ced1d6;
  --color-text-secondary: #a8abb0;
  --color-text-muted: #6e7278;
  --color-text-emphasis: #eceff4;
  --color-disabled-bg: #020307;
  --color-disabled-text: #6e7278;
  --color-disabled-border: #28292a;
  --color-surface-secondary: #081123;
  --color-surface-secondary-hover: #13213b;
  --color-surface-secondary-active: #23375f;
  --color-success: #559247;
  --color-success-subtle: #061603;
  --color-warning: #c87a14;
  --color-warning-subtle: #200b00;
  --color-error: #c64d49;
  --color-error-subtle: #250505;
  --color-info: #008fc9;
  --color-info-subtle: #001424;
  --color-accent-2: #9562d1;
  --gradient-brand: linear-gradient(135deg, var(--color-accent-base), var(--color-accent-2));
  --color-surface-raised: #0e0f13;
  --shadow-color: color-mix(in srgb, var(--color-text-emphasis) 16%, transparent);
  --shadow-sm: 0 1px 2px 0 var(--shadow-color);
  --shadow-md: 0 2px 4px -1px var(--shadow-color), 0 4px 8px -1px var(--shadow-color);
  --shadow-lg: 0 8px 16px -2px var(--shadow-color), 0 4px 8px -2px var(--shadow-color);
  --radius-inner: 4px;
  --focus-ring-shadow: 0 0 0 3px color-mix(in srgb, var(--color-focus-ring) 45%, transparent);
  --shadow-inset: inset 0 2px 4px color-mix(in srgb, var(--color-text-emphasis) 10%, transparent);
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.5rem;
  --text-2xl: 2rem;
  --text-3xl: 2.5rem;
  --leading-tight: 1.25;
  --leading-normal: 1.6;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --type-display-size: 1.5rem;
  --type-title-size: 1.25rem;
  --type-section-size: 1.125rem;
  --type-body-size: 0.9375rem;
  --type-label-size: 0.875rem;
  --type-meta-size: 0.75rem;
  --type-display-leading: 1.4;
  --type-body-leading: 1.6;
  --type-display-weight: 650;
  --type-display-tracking: 0em;
  --measure-title: none;
  --measure-prose: 38em;
  --layout-content-width: 90rem;
  --layout-section-gap: 1.5rem;
  --layout-panel-padding: 1rem;
  --layout-stack-gap: 0.5rem;
  --layout-control-padding: 0.5rem;
  --motion-feedback-duration: 160ms;
  --radius-sm: 10px;
  --radius-md: 16px;
  --radius-lg: 16px;
  --font-display: "Helvetica Neue", "Inter", "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  --font-body: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  --font-data: "SF Mono", Menlo, "Cascadia Code", Consolas, ui-monospace, monospace;
  --font-cn-display: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  --font-cn-body: "PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif;
  --font-latin-display: "Helvetica Neue", "Inter", "Segoe UI", sans-serif;
  --region-brand-bg: #002689;
  --region-brand-text: #f2fbff;
  --region-brand-text-secondary: #bcc6da;
  --region-brand-border: #4f5b72;
  --region-brand-surface: #163f99;
  --region-brand-action: #f3faff;
  --region-brand-action-text: #090a0c;
  --region-brand-focus: #f3faff;
  --region-brand-success: #559247;
  --region-brand-warning: #c87a14;
  --region-brand-error: #cd5551;
  --region-brand-info: #008fc9;
}
[data-ce-mode="persuade"] {
  --type-display-size: clamp(2.25rem, 4.8vw, 4rem);
  --type-title-size: 1.75rem;
  --type-section-size: 1.375rem;
  --type-body-size: 1rem;
  --type-label-size: 0.875rem;
  --type-meta-size: 0.75rem;
  --type-display-leading: 1.16;
  --type-body-leading: 1.75;
  --type-display-weight: 700;
  --type-display-tracking: -0.025em;
  --measure-title: 14em;
  --measure-prose: 32em;
  --layout-content-width: 72rem;
  --layout-section-gap: 6rem;
  --layout-panel-padding: 1.5rem;
  --layout-stack-gap: 0.75rem;
  --layout-control-padding: 0.5rem;
  --motion-feedback-duration: 220ms;
}

[data-ce-mode="operate"] {
  --type-display-size: 1.5rem;
  --type-title-size: 1.25rem;
  --type-section-size: 1.125rem;
  --type-body-size: 0.9375rem;
  --type-label-size: 0.875rem;
  --type-meta-size: 0.75rem;
  --type-display-leading: 1.4;
  --type-body-leading: 1.6;
  --type-display-weight: 650;
  --type-display-tracking: 0em;
  --measure-title: none;
  --measure-prose: 38em;
  --layout-content-width: 90rem;
  --layout-section-gap: 1.5rem;
  --layout-panel-padding: 1rem;
  --layout-stack-gap: 0.5rem;
  --layout-control-padding: 0.5rem;
  --motion-feedback-duration: 160ms;
}

[data-ce-mode="read"] {
  --type-display-size: 2.25rem;
  --type-title-size: 1.75rem;
  --type-section-size: 1.375rem;
  --type-body-size: 1.0625rem;
  --type-label-size: 0.875rem;
  --type-meta-size: 0.8125rem;
  --type-display-leading: 1.4;
  --type-body-leading: 1.9;
  --type-display-weight: 650;
  --type-display-tracking: 0em;
  --measure-title: 18em;
  --measure-prose: 34em;
  --layout-content-width: 68rem;
  --layout-section-gap: 4rem;
  --layout-panel-padding: 1.5rem;
  --layout-stack-gap: 1rem;
  --layout-control-padding: 0.5rem;
  --motion-feedback-duration: 160ms;
}

[data-ce-mode="experience"] {
  --type-display-size: clamp(2.5rem, 6vw, 5.5rem);
  --type-title-size: 2rem;
  --type-section-size: 1.375rem;
  --type-body-size: 1rem;
  --type-label-size: 0.875rem;
  --type-meta-size: 0.75rem;
  --type-display-leading: 1.12;
  --type-body-leading: 1.75;
  --type-display-weight: 700;
  --type-display-tracking: -0.025em;
  --measure-title: 12em;
  --measure-prose: 30em;
  --layout-content-width: 90rem;
  --layout-section-gap: 6rem;
  --layout-panel-padding: 1.5rem;
  --layout-stack-gap: 0.75rem;
  --layout-control-padding: 0.5rem;
  --motion-feedback-duration: 240ms;
}
/* 用途作用于页面根；局部组件继承所属页面，不另造品牌。 */
.ce-surface { font-family: var(--ce-body, var(--font-body)); font-size: var(--type-body-size); line-height: var(--type-body-leading); color: var(--color-text-primary); }
.ce-surface :is(h1,h2,h3,p,figure) { margin: 0; }
.ce-surface :is(h1,.ce-hero-title) { font-family: var(--ce-display, var(--font-display)); font-size: var(--type-display-size); line-height: var(--type-display-leading); font-weight: var(--ce-display-weight, var(--type-display-weight)); letter-spacing: var(--ce-display-tracking, var(--type-display-tracking)); max-width: var(--measure-title); text-wrap: balance; overflow-wrap: anywhere; }
.ce-surface :is(h2,.ce-split-title) { font-family: var(--ce-display, var(--font-display)); font-size: var(--type-section-size); line-height: 1.45; }
.ce-surface :is(p,.ce-hero-sub,.ce-split-copy) { font-size: var(--type-body-size); line-height: var(--type-body-leading); max-width: var(--measure-prose); overflow-wrap: anywhere; text-wrap: pretty; }
.ce-surface :is(.ce-metric-num,.ce-row-time,.ce-panel-count,.ce-target-status,.ce-plate-epoch,.ce-app-sub,.ce-hero-meta) { font-family: var(--ce-mono, var(--font-data)); font-variant-numeric: tabular-nums; }
.ce-surface.ce-landing { max-width: var(--layout-content-width); gap: var(--layout-section-gap); padding: var(--space-2xl) 0 var(--space-5xl); }
.ce-surface .ce-hero-sub { margin-top: var(--space-lg); }
.ce-surface :is(.ce-panel,.ce-app-main,.ce-hero > *, .ce-split > *) { min-width: 0; }
.ce-surface :is(.ce-btn,.ce-search input) { font-family: var(--ce-body); font-size: var(--type-label-size); line-height: 1.5; }
.ce-surface :is(.ce-btn,.ce-side-item) { transition-duration: var(--motion-feedback-duration); }
.ce-surface[data-ce-mode="operate"] { --ce-display: var(--ce-body); --ce-display-weight: 650; --ce-display-tracking: 0em; }
.ce-surface[data-ce-mode="operate"] .ce-app-title { font-family: var(--ce-body); font-size: var(--type-title-size); }
.ce-surface[data-ce-mode="operate"] :is(.ce-panel-title,.ce-target,.ce-panel-row,.ce-side-item) { font-family: var(--ce-body); font-size: var(--type-label-size); }
.ce-surface[data-ce-mode="operate"] :is(.ce-panel-count,.ce-target-status,.ce-app-sub) { font-size: var(--type-meta-size); }
.ce-surface[data-ce-mode="operate"] :is(.ce-btn,.ce-band,.ce-panel,.ce-text-link::after,.ce-nav-link::after) { animation: none; }
.ce-surface[data-ce-mode="operate"] :is(.ce-btn:hover,.ce-panel:hover) { transform: none; }
.ce-surface[data-ce-mode="operate"] :is(.ce-panel,.ce-app-topbar) { backdrop-filter: none; -webkit-backdrop-filter: none; background: var(--color-bg-secondary); }
.ce-surface[data-ce-mode="operate"] .ce-panel-body { padding: var(--layout-panel-padding); }
.ce-surface[data-ce-mode="operate"] .ce-app-grid { gap: var(--layout-stack-gap); align-items: start; }
.ce-surface[data-ce-mode="operate"] .ce-panel-spectrum { grid-row: span 2; }
.ce-surface[data-ce-mode="read"] { max-width: var(--layout-content-width); margin-inline: auto; }
.ce-surface[data-ce-mode="read"] .ce-prose { max-width: var(--measure-prose); margin-inline: auto; }
.ce-surface[data-ce-mode="read"] .ce-prose p + p { margin-top: 1em; }
.ce-surface[data-ce-mode="read"] .ce-prose h2 { margin: 2.5em 0 .8em; }
.ce-surface[data-ce-mode="read"] :is(.ce-band,.ce-btn) { animation: none; }
.ce-surface[data-ce-mode="experience"] .ce-work { margin: 0; }
.ce-surface[data-ce-mode="experience"] .ce-work :is(img,video,svg) { display: block; width: 100%; height: auto; }
.ce-surface :is(input,button,select,textarea) { max-width: 100%; }
@media (max-width: 760px) {
  .ce-surface.ce-app { grid-template-columns: minmax(0,1fr); }
  .ce-surface .ce-sidebar { border-right: 0; border-bottom: 1px solid var(--color-border); }
  .ce-surface .ce-side-nav { flex-direction: row; flex-wrap: wrap; }
  .ce-surface .ce-side-foot { display: none; }
  .ce-surface .ce-app-topbar { flex-wrap: wrap; }
  .ce-surface .ce-app-grid { grid-template-columns: minmax(0,1fr); }
}
@media (prefers-reduced-motion: reduce) { .ce-surface :is(.ce-band,.ce-btn,.ce-panel) { animation: none; transform: none; } }

.ce-region-brand {
  --color-bg-primary: var(--region-brand-bg);
  --color-bg-secondary: var(--region-brand-surface);
  --color-bg-tertiary: var(--region-brand-surface);
  --color-surface-raised: var(--region-brand-surface);
  --ce-card-bg: var(--region-brand-surface);
  --color-text-primary: var(--region-brand-text);
  --color-text-emphasis: var(--region-brand-text);
  --color-text-secondary: var(--region-brand-text-secondary);
  --color-text-muted: var(--region-brand-text-secondary);
  --color-border: var(--region-brand-border);
  --ce-border-c: var(--region-brand-border);
  --color-accent-base: var(--region-brand-action);
  --color-accent-on-accent: var(--region-brand-action-text);
  --color-accent-hover: color-mix(in srgb, var(--region-brand-action) 86%, var(--region-brand-text));
  --color-accent-active: color-mix(in srgb, var(--region-brand-action) 72%, var(--region-brand-text));
  --color-accent-subtle: color-mix(in srgb, var(--region-brand-action) 16%, var(--region-brand-bg));
  --color-focus-ring: var(--region-brand-focus);
  --color-success: var(--region-brand-success);
  --color-warning: var(--region-brand-warning);
  --color-error: var(--region-brand-error);
  --color-info: var(--region-brand-info);
  background: var(--region-brand-bg);
  color: var(--region-brand-text);
}
/* 流光中文排版：细笔画、字面偏窄、留白大；标题用细字重并放宽字距
   字体缺失或离线时按 var(--font-*) 中的回退顺序落到平台原生中文字体，标题不因缺字溢出。 */
/* 可选品牌展示字体：Noto Sans SC（OFL-1.1，400 / 500 / 700）
   跨平台无衬线兜底与暖糖风格的圆润替代；完整字重约 5–8MB（woff2 全量），按 unicode-range 自托管时可只取常用字。
   获取：https://fonts.google.com/noto/specimen/Noto+Sans+SC；自托管时按需裁剪并保留本 unicode-range。 */
@font-face {
  font-family: "Noto Sans SC";
  src: local("Noto Sans SC"), url("./fonts/NotoSansSC.woff2") format("woff2");
  font-weight: 400 700;
  font-display: swap;
  unicode-range: U+3000-303F, U+4E00-9FFF, U+FF00-FFEF;
}

/* 可选品牌展示字体：Noto Serif SC（OFL-1.1，400 / 600 / 700）
   书卷风格的展示与正文衬线；Windows 缺 Songti SC 时提供确定字形。
   获取：https://fonts.google.com/noto/specimen/Noto+Serif+SC；自托管时按需裁剪并保留本 unicode-range。 */
@font-face {
  font-family: "Noto Serif SC";
  src: local("Noto Serif SC"), url("./fonts/NotoSerifSC.woff2") format("woff2");
  font-weight: 400 700;
  font-display: swap;
  unicode-range: U+3000-303F, U+4E00-9FFF, U+FF00-FFEF;
}

.ce-type-display { font-family: var(--font-display); font-weight: var(--type-display-weight); font-size: var(--type-display-size); line-height: var(--type-display-leading); letter-spacing: var(--type-display-tracking); max-width: var(--measure-title); }
.ce-type-title { font-family: var(--font-display); font-weight: 650; font-size: var(--type-title-size); line-height: 1.35; letter-spacing: 0; max-width: var(--measure-title); }
.ce-type-section { font-family: var(--font-display); font-weight: 650; font-size: var(--type-section-size); line-height: 1.45; letter-spacing: 0; max-width: var(--measure-title); }
.ce-type-body { font-family: var(--font-body); font-weight: 400; font-size: var(--type-body-size); line-height: var(--type-body-leading); letter-spacing: 0; max-width: var(--measure-prose); }
.ce-type-label { font-family: var(--font-body); font-weight: 600; font-size: var(--type-label-size); line-height: 1.5; letter-spacing: 0; }
.ce-type-meta { font-family: var(--font-body); font-weight: 400; font-size: var(--type-meta-size); line-height: 1.6; letter-spacing: 0; max-width: var(--measure-prose); }
.ce-type-data { font-family: var(--font-data); font-weight: 500; font-size: var(--type-label-size); line-height: 1.4; letter-spacing: 0.01em; }
/* 中文标点与换行：行末不孤悬标点，标题平衡断行，正文按字换行 */
.ce-prose :is(p, li, blockquote) { text-spacing-trim: space-first; hanging-punctuation: allow-end; text-wrap: pretty; }
:is(.ce-type-display, .ce-type-title, .ce-type-section) { text-wrap: balance; overflow-wrap: anywhere; }
/* 数字对齐：表格、指标、时间记录统一等宽数字 */
:is(.ce-type-data, .ce-metric-num, .ce-row-time, .ce-panel-count, .ce-target-status) { font-variant-numeric: tabular-nums; }

```