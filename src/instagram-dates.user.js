// ==UserScript==
// @name         Instagram Dates
// @namespace    http://lbreda.com/
// @version      1.4
// @description  Show an explicit date string on instagram image pages
// @author       Lorenzo Breda
// @match        https://*.instagram.com/*
// @icon         https://www.instagram.com/favicon.ico
// @grant        none
// ==/UserScript==

function modifyTimestring() {
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  var elems_date = document.getElementsByTagName("time");
  Array.prototype.forEach.call(elems_date, function (item, index) {
    var date = new Date(item.getAttribute('datetime'));
    item.textContent = date.toLocaleString(getLang(), { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
  });
}

function getLang() {
  if (navigator.languages !== undefined) {
    return navigator.languages[0];
  } else {
    return navigator.language;
  }
}

(function () {
  'use strict';

  modifyTimestring();

  var observer = new window.MutationObserver(function (mutations) {
    if (mutations.length) {
      modifyTimestring();
      Array.from(document.getElementsByTagName("time")).forEach(function (element) {
        observer.observe(element, { characterData: true, attributes: true });
      });
    }
  });
  if (document.querySelector('main > section > div > div')) {
    observer.observe(document.querySelector('main > section > div > div'), { childList: true });
  }
  observer.observe(document.body, { childList: true });
  Array.from(document.getElementsByTagName("time")).forEach(function (element) {
    observer.observe(element, { characterData: true, attributes: true });
  });
})();