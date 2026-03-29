# TCTBP Cheat Card

Printable quick reference for the core triggers, their purpose, and the most common workflow paths.

Use this card for fast operator recall.
Use [TCTBP Cheatsheet.md](TCTBP%20Cheatsheet.md) for the fuller workflow summary.

## Core Rule

- No code is ever lost.
- If state is dirty, diverged, ambiguous, or partially published, stop and use the safe workflow that matches the state.

## Trigger Summary

| Trigger | Purpose | Use When |
| --- | --- | --- |
| `status` | Read-only state snapshot | You want to know the next safe action |
| `checkpoint` | Local-only durable save | You want to preserve work without pushing |
| `publish` | Push current clean branch only | You want branch sync without release or metadata changes |
| `handover` | Publish branch plus refresh shared state | You are stopping work and want another machine to resume cleanly |
| `resume` | Restore the intended handed-over branch, preserving local work first when needed | You are starting work on another machine or session |
| `ship` | Formal release workflow | You want a version bump, release commit, and tag |
| `branch` | Close out current branch and optionally start the next one | Current work is published and you want to transition safely |
| `abort` | Recover from partial workflow state | Version, tag, push, merge, or metadata state looks inconsistent |
| `deploy` | Repo-specific runtime install or packaging | The repo defines a deploy target |

## Common Workflow Paths

### Start Work Safely

`resume` -> `status`

### Mid-Session Safe Save

`checkpoint`

### Sync A Clean Branch Without Releasing

`status` -> `publish`

### Stop Work And Leave It Ready For Another Machine

`status` -> `handover`

### Create A Formal Release

`status` -> `ship`

### Finish One Branch And Start The Next

If the branch is not yet shared: `publish` or `handover` first.

Then:

`branch` or `branch <new-branch-name>`

### Recover From A Broken Or Half-Finished Workflow

`status` -> `abort`

## Fast Decision Guide

- Need a quick state check: `status`
- Need a safe local save only: `checkpoint`
- Need origin updated but no release: `publish`
- Need another machine to resume exactly here: `handover`
- Need to pick up handed-over work, preserving local blockers first when needed: `resume`
- Need a release version and tag: `ship`
- Need to close out and move on: `branch`
- Need recovery help: `abort`

## Guard Rails To Remember

- `checkpoint` is local-only.
- `publish` does not release.
- `handover` does not merge into `main`.
- `resume` may preserve local work before switching, but never publishes.
- `ship` is the release path.
- `abort` inspects first and should not guess.