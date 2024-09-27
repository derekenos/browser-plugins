export default class StreamingTranscriber extends MediaRecorder {
  constructor(stream, sliceTimeMs = 3000) {
    super(stream);
    this.sliceTimeMs = sliceTimeMs;
    this.chunks = [];

    this.addEventListener("dataavailable", this.ondataavailable);
    this.addEventListener("stop", this.onstop);
  }

  async start() {
    if (this.state === "inactive") {
      this.chunks = [];
      super.start(this.sliceTimeMs);
    }
  }

  ondataavailable(e) {
    this.chunks.push(e.data);
  }

  async onstop() {
    const blob = new Blob(this.chunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    // Now you can do something with the recorded audio URL
    const a = document.createElement("a");
    a.href = url;
    a.download = "audio.webm";
    a.click();
    URL.revokeObjectURL(url);
    await fetch("http://monolith.local:9090/_fs/audio.webm", {method: "PUT", data: blob});
  }

  async socketMessageHandler(event) {
    const data = JSON.parse(event.data);
    console.log(data);
  }
}