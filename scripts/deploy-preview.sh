#!/usr/bin/env bash
# Deploy a Vercel preview and capture the URL.
# Usage: ./scripts/deploy-preview.sh
# Requires: VERCEL_TOKEN env var set
set -euo pipefail

if [ -z "${VERCEL_TOKEN:-}" ]; then
  echo "[ERROR] VERCEL_TOKEN is not set." >&2
  exit 1
fi

PREVIEW_URL=$(npx vercel --token "$VERCEL_TOKEN" --yes 2>&1 | grep -E '^https://' | tail -1)

if [ -z "$PREVIEW_URL" ]; then
  echo "[ERROR] Could not parse preview URL from Vercel output." >&2
  exit 1
fi

echo "$PREVIEW_URL" > .preview-url
echo "[OK] Preview deployed: $PREVIEW_URL"
