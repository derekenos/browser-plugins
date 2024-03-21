// Do a dynamic import to enable ES6 functionality.
// https://stackoverflow.com/a/53033388/2327940
(async () => {
  const src = chrome.runtime.getURL("./src/claude-voice-chat.js");
  const script = await import(src);
  await script.main();
})();
