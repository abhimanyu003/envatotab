function updateVitals(username,apiKey) {

   var vitals = performProtectedRequest("edge","vitals",username,apiKey);

   vitals.success(function (data) {
      $("header .username a").append( data['vitals'].username );
      $("header .balance a").append( data['vitals'].balance.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
   });

}

document.addEventListener("DOMContentLoaded", function () {

    backGround = chrome.extension.getBackgroundPage();
    backGround.updateIcon();

    var optionsButton = document.getElementById('options');
    optionsButton.onclick = function() {
      chrome.tabs.create({'url': chrome.extension.getURL('options.html'), 'selected': true});
   }

});

jQuery( document ).ready( function( $ ) {

	"use strict";

	function init(username,apiKey) {

		updateVitals(username,apiKey);

	}

	updateOptions(init);

});
