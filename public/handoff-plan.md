# OS departure — one-month ownership handoff

**Scope:** Marc Jacobs data platform • **Prepared:** 29 September 2026 • **Duration:** four working weeks / 20 working days • **Status:** proposed execution plan; operational sign-off pending.

The outcome is that A. KHMIRI and B. DJEMEL can operate, diagnose, recover and safely change the platform without the departing engineer. This is an **ownership transfer only**, as confirmed by the user. It does not include an ATOM-to-INFRA migration, a production cutover, or a platform redesign.

Use relative days until the supervisor confirms the start date, departure date, holidays and colleague availability on Day 1. Complete the handoff by the last working day before departure; reserve Days 19–20 for gaps and acceptance. If fewer than 20 working days remain, reduce optional improvements rather than omitting access, recovery or independent-operation evidence.

## 1. What is being handed over

The supervisor's Excalidraw draft identifies two workstreams: **INFRA → A. KHMIRI** and **DATAFORM → B. DJEMEL / A. KHMIRI**. Its topics are repository ownership, deduplication, manual actions following changes, sharing/ingestion interfaces, ingestion monitoring, the datalake layer and incremental tables. These all have explicit activities and acceptance evidence below.

The draft is planning input, not an instruction to execute changes. Repository comments and documentation are evidence of intended design; they do not establish the deployed production configuration.

| Repository | Role in the handoff | Observed baseline |
|---|---|---|
| `MJA-DATAPLATFORM-ATOM-01` | Existing infrastructure implementation; essential for current operations | Ingestion flows, IAM, datasets, monitoring and Azure deployment definitions. Review deployed state against this code. |
| `MJA-DATAPLATFORM-DATAFORM-01` | Transformation and data-sharing logic | 163 SQLX files: 29 initialization, 27 datalake, 29 aggregates, 5 work, 22 dimensions, 10 facts, 41 snapshot. |
| `MJA-DATAPLATFORM-PIPELINE-01` | Supporting deployment dependency | Shared Azure Terraform templates; production ATOM pipeline references tag `1.1.0`. |
| `MJA-DATAPLATFORM-INFRA` | Unfinished replacement infrastructure and design backlog | Only `stages/0-bootstrap` exists. README says no resources have been applied; no remote is configured locally. Transfer its code, decisions and unfinished work; do not deploy it as part of handoff. |

The local checkouts were clean when reviewed. Baseline commits: ATOM `cbb657f`, DATAFORM `de3bb74`, PIPELINE `ba70bb7`, INFRA `404c7b3`. These are local review baselines, **not verified production release IDs**. Record actual deployed revisions in Week 1.

The review used local source and the supplied draft. It did not access live GCP, Azure, Datadog, consumer systems or production data, and did not run deployments or SQL jobs. Environment status, schedules, contacts, permissions, recovery objectives and operating health remain to be verified by the team.

## 2. Ownership, capacity and escalation

Assignments below turn the draft's shared ownership into explicit responsibility. The supervisor confirms names and the proposed backup arrangement on Day 1. “Primary” executes and maintains documentation; “backup” must independently demonstrate recovery. The supervisor is accountable for handoff acceptance and unresolved risk decisions.

| Responsibility | Primary | Backup / reviewer | Acceptance authority |
|---|---|---|---|
| Current ATOM infrastructure, Terraform state and deployments | A. KHMIRI | B. DJEMEL — proposed; otherwise name a platform backup | Supervisor / infrastructure change approver |
| New INFRA repository and unfinished backlog | A. KHMIRI | Named platform backup | Supervisor |
| Dataform transformations, deduplication and incremental state | B. DJEMEL — proposed lead | A. KHMIRI | Supervisor; business owner for rule changes |
| Ingestion failures and technical monitoring | A. KHMIRI | B. DJEMEL | Supervisor / support lead |
| Data quality, sharing outputs and manual data changes | B. DJEMEL | A. KHMIRI | Relevant business / interface owner |
| Access, integration credentials and departure revocation | Named identity/platform administrator | A. KHMIRI | Supervisor / identity owner |
| Training and evidence preparation | Departing engineer until departure | Both successors | Supervisor |
| Business rules and downstream acceptance | Named CRM, reporting and interface owners | Their nominated substitutes | Relevant business owner |

**Capacity to reserve:** six hours of joint workshops per week, plus 8–12 hours per successor for exercises, documentation and operational work. The departing engineer should reserve approximately 12–16 hours/week including workshops and review. The supervisor needs a 30-minute weekly gate review; platform administrators and interface owners need scheduled access and acceptance slots. Confirm this allocation against BAU workload on Day 1.

**Working rhythm:** 15-minute daily blocker check; two or three focused workshops weekly; evidence and runbook updates on the same day; Friday gate review. Successors write the final runbooks in their own words. Record sessions where permitted and store links in the team-owned workspace. A recording supplements a procedure; it does not replace it.

**Escalation:** the primary owns initial diagnosis, then contacts the backup and support lead. Infrastructure/access issues go to the platform or identity administrator; customer identity/consent/output discrepancies go to the relevant business owner before replay or correction. On Day 2, record real contacts, coverage hours, incident channel and the after-hours route. On Day 3, agree acknowledgement and escalation times per severity; do not invent an on-call commitment.

## 3. Month schedule and gates

Progression: **explain → pair → successor operates with observation → successor operates independently**. Existing production approval processes apply throughout. Use an isolated development environment and synthetic or approved test data for failure injection, destructive operations and recovery exercises. Verify that test exports cannot reach live consumers.

| Day | Work and lead | Required output / evidence |
|---|---|---|
| 1 | Supervisor + all: confirm scope, dates, capacity, primary/backup and business priorities; baseline the four repositories | Signed scope and owner matrix; tracked task list; ranked critical flow list; shared location for the handoff pack |
| 2 | A. KHMIRI: verify successor access to GCP, Git, Azure pipelines/state, monitoring, private artifacts and support contacts | Both successors use their own identities; access matrix records capability tested, approver and any gaps |
| 3 | Both successors: trace source → ingestion → Dataform → consumer; inspect live configuration and operating history | Environment/schedule inventory, deployed revision IDs, interface register and agreed freshness/recovery expectations |
| 4 | A. KHMIRI + departing engineer: explain ATOM modules, state/workspaces, deployment path and private dependencies; separately review unfinished INFRA | Infrastructure operating guide; state location/ownership; INFRA status and backlog; safe baseline plan review |
| 5 | B. DJEMEL + departing engineer: trace one sales and one customer path; compile using verified environment settings | Dataform setup guide, compiled dependency graph and critical-table inventory. **Gate 1: access and discovery complete** |
| 6 | A. KHMIRI leads: paired ingestion diagnosis, malformed-file exercise and controlled replay | Ingestion runbook; job/object IDs; evidence of correct target and expected row counts |
| 7 | B. DJEMEL leads: initialization/datalake history, schema evolution and late/repeated inputs | Incremental-state catalogue and before/after checks; replay behavior documented per action |
| 8 | B. DJEMEL leads; A. KHMIRI repeats: deduplication and master-record walkthrough | Approved synthetic fixtures; expected master IDs; consent/deletion handling; mapping restore exercise |
| 9 | B. DJEMEL leads: manual actions after schema, fingerprint and business-rule changes | Change checklist covering dependent tables, fingerprints, snapshots, mappings and exports; tested isolated example |
| 10 | Both successors + interface owners: sharing contracts, delivery acknowledgements and monitoring | Each critical interface has a named owner and retry rule. **Gate 2: paired operation and runbooks demonstrated** |
| 11 | A. KHMIRI operates, departing engineer observes: low-risk infrastructure change through normal review, preferably in dev | Reproducible plan, approval trail, deployment validation and rollback/revert evidence |
| 12 | B. DJEMEL operates, departing engineer observes: small Dataform change with impact analysis | Reviewed compiled actions, regression checks, isolated execution and tested return to baseline |
| 13 | Both successors: failed ingestion and partial Dataform execution drill; backup takes lead | Timed diagnosis, bounded recovery, row/key reconciliation and no unapproved downstream replay |
| 14 | Both successors: export retry/duplicate-delivery scenario plus customer deletion scenario | Delivery ledger and consumer reconciliation; synthetic deletion result; retention of request evidence without exposing PII |
| 15 | Backup-led restore and release rollback rehearsal; supervisor reviews outstanding gaps | Evidence distinguishes code rollback from data/state recovery. **Gate 3: successors can operate and recover** |
| 16 | Successors begin independent BAU ownership; departing engineer observes only | First daily operating log, alert triage and documented decisions without prompts |
| 17 | Continue independent BAU; backup handles an issue or isolated drill | Backup competence evidence; response follows the written runbook |
| 18 | Complete third consecutive observed operating day; business owners review outputs | Three successful critical cycles/days where daily; rehearsal for less-frequent jobs; draft acceptance |
| 19 | Resolve failed checks and repeat only affected exercises; archive knowledge in team-owned locations | No critical access/recovery gaps; remaining backlog has owners, dates and workarounds |
| 20 | Supervisor chairs final acceptance; identity owner executes the agreed departure procedure at the actual departure time | Signed acceptance or explicit residual-risk decision; final owner/contact list; transfer/revocation checklist |

**Gate 1 — Day 5:** both successors can reach required tools using their own identities; production entry points, actual schedules and state ownership are recorded; all critical flows and consumers have accountable owners. Outstanding access is escalated immediately, with administrator and due date.

**Gate 2 — Day 10:** every topic from the draft has a written procedure and paired example. Critical input/output contracts, manual steps, incremental state and monitoring paths are documented. The team can explain what must not be replayed blindly.

**Gate 3 — Day 15:** successors perform a reviewed change and a recovery; the backup demonstrates at least one end-to-end incident exercise. Unknown production orchestration or missing recovery access blocks an “independent” rating.

**Gate 4 — Day 20:** final criteria in Section 8 are met. If a gate fails, use buffer time for that gap and defer optional cleanup. Do not mark the platform independently supported solely because the departure date has arrived. The supervisor must assign another support resource for any uncovered critical responsibility; the departing engineer is not the default post-departure support plan.

## 4. Technical work packages

### A. Infrastructure repository, environments and delivery

A. KHMIRI must explain how a source file reaches a BigQuery landing table, which modules own each resource, and how to identify the correct environment before making a change.

1. Record actual GCP project IDs, datasets, buckets, Cloud Run services, Pub/Sub subscriptions, runtime identities and location settings for dev/prd and any active ppd resources. Code disables many ppd service accounts; this is not proof that the environment is fully retired. The parameter flow is an exception with `create_push_subscription = false`; identify its actual loading procedure.
2. Map `flows.tf` to the locally vendored `src/text2dataset/module`, schemas and monitoring tables. Retain the private LVMH module/image dependency inventory and support route. Prove successor access where needed for rebuild/deployment, not just ability to inspect currently running services.
3. Verify the real production pipeline and the referenced template tag. The local production definition uses branch `prd`, workspace `MJA-US-prd`, state bucket `mja-us-gcs-dpf-iac-01-prd`, backend prefix `mja-dpf-atom`, and Azure environment `INFRA-PRD`. Treat these as code evidence until verified. Record approvals and service connections in Azure; a YAML environment reference alone does not prove an approval is configured.
4. Record state access, locking/concurrency practice, recovery location and evidence of a restore drill in a disposable environment. Templates currently plan and apply separately; capture how reviewers ensure the applied change matches the reviewed intent. Never recover infrastructure by blindly replacing production state or running destroy.
5. Reproduce the **existing** toolchain. ATOM declares Google provider `5.3.0`; new INFRA declares a different provider range and CFF `v58.0.0`. Keep setup instructions separate. Verify the deployed pipeline tag rather than assuming local template HEAD is identical.
6. Transfer INFRA to an agreed team-owned repository/location by Day 5. Its README describes future deployment identity and stages that are not yet implemented. Record bootstrap project/state-bucket code as implemented, but deployment identity, remote backend migration, foundation and ingestion stages as unfinished. Preserve architecture decisions and mark the rebuild paused/outside this month's delivery scope. Review its default project deletion policy before any future deployment.

**Acceptance:** primary and backup can identify the production workspace/state and the right approval route; successor reproduces a safe plan and explains every material difference; a dev change and recovery are evidenced; the unfinished INFRA code is accessible without the departing engineer's machine.

### B. Datalake, transformations and incremental tables

The repository has 25 actions declared `incremental`, plus persistent state managed by SQL operations. Inventory by behavior rather than by filename or Dataform action type alone.

- Document configuration from `dataform.json`, environment/project variables in `includes/constants.js`, actual compilation overrides and deployed release selection. Local configuration defaults to dev; explicit project and bucket strings elsewhere also require review.
- Explain initialization as source shaping, datalake history, aggregates/work logic, dimensions/facts and snapshots. Validate the dependency graph from compilation; directory order is a reading guide, not execution order.
- For each critical stateful action, record keys, partitioning, fingerprints, append/merge behavior, prior-table reads, initialization, schema-change behavior and recovery point. `RawCustomersY2` is an incremental action reading the landing snapshot; verify the intended repeat-run history semantics before any replay or full refresh.
- Teach the custom `utils.merge` behavior: insert new keys, update changed fingerprints, and optionally move `SnapshotDate`. It does not contain a general “delete rows absent from source” branch. A rollback of SQL does not restore earlier table contents.
- Walk through `Wrk → Inc → Delta → Export` per interface and validate actual dependencies, timestamps and empty-delta behavior. Include the Y2 boundary conditions involving `SnapshotDate` and `LastExecutionDate`.
- Test new rows, changed rows, unchanged replays, late records, duplicate/null keys, new columns, failed partial execution and empty source input. Compare fixed source batches and business keys; row totals alone are insufficient.

**Acceptance:** B. DJEMEL and A. KHMIRI can select the correct bounded rerun, explain its state effects and demonstrate recovery on an isolated copy. No unverified full-refresh procedure is accepted as a recovery runbook.

### C. Deduplication and customer identity

Use `DedupCustomers`, `DedupFullCustomers`, `DedupMasterCustomers`, `Customers` and shared helpers as a single learning unit. The code uses previous deduplication state and an initial bootstrap table; it is not a stateless “rebuild everything” exercise.

Record matching rules (names, email and phone), normalization, the three configured graph iterations, master selection and ties, source precedence, existing mappings, and the propagation to Y2 and Klaviyo. Confirm business intent with the CRM owner rather than treating current SQL as the only specification.

Build approved synthetic cases: same name/different contact; shared family phone; accents/case; missing email/phone; transitive chains longer than three edges; equal creation dates; changed master; and deletion/consent differences across source records. Compare expected master mappings and contactability. Preserve a recoverable mapping baseline before exercises.

**Acceptance:** both successors explain a sample merge, an intended non-merge and a master change, identify affected outputs, and recover the test mapping. The business owner accepts the expected results or assigns an explicit rule issue to the backlog.

### D. Manual actions following changes

Replace undocumented habits with a change-specific checklist. Cover adding a source field, adding a new source, changing normalization/deduplication, changing a fingerprint, updating a manual mapping and correcting an export schema.

For every procedure record: trigger, business purpose, owner/approver, affected environment/tables, prerequisite snapshots, exact reviewed SQL or change reference, execution order, validation, replay scope, rollback or compensation, and evidence. Decide explicitly whether historical rows require a backfill and whether old and new fingerprints can coexist. Update the source schema, initialization projection, datalake, aggregates, downstream merge column lists, fingerprints and export contract as applicable.

Special exercise: `DeleteCustomers` changes several raw customer tables and clears the deletion input table at the end. Document authorization, request audit, skipped-table handling, masking/deletion propagation, and how to prevent reintroducing erased customer attributes on replay. A restoration must preserve applicable deletion decisions; escalation goes to the organization's designated data/privacy owner. Test with synthetic records only.

**Acceptance:** a successor executes one approved schema-change exercise and the synthetic deletion exercise using only the written procedure; another colleague verifies results.

### E. Sharing and ingestion interfaces

Create one interface card per source/consumer using the register template. Seed inbound coverage with ANP/`ana`, Y2, AX, Klaviyo, SFCC, external sources/photobooth, Wasabi, parameters, Datahub, manual mappings and Veepee. Reconcile this list with deployed flows and actual business use; a file in Git does not establish that an interface is active.

Seed outbound coverage with Y2 create/update/merge/delete, Klaviyo customers/sales, Datahub sales/returns, MicroStrategy sales, Veepee catalogue, Wasabi group export, and any actively used ad-hoc bulk customer output. Identify BI readers of dimensions/facts as well as file consumers.

For each active interface verify: owning team, source and destination, business keys, full snapshot versus delta, schema/column order, delimiter/header/encoding, naming and partitioning, schedule/time zone, expected completion, replay and duplicate handling, archive policy, credential owner, and receipt/processing acknowledgement. Export success means consumer acceptance, not merely file creation. Some exports use date-based names and overwrite; determine how partial files, stale shards and repeated same-day runs are reconciled before retrying.

**Acceptance:** all critical interfaces have a named contact and a tested or witnessed receipt/retry procedure. No test file reaches a production consumer by accident.

### F. Monitoring, incidents and daily operations

The ingestion code references `flows_monitoring`; Dataform monitoring datasets define `LOG_JOB_HEADERS` and `LOG_JOB_DETAILS` with 60-day partition expiration. Verify that something actually populates them and that successors can correlate records with live job IDs. Do not infer functioning monitoring from table definitions.

The checked-in Datadog sink uses `severity = ERROR AND sample(insertId, 0.01)`. Confirm the deployed filter and other monitors. Sampled logs alone cannot establish that every failure will alert. Demonstrate a critical-failure notification and detection of a missing input/job, including where to look when Datadog has no event.

Agree per-critical-flow freshness deadlines, duration/volume baselines, recovery time and acceptable data loss with owners by Day 3. Use observed operating history and business needs; the plan supplies no invented SLA. During handoff, check arrivals, ingestion/load failures, dead letters, Dataform status, data quality, export receipts and material cost/duration deviations each working day.

**Acceptance:** a primary and backup receive the relevant alerts, diagnose from job/object identifiers, route the incident correctly and prove recovery with data and consumer checks.

## 5. Operating and recovery procedures to complete

Each runbook must include real environment identifiers, console/pipeline links, commands or SQL reviewed against that environment, expected output, escalation contact and evidence link. The following sequences are the required skeletons, not production-ready commands.

| Runbook | Required recovery sequence | Completion evidence |
|---|---|---|
| Missing/failed ingestion | Identify expected source batch and arrival → inspect object generation, notification, subscription, loader and load job → check schema/delimiter and failed-object handling → establish whether snapshot replacement already occurred → retain necessary baseline → fix/replay one bounded batch → reconcile target and downstream state | Object/job IDs, before/after key and row checks, source-owner confirmation |
| Dataform failure | Capture invocation/release/environment and failed action → inspect upstream freshness and compiled SQL → classify table/view/append/merge/export effects already committed → recover prerequisites → select tested dependency scope → rerun once under control → validate state and output | Invocation ID, selected actions, comparison queries and downstream disposition |
| Bad schema/business-rule change | Pause affected downstream publication as appropriate → identify first affected batch/release → preserve evidence → revert code and separately repair affected state → backfill bounded interval if required → compare business keys/totals/consents → resume | Reviewed repair, approval and reconciled interval |
| Wrong deduplication | Stop affected sharing → capture master mapping and affected customer set → compare last known-good state and source changes → choose approved mapping correction/restore → rebuild only validated dependencies → reconcile already-delivered merges with consumer | CRM approval, corrected mappings, consumer compensation record |
| Export failure/duplicate delivery | Determine files created versus files consumed → preserve batch manifest and acknowledgements → identify stale/partial files → agree retry/compensation with consumer → publish approved unique batch or replay strategy → verify receipt and processing | Consumer acknowledgement and no unexplained duplicate effects |
| Infrastructure deployment failure | Capture reviewed change and actual apply result → verify correct backend/workspace and current partial state → obtain a fresh reviewed recovery plan → fix/revert configuration → apply through approved route → validate resources and data flow | Plan/apply audit trail and smoke-check evidence; no blind state overwrite |
| Access/credential failure | Identify human versus machine identity and failed dependency → route to identity/credential owner → restore through managed permissions/rotation → test dependent pipeline and runtime separately | Verified access, owner and next review/expiry date; no secret values in documents |

For every exercise measure detection and recovery time against agreed targets. If production recovery is too risky to rehearse, restore to an isolated copy and document what remains unproven. Monthly/rare activities require a representative isolated rehearsal; three daily observations do not prove them.

## 6. Risks and mandatory closure work

These are source-review findings and handoff risks, not claims of production incidents.

| Priority | Finding / handoff risk | Owner and due date | Closure condition |
|---|---|---|---|
| P0 | Actual production schedules, tags, release configuration and manual/orchestrated steps are not established by this review; sample orchestration and `notAtom` modules do not prove active wiring | Both successors, D3–D5 | Live inventory and last successful execution evidence for every critical path |
| P0 | Dedup and snapshot/incremental state can make blind replay, rebuild or SQL rollback unsafe | B. DJEMEL, D8–D15 | State catalogue, bounded rerun and isolated restore demonstrated |
| P0 | Human accounts, approvals or integration credentials may depend on the departing engineer | A. KHMIRI + identity owner, D2–D15 | Successors can operate; all critical machine credentials have team ownership and tested continuity |
| P1 | Dataform README and pipeline README are generic placeholders | Successors, D5–D10 | Team-owned setup, deployment, troubleshooting and recovery guides validated by a fresh reader |
| P1 | No assertion actions or inline `assertions:` configuration found in the 163 SQLX files | B. DJEMEL, D10–D15 | Critical reconciliation checks executable and recorded; add focused assertions only through normal change review |
| P1 | Datadog sink code samples 1% of ERROR logs; missing-arrival monitoring is unverified | A. KHMIRI, D10–D13 | End-to-end critical alert and freshness-detection drill, or explicit interim daily check with accountable owner |
| P1 | ATOM depends on private module/image access and Azure secure-file authentication | A. KHMIRI, D2–D5 | Verified successor/build identity access, support route, credential owner and renewal process |
| P1 | A credentials-named file is tracked in Dataform; its contents were not inspected for this plan | Identity owner + B. DJEMEL, D2 | Authorized review classifies it; if it contains live secrets, rotate through the incident process and remove exposure; record only disposition |
| P1 | INFRA has no local remote and its README describes components beyond implemented bootstrap code | A. KHMIRI, D5 | Code/decisions stored in agreed team location; actual implementation and deferred backlog clearly distinguished |
| P1 | Re-running snapshot ingestion and exports may repeat data or consumer side effects | Both successors, D7–D14 | Replay classification, batch ledger and consumer-specific retry tests |
| P2 | Campaign attribution window is marked provisional in `includes/constants.js` | B. DJEMEL + business owner, D10 | Business decision owner and agreed value recorded, or dated follow-up explicitly accepted |

P0 means a blocker to claiming independent ownership of a critical service. P1 must be closed or accepted with a tested workaround, named support owner and due date. P2 may remain in the normal backlog. Classification is proposed for this handoff and does not replace OS's incident severity scheme.

## 7. Deliverables and knowledge-transfer evidence

Use [HANDOFF-REGISTERS.md](HANDOFF-REGISTERS.md) as the working pack. Publish both documents to the agreed team-owned knowledge space on Day 1; local files alone are not a completed knowledge transfer.

| Deliverable | Owner | Deadline | Evidence of usefulness |
|---|---|---|---|
| Owner/contact/access matrix | A. KHMIRI | D2; verified again D19 | Each primary and backup performs the required capability |
| Live environment, release and schedule inventory | Both successors | D5 | Matches live jobs, projects and approvals |
| Architecture/data lineage and critical-flow inventory | Both successors | D5 | Successor traces a customer and sales record end to end |
| Infrastructure and Dataform setup/deployment guides | Respective owners | D10 | Fresh reader completes dev setup and validates intended target |
| State, dedup and manual-change guides | B. DJEMEL | D10 | Restore/replay/schema exercises are repeatable |
| Interface cards and consumer contacts | B. DJEMEL with A. KHMIRI | D10 | Critical consumers verify contract and retry procedure |
| Monitoring/incident/restore runbooks | Both successors | D15 | Backup completes an incident using the documentation |
| INFRA design and unfinished-work backlog | A. KHMIRI | D5 | Supervisor knows exactly what exists and what is deferred |
| Three-day operating log and competence matrix | Both successors | D18 | No prompts from departing engineer for critical routines |
| Residual-risk register and acceptance record | Supervisor | D20 | Named owners, dates, evidence and recorded acceptance |

## 8. Final acceptance and departure

The supervisor accepts the handoff only after checking the following evidence with both successors:

- [ ] Primary and backup named for every critical responsibility; support hours and escalation contacts verified.
- [ ] Both successors use individual access; no critical process requires the departing engineer's laptop or personal login.
- [ ] All active critical sources, transformations, schedules and consumers inventoried against live configuration.
- [ ] Successors independently complete a reviewed infrastructure change and a Dataform change in the agreed safe environment, with validation and recovery evidence.
- [ ] Deduplication, incremental replay, manual schema changes, synthetic customer deletion and export retry exercises completed.
- [ ] Backup leads at least one incident and one meaningful recovery activity using the runbooks.
- [ ] Critical outputs reconcile: no unexplained missing/duplicate business keys; agreed totals, master mappings, deletion/consent outcomes and consumer receipts pass. Any numerical tolerance is documented and approved in advance.
- [ ] Three consecutive independent operating days/critical daily cycles completed; less-frequent jobs covered by rehearsal.
- [ ] Alert delivery and missing-input detection verified; recovery/access evidence is stored without secret values or unnecessary customer data.
- [ ] Documentation, source, recording links and INFRA backlog are in team-owned locations and readable by successors.
- [ ] No open P0; P1 residuals have explicit acceptance, workaround, support owner and resolution date.
- [ ] Identity administrator has an exact departure-time revocation plan, tested machine-identity continuity and an owner for each integration credential.

**Departure sequence:** transfer repository/pipeline/monitor/secret administration and necessary document ownership → verify successors and machine processes → record final acceptance → revoke the departing person's access at the agreed departure time → successors check the next scheduled cycles. Do not delete shared service accounts or revoke machine credentials just because the engineer is leaving; transfer or rotate them through the responsible administrator with dependency validation.

**After departure:** A. KHMIRI and B. DJEMEL retain daily checks for the first week. The supervisor reviews incidents and residual tasks after five working days and again at month-end. These follow-ups belong to the receiving team; ongoing availability of the departing engineer is not assumed.

## 9. Source map

Paths below are relative to the parent folder of this handoff pack. They support the technical priorities; live evidence must be added during execution.

- Draft: `/Users/mednoun/Downloads/passation.excalidraw` — workstreams, named colleagues and topic coverage.
- [INFRA README](../MJA-DATAPLATFORM-INFRA/README.md), [decisions](../MJA-DATAPLATFORM-INFRA/docs/decisions.md), [bootstrap code](../MJA-DATAPLATFORM-INFRA/stages/0-bootstrap/main.tf) — unfinished rebuild and design intent.
- [ATOM flows](../MJA-DATAPLATFORM-ATOM-01/flows.tf), [loader](../MJA-DATAPLATFORM-ATOM-01/src/text2dataset/module/main.tf), [production pipeline](../MJA-DATAPLATFORM-ATOM-01/prd-pipelines.yml), [Datadog sink](../MJA-DATAPLATFORM-ATOM-01/datadog.tf) — operating dependencies and monitoring questions.
- [Pipeline apply task](../MJA-DATAPLATFORM-PIPELINE-01/template/tasks/terraform-apply-workspace.yml) — deployment behavior; verify the production-referenced tag separately.
- [Dataform configuration](../MJA-DATAPLATFORM-DATAFORM-01/dataform.json), [constants](../MJA-DATAPLATFORM-DATAFORM-01/includes/constants.js), [helpers](../MJA-DATAPLATFORM-DATAFORM-01/includes/utils.js) — environment resolution and shared business/state logic.
- [RawCustomersY2](../MJA-DATAPLATFORM-DATAFORM-01/definitions/datalake/y2/RawCustomersY2.sqlx), [DedupCustomers](../MJA-DATAPLATFORM-DATAFORM-01/definitions/work/customers_dedup/DedupCustomers.sqlx), [DedupFullCustomers](../MJA-DATAPLATFORM-DATAFORM-01/definitions/work/customers_dedup/DedupFullCustomers.sqlx), [DedupMasterCustomers](../MJA-DATAPLATFORM-DATAFORM-01/definitions/work/customers_dedup/DedupMasterCustomers.sqlx) — persistence and identity rules.
- [CustomersY2Wrk](../MJA-DATAPLATFORM-DATAFORM-01/definitions/snapshot/cegid/delta/CustomersY2Wrk.sqlx), [CustomersY2Inc](../MJA-DATAPLATFORM-DATAFORM-01/definitions/snapshot/cegid/delta/CustomersY2Inc.sqlx), [CustomersY2Delta](../MJA-DATAPLATFORM-DATAFORM-01/definitions/snapshot/cegid/delta/CustomersY2Delta.sqlx), [Y2 merge export](../MJA-DATAPLATFORM-DATAFORM-01/definitions/snapshot/cegid/operations/ExportMergeCustomersY2.sqlx) — delta state and delivery behavior.
- [DeleteCustomers](../MJA-DATAPLATFORM-DATAFORM-01/definitions/work/operations/DeleteCustomers.sqlx) — manual deletion workflow and input clearing.
