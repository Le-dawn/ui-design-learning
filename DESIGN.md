---
name: Color Engine — 光谱世界
description: 白光进棱镜散成整条光谱——品牌色进系统，散成整套色阶
colors:
  paper-canvas: "#F2F1EB"
  paper-surface: "#FCFBF7"
  paper-raised: "#FFFFFF"
  hairline: "#DFDCD0"
  hairline-strong: "#B9B5A5"
  ink: "#1C1C20"
  ink-border: "#33333A"
  board-text: "#DDD9CD"
  spectrum-red: "#D6452E"
  spectrum-red-hover: "#BC3B27"
  spectrum-red-soft: "#F7E5DE"
  text-primary: "#23231F"
  text-secondary: "#57544C"
  text-muted: "#7D7A6D"
typography:
  display:
    fontFamily: "\"Avenir Next\", \"Bahnschrift\", \"Segoe UI\", -apple-system, BlinkMacSystemFont, \"PingFang SC\", sans-serif"
    fontSize: "clamp(1.85rem, 4.2vw, 2.9rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.02em"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, \"PingFang SC\", \"Hiragino Sans GB\", \"Microsoft YaHei\", sans-serif"
    fontSize: "1rem"
    lineHeight: 1.65
  data:
    fontFamily: "\"SF Mono\", \"Cascadia Code\", Consolas, ui-monospace, Menlo, monospace"
    fontFeature: "tabular-nums"
rounded:
  sm: "3px"
  lg: "6px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "20px"
  "2xl": "24px"
  "3xl": "32px"
  "4xl": "40px"
  "5xl": "48px"
  "6xl": "64px"
components:
  button-primary:
    backgroundColor: "{colors.spectrum-red}"
    textColor: "#FFFFFF"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.spectrum-red-hover}"
  button-outline:
    backgroundColor: "{colors.paper-surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
    padding: "10px 20px"
  button-sm:
    padding: "6px 14px"
  card:
    backgroundColor: "{colors.paper-surface}"
    rounded: "{rounded.lg}"
    padding: "24px"
  input:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.sm}"
  segmented-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-canvas}"
  swatch:
    backgroundColor: "{colors.paper-surface}"
    rounded: "{rounded.sm}"
---

# Design System: Color Engine — 光谱世界

## Overview

**Creative North Star: "纸面光谱图 — 白光进棱镜，散成整条光谱"**

这是一台纸面分光光谱仪。白光射入棱镜，在纸白地面上散成一条光谱带——品牌色射入系统，散成整套色阶。整个世界建立在"纸张 + 仪器"的双重身份上：纸白地面与墨灰发丝线提供全部结构，光谱红是唯一的强调，光谱带只出现在语义位置。访客看到的第一件事，是棱镜三角把品牌光散成 60-30-10 色阶带；它证明「美学可以被推导」——输入一个品牌色，输出一整台可用的色彩系统。

密度是仪器式的：tabular 数字、编号图版、发丝刻度尺、等宽字读数的数据区占版面的一半以上，但结构全部由中性承担。空间由 4px 精细网格（或 8px 标准网格）的 12 级等比阶梯驱动，组件语言是"纸面 + 发丝线 + 光谱强调 + 3px 倒角"。无圆角胶囊、无渐变文字、无眉题、无图标卡平铺。深色不是黑夜，是一块墨板——代码与暗色读数躺在墨底上，依然是纸面仪器。

已确认的反向参照（visual anti-references）：彩虹滥用（万花筒俗套）、圆角胶囊堆叠、渐变文字、眉题 eyebrow、图标卡平铺、灰底灰字、卡片套卡片。

**Key Characteristics:**
- 中性承担全部结构，光谱红只出现在语义位置（≤3 处/屏）
- 数据区是仪器的灵魂：系统等宽（SF Mono / Cascadia Code）+ tabular-nums + 发丝刻度
- 3px 倒角、无圆角胶囊；发丝边框 + 偏移阴影分层，深度不靠色
- 输出按科学图版编号（Plate 01、02…）
- 文本层级按明度分级（neutral 300/400/500/600），不靠透明度

## 边界：外壳品牌 ≠ 生成风格

本文档描述的是**工具自身的外壳**（纸面光谱品牌：顶栏标识、工具 UI、页脚说明）。
它与工具**生成的七种风格**是两件事，不要混用：

| | 外壳（本文档） | 生成风格（见 `STYLES.md`） |
|---|---|---|
| 是什么 | Color Engine 这个工具长什么样 | 工具给用户项目选出的视觉方案 |
| 阵容 | 纸面光谱一套 | 标准 / 暖糖 / 流光 / 书卷 / 褐页 / 构色 / 展厅 |
| 可否被用户切换 | 否，固定 | 是，风格选择区里选 |
| 会进入导出内容吗 | 不会 | 会，且只包含当前选中的那一种 |

- **已移除的生成风格「光谱 spectrum」** 指可选择、可预览、可导出的**生成风格**名额；
  外壳的纸面光谱品牌按上述边界保留，本轮不扩展为整站品牌重设计。
- 工具的预览容器只做一件事：提供中性画布与 `--color-*` 变量，让案例的
  `.ce-style-*` 作用域样式生效。工具内部选择器（如 `#comp-preview-card`）**不进入导出内容**，
  接收方 AI 不需要它们。
- 外壳 UI 的颜色语言（纸白/墨/光谱红）也不进入导出；导出给 AI 的是当次生成的那套 tokens。

## Colors

纸面调色板：暖纸白地面 + 墨灰发丝 + 唯一的光谱红强调。所有颜色值以 hex 为规范源（与工具自身的 `:root` 变量一一对应）。

### Primary
- **光谱红 Spectrum Red** (#D6452E)：唯一的强调色。用于主操作按钮、激活态链接、选中态标记、状态点与光谱带的"10% 强调"段。它是棱镜输出中最热的一段，用量即纪律——hover 转深 (#BC3B27)，淡底 (#F7E5DE) 只做 hover 背景与编号牌底。

### Neutral
- **纸白画布 Paper Canvas** (#F2F1EB)：页面地面。略暖的纸白，让卡片与纯白浮起。
- **纸面表面 Paper Surface** (#FCFBF7)：卡片、工具条、代码块以外的所有容器表面。
- **纸面浮起 Paper Raised** (#FFFFFF)：输入框、色板取色器、亮色模式标签底——最高的一层纸。
- **发丝线 Hairline** (#DFDCD0)：全部边框与分割线；**发丝线强 Hairline Strong** (#B9B5A5) 用于输入框描边与分段控件外框。
- **墨 Ink** (#1C1C20)：分段控件激活底、暗色读数标签底、代码墨板。发蓝的黑，是仪器墨。
- **正文 Text Primary** (#23231F)、**次要 Secondary** (#57544C)、**弱化 Muted** (#7D7A6D)：三级文字，全由明度分级，不用透明度。

### Named Rules
**The 60-30-10 Rule.** 任何生成的系统按 60% 中性 / 30% 辅助 / 10% 强调分配色彩面积；这是页面上方色带图的可视化定理，也是生成器的默认策略。

**The One-Accent Rule（强调是例外）.** 一屏只给主按钮、激活链接、选中态用彩色；彩色只出现在语义位置，中性承担全部结构。光谱带（包括渐变与色带）只允许出现在棱镜图、60-30-10 条与谱线刻度里，禁止作为装饰性彩虹铺满版面。

**The Hairline Rule（发丝线）.** 一切分隔靠 1px 发丝边框，不靠色块与加深。卡片与卡片之间、行与行之间、面板之间，全部是 1px hairline。

## Typography

**Display Font:** Avenir Next / Bahnschrift（系统原生栈，零依赖、离线一致：macOS 用 Avenir Next，Windows 用 Bahnschrift/Segoe UI；不再依赖 webfont）
**Body Font:** 系统栈（-apple-system / Segoe UI / PingFang SC / Hiragino Sans GB / Microsoft YaHei）
**Label/Mono Font:** SF Mono / Cascadia Code / Consolas（系统原生等宽栈，回退 ui-monospace / Menlo）

**Character:** 三声部分工，展示体（Avenir Next / Bahnschrift）负责标题的重量与宽度感，正文安静地待在系统栈里，数据全部交给系统等宽（SF Mono / Cascadia Code）——正文与数据的分野就是"纸面叙述"与"仪器读数"的分野。全站 `font-variant-numeric: tabular-nums`。注意：展示体无 CJK 字形，中文标题由系统中文栈发声，拉丁串（SOLSTICE / NIGHT 1 / EPOCH…）承载展示声部。

### Hierarchy
- **Display** (Avenir Next / Bahnschrift 700, clamp(1.85rem, 4.2vw, 2.9rem), 1.12, -0.02em)：hero 主角标题，限宽 18ch。区块标题用 1.02–1.25rem。
- **Body** (系统栈 400, 1rem, 1.65)：正文与说明；hero 副文 0.98rem / 1.7 / 限宽 46ch。
- **Label/Data** (系统等宽 400–600, 0.62–0.86rem, 1.6)：色值、编号图版、epoch 时间戳、状态标签、仪器读数；元信息行用 0.62–0.68rem + 0.04–0.12em 字距 + 大写（拉丁字母部分）。
- **微标注** (Mono 0.64–0.66rem, 0.05–0.12em 字距)：发丝刻度尺标签、图版编号、页脚。

### Named Rules
**The Tabular Rule（数据即读数）.** 一切数据性内容——色值、编号、时间、状态、统计——必须用系统等宽（SF Mono / Cascadia Code）且 tabular-nums；同一字重不许从头走到尾，标题 700 / 正文 400 / 数据 400–600 分级。

## Layout

- 工具容器 max-width 1240px，水平 padding 32px（≤640px 时收为 16px）；区块间 28px。
- 生成系统的落地页容器 920px，区块纵向 gap 为 `--space-6xl`（64px），卡片内 padding 24px（space-2xl）。
- 网格：色片 auto-fill minmax(132px, 1fr)、输入区 minmax(280px, 1fr)；亮/暗双栏 `1fr 1fr`，≤768px 收成单栏；app 壳 212px 侧栏 + 主区，≤760px 收成单栏；面板网格 300px + 1fr，≤860px 收成单栏；hero 与分栏 ≤680px 收成单栏。
- 间距系统：4px 精细网格 12 级等比阶梯（4/8/12/16/20/24/32/40/48/64/80/96）或 8px 标准网格，映射为 `--space-xs` 至 `--space-8xl`；语义 token（button-padding-x=space-md、card-padding=space-lg、section-gap=space-3xl、inline-gap=space-sm 等）全部从阶梯派生。
- 节奏法则：组内紧、组间松——标题组内 8px，卡片内 24px，区块间 ≥48px；宁可空，不可挤。

## Elevation & Depth

平坦纸面，深度不靠色。层级由三样东西表达：纸白浮起（surface 分层）、1px 发丝边框、以及克制的偏移阴影。卡片在纸白画布上只有一层纸的厚度，靠发丝边框圈出边界、靠阴影浮起。

- **卡片层** (`box-shadow: 0 1px 0 rgba(28,28,32,.04), 0 2px 10px rgba(28,28,32,.06)`)：普通卡片。
- **浮层层** (`box-shadow: 0 1px 0 rgba(28,28,32,.04), 0 2px 4px rgba(28,28,32,.05), 0 18px 44px rgba(28,28,32,.12)`)：弹窗、下拉、悬浮物。
- **按钮强调**：主按钮带 2px 10px 的 accent 色偏移投影；按下时 `inset 0 2px 4px` 凹陷。
- **墨板**：代码块与暗色读数用墨底 (#1C1C20) + 1px 深边框，是"纸面仪器"的暗面，不依赖投影。

### Named Rules
**The Depth-by-Line Rule（深度靠阴影不靠色）.** 浮层永远用发丝边框 + 偏移阴影表达，不叠圆角胶囊、不用渐变文字、不靠加深卡片颜色制造层级。生成系统导出 `--shadow-sm/md/lg`，阴影色派生自最深文字色（12% 混合，暗色 16%）。

## Shapes

3px 倒角是世界的默认曲率：按钮、输入框、色片、分段控件、分析条目全部 3px（`--ui-radius`）。大容器——卡片、面板、代码板——用 6px（`--ui-radius-lg`）。嵌套内部件（编号牌、标签、按钮内嵌）用 2px。状态点与窗口点是 7px 见方、1px 圆角的小方块——它们是光谱仪的刻度标记，不是圆点。没有圆角胶囊，没有 pill。签名几何是棱镜三角：header 的 22px 棱镜 mark、hero 里的 600×300 色散三角，线条 1.1–1.8px 描边。

## Components

### Buttons
- **Shape:** 3px 倒角，直角无胶囊；字体系统栈 600，字号 0.86rem。
- **Primary（光谱红）:** background #D6452E / 白字（或按对比度自适应深墨字），padding 10px 20px（sm: 6px 14px / lg: 13px 28px）；hover 转 #BC3B27 并加深偏移投影，active `translateY(1px)` + inset 阴影；disabled 0.45 透明度 + not-allowed。
- **Ghost / Outline:** 透明或纸面底，hover 时出现发丝边框转 accent 或浅灰底；墨色按钮（ink）用于暗面上的主操作。
- **Focus:** 2px 实线 accent 描边 + 2px 偏移；输入框聚焦为 accent 边框 + 3px 14% 光环。

### Chips / 编号牌
- **Style:** 2px 倒角小牌，mono 0.62–0.68rem + 0.05–0.1em 字距，accent 描边或 accent-soft 底；图版编号（01、02…）盖在色片右上角，纸白半透明底。

### Cards / Containers
- **Corner Style:** 6px。
- **Background:** paper-surface（浮起层 white / raised）。
- **Shadow Strategy:** 卡片层偏移阴影（见 Elevation）。
- **Border:** 1px hairline，行分隔也是 1px hairline；hover 行用 bg-tertiary 极浅灰。
- **Internal Padding:** 24px（space-2xl），行内 8–12px。

### Inputs / Fields
- **Style:** 1px hairline-strong 描边、raised 纸底、3px 倒角、42px 高；hex 输入用 mono；数字输入居中 58px 宽；caret 为光谱红。
- **Focus:** 描边转 accent + `0 0 0 3px` 14% accent 光环。
- **Error / Disabled:** 禁用态沿用中性灰阶（disabled-bg / disabled-text / disabled-border 三件套），不用红色描边。

### Navigation
- **顶栏:** 文字链接 0.84rem/500，hover 出现 1px hairline 下划线，与正文同灰阶；激活用 accent 或 600。
- **侧栏（app 壳）:** 212px 宽，1px 右侧发丝线；条目 8px 12px 内距、3px 倒角，hover 浅灰底；激活态 = 1px accent 左边线 + 浅灰底 + 600 字重——仪器式的"探针对齐"而非胶囊填充。

### 分段控件 Segmented Control（签名组件）
排版式文字选项（0.74rem/600），2px 缝隙的横向排布，1px hairline-strong 外框 + 纸白画布底；激活态是墨底 (#1C1C20) + 纸白字——整页唯一的墨块。

### 状态指示（签名组件）
7px 见方 1px 圆角方块：默认 hairline 色、accent = 强调事件、success 绿 = 完成；排程行 / 目标列表 / 窗口点共用同一词汇。

### 试色带（签名组件）
预览工具条下方的一条 12px 高宜居带光谱：1px hairline-strong 外框 + 3px 倒角，滑动游标是 6×20px 的墨块（仪器游标，不是圆形圆点）。带上的每一格 = 该色相在 OKLCH 宜居带、且 sRGB 色域内能达到的最美版本，并且先过一遍校正管线——**所见即所得**：拖到哪里，右侧预览就渲染成那一格的颜色。

- **采样：1° 一档**（361 个渐变停靠点）。轨道上画出来的颜色与点下去实际渲染的颜色逐度一致，色相带接缝（70° 橙→黄）如实显示，不做平滑。
- **刻度：色相带边界**。轨道下方 9 条发丝刻度（0 / 40 / 70 / 110 / 165 / 210 / 280 / 320 / 360）+ mono 角度小字，与谱线图同一套标注语言。
- **键盘：聚焦后 ← → 按 1° 微调**，Home / End 直达两端；焦点环 2px accent。右侧 mono 提示 `← → 1°`。
- **读数：`H 74°`** 显示游标所在色相；管线对暖区色相做过微调时补一段暗色 `→ 73°`（实际渲染色相），读数在拖动/按键当下即时更新，不等重绘。
- 右侧配 18px 色片 + mono 十六进制读数（跟随真实渲染结果），再右是「回到风格默认」。实现用原生 `input[type=range]`。

### 谱线图（签名组件）
光谱数据以 SVG 呈现：发丝刻度线 + mono 波长标签 + 色带（accent-subtle → base → active 的渐变）+ 吸收线标记 + accent 竖线标注（Hα 656.3）。棱镜色散图是 hero 的戏剧化机制演示，五个色阶带依次淡入（0.5s cubic-bezier(.22,.9,.3,1)，尊重 prefers-reduced-motion）。

## Do's and Don'ts

### Do:
- **Do** 让中性承担全部结构；彩色元素一屏不超过 3 处，且只在语义位置（主按钮 / 激活链接 / 选中态）。
- **Do** 把数据性内容放进系统等宽（SF Mono / Cascadia Code）+ tabular-nums，让字重分级（标题 700 / 正文 400 / 数据 400–600）。
- **Do** 用 3px 倒角（容器 6px）——倒角是仪器的倒角，不是圆润的胶囊。
- **Do** 用发丝边框 + 偏移阴影表达层级，暗色一律落到墨板（#1C1C20）上。
- **Do** 让文字层级按中性明度分级（neutral-300 弱化 / 400 次要 / 500 主要 / 600 标题），不靠透明度。
- **Do** 把输出当科学图版：编号（Plate 01、02…）、发丝刻度、tabular 数字。

### Don't:
- **Don't** 让光谱泛滥——色带与渐变只出现在棱镜图、60-30-10 条与谱线刻度里，禁止装饰性彩虹与彩色渐变背景铺满版面。
- **Don't** 使用渐变文字、眉题 eyebrow、图标卡平铺、卡片套卡片、灰底灰字（灰字必须落在纸白/raised 上并有对比保证）。
- **Don't** 用透明度做文字层级，用明度分级替代。
- **Don't** 使用圆角胶囊、pill 或 6px 以上的曲率。
- **Don't** 让数据/编号/时间离开等宽字体；同一字重不允许从头走到尾。
