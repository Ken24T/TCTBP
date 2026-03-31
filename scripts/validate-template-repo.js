#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const expectedValidationCommand = "node ./scripts/validate-template-repo.js";
const expectedReconcileTrigger = "reconcile-tctbp <absolute-target-repo-path>";
const requiredFiles = [
  ".github/workflows/validate-template-repo.yml",
  ".github/agents/TCTBP.agent.md",
  ".github/hooks/tctbp-safety.json",
  ".github/TCTBP.json",
  ".github/TCTBP Agent.md",
  ".github/TCTBP Cheatsheet.md",
  ".github/copilot-instructions.md",
  ".github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md",
  "scripts/tctbp-pretool-hook.js",
  "scripts/validate-template-repo.js",
  "scripts/validate-template-repo.ps1",
  "scripts/validate-template-repo.sh",
  "README.md",
  "VERSION",
  "CHANGELOG.md"
];

const errors = [];

for (const relativePath of requiredFiles) {
  if (!fs.existsSync(resolveRepoPath(relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

const profile = readJson(".github/TCTBP.json", "TCTBP.json must contain valid JSON.");

if (profile) {
  validateProfile(profile);
}

validateVersionFile();
validateReadme();
validateFrontmatter(".github/agents/TCTBP.agent.md", ["description", "name", "tools"]);
validateFrontmatter(
  ".github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md",
  ["description", "name", "argument-hint", "agent"]
);
validateHookConfig();
validateTriggerCoverage();
validateWorkflowSections();
validateShipOrder();
validateBranchAutoRenamePolicy();
validateShellWrapper();
validatePowerShellWrapper();
validateWorkflow();
validateCheatsheet();

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }

  process.exit(1);
}

console.log("Template repository validation passed.");

function resolveRepoPath(relativePath) {
  return path.join(repoRoot, relativePath);
}

function readText(relativePath) {
  return fs.readFileSync(resolveRepoPath(relativePath), "utf8");
}

function readJson(relativePath, errorMessage) {
  try {
    return JSON.parse(readText(relativePath));
  } catch {
    errors.push(errorMessage);
    return null;
  }
}

function validateProfile(profileData) {
  const commands = profileData.profile && profileData.profile.commands ? profileData.profile.commands : {};

  for (const key of ["test", "lint", "build"]) {
    if (commands[key] !== expectedValidationCommand) {
      errors.push(
        `TCTBP.json must set profile.commands.${key} to '${expectedValidationCommand}'.`
      );
    }
  }

  if (!profileData.governance || profileData.governance.templateMode !== false) {
    errors.push("TCTBP.json must be in live profile mode for this repository.");
  }
}

function validateBranchAutoRenamePolicy() {
  const branchCommand = profile && profile.activation ? profile.activation.branchCommand || {} : {};
  const branch = profile && profile.branch ? profile.branch : {};
  const guidance = readText(".github/TCTBP Agent.md");
  const cheatsheet = readText(".github/TCTBP Cheatsheet.md");

  const checks = [
    [branchCommand.autoRenameTargetWhenExists === true, "TCTBP.json activation.branchCommand.autoRenameTargetWhenExists must be true in the canonical repo."],
    [branch.autoRenameTargetWhenExists === true, "TCTBP.json branch.autoRenameTargetWhenExists must be true in the canonical repo."],
    [branchCommand.stopIfTargetBranchExistsLocal === false, "TCTBP.json activation.branchCommand.stopIfTargetBranchExistsLocal must be false when auto-rename is enabled."],
    [branchCommand.stopIfTargetBranchExistsRemote === false, "TCTBP.json activation.branchCommand.stopIfTargetBranchExistsRemote must be false when auto-rename is enabled."],
    [branch.stopIfTargetBranchExistsLocal === false, "TCTBP.json branch.stopIfTargetBranchExistsLocal must be false when auto-rename is enabled."],
    [branch.stopIfTargetBranchExistsRemote === false, "TCTBP.json branch.stopIfTargetBranchExistsRemote must be false when auto-rename is enabled."],
    [branchCommand.autoRenameSuffixSeparator === "-", "TCTBP.json activation.branchCommand.autoRenameSuffixSeparator must remain '-'."],
    [branch.autoRenameSuffixSeparator === "-", "TCTBP.json branch.autoRenameSuffixSeparator must remain '-'."],
    [branchCommand.autoRenameStartAt === 1, "TCTBP.json activation.branchCommand.autoRenameStartAt must remain 1."],
    [branch.autoRenameStartAt === 1, "TCTBP.json branch.autoRenameStartAt must remain 1."]
  ];

  for (const [condition, message] of checks) {
    if (!condition) {
      errors.push(message);
    }
  }

  if (!guidance.includes("appending `-1`, then `-2`")) {
    errors.push(".github/TCTBP Agent.md must document the numeric branch auto-rename suffix behaviour.");
  }

  if (!guidance.includes("requested branch name and the resolved branch name")) {
    errors.push(".github/TCTBP Agent.md must report requested and resolved branch names when auto-renaming occurs.");
  }

  if (!cheatsheet.includes("auto-rename the requested branch to `-1`, `-2`")) {
    errors.push(".github/TCTBP Cheatsheet.md must document the branch auto-rename suffix behaviour.");
  }
}

function validateVersionFile() {
  const version = readText("VERSION").trim();

  if (!/^\d+\.\d+\.\d+$/.test(version)) {
    errors.push("VERSION must contain a semantic version such as 0.1.0.");
  }
}

function validateReadme() {
  const readme = readText("README.md");

  if (!readme.includes("# TCTBP Template Repository")) {
    errors.push("README.md does not appear to be the expected repository README.");
  }

  if (!readme.includes(expectedReconcileTrigger)) {
    errors.push("README.md must mention the reconcile-tctbp trigger for the canonical prompt.");
  }
}

function validateFrontmatter(relativePath, requiredKeys) {
  const content = readText(relativePath);
  const lines = content.split(/\r?\n/);

  if (lines[0] !== "---") {
    errors.push(`${relativePath} must start with YAML frontmatter delimited by '---'.`);
    return;
  }

  const closingIndex = lines.slice(1).findIndex((line) => line === "---");

  if (closingIndex === -1) {
    errors.push(`${relativePath} must include a closing YAML frontmatter delimiter.`);
    return;
  }

  const frontmatter = lines.slice(1, closingIndex + 1);
  const keys = new Set();

  for (const line of frontmatter) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/);

    if (match) {
      keys.add(match[1]);
    }
  }

  for (const key of requiredKeys) {
    if (!keys.has(key)) {
      errors.push(`${relativePath} frontmatter must include '${key}'.`);
    }
  }
}

function validateHookConfig() {
  const hookConfig = readJson(
    ".github/hooks/tctbp-safety.json",
    "tctbp-safety.json must contain valid JSON."
  );

  if (!hookConfig) {
    return;
  }

  const preToolUse =
    hookConfig.hooks && Array.isArray(hookConfig.hooks.PreToolUse)
      ? hookConfig.hooks.PreToolUse[0]
      : null;

  if (!preToolUse) {
    errors.push("tctbp-safety.json must define a PreToolUse hook.");
    return;
  }

  if (preToolUse.command !== "node scripts/tctbp-pretool-hook.js") {
    errors.push("tctbp-safety.json must point the default hook command at scripts/tctbp-pretool-hook.js.");
  }

  if (preToolUse.linux !== "node scripts/tctbp-pretool-hook.js || nodejs scripts/tctbp-pretool-hook.js") {
    errors.push("tctbp-safety.json must keep the Linux hook command aligned with the installed hook script.");
  }

  if (preToolUse.osx !== "node scripts/tctbp-pretool-hook.js || nodejs scripts/tctbp-pretool-hook.js") {
    errors.push("tctbp-safety.json must keep the macOS hook command aligned with the installed hook script.");
  }
}

function validateTriggerCoverage() {
  const activationTriggers = Array.isArray(profile && profile.activation && profile.activation.triggers)
    ? profile.activation.triggers
    : [];
  const expectedTriggers = [...activationTriggers, "branch", "branch <new-branch-name>"];

  const agentEntryPoint = readText(".github/agents/TCTBP.agent.md");
  const agentGuidance = readText(".github/TCTBP Agent.md");
  const instructions = readText(".github/copilot-instructions.md");
  const prompt = readText(".github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md");

  for (const trigger of activationTriggers) {
    if (!agentEntryPoint.includes(trigger)) {
      errors.push(`.github/agents/TCTBP.agent.md must mention the '${trigger}' trigger.`);
    }
  }

  for (const requiredText of ["branch", "branch <new-branch-name>"]) {
    if (!agentEntryPoint.includes(requiredText)) {
      errors.push(`.github/agents/TCTBP.agent.md must mention '${requiredText}'.`);
    }
  }

  const agentGuidanceTriggers = extractBacktickListFromSection(
    agentGuidance,
    /^## Activation Signal$/m
  );
  const instructionTriggers = extractBacktickListFromSection(
    instructions,
    /^Supported triggers remain:$/m
  );

  assertExactList(
    agentGuidanceTriggers,
    expectedTriggers,
    ".github/TCTBP Agent.md activation trigger list must stay aligned with .github/TCTBP.json.",
    { ignoreOrder: true }
  );
  assertExactList(
    instructionTriggers,
    expectedTriggers,
    ".github/copilot-instructions.md supported triggers list must stay aligned with .github/TCTBP.json.",
    { ignoreOrder: true }
  );

  if (!prompt.includes(expectedReconcileTrigger)) {
    errors.push("The consolidated reconcile prompt must mention the reconcile-tctbp trigger.");
  }

  if (!instructions.includes(expectedReconcileTrigger)) {
    errors.push(".github/copilot-instructions.md must mention the reconcile-tctbp trigger.");
  }
}

function validateWorkflowSections() {
  const guidance = readText(".github/TCTBP Agent.md");
  const workflowHeadings = {
    branchOrder: /^## Branch Workflow \(Convenience Command\)$/m,
    publishOrder: /^## Publish Workflow \(Safe branch publication\)$/m,
    checkpointOrder: /^## Checkpoint Workflow \(Local-only durable save\)$/m,
    handoverOrder: /^## Handover Workflow \(End-of-day publication and metadata refresh\)$/m,
    resumeOrder: /^## Resume Workflow \(Start-of-day restore\)$/m,
    statusOrder: /^## Status Workflow \(Quick state check\)$/m,
    abortOrder: /^## Abort Workflow \(Partial operation recovery\)$/m,
    deployOrder: /^## Deploy Workflow \(Runtime build and local installation\)$/m,
    shipOrder: /^## SHIP \/ TCTBP Workflow$/m
  };

  for (const workflowKey of Object.keys(profile.workflow || {}).filter((key) => key.endsWith("Order"))) {
    const expectedHeading = workflowHeadings[workflowKey];

    if (!expectedHeading || !expectedHeading.test(guidance)) {
      errors.push(`.github/TCTBP Agent.md must include the documented section for ${workflowKey}.`);
    }
  }
}

function validateShipOrder() {
  const configuredShipOrder = Array.isArray(profile && profile.workflow && profile.workflow.shipOrder)
    ? profile.workflow.shipOrder
    : [];
  const guidance = readText(".github/TCTBP Agent.md");
  const extractedShipOrder = extractShipOrderFromGuidance(guidance);

  assertExactList(
    extractedShipOrder,
    configuredShipOrder,
    ".github/TCTBP Agent.md SHIP step headings must stay aligned with workflow.shipOrder in .github/TCTBP.json."
  );
}

function validateShellWrapper() {
  const wrapper = readText("scripts/validate-template-repo.sh");

  if (!wrapper.includes("validate-template-repo.js")) {
    errors.push("scripts/validate-template-repo.sh must delegate to scripts/validate-template-repo.js.");
  }

  if (!wrapper.includes("command -v node") || !wrapper.includes("command -v nodejs")) {
    errors.push("scripts/validate-template-repo.sh must preserve both node and nodejs lookup for Linux compatibility.");
  }
}

function validatePowerShellWrapper() {
  const wrapper = readText("scripts/validate-template-repo.ps1");

  if (!wrapper.includes("validate-template-repo.js")) {
    errors.push("scripts/validate-template-repo.ps1 must delegate to scripts/validate-template-repo.js.");
  }

  if (!wrapper.includes("Get-Command node, nodejs")) {
    errors.push("scripts/validate-template-repo.ps1 must look up both node and nodejs for Windows compatibility.");
  }
}

function validateWorkflow() {
  const workflow = readText(".github/workflows/validate-template-repo.yml");

  for (const requiredText of ["ubuntu-latest", "windows-latest", expectedValidationCommand]) {
    if (!workflow.includes(requiredText)) {
      errors.push(`.github/workflows/validate-template-repo.yml must include '${requiredText}'.`);
    }
  }
}

function validateCheatsheet() {
  const cheatsheet = readText(".github/TCTBP Cheatsheet.md");

  if (!cheatsheet.includes(expectedValidationCommand)) {
    errors.push(".github/TCTBP Cheatsheet.md must document the portable validation command.");
  }

  if (!cheatsheet.includes("./scripts/validate-template-repo.sh")) {
    errors.push(".github/TCTBP Cheatsheet.md must mention the Linux shell wrapper for validation.");
  }

  if (!cheatsheet.includes("./scripts/validate-template-repo.ps1")) {
    errors.push(".github/TCTBP Cheatsheet.md must mention the Windows PowerShell wrapper for validation.");
  }
}

function extractBacktickListFromSection(text, anchorPattern) {
  const lines = text.split(/\r?\n/);
  const anchorIndex = lines.findIndex((line) => anchorPattern.test(line));

  if (anchorIndex === -1) {
    return [];
  }

  const values = [];
  let inBulletBlock = false;

  for (const line of lines.slice(anchorIndex + 1)) {
    if (/^##\s+/.test(line)) {
      break;
    }

    if (!line.trim()) {
      if (inBulletBlock) {
        break;
      }

      continue;
    }

    if (!line.startsWith("- ")) {
      continue;
    }

    inBulletBlock = true;

    for (const match of line.matchAll(/`([^`]+)`/g)) {
      values.push(match[1]);
    }
  }

  return values;
}

function extractShipOrderFromGuidance(text) {
  const lines = text.split(/\r?\n/);
  const startIndex = lines.findIndex((line) => line === "## SHIP / TCTBP Workflow");

  if (startIndex === -1) {
    return [];
  }

  const extracted = [];

  for (const line of lines.slice(startIndex + 1)) {
    if (/^##\s+/.test(line)) {
      break;
    }

    const match = line.match(/^###\s+\d+\.\s+(.+)$/);

    if (!match) {
      continue;
    }

    const normalized = normalizeShipStep(match[1]);

    if (normalized) {
      extracted.push(normalized);
    }
  }

  return extracted;
}

function normalizeShipStep(stepHeading) {
  const normalized = stepHeading
    .toLowerCase()
    .replace(/\(approval required\)/g, "")
    .replace(/\(optional\)/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const aliases = {
    "bump-version": "bump",
    changelog: "changelog",
    "docs-impact": "docs-impact",
    preflight: "preflight",
    verify: "verify",
    problems: "problems",
    commit: "commit",
    tag: "tag",
    push: "push"
  };

  return aliases[normalized] || null;
}

function assertExactList(actual, expected, message, options = {}) {
  if (options.ignoreOrder) {
    assertEquivalentList(actual, expected, message);
    return;
  }

  if (actual.length !== expected.length) {
    errors.push(`${message} Expected ${expected.length} entries but found ${actual.length}.`);
    return;
  }

  for (let index = 0; index < expected.length; index += 1) {
    if (actual[index] !== expected[index]) {
      errors.push(
        `${message} Mismatch at position ${index + 1}: expected '${expected[index]}' but found '${actual[index]}'.`
      );
      return;
    }
  }
}

function assertEquivalentList(actual, expected, message) {
  if (actual.length !== expected.length) {
    errors.push(`${message} Expected ${expected.length} entries but found ${actual.length}.`);
    return;
  }

  const actualCounts = countValues(actual);
  const expectedCounts = countValues(expected);

  for (const value of Object.keys(expectedCounts)) {
    if (actualCounts[value] !== expectedCounts[value]) {
      errors.push(
        `${message} Expected '${value}' to appear ${expectedCounts[value]} time(s) but found ${actualCounts[value] || 0}.`
      );
      return;
    }
  }

  for (const value of Object.keys(actualCounts)) {
    if (!(value in expectedCounts)) {
      errors.push(`${message} Found unexpected entry '${value}'.`);
      return;
    }
  }
}

function countValues(values) {
  const counts = Object.create(null);

  for (const value of values) {
    counts[value] = (counts[value] || 0) + 1;
  }

  return counts;
}