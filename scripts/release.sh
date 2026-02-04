#!/bin/bash
# Trigger GitHub release workflow
# Usage: ./scripts/release.sh v0.1.1

if [ -z "$1" ]; then
  echo "Usage: npm run release <version>"
  echo "Example: npm run release v0.1.1"
  exit 1
fi

gh workflow run release.yml -f version="$1"
