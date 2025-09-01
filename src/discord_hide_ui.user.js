// ==UserScript==
// @name         Discord Hide UI
// @namespace    discord-hide-ui
// @version      1.0.0
// @description  A simple userstyle that hides some of Discord's UI.
// @author       Coxxs
// @license      MIT
// @icon         https://discord.com/assets/favicon.ico
// @match        https://discord.com/*
// @grant        GM_addStyle
// @run-at       document-start
// ==/UserScript==

(function () {

  function styleDiscordIcons(nodeList) {
    nodeList.forEach(icon => {
      icon.style.height = "20px";
      icon.style.width = "20px";
      icon.style.borderRadius = "4px";
    });
  }

  function styleDiscordBannner(nodeList) {
    nodeList.forEach(banner => {
      banner.style.left = "71px";
      banner.style.width = "calc(100% - 75px)";
    });
  }

  function scanAndStyle() {
    const banner = document.querySelectorAll('section.panels_c48ade[aria-label="User area"]');
    styleDiscordBannner(banner);

    const icons = document.querySelectorAll("img.icon__6e9f8");
    styleDiscordIcons(icons);
  }

  // Initial run
  scanAndStyle();

  // Listen for new elements
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === 1) {
          if (node.matches && node.matches("img.icon__6e9f8")) {
            styleDiscordIcons([node]);
          }
          if (node.matches && node.matches('section.panels_c48ade[aria-label="User area"]')) {
            styleDiscordBannner([node]);
          }
          // Also check descendants
          const icons = node.querySelectorAll && node.querySelectorAll("img.icon__6e9f8");
          if (icons && icons.length > 0) styleDiscordIcons(icons);
          const banners = node.querySelectorAll && node.querySelectorAll('section.panels_c48ade[aria-label="User area"]');
          if (banners && banners.length > 0) styleDiscordBannner(banners);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();