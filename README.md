# Color Engine — UI 色彩系统生成器

一个基于 OKLCH 色彩空间的 UI 色彩系统自动生成工具。输入一个或多个品牌色，自动诊断色彩可用性问题，校正到"美丽颜色宜居带"，生成完整的 9-10 色阶系统，并给出 APCA 无障碍对比度验证。

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
- **主题导出** — 一键复制 CSS 变量或 Tailwind 配置

## 文件结构

| 文件 | 说明 |
|------|------|
| `color-engine.html` | 主页面，包含工具 UI 样式和 HTML 结构 |
| `color-math.js` | 底层色彩数学引擎：OKLCH ↔ RGB ↔ Hex 转换、APCA 对比度计算 |
| `color-engine-core.js` | 核心逻辑：色彩诊断、校正、色阶生成、主调度 |
| `color-engine-ui.js` | 渲染函数与交互逻辑 |
| `color-design-principles.md` | UI 颜色设计原则文档，定义了系统的约束与定理 |

### 加载顺序

```
color-math.js → color-engine-core.js → color-engine-ui.js
```

`color-engine.html` 在 `</body>` 前按上述顺序加载脚本。

## 设计原则

系统的所有生成逻辑都受 `color-design-principles.md` 中定义的约束驱动：

- **60-30-10 法则** — 60% 中性色 + 30% 辅助色 + 10% 强调色
- **色不过三** — 主色 + 辅助色 + 强调色 ≤ 3 种（黑白灰不计）
- **OKLCH 宜居带** — 8 个色系各自的最优 Chroma / Lightness 区间
- **功能色优先** — 红(错误)、绿(成功)、黄/橙(警告) 先占位，避免品牌色与功能色混淆
- **品牌色 ≠ UI 强调色** — 深了提亮、浅了加深、丑了偏移色相

## 依赖

零依赖。纯 HTML + CSS + Vanilla JavaScript，可直接离线使用。

## 兼容性

需要支持 OKLCH 色彩空间的现代浏览器（Chrome 111+、Firefox 113+、Safari 15.4+）。对于旧浏览器，工具内置了 OKLCH → sRGB 的完整转换引擎 (`color-math.js`)，因此除了 CSS 中的 `oklch()` 直接写入选色器外，核心计算不依赖浏览器原生 OKLCH 支持。
