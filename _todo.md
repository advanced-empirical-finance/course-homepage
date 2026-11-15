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

- [ ] **S:** review the drafts: decks 5–15 on main, 16 in course-repository#58.
- [ ] **C:** 07 portfolio sorts, the second hour (placeholder).
- [ ] **C:** 08 multifactor models, the Fama-French slide (placeholder).
- [ ] **C:** 15 implementable portfolios: Sharpe ratios after costs, once the factor library with trading costs exists; check the publication year of Jensen, Kelly, Malamud & Pedersen.
- [ ] **C:** 17 realized volatility and 18 realized covariances, once the VOLARE files are on eumel (plan in course-homepage#101).
- [ ] **C:** check lecture 1 against the final plan: course overview, assignment table (course-repository#57), dates.
- [ ] **C:** after S's review, remove the 2026 decks from the course repository (aef-2 to aef-6, aef-4-machine-learning, aef-reproducibility-in-asset-pricing, the old mandatory assignment files).

## Exercises

- [ ] **S:** decide where exercises 10 (GARCH, now week 17) and 11 (realized covariances, after the last exercise class on 10 May) go (course-homepage#101).
- [ ] **C:** map the exercise pages to the final calendar (course-homepage#74).
- [ ] **C:** exercise pages that are still placeholders:
  - #61 estimation uncertainty;
  - #62 parametric portfolio policies;
  - #63 size sorts and p-hacking;
  - #64 latent factors;
  - #65 implementable portfolios;
  - #66 realized variance with SPY (course-homepage#102 open);
  - #67 realized covariances with VOLARE;
  - #68 Bayesian shrinkage.
- [ ] **C:** open questions:
  - submission links for the remaining weeks (#69; exercises 2, 5 and 8 are done);
  - figure upload and gallery for the first open question (#70);
  - check whether #71 (non-standard errors) is done now that exercise 5 has its form.
- [ ] **C:** exercise 6 should use tidyfinance's download of the anomaly returns once it works in Python.

## Assignments

- [ ] **S + C:** assignment 1 (portfolio choice), final version with a solution script.
- [ ] **S + C:** assignment 2 (machine learning in asset pricing), draft.
- [ ] **S + C:** assignment 3 (realized volatility from high-frequency data, SPY and VOLARE), draft.

## Trading game and conference

- [ ] **C:** trading game page: describe the role of the game as decided in course-repository#5.
- [ ] **C:** dry run 25 Jan – 12 Feb, and the runbook for the reset before 16 Feb.
- [ ] **S:** conference on 20 May: selection rule (out-of-sample measure and period), discussants, jury, Nitor prize.
- [ ] **S + C:** team repositories (course-homepage#81): the form on Absalon, then the repositories.

## Live polls

- [ ] **S:** add the Claude API key on eumel (`~/.config/live-poll.env`). **C:** then the end-to-end test of the AI grouping; an hourly reminder is set.

## Waiting for others

- KU administration: kurser.ku.dk still shows the old exam (48-hour home assignment).
- Open PRs to merge:
  - course-repository#57 (lecture 1: assignment 3);
  - course-repository#58 (lecture 16);
  - course-homepage#102 (exercise 10 data);
  - claude-skills#5 (live-poll docs).
