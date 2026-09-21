# Shared IELTS classroom release service — local implementation

Status: **backend deployed and verified on 2026-09-21; frontend remains unpublished**.
The IELTS repository has not been committed or pushed. Cloudflare authorization
is complete. No further owner setup is needed for the current same-Wi-Fi test.

Backend: https://ielts-classroom-release.ielts-classroom-release.workers.dev

Cloudflare version: `67e86d2a-fdcb-45f0-a83a-f6626c6b8884` (100% deployed).

## Physical Mac → phone preview

The current Mac preview server is listening on port 8001. With the Mac awake and
the phone on the same Wi-Fi, use these **unpublished** frontend URLs:

- Teacher: http://192.168.1.103:8001/listening/day-1/teacher-control/
- Student: http://192.168.1.103:8001/listening/day-1/

Create a class, enter its six-character code once on the phone, wait for Connected ✓,
answer an activity, and release it from the Mac. These pages use the deployed
Cloudflare backend, not the local workerd runtime. The GitHub Pages frontend still
uses its old static-code mechanism; do not use that version for this test.

The LAN address is specific to the current Wi-Fi and can change. If it changes,
update the exact allowed origin in wrangler.jsonc and redeploy the backend. Guest
Wi-Fi client isolation or a Mac firewall can prevent a phone loading the preview;
that is separate from classroom synchronization. Nothing is uploaded by serving
this local preview. Do not forward this local server port onto the public Internet.

## Deployed-service evidence

The original local-runtime checks below remain valid. On 2026-09-21 the acceptance
scripts were also run using the LAN frontend and real deployed Cloudflare backend:

- Three isolated BrowserContexts, teacher and two independently connected students.
- Spelling release reached both with answers retained: **274 ms** measured.
- 1.4 released independently while 1.5 stayed unavailable.
- Offline student kept editing, reconnected and caught up with later releases.
- Both students refreshed and recovered their connection/release state; teacher
  refresh also retained control. Release all enabled every controlled activity.
- Public-code-only release denied. Public reads expose no teacher token or hash.
- Creation response confirms an eight-hour lifetime; invalid-code handling passed.
- 360/390/430px checks passed for all three clients, with no overflow/runtime errors.
- Blocked WebSocket test delivered by polling in **4,971 ms**; simulated service
  outage preserved work and recovered without re-entering the code.
- No student answers, selections, scores or device identifiers in API payloads.

Expiry cleanup was verified in the real local workerd tests with an accelerated
test object. The deployed service uses the same code and eight-hour lifetime;
we have not waited eight hours for a production session to expire. Expired-code UI
was tested with an intercepted 410 response, not claimed as an elapsed production
expiry test. Physical phone testing is the user's next step.

Initial tests hit a TLS handshake failure while the newly registered workers.dev
hostname provisioned. HTTPS then became ready without disabling certificate checks;
the deployed tests above passed afterward. No frontend publication occurred.

To rerun against the deployed service (from this directory):

```sh
CLASSROOM_API=https://ielts-classroom-release.ielts-classroom-release.workers.dev STUDENT_URL=http://192.168.1.103:8001/listening/day-1/ NODE_PATH=/Users/orlandorobson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tests/classroom.cjs
CLASSROOM_API=https://ielts-classroom-release.ielts-classroom-release.workers.dev STUDENT_URL=http://192.168.1.103:8001/listening/day-1/ NODE_PATH=/Users/orlandorobson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tests/fallback.cjs
```

## Architecture and scope

One Worker, one SQLite-backed Durable Object class, one object per random six-
character classroom code. Public code lookup routes directly to the object: no
central directory or additional database. Sessions last eight hours. An object
alarm closes its sockets and deletes all stored session data at expiry; reads
and writes also check expiry. No cron, manual cleanup or student accounts.

The object stores only code, workshop identifier, released activity IDs,
creation/expiry timestamps and a SHA-256 teacher-token hash. Its SQLite-backed
key/value API uses one logical session entry. An atomic storage transaction unions
releases, so concurrent commands cannot overwrite another release.

A random 256-bit teacher capability is returned only at creation and stored in the
teacher's browser. Mutations require that capability in an Authorization header.
The public classroom code cannot release answers. WebSockets are read-only; only
static heartbeat messages are accepted. The teacher page remembers the session and
credential across refreshes. There is no account recovery: losing that browser
storage means creating a new class. Do not share the teacher browser's storage.

`shared/classroom/workshops.js` is the allowlist of workshop and activity IDs used
by the backend and frontend. Only Listening Day 1 is integrated. Later workshops
can add an entry and reuse the connection client; no separate backend is needed.
Speaking's current files and behaviour have not been changed.

Endpoints:

- `POST /v1/classes` — creates an eight-hour session for an allowed workshop.
- `GET /v1/classes/CODE?workshop=...` — read-only state and validity check.
- `GET /v1/classes/CODE/stream?workshop=...` — read-only WebSocket upgrade.
- `POST /v1/classes/CODE/release?workshop=...` — teacher capability required;
  body is exactly an activity ID or `{ "all": true }`.

No production test/expiry override or internal initialization endpoint is exposed
by the Worker router. The direct object namespace used in unit tests is local only.

## Polling versus push

Five-second polling: 20 × 7,200 / 5 = **28,800 reads** over a two-hour class,
plus joins/teacher commands. At 30 students this is 43,200. Three 30-student classes
would use 129,600 reads. Workers Free currently allows 100,000 requests per day,
shared with the rest of the account. Three 20-student classes already use 86,400
before overhead. Background tabs and outages make naive polling less efficient.

Chosen: Durable Object **hibernating WebSockets**, with five-second HTTP polling
only if sockets fail or are blocked. No WebSocket library in the browser, no event
history, queues, subscriptions table or student identities. The server sends the
complete tiny state at connection and after each release. Hibernation allows idle
connections without keeping the object running continuously. No server timers
prevent hibernation; expiry uses the Durable Object alarm.

For 20 students + one teacher, two hours, about ten teacher releases and stable
connections: roughly **60–90 Worker HTTP requests**, including startup/read/socket
handshakes, teacher commands and CORS preflight overhead. Each visible connection
sends a static heartbeat every 30 seconds: about 5,040 messages across 21 clients.
Cloudflare answers these without waking the hibernating object; outgoing messages
are not charged as requests. Even counting every heartbeat conservatively as an
event gives roughly 5,100 DO events, before the documented billing adjustments.
This is not a guarantee about other account traffic or malicious requests.

Worst case, if all networks block WebSockets, usage returns to the polling figures
above. The interface remains functional, but Free-plan capacity is not unlimited.
Hidden tabs stop connections/polls; visibility/online events reconnect immediately.
Failed HTTP attempts back off from 5 to 10, 20 and 30 seconds. No requests are sent
by the connection loop while the browser reports offline. A successful fallback
poll schedules the next after five seconds. A later visibility/online event retries
push. There is no constant HTTP polling when WebSockets work.

Sources checked 2026-09-21:
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/durable-objects/platform/pricing/
- https://developers.cloudflare.com/durable-objects/best-practices/websockets/
- https://developers.cloudflare.com/durable-objects/api/state/

## Student behaviour and failure handling

The visible class-code form collapses to Connected ✓ and a small Change class
control. No new progression locks. Releases update buttons in place; text/radio
answers are never re-rendered by connection changes. Saved feedback is restored
only after current server release state has been verified. The former static
release codes/localStorage release flags are ignored.

Answers, selections and scores stay in their existing browser-local storage. Only
class code/session dates are persisted for student reconnection. If the network
fails, work remains editable. Previously received releases remain usable until
session expiry; unreleased activities remain uncheckable. Reload while offline
retains answers but fails closed for feedback until server verification returns.
Invalid/expired codes get a short nontechnical message. Reconnection is quiet.
Changing class clears release access, not answers. Expiry hides checking and saved
feedback but leaves responses intact.

Healthy push is normally below five seconds; local observed release was **65 ms**.
Blocked-socket fallback was **4,889 ms** in the local acceptance test. These are
local measurements, not yet internet or real-phone measurements. Online/visible
events catch up immediately. A silent half-open connection without a browser event
can take up to about 40 seconds to detect (30-second heartbeat + 10-second timeout).
Phones asleep/in background catch up when returned to the page.

No student names, answers, scores, progress, device identifiers or analytics are
sent/stored by the application. Worker observability is disabled and the code does
not log request bodies, IPs or tokens. Cloudflare still necessarily processes
network metadata/IPs for transport and its platform operation; this is not a claim
that the provider sees no network metadata. No third-party frontend analytics.

## Local tests and evidence

Cloudflare's actual local workerd runtime is used, not a hand-written backend mock.
Wrangler supplies a real SQLite-backed Durable Object. All checks passed:

- `npm test`: code cannot write; wrong/absent token rejected; unrelated payload
  fields rejected; origin/workshop validation; concurrent releases preserved;
  WebSocket still receives updates after forced object hibernation; heartbeat
  reply; socket write rejected; eight-hour production lifetime; genuine short-
  lived test object expires and its data is removed; SQLite inspected locally.
- `tests/classroom.cjs`: three independent Playwright BrowserContexts (teacher,
  student A, student B), no shared localStorage/sessionStorage. Create/connect,
  spelling answers/no check, release to both, existing answers retained, release
  1.4 while 1.5 guarded, A offline and editing, later release, reconnection/catch-up,
  refresh/reopen and release recovery, teacher refresh, release all, code-only
  mutation denial, invalid and expired-code UI, no answer uploads. All three
  clients checked at 360/390/430px, no horizontal overflow or runtime errors.
- `tests/fallback.cjs`: WebSockets deliberately blocked, release appears via
  five-second polling; backend temporarily unavailable; answers retained and
  unreleased checks guarded; connection recovers without changing answers.
- Existing Day 1 transcript, source, spelling, leakage, scoring and 360/390/430/
  1280px regression checks updated to use real server releases and passed.

Expired UI uses an intercepted 410 response in the browser test; real expiry,
alarm deletion and hibernation are independently exercised in workerd unit tests.
Those initial local tests did not use physical phones. Subsequent deployed-service verification is recorded above.

For future local-runtime testing (no login required), temporarily point the unpublished `shared/classroom/config.js` at `http://127.0.0.1:8787` and start from this directory:

```sh
npm ci
# .dev.vars (gitignored) must contain:
# ALLOWED_ORIGINS="http://localhost:8000,http://127.0.0.1:8000"
WRANGLER_SEND_METRICS=false npm run dev
```

Serve the repository root with `python3 -m http.server 8000` in another terminal.
Open `/listening/day-1/` and `/listening/day-1/teacher-control/`. Browser tests need
Playwright available via NODE_PATH and installed Google Chrome. On this workspace:

```sh
NODE_PATH=/Users/orlandorobson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tests/classroom.cjs
NODE_PATH=/Users/orlandorobson/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules node tests/fallback.cjs
WRANGLER_SEND_METRICS=false npm test
```

## Ongoing maintenance

No daily database maintenance; expiry deletes state automatically. Keep the
Cloudflare account available, periodically review free quota/error totals (platform
operations, not student analytics), and update the pinned Wrangler dependency with
regression tests. Check real classroom networks before wider use; if many use the
polling fallback, capacity must be reviewed. The public create-session endpoint
has no account gate by design; deliberate abuse could exhaust the Free quota.
Request sizes and socket counts are bounded, but this is not an anti-abuse service.
A quota outage must degrade to retrying without losing student work.

Do not enable a paid plan or publish repository changes without user approval.


## Publication pass — 2026-09-21

The historical local-only status above is superseded by this publication pass.
Worker version d94069c2-8c18-48d2-ae66-22ff72b94446 is deployed with all ten Day 2
activities. Real-service tests passed before frontend activation: separate teacher
and two student contexts, session creation, individual release, release-all,
unauthorized write 403, invalid code 404, eight-hour lifetime metadata, offline
catch-up and refresh persistence. Day 1 create/release/persistence also passed.
Actual expiry/alarm cleanup was tested locally, not by waiting eight hours in production.

Day 2 serviceReady is now true; shared serviceURL remains the deployed HTTPS Worker.
No content changed. Prepublication regression suites passed for Day 1, all Day 2
activities and local Worker lifecycle/security. Final public-page checks use
listening/day-2/tests/production-smoke.cjs after GitHub Pages deployment.
Physical-phone verification remains a manual teacher check; browser contexts are
not physical devices.
