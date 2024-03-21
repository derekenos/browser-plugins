class Recorder {
  constructor() {
    this.mediaRecorder = undefined;
  }

  async start() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      const chunks = [];
      this.mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        // Now you can do something with the recorded audio URL
        const a = document.createElement("a");
        a.href = url;
        a.download = "audio.webm";
        a.click();
        URL.revokeObjectURL(url);
      };

      this.mediaRecorder.start();
      // You can set a timeout or some other logic to stop recording after a certain duration
      // setTimeout(() => this.mediaRecorder.stop(), 5000); // Stop after 5 seconds
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  }

  stop() {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
  }
}

const recorder = new Recorder();

// eslint-disable-next-line no-unused-vars
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "startRecording":
      recorder.start();
      break;
    case "stopRecording":
      recorder.stop();
      break;
  }
});
