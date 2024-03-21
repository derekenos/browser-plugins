import { configButtonClassString, configButtonImageData } from "./constants.js";

export default class ClaudeVoiceChatConfig extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <button class="${configButtonClassString}">
        <img src="data:image/png;base64,${configButtonImageData}">
      </button>
    `;

    this.addEventListener("click", this.clickHandler.bind(this));
  }

  clickHandler() {
    console.log("Voice config button clicked");
  }
}

window.customElements.define("claude-voice-chat-config", ClaudeVoiceChatConfig);
