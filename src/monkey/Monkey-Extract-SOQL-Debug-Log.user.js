// ==UserScript==
// @name         Monkey: Extract SOQL Debug Log
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://tampermonkey.net/index.php?version=4.0.69&ext=dhdg&updated=true#features
// @icon         https://www.tampermonkey.net/favicon.ico
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

