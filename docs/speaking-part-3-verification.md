# Speaking Part 3 and submissions navigation

Local implementation, 19 November 2026. Not deployed.

The landing page title is “Submissions Portal”, with Writing and Speaking choices. Writing opens its existing task selection. Speaking opens a separate selector for Parts 1, 2 and 3. Each part remains an independent practice and submission. Part 2's former “Coming soon” label now links to Part 3; the Part 1 and Part 2 recording code is unchanged.

Part 3 uses the 22 existing MP3s under speaking/audio/part-3/. content.js preserves the user's exact 18 approved questions, three topic introductions and general introduction, mapped by filename. Each set has six individually selectable questions. General and topic audio play first; a question must finish playing before recording is enabled. Failed audio offers retry. Answers support manual stop, playback, replacement and automatic saving at 90 seconds. Any nonempty subset can be packaged and submitted. Switching sets clears the previous attempt after a backup reminder.

The implementation reuses Part 1's MP3 encoder, ZIP builder and submission configuration. ZIPs include an MP3 and original capture per completed answer, attempt.json and manifest.txt. Metadata identifies set, question number, exact approved question wording, examiner filename, duration and stop reason. Part 3 never incorporates another speaking part's answers. Encoding or upload failures retain recordings for retry. Upload requires separate consent and respects the existing 25 MB limit.

Validation passed:

- speaking-part-3.cjs: navigation; all 22 MP3s decoded; manual stop; automatic stop at the 90-second boundary using an advanced test clock; replacement without increasing answer count; answer playback; two-answer partial ZIP; no horizontal overflow at 320, 390, 844 and 1366 px; intercepted upload failure/retry/success; no page errors.
- speaking-part-3-sets.cjs: independent sets 2 and 3, partial ZIP packaging, examiner audio failure and retry with recording locked, new-set reset, microphone permission denial recovery.
- ZIP CRC validation, agreement between recording references and entries, exact approved text snapshots, partial status, automatic-stop reason and absence of Part 1/2 content.
- Existing Part 1 complete-attempt regression and Part 2 regression passed with synthetic microphone capture.
- Existing Writing regression passed using installed Brave in place of unavailable Chrome: three task routes, visual types, salutations, validation, payloads, retries, drafts, keyboard and responsive layouts.
- Desktop and mobile screenshots visually inspected. JavaScript syntax checked.

Limits: desktop Chromium with mobile viewport emulation is not a physical iPhone/Safari microphone test. The 90-second boundary was exercised by advancing the clock, not a real 90-second capture. Upload responses were intercepted; no real teacher submissions were created. Real Part 3 attachment delivery remains to be checked. No deployment or publication was performed.

This local folder has no .git directory, so changes could not be committed or compared with a tracked baseline. The separate publish-checkout folder was not changed. Approval is still required before deployment.

Run tests against a localhost server on port 8019, with Playwright available via NODE_PATH if necessary. Browser tests use the installed Brave executable and synthetic microphone. Test ZIP and screenshots are written under /tmp.
