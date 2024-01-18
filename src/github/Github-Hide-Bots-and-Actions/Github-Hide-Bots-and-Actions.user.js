// ==UserScript==
// @name         Github - Hide bots and github-actions from dashboards
// @description  Minimizes pushs and commits from github actions and bots from github.com dashboard
// @namespace    cuzi
// @author       cuzi
// @version      1.8
// @copyright    2020, cuzi (https://openuserjs.org/users/cuzi)
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         https://raw.githubusercontent.com/hfg-gmuend/openmoji/master/color/72x72/E045.png
// @match        https://github.com/
// @match        https://github.com/dashboard-feed
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  document.head.appendChild(document.createElement('style')).innerHTML = `
  .Details:hover .newexpanderbutton .Link--secondary {
    color: var(--color-accent-fg) !important;
  }
  `

  function unhideBot(ev) {
    const div = this
    div.classList.add('shotBot')
    div.removeEventListener('click', unhideBot)
    div.style.fontSize = ''
    if (div.querySelector('.no-border-bottom')) {
      div.querySelector('.no-border-bottom').classList.replace('no-border-bottom', 'border-bottom')
    }
    div.querySelector('.Box').style.display = ''
    if (div.querySelector('.body')) {
      div.querySelector('.body').style.height = ''
      div.querySelector('.body .d-flex').style.padding = ''
    } else {
      div.querySelector('.d-flex').style.padding = ''
    }
    div.querySelector('img.avatar').height = '32'
    div.querySelector('img.avatar').width = '32'
    div.style.cursor = ''
    if (div.querySelector('.newexpanderbutton')) {
      div.querySelector('.newexpanderbutton').remove()
    }
  }

  function hideDiv(div, summary) {
    const expandButton = document.querySelector('button.js-details-target:not(.Header-link)[aria-expanded="false"]')
    div.style.fontSize = '10px'
    if (div.querySelector('.border-bottom')) {
      div.querySelector('.border-bottom').classList.replace('border-bottom', 'no-border-bottom')
    }
    div.querySelector('.Box').style.display = 'none'
    if (div.querySelector('.body')) {
      div.querySelector('.body').style.height = '22px'
      div.querySelector('.body .d-flex').style = 'padding: 0px !important;'
    } else {
      div.querySelector('.d-flex').style = 'padding: 0px !important;'
    }
    div.querySelector('img.avatar').height = '20'
    div.querySelector('img.avatar').width = '20'
    div.style.cursor = 'row-resize'
    div.addEventListener('click', unhideBot)
    const line = div.querySelector('.Details .flex-column .flex-justify-between.flex-items-baseline')
    if (line && expandButton && !line.querySelector('button.js-details-target')) {
      const newExpandButton = document.createElement('button')
      line.appendChild(newExpandButton)
      newExpandButton.outerHTML = expandButton.outerHTML.replace('js-details-target', 'js-details-target newexpanderbutton')
    }
    const aLinkPrimary = div.querySelector('.no-underline a.Link--primary')
    if (summary && aLinkPrimary && !div.querySelector('.summaryspan')) {
      const summarySpan = document.createElement('span')
      summarySpan.classList.add('summaryspan')
      summarySpan.appendChild(document.createTextNode(summary.replace(/\s+to\s*$/, '')))
      aLinkPrimary.parentNode.appendChild(summarySpan)
    }
  }

  function hideBots() {
    // Hide single push events
    document.querySelectorAll(`
      #dashboard div.push:not(.shotBot),
      #dashboard div[classes*=push]:not(.shotBot),
      #dashboard div.body:not(.shotBot),

      [data-repository-hovercards-enabled] div.push:not(.shotBot),
      [data-repository-hovercards-enabled] div[classes*=push]:not(.shotBot),
      [data-repository-hovercards-enabled] div.body:not(.shotBot)
      `).forEach(function (div) {
      const label = div.querySelector('.body .d-flex .d-flex .Label')
      const isAppUrl = div.querySelector('.body .d-flex .d-flex a.Link--primary[href^="/apps/"]')
      if (isAppUrl || (label && label.textContent === 'bot')) {
        hideDiv(div)
      }
    })
    // Hide grouped items
    document.querySelectorAll(`
      #dashboard div.body:not(.shotBot),
      [data-repository-hovercards-enabled] div.body:not(.shotBot)
      `
    ).forEach(function (div) {
      const isAppUrl = div.querySelector('.js-news-feed-event-group .d-inline-block[href^="/apps"] .avatar')
      if (isAppUrl) {
        const summary = div.querySelector('.dashboard-rollup-item>span') ? div.querySelector('.dashboard-rollup-item>span').textContent : null
        hideDiv(div, summary)
      }
    })
  }

  hideBots()
  const iv = window.setInterval(hideBots, 200)
  window.setTimeout(() => window.clearInterval(iv), 5000)
  window.setInterval(hideBots, 5000)
})()
