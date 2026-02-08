---
name: mlscp
description: Parse and generate MLSCP (Micro LLM Swarm Communication Protocol) commands.
homepage: https://github.com/openclaw/skills/tree/main/skills/sirkrouph-dev/mlscp/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# mlscp

Parse and generate MLSCP (Micro LLM Swarm Communication Protocol) commands.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [mlscp](https://github.com/openclaw/skills/tree/main/skills/sirkrouph-dev/mlscp/SKILL.md)
- **Security Status**: SAFE

## Instructions

# MLSCP Skill

MLSCP (Micro LLM Swarm Communication Protocol) is a token-efficient command language for agent-to-agent communication. This skill lets you parse, validate, and generate MLSCP commands without any LLM overhead.

## Why Use MLSCP?

| Natural Language | MLSCP | Savings |
|-----------------|-------|---------|
| "Please modify the file src/chain_orchestrator.py by adding retry logic at line 47" | `F+ s/co > ln47 + 'retry logic'` | ~75% |
| "Read the contents of utils/file_manager.py from lines 10 to 50" | `F? u/fm > ln10-50` | ~80% |
| "Delete the variable 'temp_cache' from config.py" | `V- c/c > 'temp_cache'` | ~70% |

## Quick Start

### Parse a Command
```bash
./scripts/mlscp.sh parse "F+ s/co > ln47 + 'retry logic'"
```

### Validate Syntax
```bash
./scripts/mlscp.sh validate "F+ s/co > ln47 + 'retry logic'"
```

### Generate Vocabulary
```bash
./scripts/mlscp.sh vocab /path/to/project
```

### Compress Natural Language
```bash
./scripts/mlscp.sh compress "Add error handling to the main function in app.py"
```

## Command Reference

### Operations
| Code | Meaning | Example |
|------|---------|---------|
| `F+` | File add/insert | `F+ s/app > ln10 + 'new code'` |
| `F~` | File modify | `F~ s/app > ln10-20 ~ 'updated code'` |
| `F-` | File delete | `F- s/app > ln10-15` |
| `F?` | File query/read | `F? s/app > ln1-100` |
| `V+` | Variable add | `V+ s/app + 'new_var = 42'` |
| `V~` | Variable modify | `V~ s/app > 'old_var' ~ 'new_value'` |
| `V-` | Variable delete | `V- s/app > 'temp_var'` |
| `V?` | Variable query | `V? s/app > 'config_*'` |

### Location Specifiers
- `ln47` - Single line
- `ln10-50` - Line range
- `fn:main` - Function name
- `cls:MyClass` - Class name

### Context Blocks
```
CTX{"intent":"resilience","priority":"high","confidence":0.9}
```

## Scripts

- `mlscp.sh` - Main CLI tool
- `vocab.py` - Vocabulary generator (Python)

## Integration

### With Other Agents
When receiving commands from MLSCP-enabled agents:
```bash
./scripts/mlscp
