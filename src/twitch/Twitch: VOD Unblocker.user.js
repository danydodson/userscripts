// ==UserScript==
// @name            Twitch: VOD Unblocker
// @description     Unblocks Twitch VODs. Buy me a coffee at: https://ko-fi.com/beypazari
// @copyright       2020, beypazarigurusu (https://openuserjs.org/users/beypazarigurusu)
// @contributionURL https://ko-fi.com/beypazari
// @license         MIT
// @version         2.0.5
// @author          beypazarigurusu
// @match           https://www.twitch.tv/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/hls.js/1.0.11/hls.min.js
// @require         https://unpkg.com/plyr/dist/plyr.min.js
// @run-at          document-start
// @grant           none
// @icon            https://www.google.com/s2/favicons?domain=twitch.tv
// @namespace https://greasyfork.org/users/727473
// ==/UserScript==

/******/ (function () { // webpackBootstrap
/******/ 	"use strict"
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/***/ (function (module) {


        /*
          MIT License http://www.opensource.org/licenses/mit-license.php
          Author Tobias Koppers @sokra
        */
        // css base code, injected by the css-loader
        // eslint-disable-next-line func-names

        module.exports = function (cssWithMappingToString) {
          var list = [] // return the list of modules as css string

          list.toString = function toString() {
            return this.map(function (item) {
              var content = cssWithMappingToString(item)

              if (item[2]) {
                return "@media ".concat(item[2], " {").concat(content, "}")
              }

              return content
            }).join("")
          } // import a list of modules into the list
          // eslint-disable-next-line func-names


          list.i = function (modules, mediaQuery, dedupe) {
            if (typeof modules === "string") {
              // eslint-disable-next-line no-param-reassign
              modules = [[null, modules, ""]]
            }

            var alreadyImportedModules = {}

            if (dedupe) {
              for (var i = 0; i < this.length; i++) {
                // eslint-disable-next-line prefer-destructuring
                var id = this[i][0]

                if (id != null) {
                  alreadyImportedModules[id] = true
                }
              }
            }

            for (var _i = 0; _i < modules.length; _i++) {
              var item = [].concat(modules[_i])

              if (dedupe && alreadyImportedModules[item[0]]) {
                // eslint-disable-next-line no-continue
                continue
              }

              if (mediaQuery) {
                if (!item[2]) {
                  item[2] = mediaQuery
                } else {
                  item[2] = "".concat(mediaQuery, " and ").concat(item[2])
                }
              }

              list.push(item)
            }
          }

          return list
        }

        /***/
}),

/***/ "./node_modules/css-loader/dist/cjs.js!./src/style.css":
/***/ (function (module, __webpack_exports__, __webpack_require__) {

/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./node_modules/css-loader/dist/runtime/api.js")
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__)
        // Imports

        var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function (i) { return i[1] })
        // Module
        ___CSS_LOADER_EXPORT___.push([module.id, "/* global css */\n\n:root {\n  --plyr-color-main: #9147ff;\n}\n\n.plyr {\n  height: 100%;\n}\n\n@keyframes plyr-progress{to{background-position:25px 0;background-position:var(--plyr-progress-loading-size,25px) 0}}@keyframes plyr-popup{0%{opacity:.5;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes plyr-fade-in{from{opacity:0}to{opacity:1}}.plyr{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;align-items:center;direction:ltr;display:flex;flex-direction:column;font-family:inherit;font-family:var(--plyr-font-family,inherit);font-variant-numeric:tabular-nums;font-weight:400;font-weight:var(--plyr-font-weight-regular,400);line-height:1.7;line-height:var(--plyr-line-height,1.7);max-width:100%;min-width:200px;position:relative;text-shadow:none;transition:box-shadow .3s ease;z-index:0}.plyr audio,.plyr iframe,.plyr video{display:block;height:100%;width:100%}.plyr button{font:inherit;line-height:inherit;width:auto}.plyr:focus{outline:0}.plyr--full-ui{box-sizing:border-box}.plyr--full-ui *,.plyr--full-ui ::after,.plyr--full-ui ::before{box-sizing:inherit}.plyr--full-ui a,.plyr--full-ui button,.plyr--full-ui input,.plyr--full-ui label{touch-action:manipulation}.plyr__badge{background:#4a5464;background:var(--plyr-badge-background,#4a5464);border-radius:2px;border-radius:var(--plyr-badge-border-radius,2px);color:#fff;color:var(--plyr-badge-text-color,#fff);font-size:9px;font-size:var(--plyr-font-size-badge,9px);line-height:1;padding:3px 4px}.plyr--full-ui ::-webkit-media-text-track-container{display:none}.plyr__captions{animation:plyr-fade-in .3s ease;bottom:0;display:none;font-size:13px;font-size:var(--plyr-font-size-small,13px);left:0;padding:10px;padding:var(--plyr-control-spacing,10px);position:absolute;text-align:center;transition:transform .4s ease-in-out;width:100%}.plyr__captions span:empty{display:none}@media (min-width:480px){.plyr__captions{font-size:15px;font-size:var(--plyr-font-size-base,15px);padding:calc(10px * 2);padding:calc(var(--plyr-control-spacing,10px) * 2)}}@media (min-width:768px){.plyr__captions{font-size:18px;font-size:var(--plyr-font-size-large,18px)}}.plyr--captions-active .plyr__captions{display:block}.plyr:not(.plyr--hide-controls) .plyr__controls:not(:empty)~.plyr__captions{transform:translateY(calc(10px * -4));transform:translateY(calc(var(--plyr-control-spacing,10px) * -4))}.plyr__caption{background:rgba(0,0,0,.8);background:var(--plyr-captions-background,rgba(0,0,0,.8));border-radius:2px;-webkit-box-decoration-break:clone;box-decoration-break:clone;color:#fff;color:var(--plyr-captions-text-color,#fff);line-height:185%;padding:.2em .5em;white-space:pre-wrap}.plyr__caption div{display:inline}.plyr__control{background:0 0;border:0;border-radius:3px;border-radius:var(--plyr-control-radius,3px);color:inherit;cursor:pointer;flex-shrink:0;overflow:visible;padding:calc(10px * .7);padding:calc(var(--plyr-control-spacing,10px) * .7);position:relative;transition:all .3s ease}.plyr__control svg{display:block;fill:currentColor;height:18px;height:var(--plyr-control-icon-size,18px);pointer-events:none;width:18px;width:var(--plyr-control-icon-size,18px)}.plyr__control:focus{outline:0}.plyr__control.plyr__tab-focus{outline-color:#00b3ff;outline-color:var(--plyr-tab-focus-color,var(--plyr-color-main,var(--plyr-color-main,#00b3ff)));outline-offset:2px;outline-style:dotted;outline-width:3px}a.plyr__control{text-decoration:none}a.plyr__control::after,a.plyr__control::before{display:none}.plyr__control.plyr__control--pressed .icon--not-pressed,.plyr__control.plyr__control--pressed .label--not-pressed,.plyr__control:not(.plyr__control--pressed) .icon--pressed,.plyr__control:not(.plyr__control--pressed) .label--pressed{display:none}.plyr--full-ui ::-webkit-media-controls{display:none}.plyr__controls{align-items:center;display:flex;justify-content:flex-end;text-align:center}.plyr__controls .plyr__progress__container{flex:1;min-width:0}.plyr__controls .plyr__controls__item{margin-left:calc(10px / 4);margin-left:calc(var(--plyr-control-spacing,10px)/ 4)}.plyr__controls .plyr__controls__item:first-child{margin-left:0;margin-right:auto}.plyr__controls .plyr__controls__item.plyr__progress__container{padding-left:calc(10px / 4);padding-left:calc(var(--plyr-control-spacing,10px)/ 4)}.plyr__controls .plyr__controls__item.plyr__time{padding:0 calc(10px / 2);padding:0 calc(var(--plyr-control-spacing,10px)/ 2)}.plyr__controls .plyr__controls__item.plyr__progress__container:first-child,.plyr__controls .plyr__controls__item.plyr__time+.plyr__time,.plyr__controls .plyr__controls__item.plyr__time:first-child{padding-left:0}.plyr__controls:empty{display:none}.plyr [data-plyr=airplay],.plyr [data-plyr=captions],.plyr [data-plyr=fullscreen],.plyr [data-plyr=pip]{display:none}.plyr--airplay-supported [data-plyr=airplay],.plyr--captions-enabled [data-plyr=captions],.plyr--fullscreen-enabled [data-plyr=fullscreen],.plyr--pip-supported [data-plyr=pip]{display:inline-block}.plyr__menu{display:flex;position:relative}.plyr__menu .plyr__control svg{transition:transform .3s ease}.plyr__menu .plyr__control[aria-expanded=true] svg{transform:rotate(90deg)}.plyr__menu .plyr__control[aria-expanded=true] .plyr__tooltip{display:none}.plyr__menu__container{animation:plyr-popup .2s ease;background:rgba(255,255,255,.9);background:var(--plyr-menu-background,rgba(255,255,255,.9));border-radius:4px;bottom:100%;box-shadow:0 1px 2px rgba(0,0,0,.15);box-shadow:var(--plyr-menu-shadow,0 1px 2px rgba(0,0,0,.15));color:#4a5464;color:var(--plyr-menu-color,#4a5464);font-size:15px;font-size:var(--plyr-font-size-base,15px);margin-bottom:10px;position:absolute;right:-3px;text-align:left;white-space:nowrap;z-index:3}.plyr__menu__container>div{overflow:hidden;transition:height .35s cubic-bezier(.4,0,.2,1),width .35s cubic-bezier(.4,0,.2,1)}.plyr__menu__container::after{border:4px solid transparent;border:var(--plyr-menu-arrow-size,4px) solid transparent;border-top-color:rgba(255,255,255,.9);border-top-color:var(--plyr-menu-background,rgba(255,255,255,.9));content:'';height:0;position:absolute;right:calc(((18px / 2) + calc(10px * .7)) - (4px / 2));right:calc(((var(--plyr-control-icon-size,18px)/ 2) + calc(var(--plyr-control-spacing,10px) * .7)) - (var(--plyr-menu-arrow-size,4px)/ 2));top:100%;width:0}.plyr__menu__container [role=menu]{padding:calc(10px * .7);padding:calc(var(--plyr-control-spacing,10px) * .7)}.plyr__menu__container [role=menuitem],.plyr__menu__container [role=menuitemradio]{margin-top:2px}.plyr__menu__container [role=menuitem]:first-child,.plyr__menu__container [role=menuitemradio]:first-child{margin-top:0}.plyr__menu__container .plyr__control{align-items:center;color:#4a5464;color:var(--plyr-menu-color,#4a5464);display:flex;font-size:13px;font-size:var(--plyr-font-size-menu,var(--plyr-font-size-small,13px));padding-bottom:calc(calc(10px * .7)/ 1.5);padding-bottom:calc(calc(var(--plyr-control-spacing,10px) * .7)/ 1.5);padding-left:calc(calc(10px * .7) * 1.5);padding-left:calc(calc(var(--plyr-control-spacing,10px) * .7) * 1.5);padding-right:calc(calc(10px * .7) * 1.5);padding-right:calc(calc(var(--plyr-control-spacing,10px) * .7) * 1.5);padding-top:calc(calc(10px * .7)/ 1.5);padding-top:calc(calc(var(--plyr-control-spacing,10px) * .7)/ 1.5);-webkit-user-select:none;-ms-user-select:none;user-select:none;width:100%}.plyr__menu__container .plyr__control>span{align-items:inherit;display:flex;width:100%}.plyr__menu__container .plyr__control::after{border:4px solid transparent;border:var(--plyr-menu-item-arrow-size,4px) solid transparent;content:'';position:absolute;top:50%;transform:translateY(-50%)}.plyr__menu__container .plyr__control--forward{padding-right:calc(calc(10px * .7) * 4);padding-right:calc(calc(var(--plyr-control-spacing,10px) * .7) * 4)}.plyr__menu__container .plyr__control--forward::after{border-left-color:#728197;border-left-color:var(--plyr-menu-arrow-color,#728197);right:calc((calc(10px * .7) * 1.5) - 4px);right:calc((calc(var(--plyr-control-spacing,10px) * .7) * 1.5) - var(--plyr-menu-item-arrow-size,4px))}.plyr__menu__container .plyr__control--forward.plyr__tab-focus::after,.plyr__menu__container .plyr__control--forward:hover::after{border-left-color:currentColor}.plyr__menu__container .plyr__control--back{font-weight:400;font-weight:var(--plyr-font-weight-regular,400);margin:calc(10px * .7);margin:calc(var(--plyr-control-spacing,10px) * .7);margin-bottom:calc(calc(10px * .7)/ 2);margin-bottom:calc(calc(var(--plyr-control-spacing,10px) * .7)/ 2);padding-left:calc(calc(10px * .7) * 4);padding-left:calc(calc(var(--plyr-control-spacing,10px) * .7) * 4);position:relative;width:calc(100% - (calc(10px * .7) * 2));width:calc(100% - (calc(var(--plyr-control-spacing,10px) * .7) * 2))}.plyr__menu__container .plyr__control--back::after{border-right-color:#728197;border-right-color:var(--plyr-menu-arrow-color,#728197);left:calc((calc(10px * .7) * 1.5) - 4px);left:calc((calc(var(--plyr-control-spacing,10px) * .7) * 1.5) - var(--plyr-menu-item-arrow-size,4px))}.plyr__menu__container .plyr__control--back::before{background:#dcdfe5;background:var(--plyr-menu-back-border-color,#dcdfe5);box-shadow:0 1px 0 #fff;box-shadow:0 1px 0 var(--plyr-menu-back-border-shadow-color,#fff);content:'';height:1px;left:0;margin-top:calc(calc(10px * .7)/ 2);margin-top:calc(calc(var(--plyr-control-spacing,10px) * .7)/ 2);overflow:hidden;position:absolute;right:0;top:100%}.plyr__menu__container .plyr__control--back.plyr__tab-focus::after,.plyr__menu__container .plyr__control--back:hover::after{border-right-color:currentColor}.plyr__menu__container .plyr__control[role=menuitemradio]{padding-left:calc(10px * .7);padding-left:calc(var(--plyr-control-spacing,10px) * .7)}.plyr__menu__container .plyr__control[role=menuitemradio]::after,.plyr__menu__container .plyr__control[role=menuitemradio]::before{border-radius:100%}.plyr__menu__container .plyr__control[role=menuitemradio]::before{background:rgba(0,0,0,.1);content:'';display:block;flex-shrink:0;height:16px;\nmargin-right:10px;\nmargin-right:var(--plyr-control-spacing, 10px);\ntransition:all .3s ease;\nwidth:16px\n}\n\n.plyr__menu__container .plyr__control[role=menuitemradio]::after {\n  background: #fff;\n  border: 0;\n  height: 6px;\n  left: 12px;\n  opacity: 0;\n  top: 50%;\n  transform: translateY(-50%) scale(0);\n  transition: transform .3s ease, opacity .3s ease;\n  width: 6px\n}\n\n.plyr__menu__container .plyr__control[role=menuitemradio][aria-checked=true]::before {\n  background: #00b3ff;\n  background: var(--plyr-control-toggle-checked-background, var(--plyr-color-main, var(--plyr-color-main, #00b3ff)))\n}\n\n.plyr__menu__container .plyr__control[role=menuitemradio][aria-checked=true]::after {\n  opacity: 1;\n  transform: translateY(-50%) scale(1)\n}\n\n.plyr__menu__container .plyr__control[role=menuitemradio].plyr__tab-focus::before,\n.plyr__menu__container .plyr__control[role=menuitemradio]:hover::before {\n  background: rgba(35, 40, 47, .1)\n}\n\n.plyr__menu__container .plyr__menu__value {\n  align-items: center;\n  display: flex;\n  margin-left: auto;\n  margin-right: calc((calc(10px * .7) - 2) * -1);\n  margin-right: calc((calc(var(--plyr-control-spacing, 10px) * .7) - 2) * -1);\n  overflow: hidden;\n  padding-left: calc(calc(10px * .7) * 3.5);\n  padding-left: calc(calc(var(--plyr-control-spacing, 10px) * .7) * 3.5);\n  pointer-events: none\n}\n\n.plyr--full-ui input[type=range] {\n  -webkit-appearance: none;\n  background: 0 0;\n  border: 0;\n  border-radius: calc(13px * 2);\n  border-radius: calc(var(--plyr-range-thumb-height, 13px) * 2);\n  color: #00b3ff;\n  color: var(--plyr-range-fill-background, var(--plyr-color-main, var(--plyr-color-main, #00b3ff)));\n  display: block;\n  height: calc((3px * 2) + 13px);\n  height: calc((var(--plyr-range-thumb-active-shadow-width, 3px) * 2) + var(--plyr-range-thumb-height, 13px));\n  margin: 0;\n  min-width: 0;\n  padding: 0;\n  transition: box-shadow .3s ease;\n  width: 100%\n}\n\n.plyr--full-ui input[type=range]::-webkit-slider-runnable-track {\n  background: 0 0;\n  border: 0;\n  border-radius: calc(5px / 2);\n  border-radius: calc(var(--plyr-range-track-height, 5px)/ 2);\n  height: 5px;\n  height: var(--plyr-range-track-height, 5px);\n  -webkit-transition: box-shadow .3s ease;\n  transition: box-shadow .3s ease;\n  -webkit-user-select: none;\n  user-select: none;\n  background-image: linear-gradient(to right, currentColor 0, transparent 0);\n  background-image: linear-gradient(to right, currentColor var(--value, 0), transparent var(--value, 0))\n}\n\n.plyr--full-ui input[type=range]::-webkit-slider-thumb {\n  background: #fff;\n  background: var(--plyr-range-thumb-background, #fff);\n  border: 0;\n  border-radius: 100%;\n  box-shadow: 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2);\n  box-shadow: var(--plyr-range-thumb-shadow, 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2));\n  height: 13px;\n  height: var(--plyr-range-thumb-height, 13px);\n  position: relative;\n  -webkit-transition: all .2s ease;\n  transition: all .2s ease;\n  width: 13px;\n  width: var(--plyr-range-thumb-height, 13px);\n  -webkit-appearance: none;\n  margin-top: calc(((13px - 5px)/ 2) * -1);\n  margin-top: calc(((var(--plyr-range-thumb-height, 13px) - var(--plyr-range-track-height, 5px))/ 2) * -1)\n}\n\n.plyr--full-ui input[type=range]::-moz-range-track {\n  background: 0 0;\n  border: 0;\n  border-radius: calc(5px / 2);\n  border-radius: calc(var(--plyr-range-track-height, 5px)/ 2);\n  height: 5px;\n  height: var(--plyr-range-track-height, 5px);\n  -moz-transition: box-shadow .3s ease;\n  transition: box-shadow .3s ease;\n  user-select: none\n}\n\n.plyr--full-ui input[type=range]::-moz-range-thumb {\n  background: #fff;\n  background: var(--plyr-range-thumb-background, #fff);\n  border: 0;\n  border-radius: 100%;\n  box-shadow: 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2);\n  box-shadow: var(--plyr-range-thumb-shadow, 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2));\n  height: 13px;\n  height: var(--plyr-range-thumb-height, 13px);\n  position: relative;\n  -moz-transition: all .2s ease;\n  transition: all .2s ease;\n  width: 13px;\n  width: var(--plyr-range-thumb-height, 13px)\n}\n\n.plyr--full-ui input[type=range]::-moz-range-progress {\n  background: currentColor;\n  border-radius: calc(5px / 2);\n  border-radius: calc(var(--plyr-range-track-height, 5px)/ 2);\n  height: 5px;\n  height: var(--plyr-range-track-height, 5px)\n}\n\n.plyr--full-ui input[type=range]::-ms-track {\n  background: 0 0;\n  border: 0;\n  border-radius: calc(5px / 2);\n  border-radius: calc(var(--plyr-range-track-height, 5px)/ 2);\n  height: 5px;\n  height: var(--plyr-range-track-height, 5px);\n  -ms-transition: box-shadow .3s ease;\n  transition: box-shadow .3s ease;\n  -ms-user-select: none;\n  user-select: none;\n  color: transparent\n}\n\n.plyr--full-ui input[type=range]::-ms-fill-upper {\n  background: 0 0;\n  border: 0;\n  border-radius: calc(5px / 2);\n  border-radius: calc(var(--plyr-range-track-height, 5px)/ 2);\n  height: 5px;\n  height: var(--plyr-range-track-height, 5px);\n  -ms-transition: box-shadow .3s ease;\n  transition: box-shadow .3s ease;\n  -ms-user-select: none;\n  user-select: none\n}\n\n.plyr--full-ui input[type=range]::-ms-fill-lower {\n  background: 0 0;\n  border: 0;\n  border-radius: calc(5px / 2);\n  border-radius: calc(var(--plyr-range-track-height, 5px)/ 2);\n  height: 5px;\n  height: var(--plyr-range-track-height, 5px);\n  -ms-transition: box-shadow .3s ease;\n  transition: box-shadow .3s ease;\n  -ms-user-select: none;\n  user-select: none;\n  background: currentColor\n}\n\n.plyr--full-ui input[type=range]::-ms-thumb {\n  background: #fff;\n  background: var(--plyr-range-thumb-background, #fff);\n  border: 0;\n  border-radius: 100%;\n  box-shadow: 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2);\n  box-shadow: var(--plyr-range-thumb-shadow, 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2));\n  height: 13px;\n  height: var(--plyr-range-thumb-height, 13px);\n  position: relative;\n  -ms-transition: all .2s ease;\n  transition: all .2s ease;\n  width: 13px;\n  width: var(--plyr-range-thumb-height, 13px);\n  margin-top: 0\n}\n\n.plyr--full-ui input[type=range]::-ms-tooltip {\n  display: none\n}\n\n.plyr--full-ui input[type=range]:focus {\n  outline: 0\n}\n\n.plyr--full-ui input[type=range]::-moz-focus-outer {\n  border: 0\n}\n\n.plyr--full-ui input[type=range].plyr__tab-focus::-webkit-slider-runnable-track {\n  outline-color: #00b3ff;\n  outline-color: var(--plyr-tab-focus-color, var(--plyr-color-main, var(--plyr-color-main, #00b3ff)));\n  outline-offset: 2px;\n  outline-style: dotted;\n  outline-width: 3px\n}\n\n.plyr--full-ui input[type=range].plyr__tab-focus::-moz-range-track {\n  outline-color: #00b3ff;\n  outline-color: var(--plyr-tab-focus-color, var(--plyr-color-main, var(--plyr-color-main, #00b3ff)));\n  outline-offset: 2px;\n  outline-style: dotted;\n  outline-width: 3px\n}\n\n.plyr--full-ui input[type=range].plyr__tab-focus::-ms-track {\n  outline-color: #00b3ff;\n  outline-color: var(--plyr-tab-focus-color, var(--plyr-color-main, var(--plyr-color-main, #00b3ff)));\n  outline-offset: 2px;\n  outline-style: dotted;\n  outline-width: 3px\n}\n\n.plyr__poster {\n  background-color: #000;\n  background-position: 50% 50%;\n  background-repeat: no-repeat;\n  background-size: contain;\n  height: 100%;\n  left: 0;\n  opacity: 0;\n  position: absolute;\n  top: 0;\n  transition: opacity .2s ease;\n  width: 100%;\n  z-index: 1\n}\n\n.plyr--stopped.plyr__poster-enabled .plyr__poster {\n  opacity: 1\n}\n\n.plyr__time {\n  font-size: 13px;\n  font-size: var(--plyr-font-size-time, var(--plyr-font-size-small, 13px))\n}\n\n.plyr__time+.plyr__time::before {\n  content: '\\2044';\n  margin-right: 10px;\n  margin-right: var(--plyr-control-spacing, 10px)\n}\n\n@media (max-width:calc(768px - 1px)) {\n  .plyr__time+.plyr__time {\n    display: none\n  }\n}\n\n.plyr__tooltip {\n  background: rgba(255, 255, 255, .9);\n  background: var(--plyr-tooltip-background, rgba(255, 255, 255, .9));\n  border-radius: 3px;\n  border-radius: var(--plyr-tooltip-radius, 3px);\n  bottom: 100%;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, .15);\n  box-shadow: var(--plyr-tooltip-shadow, 0 1px 2px rgba(0, 0, 0, .15));\n  color: #4a5464;\n  color: var(--plyr-tooltip-color, #4a5464);\n  font-size: 13px;\n  font-size: var(--plyr-font-size-small, 13px);\n  font-weight: 400;\n  font-weight: var(--plyr-font-weight-regular, 400);\n  left: 50%;\n  line-height: 1.3;\n  margin-bottom: calc(calc(10px / 2) * 2);\n  margin-bottom: calc(calc(var(--plyr-control-spacing, 10px)/ 2) * 2);\n  opacity: 0;\n  padding: calc(10px / 2) calc(calc(10px / 2) * 1.5);\n  padding: calc(var(--plyr-control-spacing, 10px)/ 2) calc(calc(var(--plyr-control-spacing, 10px)/ 2) * 1.5);\n  pointer-events: none;\n  position: absolute;\n  transform: translate(-50%, 10px) scale(.8);\n  transform-origin: 50% 100%;\n  transition: transform .2s .1s ease, opacity .2s .1s ease;\n  white-space: nowrap;\n  z-index: 2\n}\n\n.plyr__tooltip::before {\n  border-left: 4px solid transparent;\n  border-left: var(--plyr-tooltip-arrow-size, 4px) solid transparent;\n  border-right: 4px solid transparent;\n  border-right: var(--plyr-tooltip-arrow-size, 4px) solid transparent;\n  border-top: 4px solid rgba(255, 255, 255, .9);\n  border-top: var(--plyr-tooltip-arrow-size, 4px) solid var(--plyr-tooltip-background, rgba(255, 255, 255, .9));\n  bottom: calc(4px * -1);\n  bottom: calc(var(--plyr-tooltip-arrow-size, 4px) * -1);\n  content: '';\n  height: 0;\n  left: 50%;\n  position: absolute;\n  transform: translateX(-50%);\n  width: 0;\n  z-index: 2\n}\n\n.plyr .plyr__control.plyr__tab-focus .plyr__tooltip,\n.plyr .plyr__control:hover .plyr__tooltip,\n.plyr__tooltip--visible {\n  opacity: 1;\n  transform: translate(-50%, 0) scale(1)\n}\n\n.plyr .plyr__control:hover .plyr__tooltip {\n  z-index: 3\n}\n\n.plyr__controls>.plyr__control:first-child .plyr__tooltip,\n.plyr__controls>.plyr__control:first-child+.plyr__control .plyr__tooltip {\n  left: 0;\n  transform: translate(0, 10px) scale(.8);\n  transform-origin: 0 100%\n}\n\n.plyr__controls>.plyr__control:first-child .plyr__tooltip::before,\n.plyr__controls>.plyr__control:first-child+.plyr__control .plyr__tooltip::before {\n  left: calc((18px / 2) + calc(10px * .7));\n  left: calc((var(--plyr-control-icon-size, 18px)/ 2) + calc(var(--plyr-control-spacing, 10px) * .7))\n}\n\n.plyr__controls>.plyr__control:last-child .plyr__tooltip {\n  left: auto;\n  right: 0;\n  transform: translate(0, 10px) scale(.8);\n  transform-origin: 100% 100%\n}\n\n.plyr__controls>.plyr__control:last-child .plyr__tooltip::before {\n  left: auto;\n  right: calc((18px / 2) + calc(10px * .7));\n  right: calc((var(--plyr-control-icon-size, 18px)/ 2) + calc(var(--plyr-control-spacing, 10px) * .7));\n  transform: translateX(50%)\n}\n\n.plyr__controls>.plyr__control:first-child .plyr__tooltip--visible,\n.plyr__controls>.plyr__control:first-child+.plyr__control .plyr__tooltip--visible,\n.plyr__controls>.plyr__control:first-child+.plyr__control.plyr__tab-focus .plyr__tooltip,\n.plyr__controls>.plyr__control:first-child+.plyr__control:hover .plyr__tooltip,\n.plyr__controls>.plyr__control:first-child.plyr__tab-focus .plyr__tooltip,\n.plyr__controls>.plyr__control:first-child:hover .plyr__tooltip,\n.plyr__controls>.plyr__control:last-child .plyr__tooltip--visible,\n.plyr__controls>.plyr__control:last-child.plyr__tab-focus .plyr__tooltip,\n.plyr__controls>.plyr__control:last-child:hover .plyr__tooltip {\n  transform: translate(0, 0) scale(1)\n}\n\n.plyr__progress {\n  left: calc(13px * .5);\n  left: calc(var(--plyr-range-thumb-height, 13px) * .5);\n  margin-right: 13px;\n  margin-right: var(--plyr-range-thumb-height, 13px);\n  position: relative\n}\n\n.plyr__progress input[type=range],\n.plyr__progress__buffer {\n  margin-left: calc(13px * -.5);\n  margin-left: calc(var(--plyr-range-thumb-height, 13px) * -.5);\n  margin-right: calc(13px * -.5);\n  margin-right: calc(var(--plyr-range-thumb-height, 13px) * -.5);\n  width: calc(100% + 13px);\n  width: calc(100% + var(--plyr-range-thumb-height, 13px))\n}\n\n.plyr__progress input[type=range] {\n  position: relative;\n  z-index: 2\n}\n\n.plyr__progress .plyr__tooltip {\n  font-size: 13px;\n  font-size: var(--plyr-font-size-time, var(--plyr-font-size-small, 13px));\n  left: 0\n}\n\n.plyr__progress__buffer {\n  -webkit-appearance: none;\n  background: 0 0;\n  border: 0;\n  border-radius: 100px;\n  height: 5px;\n  height: var(--plyr-range-track-height, 5px);\n  left: 0;\n  margin-top: calc((5px / 2) * -1);\n  margin-top: calc((var(--plyr-range-track-height, 5px)/ 2) * -1);\n  padding: 0;\n  position: absolute;\n  top: 50%\n}\n\n.plyr__progress__buffer::-webkit-progress-bar {\n  background: 0 0\n}\n\n.plyr__progress__buffer::-webkit-progress-value {\n  background: currentColor;\n  border-radius: 100px;\n  min-width: 5px;\n  min-width: var(--plyr-range-track-height, 5px);\n  -webkit-transition: width .2s ease;\n  transition: width .2s ease\n}\n\n.plyr__progress__buffer::-moz-progress-bar {\n  background: currentColor;\n  border-radius: 100px;\n  min-width: 5px;\n  min-width: var(--plyr-range-track-height, 5px);\n  -moz-transition: width .2s ease;\n  transition: width .2s ease\n}\n\n.plyr__progress__buffer::-ms-fill {\n  border-radius: 100px;\n  -ms-transition: width .2s ease;\n  transition: width .2s ease\n}\n\n.plyr--loading .plyr__progress__buffer {\n  animation: plyr-progress 1s linear infinite;\n  background-image: linear-gradient(-45deg, rgba(35, 40, 47, .6) 25%, transparent 25%, transparent 50%, rgba(35, 40, 47, .6) 50%, rgba(35, 40, 47, .6) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(-45deg, var(--plyr-progress-loading-background, rgba(35, 40, 47, .6)) 25%, transparent 25%, transparent 50%, var(--plyr-progress-loading-background, rgba(35, 40, 47, .6)) 50%, var(--plyr-progress-loading-background, rgba(35, 40, 47, .6)) 75%, transparent 75%, transparent);\n  background-repeat: repeat-x;\n  background-size: 25px 25px;\n  background-size: var(--plyr-progress-loading-size, 25px) var(--plyr-progress-loading-size, 25px);\n  color: transparent\n}\n\n.plyr--video.plyr--loading .plyr__progress__buffer {\n  background-color: rgba(255, 255, 255, .25);\n  background-color: var(--plyr-video-progress-buffered-background, rgba(255, 255, 255, .25))\n}\n\n.plyr--audio.plyr--loading .plyr__progress__buffer {\n  background-color: rgba(193, 200, 209, .6);\n  background-color: var(--plyr-audio-progress-buffered-background, rgba(193, 200, 209, .6))\n}\n\n.plyr__volume {\n  align-items: center;\n  display: flex;\n  max-width: 110px;\n  min-width: 80px;\n  position: relative;\n  width: 20%\n}\n\n.plyr__volume input[type=range] {\n  margin-left: calc(10px / 2);\n  margin-left: calc(var(--plyr-control-spacing, 10px)/ 2);\n  margin-right: calc(10px / 2);\n  margin-right: calc(var(--plyr-control-spacing, 10px)/ 2);\n  position: relative;\n  z-index: 2\n}\n\n.plyr--is-ios .plyr__volume {\n  min-width: 0;\n  width: auto\n}\n\n.plyr--audio {\n  display: block\n}\n\n.plyr--audio .plyr__controls {\n  background: #fff;\n  background: var(--plyr-audio-controls-background, #fff);\n  border-radius: inherit;\n  color: #4a5464;\n  color: var(--plyr-audio-control-color, #4a5464);\n  padding: 10px;\n  padding: var(--plyr-control-spacing, 10px)\n}\n\n.plyr--audio .plyr__control.plyr__tab-focus,\n.plyr--audio .plyr__control:hover,\n.plyr--audio .plyr__control[aria-expanded=true] {\n  background: #00b3ff;\n  background: var(--plyr-audio-control-background-hover, var(--plyr-color-main, var(--plyr-color-main, #00b3ff)));\n  color: #fff;\n  color: var(--plyr-audio-control-color-hover, #fff)\n}\n\n.plyr--full-ui.plyr--audio input[type=range]::-webkit-slider-runnable-track {\n  background-color: rgba(193, 200, 209, .6);\n  background-color: var(--plyr-audio-range-track-background, var(--plyr-audio-progress-buffered-background, rgba(193, 200, 209, .6)))\n}\n\n.plyr--full-ui.plyr--audio input[type=range]::-moz-range-track {\n  background-color: rgba(193, 200, 209, .6);\n  background-color: var(--plyr-audio-range-track-background, var(--plyr-audio-progress-buffered-background, rgba(193, 200, 209, .6)))\n}\n\n.plyr--full-ui.plyr--audio input[type=range]::-ms-track {\n  background-color: rgba(193, 200, 209, .6);\n  background-color: var(--plyr-audio-range-track-background, var(--plyr-audio-progress-buffered-background, rgba(193, 200, 209, .6)))\n}\n\n.plyr--full-ui.plyr--audio input[type=range]:active::-webkit-slider-thumb {\n  box-shadow: 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2), 0 0 0 3px rgba(35, 40, 47, .1);\n  box-shadow: var(--plyr-range-thumb-shadow, 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2)), 0 0 0 var(--plyr-range-thumb-active-shadow-width, 3px) var(--plyr-audio-range-thumb-active-shadow-color, rgba(35, 40, 47, .1))\n}\n\n.plyr--full-ui.plyr--audio input[type=range]:active::-moz-range-thumb {\n  box-shadow: 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2), 0 0 0 3px rgba(35, 40, 47, .1);\n  box-shadow: var(--plyr-range-thumb-shadow, 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2)), 0 0 0 var(--plyr-range-thumb-active-shadow-width, 3px) var(--plyr-audio-range-thumb-active-shadow-color, rgba(35, 40, 47, .1))\n}\n\n.plyr--full-ui.plyr--audio input[type=range]:active::-ms-thumb {\n  box-shadow: 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2), 0 0 0 3px rgba(35, 40, 47, .1);\n  box-shadow: var(--plyr-range-thumb-shadow, 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2)), 0 0 0 var(--plyr-range-thumb-active-shadow-width, 3px) var(--plyr-audio-range-thumb-active-shadow-color, rgba(35, 40, 47, .1))\n}\n\n.plyr--audio .plyr__progress__buffer {\n  color: rgba(193, 200, 209, .6);\n  color: var(--plyr-audio-progress-buffered-background, rgba(193, 200, 209, .6))\n}\n\n.plyr--video {\n  background: #000;\n  overflow: hidden\n}\n\n.plyr--video.plyr--menu-open {\n  overflow: visible\n}\n\n.plyr__video-wrapper {\n  background: #000;\n  height: 100%;\n  margin: auto;\n  overflow: hidden;\n  position: relative;\n  width: 100%\n}\n\n.plyr__video-embed,\n.plyr__video-wrapper--fixed-ratio {\n  height: 0;\n  padding-bottom: 56.25%\n}\n\n.plyr__video-embed iframe,\n.plyr__video-wrapper--fixed-ratio video {\n  border: 0;\n  left: 0;\n  position: absolute;\n  top: 0\n}\n\n.plyr--full-ui .plyr__video-embed>.plyr__video-embed__container {\n  padding-bottom: 240%;\n  position: relative;\n  transform: translateY(-38.28125%)\n}\n\n.plyr--video .plyr__controls {\n  background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .75));\n  background: var(--plyr-video-controls-background, linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, .75)));\n  border-bottom-left-radius: inherit;\n  border-bottom-right-radius: inherit;\n  bottom: 0;\n  color: #fff;\n  color: var(--plyr-video-control-color, #fff);\n  left: 0;\n  padding: calc(10px / 2);\n  padding: calc(var(--plyr-control-spacing, 10px)/ 2);\n  padding-top: calc(10px * 2);\n  padding-top: calc(var(--plyr-control-spacing, 10px) * 2);\n  position: absolute;\n  right: 0;\n  transition: opacity .4s ease-in-out, transform .4s ease-in-out;\n  z-index: 3\n}\n\n@media (min-width:480px) {\n  .plyr--video .plyr__controls {\n    padding: 10px;\n    padding: var(--plyr-control-spacing, 10px);\n    padding-top: calc(10px * 3.5);\n    padding-top: calc(var(--plyr-control-spacing, 10px) * 3.5)\n  }\n}\n\n.plyr--video.plyr--hide-controls .plyr__controls {\n  opacity: 0;\n  pointer-events: none;\n  transform: translateY(100%)\n}\n\n.plyr--video .plyr__control.plyr__tab-focus,\n.plyr--video .plyr__control:hover,\n.plyr--video .plyr__control[aria-expanded=true] {\n  background: #00b3ff;\n  background: var(--plyr-video-control-background-hover, var(--plyr-color-main, var(--plyr-color-main, #00b3ff)));\n  color: #fff;\n  color: var(--plyr-video-control-color-hover, #fff)\n}\n\n.plyr__control--overlaid {\n  background: #00b3ff;\n  background: var(--plyr-video-control-background-hover, var(--plyr-color-main, var(--plyr-color-main, #00b3ff)));\n  border: 0;\n  border-radius: 100%;\n  color: #fff;\n  color: var(--plyr-video-control-color, #fff);\n  display: none;\n  left: 50%;\n  opacity: .9;\n  padding: calc(10px * 1.5);\n  padding: calc(var(--plyr-control-spacing, 10px) * 1.5);\n  position: absolute;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  transition: .3s;\n  z-index: 2\n}\n\n.plyr__control--overlaid svg {\n  left: 2px;\n  position: relative\n}\n\n.plyr__control--overlaid:focus,\n.plyr__control--overlaid:hover {\n  opacity: 1\n}\n\n.plyr--playing .plyr__control--overlaid {\n  opacity: 0;\n  visibility: hidden\n}\n\n.plyr--full-ui.plyr--video .plyr__control--overlaid {\n  display: block\n}\n\n.plyr--full-ui.plyr--video input[type=range]::-webkit-slider-runnable-track {\n  background-color: rgba(255, 255, 255, .25);\n  background-color: var(--plyr-video-range-track-background, var(--plyr-video-progress-buffered-background, rgba(255, 255, 255, .25)))\n}\n\n.plyr--full-ui.plyr--video input[type=range]::-moz-range-track {\n  background-color: rgba(255, 255, 255, .25);\n  background-color: var(--plyr-video-range-track-background, var(--plyr-video-progress-buffered-background, rgba(255, 255, 255, .25)))\n}\n\n.plyr--full-ui.plyr--video input[type=range]::-ms-track {\n  background-color: rgba(255, 255, 255, .25);\n  background-color: var(--plyr-video-range-track-background, var(--plyr-video-progress-buffered-background, rgba(255, 255, 255, .25)))\n}\n\n.plyr--full-ui.plyr--video input[type=range]:active::-webkit-slider-thumb {\n  box-shadow: 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2), 0 0 0 3px rgba(255, 255, 255, .5);\n  box-shadow: var(--plyr-range-thumb-shadow, 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2)), 0 0 0 var(--plyr-range-thumb-active-shadow-width, 3px) var(--plyr-audio-range-thumb-active-shadow-color, rgba(255, 255, 255, .5))\n}\n\n.plyr--full-ui.plyr--video input[type=range]:active::-moz-range-thumb {\n  box-shadow: 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2), 0 0 0 3px rgba(255, 255, 255, .5);\n  box-shadow: var(--plyr-range-thumb-shadow, 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2)), 0 0 0 var(--plyr-range-thumb-active-shadow-width, 3px) var(--plyr-audio-range-thumb-active-shadow-color, rgba(255, 255, 255, .5))\n}\n\n.plyr--full-ui.plyr--video input[type=range]:active::-ms-thumb {\n  box-shadow: 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2), 0 0 0 3px rgba(255, 255, 255, .5);\n  box-shadow: var(--plyr-range-thumb-shadow, 0 1px 1px rgba(35, 40, 47, .15), 0 0 0 1px rgba(35, 40, 47, .2)), 0 0 0 var(--plyr-range-thumb-active-shadow-width, 3px) var(--plyr-audio-range-thumb-active-shadow-color, rgba(255, 255, 255, .5))\n}\n\n.plyr--video .plyr__progress__buffer {\n  color: rgba(255, 255, 255, .25);\n  color: var(--plyr-video-progress-buffered-background, rgba(255, 255, 255, .25))\n}\n\n.plyr:-webkit-full-screen {\n  background: #000;\n  border-radius: 0 !important;\n  height: 100%;\n  margin: 0;\n  width: 100%\n}\n\n.plyr:-ms-fullscreen {\n  background: #000;\n  border-radius: 0 !important;\n  height: 100%;\n  margin: 0;\n  width: 100%\n}\n\n.plyr:fullscreen {\n  background: #000;\n  border-radius: 0 !important;\n  height: 100%;\n  margin: 0;\n  width: 100%\n}\n\n.plyr:-webkit-full-screen video {\n  height: 100%\n}\n\n.plyr:-ms-fullscreen video {\n  height: 100%\n}\n\n.plyr:fullscreen video {\n  height: 100%\n}\n\n.plyr:-webkit-full-screen .plyr__video-wrapper {\n  height: 100%;\n  position: static\n}\n\n.plyr:-ms-fullscreen .plyr__video-wrapper {\n  height: 100%;\n  position: static\n}\n\n.plyr:fullscreen .plyr__video-wrapper {\n  height: 100%;\n  position: static\n}\n\n.plyr:-webkit-full-screen.plyr--vimeo .plyr__video-wrapper {\n  height: 0;\n  position: relative\n}\n\n.plyr:-ms-fullscreen.plyr--vimeo .plyr__video-wrapper {\n  height: 0;\n  position: relative\n}\n\n.plyr:fullscreen.plyr--vimeo .plyr__video-wrapper {\n  height: 0;\n  position: relative\n}\n\n.plyr:-webkit-full-screen .plyr__control .icon--exit-fullscreen {\n  display: block\n}\n\n.plyr:-ms-fullscreen .plyr__control .icon--exit-fullscreen {\n  display: block\n}\n\n.plyr:fullscreen .plyr__control .icon--exit-fullscreen {\n  display: block\n}\n\n.plyr:-webkit-full-screen .plyr__control .icon--exit-fullscreen+svg {\n  display: none\n}\n\n.plyr:-ms-fullscreen .plyr__control .icon--exit-fullscreen+svg {\n  display: none\n}\n\n.plyr:fullscreen .plyr__control .icon--exit-fullscreen+svg {\n  display: none\n}\n\n.plyr:-webkit-full-screen.plyr--hide-controls {\n  cursor: none\n}\n\n.plyr:-ms-fullscreen.plyr--hide-controls {\n  cursor: none\n}\n\n.plyr:fullscreen.plyr--hide-controls {\n  cursor: none\n}\n\n@media (min-width:1024px) {\n  .plyr:-webkit-full-screen .plyr__captions {\n    font-size: 21px;\n    font-size: var(--plyr-font-size-xlarge, 21px)\n  }\n\n  .plyr:-ms-fullscreen .plyr__captions {\n    font-size: 21px;\n    font-size: var(--plyr-font-size-xlarge, 21px)\n  }\n\n  .plyr:fullscreen .plyr__captions {\n    font-size: 21px;\n    font-size: var(--plyr-font-size-xlarge, 21px)\n  }\n}\n\n.plyr:-webkit-full-screen {\n  background: #000;\n  border-radius: 0 !important;\n  height: 100%;\n  margin: 0;\n  width: 100%\n}\n\n.plyr:-webkit-full-screen video {\n  height: 100%\n}\n\n.plyr:-webkit-full-screen .plyr__video-wrapper {\n  height: 100%;\n  position: static\n}\n\n.plyr:-webkit-full-screen.plyr--vimeo .plyr__video-wrapper {\n  height: 0;\n  position: relative\n}\n\n.plyr:-webkit-full-screen .plyr__control .icon--exit-fullscreen {\n  display: block\n}\n\n.plyr:-webkit-full-screen .plyr__control .icon--exit-fullscreen+svg {\n  display: none\n}\n\n.plyr:-webkit-full-screen.plyr--hide-controls {\n  cursor: none\n}\n\n@media (min-width:1024px) {\n  .plyr:-webkit-full-screen .plyr__captions {\n    font-size: 21px;\n    font-size: var(--plyr-font-size-xlarge, 21px)\n  }\n}\n\n.plyr:-moz-full-screen {\n  background: #000;\n  border-radius: 0 !important;\n  height: 100%;\n  margin: 0;\n  width: 100%\n}\n\n.plyr:-moz-full-screen video {\n  height: 100%\n}\n\n.plyr:-moz-full-screen .plyr__video-wrapper {\n  height: 100%;\n  position: static\n}\n\n.plyr:-moz-full-screen.plyr--vimeo .plyr__video-wrapper {\n  height: 0;\n  position: relative\n}\n\n.plyr:-moz-full-screen .plyr__control .icon--exit-fullscreen {\n  display: block\n}\n\n.plyr:-moz-full-screen .plyr__control .icon--exit-fullscreen+svg {\n  display: none\n}\n\n.plyr:-moz-full-screen.plyr--hide-controls {\n  cursor: none\n}\n\n@media (min-width:1024px) {\n  .plyr:-moz-full-screen .plyr__captions {\n    font-size: 21px;\n    font-size: var(--plyr-font-size-xlarge, 21px)\n  }\n}\n\n.plyr:-ms-fullscreen {\n  background: #000;\n  border-radius: 0 !important;\n  height: 100%;\n  margin: 0;\n  width: 100%\n}\n\n.plyr:-ms-fullscreen video {\n  height: 100%\n}\n\n.plyr:-ms-fullscreen .plyr__video-wrapper {\n  height: 100%;\n  position: static\n}\n\n.plyr:-ms-fullscreen.plyr--vimeo .plyr__video-wrapper {\n  height: 0;\n  position: relative\n}\n\n.plyr:-ms-fullscreen .plyr__control .icon--exit-fullscreen {\n  display: block\n}\n\n.plyr:-ms-fullscreen .plyr__control .icon--exit-fullscreen+svg {\n  display: none\n}\n\n.plyr:-ms-fullscreen.plyr--hide-controls {\n  cursor: none\n}\n\n@media (min-width:1024px) {\n  .plyr:-ms-fullscreen .plyr__captions {\n    font-size: 21px;\n    font-size: var(--plyr-font-size-xlarge, 21px)\n  }\n}\n\n.plyr--fullscreen-fallback {\n  background: #000;\n  border-radius: 0 !important;\n  height: 100%;\n  margin: 0;\n  width: 100%;\n  bottom: 0;\n  display: block;\n  left: 0;\n  position: fixed;\n  right: 0;\n  top: 0;\n  z-index: 10000000\n}\n\n.plyr--fullscreen-fallback video {\n  height: 100%\n}\n\n.plyr--fullscreen-fallback .plyr__video-wrapper {\n  height: 100%;\n  position: static\n}\n\n.plyr--fullscreen-fallback.plyr--vimeo .plyr__video-wrapper {\n  height: 0;\n  position: relative\n}\n\n.plyr--fullscreen-fallback .plyr__control .icon--exit-fullscreen {\n  display: block\n}\n\n.plyr--fullscreen-fallback .plyr__control .icon--exit-fullscreen+svg {\n  display: none\n}\n\n.plyr--fullscreen-fallback.plyr--hide-controls {\n  cursor: none\n}\n\n@media (min-width:1024px) {\n  .plyr--fullscreen-fallback .plyr__captions {\n    font-size: 21px;\n    font-size: var(--plyr-font-size-xlarge, 21px)\n  }\n}\n\n.plyr__ads {\n  border-radius: inherit;\n  bottom: 0;\n  cursor: pointer;\n  left: 0;\n  overflow: hidden;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: -1\n}\n\n.plyr__ads>div,\n.plyr__ads>div iframe {\n  height: 100%;\n  position: absolute;\n  width: 100%\n}\n\n.plyr__ads::after {\n  background: #23282f;\n  border-radius: 2px;\n  bottom: 10px;\n  bottom: var(--plyr-control-spacing, 10px);\n  color: #fff;\n  content: attr(data-badge-text);\n  font-size: 11px;\n  padding: 2px 6px;\n  pointer-events: none;\n  position: absolute;\n  right: 10px;\n  right: var(--plyr-control-spacing, 10px);\n  z-index: 3\n}\n\n.plyr__ads::after:empty {\n  display: none\n}\n\n.plyr__cues {\n  background: currentColor;\n  display: block;\n  height: 5px;\n  height: var(--plyr-range-track-height, 5px);\n  left: 0;\n  margin: -var(--plyr-range-track-height, 5px)/2 0 0;\n  opacity: .8;\n  position: absolute;\n  top: 50%;\n  width: 3px;\n  z-index: 3\n}\n\n.plyr__preview-thumb {\n  background-color: rgba(255, 255, 255, .9);\n  background-color: var(--plyr-tooltip-background, rgba(255, 255, 255, .9));\n  border-radius: 3px;\n  bottom: 100%;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, .15);\n  box-shadow: var(--plyr-tooltip-shadow, 0 1px 2px rgba(0, 0, 0, .15));\n  margin-bottom: calc(calc(10px / 2) * 2);\n  margin-bottom: calc(calc(var(--plyr-control-spacing, 10px)/ 2) * 2);\n  opacity: 0;\n  padding: 3px;\n  padding: var(--plyr-tooltip-radius, 3px);\n  pointer-events: none;\n  position: absolute;\n  transform: translate(0, 10px) scale(.8);\n  transform-origin: 50% 100%;\n  transition: transform .2s .1s ease, opacity .2s .1s ease;\n  z-index: 2\n}\n\n.plyr__preview-thumb--is-shown {\n  opacity: 1;\n  transform: translate(0, 0) scale(1)\n}\n\n.plyr__preview-thumb::before {\n  border-left: 4px solid transparent;\n  border-left: var(--plyr-tooltip-arrow-size, 4px) solid transparent;\n  border-right: 4px solid transparent;\n  border-right: var(--plyr-tooltip-arrow-size, 4px) solid transparent;\n  border-top: 4px solid rgba(255, 255, 255, .9);\n  border-top: var(--plyr-tooltip-arrow-size, 4px) solid var(--plyr-tooltip-background, rgba(255, 255, 255, .9));\n  bottom: calc(4px * -1);\n  bottom: calc(var(--plyr-tooltip-arrow-size, 4px) * -1);\n  content: '';\n  height: 0;\n  left: 50%;\n  position: absolute;\n  transform: translateX(-50%);\n  width: 0;\n  z-index: 2\n}\n\n.plyr__preview-thumb__image-container {\n  background: #c1c8d1;\n  border-radius: calc(3px - 1px);\n  border-radius: calc(var(--plyr-tooltip-radius, 3px) - 1px);\n  overflow: hidden;\n  position: relative;\n  z-index: 0\n}\n\n.plyr__preview-thumb__image-container img {\n  height: 100%;\n  left: 0;\n  max-height: none;\n  max-width: none;\n  position: absolute;\n  top: 0;\n  width: 100%\n}\n\n.plyr__preview-thumb__time-container {\n  bottom: 6px;\n  left: 0;\n  position: absolute;\n  right: 0;\n  white-space: nowrap;\n  z-index: 3\n}\n\n.plyr__preview-thumb__time-container span {\n  background-color: rgba(0, 0, 0, .55);\n  border-radius: calc(3px - 1px);\n  border-radius: calc(var(--plyr-tooltip-radius, 3px) - 1px);\n  color: #fff;\n  font-size: 13px;\n  font-size: var(--plyr-font-size-time, var(--plyr-font-size-small, 13px));\n  padding: 3px 6px\n}\n\n.plyr__preview-scrubbing {\n  bottom: 0;\n  filter: blur(1px);\n  height: 100%;\n  left: 0;\n  margin: auto;\n  opacity: 0;\n  overflow: hidden;\n  pointer-events: none;\n  position: absolute;\n  right: 0;\n  top: 0;\n  transition: opacity .3s ease;\n  width: 100%;\n  z-index: 1\n}\n\n.plyr__preview-scrubbing--is-shown {\n  opacity: 1\n}\n\n.plyr__preview-scrubbing img {\n  height: 100%;\n  left: 0;\n  max-height: none;\n  max-width: none;\n  object-fit: contain;\n  position: absolute;\n  top: 0;\n  width: 100%\n}\n\n.plyr--no-transition {\n  transition: none !important\n}\n\n.plyr__sr-only {\n  clip: rect(1px, 1px, 1px, 1px);\n  overflow: hidden;\n  border: 0 !important;\n  height: 1px !important;\n  padding: 0 !important;\n  position: absolute !important;\n  width: 1px !important\n}\n\n.plyr [hidden] {\n  display: none !important\n}\n\n.bettertv-fix {\n  list-style-type: none;\n}", ""])
// Exports
/* harmony default export */ __webpack_exports__["Z"] = (___CSS_LOADER_EXPORT___)


        /***/
}),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/***/ (function (module, __unused_webpack_exports, __webpack_require__) {



        var isOldIE = function isOldIE() {
          var memo
          return function memorize() {
            if (typeof memo === 'undefined') {
              // Test for IE <= 9 as proposed by Browserhacks
              // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
              // Tests for existence of standard globals is to allow style-loader
              // to operate correctly into non-standard environments
              // @see https://github.com/webpack-contrib/style-loader/issues/177
              memo = Boolean(window && document && document.all && !window.atob)
            }

            return memo
          }
        }()

        var getTarget = function getTarget() {
          var memo = {}
          return function memorize(target) {
            if (typeof memo[target] === 'undefined') {
              var styleTarget = document.querySelector(target) // Special case to return head of iframe instead of iframe itself

              if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
                try {
                  // This will throw an exception if access to iframe is blocked
                  // due to cross-origin restrictions
                  styleTarget = styleTarget.contentDocument.head
                } catch (e) {
                  // istanbul ignore next
                  styleTarget = null
                }
              }

              memo[target] = styleTarget
            }

            return memo[target]
          }
        }()

        var stylesInDom = []

        function getIndexByIdentifier(identifier) {
          var result = -1

          for (var i = 0; i < stylesInDom.length; i++) {
            if (stylesInDom[i].identifier === identifier) {
              result = i
              break
            }
          }

          return result
        }

        function modulesToDom(list, options) {
          var idCountMap = {}
          var identifiers = []

          for (var i = 0; i < list.length; i++) {
            var item = list[i]
            var id = options.base ? item[0] + options.base : item[0]
            var count = idCountMap[id] || 0
            var identifier = "".concat(id, " ").concat(count)
            idCountMap[id] = count + 1
            var index = getIndexByIdentifier(identifier)
            var obj = {
              css: item[1],
              media: item[2],
              sourceMap: item[3]
            }

            if (index !== -1) {
              stylesInDom[index].references++
              stylesInDom[index].updater(obj)
            } else {
              stylesInDom.push({
                identifier: identifier,
                updater: addStyle(obj, options),
                references: 1
              })
            }

            identifiers.push(identifier)
          }

          return identifiers
        }

        function insertStyleElement(options) {
          var style = document.createElement('style')
          var attributes = options.attributes || {}

          if (typeof attributes.nonce === 'undefined') {
            var nonce = true ? __webpack_require__.nc : 0

            if (nonce) {
              attributes.nonce = nonce
            }
          }

          Object.keys(attributes).forEach(function (key) {
            style.setAttribute(key, attributes[key])
          })

          if (typeof options.insert === 'function') {
            options.insert(style)
          } else {
            var target = getTarget(options.insert || 'head')

            if (!target) {
              throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.")
            }

            target.appendChild(style)
          }

          return style
        }

        function removeStyleElement(style) {
          // istanbul ignore if
          if (style.parentNode === null) {
            return false
          }

          style.parentNode.removeChild(style)
        }
        /* istanbul ignore next  */


        var replaceText = function replaceText() {
          var textStore = []
          return function replace(index, replacement) {
            textStore[index] = replacement
            return textStore.filter(Boolean).join('\n')
          }
        }()

        function applyToSingletonTag(style, index, remove, obj) {
          var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css // For old IE

          /* istanbul ignore if  */

          if (style.styleSheet) {
            style.styleSheet.cssText = replaceText(index, css)
          } else {
            var cssNode = document.createTextNode(css)
            var childNodes = style.childNodes

            if (childNodes[index]) {
              style.removeChild(childNodes[index])
            }

            if (childNodes.length) {
              style.insertBefore(cssNode, childNodes[index])
            } else {
              style.appendChild(cssNode)
            }
          }
        }

        function applyToTag(style, options, obj) {
          var css = obj.css
          var media = obj.media
          var sourceMap = obj.sourceMap

          if (media) {
            style.setAttribute('media', media)
          } else {
            style.removeAttribute('media')
          }

          if (sourceMap && typeof btoa !== 'undefined') {
            css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */")
          } // For old IE

          /* istanbul ignore if  */


          if (style.styleSheet) {
            style.styleSheet.cssText = css
          } else {
            while (style.firstChild) {
              style.removeChild(style.firstChild)
            }

            style.appendChild(document.createTextNode(css))
          }
        }

        var singleton = null
        var singletonCounter = 0

        function addStyle(obj, options) {
          var style
          var update
          var remove

          if (options.singleton) {
            var styleIndex = singletonCounter++
            style = singleton || (singleton = insertStyleElement(options))
            update = applyToSingletonTag.bind(null, style, styleIndex, false)
            remove = applyToSingletonTag.bind(null, style, styleIndex, true)
          } else {
            style = insertStyleElement(options)
            update = applyToTag.bind(null, style, options)

            remove = function remove() {
              removeStyleElement(style)
            }
          }

          update(obj)
          return function updateStyle(newObj) {
            if (newObj) {
              if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
                return
              }

              update(obj = newObj)
            } else {
              remove()
            }
          }
        }

        module.exports = function (list, options) {
          options = options || {} // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
          // tags it will allow on a page

          if (!options.singleton && typeof options.singleton !== 'boolean') {
            options.singleton = isOldIE()
          }

          list = list || []
          var lastIdentifiers = modulesToDom(list, options)
          return function update(newList) {
            newList = newList || []

            if (Object.prototype.toString.call(newList) !== '[object Array]') {
              return
            }

            for (var i = 0; i < lastIdentifiers.length; i++) {
              var identifier = lastIdentifiers[i]
              var index = getIndexByIdentifier(identifier)
              stylesInDom[index].references--
            }

            var newLastIdentifiers = modulesToDom(newList, options)

            for (var _i = 0; _i < lastIdentifiers.length; _i++) {
              var _identifier = lastIdentifiers[_i]

              var _index = getIndexByIdentifier(_identifier)

              if (stylesInDom[_index].references === 0) {
                stylesInDom[_index].updater()

                stylesInDom.splice(_index, 1)
              }
            }

            lastIdentifiers = newLastIdentifiers
          }
        }

        /***/
})

    /******/
})
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId]
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports
      /******/
}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
      /******/
}
/******/
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__)
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports
    /******/
}
/******/
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function () {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function (module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function () { return module['default'] } :
/******/ 				function () { return module }
/******/ 			__webpack_require__.d(getter, { a: getter })
/******/ 			return getter
      /******/
}
    /******/
}()
/******/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function () {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function (exports, definition) {
/******/ 			for (var key in definition) {
/******/ 				if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] })
          /******/
}
        /******/
}
      /******/
}
    /******/
}()
/******/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function () {
/******/ 		__webpack_require__.o = function (obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop) }
    /******/
}()
/******/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function () {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function (exports) {
/******/ 			if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
        /******/
}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true })
      /******/
}
    /******/
}()
  /******/
  /************************************************************************/
  var __webpack_exports__ = {}
  // This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
  !function () {

    // NAMESPACE OBJECT: ./node_modules/underscore/modules/index.js
    var modules_namespaceObject = {}
    __webpack_require__.r(modules_namespaceObject)
    __webpack_require__.d(modules_namespaceObject, {
      "VERSION": function () { return VERSION },
      "after": function () { return after },
      "all": function () { return every },
      "allKeys": function () { return allKeys },
      "any": function () { return some },
      "assign": function () { return extendOwn },
      "before": function () { return before },
      "bind": function () { return bind },
      "bindAll": function () { return bindAll },
      "chain": function () { return chain },
      "chunk": function () { return chunk },
      "clone": function () { return clone },
      "collect": function () { return map },
      "compact": function () { return compact },
      "compose": function () { return compose },
      "constant": function () { return constant },
      "contains": function () { return contains },
      "countBy": function () { return countBy },
      "create": function () { return create },
      "debounce": function () { return debounce },
      "default": function () { return underscore_array_methods },
      "defaults": function () { return defaults },
      "defer": function () { return defer },
      "delay": function () { return delay },
      "detect": function () { return find },
      "difference": function () { return difference },
      "drop": function () { return rest },
      "each": function () { return each },
      "escape": function () { return modules_escape },
      "every": function () { return every },
      "extend": function () { return extend },
      "extendOwn": function () { return extendOwn },
      "filter": function () { return filter },
      "find": function () { return find },
      "findIndex": function () { return findIndex },
      "findKey": function () { return findKey },
      "findLastIndex": function () { return findLastIndex },
      "findWhere": function () { return findWhere },
      "first": function () { return first },
      "flatten": function () { return flatten_flatten },
      "foldl": function () { return reduce },
      "foldr": function () { return reduceRight },
      "forEach": function () { return each },
      "functions": function () { return functions },
      "get": function () { return get },
      "groupBy": function () { return groupBy },
      "has": function () { return has_has },
      "head": function () { return first },
      "identity": function () { return identity },
      "include": function () { return contains },
      "includes": function () { return contains },
      "indexBy": function () { return indexBy },
      "indexOf": function () { return indexOf },
      "initial": function () { return initial },
      "inject": function () { return reduce },
      "intersection": function () { return intersection },
      "invert": function () { return invert },
      "invoke": function () { return invoke },
      "isArguments": function () { return modules_isArguments },
      "isArray": function () { return isArray },
      "isArrayBuffer": function () { return isArrayBuffer },
      "isBoolean": function () { return isBoolean },
      "isDataView": function () { return modules_isDataView },
      "isDate": function () { return isDate },
      "isElement": function () { return isElement },
      "isEmpty": function () { return isEmpty },
      "isEqual": function () { return isEqual },
      "isError": function () { return isError },
      "isFinite": function () { return isFinite_isFinite },
      "isFunction": function () { return modules_isFunction },
      "isMap": function () { return isMap },
      "isMatch": function () { return isMatch },
      "isNaN": function () { return isNaN_isNaN },
      "isNull": function () { return isNull },
      "isNumber": function () { return isNumber },
      "isObject": function () { return isObject },
      "isRegExp": function () { return isRegExp },
      "isSet": function () { return isSet },
      "isString": function () { return isString },
      "isSymbol": function () { return isSymbol },
      "isTypedArray": function () { return modules_isTypedArray },
      "isUndefined": function () { return isUndefined },
      "isWeakMap": function () { return isWeakMap },
      "isWeakSet": function () { return isWeakSet },
      "iteratee": function () { return iteratee },
      "keys": function () { return keys },
      "last": function () { return last },
      "lastIndexOf": function () { return lastIndexOf },
      "map": function () { return map },
      "mapObject": function () { return mapObject },
      "matcher": function () { return matcher },
      "matches": function () { return matcher },
      "max": function () { return max },
      "memoize": function () { return memoize },
      "methods": function () { return functions },
      "min": function () { return min },
      "mixin": function () { return mixin },
      "negate": function () { return negate },
      "noop": function () { return noop },
      "now": function () { return now },
      "object": function () { return object },
      "omit": function () { return omit },
      "once": function () { return once },
      "pairs": function () { return pairs },
      "partial": function () { return modules_partial },
      "partition": function () { return partition },
      "pick": function () { return pick },
      "pluck": function () { return pluck },
      "property": function () { return property },
      "propertyOf": function () { return propertyOf },
      "random": function () { return random },
      "range": function () { return range },
      "reduce": function () { return reduce },
      "reduceRight": function () { return reduceRight },
      "reject": function () { return reject },
      "rest": function () { return rest },
      "restArguments": function () { return restArguments },
      "result": function () { return result },
      "sample": function () { return sample },
      "select": function () { return filter },
      "shuffle": function () { return shuffle },
      "size": function () { return size },
      "some": function () { return some },
      "sortBy": function () { return sortBy },
      "sortedIndex": function () { return sortedIndex },
      "tail": function () { return rest },
      "take": function () { return first },
      "tap": function () { return tap },
      "template": function () { return template },
      "templateSettings": function () { return templateSettings },
      "throttle": function () { return throttle },
      "times": function () { return times },
      "toArray": function () { return toArray },
      "toPath": function () { return toPath },
      "transpose": function () { return unzip },
      "unescape": function () { return modules_unescape },
      "union": function () { return union },
      "uniq": function () { return uniq },
      "unique": function () { return uniq },
      "uniqueId": function () { return uniqueId },
      "unzip": function () { return unzip },
      "values": function () { return values },
      "where": function () { return where },
      "without": function () { return without },
      "wrap": function () { return wrap },
      "zip": function () { return zip }
    });

    ;// CONCATENATED MODULE: ./src/utils.ts
    /* eslint-disable no-undef */
    // const TAG = '[Twitch VOD Unblocker]'
    const getVideoPlayer = () => [...document.getElementsByClassName('video-player')].pop()
    // Should always succeed in first try
    const waitForPlayerElement = () => {
      return new Promise((resolve, reject) => {
        const player = getVideoPlayer()
        if (player) {
          resolve(player)
          return
        }
        // 10 secs max
        let maxTries = 10
        const playerCheckInterval = setInterval(() => {
          if (maxTries <= 0) {
            clearInterval(playerCheckInterval)
            reject(new Error('PLAYER NOT FOUND, BYE.'))
          }
          const player = getVideoPlayer()
          if (player) {
            clearInterval(playerCheckInterval)
            resolve(player)
          }
          maxTries -= 1
        }, 1000)
      })
    }
    const parseDuration = (seconds) => {
      if (seconds < 3600) {
        return new Date(seconds * 1000).toISOString().substr(14, 5)
      }
      return new Date(seconds * 1000).toISOString().substr(11, 8)
    }
    const gqlHeaders = new Headers()
    gqlHeaders.append('Client-ID', 'kimne78kx3ncx6brgo4mv6wki5h1ko')
    gqlHeaders.append('Content-Type', 'application/json')
    const apiHeaders = new Headers()
    apiHeaders.append('Accept', 'application/vnd.twitchtv.v5+json')
    apiHeaders.append('Client-ID', 'kimne78kx3ncx6brgo4mv6wki5h1ko')
    function getGqlHeaders() { return gqlHeaders }
    function getApiHeaders() { return apiHeaders }

    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_setup.js
    // Current version.
    var VERSION = '1.13.1' // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.

    var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global || Function('return this')() || {} // Save bytes in the minified (but not gzipped) version:

    var ArrayProto = Array.prototype,
      ObjProto = Object.prototype
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null // Create quick reference variables for speed access to core prototypes.

    var push = ArrayProto.push,
      slice = ArrayProto.slice,
      _setup_toString = ObjProto.toString,
      _setup_hasOwnProperty = ObjProto.hasOwnProperty // Modern feature detection.

    var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
      supportsDataView = typeof DataView !== 'undefined' // All **ECMAScript 5+** native function implementations that we hope to use
    // are declared here.

    var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create,
      nativeIsView = supportsArrayBuffer && ArrayBuffer.isView // Create references to these builtin functions because we override them.

    var _isNaN = isNaN,
      _isFinite = isFinite // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.

    var hasEnumBug = !{
      toString: null
    }.propertyIsEnumerable('toString')
    var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'] // The largest integer that can be represented exactly.

    var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/restArguments.js
    // Some functions take a variable number of arguments, or a few expected
    // arguments at the beginning and then a variable number of values to operate
    // on. This helper accumulates all remaining arguments past the function’s
    // argument length (or an explicit `startIndex`), into an array that becomes
    // the last argument. Similar to ES6’s "rest parameter".
    function restArguments(func, startIndex) {
      startIndex = startIndex == null ? func.length - 1 : +startIndex
      return function () {
        var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0

        for (; index < length; index++) {
          rest[index] = arguments[index + startIndex]
        }

        switch (startIndex) {
          case 0:
            return func.call(this, rest)

          case 1:
            return func.call(this, arguments[0], rest)

          case 2:
            return func.call(this, arguments[0], arguments[1], rest)
        }

        var args = Array(startIndex + 1)

        for (index = 0; index < startIndex; index++) {
          args[index] = arguments[index]
        }

        args[startIndex] = rest
        return func.apply(this, args)
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isObject.js
    // Is a given variable an object?
    function isObject(obj) {
      var type = typeof obj
      return type === 'function' || type === 'object' && !!obj
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isNull.js
    // Is a given value equal to null?
    function isNull(obj) {
      return obj === null
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isUndefined.js
    // Is a given variable undefined?
    function isUndefined(obj) {
      return obj === void 0
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isBoolean.js
    // Is a given value a boolean?

    function isBoolean(obj) {
      return obj === true || obj === false || _setup_toString.call(obj) === '[object Boolean]'
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isElement.js
    // Is a given value a DOM element?
    function isElement(obj) {
      return !!(obj && obj.nodeType === 1)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_tagTester.js
    // Internal function for creating a `toString`-based type tester.

    function tagTester(name) {
      var tag = '[object ' + name + ']'
      return function (obj) {
        return _setup_toString.call(obj) === tag
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isString.js

/* harmony default export */ var isString = (tagTester('String'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isNumber.js

/* harmony default export */ var isNumber = (tagTester('Number'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isDate.js

/* harmony default export */ var isDate = (tagTester('Date'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isRegExp.js

/* harmony default export */ var isRegExp = (tagTester('RegExp'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isError.js

/* harmony default export */ var isError = (tagTester('Error'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isSymbol.js

/* harmony default export */ var isSymbol = (tagTester('Symbol'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isArrayBuffer.js

/* harmony default export */ var isArrayBuffer = (tagTester('ArrayBuffer'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isFunction.js


    var isFunction = tagTester('Function') // Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
    // v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).

    var nodelist = root.document && root.document.childNodes

    if (true && typeof Int8Array != 'object' && typeof nodelist != 'function') {
      isFunction = function (obj) {
        return typeof obj == 'function' || false
      }
    }

/* harmony default export */ var modules_isFunction = (isFunction);
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_hasObjectTag.js

/* harmony default export */ var _hasObjectTag = (tagTester('Object'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_stringTagBug.js

    // In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
    // In IE 11, the most common among them, this problem also applies to
    // `Map`, `WeakMap` and `Set`.

    var hasStringTagBug = supportsDataView && _hasObjectTag(new DataView(new ArrayBuffer(8))),
      isIE11 = typeof Map !== 'undefined' && _hasObjectTag(new Map());
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isDataView.js




    var isDataView = tagTester('DataView') // In IE 10 - Edge 13, we need a different heuristic
    // to determine whether an object is a `DataView`.

    function ie10IsDataView(obj) {
      return obj != null && modules_isFunction(obj.getInt8) && isArrayBuffer(obj.buffer)
    }

/* harmony default export */ var modules_isDataView = (hasStringTagBug ? ie10IsDataView : isDataView);
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isArray.js

 // Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.

/* harmony default export */ var isArray = (nativeIsArray || tagTester('Array'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_has.js
    // Internal function to check whether `key` is an own property name of `obj`.

    function has(obj, key) {
      return obj != null && _setup_hasOwnProperty.call(obj, key)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isArguments.js


    var isArguments = tagTester('Arguments'); // Define a fallback version of the method in browsers (ahem, IE < 9), where
    // there isn't any inspectable "Arguments" type.

    (function () {
      if (!isArguments(arguments)) {
        isArguments = function (obj) {
          return has(obj, 'callee')
        }
      }
    })()

/* harmony default export */ var modules_isArguments = (isArguments);
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isFinite.js

    // Is a given object a finite number?

    function isFinite_isFinite(obj) {
      return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj))
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isNaN.js

    // Is the given value `NaN`?

    function isNaN_isNaN(obj) {
      return isNumber(obj) && _isNaN(obj)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/constant.js
    // Predicate-generating function. Often useful outside of Underscore.
    function constant(value) {
      return function () {
        return value
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_createSizePropertyCheck.js
    // Common internal logic for `isArrayLike` and `isBufferLike`.

    function createSizePropertyCheck(getSizeProperty) {
      return function (collection) {
        var sizeProperty = getSizeProperty(collection)
        return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_shallowProperty.js
    // Internal helper to generate a function to obtain property `key` from `obj`.
    function shallowProperty(key) {
      return function (obj) {
        return obj == null ? void 0 : obj[key]
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_getByteLength.js
 // Internal helper to obtain the `byteLength` property of an object.

/* harmony default export */ var _getByteLength = (shallowProperty('byteLength'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_isBufferLike.js

 // Internal helper to determine whether we should spend extensive checks against
// `ArrayBuffer` et al.

/* harmony default export */ var _isBufferLike = (createSizePropertyCheck(_getByteLength));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isTypedArray.js



    // Is a given value a typed array?

    var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/

    function isTypedArray(obj) {
      // `ArrayBuffer.isView` is the most future-proof, so use it when available.
      // Otherwise, fall back on the above regular expression.
      return nativeIsView ? nativeIsView(obj) && !modules_isDataView(obj) : _isBufferLike(obj) && typedArrayPattern.test(_setup_toString.call(obj))
    }

/* harmony default export */ var modules_isTypedArray = (supportsArrayBuffer ? isTypedArray : constant(false));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_getLength.js
 // Internal helper to obtain the `length` property of an object.

/* harmony default export */ var _getLength = (shallowProperty('length'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_collectNonEnumProps.js


    // Internal helper to create a simple lookup structure.
    // `collectNonEnumProps` used to depend on `_.contains`, but this led to
    // circular imports. `emulatedSet` is a one-off solution that only works for
    // arrays of strings.

    function emulatedSet(keys) {
      var hash = {}

      for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true

      return {
        contains: function (key) {
          return hash[key]
        },
        push: function (key) {
          hash[key] = true
          return keys.push(key)
        }
      }
    } // Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
    // be iterated by `for key in ...` and thus missed. Extends `keys` in place if
    // needed.


    function collectNonEnumProps(obj, keys) {
      keys = emulatedSet(keys)
      var nonEnumIdx = nonEnumerableProps.length
      var constructor = obj.constructor
      var proto = modules_isFunction(constructor) && constructor.prototype || ObjProto // Constructor is a special case.

      var prop = 'constructor'
      if (has(obj, prop) && !keys.contains(prop)) keys.push(prop)

      while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx]

        if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
          keys.push(prop)
        }
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/keys.js



    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`.

    function keys(obj) {
      if (!isObject(obj)) return []
      if (nativeKeys) return nativeKeys(obj)
      var keys = []

      for (var key in obj) if (has(obj, key)) keys.push(key) // Ahem, IE < 9.


      if (hasEnumBug) collectNonEnumProps(obj, keys)
      return keys
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isEmpty.js




    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.

    function isEmpty(obj) {
      if (obj == null) return true // Skip the more expensive `toString`-based type checks if `obj` has no
      // `.length`.

      var length = _getLength(obj)
      if (typeof length == 'number' && (isArray(obj) || isString(obj) || modules_isArguments(obj))) return length === 0
      return _getLength(keys(obj)) === 0
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isMatch.js
    // Returns whether an object has a given set of `key:value` pairs.

    function isMatch(object, attrs) {
      var _keys = keys(attrs),
        length = _keys.length

      if (object == null) return !length
      var obj = Object(object)

      for (var i = 0; i < length; i++) {
        var key = _keys[i]
        if (attrs[key] !== obj[key] || !(key in obj)) return false
      }

      return true
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/underscore.js
    // If Underscore is called as a function, it returns a wrapped object that can
    // be used OO-style. This wrapper holds altered versions of all functions added
    // through `_.mixin`. Wrapped objects may be chained.

    function _(obj) {
      if (obj instanceof _) return obj
      if (!(this instanceof _)) return new _(obj)
      this._wrapped = obj
    }
    _.VERSION = VERSION // Extracts the result from a wrapped and chained object.

    _.prototype.value = function () {
      return this._wrapped
    } // Provide unwrapping proxies for some methods used in engine operations
    // such as arithmetic and JSON stringification.


    _.prototype.valueOf = _.prototype.toJSON = _.prototype.value

    _.prototype.toString = function () {
      return String(this._wrapped)
    };
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_toBufferView.js
    // Internal function to wrap or shallow-copy an ArrayBuffer,
    // typed array or DataView to a new view, reusing the buffer.

    function toBufferView(bufferSource) {
      return new Uint8Array(bufferSource.buffer || bufferSource, bufferSource.byteOffset || 0, _getByteLength(bufferSource))
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isEqual.js









    // We use this string twice, so give it a name for minification.

    var tagDataView = '[object DataView]' // Internal recursive comparison function for `_.isEqual`.

    function eq(a, b, aStack, bStack) {
      // Identical objects are equal. `0 === -0`, but they aren't identical.
      // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
      if (a === b) return a !== 0 || 1 / a === 1 / b // `null` or `undefined` only equal to itself (strict comparison).

      if (a == null || b == null) return false // `NaN`s are equivalent, but non-reflexive.

      if (a !== a) return b !== b // Exhaust primitive checks

      var type = typeof a
      if (type !== 'function' && type !== 'object' && typeof b != 'object') return false
      return deepEq(a, b, aStack, bStack)
    } // Internal recursive comparison function for `_.isEqual`.


    function deepEq(a, b, aStack, bStack) {
      // Unwrap any wrapped objects.
      if (a instanceof _) a = a._wrapped
      if (b instanceof _) b = b._wrapped // Compare `[[Class]]` names.

      var className = _setup_toString.call(a)
      if (className !== _setup_toString.call(b)) return false // Work around a bug in IE 10 - Edge 13.

      if (hasStringTagBug && className == '[object Object]' && modules_isDataView(a)) {
        if (!modules_isDataView(b)) return false
        className = tagDataView
      }

      switch (className) {
        // These types are compared by value.
        case '[object RegExp]': // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')

        case '[object String]':
          // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
          // equivalent to `new String("5")`.
          return '' + a === '' + b

        case '[object Number]':
          // `NaN`s are equivalent, but non-reflexive.
          // Object(NaN) is equivalent to NaN.
          if (+a !== +a) return +b !== +b // An `egal` comparison is performed for other numeric values.

          return +a === 0 ? 1 / +a === 1 / b : +a === +b

        case '[object Date]':
        case '[object Boolean]':
          // Coerce dates and booleans to numeric primitive values. Dates are compared by their
          // millisecond representations. Note that invalid dates with millisecond representations
          // of `NaN` are not equivalent.
          return +a === +b

        case '[object Symbol]':
          return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b)

        case '[object ArrayBuffer]':
        case tagDataView:
          // Coerce to typed array so we can fall through.
          return deepEq(toBufferView(a), toBufferView(b), aStack, bStack)
      }

      var areArrays = className === '[object Array]'

      if (!areArrays && modules_isTypedArray(a)) {
        var byteLength = _getByteLength(a)
        if (byteLength !== _getByteLength(b)) return false
        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true
        areArrays = true
      }

      if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object') return false // Objects with different constructors are not equivalent, but `Object`s or `Array`s
        // from different frames are.

        var aCtor = a.constructor,
          bCtor = b.constructor

        if (aCtor !== bCtor && !(modules_isFunction(aCtor) && aCtor instanceof aCtor && modules_isFunction(bCtor) && bCtor instanceof bCtor) && 'constructor' in a && 'constructor' in b) {
          return false
        }
      } // Assume equality for cyclic structures. The algorithm for detecting cyclic
      // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
      // Initializing stack of traversed objects.
      // It's done here since we only need them for objects and arrays comparison.


      aStack = aStack || []
      bStack = bStack || []
      var length = aStack.length

      while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) return bStack[length] === b
      } // Add the first object to the stack of traversed objects.


      aStack.push(a)
      bStack.push(b) // Recursively compare objects and arrays.

      if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length
        if (length !== b.length) return false // Deep compare the contents, ignoring non-numeric properties.

        while (length--) {
          if (!eq(a[length], b[length], aStack, bStack)) return false
        }
      } else {
        // Deep compare objects.
        var _keys = keys(a),
          key

        length = _keys.length // Ensure that both objects contain the same number of properties before comparing deep equality.

        if (keys(b).length !== length) return false

        while (length--) {
          // Deep compare each member
          key = _keys[length]
          if (!(has(b, key) && eq(a[key], b[key], aStack, bStack))) return false
        }
      } // Remove the first object from the stack of traversed objects.


      aStack.pop()
      bStack.pop()
      return true
    } // Perform a deep comparison to check if two objects are equal.


    function isEqual(a, b) {
      return eq(a, b)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/allKeys.js


    // Retrieve all the enumerable property names of an object.

    function allKeys(obj) {
      if (!isObject(obj)) return []
      var keys = []

      for (var key in obj) keys.push(key) // Ahem, IE < 9.


      if (hasEnumBug) collectNonEnumProps(obj, keys)
      return keys
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_methodFingerprint.js


    // Since the regular `Object.prototype.toString` type tests don't work for
    // some types in IE 11, we use a fingerprinting heuristic instead, based
    // on the methods. It's not great, but it's the best we got.
    // The fingerprint method lists are defined below.

    function ie11fingerprint(methods) {
      var length = _getLength(methods)
      return function (obj) {
        if (obj == null) return false // `Map`, `WeakMap` and `Set` have no enumerable keys.

        var keys = allKeys(obj)
        if (_getLength(keys)) return false

        for (var i = 0; i < length; i++) {
          if (!modules_isFunction(obj[methods[i]])) return false
        } // If we are testing against `WeakMap`, we need to ensure that
        // `obj` doesn't have a `forEach` method in order to distinguish
        // it from a regular `Map`.


        return methods !== weakMapMethods || !modules_isFunction(obj[forEachName])
      }
    } // In the interest of compact minification, we write
    // each string in the fingerprints only once.

    var forEachName = 'forEach',
      hasName = 'has',
      commonInit = ['clear', 'delete'],
      mapTail = ['get', hasName, 'set'] // `Map`, `WeakMap` and `Set` each have slightly different
    // combinations of the above sublists.

    var mapMethods = commonInit.concat(forEachName, mapTail),
      weakMapMethods = commonInit.concat(mapTail),
      setMethods = ['add'].concat(commonInit, forEachName, hasName);
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isMap.js



/* harmony default export */ var isMap = (isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isWeakMap.js



/* harmony default export */ var isWeakMap = (isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isSet.js



/* harmony default export */ var isSet = (isIE11 ? ie11fingerprint(setMethods) : tagTester('Set'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/isWeakSet.js

/* harmony default export */ var isWeakSet = (tagTester('WeakSet'));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/values.js
    // Retrieve the values of an object's properties.

    function values(obj) {
      var _keys = keys(obj)

      var length = _keys.length
      var values = Array(length)

      for (var i = 0; i < length; i++) {
        values[i] = obj[_keys[i]]
      }

      return values
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/pairs.js
    // Convert an object into a list of `[key, value]` pairs.
    // The opposite of `_.object` with one argument.

    function pairs(obj) {
      var _keys = keys(obj)

      var length = _keys.length
      var pairs = Array(length)

      for (var i = 0; i < length; i++) {
        pairs[i] = [_keys[i], obj[_keys[i]]]
      }

      return pairs
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/invert.js
    // Invert the keys and values of an object. The values must be serializable.

    function invert(obj) {
      var result = {}

      var _keys = keys(obj)

      for (var i = 0, length = _keys.length; i < length; i++) {
        result[obj[_keys[i]]] = _keys[i]
      }

      return result
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/functions.js
    // Return a sorted list of the function names available on the object.

    function functions(obj) {
      var names = []

      for (var key in obj) {
        if (modules_isFunction(obj[key])) names.push(key)
      }

      return names.sort()
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_createAssigner.js
    // An internal function for creating assigner functions.
    function createAssigner(keysFunc, defaults) {
      return function (obj) {
        var length = arguments.length
        if (defaults) obj = Object(obj)
        if (length < 2 || obj == null) return obj

        for (var index = 1; index < length; index++) {
          var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length

          for (var i = 0; i < l; i++) {
            var key = keys[i]
            if (!defaults || obj[key] === void 0) obj[key] = source[key]
          }
        }

        return obj
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/extend.js

 // Extend a given object with all the properties in passed-in object(s).

/* harmony default export */ var extend = (createAssigner(allKeys));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/extendOwn.js

 // Assigns a given object with all the own properties in the passed-in
// object(s).
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)

/* harmony default export */ var extendOwn = (createAssigner(keys));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/defaults.js

 // Fill in a given object with default properties.

/* harmony default export */ var defaults = (createAssigner(allKeys, true));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_baseCreate.js

    // Create a naked function reference for surrogate-prototype-swapping.

    function ctor() {
      return function () { }
    } // An internal function for creating a new object that inherits from another.


    function baseCreate(prototype) {
      if (!isObject(prototype)) return {}
      if (nativeCreate) return nativeCreate(prototype)
      var Ctor = ctor()
      Ctor.prototype = prototype
      var result = new Ctor()
      Ctor.prototype = null
      return result
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/create.js

    // Creates an object that inherits from the given prototype object.
    // If additional properties are provided then they will be added to the
    // created object.

    function create(prototype, props) {
      var result = baseCreate(prototype)
      if (props) extendOwn(result, props)
      return result
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/clone.js


    // Create a (shallow-cloned) duplicate of an object.

    function clone(obj) {
      if (!isObject(obj)) return obj
      return isArray(obj) ? obj.slice() : extend({}, obj)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/tap.js
    // Invokes `interceptor` with the `obj` and then returns `obj`.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    function tap(obj, interceptor) {
      interceptor(obj)
      return obj
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/toPath.js

    // Normalize a (deep) property `path` to array.
    // Like `_.iteratee`, this function can be customized.

    function toPath(path) {
      return isArray(path) ? path : [path]
    }
    _.toPath = toPath;
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_toPath.js

    // Internal wrapper for `_.toPath` to enable minification.
    // Similar to `cb` for `_.iteratee`.

    function _toPath_toPath(path) {
      return _.toPath(path)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_deepGet.js
    // Internal function to obtain a nested property in `obj` along `path`.
    function deepGet(obj, path) {
      var length = path.length

      for (var i = 0; i < length; i++) {
        if (obj == null) return void 0
        obj = obj[path[i]]
      }

      return length ? obj : void 0
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/get.js


    // Get the value of the (deep) property on `path` from `object`.
    // If any property in `path` does not exist or if the value is
    // `undefined`, return `defaultValue` instead.
    // The `path` is normalized through `_.toPath`.

    function get(object, path, defaultValue) {
      var value = deepGet(object, _toPath_toPath(path))
      return isUndefined(value) ? defaultValue : value
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/has.js

    // Shortcut function for checking if an object has a given property directly on
    // itself (in other words, not on a prototype). Unlike the internal `has`
    // function, this public version can also traverse nested properties.

    function has_has(obj, path) {
      path = _toPath_toPath(path)
      var length = path.length

      for (var i = 0; i < length; i++) {
        var key = path[i]
        if (!has(obj, key)) return false
        obj = obj[key]
      }

      return !!length
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/identity.js
    // Keep the identity function around for default iteratees.
    function identity(value) {
      return value
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/matcher.js

    // Returns a predicate for checking whether an object has a given set of
    // `key:value` pairs.

    function matcher(attrs) {
      attrs = extendOwn({}, attrs)
      return function (obj) {
        return isMatch(obj, attrs)
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/property.js

    // Creates a function that, when passed an object, will traverse that object’s
    // properties down the given `path`, specified as an array of keys or indices.

    function property(path) {
      path = _toPath_toPath(path)
      return function (obj) {
        return deepGet(obj, path)
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_optimizeCb.js
    // Internal function that returns an efficient (for current engines) version
    // of the passed-in callback, to be repeatedly applied in other Underscore
    // functions.
    function optimizeCb(func, context, argCount) {
      if (context === void 0) return func

      switch (argCount == null ? 3 : argCount) {
        case 1:
          return function (value) {
            return func.call(context, value)
          }
        // The 2-argument case is omitted because we’re not using it.

        case 3:
          return function (value, index, collection) {
            return func.call(context, value, index, collection)
          }

        case 4:
          return function (accumulator, value, index, collection) {
            return func.call(context, accumulator, value, index, collection)
          }
      }

      return function () {
        return func.apply(context, arguments)
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_baseIteratee.js






    // An internal function to generate callbacks that can be applied to each
    // element in a collection, returning the desired result — either `_.identity`,
    // an arbitrary callback, a property matcher, or a property accessor.

    function baseIteratee(value, context, argCount) {
      if (value == null) return identity
      if (modules_isFunction(value)) return optimizeCb(value, context, argCount)
      if (isObject(value) && !isArray(value)) return matcher(value)
      return property(value)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/iteratee.js

    // External wrapper for our callback generator. Users may customize
    // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
    // This abstraction hides the internal-only `argCount` argument.

    function iteratee(value, context) {
      return baseIteratee(value, context, Infinity)
    }
    _.iteratee = iteratee;
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_cb.js


    // The function we call internally to generate a callback. It invokes
    // `_.iteratee` if overridden, otherwise `baseIteratee`.

    function cb(value, context, argCount) {
      if (_.iteratee !== iteratee) return _.iteratee(value, context)
      return baseIteratee(value, context, argCount)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/mapObject.js

    // Returns the results of applying the `iteratee` to each element of `obj`.
    // In contrast to `_.map` it returns an object.

    function mapObject(obj, iteratee, context) {
      iteratee = cb(iteratee, context)

      var _keys = keys(obj),
        length = _keys.length,
        results = {}

      for (var index = 0; index < length; index++) {
        var currentKey = _keys[index]
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj)
      }

      return results
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/noop.js
    // Predicate-generating function. Often useful outside of Underscore.
    function noop() { }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/propertyOf.js

    // Generates a function for a given object that returns a given property.

    function propertyOf(obj) {
      if (obj == null) return noop
      return function (path) {
        return get(obj, path)
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/times.js
    // Run a function **n** times.

    function times(n, iteratee, context) {
      var accum = Array(Math.max(0, n))
      iteratee = optimizeCb(iteratee, context, 1)

      for (var i = 0; i < n; i++) accum[i] = iteratee(i)

      return accum
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/random.js
    // Return a random integer between `min` and `max` (inclusive).
    function random(min, max) {
      if (max == null) {
        max = min
        min = 0
      }

      return min + Math.floor(Math.random() * (max - min + 1))
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/now.js
// A (possibly faster) way to get the current timestamp as an integer.
/* harmony default export */ var now = (Date.now || function () {
      return new Date().getTime()
    });
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_createEscaper.js
    // Internal helper to generate functions for escaping and unescaping strings
    // to/from HTML interpolation.

    function createEscaper(map) {
      var escaper = function (match) {
        return map[match]
      } // Regexes for identifying a key that needs to be escaped.


      var source = '(?:' + keys(map).join('|') + ')'
      var testRegexp = RegExp(source)
      var replaceRegexp = RegExp(source, 'g')
      return function (string) {
        string = string == null ? '' : '' + string
        return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_escapeMap.js
// Internal list of HTML entities for escaping.
/* harmony default export */ var _escapeMap = ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '`': '&#x60;'
    });
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/escape.js

 // Function for escaping strings to HTML interpolation.

/* harmony default export */ var modules_escape = (createEscaper(_escapeMap));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_unescapeMap.js

 // Internal list of HTML entities for unescaping.

/* harmony default export */ var _unescapeMap = (invert(_escapeMap));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/unescape.js

 // Function for unescaping strings from HTML interpolation.

/* harmony default export */ var modules_unescape = (createEscaper(_unescapeMap));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/templateSettings.js
 // By default, Underscore uses ERB-style template delimiters. Change the
// following template settings to use alternative delimiters.

/* harmony default export */ var templateSettings = (_.templateSettings = {
      evaluate: /<%([\s\S]+?)%>/g,
      interpolate: /<%=([\s\S]+?)%>/g,
      escape: /<%-([\s\S]+?)%>/g
    });
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/template.js


    // When customizing `_.templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.

    var noMatch = /(.)^/ // Certain characters need to be escaped so that they can be put into a
    // string literal.

    var escapes = {
      "'": "'",
      '\\': '\\',
      '\r': 'r',
      '\n': 'n',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    }
    var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g

    function escapeChar(match) {
      return '\\' + escapes[match]
    } // In order to prevent third-party code injection through
    // `_.templateSettings.variable`, we test it against the following regular
    // expression. It is intentionally a bit more liberal than just matching valid
    // identifiers, but still prevents possible loopholes through defaults or
    // destructuring assignment.


    var bareIdentifier = /^\s*(\w|\$)+\s*$/ // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    // NB: `oldSettings` only exists for backwards compatibility.

    function template(text, settings, oldSettings) {
      if (!settings && oldSettings) settings = oldSettings
      settings = defaults({}, settings, _.templateSettings) // Combine delimiters into one regular expression via alternation.

      var matcher = RegExp([(settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source].join('|') + '|$', 'g') // Compile the template source, escaping string literals appropriately.

      var index = 0
      var source = "__p+='"
      text.replace(matcher, function (match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset).replace(escapeRegExp, escapeChar)
        index = offset + match.length

        if (escape) {
          source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'"
        } else if (interpolate) {
          source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'"
        } else if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='"
        } // Adobe VMs need the match returned to produce the correct offset.


        return match
      })
      source += "';\n"
      var argument = settings.variable

      if (argument) {
        // Insure against third-party code injection. (CVE-2021-23358)
        if (!bareIdentifier.test(argument)) throw new Error('variable is not a bare identifier: ' + argument)
      } else {
        // If a variable is not specified, place data values in local scope.
        source = 'with(obj||{}){\n' + source + '}\n'
        argument = 'obj'
      }

      source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + 'return __p;\n'
      var render

      try {
        render = new Function(argument, '_', source)
      } catch (e) {
        e.source = source
        throw e
      }

      var template = function (data) {
        return render.call(this, data, _)
      } // Provide the compiled source as a convenience for precompilation.


      template.source = 'function(' + argument + '){\n' + source + '}'
      return template
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/result.js

    // Traverses the children of `obj` along `path`. If a child is a function, it
    // is invoked with its parent as context. Returns the value of the final
    // child, or `fallback` if any child is undefined.

    function result(obj, path, fallback) {
      path = _toPath_toPath(path)
      var length = path.length

      if (!length) {
        return modules_isFunction(fallback) ? fallback.call(obj) : fallback
      }

      for (var i = 0; i < length; i++) {
        var prop = obj == null ? void 0 : obj[path[i]]

        if (prop === void 0) {
          prop = fallback
          i = length // Ensure we don't continue iterating.
        }

        obj = modules_isFunction(prop) ? prop.call(obj) : prop
      }

      return obj
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/uniqueId.js
    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0
    function uniqueId(prefix) {
      var id = ++idCounter + ''
      return prefix ? prefix + id : id
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/chain.js
    // Start chaining a wrapped Underscore object.

    function chain(obj) {
      var instance = _(obj)

      instance._chain = true
      return instance
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_executeBound.js

    // Internal function to execute `sourceFunc` bound to `context` with optional
    // `args`. Determines whether to execute a function as a constructor or as a
    // normal function.

    function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
      if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args)
      var self = baseCreate(sourceFunc.prototype)
      var result = sourceFunc.apply(self, args)
      if (isObject(result)) return result
      return self
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/partial.js


    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context. `_` acts
    // as a placeholder by default, allowing any combination of arguments to be
    // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.

    var partial = restArguments(function (func, boundArgs) {
      var placeholder = partial.placeholder

      var bound = function () {
        var position = 0,
          length = boundArgs.length
        var args = Array(length)

        for (var i = 0; i < length; i++) {
          args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i]
        }

        while (position < arguments.length) args.push(arguments[position++])

        return executeBound(func, bound, this, this, args)
      }

      return bound
    })
    partial.placeholder = _
/* harmony default export */ var modules_partial = (partial);
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/bind.js


 // Create a function bound to a given object (assigning `this`, and arguments,
// optionally).

/* harmony default export */ var bind = (restArguments(function (func, context, args) {
      if (!modules_isFunction(func)) throw new TypeError('Bind must be called on a function')
      var bound = restArguments(function (callArgs) {
        return executeBound(func, bound, context, this, args.concat(callArgs))
      })
      return bound
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_isArrayLike.js

 // Internal helper for collection methods to determine whether a collection
// should be iterated as an array or as an object.
// Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
// Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094

/* harmony default export */ var _isArrayLike = (createSizePropertyCheck(_getLength));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_flatten.js



    // Internal implementation of a recursive `flatten` function.

    function flatten(input, depth, strict, output) {
      output = output || []

      if (!depth && depth !== 0) {
        depth = Infinity
      } else if (depth <= 0) {
        return output.concat(input)
      }

      var idx = output.length

      for (var i = 0, length = _getLength(input); i < length; i++) {
        var value = input[i]

        if (_isArrayLike(value) && (isArray(value) || modules_isArguments(value))) {
          // Flatten current level of array or arguments object.
          if (depth > 1) {
            flatten(value, depth - 1, strict, output)
            idx = output.length
          } else {
            var j = 0,
              len = value.length

            while (j < len) output[idx++] = value[j++]
          }
        } else if (!strict) {
          output[idx++] = value
        }
      }

      return output
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/bindAll.js


 // Bind a number of an object's methods to that object. Remaining arguments
// are the method names to be bound. Useful for ensuring that all callbacks
// defined on an object belong to it.

/* harmony default export */ var bindAll = (restArguments(function (obj, keys) {
      keys = flatten(keys, false, false)
      var index = keys.length
      if (index < 1) throw new Error('bindAll must be passed function names')

      while (index--) {
        var key = keys[index]
        obj[key] = bind(obj[key], obj)
      }

      return obj
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/memoize.js
    // Memoize an expensive function by storing its results.

    function memoize(func, hasher) {
      var memoize = function (key) {
        var cache = memoize.cache
        var address = '' + (hasher ? hasher.apply(this, arguments) : key)
        if (!has(cache, address)) cache[address] = func.apply(this, arguments)
        return cache[address]
      }

      memoize.cache = {}
      return memoize
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/delay.js
 // Delays a function for the given number of milliseconds, and then calls
// it with the arguments supplied.

/* harmony default export */ var delay = (restArguments(function (func, wait, args) {
      return setTimeout(function () {
        return func.apply(null, args)
      }, wait)
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/defer.js


 // Defers a function, scheduling it to run after the current call stack has
// cleared.

/* harmony default export */ var defer = (modules_partial(delay, _, 1));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/throttle.js
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.

    function throttle(func, wait, options) {
      var timeout, context, args, result
      var previous = 0
      if (!options) options = {}

      var later = function () {
        previous = options.leading === false ? 0 : now()
        timeout = null
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }

      var throttled = function () {
        var _now = now()

        if (!previous && options.leading === false) previous = _now
        var remaining = wait - (_now - previous)
        context = this
        args = arguments

        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout)
            timeout = null
          }

          previous = _now
          result = func.apply(context, args)
          if (!timeout) context = args = null
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining)
        }

        return result
      }

      throttled.cancel = function () {
        clearTimeout(timeout)
        previous = 0
        timeout = context = args = null
      }

      return throttled
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/debounce.js

    // When a sequence of calls of the returned function ends, the argument
    // function is triggered. The end of a sequence is defined by the `wait`
    // parameter. If `immediate` is passed, the argument function will be
    // triggered at the beginning of the sequence instead of at the end.

    function debounce(func, wait, immediate) {
      var timeout, previous, args, result, context

      var later = function () {
        var passed = now() - previous

        if (wait > passed) {
          timeout = setTimeout(later, wait - passed)
        } else {
          timeout = null
          if (!immediate) result = func.apply(context, args) // This check is needed because `func` can recursively invoke `debounced`.

          if (!timeout) args = context = null
        }
      }

      var debounced = restArguments(function (_args) {
        context = this
        args = _args
        previous = now()

        if (!timeout) {
          timeout = setTimeout(later, wait)
          if (immediate) result = func.apply(context, args)
        }

        return result
      })

      debounced.cancel = function () {
        clearTimeout(timeout)
        timeout = args = context = null
      }

      return debounced
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/wrap.js
    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.

    function wrap(func, wrapper) {
      return modules_partial(wrapper, func)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/negate.js
    // Returns a negated version of the passed-in predicate.
    function negate(predicate) {
      return function () {
        return !predicate.apply(this, arguments)
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/compose.js
    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    function compose() {
      var args = arguments
      var start = args.length - 1
      return function () {
        var i = start
        var result = args[start].apply(this, arguments)

        while (i--) result = args[i].call(this, result)

        return result
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/after.js
    // Returns a function that will only be executed on and after the Nth call.
    function after(times, func) {
      return function () {
        if (--times < 1) {
          return func.apply(this, arguments)
        }
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/before.js
    // Returns a function that will only be executed up to (but not including) the
    // Nth call.
    function before(times, func) {
      var memo
      return function () {
        if (--times > 0) {
          memo = func.apply(this, arguments)
        }

        if (times <= 1) func = null
        return memo
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/once.js

 // Returns a function that will be executed at most one time, no matter how
// often you call it. Useful for lazy initialization.

/* harmony default export */ var once = (modules_partial(before, 2));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/findKey.js

    // Returns the first key on an object that passes a truth test.

    function findKey(obj, predicate, context) {
      predicate = cb(predicate, context)

      var _keys = keys(obj),
        key

      for (var i = 0, length = _keys.length; i < length; i++) {
        key = _keys[i]
        if (predicate(obj[key], key, obj)) return key
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_createPredicateIndexFinder.js

    // Internal function to generate `_.findIndex` and `_.findLastIndex`.

    function createPredicateIndexFinder(dir) {
      return function (array, predicate, context) {
        predicate = cb(predicate, context)
        var length = _getLength(array)
        var index = dir > 0 ? 0 : length - 1

        for (; index >= 0 && index < length; index += dir) {
          if (predicate(array[index], index, array)) return index
        }

        return -1
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/findIndex.js
 // Returns the first index on an array-like that passes a truth test.

/* harmony default export */ var findIndex = (createPredicateIndexFinder(1));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/findLastIndex.js
 // Returns the last index on an array-like that passes a truth test.

/* harmony default export */ var findLastIndex = (createPredicateIndexFinder(-1));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/sortedIndex.js

    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.

    function sortedIndex(array, obj, iteratee, context) {
      iteratee = cb(iteratee, context, 1)
      var value = iteratee(obj)
      var low = 0,
        high = _getLength(array)

      while (low < high) {
        var mid = Math.floor((low + high) / 2)
        if (iteratee(array[mid]) < value) low = mid + 1; else high = mid
      }

      return low
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_createIndexFinder.js


    // Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.

    function createIndexFinder(dir, predicateFind, sortedIndex) {
      return function (array, item, idx) {
        var i = 0,
          length = _getLength(array)

        if (typeof idx == 'number') {
          if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i)
          } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1
          }
        } else if (sortedIndex && idx && length) {
          idx = sortedIndex(array, item)
          return array[idx] === item ? idx : -1
        }

        if (item !== item) {
          idx = predicateFind(slice.call(array, i, length), isNaN_isNaN)
          return idx >= 0 ? idx + i : -1
        }

        for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
          if (array[idx] === item) return idx
        }

        return -1
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/indexOf.js


 // Return the position of the first occurrence of an item in an array,
// or -1 if the item is not included in the array.
// If the array is large and already in sort order, pass `true`
// for **isSorted** to use binary search.

/* harmony default export */ var indexOf = (createIndexFinder(1, findIndex, sortedIndex));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/lastIndexOf.js

 // Return the position of the last occurrence of an item in an array,
// or -1 if the item is not included in the array.

/* harmony default export */ var lastIndexOf = (createIndexFinder(-1, findLastIndex));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/find.js


    // Return the first value which passes a truth test.

    function find(obj, predicate, context) {
      var keyFinder = _isArrayLike(obj) ? findIndex : findKey
      var key = keyFinder(obj, predicate, context)
      if (key !== void 0 && key !== -1) return obj[key]
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/findWhere.js

    // Convenience version of a common use case of `_.find`: getting the first
    // object containing specific `key:value` pairs.

    function findWhere(obj, attrs) {
      return find(obj, matcher(attrs))
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/each.js


    // The cornerstone for collection functions, an `each`
    // implementation, aka `forEach`.
    // Handles raw objects in addition to array-likes. Treats all
    // sparse array-likes as if they were dense.

    function each(obj, iteratee, context) {
      iteratee = optimizeCb(iteratee, context)
      var i, length

      if (_isArrayLike(obj)) {
        for (i = 0, length = obj.length; i < length; i++) {
          iteratee(obj[i], i, obj)
        }
      } else {
        var _keys = keys(obj)

        for (i = 0, length = _keys.length; i < length; i++) {
          iteratee(obj[_keys[i]], _keys[i], obj)
        }
      }

      return obj
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/map.js


    // Return the results of applying the iteratee to each element.

    function map(obj, iteratee, context) {
      iteratee = cb(iteratee, context)

      var _keys = !_isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        results = Array(length)

      for (var index = 0; index < length; index++) {
        var currentKey = _keys ? _keys[index] : index
        results[index] = iteratee(obj[currentKey], currentKey, obj)
      }

      return results
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_createReduce.js


    // Internal helper to create a reducing function, iterating left or right.

    function createReduce(dir) {
      // Wrap code that reassigns argument variables in a separate function than
      // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
      var reducer = function (obj, iteratee, memo, initial) {
        var _keys = !_isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length,
          index = dir > 0 ? 0 : length - 1

        if (!initial) {
          memo = obj[_keys ? _keys[index] : index]
          index += dir
        }

        for (; index >= 0 && index < length; index += dir) {
          var currentKey = _keys ? _keys[index] : index
          memo = iteratee(memo, obj[currentKey], currentKey, obj)
        }

        return memo
      }

      return function (obj, iteratee, memo, context) {
        var initial = arguments.length >= 3
        return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial)
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/reduce.js
 // **Reduce** builds up a single result from a list of values, aka `inject`,
// or `foldl`.

/* harmony default export */ var reduce = (createReduce(1));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/reduceRight.js
 // The right-associative version of reduce, also known as `foldr`.

/* harmony default export */ var reduceRight = (createReduce(-1));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/filter.js

    // Return all the elements that pass a truth test.

    function filter(obj, predicate, context) {
      var results = []
      predicate = cb(predicate, context)
      each(obj, function (value, index, list) {
        if (predicate(value, index, list)) results.push(value)
      })
      return results
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/reject.js


    // Return all the elements for which a truth test fails.

    function reject(obj, predicate, context) {
      return filter(obj, negate(cb(predicate)), context)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/every.js


    // Determine whether all of the elements pass a truth test.

    function every(obj, predicate, context) {
      predicate = cb(predicate, context)

      var _keys = !_isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length

      for (var index = 0; index < length; index++) {
        var currentKey = _keys ? _keys[index] : index
        if (!predicate(obj[currentKey], currentKey, obj)) return false
      }

      return true
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/some.js


    // Determine if at least one element in the object passes a truth test.

    function some(obj, predicate, context) {
      predicate = cb(predicate, context)

      var _keys = !_isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length

      for (var index = 0; index < length; index++) {
        var currentKey = _keys ? _keys[index] : index
        if (predicate(obj[currentKey], currentKey, obj)) return true
      }

      return false
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/contains.js


    // Determine if the array or object contains a given item (using `===`).

    function contains(obj, item, fromIndex, guard) {
      if (!_isArrayLike(obj)) obj = values(obj)
      if (typeof fromIndex != 'number' || guard) fromIndex = 0
      return indexOf(obj, item, fromIndex) >= 0
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/invoke.js




 // Invoke a method (with arguments) on every item in a collection.

/* harmony default export */ var invoke = (restArguments(function (obj, path, args) {
      var contextPath, func

      if (modules_isFunction(path)) {
        func = path
      } else {
        path = _toPath_toPath(path)
        contextPath = path.slice(0, -1)
        path = path[path.length - 1]
      }

      return map(obj, function (context) {
        var method = func

        if (!method) {
          if (contextPath && contextPath.length) {
            context = deepGet(context, contextPath)
          }

          if (context == null) return void 0
          method = context[path]
        }

        return method == null ? method : method.apply(context, args)
      })
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/pluck.js

    // Convenience version of a common use case of `_.map`: fetching a property.

    function pluck(obj, key) {
      return map(obj, property(key))
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/where.js

    // Convenience version of a common use case of `_.filter`: selecting only
    // objects containing specific `key:value` pairs.

    function where(obj, attrs) {
      return filter(obj, matcher(attrs))
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/max.js



    // Return the maximum element (or element-based computation).

    function max(obj, iteratee, context) {
      var result = -Infinity,
        lastComputed = -Infinity,
        value,
        computed

      if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
        obj = _isArrayLike(obj) ? obj : values(obj)

        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i]

          if (value != null && value > result) {
            result = value
          }
        }
      } else {
        iteratee = cb(iteratee, context)
        each(obj, function (v, index, list) {
          computed = iteratee(v, index, list)

          if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
            result = v
            lastComputed = computed
          }
        })
      }

      return result
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/min.js



    // Return the minimum element (or element-based computation).

    function min(obj, iteratee, context) {
      var result = Infinity,
        lastComputed = Infinity,
        value,
        computed

      if (iteratee == null || typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null) {
        obj = _isArrayLike(obj) ? obj : values(obj)

        for (var i = 0, length = obj.length; i < length; i++) {
          value = obj[i]

          if (value != null && value < result) {
            result = value
          }
        }
      } else {
        iteratee = cb(iteratee, context)
        each(obj, function (v, index, list) {
          computed = iteratee(v, index, list)

          if (computed < lastComputed || computed === Infinity && result === Infinity) {
            result = v
            lastComputed = computed
          }
        })
      }

      return result
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/sample.js




    // Sample **n** random values from a collection using the modern version of the
    // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
    // If **n** is not specified, returns a single random element.
    // The internal `guard` argument allows it to work with `_.map`.

    function sample(obj, n, guard) {
      if (n == null || guard) {
        if (!_isArrayLike(obj)) obj = values(obj)
        return obj[random(obj.length - 1)]
      }

      var sample = _isArrayLike(obj) ? clone(obj) : values(obj)
      var length = _getLength(sample)
      n = Math.max(Math.min(n, length), 0)
      var last = length - 1

      for (var index = 0; index < n; index++) {
        var rand = random(index, last)
        var temp = sample[index]
        sample[index] = sample[rand]
        sample[rand] = temp
      }

      return sample.slice(0, n)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/shuffle.js
    // Shuffle a collection.

    function shuffle(obj) {
      return sample(obj, Infinity)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/sortBy.js


    // Sort the object's values by a criterion produced by an iteratee.

    function sortBy(obj, iteratee, context) {
      var index = 0
      iteratee = cb(iteratee, context)
      return pluck(map(obj, function (value, key, list) {
        return {
          value: value,
          index: index++,
          criteria: iteratee(value, key, list)
        }
      }).sort(function (left, right) {
        var a = left.criteria
        var b = right.criteria

        if (a !== b) {
          if (a > b || a === void 0) return 1
          if (a < b || b === void 0) return -1
        }

        return left.index - right.index
      }), 'value')
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_group.js

    // An internal function used for aggregate "group by" operations.

    function group(behavior, partition) {
      return function (obj, iteratee, context) {
        var result = partition ? [[], []] : {}
        iteratee = cb(iteratee, context)
        each(obj, function (value, index) {
          var key = iteratee(value, index, obj)
          behavior(result, value, key)
        })
        return result
      }
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/groupBy.js

 // Groups the object's values by a criterion. Pass either a string attribute
// to group by, or a function that returns the criterion.

/* harmony default export */ var groupBy = (group(function (result, value, key) {
      if (has(result, key)) result[key].push(value); else result[key] = [value]
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/indexBy.js
 // Indexes the object's values by a criterion, similar to `_.groupBy`, but for
// when you know that your index values will be unique.

/* harmony default export */ var indexBy = (group(function (result, value, key) {
      result[key] = value
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/countBy.js

 // Counts instances of an object that group by a certain criterion. Pass
// either a string attribute to count by, or a function that returns the
// criterion.

/* harmony default export */ var countBy = (group(function (result, value, key) {
      if (has(result, key)) result[key]++; else result[key] = 1
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/partition.js
 // Split a collection into two arrays: one whose elements all pass the given
// truth test, and one whose elements all do not pass the truth test.

/* harmony default export */ var partition = (group(function (result, value, pass) {
      result[pass ? 0 : 1].push(value)
    }, true));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/toArray.js






    // Safely create a real, live array from anything iterable.

    var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g
    function toArray(obj) {
      if (!obj) return []
      if (isArray(obj)) return slice.call(obj)

      if (isString(obj)) {
        // Keep surrogate pair characters together.
        return obj.match(reStrSymbol)
      }

      if (_isArrayLike(obj)) return map(obj, identity)
      return values(obj)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/size.js

    // Return the number of elements in a collection.

    function size(obj) {
      if (obj == null) return 0
      return _isArrayLike(obj) ? obj.length : keys(obj).length
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_keyInObj.js
    // Internal `_.pick` helper function to determine whether `key` is an enumerable
    // property name of `obj`.
    function keyInObj(value, key, obj) {
      return key in obj
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/pick.js





 // Return a copy of the object only containing the allowed properties.

/* harmony default export */ var pick = (restArguments(function (obj, keys) {
      var result = {},
        iteratee = keys[0]
      if (obj == null) return result

      if (modules_isFunction(iteratee)) {
        if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1])
        keys = allKeys(obj)
      } else {
        iteratee = keyInObj
        keys = flatten(keys, false, false)
        obj = Object(obj)
      }

      for (var i = 0, length = keys.length; i < length; i++) {
        var key = keys[i]
        var value = obj[key]
        if (iteratee(value, key, obj)) result[key] = value
      }

      return result
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/omit.js






 // Return a copy of the object without the disallowed properties.

/* harmony default export */ var omit = (restArguments(function (obj, keys) {
      var iteratee = keys[0],
        context

      if (modules_isFunction(iteratee)) {
        iteratee = negate(iteratee)
        if (keys.length > 1) context = keys[1]
      } else {
        keys = map(flatten(keys, false, false), String)

        iteratee = function (value, key) {
          return !contains(keys, key)
        }
      }

      return pick(obj, iteratee, context)
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/initial.js
    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N.

    function initial(array, n, guard) {
      return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)))
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/first.js
    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. The **guard** check allows it to work with `_.map`.

    function first(array, n, guard) {
      if (array == null || array.length < 1) return n == null || guard ? void 0 : []
      if (n == null || guard) return array[0]
      return initial(array, array.length - n)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/rest.js
    // Returns everything but the first entry of the `array`. Especially useful on
    // the `arguments` object. Passing an **n** will return the rest N values in the
    // `array`.

    function rest(array, n, guard) {
      return slice.call(array, n == null || guard ? 1 : n)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/last.js
    // Get the last element of an array. Passing **n** will return the last N
    // values in the array.

    function last(array, n, guard) {
      if (array == null || array.length < 1) return n == null || guard ? void 0 : []
      if (n == null || guard) return array[array.length - 1]
      return rest(array, Math.max(0, array.length - n))
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/compact.js
    // Trim out all falsy values from an array.

    function compact(array) {
      return filter(array, Boolean)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/flatten.js
    // Flatten out an array, either recursively (by default), or up to `depth`.
    // Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.

    function flatten_flatten(array, depth) {
      return flatten(array, depth, false)
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/difference.js



 // Take the difference between one array and a number of other arrays.
// Only the elements present in just the first array will remain.

/* harmony default export */ var difference = (restArguments(function (array, rest) {
      rest = flatten(rest, true, true)
      return filter(array, function (value) {
        return !contains(rest, value)
      })
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/without.js

 // Return a version of the array that does not contain the specified value(s).

/* harmony default export */ var without = (restArguments(function (array, otherArrays) {
      return difference(array, otherArrays)
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/uniq.js



    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // The faster algorithm will not work with an iteratee if the iteratee
    // is not a one-to-one function, so providing an iteratee will disable
    // the faster algorithm.

    function uniq(array, isSorted, iteratee, context) {
      if (!isBoolean(isSorted)) {
        context = iteratee
        iteratee = isSorted
        isSorted = false
      }

      if (iteratee != null) iteratee = cb(iteratee, context)
      var result = []
      var seen = []

      for (var i = 0, length = _getLength(array); i < length; i++) {
        var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value

        if (isSorted && !iteratee) {
          if (!i || seen !== computed) result.push(value)
          seen = computed
        } else if (iteratee) {
          if (!contains(seen, computed)) {
            seen.push(computed)
            result.push(value)
          }
        } else if (!contains(result, value)) {
          result.push(value)
        }
      }

      return result
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/union.js


 // Produce an array that contains the union: each distinct element from all of
// the passed-in arrays.

/* harmony default export */ var union = (restArguments(function (arrays) {
      return uniq(flatten(arrays, true, true))
    }));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/intersection.js

    // Produce an array that contains every item shared between all the
    // passed-in arrays.

    function intersection(array) {
      var result = []
      var argsLength = arguments.length

      for (var i = 0, length = _getLength(array); i < length; i++) {
        var item = array[i]
        if (contains(result, item)) continue
        var j

        for (j = 1; j < argsLength; j++) {
          if (!contains(arguments[j], item)) break
        }

        if (j === argsLength) result.push(item)
      }

      return result
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/unzip.js


    // Complement of zip. Unzip accepts an array of arrays and groups
    // each array's elements on shared indices.

    function unzip(array) {
      var length = array && max(array, _getLength).length || 0
      var result = Array(length)

      for (var index = 0; index < length; index++) {
        result[index] = pluck(array, index)
      }

      return result
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/zip.js

 // Zip together multiple lists into a single array -- elements that share
// an index go together.

/* harmony default export */ var zip = (restArguments(unzip));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/object.js
    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values. Passing by pairs is the reverse of `_.pairs`.

    function object(list, values) {
      var result = {}

      for (var i = 0, length = _getLength(list); i < length; i++) {
        if (values) {
          result[list[i]] = values[i]
        } else {
          result[list[i][0]] = list[i][1]
        }
      }

      return result
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/range.js
    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](https://docs.python.org/library/functions.html#range).
    function range(start, stop, step) {
      if (stop == null) {
        stop = start || 0
        start = 0
      }

      if (!step) {
        step = stop < start ? -1 : 1
      }

      var length = Math.max(Math.ceil((stop - start) / step), 0)
      var range = Array(length)

      for (var idx = 0; idx < length; idx++, start += step) {
        range[idx] = start
      }

      return range
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/chunk.js
    // Chunk a single array into multiple arrays, each containing `count` or fewer
    // items.

    function chunk(array, count) {
      if (count == null || count < 1) return []
      var result = []
      var i = 0,
        length = array.length

      while (i < length) {
        result.push(slice.call(array, i, i += count))
      }

      return result
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/_chainResult.js
    // Helper function to continue chaining intermediate results.

    function chainResult(instance, obj) {
      return instance._chain ? _(obj).chain() : obj
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/mixin.js




    // Add your own custom functions to the Underscore object.

    function mixin(obj) {
      each(functions(obj), function (name) {
        var func = _[name] = obj[name]

        _.prototype[name] = function () {
          var args = [this._wrapped]
          push.apply(args, arguments)
          return chainResult(this, func.apply(_, args))
        }
      })
      return _
    }
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/underscore-array-methods.js



    // Add all mutator `Array` functions to the wrapper.

    each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function (name) {
      var method = ArrayProto[name]

      _.prototype[name] = function () {
        var obj = this._wrapped

        if (obj != null) {
          method.apply(obj, arguments)

          if ((name === 'shift' || name === 'splice') && obj.length === 0) {
            delete obj[0]
          }
        }

        return chainResult(this, obj)
      }
    }) // Add all accessor `Array` functions to the wrapper.

    each(['concat', 'join', 'slice'], function (name) {
      var method = ArrayProto[name]

      _.prototype[name] = function () {
        var obj = this._wrapped
        if (obj != null) obj = method.apply(obj, arguments)
        return chainResult(this, obj)
      }
    })
/* harmony default export */ var underscore_array_methods = (_);
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/index.js
    // Named Exports
    // =============
    //     Underscore.js 1.13.1
    //     https://underscorejs.org
    //     (c) 2009-2021 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
    //     Underscore may be freely distributed under the MIT license.
    // Baseline setup.

    // Object Functions
    // ----------------
    // Our most fundamental functions operate on any JavaScript object.
    // Most functions in Underscore depend on at least one function in this section.
    // A group of functions that check the types of core JavaScript values.
    // These are often informally referred to as the "isType" functions.


























    // Functions that treat an object as a dictionary of key-value pairs.















    // Utility Functions
    // -----------------
    // A bit of a grab bag: Predicate-generating functions for use with filters and
    // loops, string escaping and templating, create random numbers and unique ids,
    // and functions that facilitate Underscore's chaining and iteration conventions.


















    // Function (ahem) Functions
    // -------------------------
    // These functions take a function as an argument and return a new function
    // as the result. Also known as higher-order functions.














    // Finders
    // -------
    // Functions that extract (the position of) a single element from an object
    // or array based on some criterion.








    // Collection Functions
    // --------------------
    // Functions that work on any collection of elements: either an array, or
    // an object of key-value pairs.























    // `_.pick` and `_.omit` are actually object functions, but we put
    // them here in order to create a more natural reading order in the
    // monolithic build as they depend on `_.contains`.


    // Array Functions
    // ---------------
    // Functions that operate on arrays (and array-likes) only, because they’re
    // expressed in terms of operations on an ordered list of values.
















    // OOP
    // ---
    // These modules support the "object-oriented" calling style. See also
    // `underscore.js` and `index-default.js`.



    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/index-default.js
    // Default Export
    // ==============
    // In this module, we mix our bundled exports into the `_` object and export
    // the result. This is analogous to setting `module.exports = _` in CommonJS.
    // Hence, this module is also the entry point of our UMD bundle and the package
    // entry point for CommonJS and AMD users. In other words, this is (the source
    // of) the module you are interfacing with when you do any of the following:
    //
    // ```js
    // // CommonJS
    // var _ = require('underscore');
    //
    // // AMD
    // define(['underscore'], function(_) {...});
    //
    // // UMD in the browser
    // // _ is available as a global variable
    // ```

    // Add all of the Underscore functions to the wrapper object.

    var index_default_ = mixin(modules_namespaceObject) // Legacy Node.js API.


    index_default_._ = index_default_ // Export the Underscore API.

/* harmony default export */ var index_default = ((/* unused pure expression or super */ null && (index_default_)));
    ;// CONCATENATED MODULE: ./node_modules/underscore/modules/index-all.js
    // ESM Exports
    // ===========
    // This module is the package entry point for ES module users. In other words,
    // it is the module they are interfacing with when they import from the whole
    // package instead of from a submodule, like this:
    //
    // ```js
    // import { map } from 'underscore';
    // ```
    //
    // The difference with `./index-default`, which is the package entry point for
    // CommonJS, AMD and UMD users, is purely technical. In ES modules, named and
    // default exports are considered to be siblings, so when you have a default
    // export, its properties are not automatically available as named exports. For
    // this reason, we re-export the named exports in addition to providing the same
    // default export as in `./index-default`.


    ;// CONCATENATED MODULE: ./src/chat/chat.ts
    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
        function rejected(value) { try { step(generator["throw"](value)) } catch (e) { reject(e) } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
        step((generator = generator.apply(thisArg, _arguments || [])).next())
      })
    }


    const MESSAGE_CACHE_SIZE = 100
    const RENDERED_MESSAGE_DELETE_AFTER_SECONDS = 20
    const CHAT_DELAY_SECONDS = 0
    let started = false
    let chatContainer = null
    let messages = []
    let renderCache = {}
    let nextToFetch = null
    const getMessageElement = (_id, contentOffsetSeconds, commenterName, commenterType, messageBody) => `<li class="tw-full-width bettertv-fix"> <div class="tw-align-items-start tw-flex tw-flex-nowrap tw-full-width vod-message vod-message--timestamp" data-test-selector="message-layout"> <div class="tw-align-right tw-flex tw-flex-shrink-0 vod-message__header" data-test-selector="message-timestamp"> <div class="tw-mg-r-05"> <div class="tw-inline-flex tw-relative tw-tooltip__container" aria-describedby="${_id}"> <button class="tw-block tw-full-width tw-interactable tw-interactable--default tw-interactable--hover-enabled"> <div class="tw-pd-x-05"> <p class="tw-font-size-7">${parseDuration(contentOffsetSeconds)}</p> </div> </button> </div> </div> </div> <div class="tw-full-width"> <div class="tw-align-items-start tw-flex tw-flex-nowrap"> <div class="tw-flex-grow-1"> <span></span> <a class="tw-link video-chat__message-author" data-test-selector="comment-author-selector" data-tt_content="tab_videos" data-tt_medium="video-message-author" rel="noopener noreferrer" target="_blank" href="/${commenterName}"> <span> <span class="chat-author__display-name" data-a-target="chat-message-username" data-a-user="${commenterName}" data-test-selector="message-username" ${commenterType === 'vip' ? 'style="color:#ff46e8;"' : ''} ${commenterType !== 'subscriber' ? 'style="color:#000;"' : ''}>${commenterName}</span> </span> </a> <div class="tw-inline video-chat__message" data-test-selector="comment-message-selector"> <span class="tw-pd-r-05">:</span> <span class=""> <span class="text-fragment" data-a-target="chat-message-text">${messageBody}</span> </span> </div> </div> </div> </div> </div></li>`
    const clearMessages = () => {
      chatContainer.innerHTML = ''
      renderCache = {}
      messages = []
    }
    const parseAndPushMessages = (data) => {
      const fetchedMessages = data.comments
      fetchedMessages.forEach((m) => {
        let commenterType = 'normal'
        if (m.message.user_badges) {
          const badges = m.message.user_badges.map((b) => b._id)
          if (badges.includes('vip')) {
            commenterType = 'vip'
          }
          else if (badges.includes('subscriber')) {
            commenterType = 'subscriber'
          }
        }
        messages.push({
          commenterType,
          _id: m._id,
          contentOffsetSeconds: m.content_offset_seconds,
          commenterName: m.commenter.name,
          body: m.message.body
        })
      })
      nextToFetch = data._next
    }
    const fetchMessages = (offsetSeconds = 0) => __awaiter(void 0, void 0, void 0, function* () {
      const res = yield fetch(`https://api.twitch.tv/v5/videos/${window.vodID}/comments?content_offset_seconds=${offsetSeconds}`, { headers: getGqlHeaders() })
      const data = yield res.json()
      if (data.comments) {
        parseAndPushMessages(data)
      }
    })
    const fetchNextMessages = () => __awaiter(void 0, void 0, void 0, function* () {
      if (!nextToFetch) {
        return
      }
      const res = yield fetch(`https://api.twitch.tv/v5/videos/${window.vodID}/comments?cursor=${nextToFetch}`, { headers: getGqlHeaders() })
      const data = yield res.json()
      if (data.comments) {
        parseAndPushMessages(data)
      }
    })
    const chat_reset = (offsetSeconds) => __awaiter(void 0, void 0, void 0, function* () {
      clearMessages()
      yield fetchMessages(offsetSeconds)
    })
    const render = (offsetSeconds) => {
      const futureMessages = []
      const pastMessages = messages.filter(m => {
        if (m.contentOffsetSeconds <= offsetSeconds) {
          return true
        }
        futureMessages.push(m)
        return false
      })
      pastMessages.forEach(m => {
        if (renderCache[m._id]) {
          return
        }
        const el = document.createElement('template')
        el.innerHTML = getMessageElement(m._id, m.contentOffsetSeconds, m.commenterName, m.commenterType, m.body)
        renderCache[m._id] = {
          element: chatContainer.appendChild(el.content.firstChild),
          contentOffsetSeconds: m.contentOffsetSeconds
        }
        renderCache[m._id].element.scrollIntoView()
        el.remove()
      })
      messages = futureMessages
      if (messages.length <= MESSAGE_CACHE_SIZE) {
        fetchNextMessages()
      }
    }
    const deleteOldMessages = throttle((currentTime) => {
      if (Object.keys(renderCache).length >= MESSAGE_CACHE_SIZE) {
        Object.entries(renderCache)
          .forEach(([id, message]) => {
            if (message.contentOffsetSeconds <= currentTime - RENDERED_MESSAGE_DELETE_AFTER_SECONDS) {
              renderCache[id].element.remove()
              delete renderCache[id]
            }
          })
      }
    }, 1000 * 6)
    const handleSeeking = debounce(({ target }) => {
      if (!target) {
        return
      }
      const { currentTime } = target
      chat_reset(currentTime + CHAT_DELAY_SECONDS)
    }, 500, true)
    const handleTimeUpdate = throttle(({ target }) => {
      if (!target) {
        return
      }
      const { currentTime } = target
      render(currentTime + CHAT_DELAY_SECONDS)
      deleteOldMessages(currentTime + CHAT_DELAY_SECONDS)
    }, 1000 * 3)
    const start = (vodPlayer) => {
      started = true
      const chatWrapper = [...document.getElementsByClassName('video-chat__message-list-wrapper')].pop()
      if (!chatWrapper) {
        return
      }
      chatContainer = [...chatWrapper.getElementsByTagName('ul')].pop() || chatWrapper // document.querySelector('ul.tw-full-width')
      if (!chatContainer) {
        return
      }
      clearMessages()
      fetchMessages(vodPlayer.currentTime)
      vodPlayer.addEventListener('seeking', handleSeeking)
      vodPlayer.addEventListener('timeupdate', handleTimeUpdate)
    }
    const stop = (vodPlayer) => {
      started = false
      vodPlayer.removeEventListener('seeking', handleSeeking)
      vodPlayer.removeEventListener('timeupdate', handleTimeUpdate)
    }
    const attachChat = (vodPlayer) => {
      // Check if chat is shown
      const chatPanelShown = document.getElementsByClassName('channel-root__right-column--expanded').length > 0
      const chatPannelToggleButton = document.querySelector('button[data-a-target="right-column__toggle-collapse-btn"]')
      if (chatPanelShown) {
        start(vodPlayer)
      }
      // Toggle on click
      chatPannelToggleButton.addEventListener('click', () => {
        if (started) {
          stop(vodPlayer)
        }
        else {
          start(vodPlayer)
        }
      })
    }
/* harmony default export */ var chat = (attachChat);

    ;// CONCATENATED MODULE: ./src/vodPlayer.ts
    var vodPlayer_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
        function rejected(value) { try { step(generator["throw"](value)) } catch (e) { reject(e) } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
        step((generator = generator.apply(thisArg, _arguments || [])).next())
      })
    }
    /* global Plyr, Hls */


    const TAG = '[Twitch VOD Unblocker]'
    const LOCAL_STORAGE_TAG = '@vod-unblocker-'
    const LOCAL_STORAGE_ENTRY_TTL_SECONDS = 30 * 24 * 60 * 60
    const THUMBNAIL_TO_ID_REGEX = /^https?:\/\/(?:[\w\.\/]+)\/(.+)\/storyboards/
    let vodPlayer = null
    const getVodId = (videoIdFromReq) => {
      if (videoIdFromReq) {
        window.vodID = videoIdFromReq
        return videoIdFromReq
      }
      if (window.vodID) {
        return window.vodID
      }
      const videoId = document.URL.match(/twitch\.tv\/(?:\w+\/)?videos?\/(\d+)/)[1]
      window.vodID = videoId
      return videoId
    }
    const getFullVideoObject = (videoId) => {
      const opt = {
        method: 'GET',
        headers: getApiHeaders(),
      }
      return fetch(`https://api.twitch.tv/kraken/videos/${videoId}`, opt)
        .then(res => res.json())
    }
    const getVideoResolutions = (videoObj) => videoObj.resolutions
    const getVideoType = (videoObj) => videoObj.broadcast_type
    const getVideoHostUrl = (videoObj) => {
      const fullUrl = new URL(videoObj.animated_preview_url)
      return fullUrl.hostname
    }
    const getChannelName = (videoObj) => videoObj.channel.name
    const getVideoPartId = (videoObj) => {
      const thumbnailUrl = videoObj.animated_preview_url
      const matched = thumbnailUrl.match(THUMBNAIL_TO_ID_REGEX)
      return matched[1]
    }
    const getUploadedVideoUrls = (videoObj) => {
      const { videoId } = videoObj
      const resolutions = getVideoResolutions(videoObj)
      const hostUrl = getVideoHostUrl(videoObj)
      const partId = getVideoPartId(videoObj)
      const channelName = getChannelName(videoObj)
      return Object.entries(resolutions).map(([resolutionForUrl, resolution]) => ({
        resolution,
        url: `https://${hostUrl}/${channelName}/${videoId}/${partId}/${resolutionForUrl}/index-dvr.m3u8`,
      }))
    }
    const getBroadcastArchiveUrls = (videoObj) => {
      const resolutions = getVideoResolutions(videoObj)
      const hostUrl = getVideoHostUrl(videoObj)
      const partId = getVideoPartId(videoObj)
      return Object.entries(resolutions).map(([resolutionForUrl, resolution]) => ({
        resolution,
        url: `https://${hostUrl}/${partId}/${resolutionForUrl}/index-dvr.m3u8`,
      }))
    }
    const getHighlightUrls = (videoObj) => {
      const { videoId } = videoObj
      const resolutions = getVideoResolutions(videoObj)
      const hostUrl = getVideoHostUrl(videoObj)
      const partId = getVideoPartId(videoObj)
      return Object.entries(resolutions).map(([resolutionForUrl, resolution]) => ({
        resolution,
        url: `https://${hostUrl}/${partId}/${resolutionForUrl}/highlight-${videoId}.m3u8`,
      }))
    }
    const getPlaylistString = (urlObjects) => {
      const header = '#EXTM3U\n'
      let streams = ''
      urlObjects.forEach((urlObj, key) => {
        streams += `#EXT-X-STREAM-INF:BANDWIDTH=${100 - key},RESOLUTION=${urlObj.resolution}\n`
        streams += `${urlObj.url}\n`
      })
      return header + streams
    }
    const updateQuality = (quality, hlsInstance) => {
      hlsInstance.levels.forEach((level, idx) => {
        if (level.height === quality) {
          hlsInstance.currentLevel = idx
        }
      })
    }
    const plyrDoubleClickFix = (player) => {
      const tempToggle = player.fullscreen.toggle
      player.fullscreen.toggle = function () { tempToggle.apply(player.fullscreen, arguments) }
    }
    const tryToSavePlayerState = () => {
      if (vodPlayer) {
        localStorage.setItem(LOCAL_STORAGE_TAG + getVodId(), JSON.stringify({ currentTime: vodPlayer.currentTime, lastUpdated: Date.now() }))
      }
    }
    const createPlayer = (url) => {
      const hlsConfig = {
        xhrSetup: (xhr, _url) => {
          // replace muted chunks
          xhr.open('GET', _url.replace('unmuted.ts', 'muted.ts'), true)
        },
      }
      const hls = new Hls(hlsConfig)
      const container = document.querySelector('.video-player__container')
      const twitchPlayerElements = container.children
      Array.from(twitchPlayerElements).forEach((el) => {
        el.style.display = 'none'
        el.setAttribute('vod-unblocker-hidden', 'true')
      })
      // Create vodPlayer
      vodPlayer = container.appendChild(document.createElement('video'))
      vodPlayer.id = 'vodPlayer'
      vodPlayer.setAttribute('controls', 'true')
      vodPlayer.setAttribute('playsinline', 'true')
      const savedStateString = localStorage.getItem(LOCAL_STORAGE_TAG + getVodId())
      let lastTime = null
      if (savedStateString) {
        const savedState = JSON.parse(savedStateString)
        lastTime = savedState.currentTime
      }
      hls.loadSource(url)
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (vodPlayer.currentTime < 1) {
          return
        }
        if (data.type === 'mediaError' && data.details === 'bufferAppendingError') {
          console.debug(TAG, 'Trying to recover media error.')
          hls.recoverMediaError()
          vodPlayer.play()
        }
      })
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        const availableQualities = hls.levels.map((l) => l.height)
        const plyrOpt = {
          invertTime: false,
          quality: {
            default: availableQualities[0],
            options: availableQualities,
            forced: true,
            onChange: (quality) => updateQuality(quality, hls),
          },
        }
        const player = new Plyr(vodPlayer, plyrOpt)
        plyrDoubleClickFix(player) // Will hopefully get fixed on 3.6.4
        hls.attachMedia(vodPlayer)
        if (lastTime) {
          vodPlayer.currentTime = lastTime
        }
        player.muted = false
        player.play()
      })
      // historyPopCount = 0
      // Chat
      chat(vodPlayer)
      // Onload event to save player state
      window.onbeforeunload = (ev) => {
        tryToSavePlayerState()
        ev.preventDefault()
        delete ev.returnValue
      }
    }
    const startVodPlayer = (videoIdFromReq) => vodPlayer_awaiter(void 0, void 0, void 0, function* () {
      try {
        console.debug(TAG, 'Running...')
        const videoId = getVodId(videoIdFromReq)
        const _videoObj = yield getFullVideoObject(videoId)
        const videoObj = Object.assign({ videoId }, _videoObj)
        const videoType = getVideoType(videoObj)
        let urlObjects = []
        switch (videoType) {
          case 'highlight':
            urlObjects = getHighlightUrls(videoObj)
            break
          case 'upload':
            urlObjects = getUploadedVideoUrls(videoObj)
            break
          case 'archive':
          default:
            urlObjects = getBroadcastArchiveUrls(videoObj)
            break
        }
        if (urlObjects.length === 0) {
          console.debug(TAG, 'No working URLs found...')
          return
        }
        urlObjects.sort((a, b) => {
          if (a.url.includes('chunked')) {
            return -1
          }
          if (b.url.includes('chunked')) {
            return 1
          }
          const aMatch = a.url.match(/\/(\d+)p(\d+)\/[\w-]+\.m3u8/)
          const bMatch = b.url.match(/\/(\d+)p(\d+)\/[\w-]+\.m3u8/)
          if (aMatch && bMatch) {
            if (Number(aMatch[1]) + Number(aMatch[2]) < Number(bMatch[1]) + Number(bMatch[2])) {
              return 1
            }
            return -1
          }
          return 0
        })
        const playlistString = getPlaylistString(urlObjects.filter(u => u.resolution))
        const encoder = new TextEncoder() // new TextEncoder('utf-8')
        const encodedPlaylistString = encoder.encode(playlistString)
        const blobUrl = URL.createObjectURL(new Blob([encodedPlaylistString]))
        createPlayer(blobUrl)
      }
      catch (err) {
        console.log(TAG, 'Error:', err)
      }
    })
    // Clean up saved states that are older than 30 days
    const vodPlayer_now = Date.now()
    Object.entries(localStorage)
      .filter(([key,]) => key.startsWith(LOCAL_STORAGE_TAG))
      .filter(([, value]) => JSON.parse(value).lastUpdated < (vodPlayer_now - LOCAL_STORAGE_ENTRY_TTL_SECONDS * 1000))
      .forEach(([key,]) => {
        localStorage.removeItem(key)
      })

    // EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
    var injectStylesIntoStyleTag = __webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js")
    var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag)
    // EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./src/style.css
    var style = __webpack_require__("./node_modules/css-loader/dist/cjs.js!./src/style.css");
    ;// CONCATENATED MODULE: ./src/style.css



    var options = { "insert": "html" }

    options.insert = "html"
    options.singleton = false

    var update = injectStylesIntoStyleTag_default()(style/* default */.Z, options)



/* harmony default export */ var src_style = (style/* default.locals */.Z.locals || {});
    ;// CONCATENATED MODULE: ./src/index.ts
    var src_awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
      function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value) }) }
      return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)) } catch (e) { reject(e) } }
        function rejected(value) { try { step(generator["throw"](value)) } catch (e) { reject(e) } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected) }
        step((generator = generator.apply(thisArg, _arguments || [])).next())
      })
    }



    const src_TAG = '[Twitch VOD Unblocker]'
    const WHITELISTED_PATHS = [
      '/friends',
      '/subscriptions',
      '/drops/inventory',
      '/wallet',
      '/settings',
      '/directory',
    ];
    (function hijackFetch() {
      if (window.__TwitchVodUnblocker_fetch) {
        return
      }
      const ogFetch = window.fetch
      window.fetch = function (url, opts) {
        return src_awaiter(this, arguments, void 0, function* () {
          if (url.toString().includes('gql.twitch')) {
            const { body } = opts
            if (body && body.toString().includes('PlaybackAccessToken')) {
              const response = yield ogFetch(url, opts)
              try {
                const { data } = yield response.clone().json()
                const accessData = JSON.parse(data.videoPlaybackAccessToken.value)
                const restrictedBitrates = accessData.chansub.restricted_bitrates
                const canPlay = restrictedBitrates.length === 0
                if (!canPlay) {
                  console.debug(src_TAG, 'Running...', data)
                  const vodId = accessData.vod_id
                  try {
                    waitForPlayerElement()
                    startVodPlayer(vodId)
                    window.__TwitchVodUnblocker_needReset = true
                  }
                  catch (_a) {
                    console.debug(src_TAG, 'PLAYER NOT FOUND, BYE.')
                  }
                }
              }
              catch (e) {
                // console.error(e)
              }
            }
          }
          return ogFetch.apply(window, arguments)
        })
      }
      window.__TwitchVodUnblocker_fetch = true
    })();
    (function hijackHistoryState() {
      if (window.__TwitchVodUnblocker_history) {
        return
      }
      const sameVodPage = () => window.location.pathname.startsWith(`/videos/${window.vodID}`)
      const resetIfNeeded = () => {
        if (!window.__TwitchVodUnblocker_needReset) {
          return
        }
        if (!WHITELISTED_PATHS.some(p => window.location.pathname.startsWith(p)) && !sameVodPage()) {
          window.location.reload()
        }
      }
      const ogPushState = history.pushState
      history.pushState = function () {
        ogPushState.apply(history, arguments)
        resetIfNeeded()
      }
      const ogReplaceState = history.replaceState
      history.replaceState = function () {
        ogReplaceState.apply(history, arguments)
        resetIfNeeded()
      }
      window.addEventListener('popstate', () => {
        resetIfNeeded()
      })
      window.__TwitchVodUnblocker_history = true
    })()

  }()
  /******/
})()
  