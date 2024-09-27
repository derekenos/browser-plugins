// https://stackoverflow.com/a/53033388
(async () => {
  const src = chrome.runtime.getURL("src/main.js");
  await import(src);
})();
