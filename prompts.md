# Copilot Contract (hora-qa-framework)

You are working ONLY inside this repository. Do not invent missing files or features.
Always start by reading the actual repo tree and existing configs BEFORE proposing changes.

Hard rules:

1) Preserve the current architecture: Cucumber BDD + layered steps + ui-map.
2) Prefer minimal, surgical edits. Avoid refactors unless explicitly requested.
3) Never change test semantics silently. If behavior changes, explain it and update docs/scripts.
4) Do not introduce heavy dependencies. Add new deps only if strictly necessary.
5) Do not store or print secrets. Use env vars. Add/maintain .env.example.
6) After changes, ensure the project still runs with:
   - npm ci
   - npm run test:smoke (or the existing smoke command)
   - npm run report:allure (or existing allure generation)
7) Output must include:
   - list of files changed/added,
   - exact commands to verify,
   - a short rationale per change.

Scope guidance:

- Primary runner is Cucumber. If @playwright/test exists, treat it as optional or remove only if safe and documented.
- Community Odoo constraints are real: implement test data prep via strategy pattern; default is RPC if possible.
- CI target: minimal smoke job + Allure artifacts.
- Visual regression: minimal POC only, tagged @visual, baseline update via env flag.
