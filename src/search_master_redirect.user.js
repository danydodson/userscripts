// ==UserScript==
// @name            Search Master Redirect
// @version         2023-06-12-0
// @description     Easily swap between search engines with the press of a button while maintaining your current query.
// @author          Mehvix
// @icon         http://www.google.com/favicon.ico
// @include         https://duckduckgo.com/?q=*
// @include         https://www.google.com/search?*
// @include         https://search.brave.com/*?q=*
// @include         https://www.startpage.com/*search*
// @include         https://search.disroot.org/search?q=*
// @include         https://yandex.com/search/?text=*
// @downloadURL     https://raw.githubusercontent.com/Mehvix/search-engine-redirect/master/SearchEngineRedirect.user.js
// @updateURL       https://raw.githubusercontent.com/Mehvix/search-engine-redirect/master/SearchEngineRedirect.user.js
// @supportURL      https://github.com/Mehvix/search-engine-redirect/issues
// @license         GNU General Public License v3
// ==/UserScript==

(function () {
  "use strict";

  const URL_DDG = "duckduckgo.com";
  const URL_GOOG = "www.google.com";
  const URL_GOOG_E = "encrypted.google.com";
  const URL_BRAVE = "search.brave.com";
  const URL_START = "www.startpage.com";
  const URL_SEARX = "search.disroot.org";
  const URL_YANDX = "yandex.com";

  document.addEventListener("keyup", function (event) {
    let activeElt = document.activeElement.tagName.toLowerCase();
    if ("input" === activeElt || "textarea" === activeElt) {
      return;
    } else {
      let h = location.host;
      let q = "";

      switch (h) {
        case URL_DDG:
          q = encodeURIComponent(
            document.getElementById("search_form_input").value
          );
          break;
        case URL_GOOG:
        case URL_GOOG_E:
          q = window.location.search.substring(3);
          break;
        case URL_BRAVE:
          q = encodeURIComponent(document.getElementById("searchbox").value);
          break;
        case URL_START:
          q = encodeURIComponent(document.getElementById("q").value);
          break;
        case URL_SEARX:
          q = encodeURIComponent(document.getElementById("q").value);
          break;
        case URL_YANDX:
          // NOTE: This is unreachable code since you can never leave yandex because you cannot ever unselect the search input box
          q = encodeURIComponent(document.getElementsByName("text")[0].value);
          break;
      }

      let url = "";
      switch (event.key.toLowerCase()) {
        case "g":
          url = h != URL_GOOG ? `${URL_GOOG_E}/search?q=` : "";
          break;
        case "d":
          url = h != URL_DDG ? `${URL_DDG}/?q=` : "";
          break;
        case "b":
          url = h != URL_BRAVE ? `${URL_BRAVE}/search?q=` : "";
          break;
        case "s":
          url = h != URL_START ? `${URL_START}/sp/search?query=` : "";
          break;
        case "x":
          url = h != URL_SEARX ? `${URL_SEARX}/search?q=` : "";
          break;
        case "y":
          url = h != URL_YANDX ? `${URL_YANDX}/search/?text=` : "";
          break;
      }
      if (url && q) document.location = "https://" + url + q;
    }
  });
})();
