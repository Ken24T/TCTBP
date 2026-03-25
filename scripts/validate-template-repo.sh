#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$repo_root"

required_files=(
  ".github/TCTBP.json"
  ".github/TCTBP Agent.md"
  ".github/TCTBP Cheatsheet.md"
  ".github/copilot-instructions.md"
  ".github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md"
  "README.md"
  "VERSION"
  "CHANGELOG.md"
)

for file in "${required_files[@]}"; do
  [[ -f "$file" ]] || {
    echo "Missing required file: $file" >&2
    exit 1
  }
done

python3 -m json.tool .github/TCTBP.json >/dev/null

version_pattern='^[0-9]+\.[0-9]+\.[0-9]+$'
grep -Eq "$version_pattern" VERSION || {
  echo "VERSION must contain a semantic version such as 0.1.0" >&2
  exit 1
}

grep -q "# TCTBP Template Repository" README.md || {
  echo "README.md does not appear to be the expected repository README" >&2
  exit 1
}

if ! python3 - <<'PY'
import json
from pathlib import Path

profile = json.loads(Path('.github/TCTBP.json').read_text())
if profile.get('governance', {}).get('templateMode') is not False:
    raise SystemExit(1)
PY
then
  echo "TCTBP.json must be in live profile mode for this repository" >&2
  exit 1
fi

echo "Template repository validation passed."