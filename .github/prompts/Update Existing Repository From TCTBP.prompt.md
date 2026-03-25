---
description: "Use when updating an existing repository's TCTBP workflow files from the canonical TCTBP repository while preserving repo-specific customisations, creating a safety backup, and merging changes safely instead of blindly overwriting local files."
---

# Update An Existing Repository From TCTBP

Use this prompt inside an existing repository that already has some version of the TCTBP workflow files and needs to be updated to the latest canonical TCTBP safely.

## Goal

Merge the latest TCTBP workflow improvements into the current repository without losing local repo-specific customisations, commands, deployment settings, documentation paths, or other intentionally local instructions.

## Required Inputs

Fill in these values before using the prompt.

```text
Canonical TCTBP repository path: <CANONICAL_TCTBP_REPO_PATH>
Canonical branch or ref to read from: <CANONICAL_TCTBP_BRANCH_OR_REF>
Preferred update branch name in this repo: <UPDATE_BRANCH_NAME_OR_EXISTING_BRANCH>
Backup mode: <UPDATE_BRANCH_ONLY | UPDATE_BRANCH_AND_FILE_BACKUPS>
Any local files or settings that must be preserved exactly: <PRESERVE_LIST_OR_NONE>
Any local workflow deviations that are intentional and should not be normalised away: <INTENTIONAL_DEVIATIONS_OR_NONE>
```

## Canonical Files To Read

Read these files from the canonical TCTBP repository first:

- `.github/agents/TCTBP.agent.md`
- `.github/TCTBP.json`
- `.github/TCTBP Agent.md`
- `.github/TCTBP Cheatsheet.md`
- `.github/copilot-instructions.md`

If the canonical repository includes the hook layer, also read:

- `.github/hooks/tctbp-safety.json`
- `scripts/tctbp-pretool-hook.js`

Then read the local versions of the same files in the recipient repository if they exist.

## Safety Rules

1. Treat the canonical TCTBP repository as the source of generic workflow logic.
2. Treat the recipient repository as the source of repo-specific values and local operational context.
3. Never blindly overwrite local workflow files with the canonical copies.
4. Merge forward generic workflow and safety improvements while preserving repo-specific settings.
5. Stop and explain any conflict that cannot be resolved safely from the available evidence.
6. Prefer minimal diffs over broad rewrites.
7. Keep the workflow files, custom agent entry point, and optional hook layer aligned with each other after the update.

## Backup Requirement

Before editing anything:

1. Ensure the current repository state is non-destructively recoverable.
2. Prefer creating or switching to a dedicated update branch first.
3. If `Backup mode` is `UPDATE_BRANCH_AND_FILE_BACKUPS`, create timestamped backup copies of the local workflow files before editing.
4. Use a backup location that does not interfere with normal repo behavior, for example a clearly named temporary backup directory.
5. Never delete the backups as part of the same update unless explicitly asked.

## Files To Update

Update these files in the recipient repository when present:

- `.github/agents/TCTBP.agent.md`
- `.github/TCTBP.json`
- `.github/TCTBP Agent.md`
- `.github/TCTBP Cheatsheet.md`
- `.github/copilot-instructions.md`

If the recipient repository should include the hook layer, also update:

- `.github/hooks/tctbp-safety.json`
- `scripts/tctbp-pretool-hook.js`

If one of these files is missing locally, create it from the canonical template and adapt it to the recipient repository instead of dropping in raw template defaults.

## What Must Be Preserved Locally

Do not overwrite repo-specific values such as:

- project name and short description
- default branch name
- version file or files
- version and tag conventions if intentionally customised
- format, test, lint, build, and release-build commands
- deploy targets, install commands, post-deploy checks, and runtime expectations
- documentation review paths
- branch naming preferences when intentionally customised
- locale or writing conventions when intentionally customised
- whether the hook layer is intentionally enabled or omitted
- any explicit repo-specific constraints already captured in the local workflow files

## What Should Usually Be Merged Forward

When present in the canonical repository, prefer merging forward improvements such as:

- no-code-loss safeguards
- status, publish, handover, resume, branch, ship, deploy, and abort workflow clarifications
- detached-HEAD stop conditions
- metadata precedence and resume-target safety rules
- separation of release, publication, handover, and restore semantics
- branch-name validation rules
- partial-state recovery guidance
- summary-table format consistency
- wording fixes that reduce ambiguity or contradiction

## Required Behaviour

1. Read the canonical files from the specified canonical TCTBP path and ref.
2. Read the local workflow files from the recipient repository.
3. Compare canonical and local files carefully.
4. Identify three categories before editing:
   - generic canonical improvements to merge forward
   - repo-specific local settings to preserve
   - conflicts or intentional deviations that need judgement
5. Create the requested backup or recovery path before modifying files.
6. Edit the local files by merging forward the canonical workflow logic without erasing local repo-specific instructions.
7. Keep `.github/TCTBP.json`, `.github/TCTBP Agent.md`, `.github/TCTBP Cheatsheet.md`, and `.github/copilot-instructions.md` consistent with each other.
8. Keep `.github/agents/TCTBP.agent.md` aligned with the local trigger model and repo description.
9. If the hook layer is installed, keep `.github/hooks/tctbp-safety.json` and `scripts/tctbp-pretool-hook.js` aligned with the installed docs and verify whether `node` or `nodejs` is available on `PATH`.
10. If the canonical repository contains placeholders that do not belong in the recipient repository, replace them with the recipient repository's existing values or leave them unresolved only when the local repo truly lacks the needed information.
11. If the local repository intentionally diverges from the canonical workflow, preserve that divergence unless it weakens a core safety guarantee.
12. If a local divergence weakens no-code-loss, resume safety, or sync safety, call it out explicitly and propose the smallest safe correction.
13. Validate the updated local files using the recipient repository's available validation, lint, test, or diagnostics steps.
14. Summarise exactly what was changed, what was preserved, what was backed up, and what still needs human review.
15. When the local repository adopts the new trigger model, keep `ship`, `publish`, `handover`, and `resume` semantically distinct instead of overloading one workflow with multiple operator intents.

## What You Must Not Do

Do not:

- replace the local files wholesale without review
- remove recipient-repo commands just because the canonical template uses placeholders or `null`
- normalise away intentional repo-specific wording without reason
- force a release, deploy, or handover as part of this migration unless explicitly asked
- use stash, reset, rebase, force-push, or destructive checkout as part of the update

## Preferred Final Summary

When the update is complete, report:

1. which canonical ref was used
2. which local files were updated
3. which local repo-specific values were intentionally preserved
4. whether backups were created and where
5. any unresolved conflicts or follow-up checks

## Example Invocation

```text
Update this repository from the canonical TCTBP repo.

Canonical TCTBP repository path: /home/ken/Documents/development/repos/TCTBP
Canonical branch or ref to read from: main
Preferred update branch name in this repo: chore/update-tctbp
Backup mode: UPDATE_BRANCH_AND_FILE_BACKUPS
Any local files or settings that must be preserved exactly: deployment target names, build commands, docs paths
Any local workflow deviations that are intentional and should not be normalised away: none known
```