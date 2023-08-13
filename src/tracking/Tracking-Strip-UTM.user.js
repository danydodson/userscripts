// ==UserScript==
// @name          Tracking: Strip UTM Tracking
// @version       1
// @description   Remove "utm_" parameters from the query string, used by Google Analytics.
// @namespace     https://github.com/danydodson/userscripts
// @downloadURL   https://github.com/danydodson/userscripts/blob/main/src/tracking/Tracking-Strip-UTM.user.js
// @updateURL     https://github.com/danydodson/userscripts/blob/main/src/tracking/Tracking-Strip-UTM.user.js
// @match         *?*utm*
// @grant         none
// @run-at      start
// ==/UserScript==

if (document.location.search) {
  var s = document.location.search.replace(/utm_[a-z]+=(.*?)(&|$)/g, '')
  if (s == '?') s = ''
  if (s != document.location.search) {
    var h = document.location.href.replace(/\?.*/, s)
    history.replaceState({}, document.title, h)
  }
}