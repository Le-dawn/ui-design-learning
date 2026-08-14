# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

使用者只有本人——一名自认没有美学细胞的程序员。他们无法说出"为什么不好看"，但能分辨"好看/不好看"，需要工具把美学判断变成可执行的确定性规则。长期目标人群：同样没有设计背景、但需要产出前端界面的程序员。

## Product Purpose

让一个不会设计的程序员快速敲定一个项目的美学定义：输入少量信息（如品牌色），输出一套完整的设计 token（色彩、间距、圆角、字号、阴影）与直接可落地的组件示例，以组件示例作为"好不好看"的直观验证。当前输出的组件示例仍然不好看——找出并补上缺失的美学条件，正是本项目要解决的问题。

## Positioning

确定性规则驱动的美学生成：所有生成逻辑由设计原则文档中的定理约束（OKLCH 宜居带、60-30-10 法则等），不用 LLM、不用 API key、结果可复现。核心主张：美学可以像程序一样被推导，而非靠天赋。

## Operating Context

本地离线使用：纯静态 HTML，双击或 `python3 -m http.server` 打开，浏览器即用，无构建步骤。界面语言为中文。用户通过组件示例的直观效果来判断系统好坏。

## Capabilities and Constraints

已实现：
- 色彩诊断/自动校正/色阶生成（OKLCH 空间），APCA 对比度验证，CSS 变量与 Tailwind 导出
- 间距阶梯引擎（space-engine-core.js：4px/8px 基准、12 级等比阶梯、语义 token）
- 生成后自检规则（detector-engine.js：确定性规则、无需 LLM/API key）

研究中/未定：圆角、字号、阴影 tokens 的生成规则。
已确认问题（待解决）：生成的组件示例仍然不好看。推测缺少 token 之外的构成条件（字体声部、图形维度、构图法则、微观比例、动效、反模式规避），待通过组件示例调整验证——这是当前最高优先级的工作。
约束：界面语言必须为中文（用户明确绑定）。零依赖/离线/纯静态：用户声明"可按需抛弃"，当前保持。原有设计原则文档（color-design-principles.md）不再是不可修改的权威，可以按新发现改写。

## Brand Commitments

名称 "Color Engine"（非绑定）。界面语言中文（绑定）。无其他品牌资产。

## Evidence on Hand

- README.md（功能与文件结构说明）
- color-design-principles.md（色彩定理集，部分内容可能被改写）
- color-engine.html + color-engine-core.js + color-engine-ui.js（当前实现）
- space-engine-core.js、detector-engine.js（新扩展引擎）
- 现有组件示例（landing 页 demo，作为"好不好看"的验证载体）

## Product Principles

1. 输入极简：输入量应少到不会设计的程序员也能完成，产出应完整到可直接使用。
2. 规则驱动、结果可复现：不用 LLM/API 也能推导出美学定义。
3. 示例即验证：组件示例是美学的试金石，token 系统以示例是否好看为成败标准。
4. 系统补全美学条件：不断发现"token 之外"影响美观的条件（字体、图形、构图、动效）并纳入系统。
5. 输出直接可用：导出的 token 与组件代码必须能直接粘贴进真实项目。

## Accessibility & Inclusion

工具内建 APCA 对比度验证（产品功能，非用户需求）。无其他已确认的无障碍要求。
