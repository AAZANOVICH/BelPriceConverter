////////////////

chrome.runtime.sendMessage({ action: "show" });

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    window.location.reload();
});

var current_exchange_rate;

chrome.storage.sync.get("exchangeRate", function(items) {

    if (typeof items.exchangeRate !== "undefined" || items.exchangeRate.trim() != '') {
        current_exchange_rate = items.exchangeRate;
    } else {
        current_exchange_rate = 14500;
    }
    start();
});

var ObserverUtils = (function() {

    function createObserver(element, mutationCallback, config) {
        if(typeof element === 'undefined'){
            return null;
        }

        var observer = new WebKitMutationObserver(function (mutations) {
            mutations.forEach(mutationCallback);
        });
        observer.observe(element, config);
        return observer;
    }

    function createStyleAttrObserver(element, mutationCallback) {
        var config = { attributes: true, attributeFilter: ["style"] };
        return createObserver(element, mutationCallback, config);
    }

    return {
        createObserver : createObserver,
        createStyleAttrObserver: createStyleAttrObserver
    };
})();

var PriceFilterUtils = (function() {

    function convertToUSD(belPrice) {
        if(typeof belPrice === 'undefined') {
            return belPrice;
        }
        belPrice = removeAllButNumber(belPrice);
        return Math.round(((belPrice / removeAllButNumber(current_exchange_rate))));
    }

    function updateFakeField(fakeField, realField) {
        fakeField.val(convertToUSD(realField.val()));
        fakeField.attr('title',realField.val() + " б.р.");
    }

    function removeAllButNumber(text) {
        return text.replace (/[^\d]/g, '');
    }

    return {
        updateFakeField: updateFakeField,
        removeAllButNumber: removeAllButNumber,
        convertToUSD:convertToUSD
    };

})();

function start() {
    ///////////////

    var priceList = $(".itemList");


    $.fn.exists = function () {
        return this.length !== 0;
    }

    function removeTextFromElement(jqNode) {
        jqNode.contents().filter(function(){
            return this.nodeType === 3;
        }).remove();
    }

    function modifyItemNodeImpl(jqNode) {

        var propPrice = jqNode.find(".prop_price");
        var propPriceParent = propPrice.parent();
        removeTextFromElement(propPriceParent);

        propPrice.each(function(index){

            var context = $(this).children().context;
            var innerHtml = context.innerHTML;
            $(this).attr('title', innerHtml + ' б.р.');
            var belPrice = innerHtml;
            context.innerHTML = (PriceFilterUtils.convertToUSD(belPrice) + " USD");
            if(!(index % 2)) {
                context.innerHTML += " - ";
            }

        });

    }

    function modifyItemNodes() {
        priceList.find(".itemList_item").each(function(){
            modifyItemNodeImpl($(this));
        });
    }

    priceList.arrive('.itemList_item', function(){
        modifyItemNodeImpl($(this));
    });

    modifyItemNodes();

///


    function modifyPriceNodeImpl(jqNode) {
        var blrPrice = jqNode.text();
        jqNode.attr('title', blrPrice);
        jqNode.text(PriceFilterUtils.convertToUSD(PriceFilterUtils.removeAllButNumber(blrPrice)) + ' USD');
    }

    $('td[class="price"]').each(function(){
        modifyPriceNodeImpl($(this));
    });

    $('span[class="price"]').each(function(){
        modifyPriceNodeImpl($(this));
    });
///

////////////////

    var noUiBase =  $('.filter_currency').parent().find('.wrapper_slider').find('.noUi-base');
    var priceSliderLeft = noUiBase.children()[0];
    var priceSliderRight = noUiBase.children()[1];

    ObserverUtils.createStyleAttrObserver(priceSliderLeft, function(mutation){
        PriceFilterUtils.updateFakeField(jPriceFromFieldFake, jPriceFromField);
    });

    ObserverUtils.createStyleAttrObserver(priceSliderRight, function(mutation){
        PriceFilterUtils.updateFakeField(jPriceToFieldFake, jPriceToField);
    });

    $('label[for="2140131888"]').text("Цена (USD):");
    var jPriceFromField = $($('.filter_currency').parent().find('table[class="fields"]').find('td[class="field"]')[0]).find('input');//$('#2140131888');
    jPriceFromField.css({"display":"none"});

    var jPriceFromFieldFake = $('\<input type="text" readonly/>');

    jPriceFromField.after(jPriceFromFieldFake);

    if(jPriceFromField.val() !== "") {
        PriceFilterUtils.updateFakeField(jPriceFromFieldFake, jPriceFromField);
    }

    var jPriceToField = $($('.filter_currency').parent().find('table[class="fields"]').find('td[class="field"]')[1]).find('input');//$('#2140131887');
    jPriceToField.css({"display":"none"});

    var jPriceToFieldFake = $('\<input type="text" readonly/>');
    jPriceToField.after(jPriceToFieldFake);


    if(jPriceToField.val() !== "") {
        PriceFilterUtils.updateFakeField(jPriceToFieldFake, jPriceToField);
    }


////

    $($('div[class="item_summary"]').find('.price').find('.in')[0]).find('p').each(function(){
        var text = $(this).text();
        var numbers = text.split('до');
        var fromPrice = PriceFilterUtils.convertToUSD(PriceFilterUtils.removeAllButNumber(numbers[0]));
        var toPrice = PriceFilterUtils.convertToUSD(PriceFilterUtils.removeAllButNumber(numbers[1]));
        var result = 'от ' + fromPrice + ' до ' + toPrice + ' USD';
        $(this).attr('title', text);
        $(this).text(result);
    });

}













