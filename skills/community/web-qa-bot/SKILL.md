---
name: web-qa-bot
description: AI-powered web application QA automation using accessibility-tree based testing.
homepage: https://github.com/openclaw/skills/tree/main/skills/nextfrontierbuilds/web-qa-bot/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# web-qa-bot

AI-powered web application QA automation using accessibility-tree based testing.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [web-qa-bot](https://github.com/openclaw/skills/tree/main/skills/nextfrontierbuilds/web-qa-bot/SKILL.md)
- **Security Status**: SAFE

## Instructions

# web-qa-bot

AI-powered web application QA automation using accessibility-tree based testing.

## Overview

This skill provides tools for automated QA testing of web applications. It uses browser accessibility trees for reliable element detection instead of fragile CSS selectors.

## Installation

```bash
npm install -g web-qa-bot agent-browser
agent-browser install
```

## Commands

### Quick Smoke Test

```bash
web-qa-bot smoke https://example.com
```

Runs basic health checks:
- Page loads successfully
- No console errors
- Navigation elements present
- Images have alt text

### Run Test Suite

```bash
web-qa-bot run ./tests/suite.yaml --output report.md
```

### Generate PDF Report

```bash
web-qa-bot report ./results.json -o report.pdf -f pdf
```

## Use Cases

### 1. Quick Site Health Check

```bash
# Smoke test a production URL
web-qa-bot smoke https://app.example.com --checks pageLoad,consoleErrors,navigation
```

### 2. Pre-deployment QA

Create a test suite and run before each deployment:

```yaml
# tests/critical-paths.yaml
name: Critical Paths
baseUrl: https://staging.example.com

tests:
  - name: Login flow
    steps:
      - goto: /login
      - type: { ref: Email, text: test@example.com }
      - type: { ref: Password, text: testpass }
      - click: Sign In
      - expectVisible: Dashboard
      - expectNoErrors: true
```

```bash
web-qa-bot run ./tests/critical-paths.yaml --output qa-report.pdf -f pdf
```

### 3. Monitor for Regressions

```bash
# Run tests and fail CI if issues found
web-qa-bot run ./tests/smoke.yaml || exit 1
```

### 4. Programmatic Testing

```typescript
import { QABot } from 'web-qa-bot'

const qa = new QABot({
  baseUrl: 'https://example.com',
  headless: true
})

await qa.goto('/')
await qa.click('Get Started')
await qa.snapshot()
qa.expectVisible('Sign Up')
await qa.close()
```

## Integration with agent-browser

This tool wraps agent-browser CLI for browser automation:

```bash
# Connect to existing browser session
web-qa-
