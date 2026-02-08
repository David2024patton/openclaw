---
name: salesforce-dx
description: Query Salesforce data and manage sales pipelines using the `sf`.
homepage: https://github.com/openclaw/skills/tree/main/skills/rjmcgirr-pl/salesforce-dx/SKILL.md
author: tree
category: Marketing & Sales
metadata: { "openclaw": { "emoji": "📈", "source": "community", "securityStatus": "SAFE" } }
---

# salesforce-dx

Query Salesforce data and manage sales pipelines using the `sf`.

## Source

- **Author**: tree
- **Category**: Marketing & Sales  
- **Original**: [salesforce-dx](https://github.com/openclaw/skills/tree/main/skills/rjmcgirr-pl/salesforce-dx/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Salesforce DX — Data & Pipeline

Query data and manage pipelines with the `sf` CLI.

## Prerequisites

```bash
# Verify CLI and auth
sf --version
sf org list
```

If no orgs listed, authenticate:
```bash
sf org login web --alias my-org --set-default
```

## Schema Discovery

Before querying, explore available objects and fields:

```bash
# List all objects
sf sobject list --target-org my-org

# Describe object fields
sf sobject describe --sobject Opportunity --target-org my-org

# Quick field list (names only)
sf sobject describe --sobject Opportunity --target-org my-org | grep -E "^name:|^type:" 
```

## SOQL Queries

### Basic Patterns

```bash
# Simple query
sf data query -q "SELECT Id, Name, Amount FROM Opportunity LIMIT 10"

# With WHERE clause
sf data query -q "SELECT Id, Name FROM Opportunity WHERE StageName = 'Closed Won'"

# Date filtering
sf data query -q "SELECT Id, Name FROM Opportunity WHERE CloseDate = THIS_QUARTER"

# Export to CSV
sf data query -q "SELECT Id, Name, Amount FROM Opportunity" --result-format csv > opps.csv
```

### Relationships

```bash
# Parent lookup (Account from Opportunity)
sf data query -q "SELECT Id, Name, Account.Name, Account.Industry FROM Opportunity"

# Child subquery (Opportunities from Account)
sf data query -q "SELECT Id, Name, (SELECT Id, Name, Amount FROM Opportunities) FROM Account LIMIT 5"
```

### Aggregations

```bash
# COUNT
sf data query -q "SELECT COUNT(Id) total FROM Opportunity WHERE IsClosed = false"

# SUM and GROUP BY
sf data query -q "SELECT StageName, SUM(Amount) total FROM Opportunity GROUP BY StageName"

# Multiple aggregates
sf data query -q "SELECT StageName, COUNT(Id) cnt, SUM(Amount) total, AVG(Amount) avg FROM Opportunity GROUP BY StageName"
```

### Bulk Queries (Large Datasets)

```bash
# Use --bulk for >2000 records
sf data query -q "SELECT Id, Name, Amount FROM Opportunity" --bulk --wait 10
```

## Pipeline Management

### Pipeline Snapshot

```bash
# Open pipeline by stage
sf data query -q "S
