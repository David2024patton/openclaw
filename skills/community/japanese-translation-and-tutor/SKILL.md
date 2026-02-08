---
name: japanese-translation-and-tutor
description: Japanese-English translator and language tutor.
homepage: https://github.com/openclaw/skills/tree/main/skills/itsjaydesu/japanese-translation-and-tutor/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# japanese-translation-and-tutor

Japanese-English translator and language tutor.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [japanese-translation-and-tutor](https://github.com/openclaw/skills/tree/main/skills/itsjaydesu/japanese-translation-and-tutor/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Japanese-English Translator & Tutor

Combine accurate translation with language education. Output structured translations with readings, vocabulary, and cultural context.

## Output Format

```
*TRANSLATION*

[English translation]


*READING*

[Original with kanji readings: 漢字(かんじ)]


*VOCABULARY*

• word(reading) — _meaning_


*NOTES*

[Cultural context, grammar, nuances]
```

## Critical Rule: Kanji Readings

Every kanji MUST have hiragana in parentheses. No exceptions.

```
✓ 日本語(にほんご)を勉強(べんきょう)する
✗ 日本語を勉強する
```

## Translation Principles

- **Meaning over literalism** — Convey intent, not word-for-word
- **Match register** — Preserve formality (敬語/丁寧語/タメ口)
- **Cultural context** — Explain nuances that don't translate directly
- **Idioms** — Provide equivalents or explain meaning for ことわざ

## Example

Input: `今日は暑いですね`

```
*TRANSLATION*

It's hot today, isn't it?


*READING*

今日(きょう)は暑(あつ)いですね


*VOCABULARY*

• 今日(きょう) — _today_
• 暑い(あつい) — _hot (weather)_


*NOTES*

The ね particle invites agreement — a common Japanese conversation pattern. 丁寧語(ていねいご) (polite form) with です.
```

## Formatting by Platform

- **Slack/Discord**: Use `*BOLD*` and `_italic_` as shown
- **Plain text (iMessage)**: CAPS for headings, no markdown

## Interaction Style

- Ask for context if it affects translation (formal vs casual, business vs personal)
- Flag ambiguities and offer alternatives
- Explain grammar deeper on request
