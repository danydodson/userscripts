// ==UserScript==
// @name             OCH: Highlight links
// @namespace        cuzi
// @license          MIT
// @description      Link Checker. Hit escape to check whether one-click hoster links are online or offline. Press Esc + Shift to remove offline links
// @icon             https://raw.githubusercontent.com/cvzi/Userscripts/master/Multi-OCH/icons/och.png
// @contributionURL  https://buymeacoff.ee/cuzi
// @contributionURL  https://ko-fi.com/cuzicvzi
// @compatible       firefox Greasemonkey
// @compatible       chrome Tampermonkey. Allow all domains on first run.
// @homepageURL      https://openuserjs.org/scripts/cuzi/Highlight_OCH_links
// @updateURL        https://openuserjs.org/meta/cuzi/Highlight_OCH_links.meta.js
// @require          https://greasyfork.org/scripts/370011-requestqueue/code/RequestQueue.js
// @require          https://greasyfork.org/scripts/25445-och-list/code/OCH%20List.js
// @grant            GM_xmlhttpRequest
// @grant            GM.xmlHttpRequest
// @grant            GM.registerMenuCommand
// @connect          *
// @version          23.8
// @match            *://*/*
// @exclude          *.yahoo.*
// @exclude          *.google.*
// @exclude          *.youtube.*
// @exclude          *.bing.com*
// @exclude          *yandex.com*
// @exclude          *duckduckgo.com*
// ==/UserScript==

/* globals RequestQueue, getOCH, NodeFilter, GM */

(function () {
  'use strict'

  // Maximal number of links that are checked (per website)
  const MAXREQUESTS = 1000

  // Maximal number of links that are checked in parallel (per website)
  const MAXPARALLELCONNECTIONS = 16

  // Maximal number of DOM nodes that are examined. Decrease this number on slow machines.
  const MAXTEXTNODES = 10000

  // Maximum download size per link (in KB). If you have activated direct downloads, the script will try to download the whole file instead of checking the link. This limit prevents this.
  const MAXDOWNLOADSIZE = 2000 // kilobytes

  /*
// Export
var mypatterns = [];
var mynames = [];
var myurls = [];
for(var key in OCH) {
  var o = OCH[key];
  if((""+o.check).length > 30) { // If check function implemented
    mypatterns.push(o.pattern.toString());
    mynames.push("'"+key+"'");
    myurls.push(" - ["+o.title+"]("+o.homepage+")");
  }
}

alert(mypatterns.join(",\n"));
alert(mynames.join(",\n"));
alert(myurls.join("\n"));
*/

  let links = [] // [  { hoster: "", url: "", element: DOMNode} , ...   ]
  let deleteOfflineLinks = false
  const rq = new RequestQueue(MAXPARALLELCONNECTIONS, MAXREQUESTS)

  // Get OCH list
  const OCH = getOCH(rq, MAXDOWNLOADSIZE)

  function linkOffline(link) {
    link.element.style.backgroundColor = 'rgba(255, 0, 20, 0.5)'
    link.element.dataset.linkValidatedAs = 'offline'
    if (deleteOfflineLinks) {
      link.element.remove()
    }
  }
  function linkOnline(link) {
    link.element.style.backgroundColor = 'rgba(70, 255 ,0, 0.5)'
    link.element.dataset.linkValidatedAs = 'online'
  }
  function linkWaiting(link) {
    link.element.classList.add('ochlink713')
    link.element.style.backgroundColor = 'rgba(255, 150, 80, 0.4)'
  }

  function handleResult(link, result, errorstring) {
    if (result === 1) {
      linkOnline(link)
    } else if (result === 0) {
      linkOffline(link)
    } else if (result === -1) {
      link.element.style.backgroundColor = 'blue'
      link.element.title = errorstring
      console.log(errorstring)
    } else {
      console.log('handleResult(link,result,errorstring) wrong resultcode: ' + result)
    }
  }

  function matchHoster(str) {
    // Return name of first hoster that matches, otherwise return false
    for (const name in OCH) {
      for (let i = 0; i < OCH[name].pattern.length; i++) {
        if (OCH[name].pattern[i].test(str)) {
          return name
        }
      }
    }
    return false
  }

  let stylesheetAdded = false
  function addStylesheet() {
    if (stylesheetAdded) {
      return
    }
    document.head.appendChild(document.createElement('style')).innerHTML = `
      .ochlink713 {
        transition: background-color 700ms;
      }
    `
    stylesheetAdded = true
  }

  function findLinks() {
    addStylesheet()

    links = []

    // Normalize hoster object: Replace single patterns with arrays [RegExp]
    for (const name in OCH) {
      if (!Array.isArray(OCH[name].pattern)) {
        OCH[name].pattern = [OCH[name].pattern]
      }
    }

    // Find all text nodes that contain "http://"
    const nodes = []
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (node.parentNode.href || node.parentNode.parentNode.href || node.parentNode.parentNode.parentNode.href) { return NodeFilter.FILTER_REJECT }
        if (node.parentNode.tagName === 'TEXTAREA' || node.parentNode.parentNode.tagName === 'TEXTAREA') { return NodeFilter.FILTER_REJECT }
        if (node.data.match(/(\s|^)https?:\/\/\w+/)) { return NodeFilter.FILTER_ACCEPT }
      }
    }, false)
    let node = walk.nextNode()
    while (node) {
      nodes.push(node)
      node = walk.nextNode()
    }

    // For each found text nodes check whether the URL is a valid OCH URL
    for (let i = 0; i < nodes.length && i < MAXTEXTNODES; i++) {
      if (nodes[i].data === '') {
        continue
      }
      const httpPosition = nodes[i].data.indexOf('http')
      if (httpPosition === -1) {
        continue
      }

      let urlnode
      if (httpPosition > 0) {
        urlnode = nodes[i].splitText(httpPosition) // Split leading text
      } else {
        urlnode = nodes[i]
      }
      const stop = urlnode.data.match(/$|\s/)[0] // Find end of URL
      if (stop !== '') { // If empty string, we found $ end of string
        const nextnode = urlnode.splitText(urlnode.data.indexOf(stop)) // Split trailing text
        if (nextnode.data !== '' && nextnode.data.indexOf('http') !== -1) { // The trailing text might contain another URL
          nodes.push(nextnode)
        }
      }

      // Check whether the URL is a OCH. If so, create an <a> element
      const url = urlnode.data
      const mh = matchHoster(url)
      if (mh !== false) {
        const a = document.createElement('a')
        a.href = url
        a.appendChild(urlnode.parentNode.replaceChild(a, urlnode))
        links.push({
          hoster: mh,
          url: url,
          element: a
        })
      }
    }

    // Find actual <a> links
    const deleteNodes = []
    const al = document.getElementsByTagName('a')
    for (let i = 0; i < al.length; i++) {
      if (al[i].dataset.linkValidatedAs) {
        if (deleteOfflineLinks && al[i].dataset.linkValidatedAs === 'offline') {
          deleteNodes.push(al[i])
        }
        continue // Link was already checked
      }
      const mH = matchHoster(al[i].href)
      if (mH !== false) {
        links.push({
          hoster: mH,
          url: al[i].href,
          element: al[i]
        })
      }
    }

    deleteNodes.forEach(e => e.remove())

    return links.length
  }

  function checkLinks() {
    // Check all links by calling the hoster's check function
    for (let i = 0; i < links.length; i++) {
      if (links[i] && OCH[links[i].hoster].check && typeof (OCH[links[i].hoster].check) === 'function') {
        linkWaiting(links[i])
        OCH[links[i].hoster].check(links[i], handleResult)
      }
    }
  }

  function toggleCheck() {
    if (!rq.hasRunning()) {
      // Highlight links and check them
      rq.resetTotal()
      const n = findLinks()
      if (n > 0) {
        checkLinks()
      }
    } else {
      // Abort all requests
      rq.abort()
    }
  }

  document.addEventListener('keydown', function (ev) {
    if (ev.keyCode === 27) {
      deleteOfflineLinks = ev.shiftKey
      toggleCheck()
    }
  }, false)

  // Manual check from menu
  GM.registerMenuCommand('Check links', function () {
    toggleCheck()
  })

  // Manual check from menu
  GM.registerMenuCommand('Remove offline links', function () {
    deleteOfflineLinks = true
    toggleCheck()
  })
})()
