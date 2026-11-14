#!/usr/bin/env Rscript
# Copies the PDFs of the lecture decks from the sibling course-repository
# into slides/, where the lecture plan links them. The homepage offers the
# slides as PDF only; the HTML versions stay in the course repository.
#
# Wired as a Quarto pre-render hook (see _quarto.yml), so it runs automatically
# on every `quarto render` / `quarto preview`. The decks are treated as opaque,
# already-rendered, self-contained files -- nothing here executes R/Python.

source_dir <- Sys.getenv("SLIDES_SRC", "../course-repository/lecture-slides")
dest_dir   <- "slides"

if (!dir.exists(source_dir)) {
  stop(sprintf("Source slides folder not found: %s", normalizePath(source_dir, mustWork = FALSE)))
}

# Fresh copy of the decks (drop stale ones that no longer exist upstream).
if (dir.exists(dest_dir)) {
  old <- list.files(dest_dir, pattern = "\\.(html|pdf)$", full.names = TRUE)
  if (length(old)) invisible(file.remove(old))
} else {
  dir.create(dest_dir, recursive = TRUE)
}

# One deck per lecture: aef-NN-<topic>.pdf, NN the lecture number. The older
# decks in the course repository hold material that moves into these and stay
# off the homepage.
pdfs <- sort(list.files(source_dir, pattern = "^aef-[0-9]{2}-.*\\.pdf$"))
if (length(pdfs) == 0) stop(sprintf("No PDF decks found in %s", source_dir))
invisible(file.copy(file.path(source_dir, pdfs), file.path(dest_dir, pdfs), overwrite = TRUE))
cat(sprintf("Copied %d PDF(s) to %s\n", length(pdfs), dest_dir))
