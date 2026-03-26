# Changelog

All notable changes to this project will be documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

- Add a local-only `checkpoint` workflow for durable non-release slice saves without push, tag, version, or metadata side effects.
- Align the canonical TCTBP policy, guidance, runtime trigger entry point, and onboarding docs with the new checkpoint trigger.

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

[Unreleased]: https://github.com/Ken24T/TCTBP/compare/v0.2.2...HEAD
[v0.2.2]: https://github.com/Ken24T/TCTBP/releases/tag/v0.2.2
[v0.2.1]: https://github.com/Ken24T/TCTBP/releases/tag/v0.2.1
[v0.2.0]: https://github.com/Ken24T/TCTBP/releases/tag/v0.2.0
[v0.1.1]: https://github.com/Ken24T/TCTBP/releases/tag/v0.1.1
