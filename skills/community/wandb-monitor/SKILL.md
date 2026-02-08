---
name: wandb-monitor
description: Monitor and analyze Weights & Biases training runs.
homepage: https://github.com/openclaw/skills/tree/main/skills/chrisvoncsefalvay/wandb-monitor/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# wandb-monitor

Monitor and analyze Weights & Biases training runs.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [wandb-monitor](https://github.com/openclaw/skills/tree/main/skills/chrisvoncsefalvay/wandb-monitor/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Weights & Biases

Monitor, analyze, and compare W&B training runs.

## Setup

```bash
wandb login
# Or set WANDB_API_KEY in environment
```

## Scripts

### Characterize a Run (Full Health Analysis)

```bash
~/clawd/venv/bin/python3 ~/clawd/skills/wandb/scripts/characterize_run.py ENTITY/PROJECT/RUN_ID
```

Analyzes:
- Loss curve trend (start → current, % change, direction)
- Gradient norm health (exploding/vanishing detection)  
- Eval metrics (if present)
- Stall detection (heartbeat age)
- Progress & ETA estimate
- Config highlights
- Overall health verdict

Options: `--json` for machine-readable output.

### Watch All Running Jobs

```bash
~/clawd/venv/bin/python3 ~/clawd/skills/wandb/scripts/watch_runs.py ENTITY [--projects p1,p2]
```

Quick health summary of all running jobs plus recent failures/completions. Ideal for morning briefings.

Options:
- `--projects p1,p2` — Specific projects to check
- `--all-projects` — Check all projects
- `--hours N` — Hours to look back for finished runs (default: 24)
- `--json` — Machine-readable output

### Compare Two Runs

```bash
~/clawd/venv/bin/python3 ~/clawd/skills/wandb/scripts/compare_runs.py ENTITY/PROJECT/RUN_A ENTITY/PROJECT/RUN_B
```

Side-by-side comparison:
- Config differences (highlights important params)
- Loss curves at same steps
- Gradient norm comparison
- Eval metrics
- Performance (tokens/sec, steps/hour)
- Winner verdict

## Python API Quick Reference

```python
import wandb
api = wandb.Api()

# Get runs
runs = api.runs("entity/project", {"state": "running"})

# Run properties
run.state      # running | finished | failed | crashed | canceled
run.name       # display name
run.id         # unique identifier
run.summary    # final/current metrics
run.config     # hyperparameters
run.heartbeat_at # stall detection

# Get history
history = list(run.scan_history(keys=["train/loss", "train/grad_norm"]))
```

## Metric Key Variations

Scripts handle these automatically:
- Loss: `train/loss`, `loss`, `train_
