# AEF course homepage

Source of the Advanced Empirical Finance homepage at <https://aef-course.ku.dk>. Quarto renders it into `docs/`, which is committed; GitHub Pages serves `main:/docs` (the custom domain comes from `CNAME`).

## Full render

R packages come from [uvr](https://github.com/nbafrank/uvr) (`uvr.toml`, `uvr.lock`), Python packages from [uv](https://docs.astral.sh/uv/) (`pyproject.toml`, `uv.lock`); both lists match the course repository's. In a terminal, in this folder:

```sh
uvr r install 4.6.1     # once: installs R
uvr sync                # R packages into .uvr/
uv sync                 # Python and its packages into .venv/
source .uvr/activate    # puts uvr's R on the PATH (Windows: .uvr\activate.ps1)
uv run quarto render    # runs Quarto with the Python in .venv
```

`quarto render` rebuilds every page. Besides the packages it needs:

- **One Quarto version.** `docs/` is currently built partly with 1.8.23 and partly with 1.10.19; a full render with one version settles that.
- **The lecture slides.** The pre-render hook `tools/build-slides-page.R` copies the rendered decks from `../course-repository/lecture-slides` into `slides/` and regenerates `slides.qmd`. Check out `course-repository` next to this repository, or point `SLIDES_SRC` at the decks.

Python pages use the kernel `python3` from `.venv`, which is why Quarto runs through `uv run`. Some R chunks run even though `_quarto.yml` sets `eval: false`, so the R packages have to be installed too.

If a full render fails half-way, it can leave `docs/` emptied; `git checkout -- docs` restores it.

## Rendering a few pages

`quarto render index.qmd` or `quarto render simulation` renders one page or one folder and leaves the rest of `docs/` alone. Pass one file or folder per call: several files in one call are merged into one page. Pages you don't re-render keep their old navbar until the next full render.

## The trading game

`simulation/` holds the trading simulation's pages (rules, getting started, team dashboard). Their source is `site/` in the simulation repository, copied here with its `site/sync-homepage.sh`; change them there, not here.
