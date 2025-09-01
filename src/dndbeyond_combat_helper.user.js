// ==UserScript==
// @name         DND Beyond Combat Helper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Track Status in dndbeyond
// @author       Xanlantos
// @match        https://www.dndbeyond.com/combat-tracker/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @license       https://tldrlegal.com/license/creative-commons-attribution-noncommercial-(cc-nc)#summary
// @downloadURL https://update.greasyfork.org/scripts/455545/Combat%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/455545/Combat%20Helper.meta.js
// ==/UserScript==
function locateRightTimeing() {
  if (document.querySelector('.combatant-card__hp')) {
    main();
  } else {
    setTimeout(locateRightTimeing, 100);
  }
}
locateRightTimeing();
function main()
{
    console.log("start extra statuses");
    var combatCards =document.querySelectorAll('.combatant-card');
    console.table(combatCards);
    combatCards.forEach((item, index)=>{
       changeCard(item)
    })
}
function changeCard(card){
    let rightPart = card.querySelector(".combatant-card__right-bit");
    let widthHP = rightPart.querySelector(".combatant-card__hp");
    console.log(widthHP)
    rightPart.style.display = "block";
    const div = document.createElement("div");
    div.style.padding = "8px";
    let field= document.createElement("input");
    field.setAttribute('size', '6');
    field.type = "text";
    div.appendChild(field);
    rightPart.appendChild(div);
}



