// ==UserScript==
// @name          Tracking: Skip Direct Link
// @version       0.4
// @description   Goto website not waiting for Direct Website
// @author        DungGramer
// @namespace     https://github.com/danydodson/userscripts
// @downloadURL   https://github.com/danydodson/userscripts/blob/main/src/tracking/Tracking-Skip-Direct-Link.user.js
// @updateURL     https://github.com/danydodson/userscripts/blob/main/src/tracking/Tracking-Skip-Direct-Link.user.js
// @include       /((https|http)%)/
// @include       /^(facebook|google|github|linkedin)/
// @grant         none
// @license       MIT
// ==/UserScript==

(function () {
  try {
    var newURL = window.location.href.match(/(url|href)\=http?s.+/)[0].match(/http?s.+/)[0]
    var directLink = decodeURIComponent(newURL.split(/.fbclid=\w+/).join(""))
    directLink = new URL(directLink)
    var question = window.confirm("Do you want go to: \n" + directLink)
    if (question) window.location.href = directLink
  } catch (e) { }
})()