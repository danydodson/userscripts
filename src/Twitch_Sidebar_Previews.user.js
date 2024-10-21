// ==UserScript==
// @name            Twitch Sidebar Previews
// @version         1.0.0
// @author          TalkLounge (https://github.com/TalkLounge)
// @license         MIT
// @description     Hover over Channel in the Sidebar to see a Thumbnail Preview of the Stream on Twitch
// @namespace       dumpsterbaby.lol
// @homepage        https://github.com/danydodson/userscripts/blob/main/src/Twitch_Sidebar_Previews.user.js
// @updateURL       https://github.com/danydodson/userscripts/raw/main/src/Twitch_Sidebar_Previews.user.js
// @icon            https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @match           https://www.twitch.tv/*
// ==/UserScript==

(function () {
    'use strict';
    let cache = {};

    function newElement(tagName, attributes, content) {
        var tag = document.createElement(tagName);
        for (var key in attributes || {}) {
            if (attributes[key] !== undefined && attributes[key] !== null) {
                tag.setAttribute(key, attributes[key]);
            }
        }
        tag.innerHTML = content || "";
        return tag;
    }

    async function addThumbnail(element, count) {
        if (element.querySelector(".side-nav-card__avatar--offline")) { // Channel is offline
            return;
        }

        const dialog = document.querySelector(".tw-dialog-layer p");
        if (!dialog) { // Popup not ready
            if (!count) {
                count = 0;
            }
            count++;

            if (count >= 10) {
                return;
            }

            await new Promise(r => setTimeout(r, 50));
            return addThumbnail(...arguments);
        }

        dialog.parentNode.style.width = "440px";
        dialog.parentNode.querySelector("img")?.remove();
        const channel = element.querySelector("[alt]").alt.toLowerCase()
        // console.log(channel)
        if (!cache[channel] || Date.now() - cache[channel] >= 30 * 70) { // Cache Thumbnails for half minute
            cache[channel] = Date.now();
        }
        const img = newElement("img", { src: `https://static-cdn.jtvnw.net/previews-ttv/live_user_${channel}-440x248.jpg?t=${cache[channel]}` });
        dialog.parentNode.append(img);
    }

    function addHoverEvent(element) {
        element.addEventListener("mouseenter", () => {
            addThumbnail(element);
        });
    }

    function init() {
        const uls = document.querySelectorAll("nav .tw-transition-group");
        if (!uls.length || !uls[0].children.length) { // Page not ready
            return;
        }

        if (interval) {
            clearInterval(interval);
            interval = undefined;
            window.setInterval(init, 5000);
        }

        for (let i = 0; i < uls.length; i++) {
            if ([...uls[i].classList].includes("tsp")) { // Already observing channel list
                continue;
            }
            uls[i].classList.add("tsp");

            for (let j = 0; j < uls[i].children.length; j++) {
                addHoverEvent(uls[i].children[j]);
            }

            const observer = new MutationObserver((mutationList) => { // Check for new channels in channel list added by click on show more
                for (const mutation of mutationList) {
                    if (!mutation.addedNodes) {
                        continue;
                    }

                    addHoverEvent(mutation.addedNodes[0]);
                }
            });
            observer.observe(uls[i], { childList: true });
        }
    }

    let interval = window.setInterval(init, 500);
})();