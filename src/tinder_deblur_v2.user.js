// ==UserScript==
// @name        Tinder Deblur V2
// @namespace   Violentmonkey Scripts
// @match       https://tinder.com/*
// @grant       none
// @version     2.0
// @author      BytePhoenix
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tinder.com
// @downloadURL https://raw.githubusercontent.com/BytePhoenixCoding/TinderDeblurV2/refs/heads/main/TinderDeblurV2.js
// @description A script using the official Tinder API to get unblurred photos of the users who liked you
// ==/UserScript==

console.log('[TINDER DEBLUR]: Script file loaded and parsed.');

// enable type checking
// @ts-check
// @filename: types/tampermonkey.d.ts

class UserCacheItem {
	/**
	 * @param {string} userId
	 * @param {object} user
	 */
	constructor(userId, user) {
		this.userId = userId;
		this.user = user;
		this.hidden = !!localStorage.getItem('hiddenUsers')?.includes(userId);

		this.photoIndex = 0;
	}

	/**
	 * @returns {string | null}
	 */
	getPreviousPhoto() {
		if (!this.user) return null;

		this.photoIndex = this.photoIndex - 1;

		if (this.photoIndex < 0) this.photoIndex = this.user.photos.length - 1;

		return this.user.photos[this.photoIndex].url;
	}

	/**
	 * @returns {string | null}
	 */
	getNextPhoto() {
		if (!this.user) return null;

		this.photoIndex = (this.photoIndex + 1) % this.user.photos.length;

		return this.user.photos[this.photoIndex].url;
	}

	/**
	 * @returns {number}
	 */
	getAge() {
		if (!this.user || !this.user.birth_date) return 0;

		const currentDate = new Date();
		const birthDate = new Date(this.user.birth_date);

		const currentYear = currentDate.getFullYear();
		const currentMonth = currentDate.getMonth();
		const currentDay = currentDate.getDate();
		const birthYear = birthDate.getFullYear();
		const birthMonth = birthDate.getMonth();
		const birthDay = birthDate.getDate();

		let age = currentYear - birthYear;

		if (currentMonth < birthMonth) age--;
		else if (currentDay < birthDay) age--;

		return age;
	}

	/**
	 * @returns {boolean}
	 */
	isHidden() {
		return this.hidden;
	}

	/** @param {boolean} hidden */
	setHidden(hidden) {
		this.hidden = hidden;
	}
}

class UserCache {
	constructor() {
		/** @type {Map<string, UserCacheItem>} */
		this.cache = new Map();
	}

	/**
	 * @param {string} userId
	 * @param {object} user
	 * @returns {UserCacheItem}
	 */
	add(userId, user) {
		this.delete(userId);

		const newItem = new UserCacheItem(userId, user);
		this.cache.set(userId, newItem);

		return newItem;
	}

	/**
	 * @param {string} userId
	 */
	has(userId) {
		return this.cache.has(userId);
	}

	/**
	 * @param {string} userId
	 * @returns UserCacheItem | undefined
	 */
	get(userId) {
		return this.cache.get(userId);
	}

	/**
	 * @param {string} userId
	 */
	delete(userId) {
		const existingUser = this.cache.get(userId);

		if (!existingUser) return;

		this.cache.delete(userId);
	}

	clear() {
		for (const userItem of this.cache.values()) {
			this.cache.delete(userItem.userId);
		}
	}
}

/**
 * Holds a persistent cache of fetched users and intervals for updating their photos
 */
const cache = new UserCache();

/**
 * Original function of the script
 */
async function unblur() {
	console.log('[TINDER DEBLUR]: unblur function started.');
	try {
		const [failedToFetchTeasersError, teasers] = await safeAwait(fetchTeasers());

		console.log('[TINDER DEBLUR]: Teasers fetched:', teasers);

		if (failedToFetchTeasersError) {
			console.error(`Could not load teasers: ${failedToFetchTeasersError.name}`);
			return;
		}

		if (!teasers) {
			console.error('[TINDER DEBLUR]: Teasers array is null or undefined.');
			return;
		}

		const teaserEls = document.querySelectorAll('div[class="Bdrs(8px) Bgz(cv) Bgp(c) Ov(h) StretchedBox Bxsh($bxsh-card)--ml"]');
		console.log(`[TINDER DEBLUR]: Found ${teaserEls.length} teaser elements.`);
		console.log(`[TINDER DEBLUR]: Found ${teasers.length} teasers from API.`);

		const count = Math.min(teaserEls.length, teasers.length);
		for (let i = 0; i < count; i++) {
			const teaserEl = teaserEls[i];
			const teaserData = teasers[i];

			if (!teaserData || !teaserData.user) {
				console.warn(`[TINDER DEBLUR]: No user data for teaser at index: ${i}`);
				continue;
			}

			const user = teaserData.user;
			console.log(`[TINDER DEBLUR]: Processing user ${user._id} at index ${i}`);

			if (user.photos && user.photos.length > 0) {
				const unblurredUrl = user.photos[0].url.replace(/84x106/g, '640x800');
				console.log(`[TINDER DEBLUR]: Constructed unblurred URL for index ${i}: ${unblurredUrl}`);
				teaserEl.style.backgroundImage = `url("${unblurredUrl}")`;
				console.log(`[TINDER DEBLUR]: Applied new background image to element at index ${i}.`);

				teaserEl.title = 'Click to preview';
				teaserEl.style.cursor = 'pointer';

				teaserEl.addEventListener('click', () => {
					if (document.querySelector('.preview-modal')) return;

					const modal = document.createElement('div');
					modal.className = 'preview-modal';
					modal.style.position = 'fixed';
					modal.style.top = '0';
					modal.style.left = '0';
					modal.style.width = '100%';
					modal.style.height = '100%';
					modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
					modal.style.display = 'flex';
					modal.style.justifyContent = 'center';
					modal.style.alignItems = 'center';
					modal.style.zIndex = '1000';

					const img = document.createElement('img');
					img.src = unblurredUrl;
					img.style.maxWidth = '90%';
					img.style.maxHeight = '90%';

					const closeButton = document.createElement('span');
					closeButton.innerHTML = '&times;';
					closeButton.style.position = 'absolute';
					closeButton.style.top = '20px';
					closeButton.style.right = '30px';
					closeButton.style.color = 'white';
					closeButton.style.fontSize = '40px';
					closeButton.style.cursor = 'pointer';

					modal.appendChild(img);
					modal.appendChild(closeButton);
					document.body.appendChild(modal);

					const closeModal = () => {
						const openModal = document.querySelector('.preview-modal');
						if (openModal) {
							document.body.removeChild(openModal);
						}
					};

					closeButton.addEventListener('click', (e) => {
						e.stopPropagation();
						closeModal();
					});

					modal.addEventListener('click', (e) => {
						if (e.target === modal) {
							closeModal();
						}
					});
				});
			} else {
				console.log(`[TINDER DEBLUR]: User ${user._id} has no photos in teaser data.`);
			}
		}
	} catch (err) {
		console.error('[TINDER DEBLUR]: Error in unblur function:', err);
	}
}


/**
 * Remove Tinder Gold ads
 */
function removeGoldAds() {
	// Remove the main gold banner
	const goldBanner = document.querySelector('div.CenterAlign > img[alt="Tinder Gold™"]');
	if (goldBanner) {
		const bannerContainer = goldBanner.parentElement;
		if (bannerContainer) bannerContainer.style.display = 'none';
	}

	const adDiv = document.getElementById('u1505883000');
	if (adDiv) {
		adDiv.style.display = 'none';
	}

	// hide special offer advertisement
	const advertisementLogo = document.querySelector('div[aria-label="Tinder Gold"]');

	if (advertisementLogo) {
		const addContainer = advertisementLogo.parentElement?.parentElement;

		if (addContainer) addContainer.style.display = 'none';
	}

	// remove 'Tinder Gold' advertisement

	for (const advertisementEl of document.getElementsByTagName('div')) {
		if (advertisementEl.children.length > 0) continue;

		if (advertisementEl.innerText.toLowerCase().includes('gold')) {
			advertisementEl.style.display = 'none';
		}
	}

	// remove gold button
	/** @type {HTMLButtonElement | null} */
	const goldButtonEl = document.querySelector('div.CenterAlign button[type="button"]');

	if (goldButtonEl != null) goldButtonEl.style.display = 'none';
}

/**
 * Hides the name and bio overlays on the photos
 */
function hideNameAndBio() {
	const overlays = document.querySelectorAll('.Pos\\(a\\).B\\(0\\).Start\\(0\\).End\\(0\\)');
	for (const overlay of overlays) {
		overlay.style.visibility = 'hidden';
	}
}

function updateUserInfos() {
	/** @type {HTMLElement | null} */
	const likesGridContainerEl = document.querySelector('main div.Expand > div[role="grid"]');

	if (!likesGridContainerEl) return;

	// fix scrolling
	if (likesGridContainerEl.parentElement) likesGridContainerEl.parentElement.style.overflow = 'hidden';

	if (!likesGridContainerEl.dataset.eventsInterrupted) {
		likesGridContainerEl.dataset.eventsInterrupted = 'true';
		likesGridContainerEl.addEventListener('scroll', (event) => event.stopImmediatePropagation(), true);
		likesGridContainerEl.style.justifyContent = 'flex-start';
	}

	// update the likes grid
	const likesGridEl = likesGridContainerEl.lastElementChild;

	if (!likesGridEl.dataset.stylesUpdated) {
		likesGridEl.dataset.stylesUpdated = 'true';
		likesGridEl.classList.add('D(f)');
		likesGridEl.style.removeProperty('height');
		likesGridEl.style.flexWrap = 'wrap';
		likesGridEl.style.flex = 'unset';
		likesGridEl.style.gap = '10px';
		likesGridEl.style.justifyContent = 'flex-start';
	}

	// update the like elements
	for (const likeEl of likesGridEl.children) {
		// don't update the element if it is invisible
		if (likeEl.style.display === 'none') continue;

		likeEl.classList.remove('Cur(p)');
		likeEl.style.removeProperty('transform');
		likeEl.style.position = 'relative';
		likeEl.style.backgroundColor = 'black';
		likeEl.style.borderRadius = '8px';
		likeEl.style.marginTop = '0';
		likeEl.style.marginBottom = '0';

		const userId = likeEl.dataset.userId;

		// only update if user was loaded
		if (!userId) continue;

		const userItem = cache.get(userId);

		if (!userItem) continue;

		// only update the container once
		if (likeEl.dataset.infoSet) continue;

		likeEl.dataset.infoSet = 'true';

		/** @type {HTMLElement | null} */
		const infoContainerEl = likeEl.querySelector('.like-user-info');

		if (!infoContainerEl) continue;

		// add action buttons
		likeEl.innerHTML += `
			<div class='like-actions' style='align-items: center; background-image: linear-gradient(to top, #0004, #0001); border-radius: 8px; display: flex; height: 30px; justify-content: space-around; left: 5px; padding: 2px; position: absolute; bottom: 5px; width: calc(100% - 5px * 2);'>
				<!-- Hide -->
				<button class='like-action-button like-action-pass button Lts($ls-s) Cur(p) Tt(u) Bdrs(50%) P(0) Fw($semibold) focus-button-style Bxsh($bxsh-btn) Wc($transform) Pe(a) Scale(1.1):h Scale(.9):a' type='button' style='cursor: pointer; height: 24px; width: 24px;' draggable='false'>
					<span class='Pos(r) Z(1) Expand'>
						<span class='D(b) Expand' style='transform: scale(1); filter: none;'>
							<svg focusable='false' aria-hidden='true' role='presentation' viewBox='0 0 24 24' width='24px' height='24px' class='Scale(.75) Expand'>
								<path d='m15.44 12 4.768 4.708c1.056.977 1.056 2.441 0 3.499-.813 1.057-2.438 1.057-3.413 0L12 15.52l-4.713 4.605c-.975 1.058-2.438 1.058-3.495 0-1.056-.813-1.056-2.44 0-3.417L8.47 12 3.874 7.271c-1.138-.976-1.138-2.44 0-3.417a1.973 1.973 0 0 1 3.25 0L12 8.421l4.713-4.567c.975-1.139 2.438-1.139 3.413 0 1.057.814 1.057 2.44 0 3.417L15.44 12Z' fill='var(--fill--background-nope, none)' />
							</svg>
						</span>
					</span>
				</button>
				<!-- Like -->
				<button class='like-action-button like-action-like button Lts($ls-s) Cur(p) Tt(u) Bdrs(50%) P(0) Fw($semibold) focus-button-style Bxsh($bxsh-btn) Wc($transform) Pe(a) Scale(1.1):h Scale(.9):a' type='button' style='cursor: pointer; height: 24px; width: 24px;' draggable='false'>
					<span class='Pos(r) Z(1) Expand'>
						<span class='D(b) Expand' style='transform: scale(1); filter: none;'>
							<svg focusable='false' aria-hidden='true' role='presentation' viewBox='0 0 24 24' width='24px' height='24px' class='Scale(.75) Expand'>
								<path d='M21.994 10.225c0-3.598-2.395-6.212-5.72-6.212-1.78 0-2.737.647-4.27 2.135C10.463 4.66 9.505 4 7.732 4 4.407 4 2 6.62 2 10.231c0 1.52.537 2.95 1.533 4.076l8.024 7.357c.246.22.647.22.886 0l7.247-6.58.44-.401.162-.182.168-.174a6.152 6.152 0 0 0 1.54-4.09' fill='var(--fill--background-like, none)' />
							</svg>
						</span>
					</span>
				</button>
			</div>
		`;

		// handle like element click
		likeEl.addEventListener(
			'click',
			(event) => {
				/** @type {HTMLElement | null} */
				let currentParent = event.target;

				if (!currentParent) return;

				while (!currentParent?.classList.contains('like-action-button')) {
					if (!currentParent?.parentElement) break;
					currentParent = currentParent.parentElement;
				}

				event.stopImmediatePropagation();

				if (!currentParent) return;

				if (currentParent.classList.contains('like-action-pass')) {
					pass(userItem);
				} else if (currentParent.classList.contains('like-action-like')) {
					like(userItem);
				} else {
					if (!userItem.user) return;

					if (currentParent.classList.contains('like-action-photo')) {
						const index = parseInt(currentParent.dataset.photoIndex ?? '0');
						showPhoto(likeEl, userItem.photoIndex, index, userItem.user.photos[index].url);
						userItem.photoIndex = index;
					} else if (currentParent.classList.contains('like-action-next-photo')) {
						const oldIndex = userItem.photoIndex;
						const photoUrl =
							event.offsetX < currentParent.clientWidth / 2
								? userItem.getPreviousPhoto()
								: userItem.getNextPhoto();
						showPhoto(likeEl, oldIndex, userItem.photoIndex, photoUrl);
					}

					return;
				}

				likeEl.remove();
			},
			true
		);

		/** @type {HTMLElement | null} */
		const userNameEl = infoContainerEl.querySelector('.like-user-name');
		/** @type {HTMLElement | null} */
		const userBioEl = infoContainerEl.querySelector('.like-user-bio');

		if (!userNameEl || !userBioEl) continue;

		const user = userItem.user;

		// update info container

		const userBioElHeight = userBioEl.getBoundingClientRect().height;

		userNameEl.style.transform = `translateY(-${userBioElHeight + 20 /* distance height */ + 20 /* name height */ + 20 /* action buttons */
			}px)`;
		infoContainerEl.style.opacity = `1`;

		// add photo selector
		const photoSelectorContainer = document.createElement('div');
		photoSelectorContainer.setAttribute(
			'class',
			'photo-selectors CenterAlign D(f) Fxd(r) W(100%) Px(8px) Pos(a) Iso(i)'
		);
		photoSelectorContainer.style.top = '5px';
		likeEl.appendChild(photoSelectorContainer);

		for (let i = 0; i < user.photos.length; i++) {
			const photoButton = document.createElement('button');
			photoButton.setAttribute(
				'class',
				'like-action-button like-action-photo bullet D(ib) Va(m) Cnt($blank)::a D(b)::a Cur(p) H(4px)::a W(100%)::a Py(4px) Px(2px) W(100%) Bdrs(100px)::a focus-background-style ' +
				(i == 0
					? 'Bgc($c-ds-background-tappy-indicator-active)::a bullet--active'
					: 'Bgc($c-ds-background-tappy-indicator-inactive)::a')
			);
			photoButton.dataset.photoIndex = i.toString();
			photoSelectorContainer.appendChild(photoButton);
		}
	}

	const totalLikesCount = likesGridEl?.childElementCount ?? 0;

	if (totalLikesCount == 0) {
		if (!likesGridContainerEl.dataset.noLikes) {
			likesGridContainerEl.dataset.noLikes = 'true';

			if (likesGridContainerEl.dataset.loadingTextAdded)
				likesGridContainerEl.querySelector('.loading-container')?.remove();

			const noLikesContainer = document.createElement('DIV');
			noLikesContainer.classList.add('no-likes-container');
			noLikesContainer.setAttribute(
				'style',
				'align-items: center; background-color: black; display: flex; height: 100%; justify-content: center; left: 0; position: absolute; text-align: center; top: 0; width: 100%; z-index: 50;'
			);
			likesGridContainerEl.insertBefore(noLikesContainer, likesGridContainerEl.firstChild);

			const noLikesText = document.createElement('H4');
			noLikesText.setAttribute(
				'style',
				'color: #d2d2d3; font-size: 40px; letter-spacing: 2px; text-transform: uppercase;'
			);
			noLikesText.innerText = 'No likes available';
			noLikesContainer.appendChild(noLikesText);
		}
	} else if (
		document.querySelectorAll('div[data-info-set]').length > 0 ||
		document.querySelectorAll('div[data-invalid]').length == totalLikesCount
	) {
		if (!likesGridContainerEl.dataset.loadingComplete) {
			likesGridContainerEl.dataset.loadingComplete = 'true';

			if (likesGridContainerEl.dataset.noLikes) {
				delete likesGridContainerEl.dataset.noLikes;

				likesGridContainerEl.querySelector('.no-likes-container')?.remove();
			}

			const loadingContainer = likesGridContainerEl.querySelector('.loading-container');

			if (!loadingContainer) return;

			loadingContainer.style.transition = 'opacity 0.4s 0.2s ease-out';
			loadingContainer.style.opacity = '0';

			setTimeout(() => loadingContainer.remove(), 600);
		}
	}
}

/**
 * Updates the photo
 * @param {HTMLElement} likeEl
 * @param {number} oldIndex
 * @param {number} index
 * @param {string} photoUrl
 */
function showPhoto(likeEl, oldIndex, index, photoUrl) {
	/** @type {HTMLElement | null} */
	const teaserEl = likeEl.querySelector('.teaser');
	const photoSelectorContainer = likeEl.querySelector('.photo-selectors');

	if (!photoSelectorContainer) return;

	const oldPhotoButton = photoSelectorContainer.children[oldIndex];
	oldPhotoButton.classList.remove('Bgc($c-ds-background-tappy-indicator-active)::a');
	oldPhotoButton.classList.remove('bullet--active');
	oldPhotoButton.classList.add('Bgc($c-ds-background-tappy-indicator-inactive)::a');

	if (!teaserEl) return;

	teaserEl.style.backgroundImage = `url('${photoUrl}')`;

	const newPhotoButton = photoSelectorContainer.children[index];
	newPhotoButton.classList.remove('Bgc($c-ds-background-tappy-indicator-inactive)::a');
	newPhotoButton.classList.add('Bgc($c-ds-background-tappy-indicator-active)::a');
	newPhotoButton.classList.add('bullet--active');
}

/**
 * Hides a user from the likes section
 * @param {UserCacheItem} userItem
 */
function hide(userItem) {
	const hiddenUsers = localStorage.getItem('hiddenUsers')?.split(';') ?? [];

	if (!hiddenUsers.includes(userItem.userId)) hiddenUsers.push(userItem.userId);

	localStorage.setItem('hiddenUsers', hiddenUsers.join(';'));

	userItem.hidden = true;
}

/**
 * Adds user filtering
 */
function updateUserFiltering() {
	/** @type {HTMLDivElement | null} */
	const filterButtonEl = document.querySelector('div[role="grid"] div[role="option"]:nth-of-type(1)');

	if (filterButtonEl != null) {
		if (!filterButtonEl.dataset.eventsInterrupted) {
			filterButtonEl.dataset.eventsInterrupted = 'true';
			filterButtonEl.addEventListener('click', () => {
				setTimeout(() => {
					// remove "show all" button
					for (const element of document.querySelectorAll(
						'div[role="dialog"] .menuItem__contents > div > div[role="button"]'
					)) {
						element.remove();
					}

					const applyContainer = document.querySelector(
						'div[role="dialog"] > div:not(.menuItem):not(.CenterAlign)'
					);

					if (applyContainer != null) {
						applyContainer.innerHTML = '';
						applyContainer.className = '';
						applyContainer.setAttribute(
							'style',
							'align-items: center; display: flex; flex-shrink: 0; font-size: 20px; height: 50px; justify-content: center; width: 100%;'
						);

						const applyButtonEl = document.createElement('button');
						applyButtonEl.innerText = 'Apply';
						applyButtonEl.style.textTransform = 'uppercase';
						applyButtonEl.style.fontWeight = '600';
						applyButtonEl.style.color = 'var(--color--text-brand-normal)';
						applyContainer.appendChild(applyButtonEl);

						applyButtonEl.addEventListener(
							'click',
							(event) => {
								event.stopImmediatePropagation();

								const dialogMenuItemContents = document.querySelectorAll(
									'div[role="dialog"] > .menuItem > .menuItem__contents > div:nth-of-type(2)'
								);

								// max distance
								const maxDistanceElement = dialogMenuItemContents[0].querySelector('div[style]');

								if (!maxDistanceElement) return;

								let maxDistance = Math.floor(
									(maxDistanceElement.clientWidth /
										(maxDistanceElement.parentElement?.clientWidth ?? 1)) *
									(161 - 2) +
									2
								);

								if (maxDistance == 161) maxDistance = Number.MAX_SAFE_INTEGER;

								// age range
								const ageRangeElement = dialogMenuItemContents[1].querySelector('div[style]');

								if (!ageRangeElement) return;

								const ageRangeStart = Math.round(
									(parseFloat(getComputedStyle(ageRangeElement).left.replace('px', '')) /
										(ageRangeElement.parentElement?.clientWidth ?? 1)) *
									(100 - 18) +
									18
								);
								let ageRangeEnd =
									ageRangeStart +
									Math.round(
										(ageRangeElement.clientWidth /
											(ageRangeElement.parentElement?.clientWidth ?? 1)) *
										(100 - 18)
									);

								if (ageRangeEnd == 100) ageRangeEnd = Number.MAX_SAFE_INTEGER;

								// minimum photos amount
								let minimumPhotosAmount = 0;

								/** @type {NodeListOf<HTMLDivElement>} */
								const photosOptions = dialogMenuItemContents[2].querySelectorAll('div[role="option"]');

								for (const minimumPhotosOption of photosOptions) {
									if (
										minimumPhotosOption
											.getAttribute('class')
											?.includes('c-ds-border-passions-shared')
									) {
										minimumPhotosAmount = parseInt(minimumPhotosOption.innerText);
										break;
									}
								}

								// interests
								const interests = [];

								/** @type {NodeListOf<HTMLDivElement>} */
								const interestOptions =
									dialogMenuItemContents[3].querySelectorAll('div[role="option"]');

								for (const interestOption of interestOptions) {
									if (interestOption.getAttribute('class')?.includes('c-ds-border-passions-shared'))
										interests.push(interestOption.innerText);
								}

								/** @type {NodeListOf<HTMLInputElement>} */
								const dialogMenuSelects = document.querySelectorAll(
									'div[role="dialog"] > .menuItem > .menuItem__contents .menuItem__select input'
								);

								// verified
								const verifiedRequired = dialogMenuSelects[0].checked;

								// has bio
								const bioRequired = dialogMenuSelects[1].checked;

								// apply filter
								/** @type {NodeListOf<HTMLDivElement>} */
								const likeItems = document.querySelectorAll('.like-item');

								for (const likeElement of likeItems) {
									if (!likeElement.dataset.userId) continue;

									const userItem = cache.get(likeElement.dataset.userId);

									if (!userItem) continue;

									const user = userItem.user;

									if (!user) continue;

									const userInterests = Array.from(user.user_interests ?? []).map(
										(interest) => interest.name
									);

									let matches = true;

									// check radius
									if (!user.hide_distance && user.distance_mi > maxDistance) matches = false;
									// check age range
									else if (
										!user.hide_age &&
										(userItem.getAge() < ageRangeStart || userItem.getAge() > ageRangeEnd)
									)
										matches = false;
									// check photos amount
									else if (user.photos.length < minimumPhotosAmount) matches = false;
									// check verified
									else if (!user.is_tinder_u && verifiedRequired) matches = false;
									// check bio
									else if (user.bio.length == 0 && bioRequired) matches = false;
									// check interests
									else {
										for (const interest of interests) {
											if (!userInterests.includes(interest)) matches = false;
										}
									}

									likeElement.style.display = matches ? 'flex' : 'none';
								}

								// close dialog
								/** @type {Element | null | undefined} */
								const applyButton =
									document.querySelector('div[role="dialog"]')?.parentElement?.firstElementChild;

								applyButton?.click();

								setTimeout(removeGoldAds, 250);
							},
							true
						);
					}
				}, 200);
			});
		}

		if (!filterButtonEl.parentElement) return;

		/** @type {NodeListOf<HTMLDivElement>} */
		const optionEls = filterButtonEl.parentElement.querySelectorAll('div[role="option"]');

		for (const optionEl of optionEls) {
			if (!optionEl.dataset.eventsInterrupted) optionEl.remove();
		}

		if (!filterButtonEl.parentElement.parentElement) return;

		/** @type {HTMLElement} */
		const filterButtonContainer = filterButtonEl.parentElement.parentElement;
		filterButtonContainer.style.maxWidth = 'calc(100% - 36.5px * 2 + 12px * 2)';
	}
}

/**
 * Creates a message status icon + text
 */
function createMessageStatusElement(parentNode, read) {
	if (parentNode == null) return;

	const status = document.createElement('div');
	status.setAttribute(
		'class',
		'Pos(r) Fz($2xs) My(8px) Mx(4px) Mih(16px) C($c-ds-text-secondary) D(f) Ai(c) Jc(fe) Fxd(r)'
	);
	status.innerHTML = `
		<div class="D(f) Jc(c) Fxd(r) Mend(8px) Ai(fs)">
			<svg focusable="false" aria-hidden="false" role="img" viewBox="0 0 24 24" width="24px" height="24px" class="Sq(12px)">
				<path d="M7.48 14.413l5.74-8.316a.63.63 0 01.9-.142l.917.697c.275.21.33.6.125.876L8.02 17.153a.63.63 0 01-.938.084l-.047-.044a.85.85 0 01-.145-.105l-4.072-3.653a.84.84 0 01-.075-1.173l.524-.612a.84.84 0 011.215-.063l2.996 2.826h.002zm6.353.627l5.747-8.327a.63.63 0 01.9-.143l.917.698c.275.209.33.6.125.877l-7.144 9.622a.63.63 0 01-.938.083l-.023-.023a.842.842 0 01-.217-.137l-2-1.738a.84.84 0 01-.087-1.182l.517-.6a.84.84 0 011.213-.065l.989.933.001.002z" fill="${read ? '#106bd5' : '#fff'
		}" fill-rule="evenodd" />
			</svg>
		</div>
		<span>${read ? 'Read' : 'Sent'}</span>
	`;

	parentNode.appendChild(status);
}

/**
 * Displays read status below sent messages
 */
async function updateMessageInfos(matchId) {
	/** @type {HTMLDivElement | null} */
	const lastMessageStatus = document.querySelector('.msg__status');

	if (!lastMessageStatus) return;

	lastMessageStatus.remove();

	fetchMatches().then((matches) => {
		if (matches == null) return;

		const filteredMatches = matches.filter((match) => match.id === matchId);

		if (filteredMatches.length == 0) return;

		const match = filteredMatches[0];
		const lastReadMesssageId = match.seen.last_seen_msg_id;

		if (!lastReadMesssageId) return;

		// get message content from last read message
		fetchMessages(matchId).then((messages) => {
			if (messages == null) return;

			const filteredMessages = messages.filter((message) => message._id === lastReadMesssageId);

			if (filteredMessages.length == 0) return;

			let lastReadMessage = filteredMessages[0];
			let currentMessageIndex = messages.indexOf(lastReadMessage);

			while (lastReadMessage.from === match.person._id && currentMessageIndex < messages.length - 1) {
				lastReadMessage = messages[currentMessageIndex++];
			}

			// only the matched person sent a message
			if (!lastReadMessage) return;

			const messageContent = lastReadMessage.message;

			/** @type {NodeListOf<HTMLElement>} */
			const messageElements = document.querySelectorAll('.msg');

			if (messageElements.length == 0) return;

			for (let i = messageElements.length - 1; i >= 0; i--) {
				const messageElement = messageElements[i];
				const messageContainer = messageElement.parentElement?.parentElement;

				if (!messageContainer) continue;

				const isRead = messageElement.innerText === messageContent;

				// only add info to messages sent by the user of this script
				if (messageContainer.classList.contains('Ta(e)')) createMessageStatusElement(messageContainer, isRead);

				if (isRead) break;
			}
		});
	});
}

/**
 * Passes a user and hides it from the likes section afterwards
 * @param {UserCacheItem} userItem
 */
async function pass(userItem) {
	const response = await fetch(
		`https://api.gotinder.com/pass/${userItem.userId}?s_number=${userItem.user?.s_number ?? 0}`,
		{
			headers: {
				'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken') ?? '',
				platform: 'android',
			},
			method: 'GET',
		}
	);

	hide(userItem);
}

/**
 * Likes a user and hides it from the likes section afterwards
 * @param {UserCacheItem} userItem
 */
async function like(userItem) {
	const response = await fetch(`https://api.gotinder.com/like/${userItem.userId}`, {
		headers: {
			'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken') ?? '',
			platform: 'android',
			'Content-Type': 'application/json',
		},
		method: 'POST',
		body: JSON.stringify(
			userItem.user
				? {
					liked_content_id: userItem.user.photos[0].id,
					liked_content_type: 'photo',
					s_number: userItem.user.s_number,
				}
				: {
					s_number: 0,
				}
		),
	});

	hide(userItem);
}

/**
 * Fetches all messages in a conversation using Tinder API
 * @param {string} matchId
 * @returns {Promise<any>}
 */
async function fetchMessages(matchId) {
	return fetch(`https://api.gotinder.com/v2/matches/${matchId}/messages?locale=en&count=100`, {
		headers: {
			'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken') ?? '',
		},
	})
		.then((res) => res.json())
		.then((res) => res.data.messages);
}

/**
 * Fetches matches using Tinder API
 * @returns {Promise<any>}
 */
async function fetchMatches() {
	return fetch('https://api.gotinder.com/v2/matches?locale=en&count=60&message=1', {
		headers: {
			'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken') ?? '',
		},
	})
		.then((res) => res.json())
		.then((res) => res.data.matches);
}

/**
 * Fetches teaser cards using Tinder API
 * @returns {Promise<any>}
 */
async function fetchTeasers() {
	return fetch('https://api.gotinder.com/v2/fast-match/teasers', {
		headers: {
			'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken') ?? '',
			platform: 'android',
		},
	})
		.then((res) => res.json())
		.then((res) => res.data.results);
}

/**
 * Fetches information about specific user using Tinder API
 * @param {string} id
 * @returns {Promise<any>}
 */
async function fetchUser(id) {
	/* disabled due to API changes, currently looking for a workaround!

	return fetch(`https://api.gotinder.com/user/${id}`, {
		headers: {
			'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken') ?? '',
			platform: 'android',
		},
	})
		.then((res) => res.json())
		.then((res) => res.results);*/

	return null;
}

/**
 * Awaits the first event of the specified listener
 * @param {EventTarget} target
 * @param {string} eventType
 * @returns {Promise<void>}
 */
async function once(target, eventType) {
	return new Promise((resolve) => {
		const resolver = () => {
			target.removeEventListener(eventType, resolver);
			resolve();
		};
		target.addEventListener(eventType, resolver);
	});
}

/**
 * Utility function to catch errors inline
 * @template T
 * @template {Error} U
 * @param {Promise<T>} promise
 * @return {Promise<[null, T] | [U, undefined]>}
 */
async function safeAwait(promise) {
	try {
		const result = await promise;
		return [null, result];
	} catch (err) {
		return [err, undefined];
	}
}

/**
 * Awaits until the main app element is found in DOM and returns it
 * @returns {Promise<HTMLElement>}
 */
async function waitForApp() {
	const getAppEl = (parent) => parent.querySelector('.App');
	let appEl = getAppEl(document.body);
	console.log('[TINDER DEBLUR]: waitForApp initial check. Found .App:', !!appEl);

	if (appEl) return appEl;

	return new Promise((resolve) => {
		console.log('[TINDER DEBLUR]: Setting up MutationObserver to find .App element.');
		new MutationObserver((_, me) => {
			console.log('[TINDER DEBLUR]: MutationObserver triggered.');
			appEl = getAppEl(document.body);

			if (appEl) {
				console.log('[TINDER DEBLUR]: .App element found by MutationObserver.');
				me.disconnect();
				resolve(appEl);
			}
		}).observe(document.body, { subtree: true, childList: true });
	});
}

function addHeader() {
	const header = document.createElement('div');
	header.style.textAlign = 'center';
	header.style.padding = '5px';
	header.style.backgroundColor = 'black';
	header.style.color = 'white';
	header.style.fontSize = '12px';
	header.innerHTML = `
		<p>Tinder Deblur V2 active!</p>
		<p>Click on any like card to preview in higher resolution. Ad popups are also removed.</p>
		<p>Only the last 10 likes can be shown due to Tinder's limitations.</p>
		<p>This script is made by <a style="color: lightblue;" href="https://github.com/BytePhoenixCoding">BytePhoenix</a>, donations much appreciated! <a style="color: lightblue;" href="ethereum:0xDFDEB2589586470E944558383502789bade35348">Donate ETH or other crypto</a></p>
	`;
	document.body.insertBefore(header, document.body.firstChild);
}

async function main() {
	console.log('[TINDER DEBLUR]: Script starting');
	addHeader();
	// check if running as a userscript
	if (typeof GM_info === 'undefined') {
		console.warn(
			'[TINDER DEBLUR]: The only supported way of running this script is through a userscript management browser addons like Violentmonkey, Tampermonkey or Greasemonkey!'
		);
		console.warn(
			'[TINDER DEBLUR]: Script was not terminated, but you should really look into the correct way of running it.'
		);
	}

	// wait for a full page load
	await once(window, 'load');
	console.log('[TINDER DEBLUR]: Window loaded.');
	const appEl = await waitForApp();
	console.log('[TINDER DEBLUR]: waitForApp resolved. App element:', appEl);

	const pageCheckCallback = async () => {
		console.log(`[TINDER DEBLUR]: pageCheckCallback running. Pathname: ${location.pathname}`);
		if (['/app/likes-you', '/app/gold-home'].includes(location.pathname)) {
			console.log('[TINDER DEBLUR]: On likes page.');
			// check if any likes were loaded yet
			const likeElements = document.querySelectorAll('div[style*="images-ssl.gotinder.com"]');
			console.log(`[TINDER DEBLUR]: Found ${likeElements.length} like elements with selector 'div[style*="images-ssl.gotinder.com"]'.`);
			if (likeElements.length > 0) {
				console.debug('[TINDER DEBLUR]: Removing Tinder Gold ads');
				removeGoldAds();

				console.debug('[TINDER DEBLUR]: Hiding name and bio');
				hideNameAndBio();

				console.debug('[TINDER DEBLUR]: Checking filters');
				updateUserFiltering();

				console.debug('[TINDER DEBLUR]: Deblurring likes');
				await unblur();
			}

			console.debug('[TINDER DEBLUR]: Updating user infos');
			updateUserInfos();
		} else {
			// clear the cache when not on likes page anymore
			cache.clear();

			if (location.pathname.startsWith('/app/messages/')) {
				console.debug('[TINDER DEBLUR]: Updating message infos');
				updateMessageInfos(location.pathname.substring(location.pathname.lastIndexOf('/') + 1));
			}
		}

		// loop based observer (every 4s)
		setTimeout(pageCheckCallback, 4_000);
	};

	pageCheckCallback();
}

main().catch(console.error);