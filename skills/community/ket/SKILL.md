---
name: ket
description: Guides development of KET (A2 Key for Schools) exam preparation and English learning applications.
homepage: https://github.com/openclaw/skills/tree/main/skills/zhqinqin123run-lgtm/ket/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# ket

Guides development of KET (A2 Key for Schools) exam preparation and English learning applications.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [ket](https://github.com/openclaw/skills/tree/main/skills/zhqinqin123run-lgtm/ket/SKILL.md)
- **Security Status**: SAFE

## Instructions

# KET 备考与英语学习应用开发指南

本 Skill 指导开发面向**英语初学者**和**KET 备考**的应用：既支持 Pre-A1 / A1 零基础学习，也支持 A2 Key for Schools 考试准备。

## 考试结构概览

| 模块 | 时长 | 占比 | 说明 |
|------|------|------|------|
| Reading and Writing | 60 分钟 | 50% | 阅读 Part 1–5 + 写作 Part 6–7 |
| Listening | 30 分钟（含 6 分钟誊写） | 25% | 每段录音播放两遍 |
| Speaking | 8–10 分钟/对 | 25% | 面对面，1–2 位考生，2 位考官 |

---

## 英语初学者支持（Pre-A1 / A1）

应用应支持零基础或初级用户，提供从入门到 KET 的渐进路径。

### 等级与能力对应

| 等级 | 词汇量约 | 能力概述 |
|------|----------|----------|
| Pre-A1 | ~300 | 认识字母、数字、基础词汇；听懂简单指令；说单词或极短句 |
| A1 | ~600 | 自我介绍、日常寒暄；理解简单短句；写单词或短句 |
| A2 (KET) | ~1500 | 日常场景沟通；阅读短文；写便条、邮件、简单故事 |

### 初学者学习路径设计

**1. Pre-A1 起步**
- **听**：单词发音、简单指令（stand up, sit down）、数字/颜色/动物
- **说**：跟读单词、简单短语（Hello, My name is...）
- **读**：字母、单词认读、图词配对
- **写**：字母书写、抄写单词
- **题型**：看图选词、听音选图、拖拽配对、跟读录音

**2. A1 进阶**
- **听**：短对话、简单问题（What's your name? How old are you?）
- **说**：自我介绍、回答个人问题、简单喜好（I like...）
- **读**：短句、简单告示、图配句
- **写**：填空单词、短句、简单邮件（10–15 词）
- **题型**：单选、填空、配对；逐步引入 KET Part 1 简化版

**3. A2 备考衔接**
- 从 A1 练习过渡到 KET 题型
- 词汇与语法按 A2 大纲扩展
- 题型难度阶梯：先 Part 1 简化 → 完整 Part 1 → 其他 Part

### 初学者词汇主题（Pre-A1 / A1）

- 字母、数字、颜色、形状
- 动物、身体部位、家庭成员
- 食物饮料、衣服、房间与家具
- 学校物品、日常动词（go, have, like, play）
- 天气、星期、月份、基础形容词

### 初学者语法重点

- be 动词（am, is, are）
- 一般疑问句（Do you...? Is it...?）
- 简单时态：一般现在时、一般过去时（was/were, 规则动词 -ed）
- 冠词 a/an/the、人称代词、物主代词
- 基础介词（in, on, at, under）

### 初学者功能设计要点

- **难度可选**：首次使用或设置中可选择「初学者 / 备考 KET」
- **无门槛入口**：不强制要求词汇量，从字母/数字/基础词开始
- **图片优先**：大量配图，降低纯文字门槛
- **即时发音**：单词/句子可点击播放，支持跟读
- **鼓励式反馈**：答错给出提示而非惩罚，强化正确示范
- **进度可视化**：显示当前等级、解锁进度，增强成就感

---

## Reading 阅读模块（Part 1–5，32 题）

### Part 1 - 多项选择
- **题型**：6 段短文本（告示、标语等）→ 选主要信息
- **应用实现**：短文本 + 3 选项，点击选择

### Part 2 - 配对
- **题型**：7 个问题 + 3 篇同主题短文 → 匹配对应文本
- **应用实现**：拖拽匹配或下拉选择

### Part 3 - 阅读理解
- **题型**：1 篇长文，5 道 3 选 1
- **应用实现**：文章展示 + 题目列表，支持高亮定位

### Part 4 - 选词填空（Multiple-choice cloze）
- **题型**：说明文/事实文本，6 个空，每空 4 选 1（词汇为主）
- **应用实现**：下拉或点击选词填空

### Part 5 - 开放式填空（Open cloze）
- **题型**：邮件/短信，6 个空，每空填 1 个词（语法为主）
- **应用实现**：输入框填空，
