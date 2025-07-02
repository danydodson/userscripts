/* globals waitForKeyElements */
// ==UserScript==
// @name         DDB Book Downloader
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  Save your DBB books to PDF!
// @author       rsminsmith (Adapted from C T Zaran, print styling from /u/Ninjaen37)
// @match        https://www.dndbeyond.com/sources/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dndbeyond.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509893/DDB%20Book%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/509893/DDB%20Book%20Downloader.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const minPageDelay = 0; // Time to wait between each page. Increase if you're getting bot detected
    const maxPageDelay = 0;
    let bookHTML = '';

    // Get necessary URL components
    const slug = document.location.pathname;
    const urlParts = slug.split('/');
    if (urlParts[1] != 'sources') {
        console.info('DNDBeyondPdf: Not a source page');
        return;
    }

    // If this is a subpage, only worry about indexing it
    const tocHeaderEl = document.querySelector('.compendium-toc-full-header');
    if (!tocHeaderEl) {
        console.info('DNDBeyondPdf: Not a ToC page, ignoring');
        return;
    }

    // Build helper container and button elements
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'inline-block';
    buttonContainer.style.float = 'right';

    // Build buttons
    const resetButton = document.createElement('button');
    resetButton.classList.add('reset-pdf');
    resetButton.textContent = 'Reset Cache';
    resetButton.type = 'button';

    const pdfButton = document.createElement('button');
    pdfButton.classList.add('generate-pdf');
    pdfButton.textContent = 'Generate PDF';
    pdfButton.type = 'button';

    // Spelljammer has 3 books on one page; need to export them individually
    if (slug === '/sources/sais') {
        buttonContainer.style.backgroundColor = 'yellow';
        buttonContainer.style.color = 'black';
        buttonContainer.style.padding = '0.5em';
        buttonContainer.textContent = 'Navigate to each book within Spelljammer to generate PDF';
    } else {

        // Otherwise append generate and reset buttons
        buttonContainer.append(pdfButton);
        buttonContainer.append(resetButton);
    }

    // Attach buttons to header
    tocHeaderEl.prepend(buttonContainer);

    // Handle PDF generation
    pdfButton.onclick = async function() {

        // Update the button
        pdfButton.textContent = 'Generating...';
        pdfButton.disabled = true;

        // Only fetch data if needed
        if (!bookHTML) {

            // Get book info
            const bookTitle = document.title;

            // Pull all links in ToC and filter out the ones that aren't needed
            let tocLinkEls = document.querySelectorAll('.compendium-toc-full-text a');
            let validPages = [];
            let pageNames = {};
            for (const a of tocLinkEls) {
                let href = a.href.replace(/#.*$/, ''); // remove the fragment from the url if any.
                if (validPages.includes(href)) continue; // skip duplicates
                validPages.push(href);
                pageNames[href] = a.textContent;
            }

            // Create initial page HTML
            bookHTML = '<!DOCTYPE html>' +
                '<html lang="en-us" class="no-js">'+
                '<head>' +
                '<meta charset="UTF-8">' +
                '<title>' + bookTitle + '</title>' +
                '<link rel="stylesheet" href="https://www.dndbeyond.com/content/1-0-2352-0/skins/blocks/css/compiled.css"/>' +
                '<link rel="stylesheet" href="https://www.dndbeyond.com/content/1-0-2352-0/skins/waterdeep/css/compiled.css"/>' +
                '<link rel="stylesheet" type="text/css" href="https://www.dndbeyond.com/api/custom-css" />' +
                '<style>body {width: 850px; margin-left:30px} table{text-align: left;} figcaption{text-align: center;} img {max-width: 100%;} ' +
                '@media print {h1, h2.compendium-hr {break-before: always; page-break-before: always;} ' +
                '.print-section {break-after: always; page-break-after: always; } ' +
                'h2.heading-anchor, caption {break-before: avoid; page-break-before: avoid} h1, h2, h3 {break-after: avoid; page-break-after: avoid;} ' +
                'aside, blockquote, table, ul, ol, figure, img {break-inside: avoid; page-break-inside: avoid;} ' +
                '.compendium-image-left {float: left; display: block;} .compendium-image-right {float: right; display: block;} ' +
                '.monster-image-left {float: left; display: block;} .monster-image-right {float: right; display: block;} ' +
                'img.compendium-center-banner-img {width: 100%;}}</style>' +
                '</head>' +
                '<body>' +
                '<div class="print-section"> ';

            // Replace ToC links with internal links
            const baseUrl = 'https://www.dndbeyond.com/sources/';
            let tocEl = document.querySelector('.compendium-toc-full-text').cloneNode(true);
            tocEl.querySelectorAll('a[href]').forEach((tocAEl) => {

                // Get the link, remove the irrelevant pieces and any anchor tags
                let sectionName = tocAEl.href.replace(baseUrl, '');
                const anchorPos = sectionName.indexOf('#');
                if (anchorPos >= 0) {
                    sectionName = sectionName.substring(0, anchorPos);
                }
                const slugPieces = sectionName.split('/');
                const pageName = slugPieces[slugPieces.length - 1];
                const isImage = sectionName.indexOf('.jpg') >= 0 || sectionName.indexOf('.png') >= 0;

                // Update the link to point to the generated internal section
                if (isImage) {
                    const imageTitle = pageNames[sectionName];
                    const imageName = imageTitle.toLowerCase().replace(' ', '_');
                    tocAEl.href = '#section-' + imageName;
                } else {
                    tocAEl.href = '#section-' + pageName;
                }
            });

            // Finish ToC
            bookHTML += tocEl.outerHTML + '</div>';

            // Loop through each page with a delay and store the contents by slug
            const numPages = validPages.length;
            let currentPage = 0;
            for (const page of validPages) {

                // Update button
                currentPage += 1;
                pdfButton.textContent = `Generating (${currentPage}/${numPages})...`;

                // Get page info
                const slugPieces = page.split('/');
                const pageName = slugPieces[slugPieces.length - 1];
                const isImage = pageName.indexOf('.jpg') >= 0 || pageName.indexOf('.png') >= 0;

                // Handle image links
                if (isImage) {
                    console.info('DNDBeyondPdf: Including image ', page);
                    const imageTitle = pageNames[page];
                    const sectionName = imageTitle.toLowerCase().replace(' ', '_');
                    bookHTML += '<div id="section-' + sectionName +'" class="print-section">' +
                        '<h1>' + imageTitle + '</h1>' +
                        '<img src="' + page + '" alt="' + imageTitle + '" class="ddb-lightbox-inner" />' +
                        '</div>';
                } else {

                    // Handle actual content pages
                    console.info('DNDBeyondPdf: Fetching page ', slugPieces[slugPieces.length - 1]);
                    const pageRequest = await fetch(page);
                    const pageContent = await pageRequest.text();
                    let tempEl = document.createElement('div');
                    tempEl.innerHTML = pageContent;
                    bookHTML += '<div id="section-' + pageName +'" class="print-section"> ' + tempEl.querySelector('.p-article-content').innerHTML + '</div>';;
                }

                // Wait before requesting next section if required
                const delay = minPageDelay + (Math.random() * (maxPageDelay - minPageDelay));
                await new Promise(r => setTimeout(r, delay));
            }

            // Finalize page
            bookHTML += '</body></html>';
        }

        console.log(bookHTML)
        // Open book HTML in a new tab
        const openBook = window.open();
        openBook.document.write(bookHTML);

        // Re-enable the button
        pdfButton.textContent = 'Generate PDF';
        pdfButton.disabled = false;

        // Log completion
        console.info('DNDBeyondPdf: Done!');
    }

    // Handle cache reset
    resetButton.onclick = function() {
        bookHTML = '';

        // Update the button
        resetButton.textContent = 'Done!';
        resetButton.disabled = true;

        // Re-enable the button
        setTimeout(function() {
            resetButton.textContent = 'Reset Cache';
            resetButton.disabled = false;
        }, 2500)
    }
})();
