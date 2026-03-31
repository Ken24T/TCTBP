#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

if command -v node >/dev/null 2>&1; then
  node ./scripts/validate-template-repo.js "$@"
  exit $?
fi

if command -v nodejs >/dev/null 2>&1; then
  nodejs ./scripts/validate-template-repo.js "$@"
  exit $?
fi

echo "Node.js is required to run scripts/validate-template-repo.js. Install 'node' or 'nodejs' and try again." >&2
exit 1