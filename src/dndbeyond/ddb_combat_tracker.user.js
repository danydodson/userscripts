// ==UserScript==
// @name          D&DBeyond Combat Helper
// @version       0.0.1
// @author        spatch
// @license       MIT
// @description   Track Status in dndbeyond
// @namespace     dumpsterbaby.lol
// @homepage      https://github.com/danydodson/userscripts/blob/main/src/dndbeyond_combat_tracker.user.js
// @updateURL     https://github.com/danydodson/userscripts/blob/main/src/dndbeyond_combat_tracker.user.js
// @downloadURL   https://github.com/danydodson/userscripts/blob/main/src/dndbeyond_combat_tracker.user.js
// @icon          https://icons.duckduckgo.com/ip2/dndbeyond.com.ico
// @match         https://www.dndbeyond.com/combat-tracker/*
// @run-at        document-body
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @grant         GM_registerMenuCommand
// @require       https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @resource      jui https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css
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
