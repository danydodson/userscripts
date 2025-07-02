// ==UserScript==
// @name         Github: Hide Bots & Actions
// @description  Minimizes pushs and commits from github actions and bots from github.com dashboard
// @namespace    https://egore.url.lol/userscripts
// @author       cuzi
// @version      1.8
// @copyright    2020, cuzi (https://openuserjs.org/users/cuzi)
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACEUExURUxpcRgWFhsYGBgWFhcWFh8WFhoYGBgWFiUlJRcVFRkWFhgVFRgWFhgVFRsWFhgWFigeHhkWFv////////////r6+h4eHv///xcVFfLx8SMhIUNCQpSTk/r6+jY0NCknJ97e3ru7u+fn51BOTsPCwqGgoISDg6empmpoaK2srNDQ0FhXV3eXcCcAAAAXdFJOUwCBIZXMGP70BuRH2Ze/LpIMUunHkpQR34sfygAAAVpJREFUOMt1U+magjAMDAVb5BDU3W25b9T1/d9vaYpQKDs/rF9nSNJkArDA9ezQZ8wPbc8FE6eAiQUsOO1o19JolFibKCdHGHC0IJezOMD5snx/yE+KOYYr42fPSufSZyazqDoseTPw4lGJNOu6LBXVUPBG3lqYAOv/5ZwnNUfUifzBt8gkgfgINmjxOpgqUA147QWNaocLniqq3QsSVbQHNp45N/BAwoYQz9oUJEiE4GMGfoBSMj5gjeWRIMMqleD/CAzUHFqTLyjOA5zjNnwa4UCEZ2YK3khEcBXHjVBtEFeIZ6+NxYbPqWp1DLKV42t6Ujn2ydyiPi9nX0TTNAkVVZ/gozsl6FbrktkwaVvL2TRK0C8Ca7Hck7f5OBT6FFbLATkL2ugV0tm0RLM9fedDvhWstl8Wp9AFDjFX7yOY/lJrv8AkYuz7fuP8dv9izCYH+x3/LBnj9fYPBTpJDNzX+7cAAAAASUVORK5CYII=
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
