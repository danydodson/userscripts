// ==UserScript==
// @name         Discord: Toggle Servers
// @description  Adds show/hide groups sidebar button to Discord Web App
// @author       Github mindovermiles262
// @version      1.12.1
// @namespace    Nounce Scripts
// @iconURL      https://i.ibb.co/7znt13j/30162036.png
// @match        https://discord.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict'

  // Classes of DIVs you want to be able to toggle sidebar
  const toggleButtons = ['toggleServersBtn']
  // Sidebar that will be hidden
  const columnToHide = 'wrapper-1_HaEi'
  // Toolbar to hold the toggle button
  const showHideSidebarButtonParentClass = 'children-3xh0VB'
  const serversWidth = '72px'

  function sleep(ms) {
    // Sets timeout for inital page elements to load
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async function pageload() {
    // Wait 5 seconds for page to load
    await sleep(5000)
    main()
  }

  const toggleVisibility = function () {
    // Changes the width of the rooms sidebar
    let sidebar = document.getElementsByClassName(columnToHide)[0]
    if (sidebar.style.width == '0px') {
      sidebar.style.width = serversWidth
    } else {
      sidebar.style.width = '0px'
    }
  }

  let cheveronDirection = function () {
    const sidebar = document.getElementsByClassName(columnToHide)[0]
    const btn = document.getElementById('dtcb-s-cheverons')
    if (sidebar.style.width == '1px') {
      btn.innerText = '>'
    } else {
      btn.innerText = '<'
    }
  }

  const createSidebarButton = function () {
    let btnDiv = document.createElement('div')
    btnDiv.setAttribute('class', 'toggleServersBtn')
    btnDiv.setAttribute('id', 'toggleServersBtn')
    btnDiv.style.width = '24px'
    btnDiv.style.textAlign = 'center'
    btnDiv.style.color = '#4e5058e1'
    let btn = document.createElement('p')
    btn.setAttribute('id', 'dtcb-s-cheverons')
    btn.innerText = '<'
    btn.style.fontWeight = '600'
    btn.style.fontSize = '140%'
    btn.style.margin = '0 10px'
    btnDiv.appendChild(btn)
    return btnDiv
  }

  const addListenersToToggleButtons = function () {
    toggleButtons.forEach(function (elem) {
      document.getElementsByClassName(elem)[0].addEventListener('click', function () {
        toggleVisibility()
        cheveronDirection()
      })
    })
  }

  const main = function () {
    console.log('[*] Loading Discord Toggle Servers Bar Userscript')
    const newBtn = createSidebarButton()
    const cotainer = document.getElementsByClassName(showHideSidebarButtonParentClass)[0]
    cotainer.insertBefore(newBtn, cotainer.firstChild)
    addListenersToToggleButtons()
  }

  pageload()
})()
