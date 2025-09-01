// ==UserScript==
// @name         UserScript File Picker
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Use the File Picker API to show local directory/file navigator.
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

  // File picker UI
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.webkitdirectory = true;
  fileInput.multiple = true;
  explorerContainer.appendChild(fileInput);

  fileInput.addEventListener('change', (event) => {
    explorerContainer.innerHTML = '';
    for (const file of event.target.files) {
      const fileDiv = document.createElement('div');
      fileDiv.textContent = file.webkitRelativePath;
      fileDiv.style.cursor = 'pointer';
      fileDiv.onclick = () => {
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      };
      explorerContainer.appendChild(fileDiv);
    }
  });

  // Fetch files from localhost
  const fetchButton = document.createElement('button');
  fetchButton.textContent = 'Fetch Localhost Folder';
  fetchButton.style.display = 'block';
  fetchButton.style.marginTop = '10px';
  explorerContainer.appendChild(fetchButton);

  fetchButton.onclick = function () {
    explorerContainer.innerHTML = '<div>Loading from http://localhost:8080/path/to/folder ...</div>';
    fetch('http://localhost:8080/path/to/folder')
      .then(response => response.json())
      .then(data => {
        explorerContainer.innerHTML = '';
        if (Array.isArray(data)) {
          data.forEach(item => {
            const fileDiv = document.createElement('div');
            fileDiv.textContent = item;
            explorerContainer.appendChild(fileDiv);
          });
        } else {
          explorerContainer.innerHTML = '<div>Unexpected response format</div>';
        }
      })
      .catch(err => {
        explorerContainer.innerHTML = `<div style="color:red;">Error: ${err}</div>`;
      });
  };
})();

