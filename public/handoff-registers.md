# Ownership handoff — working registers

Companion to [the one-month plan](OWNERSHIP-HANDOFF-PLAN.md). **All live checks are initially unverified.** Names assigned below are proposed where the draft did not specify a single lead. Replace TBD entries during execution; add team-system links rather than passwords, tokens or customer records.

## 1. Kickoff decisions — complete Day 1

| Decision | Value / accountable person |
|---|---|
| Start date / last working day / actual departure time | TBD / supervisor |
| Scope | Ownership handoff only; no infrastructure migration or cutover |
| Infrastructure primary | A. KHMIRI; confirmation pending |
| Dataform primary | B. DJEMEL proposed; confirmation pending |
| Infrastructure backup | B. DJEMEL proposed, or named platform colleague |
| Dataform backup | A. KHMIRI proposed |
| Supervisor / final acceptance authority | TBD |
| Identity administrator / production approver / support lead | TBD / TBD / TBD |
| CRM / reporting / interface acceptance owners | TBD |
| Team knowledge space / task board / incident channel | TBD / TBD / TBD |
| Workshop slots and protected hands-on time | TBD; capacity proposal in main plan |
| Priority outputs and business deadlines | TBD with business owners |
| Post-departure support coverage and escalation route | TBD; receiving team owns support |

## 2. Access and continuity — Day 2, recheck Day 19

For every row record **primary test, backup test, approver, evidence link, renewal/expiry owner and status**. “Can log in” is insufficient when the responsibility requires deployment, recovery or reviewing alerts. Mark unnecessary privileges N/A with a reason.

| Capability / dependency | Proposed owner | Evidence required | Status |
|---|---|---|---|
| Source repositories, branches and review rights | A. KHMIRI | Clone/read and approved contribution workflow; INFRA in team-owned location | Unverified |
| GCP project/dataset/log access | A. KHMIRI | Intended dev/prd projects; query/log inspection under each successor's identity | Unverified |
| Terraform backend and deployment identity | A. KHMIRI | Correct state/workspace inspection and approved dev plan | Unverified |
| Azure pipeline, variable groups, environments and approvers | A. KHMIRI | Pipeline/tag identified; approval route exercised; secure-file custodian named | Unverified |
| Private ATOM modules and loader image | A. KHMIRI | Deployment identity access and escalation contact | Unverified |
| Dataform repository, release, invocation and runtime identity | B. DJEMEL | Compile and isolated run against explicit environment | Unverified |
| Git authentication token / other machine credentials | Identity owner | Managed custodian and tested renewal/continuity; values excluded | Unverified |
| Tracked credentials-named Dataform file review | Identity owner | Classification and disposition only; rotate if exposure established | Unverified |
| Datadog / Cloud Monitoring / incident routing | A. KHMIRI | Primary and backup receive test incident | Unverified |
| Export buckets and consumer receipt systems | B. DJEMEL | Controlled test delivery and consumer acknowledgement | Unverified |
| Recovery artifacts and knowledge-space access | Both | Backup follows restore guide and can retrieve required evidence | Unverified |

## 3. Environment and schedule inventory — Days 3–5

Create one row per **actual job or trigger**, including manually started jobs. Do not substitute schedules from sample Terraform modules.

| Environment | Project / region | Runtime service / job | Trigger or cron + time zone | Repo revision / release / tags | Upstream prerequisite | Expected completion / RTO / RPO | Owner + live evidence |
|---|---|---|---|---|---|---|---|
| dev | TBD | TBD | TBD | TBD | TBD | Agree with owner | TBD |
| prd | TBD | TBD | TBD | TBD | TBD | Agree with owner | TBD |
| ppd, if active | Verify active/retired status | TBD | TBD | TBD | TBD | TBD or justified N/A | TBD |

For each environment attach: backend bucket/prefix/workspace; deployment pipeline and template revision; approval configuration; runtime identities; Dataform compilation variables/overrides; included tags/actions and dependency options; paused jobs; notification routes. Identify configurations maintained outside Git and record their system of record and custodian.

## 4. Interface inventory — initial coverage list

Criticality and deployed/active status must be determined with the business owners by Day 3. Every critical interface requires a completed card by Day 10; noncritical interfaces still need an owner and documented disposition.

| ID | Direction / interface family | Suggested technical lead | Active / critical / business owner |
|---|---|---|---|
| IN-01 | ANP (`flow_ana`) | A. KHMIRI | TBD |
| IN-02 | Y2 | A. KHMIRI | TBD |
| IN-03 | AX | A. KHMIRI | TBD |
| IN-04 | Klaviyo | A. KHMIRI | TBD |
| IN-05 | SFCC | A. KHMIRI | TBD |
| IN-06 | External sources, including photobooth and deletion input | Both | TBD |
| IN-07 | Wasabi | A. KHMIRI | TBD |
| IN-08 | Parameters — push subscription disabled in code | A. KHMIRI | TBD; actual loading procedure required |
| IN-09 | Datahub | A. KHMIRI | TBD |
| IN-10 | Manual mapping files | B. DJEMEL | TBD |
| IN-11 | Veepee | A. KHMIRI | TBD |
| OUT-01 | Y2 create / update / merge / delete — separate subcards | B. DJEMEL | TBD |
| OUT-02 | Klaviyo customers / sales — separate subcards | B. DJEMEL | TBD |
| OUT-03 | Datahub sales / returns — separate subcards | B. DJEMEL | TBD |
| OUT-04 | MicroStrategy sales | B. DJEMEL | TBD |
| OUT-05 | Veepee catalogue | B. DJEMEL | TBD |
| OUT-06 | Wasabi group export | B. DJEMEL | TBD |
| OUT-07 | Ad-hoc bulk customers, if actively used | B. DJEMEL | TBD |
| OUT-08 | BI/table/view consumers of dimensions and facts | B. DJEMEL | Discover consumers and split into cards |

**Interface card — copy for each active interface:**

- ID, business purpose, priority, primary, backup, producer/consumer contacts and escalation hours:
- Environment, source/destination identifiers and controlled console/configuration links:
- Trigger, time zone, dependencies, freshness deadline and expected batch identifier:
- Schema/version, keys, null policy, full snapshot/delta, delimiter, header, encoding, filenames and file partitioning:
- Transformation actions and relevant tags/release; materialized state and watermark dependencies:
- Expected volumes, business reconciliation queries and pre-agreed tolerances:
- File/object manifest, delivery acknowledgement and consumer-processing confirmation:
- Retry/idempotency rule, partial delivery, stale-file handling, archive/retention and approved replay window:
- Credential custodian/renewal; monitoring query/dashboard and missing-input alert:
- Tested failure/recovery example, evidence link, reviewer/date and outstanding issues:

## 5. Stateful-action and manual-action catalogue

Start with the entries below; extend to every critical stateful action and interface.

| Action family | Why it needs a state/runbook entry | Lead / due |
|---|---|---|
| Datalake incremental actions, including `RawCustomersY2` | Historical append behavior, repeat-load semantics, schema evolution and partition recovery | B. DJEMEL / D7 |
| `DedupCustomers` / `DedupFullCustomers` / `DedupMasterCustomers` | Previous mapping, bootstrap table, master changes, consent and deletion propagation | B. DJEMEL / D8 |
| Y2 `CustomersY2Wrk/Inc/Delta` | Snapshot timing and changed-row publication | B. DJEMEL / D7–D10 |
| Klaviyo, Datahub, MicroStrategy and Veepee delta families | Per-family keys, fingerprints, merge behavior and replay contracts | B. DJEMEL / D10 |
| Customer KPI snapshots and other business history | Retained history, reproducibility and approved backfill policy | B. DJEMEL / D10 |
| `DeleteCustomers` | Multi-table changes, skipped targets, request-table truncation and replay interactions | B. DJEMEL + data owner / D9–D14 |
| Schema, normalization, fingerprint and mapping changes | Coordinated downstream changes and bounded historical repair | Both / D9 |

**State card fields:** actual table/action; owning repository; business grain and unique keys; action type; append/merge/replace behavior; dependencies including prior self-state and raw SQL references; fingerprints; timestamps/watermarks; initialization; repeat-run behavior; schema-change procedure; backup/recovery location; retention and deletion requirements; recovery time/loss target; tested restore/rerun steps; downstream delivery effects; evidence and reviewer.

**Manual action card fields:** trigger; approver; environment; prerequisite data snapshot; reviewed SQL/change reference; exact order and expected outputs; stop conditions; validation queries; rollback/data repair or consumer compensation; batch/release evidence; person/date; next routine action affected.

## 6. Competence and exercise log

Scoring: **0** not covered; **1** explained; **2** completed with help; **3** completed independently from runbook. Critical primary responsibilities need 3. Backup must reach 3 for its incident/recovery duties. Session attendance alone does not raise a score.

| Skill / demonstration | A. KHMIRI | B. DJEMEL | Evidence / reviewer / date |
|---|---|---|---|
| Identify environment, release and scheduled dependencies | 0 | 0 | Pending |
| Ingestion diagnosis and bounded replay | 0 | 0 | Pending |
| Terraform plan, approved dev deployment and recovery | 0 | 0 | Pending; confirm infrastructure backup |
| Dataform compile, impact analysis and isolated change | 0 | 0 | Pending |
| Datalake incremental and snapshot recovery | 0 | 0 | Pending |
| Dedup explanation, master change and mapping recovery | 0 | 0 | Pending |
| Schema/fingerprint/manual-mapping change | 0 | 0 | Pending |
| Synthetic customer deletion and replay check | 0 | 0 | Pending |
| Partial/duplicate export and consumer reconciliation | 0 | 0 | Pending |
| Alert triage, missing-input detection and escalation | 0 | 0 | Pending |
| Daily independent operation and backup incident lead | 0 | 0 | Pending |
| Locate INFRA decisions and unfinished work | 0 | 0 | Pending |

For each exercise retain: ID/date, operator/observer, environment, fixture or batch, intended result, prerequisites, detection time, recovery time, selected actions, actual result, data reconciliation, downstream acknowledgement, runbook corrections and pass/fail. A failed exercise is repeated after correction, not silently relabelled as training.

## 7. Daily operational log — Days 16–18 and first post-departure week

| Date / operator | Inputs and ingestion | Dataform / quality checks | Exports + receipts | Alerts / incidents | Recovery / escalation | Departing engineer prompted? | Evidence |
|---|---|---|---|---|---|---|---|
| D16 / TBD | Pending | Pending | Pending | Pending | Pending | Record yes/no | TBD |
| D17 / TBD | Pending | Pending | Pending | Pending | Pending | Record yes/no | TBD |
| D18 / TBD | Pending | Pending | Pending | Pending | Pending | Record yes/no | TBD |

Record the exact critical cycles covered. Add less-frequent workflow rehearsal evidence separately. Record any missed deadline, unexplained reconciliation difference or prompt as a gap with an owner and follow-up.

## 8. Residual work, gate reviews and acceptance

Seed risks from Section 6 of the main plan. Record new findings as they arise.

| ID / priority | Finding + business impact | Workaround / support owner | Resolution owner / due | Evidence / decision | Status |
|---|---|---|---|---|---|
| TBD | Copy unresolved finding | Required for accepted residual | Required | Link + named approver/date | Open / closed / accepted |

**Gate review record:** gate/date; attendees; required evidence checked; pass/fail; failed criteria; remediation owner/date; next review; supervisor's decision. An accepted risk does not count as a demonstrated skill.

**Final acceptance:**

- Effective ownership date and covered systems:
- Infrastructure primary / backup acceptance, evidence link and date:
- Dataform primary / backup acceptance, evidence link and date:
- Business/interface owner acceptance for critical outputs:
- All P0 closed? Evidence:
- Accepted P1 residuals, support arrangements and resolution dates:
- Documentation and source ownership/access confirmed:
- Integration-credential continuity test and identity administrator:
- Actual departure-time access revocation owner and execution record:
- Supervisor decision: accepted / conditionally accepted / not accepted; rationale and date:
- Receiving-team review dates after departure:

No field is pre-signed. This pack creates the execution and evidence structure; completion requires the colleagues' live verification and demonstrated operation.
