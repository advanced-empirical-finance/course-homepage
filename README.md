# AEF course homepage

Source of the Advanced Empirical Finance homepage at <https://aef-course.ku.dk>.

## Publishing

GitHub renders and publishes the site: the workflow `.github/workflows/render.yml` installs the course environment (Quarto 1.11.9, R 4.6.1 with uvr, Python with uv), checks out `course-repository` for the slide decks, runs `uv run quarto render` and deploys the result to GitHub Pages.

- **Pull requests** render only, as a check.
- **Pushes to `main`** render and publish.
- **Nightly:** a run at 02:41 UTC picks up new slide decks from `course-repository`.
- **On demand:** "Run workflow" on the Actions tab.

To change a page, edit its `.qmd` in a pull request; there is no need to render locally.

## Rendering locally (preview)

R packages come from [uvr](https://github.com/nbafrank/uvr) (`uvr.toml`, `uvr.lock`), Python packages from [uv](https://docs.astral.sh/uv/) (`pyproject.toml`, `uv.lock`); both lists match the course repository's. In a terminal, in this folder:

```sh
uvr r install 4.6.1     # once: installs R
uvr sync                # R packages into .uvr/
uv sync                 # Python and its packages into .venv/
source .uvr/activate    # puts uvr's R on the PATH (Windows: .uvr\activate.ps1)
uv run quarto render    # runs Quarto with the Python in .venv
```

`quarto render` rebuilds every page. Besides the packages it needs:

- **One Quarto version.** The workflow uses 1.11.9; use the same locally.
- **The lecture slides.** The pre-render hook `tools/copy-decks.R` copies the rendered decks (HTML and PDF) from `../course-repository/lecture-slides` into `slides/`, where the lecture plan links them. Check out `course-repository` next to this repository, or point `SLIDES_SRC` at the decks.

Python pages use the kernel `python3` from `.venv`, which is why Quarto runs through `uv run`. Some R chunks run even though `_quarto.yml` sets `eval: false`, so the R packages have to be installed too.

The render writes the site into `docs/` and copies the decks into `slides/`. Git ignores both, so a local render never shows up in a commit.

## Rendering a few pages

`quarto render index.qmd` or `quarto render trading-game` renders one page or one folder and leaves the rest of `docs/` alone. Pass one file or folder per call: several files in one call are merged into one page. Pages you don't re-render keep their old navbar until the next full render.

## The trading game

`trading-game/` holds the trading game's pages (rules, getting started, team dashboard). Their source is `site/` in the aef-sim repository, copied here with its `site/sync-homepage.sh`; change them there, not here.
