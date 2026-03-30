# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

- Add a portable `node ./scripts/validate-template-repo.js` validator for the canonical repository while keeping `scripts/validate-template-repo.sh` as a Linux/macOS wrapper with `nodejs` fallback.
- Add `scripts/validate-template-repo.ps1` as a native Windows PowerShell wrapper around the same validator.
- Expand template-repository validation coverage to include the runtime agent, hook files, frontmatter structure, and command alignment.
- Allow the `branch <new-branch-name>` workflow to auto-resolve existing branch names by appending numeric suffixes such as `-1` and `-2` instead of stopping immediately.
- Fix the consolidated reconcile prompt frontmatter and make its example paths platform-neutral for Windows and POSIX environments.
- Add Windows and Linux CI validation for the canonical repository.

## [v0.2.3] - 2026-03-27

- Add a local-only `checkpoint` workflow for durable non-release slice saves without push, tag, version, or metadata side effects.
- Align the canonical TCTBP policy, guidance, runtime trigger entry point, and onboarding docs with the new checkpoint trigger.
- Add a structured checkpoint summary table that shows the pre-checkpoint and new checkpoint commits alongside the local-only post-checkpoint state.
- Make docs/infrastructure-only patch bump behaviour explicitly configurable in `TCTBP.json` and set the canonical repo to ship a patch bump under all circumstances.

## [v0.2.2] - 2026-03-26

- Tighten branch closeout and publication guidance across the TCTBP workflow, cheatsheet, and runtime entry point.
- Update the cross-repository reconcile prompt so installed repositories ignore `.github/.tctbp-backups/` artefacts and clean up tracked backups non-destructively.

## [v0.2.1] - 2026-03-26

- Consolidate the cross-repository TCTBP application prompts behind the explicit `reconcile-tctbp <absolute-target-repo-path>` trigger.
- Add the TCTBP agent runtime entry point and optional pre-tool safety hook for guarded workflow execution.
- Tighten workflow guidance, branch and publish rules, and template-repository validation coverage for the canonical runtime files.

## [v0.2.0] - 2026-03-22

- Harden TCTBP workflow safeguards around handover, status, branch transitions, detached HEAD checks, and recovery conditions.
- Add a reusable migration prompt for updating existing repositories from the canonical TCTBP repo while preserving repo-specific customisations.
- Document the onboarding and migration prompt workflows more clearly in the template repository guidance.

## [v0.1.1] - 2026-03-21

- Establish live TCTBP project profile for the template repository.
- Add validation script, version file, and onboarding documentation.

[Unreleased]: https://github.com/Ken24T/TCTBP/compare/v0.2.3...HEAD
[v0.2.3]: https://github.com/Ken24T/TCTBP/releases/tag/v0.2.3
[v0.2.2]: https://github.com/Ken24T/TCTBP/releases/tag/v0.2.2
[v0.2.1]: https://github.com/Ken24T/TCTBP/releases/tag/v0.2.1
[v0.2.0]: https://github.com/Ken24T/TCTBP/releases/tag/v0.2.0
[v0.1.1]: https://github.com/Ken24T/TCTBP/releases/tag/v0.1.1
