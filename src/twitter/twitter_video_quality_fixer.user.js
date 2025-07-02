// ==UserScript==
// @name         Twitter Video Quality Fixer
// @namespace    https://github.com/yuhaofe
// @version      0.2.1
// @icon         https://cdn.cdnlogo.com/logos/t/96/twitter-icon.svg
// @description  Force highest quality playback for X (Twitter) videos.
// @author       yuhaofe
// @match        https://x.com/*
// @match        https://mobile.x.com/*
// @match        https://twitter.com/*
// @match        https://mobile.twitter.com/*
// @grant        none
// @downloadURL  https://update.greasyfork.org/scripts/399827/Video%20Quality%20Fixer%20for%20X%20%28Twitter%29.user.js
// @updateURL    https://update.greasyfork.org/scripts/399827/Video%20Quality%20Fixer%20for%20X%20%28Twitter%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    initHijack();
    initUI();

    function initHijack() {
        var realOpen = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = hijackedOpen;

        function hijackedOpen() {
            var url = arguments['1'];
            if (isHLSPlaylist(url)) {
                this.addEventListener('readystatechange', function (e) {
                    if (this.readyState === 4) {
                        var originalText = e.target.responseText;
                        if (isMasterPlaylist(originalText)) {
                            var modifiedText = modifyMasterPlaylist(originalText);
                            Object.defineProperty(this, 'response', { writable: true });
                            Object.defineProperty(this, 'responseText', { writable: true });
                            this.response = this.responseText = modifiedText;
                        }
                    }
                });
            }
            return realOpen.apply(this, arguments);
        };

        function isHLSPlaylist(url) {
            var reg = new RegExp(/^https:\/\/video\.twimg\.com\/.+m3u8?/, 'i');
            return reg.test(url);
        }

        function isMasterPlaylist(text) {
            return text.indexOf('#EXT-X-TARGETDURATION') === -1 && text.indexOf('#EXT-X-STREAM-INF') != -1;
        }

        function modifyMasterPlaylist(text) {
            var result = text;
            var reg = new RegExp(/^#EXT-X-STREAM-INF:.*BANDWIDTH=(\d+).*\r?\n.*$/, 'gm');
            var stream = reg.exec(text);
            if (stream) {
                var globalTags = text.substring(0, stream.index);

                // find max bitrate media playlist
                var maxBitrateStream = stream;
                while ((stream = reg.exec(text)) != null) {
                    if (parseInt(stream[1]) > parseInt(maxBitrateStream[1])) {
                        maxBitrateStream = stream;
                    }
                }

                result = globalTags + maxBitrateStream[0];
            }
            return result;
        }
    }

    function initUI() {
        // add a mark helps identify if userscript loaded successfully
        var disableHQ = localStorage.getItem('vqfft-disablehq');
        if (!disableHQ) {
            var mark = document.createElement('button');
            mark.innerText = 'HQ';
            mark.style = "position: fixed;right: 5px;top: 5px;color: white;border-width: 0px;border-radius: 5px;background-color: gray;opacity: 0.5;";
            mark.onclick = function () {
                if (confirm('Do not display HQ mark anymore?')) {
                    localStorage.setItem('vqfft-disablehq', 'true');
                    mark.remove();
                }
            };
            document.body.appendChild(mark);
        }
    }
})();

