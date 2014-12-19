function updateOptions(callback) {

	chrome.storage.sync.get({
	    username: '',
	    apiKey: ''
	}, function(data) {
		callback(data.username,data.apiKey);  
	});

}

// Function to fetch json data from envato marketplace through jquery ajax
function performPublicRequest(apiVersion,parameter) {

	return $.ajax({
		url: "http://marketplace.envato.com/api/" + apiVersion + "/" + parameter + ".json",
		dataType: "json"
	});

}

// Function to fetch protected json data from envato marketplace through jquery ajax
function performProtectedRequest(apiVersion,parameter,username,apiKey) {

	return $.ajax({
		url: "http://marketplace.envato.com/api/" + apiVersion + "/" + username + "/" + apiKey + "/" + parameter + ".json",
		dataType: "json"
	});

}

function updateVitals(username,apiKey) {

	var vitals = performProtectedRequest("edge","vitals",username,apiKey);

	vitals.success(function (data) {
		$("header .username a").append( data['vitals'].username );
		$("header .balance a").append( data['vitals'].balance.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
	});

}

function updateEnvatoStats() {

	var totalUsers = performPublicRequest("edge","total-users");

	totalUsers.success(function (data) {
		$("header .total-users a").append( data['total-users'].total_users.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
	});

	var totalItems = performPublicRequest("edge","total-items");

	totalItems.success(function (data) {
		$("header .total-items a").append( data['total-items'].total_items.toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") );
	});

}

function updateStatement(username,apiKey,records) {

	records = (typeof records !== 'undefined') ? records : 10;

	var statement = performProtectedRequest("edge","statement",username,apiKey);

	statement.success(function (data) {
		data.statement.length = records;
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

}

function updateRecentSales(username,apiKey,records) {

	records = (typeof records !== 'undefined') ? records : 10;

	var recentSales = performProtectedRequest("edge","recent-sales",username,apiKey);

	recentSales.success(function (data) {
		data['recent-sales'].length = records;
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

document.addEventListener('DOMContentLoaded', function () {

    var optionsButton = document.getElementById('options');
	optionsButton.onclick = function() {
		chrome.tabs.create({'url': chrome.extension.getURL('options.html'), 'selected': true});
	}

});