document.addEventListener("DOMContentLoaded", function () {
    backGround = chrome.extension.getBackgroundPage();
    backGround.updateIcon();
});

jQuery( document ).ready( function( $ ) {

	"use strict";

	function init(username,apiKey) {

		updateVitals(username,apiKey);

	}

	updateOptions(init);

});