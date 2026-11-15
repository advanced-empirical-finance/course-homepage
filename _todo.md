# AEF 2027: open tasks

Updated 15 November 2026. **S** = Stefan, **C** = Claude. Quarto skips this file (leading underscore), so it never appears on the course homepage. Finished tasks are deleted; the decisions behind them stay in the linked issues and PRs.

## Calendar and rooms

- [ ] **S:** book time and room for the two replacement lectures:
  - Fri 5 Mar, portfolio sorts (for Mon 8 Mar);
  - Fri 9 Apr, trees and forests (for Thu 15 Apr).
- [ ] **C:** then update the lecture plan, which currently says "time and room follow", and the deck headers.

## Absalon

- [ ] **S:** give Claude access to Absalon: a Canvas API token for the course, stored on eumel and never printed.
- [ ] **C:** then create in Absalon:
  - the three assignments with their deadlines (25 Feb – 4 Mar, 8–15 Apr, 29 Apr – 6 May);
  - peer feedback for five days after each deadline;
  - the GitHub username form for the team repositories (course-homepage#81);
  - the data files for students (CRSP, VOLARE).

## Data

- [ ] **S:** copy the VOLARE files to eumel (`course-repository/data/`, not committed) and to Absalon:
  - daily realized measures for the Dow stocks since 2015 (RV, realized kernel, bipower variation, semivariances);
  - daily realized covariance matrices for the 30 Dow stocks.
- [ ] **S + C:** review the lobsteR package (github.com/voigtstefan/lobsteR) and its cleaning steps: which messages are dropped, auctions and halts, the aggregation to 5-second snapshots. The SPY data in tidyfinance are built with it.
- [ ] **S:** unit of `signed_volume` in the SPY data. The dataset card says million USD, but the values don't fit. **C:** then show the price impact in lecture 16 per $1m.
- [ ] **C:** a LOBSTER example for lecture 16: a few rows of a message file and an order book file. Use LOBSTER's public sample files or a day from KU's access, depending on the licence.
- [ ] **S:** report the bug in tidyfinance's Python `download_data_osap()` ("division with 'String' datatypes") yourself, or let C open the issue. The R version works, with data until 2024.

## Lectures

- [ ] **S:** review the drafts: decks 5–16.
- [ ] **C:** 07 portfolio sorts, the second hour (placeholder).
- [ ] **C:** 08 multifactor models, the Fama-French slide (placeholder).
- [ ] **C:** 15 implementable portfolios: Sharpe ratios after costs, once the factor library with trading costs exists; check the publication year of Jensen, Kelly, Malamud & Pedersen.
- [ ] **C:** 17 realized volatility and 18 realized covariances, once the VOLARE files are on eumel (plan in course-homepage#101).
- [ ] **C:** check lecture 1 against the final plan: course overview, assignment table (course-repository#57), dates.
- [ ] **C:** a printable sample whiteboard for every whiteboard slide (28 in decks 2–16, more in 17–18): the drawing or derivation S shows, step by step, as a PDF to take to class.
- [ ] **C:** after S's review, remove the 2026 decks from the course repository (aef-2 to aef-6, aef-4-machine-learning, aef-reproducibility-in-asset-pricing, the old mandatory assignment files).

## Exercises

Eight pages since 15 November 2026 (plan in course-homepage#74), none while an assignment runs.

- [ ] **S:** review the eight pages (course-homepage PR for the new exercises).
- [ ] **C:** exercise 7, the realized covariances part, once the VOLARE files are on eumel.
- [ ] **C:** figure upload and gallery for the open question of exercise 1 (#70).
- [ ] **C:** exercise 5 should use tidyfinance's download of the anomaly returns once it works in Python.
- [ ] **S:** decide whether the exercise classes on 1 March and 12 April (assignment weeks) become question time for the assignment.

## Assignments

- [ ] **S + C:** assignment 1 (portfolio choice), final version with a solution script. It can take what it needs from the retired exercise on shrinkage and transaction costs (Ledoit-Wolf, backtests with costs, parametric policies, Bayes-Stein).
- [ ] **S + C:** assignment 2 (machine learning in asset pricing), draft. It starts from the `stock_characteristics_monthly.parquet` each student builds in exercise 4 (not distributed on Absalon).
- [ ] **S + C:** assignment 3 (realized volatility from high-frequency data, SPY and VOLARE), draft. GARCH (the retired exercise 10) can serve as its daily benchmark.

## Trading game and conference

- [ ] **C:** trading game page: describe the role of the game as decided in course-repository#5.
- [ ] **C:** dry run 25 Jan – 12 Feb, and the runbook for the reset before 16 Feb.
- [ ] **S:** conference on 20 May: selection rule (out-of-sample measure and period), discussants, jury, Nitor prize.
- [ ] **S + C:** team repositories (course-homepage#81): the form on Absalon, then the repositories.

## Live polls and live slides

- [ ] **S:** ask KU IT (serviceportal.ku.dk) to allowlist `eumel.tail81c88a.ts.net` permanently. KU's web filter blocked it on 6 November 2026; on KU Wi-Fi students could then not answer the polls.
- Live slides: S opens them in the browser at `http://eumel:8444/` (Tailscale only, not public), not from a downloaded file, because the polls and sliders don't run from a file. **C** renders them with `live-slides` (all decks) or `live-slides 5` (one lecture) after every change.
- [ ] **S:** add the Claude API key on eumel (`~/.config/live-poll.env`). **C:** then the end-to-end test of the AI grouping.

## Waiting for others

- KU administration: kurser.ku.dk still shows the old exam (48-hour home assignment).
- Open PRs to merge: course-repository#59 (lecture 1 PDF without Type 3 fonts).
