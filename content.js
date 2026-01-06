let focusMode = true;

// Elements to hide/show
const selectors = [
  "#related",
  "ytd-rich-grid-renderer",
  "ytd-reel-shelf-renderer",
  "ytd-comments",
  "ytd-mini-guide-renderer"
];

// Function to immediately hide/show distractions
function applyDistractions() {
  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.style.display = focusMode ? "none" : "";
    });
  });
}

// MutationObserver to catch dynamically loaded elements
const observer = new MutationObserver(() => {
  applyDistractions();
});
observer.observe(document.body, { childList: true, subtree: true });

// Load saved preference from storage
chrome.storage.sync.get(["focusMode"], (result) => {
  focusMode = result.focusMode !== false; // default true
  applyDistractions();
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "toggle") {
    focusMode = message.value;
    applyDistractions(); // immediately update page
    chrome.storage.sync.set({ focusMode }); // save preference
  }
});
