import "./claude-voice-chat-config.js";

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }
    const observer = new MutationObserver(() => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

export async function main() {
  const chatConfigButton = await waitForElm(
    `button[data-testid="chat-controls"]`,
  );
  const configEl = document.createElement("claude-voice-chat-config");
  chatConfigButton.parentNode.insertBefore(configEl, chatConfigButton);
}
