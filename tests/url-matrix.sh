#!/usr/bin/env bash
# Smoke-tests every route against a running server.
# Usage: BASE_URL=http://localhost:3000 ./tests/url-matrix.sh
# Exits 0 if all routes return 200, 1 otherwise.
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
FAIL=0

ROUTES=(
  "/"
  "/range"
  "/lodge"
  "/club-hunts"
  "/hunts-course"
  "/competitions"
  "/join"
  "/contact"
  "/newsletters"
  "/newsletters/2026-03"
)

echo "Testing ${#ROUTES[@]} routes against ${BASE_URL}"
echo "---"

for route in "${ROUTES[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${route}")
  if [ "$status" = "200" ]; then
    echo "  [OK]   ${route}  (${status})"
  else
    echo "  [FAIL] ${route}  (${status})"
    FAIL=1
  fi
done

echo "---"

# Check that old .html URLs redirect (301/308)
REDIRECTS=(
  "/range.html"
  "/lodge.html"
  "/join.html"
  "/contact.html"
  "/newsletters/index.html"
)

for route in "${REDIRECTS[@]}"; do
  status=$(curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}${route}")
  if [ "$status" = "301" ] || [ "$status" = "308" ]; then
    echo "  [OK]   ${route} redirects (${status})"
  else
    echo "  [FAIL] ${route} expected redirect, got ${status}"
    FAIL=1
  fi
done

echo "---"
if [ "$FAIL" -eq 0 ]; then
  echo "All checks passed."
else
  echo "One or more checks failed." >&2
  exit 1
fi
