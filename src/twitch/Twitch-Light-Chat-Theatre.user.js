// ==UserScript==
// @name         Twitch: Light Chat Theatre
// @namespace    Nonce Scripts
// @version      0.1
// @description  Use the preferred dark/light mode theme in theatre mode. https://techygrrrl.stream Only works when pressing Alt+T.
// @author       techygrrrl
// @match        https://*.twitch.com/*
// @match        https://*.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @grant        none
// ==/UserScript==

(function () {
  let found = false;
  let timesChecked = 0
  const MAX_TIMES_CHECKED = 200

  let desiredTheme = null
  let oppositeTheme = null

  // Check and click in milliseconds
  const CHECK_INTERVAL = 200;

  let interval;

  setTimeout(() => {
    interval = setInterval(() => {
      perform();
    }, CHECK_INTERVAL);
  }, 5000)
  

  function perform() {
    if (timesChecked > MAX_TIMES_CHECKED) {
      console.log('🌈 Retries exhausted. Stopped.')
      clearInterval(interval)
      return
    }

    timesChecked++

    if (found) return;

    let htmlElement = document.querySelector('html.tw-root--theme-light')
    
    if (htmlElement) {
      desiredTheme = 'light'
      oppositeTheme = 'dark'
    } else {
      htmlElement = document.querySelector('html.tw-root--theme-dark')
      if (htmlElement) {
        desiredTheme = 'dark'
        oppositeTheme = 'light'
      } else {
        return
      }
    }

    if (!htmlElement) {
      console.log('🌈 No class name, returning')
      return
    }

    console.log('🌈 Desired theme', desiredTheme)

    document.addEventListener('keydown', (evt) => {
      if (desiredTheme === 'dark') return
      
      if (evt.code === 'KeyT' && evt.altKey) {
        setTimeout(() => {
          console.log(`🌈 Switched theme from ${oppositeTheme} to desired theme ${desiredTheme}`)
          document.documentElement.className = document.documentElement.className.replaceAll(oppositeTheme, desiredTheme)
        }, 500)
      }
    })

    console.log('🌈 Should have successfully attached listener for Theatre Mode toggle with Alt+T')

    found = true;
  }
})();
