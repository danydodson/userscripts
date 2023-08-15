// ==UserScript==
// @name         Tampermonkey: Extract SOQL Debug Log
// @version      0.1
// @description  try to take over the world!
// @author       You
// @grant        none
// @namespace    https://github.com/danydodson/userscripts
// @downloadURL  https://github.com/danydodson/userscripts/blob/main/src/tampermonkey/Tampermonkey-Extract-SOQL-Debug-Log.user.js
// @updateURL    https://github.com/danydodson/userscripts/blob/main/src/tampermonkey/Tampermonkey-Extract-SOQL-Debug-Log.user.js
// @icon         https://www.tampermonkey.net/favicon.ico
// @match        http://tampermonkey.net/index.php?version=4.0.69&ext=dhdg&updated=true#features

// ==/UserScript==

(function () {
	'use strict'
	//var re = /^.*Aggregations:\d\|/gm;
	var re = /SELECT.*\n/gm
	var str = document.getElementsByClassName('codeBlock')[0].innerHTML
	document.getElementsByClassName('codeBlock')[0].innerHTML = str.match(re).join("")
	// console.log(myArray)
})();

