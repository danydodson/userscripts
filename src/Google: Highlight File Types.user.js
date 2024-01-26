// ==UserScript==
// @name         Google: Highlight File Types
// @description  Highlight file type labels in Google search results
// @author       ysnr777
// @version      0.3.1
// @license      MIT
// @namespace    https://egore.url.lol/userscripts
// @icon         https://www.google.com/favicon.ico
// @match        *.google.com/*
// @grant        none
// ==/UserScript==

const fileSettings = {
  PDF: {
    title: 'Adobe Portable Document Format (.pdf)',
    background: '#FDE3E4',
    color: '#EC1C24',
    iconSlug: 'adobeacrobatreader',
  },
  TORRENT: {
    title: 'Torrent File (.torrent)',
    background: '#FDE3E4',
    color: '#d8b100',
    iconSlug: 'transmission',
  },
  XLS: {
    title: 'Microsoft Excel (.xls, .xlsx)',
    background: '#E9F9F0',
    color: '#217346',
    iconSlug: 'microsoftexcel',
  },
  DOC: {
    title: 'Microsoft Word (.doc, .docx)',
    background: '#E1EAF7',
    color: '#2B579A',
    iconSlug: 'microsoftword',
  },
  PPT: {
    title: 'Microsoft PowerPoint (.ppt, .pptx)',
    background: '#F9EAE7',
    color: '#B7472A',
    iconSlug: 'microsoftpowerpoint',
  },
  KML: {
    title: 'Google Earth (.kml, .kmz)',
    background: '#E9F1FE',
    color: '#4285F4',
    iconSlug: 'googleearth',
  },
  default: {
    background: '#FFFF99',
    color: '#4D5156',
  },
};

(function () {
  'use strict'
  for (const el of document.querySelectorAll('span.ZGwO7.C0kchf.NaCKVc.VDgVie')) {
    const setting = fileSettings[el.textContent in fileSettings ? el.textContent : 'default']

    // style
    el.style.fontWeight = 'bold'
    el.style.backgroundColor = setting.background
    el.style.borderColor = setting.color
    el.style.color = setting.color

    // title
    if ('title' in setting) {
      el.title = setting.title
    }

    // icon
    if ('iconSlug' in setting) {
      // obtainSvgFromCdnByString
      const xhr = new XMLHttpRequest()
      xhr.open('GET', `https://cdn.jsdelivr.net/npm/simple-icons@v5/icons/${setting.iconSlug}.svg`, true)
      xhr.onload = function () {
        // convert The Acquired Svg String Into Elements And Add
        const span = document.createElement('span')
        const svg = span.appendChild(xhr.responseXML.querySelector('svg'))

        // Delete unnecessary Title elements
        svg.querySelector('title').remove()

        // style
        span.style.marginRight = '0.5em'
        svg.style.height = '1em'
        svg.style.fill = setting.color

        el.prepend(span)
      }
      xhr.send()
    }
  }
})()
