#!/bin/bash
# TypeScript Error Reporter for OpenClaw UI
# Run this script from the ui directory: ./check-errors.sh

echo "=========================================="
echo "OpenClaw UI TypeScript Error Report"
echo "Generated at: $(date)"
echo "=========================================="
echo ""

# Run TypeScript check and capture output
npx tsc --noEmit 2>&1 | tee /tmp/tsc_errors.txt

# Count errors
ERROR_COUNT=$(grep -c "error TS" /tmp/tsc_errors.txt 2>/dev/null || echo "0")

echo ""
echo "=========================================="
echo "Summary"
echo "=========================================="
echo "Total errors: $ERROR_COUNT"
echo ""

# Group errors by file
echo "Errors by file:"
grep "error TS" /tmp/tsc_errors.txt | cut -d'(' -f1 | sort | uniq -c | sort -rn

echo ""
echo "=========================================="
echo "Errors by type:"
echo "=========================================="
grep -oE "error TS[0-9]+" /tmp/tsc_errors.txt | sort | uniq -c | sort -rn

echo ""
echo "Full error list saved to: /tmp/tsc_errors.txt"
