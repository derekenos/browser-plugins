
const SUGGESTED = Symbol("suggested")
const SPONSORED = Symbol("sponsored")
const REELS = Symbol("reels")
const NORMAL = Symbol("normal")

const log_debug = msg => console.debug(`[facebook-news-feed-cleaner]: ${msg}`)

function detectArticleType (articleEl) {
  let textContent = articleEl.textContent

  // Observed in the wild, textContent containing:
  // "... · tSrsondope8fd0ging0pS40e1ctu4r6st1u6oog4ga  · ..."
  // The word "Sponsored" is scrambled but continguous using a series
  // of <spans> with the intruder element having display=none,
  //  pos=abs + top=3em, to make it non-visible.
  // Accessibility comes to the rescue though, as a aria-labelledby attribute
  // points to the textContent "Sponsored", so collect all of the label element
  // text contents as well and simply append to them to textContent for ease of
  // detection.
  for (const el of articleEl.querySelectorAll("[aria-label]")) {
    if (el.getAttribute("aria-label") === "Sponsored") {
      return SPONSORED
    }
  }

  for (const el of articleEl.querySelectorAll("[aria-labelledby]")) {
    const labelEl = document.getElementById(el.getAttribute("aria-labelledby"))
    // Some references don't exist?
    if (labelEl && labelEl.textContent === "Sponsored") {
      return SPONSORED
    }
  }

  // Remove all non-alpha/space chars.
  textContent = textContent.replace(/[^a-zA-Z\s]/g, "")

  if (textContent.includes("Suggested for you")) {
    return SUGGESTED
  } else if (textContent.includes("Sponsored")) {
    return SPONSORED
  } else if (textContent.includes("Reels and short videos")) {
    return REELS
  }
  return NORMAL
}

function hideSpamArticles (articleParentEl) {
  // For any descendant of articleParentEl that is a <div> with role="article",
  // detect whether the article is a spam type and, if not already hidden,
  // hide it.
  articleParentEl
    .querySelectorAll("div[role=article]")
    .forEach(articleEl => {
      let articleType = detectArticleType(articleEl)
      if (articleType !== NORMAL
          && articleEl.style.display !== "none") {
        articleEl.style.display = "none"
        log_debug(`removed ${articleType.description} article`)
      }
    })
}

function init () {
  // The main element exists in the initial payload along with a couple of
  // placeholder role="article" elements, so all spam removal is done via the
  // MutationObserver.
  const mainEl = document.querySelector("div[role=main]")
  // Register a MutationObserver to hide any subsequently loaded
  // spam articles. The mechanism for loading new articles appears to be
  // that a fairly complete <div role="feed"> is added to the DOM which is then
  // asynchronously updated with comments/like counts, profile pics, etc.
  // There's definitely some optimization that can happen here to prevent
  // checking the same element multiple times for articles to hide, but leaving
  // as is for now because it works.
  const mo = new MutationObserver(
    changes => changes.forEach(change => hideSpamArticles(change.target))
  )
  mo.observe(mainEl, {subtree: true, childList: true})
  log_debug("initialized")
}

init()
