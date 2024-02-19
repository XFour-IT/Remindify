// SPDX-FileCopyrightText: 2024 Ben Lewis <oss@benjilewis.dev>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

document.addEventListener('DOMContentLoaded', function() {
	// Load the current message from storage
	chrome.storage.sync.get('message', function(data) {
		// If there's no message in storage, use a default message
		const message = data.message || `
		<h2>Creating a new column?</h2>
		<p>Remember your dev guidelines!</p>`;
		document.getElementById('message').value = message;
	});

	// Listen for form submission
	document.getElementById('configForm').addEventListener('submit', function(e) {
		e.preventDefault();

		// Save the entered message to storage
		const message = document.getElementById('message').value;
		chrome.storage.sync.set({ message: message }, function() {
			alert('Message saved!');
		});
	});
});