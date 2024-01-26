// ==UserScript==
// @name        Instagram: Extendgram
// @description Extends functionality and user experience on instagram
// @version     1.0.0
// @namespace   https://egore.url.lol/userscripts
// @author      ryano
// @source      https://github.com/ryanocf/extendgram
// @supportURL  https://github.com/ryanocf/extendgram
// @icon         https://instagram.com/favicon.ico
// @match     http://*.instagram.com/*
// @match     https://*.instagram.com/*
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_addValueChangeListener
// @grant       GM_deleteValue
// @grant       GM_download
// @grant       GM_getValue
// @grant       GM_info
// @grant       GM_listValues
// @grant       GM_notification
// @grant       GM_openInTab
// @grant       GM_removeValueChangeListener
// @grant       GM_setClipboard
// @grant       GM_setValue
// ==/UserScript==

const _DEBUG = false;

const _PATTERN = {
    dm: /^\/direct\/t\/.+$/i,
    feed: /^\/$/i,
    inbox: /^\/direct\/[inbox\/]+$$/i,
    profile: /^\/p\/.+$/i,
    story: /^\/stories\/.+$/i,
};

const _POST = {
    attribute: `data-${GM_info.script.name}`,
    carousel: 'Tgarh',
    class: 'M9sTE',
    icons: ['ltpMr', 'wmtNn'],
    image: 'FFVAD',
    position: ['rQDP3', 1, 'XCodT', '_9nCnY', 'Ckrof'],
    tag: 'article',
    video: 'tWeCl',
};

/*
 * *** STORY ***
 * video(qbCDp)
 *      yes -> source
 *      no -> check img
 *          yes -> img
 *          no -> error
 */

const _SCRIPT = GM_info.script;

const _STORY = {
    offsets: ['video', 'qbCDp', 'source', 'img'],
};



(function() {
    'use strict';

GM_addStyle(`
    /* No CSS *//*# sourceMappingURL=extendgram.min.css.map */

`);

class Logger {
    constructor() {
        this.codes = {
            debug: {
                prefix: '🐛',
                style:
                    'font-weight: bold; color: rgba(255, 102, 0, 1.0); background-color: rgba(0, 0, 0, 0.7);',
            },
            error: {
                prefix: '❌',
                style:
                    'font-weight: bold; color: rgba(255, 0, 0, 1.0); background-color: rgba(0, 0, 0, 0.7);',
            },
            info: {
                prefix: '📌',
                style:
                    'font-weight: bold; color: rgba(0, 123, 255, 1.0); background-color: rgba(0, 0, 0, 0.7);',
            },
            warning: {
                prefix: '⚠️',
                style:
                    'font-weight: bold; color: rgba(255, 255, 0, 1.0); background-color: rgba(0, 0, 0, 0.7);',
            },
            success: {
                prefix: '✔️',
                style:
                    'font-weight: bold; color: rgba(0, 190, 0, 1.0); background-color: rgba(0, 0, 0, 0.7);',
            },
        };

        this.prefix = '[extendgram]';

        if (_DEBUG) this.debug('constructor of class Logger called');
    }

    debug(msg) {
        return console.log(
            `${this.prefix} ${this.codes.debug.prefix} - %c${msg}!`,
            this.codes.debug.style
        );
    }

    error(msg) {
        return console.log(
            `${this.prefix} ${this.codes.error.prefix} - %c${msg}!`,
            this.codes.error.style
        );
    }

    info(msg) {
        return console.log(
            `${this.prefix} ${this.codes.info.prefix} - %c${msg}!`,
            this.codes.info.style
        );
    }

    warning(msg) {
        return console.log(
            `${this.prefix} ${this.codes.warning.prefix} - %c${msg}!`,
            this.codes.warning.style
        );
    }

    success(msg) {
        return console.log(
            `${this.prefix} ${this.codes.success.prefix} - %c${msg}!`,
            this.codes.success.style
        );
    }
}

class Helper {
    constructor() {
        if (_DEBUG) L.debug('constructor of class Helper called');
    }

    download = async function (src) {
        await GM_download(src, 'download');
    };

    /* https://plainjs.com/javascript/manipulation/insert-an-element-after-or-before-another-32/ */
    insert_after = function (element, reference) {
        reference.parentNode.insertBefore(element, reference.nextSibling);
    };

    insert_before = function (element, reference) {
        reference.parentNode.insertBefore(element, reference);
    };

    in_new = async function (data) {
        await GM_openInTab(data, { active: true, insert: true });
    };

    notification = async function (text) {
        /* image = 256x256 */
        await GM_notification({
            text: text,
            title: `${_SCRIPT.name} v${_SCRIPT.version}`,
            silent: true,
            timeout: 3000,
        });
    };

    to_clipboard = async function (data, mode) {
        switch (mode) {
            case 'url':
                await GM_setClipboard(data, {
                    type: 'text',
                    mimetype: 'text/plain',
                });
                break;

            default:
                break;
        }

        this.notification('Copied to clipboard!');
    };
}

class Settings {
    defaults = {
        main_color: 'rgba(102, 0, 255, 1)',
        volume: 0.3,
    };

    constructor() {
        this.obj = this.get();
        console.log(this.obj);
        if (_DEBUG) L.debug('constructor of class Settings called');
    }

    delete(key) {
        GM_deleteValue(key);
        delete this.obj[key];

        if (_DEBUG) L.debug(`${key} deleted`);

        return key;
    }

    get() {
        let obj = {};

        for (let key in this.defaults) {
            let value = GM_getValue(key);

            if (typeof value === 'undefined') {
                obj[key] = this.defaults[key];
                L.warning(
                    `${key} was not found so it got replaced with the default value`
                );
                this.set(key, this.defaults[key]);
            } else {
                obj[key] = value;
            }
        }

        return obj;
    }

    set(key, value) {
        GM_setValue(key, value);
        this.obj[key] = value;

        if (_DEBUG) L.debug(`${key} set to ${value}`);

        return { key: value };
    }
}

class Gather {
    constructor() {
        this.interval = setInterval(() => {
            this.main();
        }, 1000);
        this.url = window.location.pathname;
        this.observer_opt = {
            attributes: true,
        };
        this.observer = new MutationObserver((list, observer) => {
            let p = list[0].target;
            if (p.getElementsByClassName(_POST.video).length >= 1) {
                let e = p;
                for (let i = 0; i < 4; i++) {
                    e = e.parentElement;
                }
                this.handle_carousel(e);
            }
        });

        if (_DEBUG) L.debug('constructor of class Gather called');
    }

    main = function () {
        this.url = window.location.pathname;

        switch (true) {
            case _PATTERN.dm.test(this.url):
                break;

            case _PATTERN.feed.test(this.url):
                this.handle_posts();
                break;

            case _PATTERN.inbox.test(this.url):
                break;

            case _PATTERN.profile.test(this.url):
                this.handle_posts();
                break;

            case _PATTERN.story.test(this.url):
                this.handle_stories();
                break;

            default:
                break;
        }
    };

    handle_carousel = function (post) {
        let index = 0;

        let p = post.parentElement.parentElement.parentElement;

        const positions = p.getElementsByClassName(_POST.position[0])[0]
            .children[_POST.position[1]].children;

        for (let i = 0; i < positions.length; i++) {
            if (positions[i].classList.contains(_POST.position[2])) {
                index = i;
                break;
            }
        }

        if (index > 1) index = 1;

        let _p = p.getElementsByClassName(_POST.position[4])[index];

        let src =
            _p.getElementsByClassName(_POST.image).length == 1
                ? _p.getElementsByClassName(_POST.image)[0]
                : _p.getElementsByClassName(_POST.video)[0];

        if (src.classList.contains(_POST.video)) {
            src.volume = settings.obj.volume;

            this.handle_videos(_p);
        }

        return src.src;
    };

    handle_posts = function () {
        const posts = document.getElementsByClassName(_POST.class);

        for (let i = 0; i < posts.length; i++) {
            if (posts[i].getElementsByClassName('_8jZFn'))
                this.handle_videos(posts[i]); // image always appears again if scrolling down in feed

            if (posts[i].getAttribute(_POST.attribute)) continue;

            let src;

            if (posts[i].classList.contains(_POST.carousel)) {
                const p = posts[i].getElementsByClassName(_POST.position[4]);
                const c = posts[i].getElementsByClassName(_POST.position[3])[0];

                let links = [];
                for (let j = 0; j < p.length; j++) {
                    try {
                        links.push(
                            p[j].getElementsByClassName(_POST.image).length == 1
                                ? p[j].getElementsByClassName(_POST.image)[0]
                                      .src
                                : p[j].getElementsByClassName(_POST.video)[0]
                                      .src
                        );
                        this.observer.observe(c, this.observer_opt);
                    } catch (err) {
                        L.error(err);
                    }
                }

                src = links;
            } else {
                try {
                    if (
                        posts[i].getElementsByClassName(_POST.image).length == 1
                    ) {
                        src = posts[i].getElementsByClassName(_POST.image)[0]
                            .src;
                    } else {
                        let p = posts[i].getElementsByClassName(_POST.video)[0];
                        src = p.src;
                        p.volume = settings.obj.volume;
                        this.handle_videos(posts[i]);
                    }
                } catch (err) {
                    L.error(err);
                }
            }

            if (typeof src === 'undefined') continue;

            this.append_icons(posts[i], src, 'copy');
            this.append_icons(posts[i], src, 'download');
            this.append_icons(posts[i], src, 'in_new');
            posts[i].setAttribute(_POST.attribute, 'true');
        }
    };

    handle_videos = function (post) {
        try {
            post.getElementsByClassName('fXIG0')[0].style.display = 'none';
            post.getElementsByClassName('PyenC')[0].style.display = 'none';
            post.getElementsByClassName(_POST.video)[0].controls = true;
            post.getElementsByClassName('_8jZFn')[0].style.display = 'none';
        } catch (e) {}
    };

    handle_stories = function () {};

    append_icons = function (post, src, icon) {
        let range = document.createRange();
        let element = post.getElementsByClassName(_POST.icons[0])[0];
        range.selectNode(element);

        let append;
        let p;

        switch (icon) {
            case 'copy':
                append = range.createContextualFragment(`
                    <span class="${_SCRIPT.name}-${icon}">
                        <button class="wpO6b" type="button">
                            <div class="QBdPU">
                                <svg aria-label="copy link" class="_8-yf5" fill="#262626" height="24" viewBox="0 0 24 24" width="24">
                                    <path fill="currentColor" d="M3.9,12C3.9,10.29 5.29,8.9 7,8.9H11V7H7A5,5 0 0,0 2,12A5,5 0 0,0 7,17H11V15.1H7C5.29,15.1 3.9,13.71 3.9,12M8,13H16V11H8V13M17,7H13V8.9H17C18.71,8.9 20.1,10.29 20.1,12C20.1,13.71 18.71,15.1 17,15.1H13V17H17A5,5 0 0,0 22,12A5,5 0 0,0 17,7Z" />
                                </svg>
                            </div>
                        </button>
                    </span>
                `);

                helper.insert_before(
                    append,
                    post.getElementsByClassName(_POST.icons[1])[0]
                );

                p = post.getElementsByClassName(`${_SCRIPT.name}-${icon}`)[0];
                if (typeof src === 'object')
                    p.addEventListener('click', () => {
                        helper.to_clipboard(this.handle_carousel(p), 'url');
                    });
                else
                    p.addEventListener('click', () => {
                        helper.to_clipboard(src, 'url');
                    });
                break;

            case 'download':
                append = range.createContextualFragment(`
                    <span class="${_SCRIPT.name}-${icon}">
                        <button class="wpO6b" type="button">
                            <div class="QBdPU">
                                <svg aria-label="download" class="_8-yf5" fill="#262626" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M5,20H19V18H5M19,9H15V3H9V9H5L12,16L19,9Z" />
                                </svg>
                            </div>
                        </button>
                    </span>
                `);

                helper.insert_before(
                    append,
                    post.getElementsByClassName(_POST.icons[1])[0]
                );

                p = post.getElementsByClassName(`${_SCRIPT.name}-${icon}`)[0];
                if (typeof src === 'object')
                    p.addEventListener('click', () => {
                        helper.download(this.handle_carousel(p));
                    });
                else
                    p.addEventListener('click', () => {
                        helper.download(src);
                    });
                break;

            case 'in_new':
                append = range.createContextualFragment(`
                    <span class="${_SCRIPT.name}-${icon}">
                        <button class="wpO6b" type="button">
                            <div class="QBdPU">
                                <svg aria-label="open in new tab" class="_8-yf5" fill="#262626" height="24" viewBox="0 0 24 24" width="24">
                                    <path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />
                                </svg>
                            </div>
                        </button>
                    </span>
                `);

                helper.insert_before(
                    append,
                    post.getElementsByClassName(_POST.icons[1])[0]
                );

                p = post.getElementsByClassName(`${_SCRIPT.name}-${icon}`)[0];
                if (typeof src === 'object')
                    p.addEventListener('click', () => {
                        helper.in_new(this.handle_carousel(p));
                    });
                else
                    p.addEventListener('click', () => {
                        helper.in_new(src);
                    });
                break;

            default:
                break;
        }
    };
}

/* Always call Logger first or everything will go downhill :( */
var L = new Logger();

var helper = new Helper();
var settings = new Settings();
var gather = new Gather();



})();
