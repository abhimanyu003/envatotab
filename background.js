var i = 1;

function updateIcon() {
    i = 1;
    chrome.browserAction.setBadgeText({
        text: ''
    });
    chrome.browserAction.setPopup({
        popup: "popup.html"
    });
}

function storeInitialBalance() {




}



window.setInterval(function () {



    chrome.browserAction.setBadgeBackgroundColor({
        color: [200, 0, 0, 100]
    });

    chrome.browserAction.setBadgeText({
        text: String(i)
    });
    i++;

}, 10000);
