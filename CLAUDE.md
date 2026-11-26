# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个简单的 Chrome 浏览器插件，提供快速平滑滚动页面到顶部、中部或底部的功能。

## 技术栈

- HTML / CSS / JavaScript (原生)
- Chrome Extension Manifest V3

## 文件结构

```
├── manifest.json    # 插件配置文件
├── popup.html       # Popup 弹窗页面
├── popup.css        # 弹窗样式
├── popup.js         # 交互逻辑
├── icons/           # 插件图标 (16px, 48px, 128px)
└── README.md        # 说明文档
```

## 开发工作流程

### 本地加载测试

1. 打开 Chrome 浏览器，访问 `chrome://extensions/`
2. 开启右上角的「开发者模式」
3. 点击「加载已解压的扩展程序」
4. 选择本项目目录

### 修改后刷新

修改代码后，在 `chrome://extensions/` 页面点击插件卡片的刷新按钮，或在插件 popup 打开时按 `Cmd+R` (Mac) / `Ctrl+R` (Windows) 刷新。

## 核心架构

### Manifest V3 配置

- `permissions`: `activeTab` 和 `scripting` - 用于获取当前活动标签页并注入脚本执行滚动
- `action.default_popup`: 点击图标时显示的 popup.html

### 代码执行流程

`popup.js` 使用 `chrome.scripting.executeScript` API 向当前活动标签页注入执行代码：

1. 通过 `chrome.tabs.query({ active: true, currentWindow: true })` 获取当前标签页
2. 调用 `chrome.scripting.executeScript` 在目标页面执行滚动逻辑
3. 使用原生 `window.scrollTo({ behavior: 'smooth' })` 实现平滑滚动

### 滚动位置计算

- 顶部: `0`
- 中部: `(scrollHeight - clientHeight) / 2`
- 底部: `scrollHeight - clientHeight`

使用 `Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)` 获取页面总高度，兼容不同页面结构。

## 注意事项

- 插件使用 Chrome Extension Manifest V3，需使用 `chrome.scripting` API 而非旧版的 `chrome.tabs.executeScript`
- 目标页面必须允许内容脚本注入（某些特殊页面如 Chrome 商店页面无法注入）
