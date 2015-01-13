
chrome.runtime.sendMessage({ action: "show" });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    window.location.reload();
});



chrome.storage.sync.get(["exchangeRate", "tutByConverter"], function(items) {
    var currentExchangeRate;
    if (typeof items.exchangeRate !== "undefined") {
        currentExchangeRate = items.exchangeRate;
    } else {
        currentExchangeRate = 14000;
    }

    start(currentExchangeRate, {"tutByConverter": items.tutByConverter});
});

function start(currentExchangeRate, settings) {
   new KupiTutByPlugin(currentExchangeRate, settings).run();
}













