// ==UserScript==
// @name          DDB Dark Theme
// @namespace     http://tampermonkey.net/
// @version       0.7
// @description   A Dark Theme for the DnDBeyond Character Sheet! (WIP)
// @author        You
// @match         https://www.dndbeyond.com/characters/*
// @grant         GM_addStyle
// @downloadURL   https://update.greasyfork.org/scripts/424610/Beyond%20Dark.user.js
// @updateURL     https://update.greasyfork.org/scripts/424610/Beyond%20Dark.meta.js
// @icon          https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// ==/UserScript==

//pSBC Color Shade/Blend/Convert tool (V4). Source: https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
const pSBC = (p, c0, c1, l) => {
    let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a = typeof (c1) == "string";
    if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return null;
    if (!this.pSBCr) this.pSBCr = (d) => {
        let n = d.length, x = {};
        if (n > 9) {
            [r, g, b, a] = d = d.split(","), n = d.length;
            if (n < 3 || n > 4) return null;
            x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
        } else {
            if (n == 8 || n == 6 || n < 4) return null;
            if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
            d = i(d.slice(1), 16);
            if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
            else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
        } return x
    };
    h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = this.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? this.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
    if (!f || !t) return null;
    if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
    else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
    a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
    if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
    else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}
(function () {
    'use strict';
    // Userscript Globals
    var accentColor;
    var accentColorMuted;
    /**
     * @type {CSSStyleSheet}
     */
    var sheet;

    // // Change BgColor
    // var bodyElems = document.getElementsByTagName('body');
    // for (let i = 0; i < bodyElems.length; i++) {
    //     bodyElems[i].style.background = "#222222";
    //     console.log("Changing BG Color. " + i);
    // }

    const colorReplacements = {
        "#ffffff": "#353535",
        "#ededed": "#282828",
        "#e0e3e3": "#323232",
        "#838383": "#ababab",
        "#faf8f7": "#3a3d3e",
    }
    initStyleSheet();
    // Called ONCE after DOMContentLoaded
    function onLoad() {
        var startTime = performance.now();
        console.info("Starting Userscript.");

        accentColor = getCharColor();
        accentColorMuted = pSBC(-0.8, accentColor, "#383838");

        restyleSvgs();

        sheet.insertRule(
            `.ddbc-tab-options--layout-pill div.ddbc-tab-options__header-heading--is-active {
                background-color: ${accentColor} !important;
            }`);


        restyleQuickRollAreas();

        fixSlotManagerColors();

        // restyleImgIcons();

        console.log(`DarkMode main exec time: ${performance.now() - startTime} ms`);
    }

    function getCharColor() {
        return window.getComputedStyle(document.querySelectorAll(".body-rpgcharacter-sheet .site-bar")[0]).getPropertyValue('border-color');;
    }

    function initStyleSheet() {
        // Create Stylesheet
        sheet = createStyleSheet('dark-mode-userscript');

        // Background
        sheet.insertRule(`body {
            background: #222222 !important;
        }`);

        // Text Color
        const content_container = document.getElementById('content');
        content_container.style.color = '#d4d5d7';//'#e4e5e7';

        // Initiative
        // document.getElementsByClassName('ct-combat__summary-label--outline')[0].style.textShadow = 'none';
        // Inspiration
        // document.getElementsByClassName('ct-inspiration__label')[0].style.textShadow = 'none';
        sheet.insertRule(`div.ct-combat__summary-label--outline, div.ct-inspiration__label {
            text-shadow: none;
        }`)
        // Sidebar Recolor
        sheet.insertRule(`div.ct-sidebar__pane-gap, div.ct-sidebar__pane-content {
            background-color: #303030;
        }`);
        // Ability Scores Recolor
        sheet.insertRule(
            `.ddbc-ability-summary__primary,
        .ct-proficiency-bonus-box__value .ddbc-signed-number.ddbc-signed-number--large,
        .ct-proficiency-bonus-box .ct-proficiency-bonus-box__heading,
        .ddbc-item-name--rarity-common,
        .ddbc-tab-list__nav-item:hover,
        .ddbc-tab-list__nav-item--is-active,
        .ddbc-spell-name,
        .ddbc-checkbox__label,
        .ct-spell-manager__filter-heading,
        .ct-class-spell-manager__heading,
        .ct-inventory-filter__input,
        .ct-spells-filter__input,
        .ct-feats-manage-pane__feat-heading-name,
        .ct-sidebar__heading,
        .ct-health-summary__adjuster-field-input,
        .collapsible-heading
        {
            color: #e4e5e7 !important;
        }`);
        sheet.insertRule(
            `.ct-class-spell-manager__info,
        .ddbc-html-content p,
        .ct-sidebar__pane-content > *,
        .ct-campaign-pane a {
            color: #d4d5d7 !important;
        }`);

        // Restyling Accent/Element bg colors
        // #f1f1f1 -> #434343
        sheet.insertRule(
            `div.ddbc-collapsible__header {
            background-color: #434343;
        }`);
        // #f2f2f2 -> #424242;
        sheet.insertRule(
            `.ddbc-tab-options--layout-pill div.ddbc-tab-options__header-heading,
        div.ct-spell-detail__tag,
        div.ct-item-detail__tag {
            background-color: #424242;
        }`);

        // Attacks per Action text: convert to secondary color
        sheet.insertRule(
            `span.ct-actions__attacks-per-action {
            color: #838383;
        }`
        );
        // BG #ffffff -> #353535
        sheet.insertRule(
            `.site button.ct-health-summary__adjuster-button,
        input.ct-health-summary__adjuster-field-input {
            background-color: ${colorReplacements["#ffffff"]} !important;
        }`);

        // Tables
        //#fff -> #353535
        sheet.insertRule(
            `.ct-sidebar td {
            background: ${colorReplacements["#ffffff"]} !important;
        }`)
        //#faf8f7 ->
        sheet.insertRule(
            `.ct-sidebar tr:nth-child(odd) td {
            background: ${colorReplacements["#faf8f7"]} !important;
        }`)

        // Collapsible Content Bg
        sheet.insertRule(
            `.ddbc-collapsible__content {
            background-color: #383838 !important;
        }`);
        // SVG Backgrounds
        sheet.insertRule(`
        svg > path,
        .ct-combat__statuses polygon,
        .ct-initiative-box polygon,
        #InspirationBoxSvg-Fill-1,
        .ddbc-svg.ddbc-ability-score-box-svg > path:nth-child(2),
        .ct-proficiency-groups-box polygon,
        .ct-sidebar__pane-top path,
        .ct-sidebar__pane-bottom path,
        svg.ddbc-svg.ddbc-manage-level-svg.ddbc-svg--themed path
        {
            fill: #303030 !important;
        }`);
        sheet.insertRule(`
        .ddbc-svg.ddbc-proficiency-svg.ddbc-proficiency-icon.ddbc-proficiency-level-icon circle
        {
            fill: #cbcbcb !important;
        }`);
        // const no_prof_circles = document.getElementsByClassName('ddbc-no-proficiency-icon');
        // for (let circle of no_prof_circles) {
        //     circle.style.backgroundColor = "inherit";
        // }
        sheet.insertRule(`span.ddbc-no-proficiency-icon {
            background-color: inherit;
        }`)

        sheet.insertRule(`.ct-skills__list {
            overflow-y: auto;
            max-height: min-content !important;
        }`);
    }

    // function recolorElements(elems) {
    //     let matchCount = 0;
    //     for (let i = 0; i < elems.length; i++) {
    //         //console.log("Userscript: test");
    //         let el = elems[i];
    //         let bgColorRGB = getRGBValues(window.getComputedStyle(el, null).getPropertyValue("background-color"));
    //         let bgColor = rgbToHex(bgColorRGB[0], bgColorRGB[1], bgColorRGB[2]);

    //         if (!el.classList.contains('ddbc-no-proficiency-icon')) {
    //             const colorMatch = colorReplacements[bgColor];
    //             if (colorMatch) {
    //                 el.style.backgroundColor = colorMatch;
    //                 matchCount++;
    //                 console.log(el);
    //             }
    //         }

    //     }
    //     console.log(`matchCount: ${matchCount}`);
    // }

    function fixSlotManagerColors() {
        document.querySelectorAll('.ct-slot-manager__slot.ct-slot-manager__slot--interactive').forEach(e => e.style.backgroundColor = "");
    }

    function restyleQuickRollAreas() {
        sheet.insertRule(`.beyond20-quick-roll-area {
            border: 1px solid ${accentColor.toString()};
            border-radius: 6px;
            box-sizing: border-box;
            margin-right: 5px;
        }`);
        sheet.insertRule(`.ct-spells-spell__action.beyond20-quick-roll-area {
            padding-right: 0 !important;
        }`)

        sheet.insertRule(//.ct-skills__col--modifier
            `.beyond20-quick-roll-area:hover {
            background-color: ${accentColorMuted};
        }
        `);
    }

    function restyleSvgs() {
        // const svgs = document.getElementsByClassName('ddbc-svg');
        //console.log(svgs);
        //console.log("I'm Confused");
        // for (let svg of svgs) {

        //     let paths = svg.getElementsByTagName("*");
        //     //paths[0].setAttribute("fill", "#383838");
        //     for (let j = 0; j < paths.length; j++) {
        //         //console.log("elems test" +j);
        //         let c_path_fill = paths[j].getAttribute("fill")
        //         if (c_path_fill === "#FEFEFE") {
        //             paths[j].setAttribute("fill", "#373737");
        //         } else if (c_path_fill === "#383838") {
        //             paths[j].setAttribute("fill", "#cbcbcb");
        //         }
        //     }
        // }

        // Some css selectors grabbed from https://github.com/Azmoria/dndbeyonddark
        // Borders
        sheet.insertRule(`
        svg > path + path,
        .ct-combat__statuses path,
        .ct-initiative-box path,
        .ct-inspiration path,
        .ct-proficiency-groups-box path,
        .ddbc-attunement-slot.ddbc-attunement-slot--empty path
        {
            fill: ${accentColor} !important;
        }`);

    }

    function restyleImgIcons() {
        sheet.insertRule(`.i-hamburger, .i-concentration, .i-homebrew, .i-spell-melee, .i-spell-ranged, .i-favorite, .i-strength-save, .i-dexterity-save, .i-constitution-save, .i-charisma-save, .i-wisdom-save, .i-intelligence-save, .i-type-acid, .i-type-bludgeoning, .i-type-cold, .i-type-fire, .i-type-force, .i-type-lightning, .i-type-necrotic, .i-type-piercing, .i-type-poison, .i-type-psychic, .i-type-radiant, .i-type-slashing, .i-type-thunder, .i-condition-blinded, .i-condition-charmed, .i-condition-deafened, .i-condition-exhaustion, .i-condition-exhausted, .i-condition-frightened, .i-condition-grappled, .i-condition-incapacitated, .i-condition-invisible, .i-condition-paralyzed, .i-condition-petrified, .i-condition-poisoned, .i-condition-prone, .i-condition-restrained, .i-condition-stunned, .i-condition-unconscious, .i-condition-white-blinded, .i-condition-white-charmed, .i-condition-white-deafened, .i-condition-white-exhaustion, .i-condition-white-exhausted, .i-condition-white-frightened, .i-condition-white-grappled, .i-condition-white-incapacitated, .i-condition-white-invisible, .i-condition-white-paralyzed, .i-condition-white-petrified, .i-condition-white-poisoned, .i-condition-white-prone, .i-condition-white-restrained, .i-condition-white-stunned, .i-condition-white-unconscious, .i-aoe-cone, .i-aoe-cube, .i-aoe-cylinder, .i-aoe-line, .i-aoe-sphere, .i-aoe-square, .i-artificer, .i-bard, .i-cleric, .i-druid, .i-paladin, .i-ranger, .i-sorcerer, .i-warlock, .i-wizard, .i-barbarian, .i-fighter, .i-monk, .i-rogue, .i-aberration, .i-beast, .i-celestial, .i-construct, .i-dragon, .i-elemental, .i-fey, .i-fiend, .i-giant, .i-humanoid, .i-monstrosity, .i-ooze, .i-plant, .i-undead, .i-ritual, .i-req-attunement, .i-legendary-monster, .i-checkmark, .i-partnered-content-small, .i-partnered-content-medium, .i-partnered-content-large, .i-copy, .i-download, .i-gift, .i-radio-checked, .i-radio-empty, .i-radio-checked-light
        , .ddbc-healing-icon__icon, .ddbc-combat-attack__icon-img, .ddbc-combat-attack__icon-img--action-attack-weapon-melee
        {
            filter: invert(100%);
        }`)
    }

    function restyleSidebar() {
        let sidebarCapSvgs = document.getElementsByClassName('ddbc-sidebar-cap-svg');
        // let sidebarGap = document.getElementsByClassName('ct-sidebar__pane-gap');
        // let sidebarContent = document.getElementsByClassName('ct-sidebar__pane-content');
        for (let svg of sidebarCapSvgs) {
            svg.children[0].setAttribute("fill", "#303030");
        }

        // for (let el of sidebarGap) {
        //     el.style.backgroundColor = "#383838";
        // }
        // for (let el of sidebarContent) {
        //     el.style.backgroundColor = "#383838";
        // }

    }

    // Bind Event Listeners
    window.addEventListener('load', () => setTimeout(onLoad, 500), false);

    window.addEventListener('resize', () => setTimeout(() => {
        restyleSidebar();
        restyleSvgs();
    }, 0));

    document.body.addEventListener('click', () => setTimeout(() => {
        restyleSidebar();
        // restyleQuickRollAreas();
    }, 0));


    //=========
    // Utility
    //=========
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function getRGBValues(rgbString) {
        rgbString = rgbString.substring(rgbString.indexOf('(') + 1, rgbString.indexOf(')'));
        // Notice here that we don't know how many digits are in each value,
        // but we know that every value is separated by a comma.
        // So split the three values using comma as the separator.
        // The split function returns an object.
        let rgbColors = rgbString.split(',', 3);

        // Convert redValue to integer
        rgbColors[0] = parseInt(rgbColors[0]);
        // Convert greenValue to integer
        rgbColors[1] = parseInt(rgbColors[1]);
        // Convert blueValue to integer
        rgbColors[2] = parseInt(rgbColors[2]);

        return rgbColors;
    }

    function createStyleSheet(id, media) {
        var el = document.createElement('style');
        // WebKit hack
        el.appendChild(document.createTextNode(''));
        // el.type  = 'text/css';
        el.rel = 'stylesheet';
        el.media = media || 'screen';
        el.id = id;
        document.head.appendChild(el);
        return el.sheet;
    }

})();

