// ==UserScript==
// @name         GW2 Adds Fractal Bonus
// @namespace    https://egore.url.lol/userscripts
// @version      1.1
// @description  Add additional attributes to gw2skills.net.
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/46b63d3c-ae67-464c-9a37-670829b2a157/da1va1z-652b959c-bbf1-4cc6-bfad-5c26975ff895.png/v1/fill/w_512,h_512/guild_wars_2___icon_by_blagoicons_da1va1z-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6IlwvZlwvNDZiNjNkM2MtYWU2Ny00NjRjLTlhMzctNjcwODI5YjJhMTU3XC9kYTF2YTF6LTY1MmI5NTljLWJiZjEtNGNjNi1iZmFkLTVjMjY5NzVmZjg5NS5wbmciLCJ3aWR0aCI6Ijw9NTEyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.17v0mgVemPr54Uv85KUwsgKoz3FIpYn2abKYBbCOtgo
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