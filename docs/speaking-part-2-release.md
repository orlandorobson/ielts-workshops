# Speaking Part 2 release — 10 November 2026

Independent route: `speaking/part-2/`, linked from submissions home. Part 3 is inactive / Coming soon. Part 1 and Writing code and endpoints are unchanged.

Canonical source: deliverables/ielts-speaking/ielts-speaking-part-2-set-1.md v0.2.0. All five payloads copied verbatim between candidate-card markers. Content remains reconstructed draft / pending editorial approval. User explicitly requested implementation and publication, but did not promote editorial status. Page and attempt metadata disclose draft status and practice adaptation.

Eight user-approved examiner MP3s copied from Downloads; originals preserved. SHA-256 and byte counts recorded in `speaking/part-2/assets/v0.2.0/manifest.json`. Full BRIEF and END-LIMIT are retained but unused. Default sequence: BRIEF-SHORT, CARD-INTRO, PREP-START, 60 seconds preparation measured from prompt end, SPEAK-START, recording, learner finish, END-EARLY, CLOSE. No automatic recording stop, target warning audio, optional card reading or rounding-off questions.

Microphone requested during start gesture and retained until capture ends. A reusable media element is unlocked during that gesture; playback failures show a retry control and do not advance phases. Physical iPhone Safari permission/autoplay/interruptions still require device validation. Backgrounding is logged; users must keep the page foregrounded and listen back.

Encoding uses existing Part 1 local decode/resample + LAME worker. ZIP contains actual MP3, native recording backup, exact card and JSON metadata including prompt events/timestamps. Conversion failure preserves native playback/download and permits retry; submission requires MP3 packaging and a complete recording. ZIP upload limited to 25,000,000 bytes. Dedicated Speaking endpoint: https://formspree.io/f/xdeeqgyg. Writing configuration untouched.

Validation: automated Chromium with simulated microphone and accelerated preparation clock passed prompt sequence/end boundaries, target exceeded without stopping, recording/export, portrait 320/390 and landscape 844 overflow checks, mocked multipart upload failure then retry/success, and no page JavaScript errors. ZIP CRC and MP3 frame signature checked. Encoder independently decoded a generated MP3 and verified duration/signal preservation and invalid-input rejection. This does not constitute physical device testing or a real Formspree delivery/attachment receipt. No real submission was sent.

Run: install Playwright and set NODE_PATH as appropriate; serve project on localhost:8019; `node tests/speaking-part-2.cjs`. Browser executable is currently the local Brave macOS path, consistent with existing tests. Automated capture uses synthetic audio, not a learner voice.

Existing Part 1 full 12-question and alternate-opening regression passed, including partial export, review and recording locks. All eight examiner assets decoded successfully in Chromium.
