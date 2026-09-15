# Color Engine — UI 色彩系统生成器

一个基于 OKLCH 色彩空间的 UI 色彩系统自动生成工具。输入一个或多个品牌色，自动诊断色彩可用性问题，校正到"美丽颜色宜居带"，生成完整的 9-10 色阶系统，并给出 APCA 无障碍对比度验证。

## 使用方式：先看成品，再按需调整

打开页面即生成**标准风格**的完整预览——不需要先上传 Logo、输入颜色或点击「生成」。

```
打开即见成品 → 选一个喜欢的风格案例 →（可选）改成自己的品牌色 → 一次复制给 AI
```

- **风格选择区**：七种风格的缩略图直接从真实案例样式生成，选谁就在主预览看谁，不同时加载七套页面
- **主预览**：着陆页 / 工作台、亮色 / 暗色、全屏查看
- **复制给 AI**：一次拿到当前方案的完整上下文与必要样式，不需要逐项收集
- **详细调整**（折叠）：Logo 上传、品牌色、色彩策略、4px/8px 间距基准、H-C-L 实时调色
- **高级导出**（折叠）：CSS 变量 / 组件 CSS / 风格提示词 / Tailwind / JSON
- **分析与检查**（折叠）：诊断、自检、色阶、空间阶梯、Token 表、同一内容的风格对照样张

未显式设置品牌色时，每种风格使用它**确定的**默认色，不随机变化；显式设置的颜色在切换风格时被保留。

## 快速开始

直接在浏览器中打开 `color-engine.html`，无需构建工具或依赖。

```
open color-engine.html
```

或者用任意静态服务器：

```
python3 -m http.server 8080
# → http://localhost:8080/color-engine.html
```

## 核心能力

- **色彩诊断** — 自动检测品牌色是否"脏"、"荧光"、"过深"、"过浅"、"褪色"
- **自动校正** — 把品牌色从不可用的色相区域偏移到 UI 友好的范围（OKLCH 空间）
- **色阶生成** — 根据 60-30-10 法则生成完整的中性色 / 辅助色 / 强调色色阶
- **对比度验证** — 基于 APCA 算法校验文字与背景的对比度是否达标
- **七种风格案例** — 标准 standard / 暖糖 soft / 流光 glass / 书卷 editorial / 褐页 sepia / 构色 poster / 展厅 gallery，每种都有完整着陆页与工作台
- **一次复制给 AI** — 主出口包含 tokens、风格规则、组件 CSS、四种用途做法、资源回退与自检清单

## 文件结构

| 文件 | 说明 |
|------|------|
| `color-engine.html` | 主页面：预览前置的布局、风格选择区、详细调整、主复制入口 |
| `color-math.js` | 底层色彩数学引擎：OKLCH ↔ RGB ↔ Hex 转换、APCA 对比度计算 |
| `color-engine-palette.js` | 色相分类 · 诊断 · 校正 · 全部色阶推导（纯函数域） |
| `color-engine-core.js` | 状态 · 实时调色 · 主调度（唯一管线入口） |
| `space-engine-core.js` | 间距阶梯引擎（4px/8px 基准、12 级阶梯、语义 token） |
| `detector-engine.js` | 生成后全量自检规则（确定性规则，无需 LLM） |
| `color-engine-render.js` | 渲染函数（分析区/色板/Token 表）与 Token 数据源 |
| `design-profiles.js` | **风格注册表**：七种风格的默认色、世界变量、作用域样式、材料色、导出文案与用途适配 |
| `color-engine-demo.js` | 案例装配：共享骨架 + 各风格的着陆页/工作台、缩略图与比较样张 |
| `color-engine-export.js` | 导出层：主出口「复制给 AI」+ 高级导出（CSS 变量/组件 CSS/风格提示词/Tailwind/JSON） |
| `color-engine-interact.js` | 交互 · 风格切换 · 复制 · Logo 取色 · 持久化 · 启动 |
| `assets/work-demo-01…06.svg` | 展厅案例的演示图形（项目自制，非第三方素材） |
| `color-design-principles.md` | UI 颜色设计原则文档，定义了系统的约束与定理 |
| `STYLES.md` | 风格指南：7 种风格的提示词、使用场景、反例与接口约定 |

### 加载顺序（依赖方向：数学 → 风格注册表 → 推导 → 调度 → 自检 → 渲染 → 示例 → 导出 → 交互）

```
color-math.js → design-profiles.js
→ color-engine-palette.js → color-engine-core.js
→ space-engine-core.js → detector-engine.js
→ color-engine-render.js → color-engine-demo.js
→ color-engine-export.js → color-engine-interact.js
```

`color-engine.html` 在 `</body>` 前按上述顺序加载脚本。

## 边界

- 移除的「光谱 spectrum」指**可选择、可预览、可导出的生成风格**；工具外壳的纸面光谱品牌保留。
  旧单份状态中的 `spectrum` 自动映射到 `standard`，打开页面不报错。
- 不提供方案保存、收藏、版本历史或撤销系统；只有一份本地状态。
- 不提供随机换一批、偏好学习、专业问卷或强制初始化访谈。
- 不要求用户先选择字体、圆角、阴影等参数才能得到完整方案。
- 相同输入得到相同输出；不引入 LLM、API key 或随机生成流程。
- 界面语言为中文。

## 设计原则

系统的所有生成逻辑都受 `color-design-principles.md` 中定义的约束驱动：

- **60-30-10 法则** — 60% 中性色 + 30% 辅助色 + 10% 强调色
- **色不过三** — 主色 + 辅助色 + 强调色 ≤ 3 种（黑白灰不计）
- **OKLCH 宜居带** — 8 个色系各自的最优 Chroma / Lightness 区间
- **功能色优先** — 红(错误)、绿(成功)、黄/橙(警告) 先占位，避免品牌色与功能色混淆
- **品牌色 ≠ UI 强调色** — 深了提亮、浅了加深、丑了偏移色相
- **材料色 ≻ 品牌色 ≻ 用途尺度** — 材料主导的风格（褐页）不被策略缩放，低彩度暖褐不按"脏色"处理

## 依赖

零依赖。纯 HTML + CSS + Vanilla JavaScript，可直接离线使用。

## 兼容性

需要支持 OKLCH 色彩空间的现代浏览器（Chrome 111+、Firefox 113+、Safari 15.4+）。对于旧浏览器，工具内置了 OKLCH → sRGB 的完整转换引擎 (`color-math.js`)，因此除了 CSS 中的 `oklch()` 直接写入选色器外，核心计算不依赖浏览器原生 OKLCH 支持。

流光的玻璃效果依赖 `backdrop-filter`；不被支持时，`@supports not (...)` 会把玻璃面还原成不透明表面，
色彩与层次仍然成立（**不能只写半透明背景**：没有 blur 时底层正文会穿过导航条）。
