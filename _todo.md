# AEF 2027: open tasks

Updated 24 November 2026. **S** = Stefan, **C** = Claude. Quarto skips this file (leading underscore), so it never appears on the course homepage. Finished tasks are deleted; the decisions behind them stay in the linked issues and PRs.

## Absalon

Access works since 16 November 2026 (token on eumel, renewed 19 November; sandbox course 57599). The 2027 course does not exist yet.

- [ ] **C:** once KU has created the 2027 course, create in Absalon (after showing S the list):
  - the three assignments with their deadlines (25 Feb – 4 Mar, 12–19 Apr, 6–13 May);
  - peer feedback for seven days after each deadline;
  - the discussion for the figures of exercise 1 (#70): ready, unpublished, in the sandbox (discussion 848551), to be copied;
  - the three data files for students: `crsp_monthly.parquet`, `volare_realized_measures_daily.parquet` and `volare_realized_covariances_daily.parquet`.

## Data

- [ ] **S + C:** review the lobsteR package (github.com/voigtstefan/lobsteR) and its cleaning steps: which messages are dropped, auctions and halts, the aggregation to 5-second snapshots. The SPY data in tidyfinance are built with it.

## Lectures

- [ ] **C:** lecture 15: read the factor library and its trading costs with tidyfinance's Hugging Face download once they are released there (before the semester), instead of the private paper files, so that students can render the deck.

## Lecture notes from transcripts

Instead of video recordings: a transcript of each lecture, curated into a post that reads like a blog, with the slides where they were shown and, later, photos of the whiteboard.

Since 24 November 2026: Whisper (large-v3-turbo) runs on eumel, the live decks log every slide change (press "r" when the recording starts; course-repository#85), and Claude on eumel turns the transcript into a blog-style post with the slides (tested on a 2026 recording and a test session; details in `~/claude-home/aef-transcribe`).

- [ ] **S:** decide where the notes are published (course homepage, Absalon or both).
- [ ] **C:** a documented workflow (skill) to run after each lecture: copy the recording to eumel, transcribe overnight, write the post, publish, delete the audio.

## Exercises

Twelve pages, numbered 0 to 11, since 23 November 2026 (plan in course-homepage#74).

- [ ] **S:** review the new and split exercise pages 3, 4, 8, 9 and 10 (pages 0–7 reviewed on 20 November 2026).
- [ ] **C:** exercise 7 should use tidyfinance's download of the anomaly returns once it works in Python.

## Assignments

- [ ] **S + C:** assignment 1 (portfolio choice), final version with a solution script. Exercise 4 now solves Ledoit-Wolf, backtests with costs and parametric portfolio policies openly, so assignment 1 needs another angle.
- [ ] **S + C:** assignment 2 (machine learning in asset pricing), draft. It starts from the `stock_characteristics_monthly.parquet` each student builds in exercise 6 (not distributed on Absalon).
- [ ] **S + C:** assignment 3 (realized volatility from high-frequency data, SPY and VOLARE), draft. GARCH (from a retired exercise page) can serve as its daily benchmark.

## Trading game and conference

- [ ] **C:** dry run 25 Jan – 12 Feb, and the runbook for the reset before 16 Feb.

## Live polls and live slides

- [ ] **S + C:** in the week before lecture 1, open a poll page on KU Wi-Fi, from a laptop and a phone. KU IT (16 November 2026): new domains are blocked for up to 48 hours and then released if harmless; eumel's address works from KU now. Keep the address unchanged, or it is blocked again for up to 48 hours.
- Live slides: S opens them in the browser at `http://eumel:8444/` (Tailscale only, not public), not from a downloaded file, because the polls and sliders don't run from a file. **C** renders them with `live-slides` (all decks) or `live-slides 5` (one lecture) after every change.

## Waiting for others

- KU administration: kurser.ku.dk still shows the old exam (48-hour home assignment).
