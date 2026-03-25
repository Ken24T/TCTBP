---
description: "Use when the canonical TCTBP repository needs to install or refresh the full TCTBP custom-agent infrastructure in another repository, including agent, policy, docs, prompts, and optional hook enforcement."
name: "Install TCTBP Agent Infrastructure Into Another Repository"
argument-hint: "Target repository path, whether it is new or existing, and whether to include the hook layer"
agent: "agent"
---

# Install TCTBP Agent Infrastructure Into Another Repository

Use this prompt inside the canonical TCTBP repository when you want Copilot to set up the full TCTBP agent environment in a different repository.

## Goal

Install or refresh the TCTBP runtime infrastructure in a target repository so that the target repository gains:

- a custom TCTBP agent entry point
- a machine-readable workflow policy
- aligned Markdown workflow guidance
- operator prompts for onboarding and updating
- optional runtime hook enforcement for risky git commands

The canonical TCTBP repository is the source of generic workflow logic.
The target repository is the source of repo-specific commands, paths, deployment details, and intentional local deviations.

## Required Inputs

Fill in these values before using the prompt.

```text
Target repository path: <ABSOLUTE_TARGET_REPO_PATH>
Target repository state: <NEW_REPOSITORY_OR_EXISTING_REPOSITORY>
Preferred install/update branch in target repo: <BRANCH_NAME_OR_NULL>
Include hook layer: <YES_OR_NO>
Backup mode for existing repo: <NONE_OR_BRANCH_ONLY_OR_BRANCH_AND_FILE_BACKUPS>
Canonical ref to use from this TCTBP repo: <CURRENT_BRANCH_TAG_OR_COMMIT>
Any repo-specific settings that must be preserved exactly: <LIST_OR_NONE>
Any intentional local workflow deviations that must not be normalised away: <LIST_OR_NONE>
```

## Canonical Files To Use From This Repository

Read these files from the current canonical TCTBP repository first:

- `.github/agents/TCTBP.agent.md`
- `.github/TCTBP.json`
- `.github/TCTBP Agent.md`
- `.github/TCTBP Cheatsheet.md`
- `.github/copilot-instructions.md`
- `.github/prompts/Onboard New Repository.prompt.md`
- `.github/prompts/Update Existing Repository From TCTBP.prompt.md`

If `Include hook layer` is `YES`, also read:

- `.github/hooks/tctbp-safety.json`
- `scripts/tctbp-pretool-hook.js`

## Target Files To Create Or Update

Install or update these files in the target repository:

- `.github/agents/TCTBP.agent.md`
- `.github/TCTBP.json`
- `.github/TCTBP Agent.md`
- `.github/TCTBP Cheatsheet.md`
- `.github/copilot-instructions.md`
- `.github/prompts/Onboard New Repository.prompt.md`
- `.github/prompts/Update Existing Repository From TCTBP.prompt.md`

If `Include hook layer` is `YES`, also install or update:

- `.github/hooks/tctbp-safety.json`
- `scripts/tctbp-pretool-hook.js`

## Installation Modes

### New repository

If `Target repository state` is `NEW_REPOSITORY`:

1. Treat the target repository as not yet configured for TCTBP.
2. Create any missing `.github/agents`, `.github/hooks`, `.github/prompts`, and `scripts` folders as required.
3. Adapt the canonical files to the target repository using the target repo's actual project details.
4. Replace placeholders or unresolved values only when the target repository contains enough evidence.
5. If key values are missing, leave them explicitly unresolved or ask for clarification rather than guessing.

### Existing repository

If `Target repository state` is `EXISTING_REPOSITORY`:

1. Read the target repository's existing TCTBP files first if they exist.
2. Preserve repo-specific values such as commands, version files, docs paths, deploy targets, locale, and intentional workflow deviations.
3. Merge forward generic improvements from the canonical repository instead of blindly overwriting local files.
4. If `Backup mode` requests backups, create them before editing.
5. Prefer a dedicated branch when the target repository is already under version control.

## What Must Be Customised In The Target Repository

Do not leave canonical-repo-specific values behind. Customise at least these categories:

- project name and description
- default branch name
- format, test, lint, build, and release-build commands
- version files and version source rules
- deploy target details and post-deploy checks
- docs and runbook review paths
- locale or writing conventions
- branch naming preferences if the target repo uses them

Update the custom agent description so it refers to the target repository rather than the canonical TCTBP repository.

## Hook Layer Rules

If `Include hook layer` is `YES`:

1. Install both `.github/hooks/tctbp-safety.json` and `scripts/tctbp-pretool-hook.js`.
2. Verify that the target environment has `node` or `nodejs` available on `PATH`, or clearly report that the hook is installed but not yet runnable.
3. Keep the hook narrow and auditable; do not broaden it unless explicitly asked.

If `Include hook layer` is `NO`:

1. Do not install the hook files.
2. Do not leave stale references to missing hook files in the target repository's docs or instructions.

## Required Behaviour

1. Read the canonical TCTBP files from the current repository.
2. Inspect the target repository structure, commands, version files, and documentation paths before editing.
3. Determine whether the target repo is a new install or an update.
4. Create the required files and folders in the target repo.
5. Preserve repo-specific settings while applying the canonical runtime model.
6. Keep these target files aligned with each other after editing:
   - `.github/agents/TCTBP.agent.md`
   - `.github/TCTBP.json`
   - `.github/TCTBP Agent.md`
   - `.github/TCTBP Cheatsheet.md`
   - `.github/copilot-instructions.md`
   - `.github/prompts/Onboard New Repository.prompt.md`
   - `.github/prompts/Update Existing Repository From TCTBP.prompt.md`
7. If the hook layer is included, keep `.github/hooks/tctbp-safety.json` and `scripts/tctbp-pretool-hook.js` aligned with the installed documentation.
8. Validate the edited files using available JSON/Markdown diagnostics and any lightweight repo validation that fits the change type.
9. Do not perform SHIP, publish, deploy, or handover in the target repo unless explicitly requested.

## What You Must Not Do

Do not:

- leave references instructing the target repo to depend on this canonical repo at runtime
- copy repo-specific commands or paths from the canonical repo into the target repo without adaptation
- overwrite existing target-repo workflow files wholesale without review
- guess unknown commands, version files, deploy steps, or docs paths
- install the hook layer without also installing its supporting script
- use stash, reset, rebase, force-push, or destructive checkout as part of the setup

## Preferred Final Summary

When finished, report:

1. which canonical ref from this repository was used
2. which target repository path was updated
3. which files were created or updated in the target repo
4. which repo-specific values were intentionally customised or preserved
5. whether the hook layer was installed and whether `node` or `nodejs` was available
6. any unresolved values or follow-up checks

## Example Invocation

```text
Install the TCTBP agent infrastructure into another repository.

Target repository path: /absolute/path/to/target-repo
Target repository state: EXISTING_REPOSITORY
Preferred install/update branch in target repo: chore/install-tctbp
Include hook layer: YES
Backup mode for existing repo: BRANCH_AND_FILE_BACKUPS
Canonical ref to use from this TCTBP repo: main
Any repo-specific settings that must be preserved exactly: build commands, deploy target names, docs paths
Any intentional local workflow deviations that must not be normalised away: none known
```