// ==UserScript==
// @name               Tiktok: Sort By View
// @namespace          http://tampermonkey.net/
// @version            0.1.1
// @description        Click the video tab on tiktok user page to sort video by views and click again to restore order!
// @author             You
// @match              https://www.tiktok.com/@*
// @icon               https://www.google.com/s2/favicons?sz=64&domain=tiktok.com
// @grant              none
// @license            MIT
// ==/UserScript==

const multiplierMap = {
	k: 10 ** 3,
	m: 10 ** 6,
	b: 10 ** 9,
}

const sort = () => {
	const box = document.querySelector('[data-e2e="user-post-item-list"]')
	const items = Array.from(box.children).map(v => {
		const viewsString = v.querySelector('[data-e2e="video-views"]').textContent.trim()
		const number = parseFloat(viewsString)
		const multiplier = multiplierMap[viewsString.at(-1).toLowerCase()]
		const views = number * multiplier
		return [v, views]
	})
		.sort((a, b) => b[1] - a[1])

	const sorted = items.every(v => v[0].style.order)

	items.forEach((v, i) => {
		v[0].style.order = sorted
			? ''
			: String(i + 1)
	})
}

const sleep = time => new Promise(rs => setTimeout(rs, time))
const main = async () => {
	while (true) {
		await sleep(500)
		const videoTab = document.querySelector('[data-e2e="videos-tab"]')
		if (!videoTab) continue
		videoTab.addEventListener('click', sort)
		break
	}
}
main()