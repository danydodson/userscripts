    // ==UserScript==
    // @name         Cleaner: No Cookies 🍪
    // @name:fr      L'internet devient mieux
    // @description  First version: gets rid of cookies 🍪🍪🍪 Let me know wich website it doesn't work on
    // @description:fr  Première version: Ca efface les cookies 🍪🍪🍪
    // @author       iloverats1234
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/RedX.svg/1024px-RedX.svg.png
    // @match      https://consent.google.*/*
    // @match      https://www.google.tld/*
    // @match      https://starve.io/
    // @match      https://www.google.com
    // @match      https://www.youtube.com/
    // @match      https://www.facebook.com/
    // @match      https://twitter.com/
    // @match      https://www.instagram.com/
    // @match      http://www.baidu.com/
    // @match      https://www.wikipedia.org/
    // @match      https://www.reddit.com/
    // @match      https://consent.yahoo.com/v2/collectConsent?sessionId=3_cc-session_83f05cbb-450a-4c64-a23a-bc67eb43a71f
    // @match      https://yahoo.com/
    // @match      https://www.amazon.com/
    // @match      https://www.netflix.com/fr/
    // @match      https://www.netflix.com/fr-en/
    // @match      https://www.twitch.tv/
    // @match      https://www.ebay.com/
    // @match      https://moomoo.io/
    // @match      https://diep.io
    // @match      https://devast.io/
    // @match      https://slither.io
    // @match      https://krunker.io/
    // @match      https://odysee.com/
    // @match      https://www.amazon.de/
    // @match      https://www.amazon.fr/
    // @match      https://www.amazon.nl/
    // @match      https://www.amazon.it/
    // @match      https://www.amazon.es/
    // @match      https://www.amazon.co.uk/
    // @match      https://www.adobe.com/
    // @match      https://www.friv.com/
    // @match      https://shellshock.io/
    // @license MIT
// @version 0.0.1.20221215235744
// @namespace  https://egore.url.lol/userscripts
   // ==/UserScript==
 
    (function(){
    "use strict";
        alert('cookie deleter : actived - agrees (or refuse if you are going to YouTube) to the cookies dialog to make it disappear forever')
    if (document.readyState != 'loading') consent();
    else document.addEventListener('DOMContentLoaded', consent);
 
    function consent() {
      var e=document.querySelector('#introAgreeButton');
      if (!e) e=document.querySelector('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://consent.google.com/s"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://twitter.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://starve.io/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://consent.google.*/*"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.google.tld/*"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://starve.io/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.google.com"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.youtube.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.facebook.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://twitter.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.instagram.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="http://www.baidu.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.wikipedia.org/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.reddit.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://consent.yahoo.com/v2/collectConsent?sessionId=3_cc-session_83f05cbb-450a-4c64-a23a-bc67eb43a71f"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://yahoo.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.amazon.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.netflix.com/fr/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.netflix.com/fr-en/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.twitch.tv/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.ebay.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://diep.io"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://moomoo.io/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://devast.io/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://slither.io"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://krunker.io/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://odysee.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://truthsocial.com/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.amazon.de/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.amazon.fr/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.amazon.nl/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.amazon.it/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.amazon.es/"] button');('div.jw8mI button#zV9nZe.tHlp8d, div.VDity button#L2AGLb.tHlp8d, form[action="https://www.amazon.co.uk/"] button');
      e && e.click();
    }
 
  var t, e=r.querySelector('#introAgreeButton')
    || ( (t=r.querySelectorAll('#lightbox[class*="ytd-consent-bump"] a.ytd-button-renderer:not([href])')) && (t.length==1) && (e=t[0]) )
    || ( (t=r.querySelectorAll('form button')) && (t.length == 1) && (e=t[0]) )
    || ( (t=r.querySelectorAll(':scope form button')) && (t.length == 4) && (e=t[1]) ) /*20220524*/
    || ( (t=r.querySelectorAll('ytd-button-renderer > a:not([href]) tp-yt-paper-button[class*="primary"]')) && (t.length == 1) && (e=t[0]) )
    || ( (t=r.querySelectorAll('ytd-button-renderer > a:not([href]) tp-yt-paper-button[class*="primary"]')) && (t.length == 2) && (e=t[0]) );
  e && e.click();
 
if (location.href.startsWith('https://consent.youtube.com/')) {
  if (document.readyState != 'loading') consent();
  else document.addEventListener('DOMContentLoaded', consent);
  return;
  }
 
if (window !== window.top) return;
 
function cookies() {
  var r={}, a=document.cookie;
  a.split(';').forEach(function(e){
    var p=e.split('=');
    if (p[0]) r[p.shift().trim()]=p.join('=');
    });
  return r;
  }
 
var ck=cookies();
if (ck['APISID']) return;
 
function hasDismiss(e, l=1) {
  var p=e;
  while (p && l-- && (p=p.parentNode)) {
    if (p.id=='dismiss-button') return p;
    }
  }
 
function SImutF(mutL){
  for (let mut of mutL) {
    let t=mut.target, db=t;
    if ( (t.id=='dismiss-button') || (db=hasDismiss(t,2)) ) {
      if (db.__c__) continue;
      if (t.classList.contains('yt-upsell-dialog-renderer') || t.classList.contains('ytd-mealbar-promo-renderer')) ;
      else if (t.classList.contains('yt-tooltip-renderer')) {
        t=t.querySelector('yt-button-renderer');
        if (!t) continue;
        }
      else continue;
      db.__c__=true;
      setTimeout(function(){
        t.click();
        delete db.__c__;
        }, 300);
      subObs.observe(t,{attributes: true, subtree: true});
      }
    }
  }
var obs=new MutationObserver(SImutF);
var subObs=new MutationObserver(SImutF);
var obs_w4PU=new MutationObserver(function(mutL){
  for (let mut of mutL) {
    for (let n of mut.addedNodes) {
      if (n.nodeName == 'YTD-POPUP-CONTAINER') {
        this.disconnect();
        setObs();
        return;
        }
      }
    }
  });
var obs_w4ErRd=new MutationObserver(function(mutL){
  for (let mut of mutL) {
    for (let n of mut.addedNodes) {
      if (n.id == 'columns') {
        let r=n.querySelector('yt-playability-error-supported-renderers');
        if (r) {
          this.disconnect();
          setErRdObs();
          return;
          }
        }
      }
    }
  });
var obsCk=new MutationObserver(function(mutL){
  var cb;
  for (let mut of mutL) {
    for (let n of mut.addedNodes) {
      if (n.nodeName == 'TP-YT-IRON-OVERLAY-BACKDROP') {
        cb=document.querySelector('#lightbox');
        consent();
        }
      if ( (n.nodeName == 'YTD-CONSENT-BUMP-LIGHTBOX') || (n=cb) ) {
        this.disconnect();
        setTimeout(function(){
          let ck=cookies();
          if (ck['CONSENT'] && !ck['CONSENT'].startsWith('YES')) document.cookie='CONSENT=YES+;path=/;secure;domain=youtube.com;expires='+(new Date(Date.now()+567648000000)).toUTCString()+';';
          }, 5000);
        // not an iframe anymore
        consent(null,n);
        return;
        }
      }
    }
  });
 
var ErRd, ErRdIT,
 obsErRd=new MutationObserver(function(mutL){
  var t, ITc=30;
  for (let mut of mutL) {
    t=mut.target;
    if (t.id=='dismiss-button') {
      if (t.classList.contains('yt-player-error-message-renderer')) t=t.querySelector(':scope yt-button-renderer paper-button#button');
      else continue;
      if (ErRdIT) clearInterval(ErRdIT);
      ErRdIT=setInterval(function(){
        if (!ITc-- || ErRd.hidden || !t) {
          clearInterval(ErRdIT);
          ErRdIT=0;
          }
        else t.click();
        }, 300);
      return;
      }
    }
  });
 
function init() {
  var t;
  if (document.querySelector('ytm-app')) {
    new MutationObserver(function(mutL){
      for (let mut of mutL) {
        for (let n of mut.addedNodes) {
          if (n.classList.contains('upsell-dialog-lightbox') || n.classList.contains('consent-bump-lightbox') ) {
            if (t=document.querySelector('.upsell-dialog-dismiss-button button, .consent-bump-button-wrapper button')) {
              t.click();
              }
            }
          }
        }
      }).observe(document.body, {childList: true, subtree: false});
    }
 
  setObs();
  setErRdObs();
  if (ck['CONSENT'] && !ck['CONSENT'].startsWith('YES')) {
    obsCk.observe(document.body, {childList:true});
    setTimeout(function(){obsCk.disconnect();},30000);
    }
  }
 
var c=1;
function setObs(){
  var r=document.querySelector('ytd-app ytd-popup-container');
  if (!r) {
    if (c--) obs_w4PU.observe(document.querySelector('ytd-app'), {childList:true});
    return;
    }
  obs.observe(r, {childList: true, subtree: true});
  }
 
function setErRdObs() {
  ErRd=document.querySelector('ytd-app yt-playability-error-supported-renderers');
  if (!ErRd) {
    obs_w4ErRd.observe(document.querySelector('ytd-app'), {childList: true, subtree: true});
    setTimeout(function(){obs_w4ErRd.disconnect();}, 20000);
    }
  else obsErRd.observe(ErRd ,{childList: true, subtree: true, attributes: true});
  }
 
if (document.readyState != 'loading') init();
else document.addEventListener('DOMContentLoaded', init);
 
function inject() {
 
var r=document.head || document.documentElement;
if (!r) {
  setTimeout(inject,0);
  return;
  }
 
var s=document.createElement('style');
r.appendChild(s);
s.textContent="#consent-bump,iron-overlay-backdrop,yt-upsell-dialog-renderer{opacity:0;}yt-upsell-dialog-renderer *,yt-bubble-hint-renderer,.upsell-dialog-lightbox,.consent-bump-lightbox{display:none !important;}ytd-app > ytd-consent-bump-lightbox,ytd-app > ytd-consent-bump-v2-lightbox,ytd-app ~ iron-overlay-backdrop,ytd-app ~ tp-yt-iron-overlay-backdrop{display:none;}";
 
s=document.createElement('script');
s.textContent= `(function(){var c=160, pl, plR, prom, oldp={}, t, done, hasPaused;
 
 const obs=new MutationObserver(function(mutL){
  if (!prom) {
    if (prom=document.querySelector('ytd-player#ytd-player') ) {
      if (prom.getPlayerPromise) {
        prom.getPlayerPromise().then(function(a){
          pl=a;
          patch();
          });
        }
      else prom=null;
      }
    }
 
  for (let mut of mutL) {
    for (let n of mut.addedNodes) {
      if (n.id == 'movie_player') {
        plR=n.closest('ytd-player#ytd-player');
        if (!plR) continue;
        this.disconnect();
        setTimeout(function(){
          pl=plR.getPlayer();
          patch();
          }, 0);
        return;
        }
      }
    }
  });
 
  function init(){
    obs.observe(document.querySelector('ytd-app') || document.body, {childList: true, subtree: true});
    setTimeout(function(){obs.disconnect();},10000);
    f();
    }
 
  function f(){
    plR=document.querySelector('ytd-player#ytd-player');
    if (plR) pl=plR.getPlayer();
 
    if (!pl) {
      if (--c) setTimeout(f,100);
      return;
      }
    else patch();
    }
  if (document.readyState != 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
 
  function patch() {
    if (done) return;
    if (pl) done=1;
    obs.disconnect();
    for (let i in pl) if (typeof pl[i] == 'function') {
      if ( !['cancelPlayback', 'pauseVideo', 'stopVideo', 'playVideo'].includes(i) ) continue;
      oldp[i]=pl[i];
      pl[i]=function() {
        let pass= (!hasPaused && i=='playVideo') ? true:false;
        let st=(new Error()).stack;
        if ( !pass && (st.search(/(\\.onFulfilled|_onFulfilled|scheduler\\.js:|handlePopupClose_)/)>0) && (st.search(/onYtStopOldPlayer/) ==-1) ) {
          if (i=='pauseVideo') hasPaused=1;
          return;
          }
        oldp[i].apply(this,arguments);
        }
      }
    }
  })();`;
 
r.appendChild(s);
if (s.parentNode) s.parentNode.removeChild(s);
 
} // inject()
 
inject();
    })();