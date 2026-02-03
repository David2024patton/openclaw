# Browser Tool

## Description
Automate web browser interactions using Playwright. Can navigate pages, click elements, fill forms, and extract content.

## Instructions
Use this tool when you need to:
- Navigate to websites
- Click buttons or links
- Fill out web forms
- Extract text or data from pages
- Take screenshots
- Wait for page elements

The agent has access to `browser_*` family of tools for web automation.

## Configuration
No API key required. Browser automation works out of the box.

## Example Usage
```
User: "Go to example.com and tell me the page title"
Agent: <uses browser tools to navigate and extract title>
```

## Notes
- Supports headless mode
- Can handle JavaScript-heavy sites
- Respects robots.txt (configurable)
- SSRF protection enabled
