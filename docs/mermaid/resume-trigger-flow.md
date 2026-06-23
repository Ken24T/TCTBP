```mermaid
flowchart TD
    A["Trigger: resume / resume please"] --> B["Preflight<br/>report current branch and working tree state"]
    B --> C{"Detached HEAD, conflicts, or merge/rebase/cherry-pick/revert in progress?"}
    C -->|yes| Z["Stop<br/>resume only works from a clean, recoverable branch state"]
    C -->|no| D["Fetch origin with tags<br/>inspect default branch, metadata branch, and candidate work branches"]
    D --> E["Read handover metadata first when available<br/>ignore missing, malformed, stale, or invalid metadata"]
    E --> F["Determine target work branch by precedence<br/>metadata branch first, then current clean branch,<br/>then safe branch inference"]
    F --> G{"Ambiguous target or no suitable target branch?"}
    G -->|yes| Y["Stop<br/>ask the user which branch to resume,<br/>or report that no resume branch was detected"]
    G -->|no| H{"Switching would strand local unpublished work?"}
    H -->|yes| I{"User confirms preserve-local step?"}
    I -->|no| X["Stop<br/>leave current state unchanged"]
    I -->|yes| J["Preserve local work locally<br/>checkpoint if dirty<br/>rescue branch if clean but ahead"]
    H -->|no| K["No preserve-local step needed"]
    J --> L["Switch to the target branch when needed<br/>create local tracking branch if required"]
    K --> L
    L --> M["Reconcile read-only<br/>fast-forward if behind and clean"]
    M --> N{"Target branch ahead locally or diverged?"}
    N -->|yes| W["Stop<br/>resume does not publish, merge, or rebase"]
    N -->|no| O["Verify ready state<br/>intended branch checked out and synced with origin"]
    O --> P["Summary<br/>restored branch, preserve-local step if any,<br/>fast-forward or tracking setup, and remaining blockers"]
```

