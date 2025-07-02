// ==UserScript==
// @name         Google: Scan Censored Items
// @description  Google Unlocked scans hidden search results that were censored by Google due to complaints
// @author       Ibit - The Best Torrents
// @version      1.6
// @license      MIT License
// @namespace    https://egore.url.lol/userscripts
// @icon         https://www.google.com/favicon.ico
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @match        *.google.com/*
// @grant        GM_xmlhttpRequest
// @noframes
// ==/UserScript==

/* eslint-env browser, es6, greasemonkey, jquery */

$(function () {
  if (window.location.href.indexOf('//www.google') === -1) return

  $('#search div.g').last().after(`
    <div id="cc">
      <div id="cc_loading" style="display: inline-flex;align-items: center;"></div>
      <h2 id="cc_timeouts" style="color:orange"></h2>
      <h2 id="cc_errors" style="color:red"></h2>
    </div>
  `)
  const s = $('#cc')
  const loadingElement = $('#cc_loading')
  const timeoutsElement = $('#cc_timeouts')
  const errorsElement = $('#cc_errors')

  let firstRun = true
  let totalFetchs = 0
  $('div i > a').each((i, a) => {
    if (a.href === 'https://www.google.com/support/answer/1386831') return

    totalFetchs++

    // Give a loading feedback to user
    firstRun && loadingElement.prepend(`
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
        <path fill="#4285f4" d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z">
          <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/>
        </path>
      </svg>
      <h2>Loading uncensored links...</h2>
    `)

    firstRun = false

    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: a.href,
        timeout: 30000, // In milliseconds. If your connection is slow I'll suggest you to increase the time or just comment this line.
        onload: (response) => {
          if (response.status === 429) {
            console.error('ERROR 429 Too Many Requests')
            errorsElement.html('ERROR 429 Too Many Requests')
            reject()
            return
          }
          let hm = {}
          const links = response.responseText.matchAll(/class="infringing_url">([^\s-<]+)\s*-\s*([0-9]+)/g)

          for (const i of links) {
            if (i[1] in hm) continue

            hm[i[1]] = 1
            let l = $('#l' + i[2])
            if (l.length < 1) {
              s.prepend(`<div id="l${i[2]}" data-num="${i[2]}"></div>`)
              l = $('#l' + i[2])
            }
            l.append(`
              <div class="g">
                <a href="http://${i[1]}" target="_blank">${i[1]} (${i[2]} URLs)</a>
              </div>
            `)
          }
          const divs = $('div[data-num]', s)
          divs.sort((a, b) => b.dataset.num - a.dataset.num)
          s.append(divs)
          resolve()
        },
        onerror: (err) => {
          console.error('Request Error!\n', err.error)
          if (!$.trim(errorsElement.html())) errorsElement.append('Error on some requests')
          reject()
        },
        ontimeout: () => {
          console.warn(`[${i}] Request timeout`)
          if (!$.trim(timeoutsElement.html())) timeoutsElement.append('Request timeouts:')
          timeoutsElement.append(' ' + i)
          reject()
        }
      })
    })
      // Cleanup
      .finally(() => {
        totalFetchs--

        if (totalFetchs > 0) return
        loadingElement.remove()
      })
      // Promise error when rejected, ignore
      .catch(e => { })
  })
})
