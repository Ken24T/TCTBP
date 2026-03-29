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