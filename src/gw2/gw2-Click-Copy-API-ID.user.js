// ==UserScript==
// @name           GW2: Click Copy API ID
// @namespace      https://greasyfork.org/scripts/413426
// @version        1.0
// @description    add a button to copy API ID code of items, skills, traits on wiki.guildwars2.com
// @icon           https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/46b63d3c-ae67-464c-9a37-670829b2a157/da1va1z-652b959c-bbf1-4cc6-bfad-5c26975ff895.png/v1/fill/w_512,h_512/guild_wars_2___icon_by_blagoicons_da1va1z-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NTEyIiwicGF0aCI6IlwvZlwvNDZiNjNkM2MtYWU2Ny00NjRjLTlhMzctNjcwODI5YjJhMTU3XC9kYTF2YTF6LTY1MmI5NTljLWJiZjEtNGNjNi1iZmFkLTVjMjY5NzVmZjg5NS5wbmciLCJ3aWR0aCI6Ijw9NTEyIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.17v0mgVemPr54Uv85KUwsgKoz3FIpYn2abKYBbCOtgo
// @run-at         document-end
// @require        https://unpkg.com/jquery@3/dist/jquery.min.js
// @match          https://wiki.guildwars2.com/wiki/*
// @grant          none
// @license        GPL-v3
// @icon           https://wiki.guildwars2.com/favicon.ico
// ==/UserScript==

/* global $ */

// About the Author
// Saber Lily.1960 CURRENT in WSR EU Server
// Lili Mile Gay Gay, a leisure and fierce battle for a daily water 2 European service player.
// If you think the script is helpful to you, please sponsor me!

// If there are bugs, please feedback in the script comment area of GREASYFORK.org.
// For private scripts, please contact me to pay customized, QQ: 610915518

// Copyright statement
// This script is originally created by Saber Lily.1960, and the reprint scope is prohibited without the author's authorization. The scope of the prohibition is not limited to: post bar, NGA forum, etc.

$('a[rel="nofollow"][class="external text"]').each(function () {
    if ($(this).attr("href") && $(this).attr("href").startsWith("https://api.guildwars2.com/v2")) {
      var iidd = $(this).attr("href").toString().split("ids=", 2)[1].split("&", 2)[0]
      var html = ' <button type="button" onclick="copyToClipboard('.concat(iidd, ')">Copy ', iidd, '</button>')
      $(this).after(html)
    };
  })
  
  var ctc = `<script>
  function copyToClipboard(text) {
      if (window.clipboardData && window.clipboardData.setData) {
          // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
          return clipboardData.setData("Text", text);
  
      }
      else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
          var textarea = document.createElement("textarea");
          textarea.textContent = text;
          textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in Microsoft Edge.
          document.body.appendChild(textarea);
          textarea.select();
          try {
              return document.execCommand("copy");  // Security exception may be thrown by some browsers.
          }
          catch (ex) {
              console.warn("Copy to clipboard failed.", ex);
              return false;
          }
          finally {
              document.body.removeChild(textarea);
          }
      }
  }
  </script>`
  
  $('#globalWrapper').after(ctc)