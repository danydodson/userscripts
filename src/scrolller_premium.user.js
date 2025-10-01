// ==UserScript==
// @name         Free Scrolller Premium
// @namespace    https://greasyfork.org/en/scripts/441857-free-scrolller-premium
// @version      0.1.4
// @description  Gives you access to Scrolller Premium features for free.
// @author       gettim!
// @match        *://scrolller.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scrolller.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function() {
  'use strict';

  // When mouse moves search for all of the available download buttons by executing the 'download()' function.
  document.addEventListener('mousemove', download);

  // Iterate through the 'querySelectorAll' NodeList and add event listener to each names so if any 'Download' button is clicked then 'clickedDownload()' executes.
  // Log 'No download button found.' to the console if 'querySelectorAll' NodeList is empty.
  function download() {
    try {
      let downloadButtons = document.querySelectorAll('[title="Download"]');
      downloadButtons.forEach(function(downloadButton) {
        if(downloadButton.getAttribute('listener') !== 'true') {
          downloadButton.setAttribute('listener', 'true');
          downloadButton.addEventListener('click', function() {
            clickedDownload(downloadButton);
          });
        }
      })
    }
    catch(err) {
      console.log('No download button found.');
    }
  }

  async function clickedDownload(downloadButton) {
    // Gets download link for image/video when zoomed out.
    try {
      try {
        // Video download link
        let downloadLink = downloadButton.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('vertical-view__media')[0].getElementsByClassName('vertical-view__media')[0].getElementsByTagName('source')[0].getAttribute('src');
        try {
          let blob = await fetch(downloadLink).then(r => r.blob());
          let localURL = URL.createObjectURL(blob);
          let autoDownload = document.createElement('a');
          autoDownload.setAttribute('href', localURL);
          autoDownload.setAttribute('visibility', 'hidden');
          autoDownload.setAttribute('download', blob.size);
          document.body.append(autoDownload);
          autoDownload.click();
          autoDownload.remove();
        }
        catch(err) {
          window.open(downloadLink, '_blank');
        }
      }
      catch(err) {
        // Image download link
        let downloadLinks = downloadButton.parentNode.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('vertical-view__media')[0].getAttribute('srcset');
        let httpIndex = downloadLinks.lastIndexOf('https');
        let jpgIndex = downloadLinks.lastIndexOf('jpg') + 4;
        let downloadLink = downloadLinks.substring(httpIndex, jpgIndex);
        try {
          let blob = await fetch(downloadLink).then(r => r.blob());
          let localURL = URL.createObjectURL(blob);
          let autoDownload = document.createElement('a');
          autoDownload.setAttribute('href', localURL);
          autoDownload.setAttribute('visibility', 'hidden');
          autoDownload.setAttribute('download', blob.size);
          document.body.append(autoDownload);
          autoDownload.click();
          autoDownload.remove();
        }
        catch(err) {
          window.open(downloadLink, '_blank');
        }
      }
    }
    // Gets download link for image/video when zoomed in.
    catch(err) {
      try {
        // Video download link
        let downloadLink = downloadButton.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('fullscreen-view__media')[0].getElementsByClassName('fullscreen-view__media')[0].getElementsByTagName('source')[0].getAttribute('src');
        try {
          let blob = await fetch(downloadLink).then(r => r.blob());
          let localURL = URL.createObjectURL(blob);
          let autoDownload = document.createElement('a');
          autoDownload.setAttribute('href', localURL);
          autoDownload.setAttribute('visibility', 'hidden');
          autoDownload.setAttribute('download', blob.size);
          document.body.append(autoDownload);
          autoDownload.click();
          autoDownload.remove();
        }
        catch(err) {
          window.open(downloadLink, '_blank');
        }
      }
      catch(err) {
        // Image download link
        let downloadLinks = downloadButton.parentNode.parentNode.parentNode.parentNode.getElementsByClassName('fullscreen-view__media')[0].getAttribute('srcset');
        let httpIndex = downloadLinks.lastIndexOf('https');
        let jpgIndex = downloadLinks.lastIndexOf('jpg') + 4;
        let downloadLink = downloadLinks.substring(httpIndex, jpgIndex);
        try {
          let blob = await fetch(downloadLink).then(r => r.blob());
          let localURL = URL.createObjectURL(blob);
          let autoDownload = document.createElement('a');
          autoDownload.setAttribute('href', localURL);
          autoDownload.setAttribute('visibility', 'hidden');
          autoDownload.setAttribute('download', blob.size);
          document.body.append(autoDownload);
          autoDownload.click();
          autoDownload.remove();
        }
        catch(err) {
          window.open(downloadLink, '_blank');
        }
      }
    }
  }

  // Check if the premium-only feature prompt is loaded every second. If it is, then remove prompt.
  let prompt1 = document.getElementsByClassName("popup popup--fixed popup--dark");
  let promptInterval = setInterval(function() {
    try {
      prompt1[0].remove();
    }
    catch(err) {
    }
  }, 1000);
})();