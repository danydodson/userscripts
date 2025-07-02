// ==UserScript==
// @name          DDB My Sources
// @namespace     Violentmonkey Scripts
// @match         https://www.dndbeyond.com/*
// @grant         none
// @version       2.3.2
// @author        Petr Gondek
// @description   Adds a button to DnDBeyond to filter sources you own.
// @license MIT
// @downloadURL   https://update.greasyfork.org/scripts/451010/Beyond%20My%20Sources.user.js
// @updateURL     https://update.greasyfork.org/scripts/451010/Beyond%20My%20Sources.meta.js
// @icon          https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// ==/UserScript==

window.addEventListener('load', function() {
    Main();
}, false);

// Execute this to get new sources array
//Array.from(document.getElementById("filter-source")).map(e => e.id);

// comment out sources you don't own
const mySources = [
  //"filter-source-acquisitions-incorporated",
  //"filter-source-adventure-atlas-the-mortuary",
  //"filter-source-against-the-giants",
  //"filter-source-baldurs-gate-gazetteer",
  //"filter-source-baldurs-gate-descent-into-avernus",
  "filter-source-basic-rules-2014",
  //"filter-source-bigby-presents-glory-of-the-giants",
  //"filter-source-book-of-ebon-tides",
  "filter-source-candlekeep-mysteries",
  //"filter-source-critical-role",
  //"filter-source-critical-role-call-of-the-netherdeep",
  //"filter-source-curse-of-strahd",
  //"filter-source-curse-of-strahd-character-options",
  "filter-source-d-d-free-rules-2024",
  //"filter-source-dead-in-thay",
  //"filter-source-descent-into-the-lost-caverns-of-tsojcanth",
  "filter-source-divine-contention",
  //"filter-source-domains-of-delight-a-feywild-accessory",
  "filter-source-dragon-of-icespire-peak",
  //"filter-source-dragonlance-shadow-of-the-dragon-queen",
  //"filter-source-dragons-of-stormwreck-isle",
  "filter-source-dungeon-masters-guide-2014",
  "filter-source-dungeon-masters-guide-2024",
  //"filter-source-dungeons-dragons-vs-rick-and-morty",
  //"filter-source-dungeons-of-drakkenheim",
  //"filter-source-eberron-rising-from-the-last-war",
  //"filter-source-elemental-evil-players-companion",
  //"filter-source-explorers-guide-to-wildemount",
  "filter-source-fizbans-treasury-of-dragons",
  //"filter-source-flee-mortals",
  "filter-source-frozen-sick",
  //"filter-source-ghosts-of-saltmarsh",
  //"filter-source-giants-of-the-star-forge",
  //"filter-source-grim-hollow-player-pack",
  //"filter-source-guildmasters-guide-to-ravnica",
  //"filter-source-heroes-feast-saving-the-childrens-menu",
  //"filter-source-hoard-of-the-dragon-queen",
  //filter-source-humblewood-campaign-setting",
  //"filter-source-hunt-for-the-thessalhydra",
  "filter-source-icewind-dale-rime-of-the-frostmaiden",
  //"filter-source-infernal-machine-rebuild",
  //"filter-source-intro-to-stormwreck-isle",
  //"filter-source-journeys-through-the-radiant-citadel",
  //"filter-source-keys-from-the-golden-vault",
  //"filter-source-lairs-of-etharis",
  "filter-source-legendary-magic-items",
  //"filter-source-lightning-keep",
  //"filter-source-locathah-rising",
  //"filter-source-lost-laboratory-of-kwalish",
  "filter-source-lost-mine-of-phandelver",
  //"filter-source-misplaced-monsters-volume-one",
  "filter-source-monster-manual-2014",
  "filter-source-monster-manual-2024",
  "filter-source-monstrous-compendium-vol-1-spelljammer-creatures",
  "filter-source-monstrous-compendium-vol-2-dragonlance-creatures",
  "filter-source-monstrous-compendium-vol-3-minecraft-creatures",
  "filter-source-monstrous-compendium-vol-4-eldraine-creatures",
  "filter-source-mordenkainen-presents-monsters-of-the-multiverse",
  "filter-source-mordenkainens-tome-of-foes",
  "filter-source-mordenkainens-fiendish-folio-volume-1",
  //"filter-source-mythic-odysseys-of-theros",
  "filter-source-one-grung-above",
  "filter-source-out-of-the-abyss",
  //"filter-source-phandelver-and-below-the-shattered-obelisk",
  //"filter-source-planescape-adventures-in-the-multiverse",
  "filter-source-players-handbook-2014",
  "filter-source-players-handbook-2024",
  "filter-source-princes-of-the-apocalypse",
  "filter-source-prisoner-13",
  //"filter-source-quests-from-the-infinite-staircase",
  //"filter-source-rise-of-tiamat",
  "filter-source-rrakkma",
  "filter-source-sleeping-dragons-wake",
  "filter-source-spelljammer-academy",
  //"filter-source-spelljammer-adventures-in-space",
  //"filter-source-storm-kings-thunder",
  //"filter-source-storm-lords-wrath",
  //"filter-source-strixhaven-a-curriculum-of-chaos",
  "filter-source-sword-coast-adventurers-guide",
  //"filter-source-taldorei-campaign-setting-reborn",
  //"filter-source-tales-from-the-shadows",
  //"filter-source-tales-from-the-yawning-portal",
  "filter-source-tashas-cauldron-of-everything",
  //"filter-source-the-book-of-many-things",
  //"filter-source-the-forge-of-fury",
  //"filter-source-the-hidden-shrine-of-tamoachan",
  //"filter-source-the-sunless-citadel",
  "filter-source-the-tortle-package",
  "filter-source-the-vecna-dossier",
  //"filter-source-the-wild-beyond-the-witchlight",
  //"filter-source-thieves-gallery",
  //"filter-source-tomb-of-annihilation",
  //"filter-source-tomb-of-horrors",
  //"filter-source-tome-of-beasts-1",
  //"filter-source-tyranny-of-dragons",
  //"filter-source-van-richtens-guide-to-ravenloft",
  //"filter-source-vecna-eve-of-ruin",
  //"filter-source-vecna-nest-of-the-eldritch-eye",
  "filter-source-volos-guide-to-monsters",
  //"filter-source-waterdeep-dragon-heist",
  //"filter-source-waterdeep-dungeon-of-the-mad-mage",
  //"filter-source-wayfinders-guide-to-eberron",
  //"filter-source-where-evil-lives",
  //"filter-source-white-plume-mountain",
  "filter-source-xanathars-guide-to-everything"
];

const FILTER_SOURCE_ID = "filter-source";
const LISTING_FILTERS_CLASS = "listing-filters";
const RESET_BUTTON_CONTAINER_CLASS = "reset-button-container";

const QA_MONSTER_FILTERS_SOURCE = "qa-monster-filters_source";
const INPUT_SELECT_DROPDOWN = "input-select__dropdown";
const INPUT_CHECKBOX_TEXT = "input-checkbox__text";
const QA_MONSTER_FILTERS_SHOW_ADVANCE = "qa-monster-filters_show-advanced";

const MY_SOURCES = "Filter my sources";

function Main() {
  if (IsGameRules()) {
    CreateButton();
    return;
  }

  setTimeout(() => {
    if (IsEncounterBuilder()) {
      CreateButtonEB();
      return;
    }

    console.error("beyond-my-sources: Can't find an element.");
  }, 2000);

}

function IsGameRules() {
  return (document.getElementById(FILTER_SOURCE_ID) != null &&
    document.getElementsByClassName(LISTING_FILTERS_CLASS)[0] != null &&
    document.getElementsByClassName(RESET_BUTTON_CONTAINER_CLASS)[0] != null);
}

function IsEncounterBuilder() {
  return (document.getElementsByClassName(QA_MONSTER_FILTERS_SOURCE)[0] != null &&
    document.getElementsByClassName(INPUT_SELECT_DROPDOWN)[0] != null &&
    document.getElementsByClassName(INPUT_CHECKBOX_TEXT)[0] != null &&
    document.getElementsByClassName(QA_MONSTER_FILTERS_SHOW_ADVANCE)[0] != null);
}

function OnClickEncounterBuilder(){
  let ele = document.getElementsByClassName(QA_MONSTER_FILTERS_SOURCE)[0].getElementsByClassName(INPUT_SELECT_DROPDOWN)[0];
  let clickables = Array.from(ele.childNodes).map(e=> e.firstElementChild);
  clickables.forEach(e => {
    let bookName = e.getElementsByClassName(INPUT_CHECKBOX_TEXT)[0].firstChild.data
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/&/g,'-') // removes & from 'D&D Free Rules'
      .replace(/[^a-zA-Z-]/g, '');
    if (mySources.some(source => source.includes(bookName)))
      e.click();
  });
}

function CreateButtonEB() {
  let originalButton = document.getElementsByClassName(QA_MONSTER_FILTERS_SHOW_ADVANCE)[0];
  let btn = document.createElement("button");
  btn.innerHTML = MY_SOURCES;
  btn.id = btn.innerHTML;
  btn.onclick = OnClickEncounterBuilder;
  btn.style.cssText = GetCssText(originalButton);
  originalButton.parentElement.appendChild(btn);
}

function ButtonOnClick() {
  SelectAll();
  document.getElementsByClassName(LISTING_FILTERS_CLASS)[0].submit();
}


function GetCssText(element) {
  let styles = window.getComputedStyle(element);

  let cssText = styles.cssText;

  if (!cssText) {
    cssText = Array.from(styles).reduce((str, property) => {
      return `${str}${property}:${styles.getPropertyValue(property)};`;
    }, '');
  }

  return cssText;
}

function CreateButton () {
  let container = document.getElementsByClassName(RESET_BUTTON_CONTAINER_CLASS)[0];
  let btn = document.createElement("button");
  btn.innerHTML = MY_SOURCES;
  btn.id = btn.innerHTML;
  btn.onclick = ButtonOnClick;
  btn.style.cssText = GetCssText(container.firstElementChild.firstElementChild);
  let div = document.createElement("div");
  div.style.cssText = GetCssText(container.firstElementChild);

  div.appendChild(btn);
  container.appendChild(div);
  return true;
};

function SelectAll () {
  Array.from(document.getElementById(FILTER_SOURCE_ID)).forEach(e => {
    if (mySources.includes(e.id)) {
      e.selected = true;
    }
  });
}
