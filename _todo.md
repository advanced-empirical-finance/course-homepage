# AEF 2027: open tasks

Updated 19 November 2026. **S** = Stefan, **C** = Claude. Quarto skips this file (leading underscore), so it never appears on the course homepage. Finished tasks are deleted; the decisions behind them stay in the linked issues and PRs.

## Calendar and rooms

- [ ] **S:** book time and room for the three replacement lectures (Monday lectures in odd weeks since 17 November 2026; check with the study administration that they do not clash with the students' other courses):
  - Fri 5 Mar, portfolio sorts (for Mon 15 Mar; S is away that week);
  - Wed 31 Mar, reproducibility and non-standard errors (for Thu 18 Mar);
  - Mon 19 Apr 10–12, trees and forests (for Thu 15 Apr).
- [ ] **C:** then update the lecture plan, which currently says "time and room follow".

## Absalon

Access works since 16 November 2026 (token on eumel, renewed 19 November; sandbox course 57599). The 2027 course does not exist yet.

- [ ] **C:** once KU has created the 2027 course, create in Absalon (after showing S the list):
  - the three assignments with their deadlines (25 Feb – 4 Mar, 12–19 Apr, 6–13 May);
  - peer feedback for seven days after each deadline;
  - the discussion for the figures of exercise 1 (#70): ready, unpublished, in the sandbox (discussion 848551), to be copied;
  - the three data files for students: `crsp_monthly.parquet`, `volare_realized_measures_daily.parquet` and `volare_realized_covariances_daily.parquet`.

## Data

- [ ] **S + C:** review the lobsteR package (github.com/voigtstefan/lobsteR) and its cleaning steps: which messages are dropped, auctions and halts, the aggregation to 5-second snapshots. The SPY data in tidyfinance are built with it.
- [ ] **C:** a LOBSTER example for lecture 16: a few rows of a message file and an order book file. Use LOBSTER's public sample files or a day from KU's access, depending on the licence.

## Lectures

- [ ] **C:** lecture 15: read the factor library and its trading costs with tidyfinance's Hugging Face download once they are released there (before the semester), instead of the private paper files, so that students can render the deck.
- [ ] **C:** check lecture 1 against the final plan: course overview, assignment table (course-repository#57), dates.

## Course quality


## Lecture notes from transcripts

Instead of video recordings: a transcript of each lecture, turned into notes and published as a PDF with the slides and the whiteboard sheets.

- [ ] **C:** transcription on eumel with Whisper (the audio never leaves eumel); test the speed and quality on a sample recording before the semester.
- [ ] **C:** the live decks report slide changes to eumel, so that the transcript splits by slide.
- [ ] **C:** lecture notes PDF per lecture: each slide, what was said (cleaned up, in S's words, student questions without names), and the whiteboard sheets.

## Exercises

Eight pages since 15 November 2026 (plan in course-homepage#74), none while an assignment runs.

- [ ] **S:** review the eight exercise pages.
- [ ] **C:** exercise 7 should use tidyfinance's download of the anomaly returns once it works in Python.

## Assignments

- [ ] **S + C:** assignment 1 (portfolio choice), final version with a solution script. It can take what it needs from the retired exercise on shrinkage and transaction costs (Ledoit-Wolf, backtests with costs, parametric policies, Bayes-Stein).
- [ ] **S + C:** assignment 2 (machine learning in asset pricing), draft. It starts from the `stock_characteristics_monthly.parquet` each student builds in exercise 6 (not distributed on Absalon).
- [ ] **S + C:** assignment 3 (realized volatility from high-frequency data, SPY and VOLARE), draft. GARCH (the retired exercise 10) can serve as its daily benchmark.

## Trading game and conference

- [ ] **C:** dry run 25 Jan – 12 Feb, and the runbook for the reset before 16 Feb.

## Live polls and live slides

- [ ] **S + C:** in the week before lecture 1, open a poll page on KU Wi-Fi, from a laptop and a phone. KU IT (16 November 2026): new domains are blocked for up to 48 hours and then released if harmless; eumel's address works from KU now. Keep the address unchanged, or it is blocked again for up to 48 hours.
- Live slides: S opens them in the browser at `http://eumel:8444/` (Tailscale only, not public), not from a downloaded file, because the polls and sliders don't run from a file. **C** renders them with `live-slides` (all decks) or `live-slides 5` (one lecture) after every change.

## Waiting for others

- KU administration: kurser.ku.dk still shows the old exam (48-hour home assignment).
