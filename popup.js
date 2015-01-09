$(function () {

    var allowedKeyCodes = [46, 8, 37, 39];

    var exchangeRateField = $("#exchangeRate");

    exchangeRateField.on('keydown',function(event) {

        if ($.inArray(event.keyCode,allowedKeyCodes) > -1) {
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

    function validateExchangeRateField() {
        var exchangeRateValue = exchangeRateField.val();
        if(exchangeRateValue.trim() == '' || exchangeRateValue == 0) {
            exchangeRateField.css('background-color','pink');
            exchangeRateField.attr('title','Введите значение больше 0');
            return false;
        } else {
            exchangeRateField.css('background-color','white');
            exchangeRateField.attr('title', '');
            return true;
        }
    }

    function makeId() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    $('#saveBtn').click(function () {
        if(validateExchangeRateField()) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

                var exchangeRateValue = exchangeRateField.val();
                saveExchangeRate(exchangeRateValue);
                chrome.tabs.sendMessage(tabs[0].id, { exchangeRate: exchangeRateValue });
                window.close();

        });
        }
    });

    var informerUrl = 'http://www.ecopress.by/cgi/informer.php?nb=USD,EUR,RUB&vb=USD,EUR,RUB&b=USD,EUR,RUB&inf=f0f8ff&bgc=ffffff&hbgc=cacaff&txtc=000000&htxtc=000000&border=000000&iborder=000000&numc=000000&datec=000080&copyc=000080&plusc=006600&minusc=ff0000&is_b=1&is_ib=1&l=160&random=' + makeId();
    var informer = $('\<a href="http://www.ecopress.by" title="Курсы валют на www.ecopress.by" target="_blank"><img border="0" src="' + informerUrl + '" width="160" alt="Курсы валют на www.ecopress.by"></a>');
    $('#converterTable').after(informer);

});






