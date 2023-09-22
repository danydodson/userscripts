// ==UserScript==
// @name          YouTube: CPU Tamer
// @description   It just reduces CPU usage on YouTube.
// @author        Nonce
// @version       1.2.0
// @license       MIT
// @namespace     Nonce Scripts
// @downloadURL   https://github.com/danydodson/userscripts/raw/main/src/youtube/YouTube-CPU-Tamer.user.js
// @updateURL     https://github.com/danydodson/userscripts/raw/main/src/youtube/YouTube-CPU-Tamer.user.js
// @icon          https://www.iconpacks.net/icons/2/free-youtube-logo-icon-2431-thumb.png
// @match         https://www.youtube.com/*
// @match         https://www.youtube.com/embed/*
// @match         https://www.youtube-nocookie.com/embed/*
// @run-at        document-start

// ==/UserScript==

/*
[update]
  Improved compatibility and fix the bug of not working properly.
[possible]
  Is it necessary not to delete the spacha element if you handle the interval or RequestanimationFrame well?
  Should I do it with a Live script or should I do it here?In any case, unification may be possible.
[memo]
  interval
    interval All are executed in one function to reduce the instance itself.
    For front tabs, reduce the frequency every 250ms.
    The back tab is frequently reduced every 15 seconds.
  timeout
    Execute as it is because the front tab may be involved in user interaction.
    If it is a back tab interval It will be entrusted to the next process.(15 seconds every time until the front tab)
      Back tab clearInterval Ignore it to avoid complexity, even if it is.
      However, only 10 seconds after the initial loading, execute the back tab as it is.
@grant
  @grant none         No Tamer effecteffect Normal on the back
  @grant none         Tamer effect Chrome  It does not start occasionally on the back, and it will not be drawn even if playback starts!
    I would like to go with this if possible, so I will try and error.
    Try to start normal only for the first 10 seconds,Loosen 15 seconds
    more Please note that we are testing and testing other scripts in
    the first place. If you don't have a new tab instead of a reload,
    maybe you won't reproduce it, especially when there is a commercial?
  @grant none         Tamer effect Firefox It does not start on the back occasionally, but will it be drawn when it starts playing?
  @grant unsafeWindow Tamer effect Chrome  It does not start on the back occasionally, but will it be drawn when it starts playing?
  @grant unsafeWindow Tamer effect Firefox Normal
*/

(function () {
  const SCRIPTID = 'YouTube: Cpu Tamer'
  // console.log(SCRIPTID, location.href)
  const BUNDLEDINTERVAL = 250 /* the bundled interval */
  const BACKGROUNDINTERVAL = 15 * 1000 /* take even longer interval on hidden tab */
  const ITIALIZINGTIME = 10 * 1000 /* timeouts should be passed on initial load */
  //
  // [interval]
  // integrate each of intervals
  // bundle intervals
  const originalSetInterval = window.setInterval.bind(window)
  window.setInterval = function (f, interval, ...args) {
    // console.log(SCRIPTID, 'original interval:', interval, location.href)
    bundle[index] = {
      f: f.bind(null, ...args),
      interval: interval,
      lastExecution: 0,
    }
    return index++
  }
  window.clearInterval = function (id) {
    // console.log(SCRIPTID, 'clearInterval:', id, location.href)
    delete bundle[id]
  }
  //
  // [timeout]
  // kill the background timeouts after initializing
  const originalSetTimeout = window.setTimeout.bind(window)
  originalSetTimeout(() => {
    window.setTimeout = function (f, timeout, ...args) {
      // console.log(SCRIPTID, 'timeout:', timeout, location.href)
      if (document.hidden) {
        bundle[index] = {
          f: f.bind(null, ...args),
          timeout: timeout,
          lastExecution: 0,
        }
        return index++
      }
      return originalSetTimeout(f, timeout, ...args)
    }
  }, ITIALIZINGTIME)
  //
  // [bundled process]
  // execute bundled intervals
  // a bunch of intervals does cost so much even if the processes do nothing
  const bundle = {} /* {0: {f, interval, lastExecution}} */
  let index = 1 /* use it instead of interval id */
  let lastExecution = 0
  originalSetInterval(function () {
    const now = Date.now()
    if (document.hidden && now < lastExecution + BACKGROUNDINTERVAL) return true
    // console.log(SCRIPTID, 'bundle:', bundle, location.href)
    Object.keys(bundle).forEach(id => {
      const item = bundle[id]
      if (item === undefined) return true /* it could be occur on tiny deletion chance */
      if (now < item.lastExecution + (item.interval || item.timeout)) return true /* not yet */
      item.f()
      if (item.interval !== undefined) item.lastExecution = now
      else delete bundle[id]
    })
    lastExecution = now
  }, BUNDLEDINTERVAL)
})()