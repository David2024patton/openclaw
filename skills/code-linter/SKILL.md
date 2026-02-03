---
name: code-linter
description: Run Python linter to verify code quality and catch syntax errors. Used by testing agents to validate code before marking tasks as done.
metadata:
  {
    "openclaw": { "emoji": "🔍", "requires": { "bins": ["python"] } },
  }
---

# Code Linter

Run the built-in Python linter (`wizard_lint.py`) to check code quality and catch syntax errors. This skill is used by testing agents to automatically verify code before marking tasks as done.

## Usage

The linter checks all Python files in the current directory (and subdirectories) for syntax errors by attempting to compile them.

```bash
# Run linter from project root
bash workdir:~/project command:"python wizard_lint.py"

# Or if wizard_lint.py is in a different location
bash workdir:~/project command:"python /path/to/wizard_lint.py"
```

## Output

The linter prints:
- `[OK] <file>` for files that compile successfully
- `[FAIL] <file>` for files with syntax errors, followed by the error message

Exit code:
- `0` if all files pass
- `1` if any files fail

## Integration with Wizard Tasks

When a task is moved to "testing" status, agents should:

1. Run the linter: `bash workdir:<project-dir> command:"python wizard_lint.py"`
2. Parse the output to extract errors
3. Update the task with `wizard_tasks` tool:
   - Set `lintStatus: "failed"` if errors found
   - Set `lintStatus: "passed"` if no errors
   - Set `lintErrors` array with file, line, and message for each error
4. If errors found, attempt to fix them
5. After fixing, run linter again
6. If fixed, set `lintStatus: "fixed"` and record learning with `wizard_tasks learning.add`

## Self-Learning

When an agent fixes a lint error, it should record the pattern:

```json
{
  "taskId": "task-123",
  "error": "SyntaxError: invalid syntax",
  "fix": "Added missing colon",
  "pattern": "missing colon after if statement"
}
```

This allows the framework to learn from mistakes and apply fixes automatically in the future.
