# TCTBP Template – Copilot Instructions

## Purpose

This repository is the canonical source for TCTBP workflow templates and guidance.

Use it to:

- define and evolve the reusable TCTBP workflow
- keep the workflow logic separate from any one project or language stack
- maintain copyable templates for downstream repositories
- document the required customisation points for new projects

When editing this repository, prefer general rules, placeholders, and examples over project-specific implementation detail.

## Authoritative Files

The TCTBP template set is defined by:

- `.github/agents/TCTBP.agent.md` for the runtime entry point that routes explicit TCTBP trigger phrases to the specialised workflow agent
- `.github/hooks/tctbp-safety.json` for optional runtime approval enforcement on risky git terminal commands
- `scripts/tctbp-pretool-hook.js` for the hook logic used by the optional TCTBP safety hook
- `.github/TCTBP.json` for the machine-readable project profile schema and workflow policy
- `.github/TCTBP Agent.md` for behavioural rules, guard rails, and workflow intent
- `.github/TCTBP Cheatsheet.md` for the operator quick reference
- `.github/copilot-instructions.md` for template usage guidance and customisation notes

When these files change, keep them aligned. Avoid duplicating logic in one file that contradicts another.

Reusable helper prompts for downstream use live in `.github/prompts/`. Keep them aligned with the current template workflow and update them when the onboarding or migration process changes.

In this canonical repository, the consolidated cross-repo application prompt is expected to be discoverable through the explicit local-only trigger `reconcile-tctbp <absolute-target-repo-path>`.

## Template Design Rules

Use these rules whenever you edit or extend the template set.

1. Keep workflow rules generic and durable.
2. Put project-specific values behind explicit placeholders such as `<PROJECT_NAME>`.
3. Keep the schema easy for downstream repositories to fill in without redesigning it.
4. Prefer configuration over prose when a rule must be machine-readable.
5. Prefer prose over configuration when a rule depends on judgement or safety context.
6. Never hard-code a language, framework, packaging tool, or deployment target unless it is clearly marked as an example.
7. Preserve the no-code-loss guarantees across `ship`, `checkpoint`, `publish`, `handover`, `resume`, `branch`, `deploy`, `status`, and `abort`.
8. If the hook layer is included in downstream repos, keep the hook config and script narrow, auditable, and optional.

## Downstream Customisation Checklist

When these templates are copied into a new project, replace every placeholder and confirm the repo-specific profile is complete.

Minimum customisation points:

- project name and short description
- default branch name
- version file or files
- format, test, lint, build, and release-build commands
- documentation files that should be reviewed for each change type
- deployment targets, install commands, and post-deploy checks
- branch naming preferences if they differ from the defaults
- locale or writing conventions if they matter for user-facing text

## Placeholder Convention

Template placeholders use angle brackets.

Examples:

- `<PROJECT_NAME>`
- `<TEST_COMMAND>`
- `<LINT_COMMAND_OR_NULL>`
- `<VERSION_FILE>`
- `<DEPLOY_TARGET_NAME>`

Downstream repositories should replace placeholders before relying on the workflow for release or deployment actions.

## Quality Bar For This Repo

Changes in this repository should improve one or more of:

- clarity of the TCTBP workflow
- safety guarantees and explicit stop conditions
- portability across languages and project types
- ease of adoption in a new repository
- consistency between the JSON profile and the Markdown guidance

Avoid adding repo-local implementation assumptions unless they are clearly labelled as examples.

## Workflow Expectations

For TCTBP activation, workflow order, sync safety, docs-impact checks, versioning, tagging, and approvals, follow:

- `.github/TCTBP.json` as the authoritative profile and policy source
- `.github/TCTBP Agent.md` for behavioural interpretation and guard rails
- `.github/TCTBP Cheatsheet.md` for short operator guidance

Supported triggers remain:

- `ship`, `ship please`, `shipping`, `prepare release`
- `checkpoint`, `checkpoint please`
- `publish`, `publish please`
- `deploy`, `deploy please`
- `handover`, `handover please`
- `resume`, `resume please`
- `status`, `status please`
- `abort`
- `branch`
- `branch <new-branch-name>`

For mutating workflows, keep detached-HEAD stop conditions, local checkpoint safety, branch-name validation, publication safety, branch-closeout merge confirmation, and handover metadata safety aligned across the JSON profile and Markdown guidance.
If the custom agent or hook layer is changed, keep the runtime files aligned with the Markdown and JSON guidance that downstream repos will consume.

## Editing Guidance

- Prefer small, focused edits over broad rewrites.
- Keep the files copyable into a fresh repository with minimal follow-up changes.
- Add or update examples only when they clarify how a downstream repository should fill in the template.
- Keep the consolidated application prompt current when the recommended onboarding or migration workflow changes:
	- `.github/prompts/Install TCTBP Agent Infrastructure Into Another Repository.prompt.md`
- Keep the prompt frontmatter and examples aligned with the `reconcile-tctbp <absolute-target-repo-path>` trigger when that cross-repo reconciliation flow changes.
- Document any schema change in both the JSON profile and the surrounding Markdown guidance.
- Preserve Australian English only where the downstream repository explicitly chooses it; do not assume a locale by default.
