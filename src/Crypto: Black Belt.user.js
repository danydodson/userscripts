// ==UserScript==
// @name        Crypto: Black Belt
// @author      Schimon Jehudah, Adv.
// @namespace   https://egore.url.lol/userscripts
// @homepageURL https://openuserjs.org/scripts/sjehuda/Black_Belt
// @supportURL  https://openuserjs.org/scripts/sjehuda/Black_Belt/issues
// @updateURL   https://openuserjs.org/meta/sjehuda/Black_Belt.meta.js
// @downloadURL https://openuserjs.org/install/sjehuda/Black_Belt.user.js
// @copyright   2023, Schimon Jehudah (http://schimon.i2p)
// @license     MIT; https://opensource.org/licenses/MIT
// @description Find and display links inside a bar; Type of links: chat, contact, email, geo, magnet, media documents, metalinks, podcasts, syndication feeds, torrents and userscripts and wallets.
// @match       file:///*
// @match       *://*/*
// @version     23.11.23
// @run-at      document-end
// @noframes
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48dGV4dCB5PSIuOWVtIiBmb250LXNpemU9IjkwIj7wn6WLPC90ZXh0Pjwvc3ZnPg==
// ==/UserScript==

// NOTE
// Robe icons (Sauna pack) created by Freepik
// https://www.flaticon.com/free-icon/robe_2520932
// https://www.flaticon.com/authors/freepik
// https://www.freepik.com/

// TODO
//
// 0) Bar like https://www.croxyproxy.com/
//
// 0) Decode string for magnet links
//    https://btdig.com/9fe6281eaf39f8bee656f27cacf48713c0608c3e/20-birds-&-animals-books-collection-pack-4
//
// 0) Tooltip
//    https://www.w3schools.com/howto/howto_css_tooltip.asp
//    or DIV on the middle or center of screen
//    https://web.archive.org/web/20050423235409/http://karmatics.com/aardvark/
//    https://css-tricks.com/quick-css-trick-how-to-center-an-object-exactly-in-the-center/
//
// 1) Brand: Access Bar, Alt Bar, Black Bar, Black Robe, Distribar, Distributed Bar, Distribution Bar, Easy Access Bar, Free Bar, Freenet Bar, Handler Bar, Harvest Bar, IETF Bar, IETF Black Bar, IETF ToolBar, Instant Media Bar, Media Bar, Power Bar, Power Download Bar, Reaping Bar, Simple Access Bar, Simple Bar, Super Bar
//
// 2) Recognize btih of 32 and convert it to 40
//
// 3) Check cache links for none 200 code
//    https://bookshelf.theanarchistlibrary.org/library/librarian-previous-announcements-en
//
// 4) FIXME feedx
//    http://freebase.be/db/software.rss.xml
//
// 5) Case insensitive (XPath)
//    String.prototype.toLowerCase()
//    See 'Magnet:' heperlink at https://ddosecrets.com/wiki/Rosatom
//    See getPathTo()
//
// 6) Fetch button (guess on demand) instead of auto-guess
//    Find file by Hash or ID (Hint: find duplicate chars/strings)
//
// 7) Display software for IPFS, GPS, Monero, RSS, SIP, Tribler, XMPP
//
// 8) Market diaspora*, Linux, Mastodon, ownCloud, RetroShare
//
// 9) TODO cancel *:after "open in new tab" https://cookidoo.thermomix.com/foundation/en-US

// blackberry appworld.blackberry.com
// nokia store.ovi.com
// palm

// 'pge,✉️,contact,Contact'
const types = {
  "feed" : {
    "name" : "📰 Follow", //索 //參
    "description" : "🗞️ Subscribe to news feed", //🔔
    "alternate" : ["atom", "rss", "rdf", "stream", "feed", "feed+json"],
    "extension" : [
     "atom", "atom.php", "atom.xml",
     "rss", "rss.php", "rss.xml",
     "rdf", "rdf.php", "rdf.xml",
     "feed.xml", "rss.json", "feed.json"],
    "path" : ["/feed", "/feed/", "app.php/feed"],
    "uri" : ["feed", "news"]
  },
  "podcast" : {
    "name" : "🎙️ Podcast",
    "description" : "🎧 Subscribe to podcast channel",
    "uri" : ["itpc"]
  },
  "asc" : {
    "name" : "🗝️ Key", // Additional Sense Code
    "description" : "🔐 Encryption key",
    "extension" : ["asc", "asc.txt", "gpg", "gpg.txt", "pgp", "pgp.txt"]
  },
  "mail" : {
    "name" : "✉️ Email",
    "description" : "📮 Send an email message",
    "uri" : ["mailto"]
  },
  "card" : {
    "name" : "🪪 Card",
    "description" : "📇 Virtual contact file",
    "extension" : ["vcard", "vcf"]
  },
  "geo" : {
    "name" : "📍️ Location",
    "description" : "🗺️ Geographic coordinations",
    "extension" : ["gpx", "geojson", "kml", "kmx"],
    "uri" : ["geo", "waze"]
  },
  "gemini" : {
    "name" : "💎️ Gemini",
    "description" : "🔮 The Gemini Realm",
    "uri" : ["gemini"]
  },
  "gopher" : {
    "name" : "🦦 Gopher",
    "description" : "🔮 The Gopher Realm",
    "uri" : ["gopher"]
  },
  "telephone" : {
    "name" : "☎️ Call",
    "description" : "📞️ Telephone number",
    "uri" : ["callto", "tel"]
  },
  "voip" : {
    "name" : "📞️ VoIP",
    "description" : "💬 Session Initiation Protocol",
    "uri" : ["sip"]
  },
  "chat-cabal" : {
    "name" : "🔽 Cabal", //︾ //🔽 //⧩ //➤
    "description" : "💬 Cabal chat network",
    "uri" : ["cabal"]
  },
  "chat-irc" : {
    "name" : "🗨️ IRC",
    "description" : "💬 Internet Relay Chat",
    "uri" : ["irc", "ircs"],
    "web" : ["kiwiirc.com/nextclient/"]
  },
  "chat-matrix" : {
    "name" : "#️ matrix", //#️⃣️ //＃ //⌗ //濫
    "description" : "💬 Matrix chat network",
    //"description" : "⚠️ <b>WARNING</b><br/><br/>This is a compromised messaging system.<br/><br/>Use <u><a href='https://xmpp.org/software/clients/' style='color:#000' title='Jabber'>XMPP</a></u> for true privacy.",
    "uri" : ["element", "matrix"],
    "web" : ["matrix.to/"]
  },
  "chat-xmpp" : {
    "name" : "💡️ Jabber",
    "description" : "💬 Extensible Messaging and Presence Protocol",
    "web" : [
     // /i/#
     // #converse/room?jid=
     "i.kaidan.im",
     "join.jabber.network/#",
     "anonymous.cheogram.com",
     "magicbroccoli.de/i/",
     "webchat.disroot.org/#converse/room?jid=",
     "xmpp.org/chat#converse/room?jid=",
     "yaxim.org/chat/#converse/room?jid=",
     "yax.im/i/"],
    // TODO handle ?join and ?message
    "uri" : ["xmpp"]
  },
  "chat-vi" : {
    "name" : "👁 Viber",
    "description" : "⚠️ <b>WARNING</b><br/><br/>This chat service logs your activities and conversations to its records and discloses them to governments legally and illegally.<br/><br/>Use <u><a href='https://xmpp.org/software/clients/' style='color:#000' title='Jabber'>XMPP</a></u> for true privacy.",
    "uri" : ["viber"]
  },
  "chat-we" : {
    "name" : "👁 WeChat",
    "description" : "⚠️ <b>WARNING</b><br/><br/>This chat service logs your activities and conversations to its records and discloses them to governments legally and illegally.<br/><br/>Use <u><a href='https://xmpp.org/software/clients/' style='color:#000' title='Jabber'>XMPP</a></u> for true privacy.",
    "uri" : ["weixin"]
  },
  "chat-te" : {
    "name" : "👁 Tencent",
    "description" : "⚠️ <b>WARNING</b><br/><br/>This chat service logs your activities and conversations to its records and discloses them to governments legally and illegally.<br/><br/>Use <u><a href='https://xmpp.org/software/clients/' style='color:#000' title='Jabber'>XMPP</a></u> for true privacy.",
    "uri" : ["tencent"]
  },
  "chat-tg" : {
    "name" : "👁 Telegram",
    "description" : "⚠️ <b>WARNING</b><br/><br/>This chat service logs your activities and conversations to its records and discloses them to governments legally and illegally.<br/><br/>Use <u><a href='https://xmpp.org/software/clients/' style='color:#000' title='Jabber'>XMPP</a></u> for true privacy.",
    "web" : [
     "t.me/",
     "telegram.me"],
    "uri" : ["tg"]
  },
  "chat-di" : {
    "name" : "👁 Discord",
    "description" : "⚠️ <b>WARNING</b><br/><br/>This chat service logs your activities and conversations to its records and discloses them to governments legally and illegally.<br/><br/>Use <u><a href='https://xmpp.org/software/clients/' style='color:#000' title='Jabber'>XMPP</a></u> for true privacy.",
    "web" : [
     "discord.com/",
     "discord.gg/"]
  },
  "chat-sk" : {
    "name" : "👁 Skype",
    "description" : "⚠️ <b>WARNING</b><br/><br/>This chat service logs your activities and conversations to its records and discloses them to governments legally and illegally.<br/><br/>Use <u><a href='https://xmpp.org/software/clients/' style='color:#000' title='Jabber'>XMPP</a></u> for true privacy.",
    "uri" : ["skype"]
  },
  "chat-fa" : {
    "name" : "👁 Facebook",
    "description" : "⚠️ <b>WARNING</b><br/><br/>This chat service logs your activities and conversations to its records and discloses them to governments legally and illegally.<br/><br/>Use <u><a href='https://xmpp.org/software/clients/' style='color:#000' title='Jabber'>XMPP</a></u> for true privacy.",
    "web" : [
     "m.me/"]
  },
  "chat-wh" : {
    "name" : "👁 Whatsapp",
    "description" : "⚠️ <b>WARNING</b><br/><br/>This chat service logs your activities and conversations to its records and discloses them to governments legally and illegally.<br/><br/>Use <u><a href='https://xmpp.org/software/clients/' style='color:#000' title='Jabber'>XMPP</a></u> for true privacy.",
    "web" : [
     "chat.whatsapp.com",
     "wa.me",
     "api.whatsapp.com/send?phone=",
     "web.whatsapp.com/send?phone="],
    "uri" : ["whatsapp"]
  },
  "tracker" : {
    "name" : "📶 Tracker",
    "description" : "🧲 BitTorrent tracker",
    "uri" : ["udp"]
  },
  "ftl-adc" : {
    "name" : "🫐️ DC", // Advanced Direct Connect
    "description" : "🧲 File transfer (magnet link)",
    "urn" : ['tree:tiger'],
    "uri" : ["adc", "adcs", "dchub"]
  },
  "ftl-bitprint" : {
    "name" : "🪩 Gnutella2",
    "description" : "🧲 File transfer (magnet link)",
    "urn" : ["bitprint"]
  },
  "ftl-bittorrent" : {
    "name" : "🌊️ BitTorrent", //💧️ //⛲️
    "description" : "🧲 File transfer (magnet link)",
    "urn" : ["btih", "btmh"]
  },
  "ftl-torrent" : {
    "name" : "📦️ Torrent", //🧧️ //🎁️
    "description" : "⛲️ BitTorrent metadata file",
    "extension" : ["torrent"]
  },
  "ftl-ed2k" : {
    "name" : "♈ eDonkey",
    "description" : "🧲 File transfer (magnet link)", // eDonkey2000
    "uri" : ["ed2k"],
    "urn" : [
      "aich",
      "ed2k",
      "ed2khash"]
  },
  "ftl-frostwire" : {
    "name" : "❄️ Frostwire", // LimeWire
    "description" : "🧲 File transfer (magnet link)",
    "urn" : ["sha1"]
  },
  "ftl-kazzaa" : {
    "name" : "⏭️ Fasttrack",
    "description" : "🧲 File transfer (magnet link)",
    "urn" : ["kzhash"]
  },
  "ftl-metalink" : {
    "name" : "♾️ Metalink",
    "description" : "♾️ Metalink file",
    "extension" : ["meta4", "metalink"]
  },
  "ftl-shareaza" : {
    "name" : "❤️‍🔥️ Shareaza",
    "description" : "🧲 File transfer (magnet link)",
    "urn" : ["md5"]
  },
  "wallet-monero" : {
    "name" : "🪙️ Monero",
    "description" : "👛 Cryptocurrency wallet",
    "uri" : ["monero"]
  },
  "wallet-litecoin" : {
    "name" : "🪙️ Litecoin",
    "description" : "👛 Cryptocurrency wallet",
    "uri" : ["litecoin"]
  },
  "wallet-ethereum" : {
    "name" : "🪙️ Ethereum",
    "description" : "👛 Cryptocurrency wallet",
    "uri" : ["ethereum"]
  },
  "wallet-bitcoin" : {
    "name" : "🪙️ Bitcoin",
    "description" : "👛 Cryptocurrency wallet",
    "uri" : ["bitcoin"]
  },
  "pkg-apk" : {
    "name" : "💿 Package",
    "description" : "📦️ Android package",
    "condition" : ["android"],
    "extension" : ["apk"],
    "web" : [
      "f-droid.org/packages/",
      "apt.izzysoft.de/fdroid/index/apk/",
      "mysu.dev/fdroid/",
      "acruexirfkgcqhwxyu75v7dtahr3a44hmbfygngsvubmkrbd6axa.b32.i2p/fdroid/",
      "cookiejarapps.com/fdroid/repo/",
      "appgallery.cloud.huawei.com/ag/n/app/",
      "appgallery.huawei.com/app/",
      "apkpure.com/",
      "play.google.com/store/apps/details?id="]
  },
  "pkg-appstream" : {
    "name" : "💿 Package",
    "description" : "🛍️ AppStream package",
    "condition" : ["linux"],
    "uri" : ["appstream"]
  },
  "pkg-debian" : {
    "name" : "💿 Package",
    "description" : "🐧️ Debian package",
    "condition" : ["debian", "ubuntu"],
    "extension" : ["deb"]
  },
  "pkg-fedora" : {
    "name" : "💿 Package",
    "description" : "🐧️ Linux package",
    "condition" : ["fedora", "redhat"],
    "extension" : ["rpm"]
  },
  "pkg-flatpak" : {
    "name" : "💿 Package",
    "description" : "🧊 Flatpak package",
    "condition" : ["linux"],
    "extension" : ["flatpakref"],
    "web" : ["flathub.org/apps/details/"]
  },
  "ios-pkg" : {
    "name" : "💿 Package",
    "description" : "📦️ iOS package",
    "condition" : ["ios", "iphone", "ipad"],
    "web" : ["apps.apple.com/app/",
             "apps.apple.com/us/app/"]
  },
  "pkg-kaios" : {
    "name" : "💿 Package",
    "description" : "📦️ Kai OS package",
    "condition" : ["kai"],
    "web" : ["store.bananahackers.net/",
             "www.kaiostech.com/store/apps/"]
  },
  "pkg-kde" : {
    "name" : "💿 Package",
    "description" : "🐲️ KDE package",
    "condition" : ["linux", "react", "windows"],
    "web" : ["store.kde.org/p/"]
  },
  "pkg-mac" : {
    "name" : "💿 Package",
    "description" : "🍎️ Macintosh package",
    "condition" : ["mac"],
    "extension" : ["dmg", "pkg"]
  },
  // NOTE WineHQ
  "pkg-reactos" : {
    "name" : "💿 Package",
    "description" : "⚛ <a href='https://reactos.org/' style='color:#000'>React OS</a> (Windows) package",
    "condition" : ["windows", "react"],
    "extension" : ["exe", "msi"],
    "web" : ["apps.microsoft.com/store/detail/",
             "www.microsoft.com/store/apps/"]
  },
  // TODO ask snapcraft for path /app/
  // TODO Dismiss path root /
  "pkg-snapcraft" : {
    "name" : "💿 Package", // 📥️ // 🛍️
    "description" : "🪶️ Snapcraft package",
    "web" : ["snapcraft.io/"]
  },
  "pkg-ubports" : {
    "name" : "💿 Package",
    "description" : "📦️ Ubuntu Touch package",
    "condition" : ["ubuntu"],
    "uri" : ["openstore"],
    "web" : ["open-store.io/app/"]
  },
  "ext-userjs" : {
    "name" : "🐵 Userscript", //🐒
    "description" : "📜 User.JS script",
    "extension" : ["user.js"]
  },
  "ext-usercss" : {
    "name" : "🎨 Userstyle",
    "description" : "📃 User.CSS stylesheet",
    "extension" : ["user.css"]
  },
  "ext-blink" : {
    "name" : "🧩 Extension",
    "description" : "🧩 Web browser extension",
    "condition" : ["brave", "chrome", "chromium", "crios", "sleipnir", "vivaldi"],
    "extension" : ["crx", "chromium.zip", "chrome.zip"],
    "web" : ["chrome.google.com/webstore/detail/"]
  },
  "ext-edge" : {
    "name" : "🧩 Extension",
    "description" : "🧩 Web browser extension",
    "condition" : ["edge"],
    "web" : ["microsoftedge.microsoft.com/addons/detail/"]
  },
  "ext-falkon" : {
    "name" : "🧩 Extension", // 🦅️
    "description" : "🧩 Web browser extension",
    "condition" : ["falkon"],
    "web" : ["store.falkon.org/p/"]
  },
  "ext-maxthon" : {
    "name" : "🧩 Extension",
    "description" : "🧩 Web browser extension",
    "condition" : ["maxthon"],
    "web" : ["extension.maxthon.com/detail/"]
  },
  "ext-xpi" : {
    "name" : "🧩 Extension", //🐺️ //🦊️ //🦎️
    "description" : "🧩 Web browser extension",
    "condition" : ["firefox", "fxios", "librewolf", "waterfox"],
    "extension" : ["xpi", "firefox.zip"],
    "web" : ["addons.mozilla.org"]
  },
  "ext-xul" : {
    "name" : "🧩 Extension", // 🌕
    "description" : "🧩 Web browser extension",
    "condition" : ["basilisk", "goanna", "palemoon"],
    "web" : ["addons.palemoon.org",
             "realityripple.com/Software/XUL/",
             "realityripple.com/Software/Mozilla-Extensions/",
             "addons.basilisk-browser.org"]
  },
  "ipfs" : {
    "name" : "💠 IPFS", //📁 //📂 //🗃️ //⚛️ //💎️ //🕸️
    "description" : "🗃️ Interplanetary File System",
    "uri" : ["ipfs", "ipns", "dweb"],
    "web" : ["cloudflare-ipfs.com/ipfs/",
             "cloudflare-ipfs.com/ipns/",
             "gateway.pinata.cloud/ipfs/",
             "gateway.pinata.cloud/ipns/",
             "ipfs.io/ipfs/",
             "ipfs.io/ipns/"]
  },
  "tor" : {
    "name" : "🧅️ Tor",
    "description" : "🔮 The Tor Realm",
    "url" : ["onion", "onion:"]
  },
  "i2p" : {
    "name" : "㊙️ I2P", //㊣
    "description" : "🔮 The I2P Realm", //⚛️
    "url" : ["i2p", "i2p:"]
  }
};

const namespace = 'i2p-schimon-blackbelt';


const objectKeys = Object.keys(types);

// Check whether HTML; otherwise, exit.
//if (!document.contentType == 'text/html')
// if (!document.doctype) return;
// if (document.doctype == null) return; // Uncaught SyntaxError: Illegal return statement

(function() {
  let links = [], accept;
  for (let i = 0; i < objectKeys.length; i++) {

    let agent = types[objectKeys[i]].condition, accept = true;
    if (agent) {
      accept = false;
      for (let j = 0; j < agent.length; j++) {
        if (navigator.userAgent.toLowerCase().includes(agent[j])) {
          accept = true;
        }
      }
    }

    //if (reject) continue;

    let
      result,
      title = types[objectKeys[i]].name,
      descr = types[objectKeys[i]].description,
      array = types[objectKeys[i]];

    if (array.alternate) {
      result = extractRel(array.alternate);
    }

    if (!result && array.extension) {
      result = extractFile(array.extension);
    }

    if (!result && array.uri) {
      result = extractURI(array.uri);
    }

    if (!result && array.url) {
      result = extractURL(array.url);
    }

    if (!result && array.urn) {
      result = extractURN(array.urn);
    }

    if (!result && array.web) {
      result = extractWeb(array.web);
    }

    if (accept && result) {
      links.push(createLink(result, title, descr, objectKeys[i]));
    }
  }

  if (links.length) {
    buildBar(links);
  }

  // https://henrik.nyh.se/
  // https://postmarketos.org/
  /* document.addEventListener ("scroll", function() {
    if (window.pageYOffset > 10) { // TODO when first bar is out of focus
      document
      .querySelector('#' + namespace + '-bar')
      .style.setProperty('position', 'fixed', 'important');
    } else {
      document
      .querySelector('#' + namespace + '-bar')
      .style.setProperty('position', 'absolute', 'important');
    }
  }) */

})();

function buildBar(links) {
  let barElement = document.createElement(namespace);
  barElement.id = namespace + '-bar';
  barElement.style.all = 'unset';
  barElement.style.width = '100%';
  barElement.style.opacity = 0.5; // 0.75
  barElement.style.backgroundColor = '#000'; //'#2c3e50';
  barElement.style.color = '#eee';
  //barElement.style.setProperty("color", "#eee", "!important")
  barElement.style.fontVariant = 'small-caps';
  barElement.style.left = 0;
  barElement.style.right = 0;
  barElement.style.top = 0;
  barElement.style.zIndex = 2147483647;
  barElement.style.maxHeight = 'fit-content';
  //barElement.style.maxWidth = '100vw';
  barElement.style.padding = '6px'; //13px //15px //11px //9px //6px //3px //1px
  barElement.style.position = 'fixed';
  barElement.style.display = 'block';
  barElement.style.textAlign = 'center';
  barElement.style.direction = 'ltr';
  barElement.style.userSelect = 'none';
  //barElement.style.overflow = 'hidden';
  //barElement.style.transition = 'all 1s ease 0.1s';
  barElement.onclick = () => { barElement.remove(); }
  barElement.onmouseover = () => { barElement.style.opacity = 0.9; }
  barElement.onmouseleave = () => {
    barElement.querySelector('#' + namespace + '-info-square') &&
    barElement.querySelector('#' + namespace + '-info-square').remove();
  }

  barElement.onmouseout = () => {
    var secs = 20;
    function timeOut() {
      barElement.onmouseout = () => { secs = 20; }
      secs -= 1;
      if (secs == 15) {
        // FIXME Not working due to !important we have set below
        //barElement.style.setProperty('opacity', 'unset', 'important');
        barElement.style.opacity = 0.3;
        setTimeout(timeOut, 1000);
      } else if (secs == 5) {
        //barElement.style.setProperty('opacity', 'unset', 'important');
        barElement.style.opacity = 0;
        setTimeout(timeOut, 1000);
      } else if (secs == 0) {
        barElement.remove();
        return;
      } else {
        setTimeout(timeOut, 1000);
      }
    } timeOut();
  }

  // Set !important
  for (let i = 0; i < barElement.style.length; i++) {
    barElement.style.setProperty(
      barElement.style[i],
      barElement.style.getPropertyValue(barElement.style[i]),
      'important'
    );
  }

  document.body.prepend(barElement);

  //barElement.append(closeButton(barElement));
  links.forEach(link => barElement.append(link));
  //console.log("eles.forEach(ele => barElement.append(ele));")
  //console.log(eles)

  if (
    // NOTE Not working '#i2p.schimon.blackbelt.bittorrent'
    barElement.querySelector('*[id$=bittorrent]') &&
    !barElement.querySelector('*[id$=-torrent]')
    ) {
    // TODO Add after BitTorrent
    // TODO place this in the tooltip
    barElement.prepend(createLink(
      generateTorrent(barElement),
      '🎁️ Torrent',
      '⛲️ BitTorrent metadata file',
      'torrent'))
  }

  // Timer from https://stackoverflow.com/questions/27406765/hide-div-after-x-amount-of-seconds

  var secs = 33;
  function timeOut() {
    secs -= 1;
    if (secs == 0) {
      //barElement.style.display = 'none';
      barElement.style.opacity = 0.2;
      return;
    }
    else {
      setTimeout(timeOut, 1000);
    }
  }
  timeOut();

}



function infoBox(node) {
  node.addEventListener ("mouseover", function() {
    if (this.title) {
      this.setAttribute('info', this.title);
      this.removeAttribute('title');
    }
    if (document.querySelector('#' + namespace + '-info-square')) {
      document.querySelector('#' + namespace + '-info-square').remove();
    }
    let infoSquare = document.createElement('info-square');
    infoSquare.id = namespace + '-info-square';
    infoSquare.innerHTML = this.getAttribute('info');
    infoSquare.style.all = 'unset';
    infoSquare.style.fontVariant = 'none';
    infoSquare.style.position = 'fixed';
    infoSquare.style.margin = 'auto';
    //infoSquare.style.top = '15%';
    infoSquare.style.right = '25%';
    infoSquare.style.left = '25%';
    infoSquare.style.padding = '10px';
    infoSquare.style.color = '#000';
    infoSquare.style.background = 'WhiteSmoke';
    infoSquare.style.borderRadius = '5px';
    infoSquare.style.border = '3px solid #000';
    /*
    infoSquare.style.width = 50%;
    infoSquare.style.font-size = 70%;
    */
    infoSquare.style.fontFamily = 'system-ui';
    //infoSquare.style.justifyContent = 'center';
    //infoSquare.style.alignItems = 'center';
    infoSquare.style.textAlign = 'center';
    infoSquare.style.display = 'block';
    /* white-space = pre; in case we have html tags */
    //infoSquare.textContent = text;
    infoSquare.style.zIndex = 2147483647;
    document.querySelector('#' + namespace + '-bar').append(infoSquare);
  });
}

// NOTE TODO semi-recursive callback
// NOTE TODO typeof
function extractFile(array) {
  let i = 0;

  do {
    // FIXME Mainstream to support ends-with
    // fn:ends-with appears to be missing in some engines
    query = [
      `//a[contains(@href, ".${array[i]}")]/@href`,
      `//a[contains(@download, ".${array[i]}")]/@download`];
//      `//a[ends-with(@href, ".${array[i]}")]/@href`
//      `//a[ends-with(text(), ".${array[i]}")]/@href`
    result = executeQuery(query, 'xpath');
    i = i + 1;
  } while (!result && i < array.length);

  if (result) {
  protocol = location.protocol
  hostname = location.hostname
  //console.log(result)
    switch (true) {

      case (result.startsWith('/')):
      result = protocol + '//' + hostname + result;
      break;

      case (!result.includes(':')):
      result = protocol + '//' + hostname + '/' + result;
      break;

      //case (result.startsWith('http')):
      //break;
    }

    //console.log(result)
    let url = new URL(result);
    let bol = url.pathname.endsWith(array[i-1]);
    if (bol) { return result; };
  }
}


function extractRel(array) {
  let i = 0;

  do {
    query = [
     // Also rel="feed". See https://miranda-ng.org/
      `//link[@rel="alternate"\
       and contains(@type, "${array[i]}")\
       ]/@href`];
    result = executeQuery(query, 'xpath');
    i = i + 1;
  } while (!result && i < array.length);

  if (result) { return result; };
}


function extractURI(array) {
  let i = 0;

  do {
    query = [
      `//a[starts-with(@href, "${array[i]}:")\
      and not(starts-with(@href, "tg://msg_url?"))\
      and not(starts-with(@href, "mailto:?"))\
      and not(contains(@href, "/send?"))\
      ]/@href`];
    result = executeQuery(query, 'xpath');
    i = i + 1;
  } while (!result && i < array.length);

  if (result) {
    let url = new URL(result);
    let bol = url.protocol.match(array[i-1]);
    if (bol) { return result; };
  }
}


function extractURL(array) {
  let i = 0;

  do {
    query = [
      `//a[starts-with(@href, "http")
       and contains(@href, ".${array[i]}")
       ]/@href`];
      // FIXME mainstream
      //'//a[starts-with(@href, "http") and ends-with(@href, "' + array[i] + '")]/@href'
    result = executeQuery(query, 'xpath');
    i = i + 1;
  } while (!result && i < array.length);

  if (result) {
    let url = new URL(result);
    let bol = url.hostname.endsWith(array[i-1]);
    if (bol) { return result };
    //if (!url) {
    //  url = url.host.contains(array[i] + ':');
    //}
  }
}


function extractURN(array) {
  let i = 0;

  do {
    query = [
      `//a[starts-with(@href, "magnet")\
       and contains(@href, "${array[i]}")\
       ]/@href`];
    result = executeQuery(query, 'xpath');
    i = i + 1;
  } while (!result && i < array.length);

  if (result) {
    let url = new URL(result);
    url.searchParams.delete('tr');
    result = url.protocol + url.search;
    result = decodeURIComponent(result);
    return result;
    //let bol = url.hostname.startsWith(array[i-1]);
    //if (bol) { createLink(result, type) };
  }
}


function extractWeb(array) {
  let i = 0;

  do {
    query = [
      `//a[starts-with(@href, "http")\
       and contains(@href, "://${array[i]}")\
       and not(starts-with(@href, "https://wa.me/?text"))\
       and not(starts-with(@href, "https://t.me/share"))\
       and not(starts-with(@href, "https://telegram.me/share"))\
       and not(contains(@href, "com.github.android"))\
       and not(contains(@href, "1477376905"))\
       ]/@href`];
    result = executeQuery(query, 'xpath');
    i = i + 1;
  } while (!result && i < array.length);

  if (result) { return result; };
}


// TODO
// String.prototype.toLowerCase()
// href Magnet: (magnet:) is not detected, or
// Set document MIMEType to plain/text
function executeQuery(queries, method) {

  let i = 0;
  do {
    switch(method) {
      case 'css':
      result = document.querySelector(queries[i]);
      //if (result) {result = result.href};
      if (result) {return result.href};
      break;

      case 'xpath':
      // NOTE This may cause 404 error.
      // Use getPathTo()
      // https://stackoverflow.com/questions/2631820/how-do-i-ensure-saved-click-coordinates-can-be-reload-to-the-same-place-even-if/2631931#2631931
      /*
      xhtmlFile = new XMLSerializer().serializeToString(document).toLowerCase()
      //xhtmlFile = '<html>'+document.documentElement.innerHTML.toLowerCase()+'</html>'
      domParser = new DOMParser();
      xhtmlFile = domParser.parseFromString(xhtmlFile, 'text/html');
      result = document.evaluate(
        queries[i], xhtmlFile, null, XPathResult.STRING_TYPE);
      */
      result = document.evaluate(
        queries[i], document, null, XPathResult.STRING_TYPE);
      //if (result) {result = result.stringValue};
      if (result) {return result.stringValue};
    }
  } while (!result && i < queries.length);
}

function createLink(uri, title, info, id) {
  //if (type[4]) {
  //let tip = document.createElement('spna');
  //tip.class = 'tooltip';
  //tip.append('type[4]');
  //}

  //type = type.split(' ');
  //sym = getUrnProperty(uri, 'sym');
  //net = getUrnProperty(uri, 'net');

  let aElement = document.createElement('a');
  aElement.id = namespace + '-' + id;
  aElement.textContent = title;
  aElement.href = uri;
  aElement.title = info;
  aElement.style.all = 'unset';
  aElement.style.color = '#eee';
  aElement.style.font = 'caption';
  aElement.style.fontFamily = 'system-ui';
  aElement.style.fontSize = '15px'; // 13px
  aElement.style.fontVariantCaps = 'all-small-caps';
  aElement.style.textDecoration = 'none';
  aElement.style.cursor = 'default';

  //aElement.style.fontWeight = 'bold';
  //aElement.style.padding = '3px 9px 3px 9px';
  //aElement.style.margin = '0 9px 0 9px';
  aElement.style.margin = '2% 9px 2% 9px';
  //aElement.style.background = 'black';
  //aElement.style.borderBottomLeftRadius = '9px';
  //aElement.style.borderBottomRightRadius = '9px';

  //aElement.style.forEach (style => style + '!important');
  for (let i = 0; i < aElement.style.length; i++) {
    aElement.style.setProperty(
      aElement.style[i],
      aElement.style.getPropertyValue(aElement.style[i]),
      'important'
    );
  }

  infoBox(aElement);

  //aElement.append(tip);

  //console.log(aElement)
  //console.log(aElements)
  return aElement;
}

// Torrent V1
// TODO handle compressed sha1 http://www.debath.co.uk/MakeAKey.html
// TODO convert base32 to hash
// 32/40 https://linuxtracker.org/?page=torrent-details&id=173a0f61ef92b158547937fa0c01e9dc704779f9
function generateTorrent(node) {
// TODO generate link else-if onclick
// 404 https://bookshelf.theanarchistlibrary.org/library/librarian-previous-announcements-en#toc1
  href = node.querySelector('*[id*=bittorrent]').href;
  let url = new URL(href);
  name = url.searchParams.get('dn');
  if (!name) {name = document.title};
  //xt = url.searchParams.get('xt');
  hash = url.searchParams.get('xt').slice(9);
  //if (ha.length === 40 && xt.startsWith('urn:btih'))
  if (hash.length === 40) {
    let links = [
      'https://watercache.libertycorp.org/get/' + hash + '/' + name,
      'https://itorrents.org/torrent/' + hash + '.torrent?title=' + name,
      'https://firecache.libertycorp.org/get/' + hash + '/' + name,
      'http://fcache63sakpihd44kxdduy6kgpdhgejgp323wci435zwy6kiylcnfad.onion/get/' + hash + '/' + name,
      ];
    return links[1];
    //return links[Math.floor(Math.random()*links.length)];
  }
}

function closeButton(barElement) {


  let spanElement = document.createElement('span');
  spanElement.textContent = 'X';
  spanElement.style.all = 'unset';
  spanElement.style.color = '#eee';
  spanElement.style.font = 'caption';
  spanElement.style.fontFamily = 'system-ui';
  spanElement.style.fontSize = '15px'; // 13px
  spanElement.style.fontVariantCaps = 'all-small-caps';
  spanElement.style.textDecoration = 'none';

  spanElement.style.fontWeight = 'bold';
  spanElement.style.padding = '3px 9px 3px 9px';
  //spanElement.style.margin = '0 9px 0 9px';
  spanElement.style.background = 'black';
  spanElement.style.borderBottomLeftRadius = '9px';
  spanElement.style.borderBottomRightRadius = '9px';

  //spanElement.style.forEach (style => style + '!important');
  for (let i = 0; i < spanElement.style.length; i++) {
    spanElement.style.setProperty(
      spanElement.style[i],
      spanElement.style.getPropertyValue(spanElement.style[i]),
      'important'
    );
  }

  spanElement.onclick = () => { barElement.remove(); }

  return spanElement;

}
