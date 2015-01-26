
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

    if(window.location.host == "r.onliner.by") {
        startOnlinerCatalogPlugin(currentExchangeRate, {});
    } else {
        startTutByCatalogPlugin(currentExchangeRate, {"tutByConverter": items.tutByConverter});
    }

});

function startOnlinerCatalogPlugin(currentExchangeRate, settings) {
    new RentOnlinerPlugin(currentExchangeRate, settings).run();
}


function startTutByCatalogPlugin(currentExchangeRate, settings) {
   new KupiTutByPlugin(currentExchangeRate, settings).run();
}













