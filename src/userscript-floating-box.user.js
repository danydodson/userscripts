// ==UserScript==
// @name         UserScript Floating Box
// @description  This is a userscript that shows a floating box.
// @author       https://egore.url.lol/userscripts
// @version      0.0.0
// @namespace    https://egore.url.lol/userscripts
// @include      *
// @icon         https://www.tampermonkey.net/favicon.ico
// @require      https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @require      https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2/dist/solid.js
// @grant        GM_addStyle
// ==/UserScript==

(function (web, solidJs, ui) {
  'use strict';

  var css_248z = "";

  var styles = { "count": "style-module_count__pvt1a", "plus1": "style-module_plus1__bz4vm" };
  var stylesheet = "*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }::backdrop{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.style-module_count__pvt1a{--un-text-opacity:1;color:rgba(249,115,22,var(--un-text-opacity))}.style-module_plus1__bz4vm{float:right}";

  const _tmpl$ = /*#__PURE__*/web.template(`<div><button>Amazing+1</button><p>Drag me</p><p><span></span> people think this is amazing.`);
  function Counter() {
    const [getCount, setCount] = solidJs.createSignal(0);
    const handleAmazing = () => {
      setCount(count => count + 1);
      ui.showToast('Amazing + 1', {
        theme: 'dark'
      });
    };
    return (() => {
      const _el$ = _tmpl$(),
        _el$2 = _el$.firstChild,
        _el$3 = _el$2.nextSibling,
        _el$4 = _el$3.nextSibling,
        _el$5 = _el$4.firstChild;
      _el$2.$$click = handleAmazing;
      web.insert(_el$5, getCount);
      web.effect(_p$ => {
        const _v$ = styles.plus1,
          _v$2 = styles.count;
        _v$ !== _p$._v$ && web.className(_el$2, _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && web.className(_el$5, _p$._v$2 = _v$2);
        return _p$;
      }, {
        _v$: undefined,
        _v$2: undefined
      });
      return _el$;
    })();
  }

  // Let's create a movable panel using @violentmonkey/ui
  const panel = ui.getPanel({
    theme: 'dark',
    style: [css_248z, stylesheet].join('\n')
  });
  Object.assign(panel.wrapper.style, {
    top: '10vh',
    left: '10vw'
  });
  panel.setMovable(true);
  panel.show();
  web.render(Counter, panel.body);
  web.delegateEvents(["click"]);

})(VM.solid.web, VM.solid, VM);
