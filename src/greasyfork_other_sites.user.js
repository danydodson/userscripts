// ==UserScript==
// @name         Greasy Fork Other Sites
// @namespace    https://github.com/LouCypher/userscripts
// @description  Add search option to search on Userscripts.org, OpenUserJS.org, MonkeyGuts.com (Code Remodified), Google.com(Beta;Work in progress;still functional) and Google Custom Search(Search all userscript websites with one click). Plus especially Userscripts-mirror.org(As Userscripts.org has shut down).
// @icon         https://raw.githubusercontent.com/JasonBarnabe/greasyfork/master/public/images/blacklogo512.png
// @version      5.1
// @author       HACKSCOMICON Credits:LouCypher
// @license      MIT License
// @homepageURL  https://greasyfork.org/en/scripts/9630
// @supportURL   https://greasyfork.org/en/scripts/9630/feedback
// @resource     LICENSE https://raw.githubusercontent.com/HACKSCOMICON/greasyforksearch/master/LICENSE
// @include      https://greasyfork.org/*
// @grant        none
// ==/UserScript==

function $(aSelector, aNode) {
	return (aNode || document).querySelector(aSelector);
}

function createElement(aTagName) {
	return document.createElement(aTagName);
}

function createText(aText) {
	return document.createTextNode(aText);
}

function createLink(aURL, aText, aName) {
	var link = createElement("a");
	aURL && (link.href = aURL);
	aText && (link.textContent = aText);
	aName && (link.name = aName);
	return link;
}

function addStyle(aCSS) {
	var style = createElement("style");
	style.type = "text/css";
	style.textContent = aCSS;
	if (document.head)
		document.head.appendChild(style);
	else
		document.documentElement.appendChild(style);
	return style;
}

var sites = [
	{ name: "Userscripts.org", url: "http://userscripts.org/scripts/search?q=" },
	{ name: "OpenUserJS", url: "https://openuserjs.org/?q=" },
	{ name: "MonkeyGuts", url: "https://monkeyguts.com/index.php?search=" },
	{ name: "Userscripts-mirror.org", url: "http://www.google.ro/cse?cx=006416817443944833046:kp4ssgm5w-8&ie=UTF-8&q=" },
	{ name: "Google-Beta", url: "https://www.google.ro/webhp#q=userscript%20" },
	{ name: "Google-Custom Search", url: "http://www.google.ro/cse?cx=006416817443944833046:icpbeh10o5k&ie=UTF-8&q=" }
];

function onsubmit(aEvent) {
	var searchURL;
	var query = aEvent.target.q.value;
	var site = $("#search-other-sites");
	switch (parseInt(site.value)) {
		case 6: searchURL = sites[6].url; break;
		case 5: searchURL = sites[4].url; break;
		case 4: searchURL = sites[3].url; break;
		case 3: searchURL = sites[2].url; break;
		case 2: searchURL = sites[1].url; break;
		case 1: searchURL = sites[0].url; break;
		default: searchURL = null;
	}
	if (searchURL) {
		aEvent.preventDefault();
		location.assign(searchURL + encodeURIComponent(query));
	}
}

function onchange(aEvent) {
	var input = $("#script-search").q;
	switch (parseInt(aEvent.target.value)) {
		case 6: input.placeholder = "Search " + sites[5].name; break;
		case 5: input.placeholder = "Search " + sites[4].name; break;
		case 4: input.placeholder = "Search " + sites[3].name; break;
		case 3: input.placeholder = "Search " + sites[2].name; break;
		case 2: input.placeholder = "Search " + sites[1].name; break;
		case 1: input.placeholder = "Search " + sites[0].name; break;
		default: input.placeholder = "Search";
	}
	$("#script-search input[type='submit']").title = input.placeholder;
}

var form = $("#script-search");
if (form) {
	addStyle("#search-other-sites{width:19px;direction:rtl}" +
		"#link-other-sites li{line-height:1.5em}");

	var select = form.insertBefore(createElement("select"), form.lastChild);
	select.id = "search-other-sites";
	select.title = "Search other sites";
	select.innerHTML = '<option value="0">Greasy Fork</option>'
		+ '<option value="1">' + sites[0].name + '</option>'
		+ '<option value="2">' + sites[1].name + '</option>'
		+ '<option value="3">' + sites[2].name + '</option>'
		+ '<option value="4">' + sites[3].name + '</option>'
		+ '<option value="5">' + sites[4].name + '</option>'
		+ '<option value="6">' + sites[5].name + '</option>';

	select.addEventListener("change", onchange);
	form.addEventListener("submit", onsubmit);
}

if (location.pathname === "/scripts/search") {
	var xpath = "//p[@id='script-list-sort']/following-sibling::p[text()='No scripts found.']";
	var p = document.evaluate(xpath, document, null, 9, null).singleNodeValue;
	if (p) {
		var query = $("#script-search").q.value;
		p.appendChild(createElement("br"));
		p.appendChild(createText("Search '" + query + "' on other sites:"));
		var ul = document.body.insertBefore(createElement("ul"), p.nextSibling);
		ul.id = "link-other-sites";
		var li;
		sites.forEach(function (site) {
			li = ul.appendChild(createElement("li"));
			li.appendChild(createLink(site.url + encodeURIComponent(query), site.name));
		});
	}
}
