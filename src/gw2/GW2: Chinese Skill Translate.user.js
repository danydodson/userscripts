// ==UserScript==
// @name         GW2: Chinese Skill Translate
// @namespace    https://egore.url.lol/userscripts
// @version      2.1
// @description  Bundle Fighting 2 Metabattle, Snowrows, discretize The English skills description above the Raiders website is replaced by Chinese, which is convenient for beautiful uniforms/European service player reference.
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/46b63d3c-ae67-464c-9a37-670829b2a157/da1va1z-652b959c-bbf1-4cc6-bfad-5c26975ff895.png/v1/fill/w_512,h_512/guild_wars_2___icon_by_blagoicons_da1va1z-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6IlwvZlwvNDZiNjNkM2MtYWU2Ny00NjRjLTlhMzctNjcwODI5YjJhMTU3XC9kYTF2YTF6LTY1MmI5NTljLWJiZjEtNGNjNi1iZmFkLTVjMjY5NzVmZjg5NS5wbmciLCJ3aWR0aCI6Ijw9NTEyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.17v0mgVemPr54Uv85KUwsgKoz3FIpYn2abKYBbCOtgo
// @author       Saber Lily Lili miles Gay mile gay qi
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @match        https://metabattle.com/wiki/*
// @match        https://snowcrows.com/*
// @match        https://lucky-noobs.com/*
// @match        https://discretize.eu/*
// @match        https://www.godsofpvp.net/*
// @match        https://fast.farming-community.eu/*
// @match        https://guildjen.com/*
// @match        https://hardstuck.gg/*
// @grant        none
// @license      GPL-v3
// ==/UserScript==

// About the Author
// author:    https://github.com/acbetter
// Lili miles GAY mile gay, a leisure of paddling every day Fighting 2 Player.Bilibili: But white grass.
// If you think this script is helpful to you, please sponsor me!

// Script principle
// 1. pass GW2A_EMBED_OPTIONS Options, adjustment and modification GW2ARMORY Request parameters
// 2. Hijack Metabattle, Snowrows, discretize 的 Ajax Api Request, tampering with its access address so that it returns Chinese data.

// A known Bug, it will not fix
// 1. Metabattle There is no translation of food, wrench, etc.
// 2. Metabattle There are no translations of weapon groups, law seals and some weapon skills
// 3. Burn fire F1、F2 and F3 There is no translation after the skills

console.log('GW2 Skill Zh-CN Fighting War 2 Skill Traactivatedation Plug -in by Saber Lily activated!')

document.GW2A_EMBED_OPTIONS = {
  lang: 'zh'
}

window.onload = function () {
  document.body.addEventListener('mousedown', ev => {
    const a = event.target.closest('a')
    if (a && a.hasAttribute('href') && a.getAttribute('href').toString().includes('guildwars2.com/wiki/Special:Search/')) {
      const b = a.parentNode.parentNode.parentNode
      if (b.hasAttribute('data-armory-ids')) {
        const c = b.getElementsByClassName('gw2a--M9jBV')
        var wikiid = 0
        if (c.length > 1) {
          for (let i = 0; i < c.length; i++) {
            if (c[i].contains(a)) {
              wikiid = b.getAttribute('data-armory-ids').toString().split(',')[i]
              break
            }
          }
        } else {
          wikiid = b.getAttribute('data-armory-ids').toString().replace(',', '')
        }
        a.href = 'https://wiki.guildwars2.com/wiki/Special:RunQuery/Search_by_id?title=Special%3ARunQuery%2FSearch_by_id&pfRunQueryFormName=Search+by+id&Search+by+id%5Bid%5D=' + wikiid
      };
    }
  })
}

ah.proxy({
  onRequest: (config, handler) => {
    if (config.url.startsWith('https://api.guildwars2.com/')) {
      config.url = config.url.replace('lang=en', 'lang=zh')
      console.log(config, handler)
    }
    handler.next(config)
  },
  onError: (err, handler) => {
    handler.next(err)
  },
  onResponse: (response, handler) => {
    handler.next(response)
  }
})

// some hack from https://stackoverflow.com/questions/45425169/intercept-fetch-api-requests-and-responses-in-javascript

const { fetch: origFetch } = window

window.fetch = async (...args) => {
  if (args[0].startsWith('https://api.guildwars2.com/')) {
    args[0] = args[0].replace('lang=en', 'lang=zh')
  }
  console.log("fetch called with args:", args)
  const response = await origFetch(...args)

  /* work with the cloned response in a separate promise
   chain -- could use the same chain with `await`. */
  response
    .clone()
    .json()
    .then(body => console.log("intercepted response:", body))
    .catch(err => console.error(err))


  /* the original response can be resolved unmodified: */
  return response
}