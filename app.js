jQuery( document ).ready( function( $ ) {

	"use strict";

	var username = "vuzzu";
	var username = "YOUR-ENVATO-USERNAME";
	var apiKey = "YOUR-ENVATO-API-KEY";

	function performPublicRequest(apiVersion,parameter) {

		return $.ajax({
			url: apiUrl + apiVersion + "/" + parameter + ".json",
			dataType: "json"
		});

	}

	function performProtectedRequest(apiVersion,parameter) {

		return $.ajax({
			url: apiUrl + apiVersion + "/" + username + "/" + apiKey + "/" + parameter + ".json",
			dataType: "json"
		});

	}

	function init() {

		var totalUsers = performPublicRequest("edge","total-users");

		totalUsers.success(function (data) {
			$("header .total-users a").append( data['total-users'].total_users );
		});

		var totalItems = performPublicRequest("edge","total-items");

		totalItems.success(function (data) {
			$("header .total-items a").append( data['total-items'].total_items );
		});

		var vitals = performProtectedRequest("edge","vitals");

		vitals.success(function (data) {
			$("header .username a").append( data['vitals'].username );
			$("header .balance a").append( data['vitals'].balance );
		});


		var statement = performProtectedRequest("edge","statement");

		statement.success(function (data) {
			$.each(data.statement,function() {
				var date = new Date(this.occured_at);
				var day = date.getDate()+1;
				var month = date.getMonth()+1;
				var year = date.getFullYear()+1;
				var stringDate = day + "-" + month + "-" + year;
				$(".statement table tbody").append( 
					"<tr>" + 
						"<td>" + stringDate + "</td>" +
						"<td>" + this.kind + "</td>" +
						"<td>$" + this.amount + "</td>" +
						"<td>" + this.description + "</td>" +
					"</tr>" 
				);
			});
		});


		var recentSales = performProtectedRequest("edge","recent-sales");

		recentSales.success(function (data) {
			$.each(data['recent-sales'],function() {
				console.log(this);
				var date = new Date(this.sold_at);
				var day = date.getDate()+1;
				var month = date.getMonth()+1;
				var year = date.getFullYear()+1;
				var stringDate = day + "-" + month + "-" + year;
				$(".recent-sales table tbody").append( 
					"<tr>" + 
						"<td>" + stringDate + "</td>" +
						"<td>$" + this.amount + "</td>" +
						"<td>" + this.item + "</td>" +
					"</tr>" 
				);
			});
		});

	}


	$(".quick-download").on("click",".start-download",function() {
		if( $(".quick-download .purchase-code").val().length > 0 ) {

			var notifier = $(this).children("i");

			notifier.removeClass().addClass("fa fa-spin fa-spinner");
			var download = performProtectedRequest("edge","download-purchase:" + $(".quick-download .purchase-code").val() );

			download.success(function (data) {
				notifier.removeClass().addClass("fa fa-download");
				window.location = data['download-purchase'].download_url;
			});

		}
	});

	

	init();

});