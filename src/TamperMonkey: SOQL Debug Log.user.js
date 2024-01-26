// ==UserScript==
// @name         TamperMonkey: SOQL Debug Log
// @description  try to take over the world!
// @author       You
// @version      0.1
// @namespace    https://egore.url.lol/userscripts
// @icon         https://www.tampermonkey.net/favicon.ico
// @match        http://tampermonkey.net/index.php?version=4.0.69&ext=dhdg&updated=true#features
// @grant        none

// ==/UserScript==

(function () {
	'use strict'
	//var re = /^.*Aggregations:\d\|/gm;
	var re = /SELECT.*\n/gm
	var str = document.getElementsByClassName('codeBlock')[0].innerHTML
	document.getElementsByClassName('codeBlock')[0].innerHTML = str.match(re).join("")
	// console.log(myArray)
})();

