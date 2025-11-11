// ==UserScript==
// @name            Twitch Refresh Page
// @name:de         Twitch Startseite aktualisieren
// @version         1.0.0
// @description     Updates the thumbnail, viewer count, title, game and live status of the recommended channels on the twitch homepage.
// @icon            https://static.twitchcdn.net/assets/favicon-32-e29e246c157142c94346.png
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/twitch-refresh-homepage
// @license         MIT
// @match           https://www.twitch.tv/*
// @require         https://cdn.jsdelivr.net/npm/axios@0.24.0/dist/axios.min.js
// ==/UserScript==

(function () {
  'use strict';

  //#region Console
  const err = (...msg) => {
    console.error('[%cTwitch Refresh Page%c] %cerror', 'color: rgb(29, 155, 240);', '', 'color: rgb(249, 24, 128);', ...msg);
  };
  const log = (...msg) => {
    console.info('[%cTwitch Refresh Page%c] %cinfo', 'color: rgb(29, 155, 240);', '', 'color: rgb(0, 186, 124);', ...msg);
  };
  const warn = (...msg) => {
    console.warn('[%cTwitch Refresh Page%c] %cwarn', 'color: rgb(29, 155, 240);', '', 'color: rgb(219, 160, 73);', ...msg);
  };
  //#endregion

  async function init() {
    const list = document.querySelectorAll("main article:not(:has(.tw-channel-status-text-indicator[style*='display: none']))");

    for (let i = 0; i < list.length; i++) {
      const usernameElem = list[i].querySelector("p");
      if (!usernameElem) {
        warn("Username paragraph not found in article:", list[i]);
        continue;
      }

      const username = usernameElem.innerText;
      const query = `query {
        user(login: \"${username}\") {
          id
          login
          displayName
          description
          createdAt
          roles {
            isPartner
          }
          stream {
            id
            title
            type
            viewersCount
            createdAt
            game {
              name
            }
          }
        }
      }`.replaceAll("\n", "").replaceAll("\t", " ");

      let data;
      try {
        const response = await axios.post("https://gql.twitch.tv/gql", {
          query: query,
          variables: {}
        }, {
          headers: {
            "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko",
            "Content-Type": "application/json"
          }
        });
        data = response.data.data.user;

      } catch (error) {
        err("Error fetching GQL data", error);
        continue;
      }

      if (data?.stream) {
        const streamData = data.stream;

        log(`Stream: ${data.displayName}`);

        const titleElem = list[i].querySelector("h3");
        if (titleElem) {
          titleElem.innerText = streamData.title ?? "";
          titleElem.title = streamData.title ?? "";
          // log(`Title: ${streamData.title}`);
        }

        const gameElem = list[i].querySelector("p a");
        if (gameElem && streamData.game && streamData.game.name) {
          gameElem.innerText = streamData.game.name;
          gameElem.href = `https://www.twitch.tv/directory/category/${streamData.game.name.toLowerCase().replaceAll(" ", "-")}`;
          // log(`Game: ${streamData.game.name}`);
        }

        const viewersElem = list[i].querySelector(".tw-media-card-stat");
        if (viewersElem) {
          const viewerText = viewersElem.innerText.split(" ").slice(1).join(" ");
          viewersElem.innerText = `${streamData.viewersCount.toLocaleString()} ${viewerText}`;
          // log(`Viewers: ${streamData.viewersCount.toLocaleString()}`);
        }
        const img = list[i].querySelector("img:nth-child(2)");
        if (img && img.src) {
          try {
            const url = new URL(img.src);
            img.src = `${url.origin}${url.pathname}?t=${Date.now()}`;
            // log(`Image: ${img.src}`);
          } catch (e) {
            warn("Could not update image src", e);
          }
        }
      } else {
        const statusElem = list[i].querySelector(".tw-channel-status-text-indicator");
        if (statusElem) {
          statusElem.style.display = "none";
        }
      }
    }
  }

  window.setInterval(init, 15000);
})();

/*eslint no-undef: 0*/

