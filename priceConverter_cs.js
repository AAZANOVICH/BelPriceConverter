
chrome.runtime.sendMessage({ action: "show" });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    window.location.reload();
});



chrome.storage.sync.get("exchangeRate", function(items) {
    var currentExchangeRate;
    if (typeof items.exchangeRate !== "undefined" || items.exchangeRate.trim() != '') {
        currentExchangeRate = items.exchangeRate;
    } else {
        currentExchangeRate = 14000;
    }
    start(currentExchangeRate);
});

function start(currentExchangeRate) {
   new KupiTutByPlugin(currentExchangeRate).run();
}













