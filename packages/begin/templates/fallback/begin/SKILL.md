---
name: begin
description: Fallback session Begin through the installed shared core, including repositories without an adopted native Begin skill.
---

# Begin

Read the selected repository's `AGENTS.md` and applicable TCTBP policy. Run
`"$HOME/.local/bin/tctbp-begin" --repo "$PWD" --json` from that checkout.
The installed core reads the project's declared mode and runtime pin. A missing
profile permits cached local inspection only; never infer resume/data capability
or fall back to a legacy composite runner.

Use `--no-actions` for a read-only request or `--preview` for a plan. Both use
cached refs without fetch, live peer calls or data actions. `--no-sync` skips
declared data and leaves a required handoff incomplete. Unknown flags stop.

Read the actual returned continuation and give a concise orientation: current
work, verified state, separate Git/peer/data results, freshness, gotchas and a
recommended first action. Cached, skipped, local-only and unverified states are
not READY. Do not execute the continuation's next action automatically.

Any proposed branch switch needs explicit approval of its named branch, both
full commit IDs and exact preview context. Use only the returned decision flags
after that approval. Every saved-work remote handover separately needs approval
of its fresh exact preview before `--recover <preview-id>`. Changed evidence or
release/profile/controller expires approval. Unknown peers require their own
explicit published-work decision and stay named/unverified; this cannot bypass
known unfinished work. Preserve partial receipts and do not retry blindly.

Dirty work, detached HEAD, Git operations and divergence remain preserved. Begin
does not checkpoint, stash, reset, rebase or publish. Only declared project data
adapters may run after fresh pinned Git READY. Missing required manifest or
physical runtime proof remains BLOCKED; do not manufacture evidence, repair data
or clear a hold by inference.

Repository and user skills with the same name can both appear in selectors.
This fallback and adopted repository skills use the same pinned core contract;
they are not merged by Codex. An older historical checkout stays explicitly
inspect only through this fallback until its project adoption is verified.
