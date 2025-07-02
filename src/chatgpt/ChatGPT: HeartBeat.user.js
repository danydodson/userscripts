// ==UserScript==
// @name         ChatGPT: HeartBeat
// @namespace   https://egore.url.lol/userscripts
// @version      0.2.6
// @license      GPLv3
// @description  USE AT YOUR OWN RISK!
// @author       https://v2ex.com/t/926890
// @homepage     https://v2ex.com/t/926890
// @homepageURL  https://v2ex.com/t/926890
// @match        https://chat.openai.com
// @match        https://chat.openai.com/*
// @icon         https://raw.githubusercontent.com/madkarmaa/automatic-chatgpt-dan/master/images/icon.png
// @require      https://greasyfork.org/scripts/395037-monkeyconfig-modern/code/MonkeyConfig%20Modern.js?version=764968
// @run-at       document-start
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_addStyle
// ==/UserScript==

/*
  需要保持非常久的，可以额外尝试在 chrome://discards 里禁用 `Auto Discardable`，
  或者用 https://github.com/WorldLanguages/DoNotDiscard
  否则就算保持了 Cookies 有效，Chrome 也有可能自动休眠标签页。
*/

/*
  从原理上来说，这个刷新针对的是静态资源，由 Cloudflare 负责处理，是不会回源到 OpenAI 的。
  所以比起请求 https://chat.openai.com/api/auth/session ，我认为这个方案更不容易被封号。
*/
(function () {
    function isWindow(obj) {
        return obj instanceof Window;
    }

    // 防止页面通过监听事件强制刷新
    // https://gist.github.com/fuzmish/bd444b1aadc2d22aada7c9b1a6de56ba
    const rawAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (...args) {
        const [eventName] = args;
        if (
            isWindow(this) &&
            ["focus", "focusin", "visibilitychange"].includes(eventName)
        ) {
            return;
        }
        return rawAddEventListener.apply(this, args);
    };

    const cfg = new MonkeyConfig({
        title: "Configuration",
        menuCommand: true,
        params: {
            refreshInterval: {
                type: "number",
                default: 30,
            },
            refreshURL: {
                type: "text",
                default:
                "https://chat.openai.com/_next/static/k9OKjvwgjWES7JT3k-6g9/_ssgManifest.js",
            },
        },
    });

    function getRefreshURL () {
        var refreshURL = cfg.get("refreshURL");
        // 如果手动配置了 _ssgManifest.js 以外的 URL，就不尝试获取最新的
        if (!refreshURL.endsWith("_ssgManifest.js")) {
            return refreshURL;
        }
        // 获取最新的 _ssgManifest.js 链接
        // https://v2ex.com/t/926890#r_12897849
        const manifestScript = document.querySelector(
            'script[src*="_ssgManifest.js"]'
        );
        if (manifestScript) {
            cfg.set("refreshURL", manifestScript.src);
            return manifestScript.src;
        }
        return refreshURL;
    };

    const heartbeat = document.createElement("iframe");
    heartbeat.style.display = "none";
    document.head.prepend(heartbeat);

    let count = 0;
    function refresh() {
        count = 0;
        heartbeat.src = `${getRefreshURL()}?${Date.now()}`;
    }
    setInterval(function () {
        try {
            let current = new URL(heartbeat.contentWindow.location.href);
            let expect = new URL(getRefreshURL());
            if ( heartbeat.contentWindow.location.href === '' ||
                heartbeat.contentWindow.location.href === 'about:blank' ||
                current.pathname === expect.pathname ||
                count++ * cfg.get("refreshInterval") >= 2 * 60) {
                refresh();
            }
        } catch (error) {
            // https://v2ex.com/t/926890#r_12935587
            console.error(error);
            refresh();
        }
    }, cfg.get("refreshInterval") * 1000);
})();
