// background.js (Manifest V3 Service Worker)

// Zählt geblockte/entfernte Werbe-Elemente pro Tab, für die Badge-Anzeige
const tabCounts = {};

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "AD_COUNT_UPDATE" && sender.tab) {
    const tabId = sender.tab.id;
    tabCounts[tabId] = message.count;
    chrome.action.setBadgeText({
      tabId,
      text: message.count > 0 ? String(message.count) : "",
    });
    chrome.action.setBadgeBackgroundColor({ tabId, color: "#4CAF50" });
  }
});

// Badge zurücksetzen, wenn ein Tab neu lädt
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading") {
    tabCounts[tabId] = 0;
    chrome.action.setBadgeText({ tabId, text: "" });
  }
});

// Aufräumen, wenn ein Tab geschlossen wird
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabCounts[tabId];
});

// An/Aus-Schalter: aktiviert/deaktiviert das Netzwerk-Regelwerk global
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ adblockerEnabled: true });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === "TOGGLE_ADBLOCKER") {
    chrome.declarativeNetRequest.updateEnabledRulesets(
      message.enabled
        ? { enableRulesetIds: ["ruleset_ads"] }
        : { disableRulesetIds: ["ruleset_ads"] }
    );
    chrome.storage.local.set({ adblockerEnabled: message.enabled });
    sendResponse({ success: true });
  }
  return true;
});
