# IELTS Writing Submissions Portal

The existing `/writing/task-2/submit/` route now supports all three writing tasks. An unqualified legacy URL opens Task 2. Deep links use `?task=academic-task-1&question=LG01`, `?task=general-task-1&question=GT01`, or `?task=task-2&question=T2-01`. The legacy `question_id` query alias is also accepted. Invalid task/question combinations do not select another task's question.

Academic tasks import the seven canonical `academicExplorerTasks` and call the workshop's `renderExplorerTaskVisual` with `compact: false`. The workshop task data, visual rendering code and pedagogy are unchanged. Links from the selected explorer task and final writing unit open the corresponding Academic submission. GT01–GT06 reproduce the user's supplied final question bank Version 1.0, including salutations and all standard Task 1 instructions.

Drafts, eligibility, commitments, contact details and timing are stored separately per task/question in browser localStorage (`ielts-writing-submissions-v1`). An empty selection has a separate draft. Storage failure leaves the form usable and shows a warning. Successful submission clears only the submitted draft. Task 2 had no persistent drafts before this change.

## Submission contract and backend limitations

The actual writing backend is the existing Formspree form `https://formspree.io/f/maeewrvy`, not `classroom-service`. That worker only manages classroom release state. The writing endpoint and manual WhatsApp feedback workflow are preserved; no automated feedback or marking is introduced.

Existing Task 2 field names, question IDs, question text, completion status values, 40-minute checkbox and actual-minutes semantics remain intact. Task 1 uses `twenty_minute_attempt_confirmed`. Both send `time_attempt_confirmed`, `task_type`, `expected_minutes`, `time_limit_exceeded` and `overrun_minutes` alongside the existing question, answer, identity, word count and timestamp fields. Academic records also contain `question_visual_data` identifying the canonical visual and source data. `actual_minutes` is blank for within-time attempts; an overrun requires a finite number strictly greater than the task limit. Underlength answers remain accepted for diagnostic feedback, as before.

Validation is client-side. No custom writing submission server or Formspree account/dashboard configuration is present in this repository, so server-side field rules, delivery, quota, retention and email template behaviour could not be verified. Browser tests intercept Formspree requests and verify their outgoing payloads and success/failure handling; they do not send live submissions or prove live delivery. If the Formspree account uses field allowlists or custom notification templates, the owner must ensure they include the added fields.

## Verification

Run a static server from the repository root, then run:

```sh
NODE_PATH=/path/to/playwright/node_modules PORTAL_BASE=http://127.0.0.1:8017 node tests/writing-submissions.cjs
```

Requires Playwright and installed Google Chrome. Tests cover all three submission paths, all seven full Academic visuals, six GT salutations, timing boundaries, outgoing records, failure/retry, successful confirmation, separate drafts and reloads, keyboard tabs, responsive widths, legacy links and unavailable localStorage. All Formspree requests are mocked. No commit, push or deployment is part of this change.
