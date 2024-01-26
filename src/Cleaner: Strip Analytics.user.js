// ==UserScript==
// @name          Cleaner: Strip Analytics
// @version       1
// @description   Remove "utm_" parameters from the query string, used by Google Analytics.
// @namespace     https://egore.url.lol/userscripts
// @downloadURL   https://github.com/danydodson/userscripts/blob/main/src/tracking/Tracking-Strip-UTM.user.js
// @updateURL     https://github.com/danydodson/userscripts/blob/main/src/tracking/Tracking-Strip-UTM.user.js
// @match        *?*utm*
// @icon          https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/RedX.svg/1024px-RedX.svg.png
// @grant         none
// @run-at        start
// ==/UserScript==

if (document.location.search) {
  var s = document.location.search.replace(/utm_[a-z]+=(.*?)(&|$)/g, '')
  if (s == '?') s = ''
  if (s != document.location.search) {
    var h = document.location.href.replace(/\?.*/, s)
    history.replaceState({}, document.title, h)
  }
}