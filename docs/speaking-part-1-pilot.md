# Speaking Part 1 classroom pilot — 10 November 2026

Expected production route: https://orlandorobson.github.io/ielts-workshops/speaking/part-1/

This is a practice pilot with local ZIP download, not online submission. The dedicated submission configuration remains endpoint empty and verified false. Writing, shared files and other pages are unchanged.

## Classroom workflow

Explain before recording: participation and sharing are optional; offer speaking without recording. Voices can identify people even without names. Avoid personal details. Recording consent on the page permits local recording only, not collection or publication. Before collecting anything, agree the purpose, named teacher access, private transfer method, retention/deletion date and any institutional or guardian permissions required. Do not use a public class folder. Keep ZIPs out of GitHub. Keep any student-to-attempt mapping separately and privately.

Use headphones and a quiet space. Open in Safari directly using HTTPS; allow microphone access. Keep the page in the foreground and screen awake. Start with one opening topic (Work, Studies or Daily Routine); optional Weekends and Places to Relax give 4, 8 or 12 questions. Listen, record, stop and play back a sample. Check Replay and the collapsed Show question fallback. Four minutes is a visual practice target, including examiner audio and navigation; overtime never ends an answer. Finish explicitly; early finishes are labelled Partial.

At the end select Download complete attempt. On iPhone confirm download/save to Files, locate the ZIP and extract it. Verify attempt.json, manifest.txt and playable answer files with matching question IDs/counts. Do this before closing, reloading or starting again: unsaved recordings exist only in memory. Keep the original ZIP intact. Share privately only after the separate agreement above; teacher confirms receipt and extraction before students delete their copy. No files are collected automatically.

## Future online submission prerequisites

Use a dedicated Speaking form, never reuse Writing's endpoint. Confirm paid Formspree upload entitlement, application/zip acceptance, enabled submission storage, recipients, remaining storage/submission quotas, access and deletion policy, privacy notice and explicit upload consent. Test real full-length iPhone and Android ZIPs end to end: success confirmation, teacher receipt, extraction, question IDs and playable audio; also oversized files, offline/timeouts, duplicate prevention and errors. Only then set verified true and the endpoint.

Formspree documentation checked 10 November 2026: uploads available on Personal, Professional and Business plans; maximum 25 MB per file, 10 files, 100 MB total request, 30-second request timeout. This app sends one ZIP and caps it at 25,000,000 bytes. Stored files consume plan quota; exceeding quota can delete oldest files. Current account entitlement is not verified.
Sources: https://help.formspree.io/articles/building-your-form/file-uploads and https://help.formspree.io/articles/form-and-project-settings/system-limits/

## Automated verification

Existing Playwright tests use Brave with synthetic microphone input. They cover all 27 MP3s decoding and playing, opening/transition order, playback recording lock, failed playback and keyboard text fallback; full 12-answer route, Studies/Daily Routine partial routes, shorter selections, Previous/resume, overtime, recording locks, mobile widths 320–1280 and disabled submission. ZIP integrity is checked separately. These do not establish physical iPhone/Android compatibility or comprehensive screen-reader accessibility.

The original Git checkout is on main, with unrelated untracked work left untouched. Publication uses an isolated checkout from remote main 998462df3071def83f568e90181304795f9e9c86, adding only Part 1, its 27 examiner recordings, tests and this document. Existing Pages dynamic build/deployment runs on main. No publishing configuration is changed.
