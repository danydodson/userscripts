// ==UserScript==
// @name         Twitch: Sidebar in Theater
// @name:ja      Twitch, シアターモードでサイドバー表示
// @namespace    https://egore.url.lol/userscripts
// @version      0.1.3
// @description  Display sidebar when mouseover player on theater mode
// @description:ja  シアターモードでプレイヤーへマウスオーバーしたときサイドバーを表示する
// @author       You
// @match        https://www.twitch.tv/*
// @icon         https://icons.duckduckgo.com/ip2/twitch.tv.ico
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/457632/Twitch%2C%20Display%20sidebar%20on%20theater%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/457632/Twitch%2C%20Display%20sidebar%20on%20theater%20mode.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var classNames = {
        displaySidebar: "display-sidebar-on-theater-mode"
    }

    function isTheaterMode () {
        return !!document.querySelector(".channel-root__scroll-area--theatre-mode");
    }

    function isPlayerOverlay(e, parentSearch) {
        if (!e) return false;
        if (e.classList.contains("click-handler") || e.id == "root") return true;

        if (parentSearch) {
            if (e.parentNode == document.body) {
                return false;
            }
            return isPlayerOverlay(e.parentNode, true);
        }

        return false;
    }

    function isSidebar(e, parentSearch) {
        if (!e) return false;
        if (e.classList.contains("side-nav")) return true;

        if (parentSearch) {
            if (e.parentNode == document.body) {
                return false;
            }
            return isSidebar(e.parentNode, true);
        }

        return false;
    }

    function isTopBar(e, parentSearch) {
        if (!e) return false;
        if (e.classList.contains("top-bar")) return true;

        if (parentSearch) {
            if(e.parentNode == document.body) {
                return false;
            }
            return isTopBar(e.parentNode, true);
        }

        return false;
    }

    function setVisibility(active) {
        if (active == null) {
            document.body.classList.toggle(classNames.displaySidebar);
        } else if (active) {
            document.body.classList.add(classNames.displaySidebar);
        } else {
            document.body.classList.remove(classNames.displaySidebar);
        }
    }

    var timer = -1;

    function active() {
        timer = clearTimeout(timer);
        setVisibility(true);
        timer = setTimeout(() => {
            inactive();
        }, 5000);
    }

    function inactive() {
        timer = clearTimeout(timer);
        setVisibility(false);
    }

    window.addEventListener("load", () => {
        document.addEventListener("mousemove", ev => {
           if (isPlayerOverlay(ev.target) || isSidebar(ev.target) || isTopBar(ev.target)) {
                if (isTheaterMode()) {
                    active();
                } else {
                    inactive();
                }
            }
        }, false);

        document.addEventListener("mouseout", ev => {
            if (!isPlayerOverlay(ev.toElement, true) && !isSidebar(ev.toElement, true) && !isTopBar(ev.toElement, true)) {
                inactive();
            }
        });
    });

    GM.addStyle(`
.display-sidebar-on-theater-mode [data-test-selector="side-nav"] {
    position: relative;
    z-index: 10000;
}
.display-sidebar-on-theater-mode [data-a-target="top-nav-container"] {
    height: 0 !important;
}
.display-sidebar-on-theater-mode .tw-card {
    margin-left: 5em;
}
.display-sidebar-on-theater-mode #channel-player {
    padding-left: 5em;
}
    `);
    // Your code here...
})();
