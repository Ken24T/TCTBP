```mermaid
flowchart TD
    A["Trigger: ship / ship please / shipping / prepare release"] --> B["Preflight<br/>confirm branch, tree, and working directory<br/>fetch origin when needed<br/>render release snapshot table"]
    B --> C{"Detached HEAD, dirty tree, branch behind origin,<br/>or diverged history?"}
    C -->|yes| Z["Stop<br/>SHIP requires a clean, fetched, unambiguous branch state"]
    C -->|no| D["Clean unpublished branch is allowed<br/>upstream can be created during the first push"]
    D --> E["Run verification commands<br/>use docs/infrastructure lightweight path when applicable"]
    E --> F["Ensure problems and diagnostics are clean"]
    F --> G["Assess documentation impact<br/>update required docs or record no docs impact"]
    G --> H["Apply version bump<br/>patch every SHIP<br/>minor on first qualifying feature branch SHIP<br/>major only by explicit instruction"]
    H --> I["Stage changes and create the release commit"]
    I --> J{"CHANGELOG.md present and configured?"}
    J -->|yes| K["Update changelog in the shipped version commit"]
    J -->|no| L["Skip changelog step"]
    K --> M["Create tag vX.Y.Z<br/>pointing at the shipped commit"]
    L --> M
    M --> N["Push current branch and shipped tag<br/>create upstream on first publish if needed"]
    N --> O["Summary<br/>shipped version, release commit, and tag"]
```

