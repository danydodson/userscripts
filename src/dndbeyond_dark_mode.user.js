// ==UserScript==
// @name         DND Beyond Dark Mode
// @version      0.1.4
// @description  Makes AVTT a little easier on the eyes.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @author       Cyelis1224
// @include      https://*dndbeyond.com/campaigns/*
// @include      https://*dndbeyond.com/encounters/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @namespace    http://tampermonkey.net/
// @downloadURL  https://update.greasyfork.org/scripts/436221/Above%20VTT%20Dark%20Mode.user.js
// @updateURL    https://update.greasyfork.org/scripts/436221/Above%20VTT%20Dark%20Mode.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.innerHTML = css;
  head.appendChild(style);
}

addGlobalStyle(``)

addGlobalStyles(/* css */`
  .GameLogEntry_Message__1GoY3 button {
    align-items: center;
    background-image: -webkit-linear-gradient(top, #3d3d3d, #000);
    color: #fff;
    height: 32px;
  }

  .GameLog_GameLogContainer__2YlSC {
    background: #00000000;
  }

  .GameLogEntry_Message__1J8lC.GameLogEntry_Other__1rv5g {
    color: #999;
    background: #333;
  }

  .dice-rolling-panel .dice-toolbar {
    bottom: 28px;
  }

  .GameLog_GameLog__2z_HZ {
    overflow: hidden !important;
  }

  .ddb-campaigns-character-card-footer-links {
    height: 80px;
    flex-wrap: wrap;
  }

  .GameLogEntry_Message__1GoY3 button:hover {
    color: #000;
    background-image: none;
    background: #000;
  }

  .material-icons.md-16 {
    font-size: 16px;
    color: black !important;
  }

  .material-icons.md-dark {
    color: white;
  }

  .material-icons.button-icon {
    color: none;
    font-size: 22px;
    margin: 2px -5px;
  }

  .top_menu {
    background: #00000000;
    top: 40px !important;
  }

  button#scene_selector_toggle {
    background: black;
    color: white !important;
  }

  button#scene_selector_toggle:hover {
    background: black;
    color: white !important;
  }

  button#select-button {
    background: black;
    color: white !important;
  }

  button#combat_button {
    filter: invert(1);
    font-weight: bold;
  }

  button#measure-button {
    background: black;
    color: white !important;
  }

  button#fog_button {
    background: black;
    color: white !important;
  }

  button#draw_button {
    background: black;
    color: white !important;
  }

  button#aoe_button {
    background: black;
    color: white !important;
  }

  button#help_button {
    background: black;
    color: white !important;
  }

  button#stream_button {
    background: white;
    filter: invert(1);
  }

  button#hide_rightpanel {
    filter: invert(1);
    color: white !important;
  }

  button#zoom_fit {
    color: white !important;
    filter: invert(1);
  }

  button#zoom_minus {
    filter: invert(1);
    color: white !important;
  }

  button#zoom_plus {
    filter: invert(1);
    color: white !important;
  }

  button#jitsi_switch {
    filter: invert(1);
  }

  button#switch_gamelog {
    filter: invert(1);
  }

  button#switch_characters {
    filter: invert(1);
  }

  button#switch_panel {
    filter: invert(1);
  }

  button#switch_tokens {
    filter: invert(1);
  }

  button#switch_journal {
    filter: invert(1);
  }

  .top_menu button {
    filter: invert(1);
    color: white;
  }

  #scene_selector_toggle>span {
    filter: invert(1);
  }

  .scene {
    height: 60px;
  }

  #combat_tracker_inside .tracker-list {
    height: calc(100% - 30px);
  }

  .GameLog_GameLogEntries__3oNPD {
    background: #00000000 !important;
  }

  .sidebar__pane-content {
    background: #00000080 !important;
    height: 100% !important;
    color: white !important;
  }

  #combat_tracker_inside .tracker-list {
    background: #000000;
    color: white;
  }

  div#scene_selector,
  #combat_tracker_inside,
  #edit_dialog,
  #mega_importer,
  #prewiz,
  #wizard_popup,
  .top_menu {
    background: #00000080 !important;
    background-image: none !important;
  }

  .dice-roller {
    filter: invert(1);
  }

  #round_number_label {
    background: #333;
    color: white;
  }

  .aoeshape:focus,
  .drawbutton.button-enabled {
    background-image: none !important;
    background: black !important;
    color: white !important;
  }

  .soundpad-section-title {
    background: #333 !important;
    font-size: 22px !important;
  }

  .journal-chapter-title {
    font-size: 22px !important;
    background: #333 !important;
  }

  .btn-del-chapter {
    font-size: 14px !important;
  }

  .player-card {
    color: black;
    background: linear-gradient(#333, #000) !important;
  }

  .player-info {
    filter: brightness(0) invert(1);
  }

  .player-name {
    color: white !important;
  }

  .player-no-attributes {
    color: white !important;
  }
`);
