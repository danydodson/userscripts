// ==UserScript==
// @name         Search Shortcut
// @namespace    -
// @version      1.0.0
// @license      GPL-3.0-or-later
// @description  show options for search request where you can choose your favorite site search engine.
// @author       NotYou
// @icon         https://images.vexels.com/media/users/3/132069/isolated/preview/8c320ef393a9b5be57263a1d67e2010b-search-icon-bubble-infographic.png
// @include      https://milkie.cc/*
// @include      https://www.torrentmac.net/*
// @include      https://nmac.to/*
// @include      https://macappstre.com/*
// @include      https://bt4gprx.com/*
// @include      https://x1337x.cc/*
// @include      https://www.torrentleech.org/*
// @include      https://rargb.to/*
// @include      https://www.limetorrents.fun/*
// @include      https://thepiratebay.org/*
// @include      https://www.torrentdownloads.pro/*
// @grant        none
// ==/UserScript==

(function () {
  const COLUMNS = '3'; // Amout of columns
  const FAVICON = 'duckduckgo'; // You can also choose 'duckduckgo' instead of 'google'
  const CUSTOM_ENGINES = [
    {
      name: '', // site name that will be displayed
      searchUrl: 'https://sitename.com/?search=%s', // place search url here and replace your search request with "%s" (without quotes)
      fixed: true, // write here "true" (without quotes) if navigation bar is always visible (fixed at screen), otherwise "false" (without quotes)
      isExample: true, // do not include this property in your custom engine
    },
  ];

  let _engines = [
    {
      name: 'Milkie',
      searchUrl: 'https://milkie.cc/browse?query=%s',
      input: '#searchInput',
      fixed: true,
    },
    {
      name: 'TorrentMac',
      searchUrl: 'https://www.torrentmac.net/?s=%s',
      input: '#s',
      fixed: true,
    },
    {
      name: 'nMac',
      searchUrl: 'https://nmac.to/?s=%s',
      input: '[name="s"]',
      fixed: true,
    },
    {
      name: 'MacApps',
      searchUrl: 'https://macappstre.com/?s=%s',
      input: '#sbinput',
      fixed: true,
    },
    {
      name: 'BT4G',
      searchUrl: 'https://bt4gprx.com/search?q=%s',
      input: '#search',
      fixed: true,
    },
    {
      name: 'x1337x',
      searchUrl: 'https://x1337x.cc/search/%s/1/',
      input: '#autocomplete',
      fixed: true,
    },
    {
      name: 'TorrentLeech',
      searchUrl: 'https://www.torrentleech.org/torrents/browse/index/query/%s',
      input: 'input .tl-search',
      fixed: true,
    },
    {
      name: 'Rargb',
      searchUrl: 'https://rargb.to/search/?search=%s',
      input: '#searchinput',
      fixed: true,
    },
    {
      name: 'LimeTorrents',
      searchUrl: 'https://www.limetorrents.fun/search/all/%s/',
      input: '[name="q"]',
      fixed: true,
    },
    {
      name: 'ThePirateBay',
      searchUrl: 'https://thepiratebay.org/search.php?q=%s',
      input: '[name="q"]',
      fixed: true,
    },
    {
      name: 'TorrentDownloads',
      searchUrl: 'https://www.torrentdownloads.pro/search/?search=%s',
      input: '[name="search"]',
      fixed: true,
    },
    // {
    //   name: '',
    //   searchUrl: '',
    //   input: '',
    //   fixed: true,
    // },
  ];

  let engines = {};
  let inputSelector = 'form :where([name="q"], [name="search"], [name="query"], [type="search"], [class*="search"], [id*="search"], #q, #query, #searchInput), form[action*="search"] input:not([type="submit"])';

  _engines.forEach(e => {
    e = Object.assign(e, {
      domain: getDomain(e.searchUrl),
      fixed: e.fixed ? true : false
    });
    engines[e.domain] = e;
  });

  CUSTOM_ENGINES.forEach(e => {
    e = Object.assign(e, {
      domain: getDomain(e.searchUrl),
      fixed: e.fixed ? true : false,
      input: inputSelector,
    });
    engines[e.domain] = e;
  });

  let engine = engines[getDomain()];

  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    _init();
  } else {
    document.addEventListener('readystatechange', _init);
  }

  function _init() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      if (typeof engine !== 'undefined') {
        let colors = getAccentColors();
        let css = /*css*/`
          :root {
            --pms-bg: ${colors.bg};
            --pms-fg: ${colors.fg};
            --pms-text: ${colors.text};
          }
          #multiSearch {
            position: ${engine.fixed ? 'fixed' : 'absolute'};
            padding: 10px;
            z-index: 2147483647;
            background-color: var(--pms-bg);
            border-radius: 8px;
            opacity: 0;
            pointer-events: none;
            transition: .3s;
            border: 1px solid rgb(0, 0, 0);
            box-sizing: content-box;
            display: grid;
            grid-template-columns: ${'auto '.repeat(COLUMNS ? +COLUMNS || COLUMNS.toString().length : 3)};
          }
          #multiSearch.active {
            opacity: 1;
            pointer-events: auto;
          }
          #multiSearch::before {
            content: '';
            width: 10px;
            height: 10px;
            display: block;
            position: absolute;
            top: -5px;
            left: calc(50% - 5px);
            rotate: -45deg;
            background: var(--pms-bg);
            border-right: 1px solid rgb(0, 0, 0);
            border-top: 1px solid rgb(0, 0, 0);
          }
          #multiSearch:hover {
            opacity: 1;
            pointer-events: auto;
          }
          #multiSearch div {
            padding: 5px;
            margin: 3px;
            align-items: center;
            display: flex;
            cursor: pointer;
            border-radius: 10px;
            transition: .3s;
          }
          #multiSearch div:hover {
            background-color: var(--pms-fg);
          }
          #multiSearch img {
            width: 32px;
            height: 32px;
            border-radius: 2px;
          }
          #multiSearch span {
            margin-left: 5px;
            color: var(--pms-text);
          }`
          .replace(';', ' !important;');
        document.head.insertAdjacentHTML('beforeend', `<style>${css.trim().replace(/\s\s/g, '')}</style>`);
        init();
      }
      document.removeEventListener('readystatechange', _init, false);
    }
  }

  function init() {
    let input = document.querySelector(engine.input) || document.querySelector(inputSelector);
    let fav = FAVICON ? FAVICON.toLowerCase() : 'google';

    let html = /*html*/`
      <div id="multiSearch" style="height: 0;">
        ${_engines.concat(CUSTOM_ENGINES).map(e => e.domain === getDomain() || e.isExample
      ? ''
      : /*html*/`
            <div data-search="${e.searchUrl}">
              <img src="${getDomainIcon(e.domain)[fav]}" alt="${e.domain}">
              <span>${e.name}</span>
           </div>`
    ).join('')}
      </div>
    `;
    let timeout;
    let timeoutExit;

    document.body.insertAdjacentHTML('beforeend', html);

    let multiSearch = document.querySelector('#multiSearch');

    window.addEventListener('resize', setPosition);

    input.addEventListener('mouseenter', onMouseEnter);
    input.addEventListener('mouseout', onMouseOut);
    input.addEventListener('input', onMouseOut);
    multiSearch.addEventListener('mouseout', onMouseOut);

    multiSearch.addEventListener('click', e => {
      let t = e.target;
      t = t.tagName.toLowerCase() !== 'div'
        ? t.parentNode
        : t.id === 'multiSearch'
          ? t.firstElementChild
          : t;

      if (t.dataset.search) {
        search(t);
      }
    });

    function getQuery() {
      return input.value || new URLSearchParams(location.search).get(engine.param) || '';
    }

    function search(target) {
      let v = getQuery();

      v = target.dataset.search.replace('%s', v);

      open(v);
    }

    function open(url) {
      let a = document.createElement('a');
      a.target = '_blank';
      a.href = url;
      a.click();
    }

    function onMouseEnter() {
      clearTimeout(timeoutExit);
      timeout = setTimeout(setPosition, 1e3);
      multiSearch.className = 'active';
    }

    function onMouseOut() {
      timeoutExit = setTimeout(hide, 200);
    }

    function setPosition() {
      let bcr = input.getBoundingClientRect();

      multiSearch.style.cssText = `
        left: ${bcr.width / 2 + bcr.left - multiSearch.offsetWidth / 2}px;
        top: ${bcr.top + bcr.height + 10}px;
      `;
    }

    function hide() {
      clearTimeout(timeout);
      multiSearch.className = '';
    }
  }

  function getAccentColors() {
    let _bg = getBg(document.body);
    let __bg = getBg(document.documentElement);

    let bg = isTransparent(_bg)
      ? isTransparent(__bg)
        ? 'rgb(255, 255, 255)'
        : __bg
      : _bg;

    let fg = 'rgb(' + bg.slice(4, -1).split(', ').map(e => e > 128 ? e - 30 : +e + 30) + ')';
    let text = reverseRgb(bg);

    return {
      bg,
      fg,
      text
    };

    function getBg(el) {
      return window.getComputedStyle(el).backgroundColor;
    }

    function isTransparent(color) {
      return color === 'transparent' || color === 'rgba(0, 0, 0, 0)' || color === '#0000';
    }

    function reverseRgb(rgb) {
      return 'rgb(' + rgb.slice(4, -1).split(', ').map(e => 255 - e).join(',') + ')';
    }
  }

  function getDomainIcon(domain) {
    return {
      duckduckgo: `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      google: `https://www.google.com/s2/favicons?domain=${domain}&sz=256`,
    };
  }

  function getDomain(url = location.href) {
    return new URL(url).host;
  }
})()







































