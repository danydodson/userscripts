// ==UserScript==
// @name         UserScript File Explorer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A script to navigate local directories and open files in new tabs.
// @icon         https://i.ibb.co/VxRTZ4K/monky.png
// @author       Your Name
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  // Create the explorer container
  const explorerContainer = document.createElement('div');
  explorerContainer.id = 'explorerContainer';
  explorerContainer.style.position = 'fixed';
  explorerContainer.style.top = '10px';
  explorerContainer.style.right = '10px';
  explorerContainer.style.width = '300px';
  explorerContainer.style.height = '400px';
  explorerContainer.style.overflow = 'auto';
  explorerContainer.style.backgroundColor = '#fff';
  explorerContainer.style.border = '1px solid #ccc';
  explorerContainer.style.zIndex = 10000;
  explorerContainer.style.padding = '10px';
  explorerContainer.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
  document.body.appendChild(explorerContainer);

  // Function to fetch directory content
  function fetchDirectoryContent(path) {
    fetch(`file://${path}`)
      .then(response => response.json())
      .then(data => {
        renderDirectoryContent(data, path);
      })
      .catch(error => {
        console.error('Error fetching directory content:', error);
      });
  }

  // Function to render directory content
  function renderDirectoryContent(data, path) {
    explorerContainer.innerHTML = '';
    if (path !== '/') {
      let upLink = document.createElement('div');
      upLink.textContent = '..';
      upLink.style.cursor = 'pointer';
      upLink.onclick = function () {
        let parentPath = path.substring(0, path.lastIndexOf('/')) || '/';
        fetchDirectoryContent(parentPath);
      };
      explorerContainer.appendChild(upLink);
    }
    data.forEach(item => {
      let itemElement = document.createElement('div');
      itemElement.textContent = item.name;
      itemElement.style.cursor = 'pointer';
      itemElement.onclick = function () {
        if (item.isDirectory) {
          fetchDirectoryContent(`${path}/${item.name}`);
        } else {
          window.open(`file://${path}/${item.name}`, '_blank');
        }
      };
      explorerContainer.appendChild(itemElement);
    });
  }

  // Initial fetch for the root directory
  fetchDirectoryContent('/');
})();