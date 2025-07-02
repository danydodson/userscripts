// ==UserScript==
// @name         DnD Beyond Colors
// @version      1.0.0
// @author       spatch
// @description  Custom css styles for dndbeyond.com
// @namespace    dumpsterbaby.lol
// @license      MIT
// @homepage     https://github.com/danydodson/userscripts/blob/main/src/DnD_Beyond_Colors.user.js
// @updateURL    https://github.com/danydodson/userscripts/blob/main/src/DnD_Beyond_Colors.user.js
// @downloadURL  https://github.com/danydodson/userscripts/blob/main/src/DnD_Beyond_Colors.user.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @match        https://*dndbeyond.com/characters/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    init();
  });


  const changeColors = async () => {
    let paths = document.querySelectorAll("#character-tools-target div.ct-character-sheet__inner div.ddbc-box-background svg > path:nth-child(1)");
    let polys = document.querySelectorAll("#character-tools-target div.ct-character-sheet__inner div.ddbc-box-background svg polygon");

    const rfns = () => {
      for (let i = 0; i < paths.length; i++) {
        paths[i].removeAttribute('fill');
        paths[i].setAttribute('fill', '#000000e6');
        console.log('Changed fill attributes for <path>');
      }
      for (let i = 0; i < polys.length; i++) {
        polys[i].removeAttribute('fill');
        polys[i].setAttribute('fill', '#000000e6');
        console.log('Changed fill attributes for <polygon>');
      }
    };
    return rfns;
  };

  // function init() {
  //   console.log('Coloring D&D Beyond...');

  //   const paths = document.querySelectorAll("#character-tools-target div.ct-character-sheet__inner div.ddbc-box-background svg > path:nth-child(1)");
  //   const polys = document.querySelectorAll("#character-tools-target div.ct-character-sheet__inner div.ddbc-box-background svg polygon");

  //   for (let i = 0; i < paths.length; i++) {
  //     paths[i].removeAttribute('fill');
  //     paths[i].setAttribute('fill', '#000000e6');
  //     console.log('Changed fill attributes for <path>');
  //   }

  //   for (let i = 0; i < polys.length; i++) {
  //     polys[i].removeAttribute('fill');
  //     polys[i].setAttribute('fill', '#000000e6');
  //     console.log('Changed fill attributes for <polygon>');
  //   }
  // };
})();