---
name: eleutherios
description: Epistemic analysis infrastructure - query knowledge graphs with suppression detection, coordination signatures.
homepage: https://github.com/openclaw/skills/tree/main/skills/eleutherios-project/eleutherios/SKILL.md
author: tree
category: DevOps & Cloud
metadata: { "openclaw": { "emoji": "☁️", "source": "community", "securityStatus": "SAFE" } }
---

# eleutherios

Epistemic analysis infrastructure - query knowledge graphs with suppression detection, coordination signatures.

## Source

- **Author**: tree
- **Category**: DevOps & Cloud  
- **Original**: [eleutherios](https://github.com/openclaw/skills/tree/main/skills/eleutherios-project/eleutherios/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Eleutherios - Epistemic Analysis Infrastructure

Query knowledge graphs built from your document collections. Detect suppression patterns, coordination signatures, and get multi-perspective analysis on contested topics.

## What This Skill Does

Eleutherios transforms document collections into knowledge graphs with claim-level extraction, then runs detection algorithms to surface patterns that traditional search misses:

- **Suppression Detection**: Identifies funding cuts, career impacts, publication obstacles, and institutional marginalization patterns documented within sources
- **Coordination Signatures**: Detects timing patterns, shared language, and citation network anomalies suggesting coordinated messaging
- **Multi-Perspective Clustering**: Groups claims by viewpoint so you can see all sides of contested topics
- **Source Topology Analysis**: Maps citation networks and trust relationships between sources

## When to Use This Skill

Use Eleutherios when you need to:

- Research topics where institutional consensus may be manufactured
- Analyze historical documents for suppression patterns (e.g., declassified materials, congressional testimony)
- Compare how different sources treat the same topic
- Build understanding of contested scientific or historical debates
- Investigate citation voids and research threads that mysteriously dead-end

Example prompts:
- "What does Eleutherios show about suppression patterns for Thomas Paine?"
- "Get perspectives on plasma propulsion research from my knowledge graph"
- "Analyze the topic of electrogravitics - what sources exist and what patterns emerge?"
- "Assess the source topology for the Smedley Butler FBI files"

## Prerequisites

**Eleutherios must be running locally before using this skill.**

### Quick Start (Docker)

```bash
# Clone the repository
git clone https://github.com/Eleutherios-project/Eleutherios-docker.git
cd Eleutherios-docker

# Start the stack
docker-compose up -d

# Verify MCP server is running

