---
name: intelligent-budget-tracker
description: Intelligent budget tracking and financial management library for AI agents - expense tracking, income management,.
homepage: https://github.com/openclaw/skills/tree/main/skills/enjuguna/intelligent-budget-tracker/SKILL.md
author: tree
category: AI & LLMs
metadata: { "openclaw": { "emoji": "🤖", "source": "community", "securityStatus": "SAFE" } }
---

# intelligent-budget-tracker

Intelligent budget tracking and financial management library for AI agents - expense tracking, income management,.

## Source

- **Author**: tree
- **Category**: AI & LLMs  
- **Original**: [intelligent-budget-tracker](https://github.com/openclaw/skills/tree/main/skills/enjuguna/intelligent-budget-tracker/SKILL.md)
- **Security Status**: SAFE

## Instructions

# Agent Money Tracker

A TypeScript library for AI agents to track expenses, income, budgets, and savings goals with LLM-powered natural language parsing. **No frontend required** - designed for programmatic use by agents and bots.

## Installation

```bash
npm install agent-money-tracker
```

---

## Usage

### Initialize the Budget Tracker

```typescript
import { clawhub } from 'agent-money-tracker';

// Initialize (required before any operations)
await clawhub.initialize();

// Or with custom storage path
await clawhub.initialize('/path/to/data');
```

### Expense Tracking

```typescript
// Add an expense
await clawhub.addExpense(50, 'Food & Dining', 'Grocery shopping', {
  date: '2026-01-31',
  tags: ['weekly', 'essentials'],
  merchant: 'Whole Foods'
});

// Natural language input
await clawhub.addFromNaturalLanguage('spent $45 on uber yesterday');

// Get recent expenses
const expenses = clawhub.getExpenses({ limit: 10 });

// Filter by category and date range
const foodExpenses = clawhub.getExpenses({
  category: 'Food & Dining',
  startDate: '2026-01-01',
  endDate: '2026-01-31'
});
```

### Income Tracking

```typescript
// Add income
await clawhub.addIncome(5000, 'Salary', 'January salary', {
  date: '2026-01-15'
});

// Add freelance income
await clawhub.addIncome(500, 'Freelance', 'Website project');

// Get all income
const income = clawhub.getIncome();
```

### Budget Management

```typescript
// Create a monthly budget
await clawhub.createBudget('Food Budget', 'Food & Dining', 500, 'monthly', 0.8);

// Check budget status
const status = clawhub.getBudgetStatus();
// Returns: [{ budgetName, spent, limit, remaining, percentageUsed, status }]

// Get budget alerts
const alerts = clawhub.checkBudgetAlerts();
// Returns warnings when threshold or limit exceeded

// Get smart budget suggestions
const suggestions = clawhub.suggestBudgetLimits();
// Returns: [{ category, suggeste
