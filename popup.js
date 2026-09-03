// popup.js

const toggleSwitch = document.getElementById("toggleSwitch");
const statusText = document.getElementById("statusText");
const adCountEl = document.getElementById("adCount");

// Aktuellen Status aus dem Storage laden
chrome.storage.local.get(["adblockerEnabled"], (result) => {
  const enabled = result.adblockerEnabled !== false; // Standard: an
  toggleSwitch.checked = enabled;
  statusText.textContent = enabled ? "Aktiv" : "Inaktiv";
});

// Badge-Zähler des aktuellen Tabs auslesen und anzeigen
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    chrome.action.getBadgeText({ tabId: tabs[0].id }, (text) => {
      adCountEl.textContent = text || "0";
    });
  }
});

// Umschalten
toggleSwitch.addEventListener("change", () => {
  const enabled = toggleSwitch.checked;
  statusText.textContent = enabled ? "Aktiv" : "Inaktiv";
  chrome.runtime.sendMessage({ type: "TOGGLE_ADBLOCKER", enabled });
});
