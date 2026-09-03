// content.js
// Läuft auf jeder Seite. Ergänzt die CSS-Regeln, indem es per JavaScript
// nach Werbe-Elementen sucht, die dynamisch (z.B. per JS) nachgeladen werden
// und daher von reinem CSS allein nicht zuverlässig erwischt werden.

(function () {
  "use strict";

  const AD_SELECTORS = [
    '[id*="google_ads"]',
    '[id*="ad-container"]',
    '[id*="ad-slot"]',
    '[class*="ad-container"]',
    '[class*="ad-banner"]',
    '[class*="adsbygoogle"]',
    '[class*="sponsored-content"]',
    'ins.adsbygoogle',
  ];

  let removedCount = 0;

  function removeAds(root = document) {
    AD_SELECTORS.forEach((selector) => {
      root.querySelectorAll(selector).forEach((el) => {
        if (!el.dataset.adblockerHidden) {
          el.style.setProperty("display", "none", "important");
          el.dataset.adblockerHidden = "true";
          removedCount++;
        }
      });
    });

    // Zähler an den Service Worker melden (für das Popup)
    chrome.runtime.sendMessage({ type: "AD_COUNT_UPDATE", count: removedCount });
  }

  // Erstmaliger Durchlauf, sobald das DOM bereit ist
  document.addEventListener("DOMContentLoaded", () => removeAds());

  // Beobachtet Änderungen am DOM (für dynamisch nachgeladene Werbung,
  // z.B. bei Infinite-Scroll-Seiten oder Single-Page-Apps)
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        removeAds();
        break;
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
