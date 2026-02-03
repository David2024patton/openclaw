# Web Search Tool

## Description
Search the web using Brave Search or Perplexity API. Returns relevant results with titles, URLs, and descriptions.

## Instructions
This tool allows the agent to search the web for current information. Use it when:
- User asks about current events
- Need real-time data or facts
- Research is required

The agent has access to `web_search` tool which can:
- Search using Brave Search API (default)
- Search using Perplexity Sonar (AI-synthesized answers)
- Filter by country, language, and time range

## Configuration
Requires API key configuration:
- Brave: Set `BRAVE_API_KEY` env variable or configure via `openclaw configure --section web`
- Perplexity: Set `PERPLEXITY_API_KEY` or `OPENROUTER_API_KEY`

## Example Usage
```
User: "What's the latest news about AI?"
Agent: <uses web_search tool with query="latest AI news">
```

## Notes
- Results are cached for performance
- Supports region-specific search
- Time-based filtering available for Brave
