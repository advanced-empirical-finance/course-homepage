# AEF 2027: open tasks

Updated 27 November 2026. **S** = Stefan, **C** = Claude. Quarto skips this file (leading underscore), so it never appears on the course homepage. Finished tasks are deleted; the decisions behind them stay in the linked issues and PRs.

## Absalon

Access works since 16 November 2026 (token on eumel, renewed 19 November; sandbox course 57599). The 2027 course does not exist yet.

- [ ] **C:** once KU has created the 2027 course, create in Absalon (after showing S the list):
  - the three assignments with their deadlines (25 Feb – 4 Mar, 8–22 Apr, 6–18 May);
  - peer feedback for seven days after each deadline;
  - the discussion for the figures of exercise 1 (#70): ready, unpublished, in the sandbox (discussion 848551), to be copied;
  - the three data files for students: `crsp_monthly.parquet`, `volare_realized_measures_daily.parquet` and `volare_realized_covariances_daily.parquet`;
  - the group set *Trading game teams*: self sign-up, at most 3 members per group (also used by FeedbackFruits); the trading game reads its teams from it (voigtstefan/aef-sim#32).

## Data

The SPY dataset on Hugging Face (voigtstefan/sp500) has a new version since 26 November 2026: rebuilt with lobsteR (fixed signed volume, midpoint volume, halts, early closes) and extended to 23 November 2026; lectures 16 and 17 and exercise 11 use it (course-repository#87, course-homepage#142).

- [ ] **S:** LOBSTER (Ruihong) asked on 26 November 2026 about the days that stop early or are empty (78 SPY days from 2019 on, list in `~/data/lobster/lobster_problem_days.csv` on eumel). **C:** once complete files arrive, rebuild those days and publish a new version.
- [ ] **S:** exercise 11, SPY against ES: keep the days whose data end early (correlation 0.96, as now) or drop all ten such March days (0.97)? ES has 60.5% on 23 March 2026 while SPY looks normal that day; worth a look in VOLARE.

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

The three assignment texts are drafted (27 November 2026): `mandatory-assignments/texts/assignment-{1,2,3}.qmd` in the course repository, rendered to PDF there and shared on Absalon at release; the folder is not on GitHub (course-repository#88). Dates: 25 Feb – 4 Mar, 8–22 Apr, 6–18 May, deadlines at 16:00.

- [ ] **S:** final read of the three texts.
- [ ] **C:** the survey for each assignment's headline numbers in live-poll, ready before its release.
- [ ] **C:** after each deadline, extract the teams' decisions from the reports with an LLM and sort them into categories, for the discussion.

## Trading game and conference

- [ ] **C:** run the dry run by the runbook `docs/runbook-dry-run.md` in voigtstefan/aef-sim: end the shadow semester on 22 January, start the dry run on 25 January (teams from the Absalon group set, tokens by Absalon message, twice a day), reset on 13–15 February.
- [ ] **S:** switch on the public address of the live dashboard (Funnel command in the runbook, step 3.5).

## Live polls and live slides

- [ ] **S + C:** in the week before lecture 1, open a poll page on KU Wi-Fi, from a laptop and a phone. KU IT (16 November 2026): new domains are blocked for up to 48 hours and then released if harmless; eumel's address works from KU now. Keep the address unchanged, or it is blocked again for up to 48 hours.
- Live slides: S opens them in the browser at `http://eumel:8444/` (Tailscale only, not public), not from a downloaded file, because the polls and sliders don't run from a file. **C** renders them with `live-slides` (all decks) or `live-slides 5` (one lecture) after every change.

## Waiting for others

- KU administration: kurser.ku.dk still shows the old exam (48-hour home assignment).
