// ==UserScript==
// @name        All: iframe embed Test Greasemonkey 4
// @namespace   cuzi
// @license     GPL-3.0
// @include     /^https:\/\/cvzi\.github\.io\/Userscripts\/index\.html\?link=.+/
// @include     /^https:\/\/cvzi\.github\.io\/Userscripts\/index\.html/
// ==/UserScript==

if (document.location.search) {
  alert(document.location.search)
} else {
  // Test iframe
  var iframe = document.createElement("iframe")
  iframe.src = "https://cvzi.github.io/Userscripts/index.html?iframeWorks"
  document.body.appendChild(iframe)

  // Test emebed
  var embed = document.createElement("embed")
  embed.src = "https://cvzi.github.io/Userscripts/index.html?embedWorks"
  document.body.appendChild(embed)
}
