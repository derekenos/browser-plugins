import StreamingTranscriber from "./streamingTranscriber.js";
import { waitForElement } from "./lib/helpers.js";
import "./components/pttButton.js";

let transcriber = undefined;


waitForElement(`input[data-testid="file-upload"]`).then(el => {
  // Get the upload input label element.
  const labelEl = el.closest("label");
  const pttButton = document.createElement("ptt-button");
  pttButton.classList = labelEl.classList;
  labelEl.parentNode.insertBefore(pttButton, labelEl);
})

// eslint-disable-next-line no-unused-vars
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  switch (message.type) {
    case "startRecording":
      if (transcriber === undefined) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        transcriber = new StreamingTranscriber(stream);
      }

      transcriber.start();
      break;
    case "stopRecording":
      transcriber.stop();
      break;
  }
});
