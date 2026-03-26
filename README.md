# TCTBP Template Repository

This repository is the canonical source for the TCTBP workflow templates.

It exists so the workflow can be developed once, improved centrally, and then copied into new repositories without dragging along project-specific assumptions from an older codebase.

## Template Files

The current template set lives across `.github/` and `scripts/`:

- `.github/agents/TCTBP.agent.md`
- `.github/TCTBP.json`
- `.github/TCTBP Agent.md`
- `.github/TCTBP Cheatsheet.md`
- `.github/copilot-instructions.md`
- `.github/hooks/tctbp-safety.json`
- `scripts/tctbp-pretool-hook.js`

The reusable helper prompt lives in `.github/prompts/`:

- `Install TCTBP Agent Infrastructure Into Another Repository.prompt.md`

The explicit local-only trigger for that prompt in this canonical repo is `reconcile-tctbp <absolute-target-repo-path>`.

Use these together.

- `.github/agents/TCTBP.agent.md` is the runtime entry point for explicit TCTBP trigger routing.
- `.github/TCTBP.json` is the machine-readable project profile and workflow policy.
- `.github/TCTBP Agent.md` explains behavioural rules and guard rails.
- `.github/TCTBP Cheatsheet.md` is the short operator view.
- `.github/copilot-instructions.md` explains how the templates should be customised and maintained.
- `.github/hooks/tctbp-safety.json` and `scripts/tctbp-pretool-hook.js` provide the optional runtime approval hook for risky git commands.

## Recommended Use In A New Repository

For a brand new project, the simplest workflow is:

1. Create the new local repository folder.
2. Copy the TCTBP runtime files into that repository:
	- `.github/agents/TCTBP.agent.md`
	- `.github/TCTBP.json`
	- `.github/TCTBP Agent.md`
	- `.github/TCTBP Cheatsheet.md`
	- `.github/copilot-instructions.md`
	- optional hook layer: `.github/hooks/tctbp-safety.json` and `scripts/tctbp-pretool-hook.js`
3. Copy `.github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md` if you want the target repository to keep the same reusable application prompt locally.
4. Open the new repository in VS Code.
5. Start a Copilot chat in that repository.
6. Use `.github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md` in `NEW_REPOSITORY` or `AUTO` mode, or explicitly ask Copilot to run `reconcile-tctbp <absolute-target-repo-path>` and customise the installed runtime files for the new project.

That explicit chat step matters. Do not assume Copilot will automatically infer that the placeholders should be replaced just because the files exist.

## Recommended Use In An Existing Repository

For a repository that already has older or locally customised TCTBP files, do not copy the canonical files over the top blindly.

Instead:

1. Create a dedicated update branch in the recipient repository.
2. Use `.github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md` in `AUTO` mode, typically via `reconcile-tctbp <absolute-target-repo-path>`, so Copilot can detect whether the recipient repository is new, missing the agent runtime, or already using the agent runtime and just needs a refresh.
3. Open the recipient repository in VS Code.
4. Ask Copilot to use that prompt to read the canonical TCTBP files from this repository and compare them with the local runtime files.
5. Have Copilot merge forward the generic workflow and safety improvements while preserving the recipient repository's repo-specific values, commands, docs paths, deploy settings, and intentional deviations.
6. Prefer a backup-capable update mode so the recipient repository keeps a non-destructive recovery path before editing.
7. Review the diff and run the recipient repository's validation steps before merging the update branch.

This repository's migration prompt is designed for exactly that use case: safe forward-merging rather than template overwrite.

## Recommended Onboarding Model

Treat onboarding as a two-pass process.

### Pass 1: Project Profile

First, have Copilot replace placeholders and fill in repo-specific values.

Provide:

- project name
- short description
- language and framework
- package/build tool
- test, lint, format, and build commands
- version file or files
- default branch name
- deployment target, if any
- key documentation files, if any already exist
- locale or writing conventions, if relevant

The goal of pass 1 is to produce a correct project profile, not to perfect the workflow.

### Pass 2: Workflow Fit

Next, review whether the default TCTBP behaviour fits the repo.

Typical questions:

- Should `ship` always bump a version?
- What counts as docs-only or infrastructure-only here?
- Should `deploy` exist for this repo?
- Which docs must be reviewed for UI, config, packaging, or roadmap changes?
- Are the default branch naming conventions suitable?

The goal of pass 2 is to align the workflow with the repo, while keeping the workflow logic intact.

## Recommended Prompt Files

The reusable prompt now lives in `.github/prompts/`:

- `Install TCTBP Agent Infrastructure Into Another Repository.prompt.md` for installing or refreshing TCTBP in another repository across the new, missing-agent, and existing-agent cases

In this canonical repo, invoke that prompt through the explicit local-only trigger `reconcile-tctbp <absolute-target-repo-path>`.

### For New Repositories, Missing Agent Runtime, Or Existing Runtime Refresh

The reusable installer prompt lives at `.github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md`.

Use it in `AUTO` mode when a target repository should receive or refresh the TCTBP runtime surface and you want Copilot to detect whether it is:

- a brand new repository
- an existing repository with some TCTBP files but no custom agent runtime
- an existing repository with the custom agent runtime that needs to be refreshed

When TCTBP is applied successfully, the target repository should receive or retain:

- `.github/agents/TCTBP.agent.md`
- `.github/TCTBP.json`
- `.github/TCTBP Agent.md`
- `.github/TCTBP Cheatsheet.md`
- `.github/copilot-instructions.md`
- `.github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md`
- optional hook layer files

### Manual Prompting

From the canonical TCTBP repository, start with a prompt like this:

```text
reconcile-tctbp /absolute/path/to/target-repo

Canonical TCTBP repository path: /home/ken/Documents/development/repos/TCTBP
Target repository path: /absolute/path/to/target-repo
Target repository state: AUTO
Preferred install/update branch in target repo: chore/apply-tctbp
Include hook layer: YES
Backup mode for existing repo: BRANCH_AND_FILE_BACKUPS
Canonical ref to use from this TCTBP repo: main
Any repo-specific settings that must be preserved exactly: build commands, deploy target names, docs paths
Any intentional local workflow deviations that must not be normalised away: none known
```

That prompt gives Copilot a single entry point while still keeping the internal safety paths distinct for installation, adaptation, and refresh.

## Practical Recommendation

My recommendation is:

1. Point Copilot in this canonical repository at the target repository path.
2. Use `reconcile-tctbp <absolute-target-repo-path>`, which routes into `.github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md` in `AUTO` mode by default.
3. Let Copilot inspect the target repository and choose the correct install-or-refresh path.
4. Review the result with focus on commands, docs paths, deployment settings, version files, and whether the hook layer should stay enabled.

That is better than asking Copilot something broad like "set this repo up" because it anchors the conversation in the template contract before implementation starts.

## What Copilot Should Not Guess

During onboarding, Copilot should not guess:

- test or release commands
- version source of truth
- deploy commands
- docs review paths
- branch naming preferences
- locale conventions

If those are unknown, the correct behaviour is to leave placeholders, use an allowed null field, or ask for confirmation.

## Suggested Minimal Startup Sequence

For a new repository with no code yet:

1. Initialise the repo.
2. Copy or apply the TCTBP runtime files.
3. Open the repo in VS Code.
4. Ask Copilot to run `reconcile-tctbp <absolute-target-repo-path>` or use the consolidated prompt with equivalent structured input.
5. Review and commit the customised workflow files.
6. Only then start asking Copilot to scaffold application code.

This keeps workflow policy and project implementation separate from the beginning.

## Why This Works Well

This approach gives Copilot an explicit source of truth before it starts generating code.

That means:

- project commands are defined early
- docs expectations are defined early
- release and sync behaviour is defined early
- future `ship`, `checkpoint`, `publish`, `handover`, `resume`, `deploy`, `status`, `abort`, and `branch` actions have a repo-specific profile to follow

In practice, this is the cleanest way to onboard Copilot from the start of a new project without making the workflow brittle or overly dependent on a single old repository.
