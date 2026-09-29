# MJ · Handoff

A four-week ownership handoff workspace for the Marc Jacobs data platform.

- **Website:** https://mednounos.github.io/marcjacobs-handoff/
- **Repository:** https://github.com/MedNounOS/marcjacobs-handoff

## What is included

20 planned tasks, four readiness gates, 11 risks, 12 competence assessments and 56 register entries. The app provides task lists and boards, filters, owners and backups, checklists, evidence links, a working-day calendar, operating logs, recent change history, the full handoff playbook and document/JSON exports.

All work starts unverified. This app tracks the handoff; it does not monitor or operate the production data platform.

## View and update the shared handoff

The repository, website and handoff content are public, as requested. Do not add passwords, tokens, customer records or other information that should remain confidential. Notes and evidence are committed to public Git history.

Anyone can read the plan. To save shared changes:

1. A repository administrator grants the colleague write access through GitHub's collaborator settings.
2. The colleague creates a fine-grained personal access token scoped to **MedNounOS/marcjacobs-handoff**, with **Contents: read and write**. Choose a suitable expiration date. Repository access and token permissions are both required.
3. In the app, choose **Connect GitHub** and paste that token. It stays only in the current tab's memory, is sent only to `api.github.com`, and is cleared on disconnect or reload. Never commit it or put it in task notes.
4. Save tasks, records or settings normally. They are written to `workspace/workspace.json` through the GitHub Contents API. Other readers see updates on refresh or the next 30-second refresh while the page is visible.

The UI validates completion evidence, checklists, gate prerequisites and accepted risks. Record revisions and GitHub file SHA checks prevent silent overwrites. GitHub repository permissions authorize writes; reviewer fields record attestations rather than enforce supervisor-only access. Repository writers can also edit the JSON directly, so UI workflow validation is not a security boundary.

If a save conflicts, the editor preserves the draft. Copy any needed changes, refresh and reopen the latest record before retrying. Every successful save has a Git commit, and recent application activity records the connected GitHub username.

## GitHub Pages architecture

GitHub Pages serves only static assets. The Pages build therefore uses React/Vite for the existing interface and GitHub as the shared data store, without requiring a separate hosted database.

- `pages/`: static entry point and metadata.
- `vite.pages.config.ts`: project base path and Pages build.
- `lib/github-store.ts`: public reads, memory-only authentication, shared writes and concurrency.
- `lib/workspace-domain.ts`: tested handoff validation and gate invalidation.
- `workspace/workspace.json`: shared live records, settings and recent activity. **Do not overwrite it with seed data on redeployment.**
- `data/seed.json`: original baseline, retained as reference.
- `data/playbook.json` and `public/handoff-*.md`: handoff plan and templates.
- `.github/workflows/pages.yml`: test, type-check, build and deploy on source pushes to `main`. Data-only changes skip deployment because the app reads live shared data directly.

The original Cloudflare/D1 code is retained in `app/api`, `db`, `drizzle` and the original Sites build configuration, but is not used by GitHub Pages. Pages does not call that API. No local D1 test database is published.

## Develop and test

Use Node 24 and npm:

```sh
npm ci
npm run test:handoff
npx tsc --noEmit
npm run dev:pages
npm run build:pages
```

The preview is at `http://127.0.0.1:5174/marcjacobs-handoff/`. It reads the real shared GitHub file; authenticated saves target that file. Tests mock GitHub and do not write live records.

Build output is `dist-pages/`. All asset/document paths support the repository's GitHub Pages subpath. The deployment workflow uses GitHub's official Pages artifact and deployment actions.

Tests cover the 103-record baseline, completion evidence, checklists, stale-edit rejection, gate prerequisites and regression, P0 risk acceptance restrictions, baseline deletion protection, custom record deletion, date validation, Unicode saves, GitHub authentication and file-SHA conflicts.

## Backup and recovery

Use **Project settings → Export workspace** for current records/settings and the latest 150 activity events. GitHub retains full commit history. An administrator can recover `workspace/workspace.json` from a known-good commit after reviewing the effect on current handoff work. Never roll back the shared data merely to roll back website code.

Evidence is text and links, not file uploads. Task dates skip weekends and configured unavailable dates. Overdue comparisons use Africa/Tunis. GitHub API errors preserve drafts and are shown in the UI. Browser storage is not used as the authoritative handoff state.
