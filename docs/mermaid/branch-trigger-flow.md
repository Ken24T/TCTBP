```mermaid
flowchart TD
    A["Trigger: branch or branch <new-branch-name>"] --> B["Preflight<br/>report current branch, working tree, and upstream<br/>validate requested branch name in next-branch mode"]
    B --> C{"Detached HEAD, invalid target,<br/>or target equals default branch?"}
    C -->|yes| Z["Stop<br/>branch transition must stay on a named, safe branch"]
    C -->|no| D{"Current non-default branch has<br/>uncommitted changes or unshipped commits?"}
    D -->|yes| E{"Run SHIP first?"}
    E -->|yes| F["Run SHIP workflow<br/>then continue branch closeout"]
    E -->|no| G{"Working tree dirty?"}
    G -->|yes| H["Stop<br/>recommend checkpoint, then publish or handover,<br/>before retrying branch"]
    G -->|no| I["Run minimum verification tests<br/>before continuing without SHIP"]
    D -->|no| J["Inspect source branch sync state<br/>when current branch is not the default branch"]
    F --> J
    I --> J
    J --> K{"Source branch unpublished, ahead, behind,<br/>or diverged from upstream?"}
    K -->|yes| L["Stop<br/>recommend the exact sync step needed<br/>publish, handover, SHIP, or explicit resolution"]
    K -->|no| M["Prepare default branch safely<br/>require clean tree and fast-forward if clean and behind"]
    M --> N{"Already on the default branch?"}
    N -->|yes| O["Skip merge confirmation<br/>continue from updated default branch"]
    N -->|no| P{"Confirm merge into default branch?"}
    P -->|no| Q["Stop<br/>branch workflow will not close out<br/>an unmerged published branch"]
    P -->|yes| R["Merge source branch into default<br/>using a non-destructive merge"]
    R --> S{"Merge conflict?"}
    S -->|yes| T["Stop<br/>resolve conflict manually, then retry branch"]
    S -->|no| U["Verify source tip is reachable<br/>from the default branch"]
    O --> U
    U --> V{"Next-branch mode?"}
    V -->|no| W["Summary<br/>leave repository on updated default branch<br/>with no code loss"]
    V -->|yes| X["Create and switch to the resolved new branch<br/>from the updated default branch"]
    X --> Y{"Delete old branch locally or remotely?"}
    Y -->|yes| AA["Optional cleanup<br/>requires explicit approval for push and deletion"]
    Y -->|no| AB["Skip cleanup"]
    AA --> AC["Summary<br/>confirm merge result, created branch,<br/>and no-code-loss guards"]
    AB --> AC
```

