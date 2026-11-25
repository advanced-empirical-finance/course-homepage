# AEF 2027: open tasks

Updated 25 November 2026. **S** = Stefan, **C** = Claude. Quarto skips this file (leading underscore), so it never appears on the course homepage. Finished tasks are deleted; the decisions behind them stay in the linked issues and PRs.

## Absalon

Access works since 16 November 2026 (token on eumel, renewed 19 November; sandbox course 57599). The 2027 course does not exist yet.

- [ ] **C:** once KU has created the 2027 course, create in Absalon (after showing S the list):
  - the three assignments with their deadlines (25 Feb – 4 Mar, 12–19 Apr, 6–13 May);
  - peer feedback for seven days after each deadline;
  - the discussion for the figures of exercise 1 (#70): ready, unpublished, in the sandbox (discussion 848551), to be copied;
  - the three data files for students: `crsp_monthly.parquet`, `volare_realized_measures_daily.parquet` and `volare_realized_covariances_daily.parquet`;
  - the group set *Trading game teams*: self sign-up, at most 3 members per group (also used by FeedbackFruits); the trading game reads its teams from it (voigtstefan/aef-sim#32).

## Data

The review of the LOBSTER cleaning (25 November 2026) found that the published SPY data set signed volume to 0 in many intervals with trading (37% in March 2024, 60% in March 2020), because hidden trades at the midquote got no sign, and that six March days freeze before the close. General cleaning code with all fixes, in R and polars: voigtstefan/lobsteR#5.

- [ ] **S:** merge lobsteR#5.
- [ ] **C:** rebuild the SPY (and TLT) snapshots on UCloud (project "Market responses to a vix impulse"); test month running, full run after S's OK.
- [ ] **S + C:** new version of the SPY dataset on Hugging Face, with a README on the changes (publish only after S's OK).
- [ ] **C:** the blog post "lobsteR package and high-frequency data" (tidy-finance/blog) with the fixed code in R and polars side by side; wording fixes in the second post.
- [ ] **C:** with the new data, rerun lecture 16 (price impact), lecture 17 (signature plot) and exercise 11.

## Lectures

- [ ] **C:** lecture 15: read the factor library and its trading costs with tidyfinance's Hugging Face download once they are released there (before the semester), instead of the private paper files, so that students can render the deck.

## Lecture notes from transcripts

Instead of video recordings: a transcript of each lecture, curated into a post that reads like a blog, with the slides where they were shown and, later, photos of the whiteboard.

Since 24 November 2026: Whisper (large-v3-turbo) runs on eumel, the live decks log every slide change (press "r" when the recording starts; course-repository#85), and Claude on eumel turns the transcript into a blog-style post with the slides (tested on a 2026 recording and a test session; details in `~/claude-home/aef-transcribe`).

Ready since 25 November 2026: the skill `lecture-notes` runs the whole workflow after a lecture (transcribe overnight, write the post, delete the audio), and `publish_notes.sh` opens a homepage pull request with the post and the link in the lecture plan's Notes column. Nothing to do before the semester.

## Exercises

Twelve pages, numbered 0 to 11, since 23 November 2026 (plan in course-homepage#74).

- [ ] **S:** review the new and split exercise pages 3, 4, 8, 9 and 10 (pages 0–7 reviewed on 20 November 2026).
- [ ] **C:** exercise 7 should use tidyfinance's download of the anomaly returns once it works in Python.

## Assignments

- [ ] **S + C:** assignment 1 (portfolio choice), final version with a solution script. Exercise 4 now solves Ledoit-Wolf, backtests with costs and parametric portfolio policies openly, so assignment 1 needs another angle.
- [ ] **S + C:** assignment 2 (machine learning in asset pricing), draft. It starts from the `stock_characteristics_monthly.parquet` each student builds in exercise 6 (not distributed on Absalon).
- [ ] **S + C:** assignment 3 (realized volatility from high-frequency data, SPY and VOLARE), draft. GARCH (from a retired exercise page) can serve as its daily benchmark.

## Trading game and conference

- [ ] **C:** run the dry run by the runbook `docs/runbook-dry-run.md` in voigtstefan/aef-sim: end the shadow semester on 22 January, start the dry run on 25 January (teams from the Absalon group set, tokens by Absalon message, twice a day), reset on 13–15 February.
- [ ] **S:** switch on the public address of the live dashboard (Funnel command in the runbook, step 3.5).

## Live polls and live slides

- [ ] **S + C:** in the week before lecture 1, open a poll page on KU Wi-Fi, from a laptop and a phone. KU IT (16 November 2026): new domains are blocked for up to 48 hours and then released if harmless; eumel's address works from KU now. Keep the address unchanged, or it is blocked again for up to 48 hours.
- Live slides: S opens them in the browser at `http://eumel:8444/` (Tailscale only, not public), not from a downloaded file, because the polls and sliders don't run from a file. **C** renders them with `live-slides` (all decks) or `live-slides 5` (one lecture) after every change.

## Waiting for others

- KU administration: kurser.ku.dk still shows the old exam (48-hour home assignment).
