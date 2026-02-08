---
name: neo4j
description: Query Neo4j knowledge graph for context retrieval. USE THIS PROACTIVELY before responding to questions about skills, tools, or documentation.
homepage: https://neo4j.com/docs/
metadata:
  {
    "openclaw":
      {
        "emoji": "🔗",
        "priority": "high",
        "autoUse": true,
        "requires": { "bins": ["python"], "env": ["NEO4J_URI", "NEO4J_USER", "NEO4J_PASS"] },
      },
  }
---

# Neo4j Knowledge Graph (GraphRAG)

Your primary knowledge store containing skills, documentation, and context.

## ⚠️ Required Behavior (MUST READ)

**ALWAYS query Neo4j FIRST when:**

- User asks about skills, tools, or capabilities
- User asks about documentation or how to do something
- User asks about databases or data stores
- You need context for a response
- You're unsure if a skill exists

**DO NOT:**

- Answer from memory when Neo4j has the data
- Say "I don't know" without checking Neo4j first
- Explain how to query - just DO the query

## Connection

```
NEO4J_URI=${NEO4J_URI}           # e.g. bolt://your-server:7687
NEO4J_USER=${NEO4J_USER}         # e.g. neo4j
NEO4J_PASS=${NEO4J_PASS}         # your Neo4j password
NEO4J_BROWSER=${NEO4J_HTTP}      # e.g. http://your-server:7474/browser/
```

---

## How to Use (Copy-Paste These Exact Commands)

### When User Asks: "How many skills do you have?"

```bash
cd D:\.OpenClaw\openclaw\tools && python -c "from neo4j_tool import get_graph_stats; import json; r=get_graph_stats(); print(json.dumps(r, indent=2))"
```

### When User Asks: "What Docker skills do you have?"

```bash
cd D:\.OpenClaw\openclaw\tools && python -c "from neo4j_tool import find_skills; import json; r=find_skills('docker'); print(json.dumps(r, indent=2))"
```

### When User Asks: "How do I use [skill-name]?"

```bash
cd D:\.OpenClaw\openclaw\tools && python -c "from neo4j_tool import get_skill_instructions; import json; r=get_skill_instructions('dokploy'); print(r.get('instructions', 'No instructions found')[:500])"
```

### Search by Category

```bash
cd D:\.OpenClaw\openclaw\tools && python -c "from neo4j_tool import find_skills; import json; r=find_skills(category='AI & LLMs', status='SAFE'); print(json.dumps(r, indent=2))"
```

**CRITICAL**: When the user asks about skills, tools, or capabilities, RUN ONE OF THESE COMMANDS. Don't explain, don't paraphrase - EXECUTE the command and show the results.

---

## Graph Contents

| What             | Count | Query                                                              |
| ---------------- | ----- | ------------------------------------------------------------------ |
| Community Skills | 463   | `MATCH (s:CommunitySkill) RETURN s`                                |
| Documentation    | 197   | `MATCH (d:DocPage) RETURN d`                                       |
| Core Skills      | 55    | `MATCH (s:Skill) RETURN s`                                         |
| Categories       | 4     | AI & LLMs, DevOps & Cloud, Browser & Automation, Marketing & Sales |

---

## All Commands Reference

### 🔍 SEARCH

| Command                             | Purpose            |
| ----------------------------------- | ------------------ |
| `find_skills(keyword)`              | Search by keyword  |
| `find_skills(category="AI & LLMs")` | Filter by category |
| `find_skills(status="SAFE")`        | Filter by security |
| `get_skill_details(name)`           | Full skill info    |

### 📊 INFO

| Command             | Purpose            |
| ------------------- | ------------------ |
| `get_graph_stats()` | Node counts        |
| `get_schema()`      | Graph structure    |
| `get_categories()`  | List categories    |
| `count_by_status()` | Security breakdown |

### 📸 EXPORT

| Command               | Purpose            |
| --------------------- | ------------------ |
| `snapshot_graph()`    | Save graph to JSON |
| `export_skills_csv()` | Export to CSV      |
| `backup_graph()`      | Timestamped backup |

### ⚡ RAW CYPHER

| Command                     | Purpose        |
| --------------------------- | -------------- |
| `neo4j_query("MATCH...")`   | Run any Cypher |
| `create_node(label, props)` | Create node    |
| `delete_node(label, name)`  | Delete node    |

---

## Example Cypher Queries

```cypher
-- View entire graph
MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 300

-- Find all safe AI skills
MATCH (s:CommunitySkill)
WHERE s.category = "AI & LLMs" AND s.securityStatus = "SAFE"
RETURN s.name, s.description

-- Search by keyword
MATCH (s:CommunitySkill)
WHERE toLower(s.name) CONTAINS "docker"
RETURN s.name, s.category
```

---

## Tool Location

Python tool: `D:\.OpenClaw\openclaw\tools\neo4j_tool.py`

To use from command line:

```bash
cd D:\.OpenClaw\openclaw\tools
python -c "from neo4j_tool import find_skills; print(find_skills('browser'))"
```
