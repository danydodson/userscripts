// ==UserScript==
// @name         Twitch: Debug Compressor
// @namespace    https://egore.url.lol/userscripts
// @version      0.1.0
// @description  try to take over the world!
// @author       You
// @match        https://www.twitch.tv/videos/*
// @icon         https://icons.duckduckgo.com/ip2/twitch.tv.ico
// @require      https://greasyfork.org/scripts/419640-onelementready/code/onElementReady.js?version=887637
// @grant        none
// ==/UserScript==
/* global onElementReady */

/**
 * print DynamicsCompressorNode debug info to console on a 1s interval
 *
 * @param {FFZHTMLVideoElement} video - html video node
 * @returns {void}
 */
function addLogging(video) {
  console.log("video element found, adding logging")
  // check every second to see if the compressor node is present
  const interval = setInterval(() => {
    const compressor = video?._ffz_compressor
    if (compressor) {
      console.log("compressor found, logging basic info once")
      console.log("threshold", compressor.threshold)
      console.log("knee", compressor.knee)
      console.log("ratio", compressor.ratio)
      console.log("attack", compressor.attack)
      console.log("release", compressor.release)

      clearInterval(interval)

      // log compressor info every second
      setInterval(() => {
        console.log("reduction", compressor.reduction)
      }, 1000)
    }
  }, 1000)

  // video.addEventListener("ended", () => {
  //   clearInterval(interval)
  // })
}

// also can be found here `ffz.__modules["site.player"].Player.instances.values().next().value.props.mediaPlayerInstance.core.mediaSinkManager.video._ffz_compressor`
onElementReady(`video`, { findOnce: true }, addLogging)
