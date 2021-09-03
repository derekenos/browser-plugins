
/******************************************************************************
   Generic DOM Utilities
******************************************************************************/

function createElement (DOMString, parentTag="div") {
  // Return an HTML element object for the given DOM string.
  const wrapper = document.createElement(parentTag)
  wrapper.innerHTML = DOMString.trim()
  const el = wrapper.firstChild
  wrapper.removeChild(el)
  return el
}

// Helper to wait for the DOM to become idle when dealing with insanely slow,
// async web apps.
function callWhenDOMIdle (func, seconds=2) {
  // Set a timer to invoke func after N seconds, resetting the timer on any
  // DOM mutation.
  //
  // Define a wrapper to disconnect the MutationObserver prior to calling
  // the function to prevent additional triggers.
  const wrapper = () => { mo.disconnect(); func() }
  let timeoutHandle = setTimeout(wrapper, seconds * 1000)
  const mo = new MutationObserver(changes => {
    clearTimeout(timeoutHandle)
    timeoutHandle = setTimeout(wrapper, seconds * 1000)
  })
  mo.observe(document.body, {subtree: true, childList: true})
}

function injectScripts (filenames) {
  filenames.forEach(filename => {
    const script = document.createElement("script")
    script.src = chrome.runtime.getURL(filename)
    document.head.appendChild(script)
  })
}

function injectStyle (styleString) {
  const style = document.createElement('style')
  style.textContent = styleString
  document.head.appendChild(style)
}


/******************************************************************************
   Specific Stuff
******************************************************************************/

function replaceCommentStringsWithIcon () {
  const iconUrl = chrome.runtime.getURL("icon.svg")
  document.body.innerHTML = document.body.innerHTML.replace(
    /(\d+)(?:\s|&nbsp;)+comments/gi,
    `<span is="custom-comments" icon-url="${iconUrl}" comment-count="$1">
     </span>
    `
  )
}

async function init () {
  // Example injection of custom CSS rules.
  injectStyle(" body { font-size: 1rem; } ")

  // Example injection of WebComponent into main page where, unlike here,
  // customElement.define() actually works.
  injectScripts(["Component.js"])

  // Example import of ES6 module.
  const importedModule = await import(chrome.runtime.getURL("Module.js"))
  console.log(importedModule.default)

  // Do the "NN Comments" -> <customElement> replacement.
  replaceCommentStringsWithIcon()
}

init()
// Maybe do this instead if necessary.
//callWhenDOMIdle(init, 2)
