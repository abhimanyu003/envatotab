// Saves options to chrome.storage
function save_options() {
  var username = document.getElementById('username').value;
  var apiKey = document.getElementById('api-key').value;
  chrome.storage.sync.set({
    username: username,
    apiKey: apiKey
  }, function() {
    // Update status to let user know options were saved.
    var notifier = document.getElementById('notifier');
    notifier.className = "fa fa-spin fa-spinner";
    setTimeout(function() {
      notifier.className = "fa fa-check";
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    username: '',
    apiKey: ''
  }, function(items) {
    document.getElementById('username').value = items.username;
    document.getElementById('api-key').value = items.apiKey;
  });
}

//Run envatotab by opening new tab and closing current one
function run_envatotab() {
  chrome.tabs.create({
    url: chrome.extension.getURL('newtab.html')
  });

  chrome.tabs.getCurrent(function(tab) {
    chrome.tabs.remove(tab.id, function() { });
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save-changes').addEventListener('click', save_options);
document.getElementById('run-envatotab').addEventListener('click', run_envatotab);