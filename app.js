jQuery( document ).ready( function( $ ) {


	"use strict";

	var username = "YOUR-ENVATO-USERNAME";
	var apiKey = "YOUR-ENVATO-APIKEY";
	var apiUrl = "http://marketplace.envato.com/api/";
	var statementRecords = 10;
	var recentSalesRecords = 10;

	function updateOptions(callback) {

		chrome.storage.sync.get({
		    username: '',
		    apiKey: ''
		}, function(data) {
			username = data.username;
			apiKey = data.apiKey;
			callback();  
		});

	}

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

		$("header .options a").attr("href", chrome.extension.getURL("options.html") );

		var totalUsers = performPublicRequest("edge","total-users");

		totalUsers.success(function (data) {
			$("header .total-users a").append( data['total-users'].total_users.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
		});

		var totalItems = performPublicRequest("edge","total-items");

		totalItems.success(function (data) {
			$("header .total-items a").append( data['total-items'].total_items.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
		});

		var vitals = performProtectedRequest("edge","vitals");

		vitals.success(function (data) {
			$("header .username a").append( data['vitals'].username );
			$("header .balance a").append( data['vitals'].balance.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
		});

		var statement = performProtectedRequest("edge","statement");

		statement.success(function (data) {
			data.statement.length = statementRecords;
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
						"<td>" + this.description.substring(0, 40) + "...</td>" +
					"</tr>" 
				);
			});
		});


		var recentSales = performProtectedRequest("edge","recent-sales");

		recentSales.success(function (data) {
			data['recent-sales'].length = recentSalesRecords;
			$.each(data['recent-sales'],function() {
				var date = new Date(this.sold_at);
				var day = date.getDate()+1;
				var month = date.getMonth()+1;
				var year = date.getFullYear()+1;
				var stringDate = day + "-" + month + "-" + year;
				$(".recent-sales table tbody").append( 
					"<tr>" + 
						"<td>" + stringDate + "</td>" +
						"<td>$" + this.amount + "</td>" +
						"<td>" + this.item.substring(0, 40) + "...</td>" +
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

	$('.search-author-by-username').keyup(function() {
		var searchedUsername = $(this).val();
		if( searchedUsername.length > 2 ) {
			var searchUser = performPublicRequest("edge","user:" + searchedUsername );

			searchUser.success(function (data) {
				if( data.user.image.search('http') ) {
					var avatarUrl = 'http:' + data.user.image;
				} else {
					var avatarUrl = data.user.image;
				}
				$('.author-result .author-url').attr("href","http://themeforest.net/user/"+data.user.username);
				$('.author-result .country').html(data.user.country).attr("href","https://en.wikipedia.org/wiki/"+data.user.country);
				$('.author-result .location').html(data.user['location']).attr("href","https://www.google.com/maps/search/"+encodeURI( data.user['location'] + ", " + data.user.country ) );
				$('.author-result .sales').html(data.user.sales);
				$('.author-result .followers').html(data.user.followers);

/*
				var searchUserItems = performPublicRequest("edge","user-items-by-site:" + searchedUsername );
				searchUserItems.success(function (data) {

				});
*/

				$('.author-result:hidden').slideToggle(true);
				if(avatarUrl) $('.author-avatar .author-url').html('<img src="'+avatarUrl+'" class="img-thumbnail"  />');
			}).fail(function() {
				$('.author-result:visible').slideToggle(false);
				$('.author-avatar .author-url').html('<img data-src="holder.js/80x80" class="img-thumbnail" alt="80x80" src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/PjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgdmlld0JveD0iMCAwIDE0MCAxNDAiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiPjxkZWZzLz48cmVjdCB3aWR0aD0iMTQwIiBoZWlnaHQ9IjE0MCIgZmlsbD0iI0VFRUVFRSIvPjxnPjx0ZXh0IHg9IjQ1IiB5PSI3MCIgc3R5bGU9ImZpbGw6I0FBQUFBQTtmb250LXdlaWdodDpib2xkO2ZvbnQtZmFtaWx5OkFyaWFsLCBIZWx2ZXRpY2EsIE9wZW4gU2Fucywgc2Fucy1zZXJpZiwgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB0O2RvbWluYW50LWJhc2VsaW5lOmNlbnRyYWwiPjE0MHgxNDA8L3RleHQ+PC9nPjwvc3ZnPg==" style="width: 80px; height: 80px;"  style="width: 80px; height: 80px;">');
			});
		}
	});

	updateOptions(init);

});