// ==UserScript==
// @name         Twitch Beautify
// @version      0.0.20
// @author       spatch
// @license      MIT
// @description  Beautify the Twitch viewing screen, automatic clicks for lazy people, automatic pause and mute on the homepage, and automatic playback of videos.
// @namespace    dumpsterbaby.lol
// @homepage     https://github.com/danydodson/userscripts/blob/main/src/Twitch_Beautify.user.js
// @icon         https://icons.duckduckgo.com/ip2/twitch.tv.ico
// @match        *://*.twitch.tv/*
// @run-at       document-body
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @resource     jui https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css
// ==/UserScript==

// https://greasyfork.org/users/989635

(function () {
  var enabledstate,
      home = "https://www.twitch.tv/",
      pattern = /^https:\/\/www\.twitch\.tv\/.+/,
      language = display_language(navigator.language)

  /* ======================= Determine whether to call for beautification ========================= */
  if (GM_getValue("Beautify", [])) {
    enabledstate = language[1]
    if (document.URL === home) { PlayerAborted(true) } // Home Video Silent
    main()
    setTimeout(DeleteFooter, 500)
  } else {
    enabledstate = language[0]
  }
  GM_registerMenuCommand(enabledstate, function () { Use() })

  /* ======================= Detection beautification trigger and recovery (API) ========================= */

  /* Listen to the use of beautification */
  async function main() {
    const observer = new MutationObserver(() => {
      if (pattern.test(document.URL) && document.querySelector("video")) {
        observer.disconnect()
        ActivityDeletion() // Close event announcement (Temporarily add)
        BeautifyTrigger()
        fun($("div[data-a-player-state='']"), false)
      }
    })
    observer.observe(document.head, { childList: true, subtree: true })
  }

  /* Homepage restoration monitoring */
  async function HomeRecovery(Nav, CB, CX) {
    const observer = new MutationObserver(() => {
      if (document.URL === home) {
        observer.disconnect()
        Nav.removeClass("Nav_Effect")
        CX.removeClass("Channel_Expand_Effect")
        CB.removeClass("button_Effect")
        fun($("div[data-a-player-state='mini']"))
        main()// Re -execution of beautification supervision listening
      }
    })
    observer.observe(document.head, { childList: true, subtree: true })
  }

  /* Waiting element */
  async function WaitElem(selectors, timeout, callback) {
    let timer, elements
    const observer = new MutationObserver(() => {
      elements = selectors.map(selector => $(selector))
      if (elements.every(element => element[0])) {
        observer.disconnect()
        clearTimeout(timer)
        callback(elements)
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
    timer = setTimeout(() => {
      observer.disconnect()
    }, timeout)
  }

  /* Add JS */
  async function addscript(Rule, ID = "Add-script") {
    let new_script = document.getElementById(ID)
    if (!new_script) {
      new_script = document.createElement("script")
      new_script.id = ID
      document.head.appendChild(new_script)
    }
    new_script.appendChild(document.createTextNode(Rule))
  }

  /* Import style */
  GM_addStyle(`
        ${GM_getResourceText("jui")}
        .drag-border {
            border: 2px solid white;
            border-radius: 10px;
        }
    `)

  /* ======================= Beautify ========================= */

  /* Find the Video page element */
  async function BeautifyTrigger() {
    const Elem = [
      "nav", // Guide
      ".side-nav", // Channel element
      ".simplebar-track.vertical", // Storage state
      "div[data-a-player-state='']", // Film block
      "button[data-a-target='side-nav-arrow']", // Channel button
      "button[data-a-target='right-column__toggle-collapse-btn']" // chatroom button
    ]
    WaitElem(Elem, 8000, element => {
      const [Nav, Channel, Collapsed_State, player, Channel_Button, Chat_button] = element
      const Channel_Parent = Channel.parent()
      // It should always be opened for judging twice, right?
      if (Collapsed_State.css("visibility") !== "visible") { Channel_Button.click() }
      if (Collapsed_State.css("visibility") === "hidden") { Channel_Button.click() }
      if (!$("#ADB")[0]) { AdProcessing() } // Delete test
      Beautify(Nav, player, Channel_Parent) // Interface beautification
      AutoClickC(Chat_button, Channel_Button) // Lazy people automatically click
      PlayerAborted(false) // Recovery sound
      ResumeWatching() // Surveillance resumed watching
      HomeRecovery(Nav, Channel_Button, Channel_Parent) // Homepage recovery monitoring
    })
  }

  /* Beautification */
  async function Beautify(Nav, play, CX) {
    GM_addStyle(`
            .Nav_Effect {
                opacity: 0;
                height: 1rem !important;
                transition: opacity 0.5s , height 0.8s;
            }
            .Nav_Effect:hover {
                opacity: 1;
                height: 5rem !important;
            }
            .Channel_Expand_Effect {
                opacity: 0;
                width: 1rem;
                transition: opacity 0.4s , width 0.7s;
            }
            .Channel_Expand_Effect:hover {
                opacity: 1;
                width: 24rem;
            }
        `)
    //play.css("z-index", "9999");
    Nav.addClass("Nav_Effect")
    CX.addClass("Channel_Expand_Effect")
  }

  /* ======================= Additional features ========================= */

  /* Automatically restore to watch */
  async function ResumeWatching() {
    let recover
    const observer = new MutationObserver(() => {
      try { recover = $("div[data-a-target='player-overlay-content-gate'] button") } catch { }
      if (document.URL === home) {
        observer.disconnect()
      } else if (recover.length > 0) {
        recover.click()
      }
    })
    observer.observe($("div[data-a-player-state='']")[0], { childList: true, subtree: true })
  }

  /* Lazy people automatically click */
  async function AutoClickC(Chat_button, Channel_Button) {
    GM_addStyle(`
            .button_Effect {
                transform: translateY(10px);
                color: rgba(239, 239, 241, 0.3) !important;
            }
            .button_Effect:hover {
                color: rgb(239, 239, 241) !important;
            }
        `)
    let timer, timer2
    Chat_button.addClass("button_Effect")
    Channel_Button.addClass("button_Effect")

    Chat_button.on('mouseenter', function () {
      timer = setTimeout(function () {
        Chat_button.click()
      }, 250)
    })
    Chat_button.on('mouseleave', function () {
      Chat_button.addClass("button_Effect")
      clearTimeout(timer)
    })

    Channel_Button.css("transform", "translateY(19px)")
    Channel_Button.on('mouseenter', function () {
      timer2 = setTimeout(function () {
        Channel_Button.click()
      }, 250)
    })
    Channel_Button.on('mouseleave', function () {
      Channel_Button.addClass("button_Effect")
      clearTimeout(timer2)
    })
  }

  /* Drag and add */
  async function fun(element, state = true) {
    if (element.length > 0) {
      if (state) {
        element.draggable({
          cursor: "grabbing",
          start: function (event, ui) {
            $(this).find("div.ScAspectRatio-sc-18km980-1").addClass("drag-border")
          },
          stop: function (event, ui) {
            $(this).find("div.ScAspectRatio-sc-18km980-1").removeClass("drag-border")
          }
        })
        element.resizable({
          handles: "all",
          minWidth: 50,
          minHeight: 50,
          aspectRatio: 16 / 10
        })
      } else {
        if (element.data("ui-draggable")) {
          element.draggable("destroy")
          element.resizable("destroy")
        }
      }
    }
  }

  /* The film pause and mute (Stupid writing But I'm too lazy to change) */
  async function PlayerAborted(control) {
    let timeout = 0, interval = setInterval(() => {
      const player = document.querySelector("video")
      if (player) {
        clearInterval(interval)
        if (control) {
          const interval = setInterval(() => {
            try {
              player.pause()
              player.muted = true
              if (player.paused && player.muted) {
                clearInterval(interval)
              } else {
                timeout++
                if (timeout > 30) {
                  clearInterval(interval)
                }
              }
            } catch { }
          }, 300)
          } else {
            const interval = setInterval(() => {
              try {
                player.play()
                player.muted = false
                if (!player.paused && !player.muted) {
                  clearInterval(interval)
                } else {
                  timeout++
                  if (timeout > 30) {
                    clearInterval(interval)
                  }
                }
              } catch { }
            }, 300)
            }
      }
    }, 500)
    }

  /* Hidden advertisement written casually, (test) */
  async function AdProcessing() {
    addscript(`
            const interval = setInterval(() => {
                document.querySelectorAll("iframe").forEach(iframe => {iframe.remove()});
            }, 1500)
        `, "ADB")
    $("iframe").each(function () { $(this).remove() })
  }

  /* Delete the foot */
  async function DeleteFooter() {
    try { $("#twilight-sticky-footer-root").css("display", "none") } catch { }
  }

  /* Close activity bar */
  async function ActivityDeletion() {
    WaitElem(["div.Layout-sc-1xcs6mc-0.itnkhV button"], 8000, element => {
      document.querySelector("div.Layout-sc-1xcs6mc-0.itnkhV button").click()
    })
  }

  /* ======================= Switch/Adaptive ========================= */

  /* Use the settings switch */
  function Use() {
    if (GM_getValue("Beautify", [])) {
      GM_setValue("Beautify", false)
    } else {
      GM_setValue("Beautify", true)
    }
    location.reload()
  }

  function display_language(language) {
    let display = {
      // "zh-TW": ["🛠️ 以禁用美化❌", "🛠️ 以啟用美化✅"],
      // "zh-CN": ["🛠️ 已禁用美化❌", "🛠️ 已启用美化✅"],
      // "ko": ["🛠️ 미화 비활성화❌", "🛠️ 미화 활성화✅"],
      // "ja": ["🛠️ 美化を無効にしました❌", "🛠️ 美化を有効にしました✅"],
      "en-US": ["🛠️ Beautification disabled ❌", "🛠️ Beautification enabled ✅"],
    }
    return display[language] || display["en-US"]
  }
})()