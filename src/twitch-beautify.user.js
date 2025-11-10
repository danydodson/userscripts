// ==UserScript==
// @name         Twitch Beautify
// @version      0.0.23
// @author       Canaan HS
// @description  Live page: Auto-beautify, auto-collapse buttons on mouse hover, auto-trigger replay function. Home page: Restore original style, auto-pause and mute, draggable and scalable live window.
// @icon         https://icons.duckduckgo.com/ip2/twitch.tv.ico
// @license      MIT
// @namespace    https://greasyfork.org/users/989635
// @downloadURL  https://update.greasyfork.org/scripts/472085/Twitch%20Beautify.user.js
// @updateURL    https://update.greasyfork.org/scripts/472085/Twitch%20Beautify.meta.js
// @match        *://*.twitch.tv/*
// @include      *://*twitch.tv/_deck
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/jquery-ui.min.js
// @require      https://update.greasyfork.org/scripts/495339/1382008/ObjectSyntax_min.js
// @resource     jui https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.13.2/themes/base/jquery-ui.min.css
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_getResourceText
// @grant        window.onurlchange
// @grant        GM_registerMenuCommand
// @run-at       document-body
// ==/UserScript==

(function () {
  const d = function (a) {
    var b = {
      MS_01: "Disabled",
      MS_02: "Enabled"
    };
    var c = {
      MS_01: "Disabled",
      MS_02: "Enabled"
    };
    b = {
      ja: {
        MS_01: "Disabled",
        MS_02: "Enabled"
      },
      ko: {
        MS_01: "Disabled",
        MS_02: "Enabled"
      },
      "en-US": {
        MS_01: "Beautification Disabled",
        MS_02: "Beautification Enabled"
      },
      "zh-CN": b,
      "zh-SG": b,
      "zh-TW": c,
      "zh-HK": c,
      "zh-MO": c
    };
    return b[a] || b["en-US"];
  }(Syn.Device.Lang);
  (new class {
    constructor() {
      this.Control_Interval = this.Control_Timeout = this.Control_Token = this.Channel_Parent = this.Channel_Button = this.Chat_Button = this.Resume = this.Frame = this.Nav = null;
      this.IsLive = a => /^https:\/\/www\.twitch\.tv\/(?!directory|settings|drops|wallet|subscriptions).+[^\/]$/.test(a);
      this.RegisterMenu = a => {
        Syn.Menu({
          [a]: { func: () => this.Use(), close: !1 }
        });
      };
      this.Start = async () => {
        Syn.AddListener(window, "urlchange", a => {
          this.IsLive(a.url) && (Syn.RemovListener(window, "urlchange"), this.Trigger());
        });
      };
      this.End = async () => {
        Syn.AddListener(window, "urlchange", a => {
          this.IsLive(a.url) || (this.Reset(), this.Fun($("div[data-a-player-state='mini']")), this.Start());
        });
      };
      this.Use = async () => {
        Syn.Store("g", "Beautify", [])
          ? (this.Reset(), this.RegisterMenu(d.MS_01), Syn.Store("s", "Beautify", !1))
          : (this.IsLive(document.URL) ? this.Trigger() : this.Start(), this.RegisterMenu(d.MS_02), Syn.Store("s", "Beautify", !0));
      };
      this.Reset = async () => {
        this.Nav && (this.Resume.disconnect(), Syn.RemovListener(window, "urlchange"), requestAnimationFrame(() => {
          this.Nav.classList.remove("Nav_Effect");
          this.Channel_Button.removeAttribute("style");
          this.Channel_Button.classList.remove("Button_Effect");
          this.Channel_Parent.classList.remove("Channel_Expand_Effect");
        }),
          Syn.RemovListener(this.Channel_Button, "mouseenter"),
          Syn.RemovListener(this.Channel_Button, "mouseleave"));
      };
    }

    async Main() {
      this.ImportStyle();
      Syn.Store("g", "Beautify", [])
        ? (this.ClearFooter(), this.RegisterMenu(d.MS_02), this.IsLive(Syn.Device.Url)
          ? this.Trigger()
          : (this.Start(), this.PlayControl(!1))) : this.RegisterMenu(d.MS_01);
    }



    async Trigger() {
      Syn.WaitMap(`nav;.side-nav;.side-nav-section div;[data-a-player-state=''];[data-a-target='side-nav-arrow'];[data-a-target='right-column__toggle-collapse-btn']`.split(";"), a => {
        const [b, c, g, e, f, h] = a;
        this.Nav = b;
        this.Frame = e;
        this.Chat_Button = h;
        this.Channel_Button = f;
        this.Channel_Parent = c.parentNode;
        this.Beautify();
        this.AutoClick();
        this.ResumeWatching();
        this.PlayControl(!0);
        this.Fun($(e), !1);
        !g.getAttribute("data-a-target") && f.click();
        this.End();
      }, {
        raf: !0
      });
    }

    async Beautify() {
      requestAnimationFrame(() => {
        this.Nav.classList.add("Nav_Effect");
        this.Channel_Parent.classList.add("Channel_Expand_Effect");
      });
    }

    async AutoClick() {
      this.Chat_Button.classList.add("Button_Effect");
      this.Channel_Button.classList.add("Button_Effect");
      this.Channel_Button.style.transform = "translateY(15px)";
      let a;
      Syn.AddListener(this.Channel_Button, "mouseenter", () => {
        a = setTimeout(() => {
          this.Channel_Button.click();
        }, 250);
      });
      Syn.AddListener(this.Channel_Button, "mouseleave", () => {
        clearTimeout(a);
        this.Channel_Button.classList.add("Button_Effect");
      });
      let b;
      Syn.AddListener(this.Chat_Button, "mouseenter", () => {
        b = setTimeout(() => {
          this.Chat_Button.click();
        }, 250);
      });
      Syn.AddListener(this.Chat_Button, "mouseleave", () => {
        clearTimeout(b);
        this.Chat_Button.classList.add("Button_Effect");
      });
    }

    async PlayControl(a) {
      clearTimeout(this.Control_Timeout);
      clearInterval(this.Control_Interval);
      const b = Symbol("Token");
      this.Control_Token = b;
      Syn.WaitElem("video", c => {
        this.Control_Token === b && (this.Control_Interval = setInterval(a ? () => {
          c.play();
          c.muted = !1;
        } : () => {
          c.pause();
          c.muted = !0;
        }, 500), this.Control_Timeout = setTimeout(() => {
          clearInterval(this.Control_Interval);
        }, 8E3));
      }, { raf: !0 });
    }

    async ResumeWatching() {
      let a;
      this.Resume = new MutationObserver(() => {
        (a = Syn.$$(".itFOsv")) && a.click();
      });
      this.Resume.observe(this.Frame, {
        childList: !0,
        subtree: !0
      });
    }

    async ClearFooter() {
      Syn.WaitElem("#twilight-sticky-footer-root", a => {
        a.remove();
      }, { throttle: 200 });
    }

    async Fun(a, b = !0) {
      0 < a.length && (b ? (a.draggable({
        cursor: "grabbing",
        start: function () { $(this).find(".doeqbO").addClass("Drag_Effect"); },
        stop: function () { $(this).find(".doeqbO").removeClass("Drag_Effect"); }
      }), a.css({
        top: $("nav").height() - 10,
        left: $(".side-nav").width() - 10,
        width: .68 * window.innerWidth,
        height: .88 * window.innerHeight
      }), a.resizable({
        minWidth: 50,
        minHeight: 50,
        handles: "all",
        aspectRatio: 1.6
      })) : a.data("ui-draggable") && (a.draggable("destroy"), a.resizable("destroy")));
    }
    async ImportStyle() {
      Syn.AddStyle(/*css*/`
        ${GM_getResourceText("jui")}
        .Nav_Effect {opacity: 0;height: 1rem !important;transition: opacity 0.5s , height 0.8s;}
        .Nav_Effect:hover {opacity: 1;height: 5rem !important;}
        .Channel_Expand_Effect {opacity: 0;width: 1rem;transition: opacity 0.4s , width 0.7s;}
        .Channel_Expand_Effect:hover {opacity: 1;width: 24rem;}
        .Button_Effect {transform: translateY(10px);color: rgba(239, 239, 241, 0.3) !important;}
        .Button_Effect:hover {color: rgb(239, 239, 241) !important;}
        .Drag_Effect {border-radius: 10px;border: 2px solid white;}
        /*_____*/
        .Layout-sc-1xcs6mc-0.bMcAyM.side-bar-contents {background-color: #18181b !important;}
        .scrollable-area.Akwmp.InjectLayout-sc-1i43xsx-0.side-nav__scrollable_content {background-color: #18181b !important;}
        .ScCoreButton-sc-ocjdkq-0.iPkwTD.ScButtonIcon-sc-9yap0r-0.dcNXJO.Button_Effect {padding-bottom: 20px !important}
      `,
        "Effect"
      );
    }
  })
    .Main();
})();

/* eslint-env jquery */
/* eslint no-undef: 0 */
/* eslint-env ObjectSyntax_min */