#!/usr/bin/env Rscript
# Copies the rendered lecture decks (HTML and PDF) from the sibling
# course-repository into slides/, where the lecture plan links them.
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

# One deck per lecture: aef-NN-<topic>.html, NN the lecture number, and its
# PDF. The older decks in the course repository hold material that moves into
# these and stay off the homepage. Live versions (<deck>.live.html, quarto ...
# --profile live) are for the lecturer only and never published.
decks <- sort(list.files(source_dir, pattern = "^aef-[0-9]{2}-.*\\.html$"))
decks <- decks[!grepl("\\.live\\.html$", decks)]
if (length(decks) == 0) stop(sprintf("No .html decks found in %s", source_dir))
pdfs <- sub("\\.html$", ".pdf", decks)
pdfs <- pdfs[file.exists(file.path(source_dir, pdfs))]
files <- c(decks, pdfs)
invisible(file.copy(file.path(source_dir, files), file.path(dest_dir, files), overwrite = TRUE))
cat(sprintf("Copied %d deck(s) and %d PDF(s) to %s\n", length(decks), length(pdfs), dest_dir))
