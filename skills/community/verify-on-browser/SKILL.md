---
name: verify-on-browser
description: Control browser via Chrome DevTools Protocol - full CDP access.
homepage: https://github.com/openclaw/skills/tree/main/skills/myestery/verify-on-browser/SKILL.md
author: tree
category: Browser & Automation
metadata: { "openclaw": { "emoji": "🌐", "source": "community", "securityStatus": "SAFE" } }
---

# verify-on-browser

Control browser via Chrome DevTools Protocol - full CDP access.

## Source

- **Author**: tree
- **Category**: Browser & Automation  
- **Original**: [verify-on-browser](https://github.com/openclaw/skills/tree/main/skills/myestery/verify-on-browser/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Browser Control Skill

Use the `browser` MCP server to control a browser with full CDP access. The core `cdp_send` tool can call ANY Chrome DevTools Protocol method.

## Available Tools

### `cdp_send` - Raw CDP Access
Call any CDP method directly:
```
cdp_send(method: "Domain.method", params: {...})
```

### `screenshot` - Capture Page
```
screenshot(format: "png"|"jpeg", fullPage: true|false)
```

### `get_url` - Current URL
```
get_url()
```

### `close_browser` - Close Browser
```
close_browser()
```

## Common CDP Operations

### Navigation
```javascript
// Navigate to URL
cdp_send(method: "Page.navigate", params: { url: "https://example.com" })

// Reload
cdp_send(method: "Page.reload")

// Go back/forward
cdp_send(method: "Page.navigateToHistoryEntry", params: { entryId: 1 })
```

### DOM Manipulation
```javascript
// Get document root
cdp_send(method: "DOM.getDocument")

// Query selector (needs nodeId from getDocument)
cdp_send(method: "DOM.querySelector", params: { nodeId: 1, selector: "h1" })

// Get outer HTML
cdp_send(method: "DOM.getOuterHTML", params: { nodeId: 5 })

// Set attribute
cdp_send(method: "DOM.setAttributeValue", params: { nodeId: 5, name: "class", value: "new-class" })
```

### JavaScript Execution
```javascript
// Evaluate expression
cdp_send(method: "Runtime.evaluate", params: { expression: "document.title" })

// Evaluate with return value
cdp_send(method: "Runtime.evaluate", params: {
  expression: "document.querySelectorAll('a').length",
  returnByValue: true
})

// Call function on object
cdp_send(method: "Runtime.callFunctionOn", params: {
  objectId: "...",
  functionDeclaration: "function() { return this.innerText; }"
})
```

### Network
```javascript
// Enable network tracking (required first)
cdp_send(method: "Network.enable")

// Set cookies
cdp_send(method: "Network.setCookie", params: {
  name: "session",
  value: "abc123",
  domain: ".example.com"
})

// Get cookies
cdp_send(method: "Network.getCookies")

// Clear cache
c
