# TCTBP Template Repository

This repository is the canonical source for the TCTBP workflow templates.

It exists so the workflow can be developed once, improved centrally, and then copied into new repositories without dragging along project-specific assumptions from an older codebase.

## Template Files

The current template set lives in `.github/`:

- `TCTBP.json`
- `TCTBP Agent.md`
- `TCTBP Cheatsheet.md`
- `copilot-instructions.md`

There is also an optional helper prompt in `.github/prompts/`:

- `Onboard New Repository.prompt.md`
- `Update Existing Repository From TCTBP.prompt.md`

Use these together.

- `TCTBP.json` is the machine-readable project profile and workflow policy.
- `TCTBP Agent.md` explains behavioural rules and guard rails.
- `TCTBP Cheatsheet.md` is the short operator view.
- `copilot-instructions.md` explains how the templates should be customised and maintained.

## Recommended Use In A New Repository

For a brand new project, the simplest workflow is:

1. Create the new local repository folder.
2. Create a `.github/` folder in that repository.
3. Copy the four template files from this repo into that `.github/` folder.
4. Optionally copy `.github/prompts/Onboard New Repository.prompt.md` as well.
5. Open the new repository in VS Code.
6. Start a Copilot chat in that repository.
7. Use `.github/prompts/Onboard New Repository.prompt.md` or explicitly ask Copilot to read `.github/copilot-instructions.md` and customise the template files for the new project.

That explicit chat step matters. Do not assume Copilot will automatically infer that the placeholders should be replaced just because the files exist.

## Recommended Use In An Existing Repository

For a repository that already has older or locally customised TCTBP files, do not copy the canonical files over the top blindly.

Instead:

1. Create a dedicated update branch in the recipient repository.
2. Copy `.github/prompts/Update Existing Repository From TCTBP.prompt.md` into the recipient repository if needed.
3. Open the recipient repository in VS Code.
4. Ask Copilot to use that prompt to read the canonical TCTBP files from this repository and compare them with the local workflow files.
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

The reusable prompts now live in `.github/prompts/`:

- `Onboard New Repository.prompt.md` for brand new repositories
- `Update Existing Repository From TCTBP.prompt.md` for existing repositories that need their local TCTBP files merged forward safely

### For New Repositories

The reusable onboarding prompt lives at `.github/prompts/Onboard New Repository.prompt.md`.

### For Existing Repositories

The reusable migration prompt lives at `.github/prompts/Update Existing Repository From TCTBP.prompt.md`.

Use it when a downstream repository already has local TCTBP files and you want Copilot to:

- read the canonical TCTBP files from this repository
- compare them against the recipient repository's local files
- create a backup or update branch before editing
- merge forward generic workflow improvements safely
- preserve repo-specific instructions instead of overwriting them

### Manual Prompting

If you prefer to paste the text manually in chat, start with a prompt like this:

In the new repository, start with a prompt like this:

```text
Read .github/copilot-instructions.md and use it as the governing template guidance for this repository.

Then customise these files for this new project:
- .github/TCTBP.json
- .github/TCTBP Agent.md
- .github/TCTBP Cheatsheet.md
- .github/copilot-instructions.md

Replace all angle-bracket placeholders with repo-specific values where I provide them.
Keep the TCTBP workflow generic and safe.
Do not hard-code assumptions that are not true for this project.
If a field does not apply, either remove it cleanly or set it to null only where the template already allows that.

Project details:
- Name: <PROJECT_NAME>
- Description: <SHORT_PROJECT_DESCRIPTION>
- Language/stack: <LANGUAGE_AND_STACK>
- Default branch: <DEFAULT_BRANCH>
- Version files: <VERSION_FILES>
- Format command: <FORMAT_COMMAND_OR_NULL>
- Test command: <TEST_COMMAND>
- Lint command: <LINT_COMMAND_OR_NULL>
- Build command: <BUILD_COMMAND>
- Release build command: <RELEASE_BUILD_COMMAND_OR_NULL>
- Deploy target: <DEPLOY_TARGET_DESCRIPTION_OR_NONE>
- Docs to review: <DOC_PATHS_OR_NONE>
- Locale: <LOCALE_OR_NONE>

After updating the files, summarise any placeholders or decisions that still need my confirmation.
```

That prompt gives Copilot a clear order of operations and reduces the chance of it mixing durable workflow rules with accidental project-specific guesses.

## Practical Recommendation

My recommendation is:

1. Copy the four files first.
2. Open the new repo in VS Code.
3. Ask Copilot explicitly to read `.github/copilot-instructions.md`.
4. Give Copilot a structured project profile in the same prompt.
5. Let Copilot do the first customisation pass.
6. Review the result with focus on commands, docs paths, deployment settings, and version files.

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
2. Copy `.github/` template files.
3. Open the repo in VS Code.
4. Ask Copilot to customise the template files.
5. Review and commit the customised workflow files.
6. Only then start asking Copilot to scaffold application code.

This keeps workflow policy and project implementation separate from the beginning.

## Why This Works Well

This approach gives Copilot an explicit source of truth before it starts generating code.

That means:

- project commands are defined early
- docs expectations are defined early
- release and sync behaviour is defined early
- future `ship`, `publish`, `handover`, `resume`, `deploy`, `status`, `abort`, and `branch` actions have a repo-specific profile to follow

In practice, this is the cleanest way to onboard Copilot from the start of a new project without making the workflow brittle or overly dependent on a single old repository.
