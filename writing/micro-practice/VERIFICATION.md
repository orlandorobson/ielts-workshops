# Verification — 24 November 2026

- Browser-tested at 375 × 812 and 1280 × 900 CSS pixels.
- Both layouts fit the viewport with no horizontal overflow. Mobile answer
  buttons exceed 60px tall; desktop options sit side by side.
- Completed all ten questions on mobile with one deliberate wrong answer:
  supportive correction, locked choices and explicit progression worked;
  the result was 9/10 (90%). No rule text appeared during the questions.
- Final reveal shows the final e crossed out and the -ing transformation;
  accessible labels describe the removal without relying on colour.
- Retry returned to question 1 with zero progress and a fresh option shuffle.
  Completed the desktop retry with all correct answers: 10/10 (100%).
- For every authored option pair, deterministic random inputs verified both
  possible orders and that shuffling leaves source content unchanged.
- 10,000 fresh random shuffles per question placed the correct answer first
  between 49.55% and 50.63% of the time. Position is chosen independently
  for every question display, including retries; repeated positions are valid.
- Only files beneath writing/micro-practice/ were added.
