// ==UserScript==
// @name         Torrents More Trackers
// @description  Adds more trackers to torrent magnet links.
// @version      0.6
// @namespace    https://github.com/metinsanli
// @homepageURL  https://greasyfork.org/scripts/447607
// @author       metinsanli
// @icon         data:image/png;base64,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
// @include      *://solidtorrents.to/*
// @include      *://ibit.to/*
// @include      *://torrentgalaxy.to/*
// @include      *://www.torlock2.com/*
// @include      *://katcr.to/*
// @include      *://www.gtdb.to/*
// @include      *://nyaa.si/*
// @include      *://yts.*/*
// @include      *://1337x.to/*
// @include      *://1337x.cc/*
// @include      *://rarbg.best/*
// @run-at       document-end
// ==/UserScript==

function mergeLinks(readyTrackersText) {
  var magnetTags = document.querySelectorAll('[href^="magnet"]');
  magnetTags.forEach((magnet) => {
    magnet.setAttribute(
      "href",
      magnet.getAttribute("href") + readyTrackersText
    );
  });
}

const nto = new XMLHttpRequest(),
  method = "GET",
  url = "https://newtrackon.com/api/live";

nto.open(method, url, true);
nto.setRequestHeader("Access-Control-Allow-Headers", "*");
nto.withCredentials = false;

nto.onreadystatechange = function () {
  if (nto.readyState === XMLHttpRequest.DONE) {
    var status = nto.status;
    if (status === 0 || (status >= 200 && status < 400)) {
      var ntoRawList = nto.responseText.split("\n");
      var trackersList = ntoRawList
        .filter((tracker) => tracker)
        .map((tracker) => "&tr=" + encodeURIComponent(tracker))
        .join("");
      mergeLinks(trackersList);
    } else {
      console.error("MORETRACKERS: Could not get trackers to add!");
    }
  }
};

nto.send();
