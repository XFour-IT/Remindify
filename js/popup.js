// SPDX-FileCopyrightText: 2024 Ben Lewis <oss@benjilewis.dev>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

function displayPopup() {
	// Create an iframe element for the popup
	const popupIframe = document.createElement('iframe');
	popupIframe.id = 'columnCreationPopup';
	popupIframe.style.position = 'fixed';
	popupIframe.style.top = '50%';
	popupIframe.style.left = '50%';
	popupIframe.style.transform = 'translate(-50%, -50%)';
	popupIframe.style.background = 'white';
	popupIframe.style.padding = '20px';
	popupIframe.style.border = '2px solid black';
	popupIframe.style.zIndex = '99999999999999';
	popupIframe.style.width = '500px'; // Set a width
	popupIframe.style.height = '300px'; // Set a height

	// Append the iframe to the body
	document.body.appendChild(popupIframe);

	// Load the message from storage
	chrome.storage.sync.get('message', function(data) {
		// If there's no message in storage, use a default message
		const message = data.message || `
		<h2>Creating a new column?</h2>
		<p>Remember your dev guidelines!</p>`;

		// Add content to the popup
		popupIframe.contentWindow.document.open();
		popupIframe.contentWindow.document.write(`
			<link href="https://fonts.googleapis.com/css?family=Roboto&display=swap" rel="stylesheet">
			<style>
				body {
					font-family: 'Roboto', sans-serif;
				}
			</style>
			${message}
			<button id="closePopupBtn">Close</button>
		`);
		popupIframe.contentWindow.document.close();

		// Add event listener to close the popup when the close button is clicked
		const closePopupBtn = popupIframe.contentWindow.document.getElementById('closePopupBtn');
		closePopupBtn.addEventListener('click', () => {
			popupIframe.remove();
		});
	});
}

// The rest of your code remains the same

// Function to observe changes in the DOM
function observeDOM() {
	const observer = new MutationObserver(iterateMutations);

	observer.observe(document.body, { childList: true, subtree: true });
}

function iterateMutations(mutations) {
	mutations.forEach((mutation) => {mutation.addedNodes.forEach(checkNode);});
}

function checkNode(node) {
	// Check if the node is an element node
	if (node.nodeType === Node.ELEMENT_NODE) {
		const link = node.querySelector('a[href="https://go.microsoft.com/fwlink/?linkid=2192539"]');
		// Check for the specific text
		if ((node.textContent.includes('Previously called fields.') || (link && link.textContent === 'Learn More')) && !document.getElementById('columnCreationPopup')) {
			displayPopup();
		}
	}
}

// Start observing DOM mutations
observeDOM();