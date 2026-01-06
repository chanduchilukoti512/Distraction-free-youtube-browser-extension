const toggle = document.getElementById("toggle");

// Send toggle state to content script
function updateFocusMode(value) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, {
      action: "toggle",
      value: value
    });
  });
}

// Load saved toggle state
chrome.storage.sync.get(["focusMode"], (result) => {
  toggle.checked = result.focusMode !== false; // default true
});

// Listen for toggle changes
toggle.addEventListener("change", () => {
  const isChecked = toggle.checked;
  chrome.storage.sync.set({ focusMode: isChecked }, () => {
    updateFocusMode(isChecked); // immediately update the page
  });
});

// Sync toggle if changed elsewhere
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.focusMode) {
    toggle.checked = changes.focusMode.newValue;
  }
});
