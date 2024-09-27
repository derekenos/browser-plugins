function clickHandler(e) {
  const { target } = e;
  if (target.tagName !== "BUTTON") {
    return;
  }
  switch (target.name) {
    case "start-recording":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "startRecording" });
      });
      break;
    case "stop-recording":
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "stopRecording" });
      });
      break;
  }
}

async function inputHandler(e) {
  const { target } = e;
  switch (target.name) {
    case "whisper-url":
      await chrome.storage.local.set({ whisperUrl: target.value });
      console.log(`set: whisperUrl=${target.value}`);
      break;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", clickHandler);
  document.addEventListener("input", inputHandler);
});
