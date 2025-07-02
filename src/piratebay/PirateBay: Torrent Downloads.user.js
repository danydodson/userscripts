// ==UserScript==
// @name         PirateBay: Torrent Downloads
// @namespace    https://egore.url.lol/userscripts
// @version      0.5.0
// @description  Piratebay download via torrents
// @author       pxgamer
// @include      *thepiratebay.org/*
// @match      *thepiratebay.org/*
// @icon         https://thepiratebay.org/favicon.ico
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const userPreferredCache = 'cache_1';

    const preferredCaches = {
        cache_1: {
            name: 'BTCache',
            url: 'http://btcache.me/torrent/',
            end: ''
        },
        cache_2: {
            name: 'Torrage',
            url: 'https://torrage.info/torrent.php?h=',
            end: ''
        },
        cache_3: {
            name: 'iTorrents',
            url: 'https://itorrents.org/torrent/',
            end: '.torrent'
        }
    };

    // Download image
    const dataURI = 'iVBORw0KGgoAAAANSUhEUgAAAAwAAAALCAYAAABLcGxfAAAACXBIWXMAAAsSAAALEgHS3X78AAABfklEQVQokWWQzUsbURRHzxtfkknSYq2UKNaiYncVrdBCUAoKKuKi4EKLbioqbrpp9/07unalG1Faa0EoboQoBT+QoKAgook4mMzEySRqJvO60UjihQsXfudwL1cAhOt+aKGal05j0wudiiq6Hnv/tj571pdZAAlQW/8k8vV7jz4QDVfyoKD9XXzas3gQkFWkixqJzGMeAL8sjRLAUSJvu5C0yrkrR7H45xoV9HllQupW3ORdSN5tMPMwG1NYFy6epUCXqiT4u5bmNCH0i7wgdwlGFowr8AcFskbiKkUhEHrL+6V5TVMpqQJacmyy91t1tc6NC0oD7a6LnsAsSOSrvqcF42TE526PCgDRvzI0Nd653NwUwXTAsOHcgoQJiTTYR7uuno23OavjB+L+tqqPq68Hu5vjH6KtvqQJZyacpmEntpEJZQ8azd8TNkBJANBH10ItDc9Ohwc7nh8bRRZ+ru+Hc4dvUr+mS18qEwDCn/4KXyC4mcva27cLAzOV+X9eUpMXhNIxOAAAAABJRU5ErkJggg==';

    function getHash(element) {
        return $(element).attr('href').split(":")[3].split("&")[0];
    }

    // Add to browsing pages
    $('a[title="Download this torrent using magnet"][href^="magnet:"]').each(function () {
        let hash = getHash(this);
        $(this).after('<a href="' + preferredCaches[userPreferredCache].url + hash.toUpperCase() + preferredCaches[userPreferredCache].end + '" title="Download using torrent file"><img src="data:image/png;base64,' + dataURI + '" style="width: 12px; height: 12px;" alt="Torrent link"></a>');
    });

    // Add to torrent pages
    $('a[href^="magnet:"][title="Get this torrent"]').after(function () {
        let hash = getHash(this);
        $(this).after('<a style="background-image: url(data:image/png;base64,' + dataURI + '); background-position: left; background-size: contain; margin-left: 4px" href="' + preferredCaches[userPreferredCache].url + hash.toUpperCase() + preferredCaches[userPreferredCache].end + '" title="Download using torrent file">&nbsp;Download torrent file</a>');
    });
})();
