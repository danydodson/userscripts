// ==UserScript==
// @name          All: Password Hover
// @namespace     All: Password On Hover
// @description	  Show password when mouseover on password field
// @author        LouCypher
// @match         *
// @version       0.0.1
// @icon          https://i.ibb.co/8gKMGvZ/monkey.png
// ==/UserScript==

window.setTimeout(function () {
	var passFields = document.querySelectorAll("input[type='password']")
	if (!passFields.length) return
	for (var i = 0; i < passFields.length; i++) {
		passFields[i].addEventListener("mouseover", function () {
			this.type = "text"
		}, false)
		passFields[i].addEventListener("mouseout", function () {
			this.type = "password"
		}, false)
	}
}, 1000)