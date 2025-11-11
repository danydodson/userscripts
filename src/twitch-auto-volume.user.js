// ==UserScript==
// @name         Twitch Auto Volume
// @namespace    http://twitch.tv/
// @version      0.1
// @description  Auto set volume for twitch.
// @author       Vasya
// @match        https://www.twitch.tv/*
// @icon         https://icons.duckduckgo.com/ip2/twitch.tv.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        unsafeWindow
// @grant        GM_log
// @grant        window.onurlchange
// ==/UserScript==

(function () {
  'use strict';

  function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    var startTimeInMs = Date.now();
    (function loopSearch() {
      if (document.querySelector(selector) != null) {
        callback();
        return;
      }
      else {
        setTimeout(function () {
          if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs) {
            return;
          }
          loopSearch();
        }, checkFrequencyInMs);
      }
    })();
  }


  let user = unsafeWindow.location.pathname.slice(1);

  const sliderSelector = '.tw-range';

  function getSavedVolumes() {
    return GM_getValue("volumes", {});
  }

  function getUserSavedVolume() {
    const volumes = getSavedVolumes();
    return volumes[user];
  }

  function saveUserVolume(volume) {
    const volumes = getSavedVolumes();
    volumes[user] = volume;
    GM_setValue("volumes", volumes);
  }

  function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
      prototypeValueSetter.call(element, value);
    } else {
      valueSetter.call(element, value);
    }
  }

  function setCurrentVolume(v) {
    function doSet() {
      GM_log("Slider found");
      let input = document.querySelector(sliderSelector);
      setNativeValue(input, v);
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    waitForElementToDisplay(sliderSelector, doSet, 200, 2000);
  }

  function onNewUser() {

    GM_log(user);

    let savedVolume = getUserSavedVolume();
    if (savedVolume) {
      GM_log("saved volume", savedVolume);

      let currentVolume = unsafeWindow.localStorage.getItem('volume');

      GM_log("current volume", currentVolume);
      if (currentVolume !== savedVolume) {
        GM_log("setting volume", savedVolume);

        setCurrentVolume(savedVolume);
      }

    }
  }


  function onUrlChange(info) {
    GM_log("urlch", info);
    if (info) {
      let url = new URL(info.url);
      user = url.pathname.slice(1);
    };
    onNewUser();
  }


  if (window.onurlchange === null) {
    // feature is supported
    GM_log("onurlchange init");
    window.addEventListener('urlchange', onUrlChange);
  }

  onNewUser();

  function subscribeToVolumeSlider() {
    let input = document.querySelector(sliderSelector);

    input.addEventListener('change', function (event) {
      let v = event.target.value;
      GM_log("current volume", v);
      let savedVolume = getUserSavedVolume();
      if (getUserSavedVolume() !== v) {
        GM_log("saving volume", v);
        saveUserVolume(v);
      }
    });

  }

  waitForElementToDisplay(sliderSelector, subscribeToVolumeSlider, 200, 2000);
})();