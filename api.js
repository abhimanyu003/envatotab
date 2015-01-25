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
