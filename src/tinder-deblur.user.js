// ==UserScript==
// @name         Tinder Deblur
// @description  Simple script using the official Tinder API to get clean photos of the users who liked you.
// @author       spatch
// @version      1.0
// @license      MIT
// @namespace    https://greasyfork.org/en/scripts/517571-tinder-deblur/code
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tinder.com
// @match        https://tinder.com/*
// @grant        none
// @downloadURL  https://update.greasyfork.org/scripts/517572/Tinder%20Deblur.user.js
// @updateURL    https://update.greasyfork.org/scripts/517572/Tinder%20Deblur.meta.js
// ==/UserScript==

// This async function fetches the first 10 teaser profiles from the Tinder API and unblurs them by
// setting the appropriate images as the background of the corresponding teaser elements on the page.
async function unblur() {
	const teasers = await fetch(
		"https://api.gotinder.com/v2/fast-match/teasers",
		{
			headers: {
				"X-Auth-Token": localStorage.getItem("TinderWeb/APIToken"), // Use the stored Tinder API token for authentication
				platform: "android",
			},
		}
	)
		.then((res) => res.json()) // Parse the API response as JSON
		.then((res) => res.data.results); // Extract the teaser profiles from the response

	// Select all teaser elements in the page where the unblurred images will be applied
	const teaserElements = document.querySelectorAll(
		".Expand.enterAnimationContainer > div:nth-child(1)"
	);

	// Iterate over each teaser and apply the unblurred image as the background of the corresponding element
	teasers.forEach((teaser, index) => {
		const teaserElement = teaserElements[index];
		if (teaserElement) {
			// Set the teaser image as the background
			const teaserImage = `https://preview.gotinder.com/${teaser.user._id}/original_${teaser.user.photos[0].id}.jpeg`;
			teaserElement.style.backgroundImage = `url(${teaserImage})`;
		}
	});
}

// This function repeatedly checks if the teaser elements are present on the page.
// If they are, it calls the unblur function to unblur them. If not, it continues to recheck every 2 seconds.
function checkAndRunUnblur() {
	const teaserElements = document.querySelectorAll(
		".Expand.enterAnimationContainer > div:nth-child(1)"
	);

	if (teaserElements.length > 0) {
		unblur(); // If teasers are found, start the unblur process
		setTimeout(checkAndRunUnblur, 2000); // Recheck after 2 seconds
	} else {
		console.log("Teasers not found, retrying in 2 seconds...");
		setTimeout(checkAndRunUnblur, 2000); // Recheck after 2 seconds
	}
}

// Start the unblur process after the page fully loads
window.addEventListener("load", checkAndRunUnblur);