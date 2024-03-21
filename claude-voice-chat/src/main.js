

let mediaRecord;

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      // Now you can do something with the recorded audio URL
      const a = document.createElement("a");
      a.href = url;
      a.download = "audio.webm";
      a.click();
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start();
    // You can set a timeout or some other logic to stop recording after a certain duration
    // setTimeout(() => mediaRecorder.stop(), 5000); // Stop after 5 seconds
  } catch (err) {
    console.error('Error accessing microphone:', err);
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
  }
}

chrome.runtime.onMessage.addListener(
  function(message, sender, sendResponse) {
    // DEBUG
    console.log(`main heard: ${message}`);
    switch(message.type) {
      case "startRecording":
        startRecording();
        break;
      case "stopRecording":
        stopRecording();
        break;
    }
  }
);
