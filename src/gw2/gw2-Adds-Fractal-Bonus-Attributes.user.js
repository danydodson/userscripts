// ==UserScript==
// @name         gw2: Adds Fractal Bonus Attributes
// @namespace    https://greasyfork.org/scripts/412693
// @version      1.1
// @description  Add additional attributes to gw2skills.net
// @icon         https://wiki.guildwars2.com/favicon.ico
// @run-at       document-end
// @match        http://*.gw2skills.net/*
// @grant        none
// @license      GPL-v3
// ==/UserScript==

var gridWindow = document.querySelector(".ui-grid_window")

function calcAttribute() {
  var agonyAttribute = document.getElementById("agonyAttribute")
  var agonyResistance = document.getElementById("agonyResistance")

  var toughness = (agonyResistance.value * 1.5).toFixed(2).toString()
  var precision = (agonyResistance.value * 1.5 / 21).toFixed(2).toString()
  var concentration = (agonyResistance.value * 1.5 / 15).toFixed(1).toString()
  agonyAttribute.textContent = `Precision ${precision}%, Concentration ${concentration}%, Toughness ${toughness}`
}

if (gridWindow) {
  console.log('GW2 Skill Zh-CN more buff by Saber Lily activated!')

  var agonySummary = document.createElement("ul")
  agonySummary.innerHTML = '<div>Agony <input type="number" id="agonyResistance" value="150" min="0" max="500"></div><div id="agonyAttribute"></div>'
  agonySummary.className = "ui-grid ui-armor-summary"
  agonySummary.setAttribute("style", "font-size: 12px; left: 825px; width: 150px; height: 100px; line-height: 13px;")

  gridWindow.appendChild(agonySummary)
  calcAttribute()

  var agonyResistance = document.getElementById("agonyResistance")
  agonyResistance.addEventListener("input", (event) => {
    calcAttribute()
  })

}