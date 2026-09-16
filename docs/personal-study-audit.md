# Personal Study — illustrated discovery revision — content and implementation audit

Checked 2026-09-16. Local only: do not commit, push or publish without a new instruction.

## Scope and design

Standalone `/personal-study/`, not a workshop day. Shared base CSS supplies the existing
paper/teal palette, type, focus states and reduced-motion handling. A single optional
Personal Study card is added to the home page; no Speaking files or shared code change.
Two illustrated talks lead immediately into a history collection and a business
collection, with Ibn Battuta and Cristiano Ronaldo as illustrated gateways. Eight interest
routes follow those collections. All 20 verified recommendations remain; the optional
diagnostic TED-Ed collection stays collapsed. No scores, completion bars, locks, accounts, frameworks or external embeds.

The reasons and noticing prompts are editorial teaching suggestions, not claims that
these are ideal accents or models to copy. Interest comes before reflection.

## Verification and sources

- TED's own pages verify Kelly A. Boesch, David Eagleman and Asha de Vos, and the four
  Public Speaking 101 routes. Kelly's publisher title uses parentheses; the page uses
  the requested em-dash wording.
- BBC publisher feeds verify episode titles, subjects and direct programme links:
  [You're Dead to Me](https://podcasts.files.bbci.co.uk/p07mdbhg.rss) and
  [Good Bad Billionaire](https://podcasts.files.bbci.co.uk/p0g7xj36.rss).
- Ramesses uses the full 2021 discussion, not the 2025 children's Dead Funny History
  crossover or the radio edit. Saladin and Genghis Khan also use the full episodes.
- Google is represented by Sergey Brin: Googling billions. The OpenAI selection is
  Sam Altman: ChatGPT and the AI revolution, explicitly described as a 2024 account.
- **Khaby Lame excluded by explicit instruction:** his image is stored unused. There
  is no recommendation, related item, student-facing explanation or image reference.
- [Catsnake's production credits](https://vimeo.com/126483718) verify the food-marketing
  film was made for Compassion in World Farming and credit actress Kate Miles.
  The requested YouTube link is primary; the producer's Vimeo upload is an alternative.
  Do not present the performed speaker as an independent expert. Subject context is visible.
- The Economist's publisher listing on Apple Podcasts verifies The Intelligence route.
  This is a programme recommendation, not a promise of a curated episode. The student
  is asked to select one interesting weekday story or preview, not listen to a series.

## External-link audit

Every included external URL returned HTTP 200 on the check date, following redirects.
This checks the destination, not a guarantee of playback from every location, network
or account. Provider advertising, subscriptions and regional availability remain outside
this site's control. No remote media is copied or hosted. Links open in named new-tab
behaviour with `noopener noreferrer`. Each recommendation offers a copyable URL, exact
search title and a non-blocking fallback. Food marketing also has a verified alternate.

| Recommendation | Direct link |
|---|---|
| How AI unleashed — not replaced — my creativity | [Kelly A. Boesch · TED](https://www.ted.com/talks/kelly_a_boesch_how_ai_unleashed_not_replaced_my_creativity) |
| Can we create new senses for humans? | [David Eagleman · TED](https://www.ted.com/talks/david_eagleman_can_we_create_new_senses_for_humans) |
| Why you should care about whale poo | [Asha de Vos · TED](https://www.ted.com/talks/asha_de_vos_why_you_should_care_about_whale_poo) |
| The Secrets of Food Marketing | [eTalks · Catsnake / Compassion in World Farming](https://www.youtube.com/watch?v=mKTORFmMycQ) |
| The Intelligence | [The Economist · podcast programme](https://podcasts.apple.com/us/podcast/the-intelligence-from-the-economist/id1449631195) |
| Ibn Battuta | [You’re Dead to Me · BBC](https://www.bbc.co.uk/programmes/p0cxvmk1) |
| Genghis Khan | [You’re Dead to Me · BBC](https://www.bbc.co.uk/programmes/p08qg3xl) |
| Saladin | [You’re Dead to Me · BBC](https://www.bbc.co.uk/programmes/p07r6hjz) |
| Al Andalus | [You’re Dead to Me · BBC](https://www.bbc.co.uk/programmes/p0fgksc7) |
| Mansa Musa | [You’re Dead to Me · BBC](https://www.bbc.co.uk/programmes/p07nwybz) |
| Ramesses the Great | [You’re Dead to Me · BBC](https://www.bbc.co.uk/programmes/p09tvhv8) |
| Cristiano Ronaldo: Football's first billionaire player | [Good Bad Billionaire · BBC](https://www.bbc.co.uk/programmes/w3ct9bc3) |
| Jack Ma: China's ecommerce CEO | [Good Bad Billionaire · BBC](https://www.bbc.co.uk/programmes/w3ct6xl8) |
| Sam Altman: ChatGPT and the AI revolution | [Good Bad Billionaire · BBC](https://www.bbc.co.uk/programmes/w3ct6xl4) |
| Zhang Yiming: TikTok’s tech boss | [Good Bad Billionaire · BBC](https://www.bbc.co.uk/programmes/w3ct6xl3) |
| Sergey Brin: Googling billions | [Good Bad Billionaire · BBC](https://www.bbc.co.uk/programmes/w3ct6xkx) |
| How to explain something complicated | [TED-Ed · Public Speaking 101](https://ed.ted.com/lessons/the-best-way-to-explain-complex-ideas) |
| 4 ways to tell a great story | [TED-Ed · Public Speaking 101](https://www.ted.com/talks/ted_ed_4_ways_to_tell_a_great_story) |
| How to speak with meaning | [TED-Ed · Public Speaking 101](https://www.ted.com/talks/ted_ed_how_to_speak_with_meaning) |
| What’s the best way to give a presentation? | [TED-Ed · Public Speaking 101](https://www.ted.com/talks/ted_ed_what_s_the_best_way_to_give_a_presentation) |

## Personal state and accessibility

One isolated localStorage key: `ielts-personal-study-v1`. It contains voluntary explored/
hear-again choices, observations, borrowing notes, a notebook draft, notebook entries and
Not for me choices. Opening an external link does not mark it explored. No tracking,
requests containing personal state, or automatic assessment. Notes are escaped on display.
Malformed stored fields are normalised. Read/write failure falls back to in-memory use
with a visible message to copy notes before leaving. Clearing browser data removes notes.

Native anchors, buttons, checkboxes, labelled text fields, details/summary and select.
Skip link, visible keyboard focus, logical headings, minimum 44px actions and no reliance
on colour alone. The four editorial illustrations have concise alt text and explicit dimensions. Notebook links
reveal their collection and move focus to the recommendation, even under another filter.
Not for me is reversible, keeps the item available and suggests a different first topic.
External failure never disables browsing or notebook work. JavaScript load failure leaves
an explicit retry message; a no-JavaScript message includes the two starting links.

## Before publication

Recheck external media from the intended students' network in Oman; HTTP availability is
not full media-playback verification. Review the adult subject matter of the food campaign
and unscripted podcast discussions for the intended group. Khaby remains intentionally
absent pending an episode source. No factual claims about a direct Dhofar scientific case
are made. No workshop rebuild or deployment is part of this change.

## Local validation results

Passed Chromium checks at 360, 390, 430 and 1280px: all interest filters, all 20
recommendations and expanded disclosures, with no horizontal overflow. Desktop and mobile
screenshots inspected. Keyboard skip link, interest selection and disclosure controls
passed; IDs are unique and form inputs have labels. Reflection choices, free text,
notebook entries and return links persist; Speaking storage remains untouched. Text is
rendered safely. Corrupt storage, unavailable storage, write-quota failure, failed content
fetch (without overwriting the saved notebook), blocked external sites, clipboard failure
and note removal passed. No JavaScript errors. Preview HTTP 200 on port 8000.

Local preview: http://localhost:8000/personal-study/
Files: personal-study/index.html, study.css, study.js; content/personal-study/recommendations.json;
this audit; one additional home-page card in index.html. No commit or publication performed.

## Illustrated discovery revision

Final order: short introduction → Kelly / Eagleman → You’re Dead to Me (Ibn Battuta,
Genghis Khan, Saladin, Al Andalus, Mansa Musa, Ramesses) → Good Bad Billionaire (Ronaldo,
Zhang Yiming, Sergey Brin, Jack Ma, Sam Altman) → interest browsing and broader picks →
optional depths → notebook → restrained closing. The order never gates access.

Every primary media button names its provider and opens a new tab. The external URLs
and stable recommendation IDs are unchanged. Existing notes use the same storage key.
`relatedIds` gives each recommendation exactly three manually curated relationships.
Native details/summary supplies expanded state and keyboard operation; compact links show
speaker/programme, title and themes, with no duplicate full cards or images. Navigation
reveals the original card, focuses its heading and creates a same-page history entry.
Back restores the prior interest filter, source card/disclosure and scroll position.

Relationship examples: Kelly → Eagleman / Sam Altman / storytelling; Eagleman → Asha /
explaining complex ideas / Kelly; Ibn Battuta → Al Andalus / Saladin / Mansa Musa;
Ronaldo → Zhang Yiming / Jack Ma / food marketing. These reflect curiosity, explanation,
cultural encounters, business or constructed public presence rather than provider alone.

All assets moved (not copied) to personal-study/images/:
- image-1-khaby.png — unused, never rendered
- image-2-david-eagleman.png — Eagleman card
- image-3-cristiano.png — Ronaldo gateway
- image-4-kelly-boesch.png — Kelly card
- image-5-ibn-battuta.png — Ibn Battuta gateway; filename spelling corrected

No Speaking source referenced these files. Their full 1536×1024 compositions are kept
at 3:2 with intrinsic dimensions; no forced crop removes faces or sensory details. Gateway
images load lazily; Start here images load eagerly. The files total about 9 MB, with about
7.5 MB used: consider smaller web delivery versions before publication, retaining originals.

Validation: 1280, 430, 390, 360px passed order, all images/ratios, every More like this
open/close with keyboard, all interest routes and expanded layouts without overflow.
Related navigation, browser Back (including a nested TED-Ed target), filter restoration,
notes and choices across reload, blocked storage and external-site failure passed.
All 21 external destinations returned HTTP 200 again. Speaking Day 1 (46 screens) and
Day 2 (33 screens, including audio playback) passed their full four-width regressions.
No old speaking/images paths, misspelled asset paths or student-facing Khaby references.

Before publication: review page length on phones with the now-visible podcast cards;
keep the optional study controls secondary. Verify media playback from the intended network;
HTTP checks do not guarantee regional playback or subscription access. The supplied artwork
is illustration, not documentary evidence of a particular historical scene. No new episode
or speaker claim has been introduced. No commit, push or publication performed.
