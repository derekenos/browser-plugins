
const SUGGESTED = Symbol("suggested")
const SPONSORED = Symbol("sponsored")
const NORMAL = Symbol("normal")

const log_debug = msg => console.debug(`[facebook-news-feed-cleaner]: ${msg}`)

function detectArticleType (articleEl) {
  const textContent = articleEl.textContent
  if (textContent.includes("Suggested for you")) {
    return SUGGESTED
  } else if (textContent.replace(/\-/g, "").includes("Sponsored")) {
    return SPONSORED
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
