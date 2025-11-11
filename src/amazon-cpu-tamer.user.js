// ==UserScript==
// @name         Amazon CPU Tamer
// @name:ja      Amazon CPU Tamer
// @name:zh-CN   Amazon CPU Tamer
// @namespace    knoa.jp
// @description  Reduces CPU usage on Amazon shopping pages.
// @antifeature  referral-link This script may add an associate ID to visited Amazon URLs. It doesn't replace any existed ID. Thank you.
// @downloadURL  https://update.greasyfork.org/scripts/415464/Amazon%20CPU%20Tamer.user.js
// @updateURL    https://update.greasyfork.org/scripts/415464/Amazon%20CPU%20Tamer.meta.js
// @include      https://www.amazon.com/*
// @include      https://www.amazon.co.jp/*
// @include      https://www.amazon.co.uk/*
// @include      https://www.amazon.es/*
// @include      https://www.amazon.fr/*
// @include      https://www.amazon.de/*
// @include      https://www.amazon.it/*
// @include      https://www.amazon.*
// @include      https://*.amazon-*.com/*
// @include      https://*.*-amazon.com/*
// @exclude      */cart/*
// @exclude      */buy/*
// @version      1.4.4
// @grant        none
// @icon         https://www.amazon.com/favicon.ico
// @run-at       document-start
// ==/UserScript==

/*
[update]
Update @antifeature descriptions. Minor fix.

[memo]
top:
  interval インタラクション要素にも使われるので、1インスタンスにまとめた上で前面タブのみやむなく125msごとに実行。
    もっとゆるい頻度にしつつ、click や  keydown 時のみ頻度を上げる手はあるが、前面タブで1-2%なら許されるだろう。
    ゆるい interval による把握できている問題は詳細画像の切り替え表示だけなので、自分でやっちゃう手もあるが。
  timeout  インタラクションのみで定常なしなので、そのまま実行してもよい。
iframe(ad):
  interval 初期化時のみなのでそのまま実行してもよい。
  timeout  定常 100ms が iframe ごとに1つずつなので、1秒ごとに頻度を落とす。
iframe(cloudfront.net ad)
  ローカルソースのiframeから事後生成されるのでTampermonkeyが機能しない。
  広告除去することはできるが、このスクリプトの役目ではない。
*/
(function () {
  const SCRIPTID = 'AmazonCpuTamer';
  console.log(SCRIPTID, location.href);
  const BUNDLEDINTERVAL = 125;/* the bundled interval */
  const BACKGROUNDINTERVAL = 60 * 1000;/* take even longer interval on hidden tab */
  const IFRAMETIMEOUT = 1 * 1000;/* amazon uses timeouts instead of intervals on iframes */
  /*
    [interval]
    tame quick intervals
  */
  if (window === top) {
    /* integrate each of intervals */
    const bundle = {};/* {0: {f, interval, lastExecution}} */
    let index = 0;/* use it instead of interval id */
    let lastExecution = 0;
    /* bundle intervals */
    const originalSetInterval = window.setInterval.bind(window);
    window.setInterval = function (f, interval, ...args) {
      //console.log(SCRIPTID, 'original interval:', interval, location.href);
      bundle[index] = {
        f: f.bind(null, ...args),
        interval: interval,
        lastExecution: 0,
      };
      return index++;
    };
    window.clearInterval = function (id) {
      //console.log(SCRIPTID, 'clearInterval:', id, location.href);
      delete bundle[id];
    };
    /* execute bundled intervals */
    /* a bunch of intervals does cost so much even if the processes do nothing */
    originalSetInterval(function () {
      const now = Date.now();
      if (document.hidden && now < lastExecution + BACKGROUNDINTERVAL) return;
      Object.keys(bundle).forEach(id => {
        const item = bundle[id];
        if (item === undefined) return;/* it could be occur on tiny deletion chance */
        if (now < item.lastExecution + item.interval) return;/* not yet */
        item.f();
        item.lastExecution = now;
      });
      lastExecution = now;
    }, BUNDLEDINTERVAL);
  }
  /*
    [timeout]
    tame quick timeouts on iframe ads
  */
  if (window !== top) {
    const originalSetTimeout = window.setTimeout.bind(window);
    window.setTimeout = function (f, timeout, ...args) {
      if (document.hidden) return;
      if (timeout < IFRAMETIMEOUT) {
        //console.log(SCRIPTID, 'timeout:', timeout, 'to', IFRAMETIMEOUT, location.href);
        timeout = IFRAMETIMEOUT;
      }
      return originalSetTimeout(f, timeout, ...args);
    };
  }
  /*
    [associate]
    add an associate tag
  */
  if (window === top) {
    const IDS = {
      'www.amazon.com': 'knoa-20',
      'www.amazon.co.jp': 'knoa-22',
      'www.amazon.co.uk': 'knoa01-21',
      'www.amazon.es': 'knoa0c-21',
      'www.amazon.fr': 'knoa09-21',
      'www.amazon.de': 'knoa03-21',
      'www.amazon.it': 'knoa0a-21',
    };
    if (IDS[location.host]) {
      addTag(IDS[location.host]);
    }
    function addTag(tag) {
      const url = new URL(location.href);
      if (url.searchParams.get('tag') !== null) return;/* do not overwrite */
      console.log(SCRIPTID, 'associate tag:', tag);
      document.documentElement.addEventListener('mousedown', function (e) {
        for (let target = e.target; target; target = target.parentNode) {
          if (target.href && target.href.startsWith(location.origin) && !target.getAttribute('href').startsWith('#')) {
            const separator = (target.href.includes('?')) ? '&' : '?';
            target.href = target.href.replace(/(?=#)|$/, separator + 'tag=' + tag);
          }
        }
      });
      const separator = (url.search === '') ? '?' : '&';
      history.replaceState(null, document.title, location.href.replace(/(?=#)|$/, separator + 'tag=' + tag));
    }
  }
})();