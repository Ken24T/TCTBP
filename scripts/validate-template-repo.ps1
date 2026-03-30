Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent $PSScriptRoot
$forwardedArgs = $args

Push-Location $repoRoot

try {
  $nodeCommand = Get-Command node, nodejs -ErrorAction SilentlyContinue | Select-Object -First 1

  if (-not $nodeCommand) {
    Write-Error "Node.js is required to run scripts/validate-template-repo.js. Install 'node' or 'nodejs' and try again."
  }

  & $nodeCommand.Source "./scripts/validate-template-repo.js" @forwardedArgs
  exit $LASTEXITCODE
}
finally {
  Pop-Location
}