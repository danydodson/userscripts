// ==UserScript==
// @name         Images: Reverse Image Search
// @namespace   https://egore.url.lol/userscripts
// @version      1.0.3
// @description  Search largest image on the page or current image on Google, TinEye, Yandex, SauceNAO and iqdb.org
// @author       cuzi
// @copyright    2022, cuzi (https://github.com/cvzi/)
// @license      GPL-3.0-or-later
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAV1BMVEUAAAD////29vbKysoqKioiIiKysrKhoaGTk5N9fX3z8/Pv7+/r6+vk5OTb29vOzs6Ojo5UVFQzMzMZGRkREREMDAy4uLisrKylpaV4eHhkZGRPT08/Pz/IfxjQAAAAgklEQVQoz53RRw7DIBBAUb5pxr2m3/+ckfDImwyJlL9DDzQgDIUMRu1vWOxTBdeM+onApENF0qHjpkOk2VTwLVEF40Kbfj1wK8AVu2pQA1aBBYDHJ1wy9Cf4cXD5chzNAvsAnc8TjoLAhIzsBao9w1rlVTIvkOYMd9nm6xPi168t9AYkbANdajpjcwAAAABJRU5ErkJggg==
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// ==/UserScript==

/*
    Reverse Image Search
    Search largest image on the page or current image on Google, TinEye, Yandex, SauceNAO and iqdb.org
    Copyright (C) 2022, cuzi (https://github.com/cvzi/)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

/* globals GM_openInTab, GM_registerMenuCommand */

(function () {
  'use strict'

  function onKeyDown (keyCode, cb) {
    return function (ev) {
      if (document.activeElement === document.body) {
        if (ev.ctrlKey && ev.key === keyCode) {
          ev.preventDefault()
          cb(ev)
        }
      }
    }
  }

  function getUrl () {
    if (document && document.body && document.body.firstChild.tagName === 'IMG') {
      return document.location.href
    } else {
      const biggestImage = Array.from(document.querySelectorAll('img[src^=http],img[srcset]')).filter(img => img.src.startsWith('http')).map(img => {
        return {
          img,
          size: img.clientWidth + img.clientHeight + img.naturalHeight + img.naturalWidth
        }
      }).sort((a, b) => a.size - b.size).map(o => o.img.src).pop()
      if (biggestImage) {
        return biggestImage
      }
    }
    return document.location.href
  }

  function google () {
    /* Google reverse image search */
    GM_openInTab('https://www.google.com/imghp?sbi=1#habibi=' + encodeURIComponent(getUrl()), { active: true })
  }

  function tinEye () {
    /* TinEye reverse image search */
    GM_openInTab('https://tineye.com/search?url=' + encodeURIComponent(getUrl()))
  }
  function yandex () {
    /* Yandex reverse image search */
    GM_openInTab('https://yandex.com/images/search?rpt=imageview&url=' + encodeURIComponent(getUrl()))
  }
  function sauceNAO () {
    /* SauceNAO reverse image search */
    GM_openInTab('https://saucenao.com/search.php?url=' + encodeURIComponent(getUrl()))
  }
  function iqdb () {
    /* iqdb.org reverse image search */
    GM_openInTab('http://iqdb.org/?url=' + encodeURIComponent(getUrl()))
  }

  GM_registerMenuCommand('Reverse Image Search - Google', google, 'g')
  GM_registerMenuCommand('Reverse Image Search - TinEye', tinEye, 'q')
  GM_registerMenuCommand('Reverse Image Search - Yandex', yandex, 'y')
  GM_registerMenuCommand('Reverse Image Search - SauceNAO', sauceNAO, 'x')
  GM_registerMenuCommand('Reverse Image Search - iqdb.org', iqdb, ',')

  if (document && document.body && document.body.firstChild.tagName === 'IMG') {
    document.addEventListener('keydown', onKeyDown('g', google))
    document.addEventListener('keydown', onKeyDown('q', tinEye))
    document.addEventListener('keydown', onKeyDown('y', yandex))
    document.addEventListener('keydown', onKeyDown('x', sauceNAO))
    document.addEventListener('keydown', onKeyDown(',', iqdb))
  } else if (document.location.href.startsWith('/imghp') !== -1 && document.location.hash.startsWith('#habibi=')) {
    // Enter url into Google search form
    window.setTimeout(() => {
      const button = Array.from(document.querySelectorAll('[role="button"][jscontroller]>img[src],[role="button"][jscontroller]>svg')).pop()
      if (button.click) {
        button.click()
      } else {
        button.parentElement.click()
      }
      window.setTimeout(() => {
        document.querySelector('input[text=text]').value = decodeURIComponent(document.location.hash.substring(8))
        document.querySelector('input[text=text]').nextElementSibling.click()
      }, 500)
    }, 500)
  }
})()
