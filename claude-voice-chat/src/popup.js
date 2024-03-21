document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e) => {
    const { target } = e;
    if (target.tagName !== "BUTTON") {
      return;
    }
    switch (target.name) {
      case "start-recording":
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "startRecording" });
          },
        );
        break;
      case "stop-recording":
        chrome.tabs.query(
          { active: true, currentWindow: true },
          function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "stopRecording" });
          },
        );
        break;
    }
  });
});
