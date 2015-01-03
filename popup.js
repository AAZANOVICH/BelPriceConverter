/**********************************************************************
*  Copyright (C) 2014 by a.azanovich@gmail.com
*  All rights reserved.
*
**********************************************************************/

$(function () {

    var exchangeRateField = $("#exchangeRate");

    exchangeRateField.on('keydown',function(event) {
        if ( event.keyCode == 46 || event.keyCode == 8 ) {
            // let it happen, don't do anything
        }
        else {
            // Ensure that it is a number and stop the keypress
            if (event.keyCode < 48 || event.keyCode > 57 ) {
                event.preventDefault();
            }
        }
    });

    exchangeRateField.on('paste',function(event) {
        event.preventDefault();
    });

    chrome.storage.sync.get("exchangeRate", function(items) {
        var exchangeRate =  items.exchangeRate;
        var exchangeRateField = $("#exchangeRate");
        if (typeof exchangeRate === "undefined" || exchangeRate.trim() == '') {
            exchangeRate = "14000";
        }
        exchangeRateField.val(exchangeRate);

    });

    function saveExchangeRate(exchangeRate) {
        chrome.storage.sync.set({ "exchangeRate" : exchangeRate }, function () {
            console.log("Exchange Rate saved : " + exchangeRate);
        });
    }

    $('#saveBtn').click(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var exchangeRateValue = exchangeRateField.val();
            saveExchangeRate(exchangeRateValue);
            chrome.tabs.sendMessage(tabs[0].id, { exchangeRate: exchangeRateValue });
            window.close();
        });
    });

});






