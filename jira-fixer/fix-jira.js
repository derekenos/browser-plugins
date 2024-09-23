
function removeQuickReplies(el) {
  /*
   * Remove the garbage Quick comments buttons wrapper.
   */
  // This element comes back after focusing / blurring the comments textarea,
  // so always just make sure it ain't there.
  const quickRepliesEl = el.querySelector(`[aria-label="Quick comments"]`);
  if (quickRepliesEl) {
    quickRepliesEl.remove();
  }
}

function init () {
  const mo = new MutationObserver(
    changes => changes.forEach(change => removeQuickReplies(change.target))
  );
  mo.observe(document.body, {subtree: true, childList: true})
}

init()
