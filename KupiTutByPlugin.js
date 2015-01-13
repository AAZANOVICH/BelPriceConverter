var ObserverUtils = (function () {

    function createObserver(element, mutationCallback, config) {
        if (typeof element === 'undefined') {
            return null;
        }

        var observer = new WebKitMutationObserver(function (mutations) {
            mutations.forEach(mutationCallback);
        });
        observer.observe(element, config);
        return observer;
    }

    function createStyleAttrObserver(element, mutationCallback) {
        var config = {attributes: true, attributeFilter: ["style"]};
        return createObserver(element, mutationCallback, config);
    }

    return {
        createObserver: createObserver,
        createStyleAttrObserver: createStyleAttrObserver
    };
})();




function KupiTutByPlugin(current_exchange_rate, settings) {

    var PriceFilterUtils = (function () {

        function convertToUSD(belPrice) {
            if (typeof belPrice === 'undefined') {
                return belPrice;
            }
            belPrice = removeAllButNumber(belPrice);
            return Math.round(((belPrice / removeAllButNumber(current_exchange_rate))));
        }

        function registerTooltip(jqNode, tooltipText){
            jqNode.attr('title', tooltipText);
            jqNode.addClass('tooltip-marker');
        }

        function turnOnTooltipster() {
            $('.tooltip-marker').tooltipster();
        }


        function updateFakeField(fakeField, realField) {
            fakeField.val(convertToUSD(realField.val()));
            registerTooltip(fakeField, realField.val() + " б.р.");
        }

        function removeAllButNumber(text) {
            return text.replace(/[^\d]/g, '');
        }

        return {
            updateFakeField: updateFakeField,
            removeAllButNumber: removeAllButNumber,
            convertToUSD: convertToUSD,
            registerTooltip:registerTooltip,
            turnOnTooltipster:turnOnTooltipster
        };

    })();


    function run() {

        $(document).arrive('div.convert_wrapper',function() {
            if(settings.tutByConverter) {
                $(this).remove();
            }
        });

        $(document).ready(function() {

            var priceList = $(".itemList");

            function removeTextFromElement(jqNode) {
                jqNode.contents().filter(function () {
                    return this.nodeType === 3;
                }).remove();
            }

            function modifyItemNodeImpl(jqNode) {

                var propPrice = jqNode.find(".prop_price");
                var propPriceParent = propPrice.parent();
                removeTextFromElement(propPriceParent);

                propPrice.each(function (index) {

                    var context = $(this).children().context;
                    var innerHtml = context.innerHTML;
                    PriceFilterUtils.registerTooltip($(this), innerHtml + ' б.р.');
                    var belPrice = innerHtml;
                    context.innerHTML = (PriceFilterUtils.convertToUSD(belPrice) + " у.е.");
                    if (!(index % 2) && propPrice.length > 1) {
                        context.innerHTML += " - ";
                    }

                });

            }

            function modifyItemNodes() {
                priceList.find(".itemList_item").each(function () {
                    modifyItemNodeImpl($(this));
                });
            }

            priceList.arrive('.itemList_item', function () {
                modifyItemNodeImpl($(this));
            });

            modifyItemNodes();

            function modifyPriceNodeImpl(jqNode) {
                modifyPriceNodeWithPrefixImpl(jqNode, '');
            }

            function modifyPriceNodeWithPrefixImpl(jqNode, prefix) {

                var blrPrice = jqNode.text();
                // if already modified -> skip
                if(blrPrice.indexOf('у') > 0) {
                    return;
                }
                PriceFilterUtils.registerTooltip(jqNode,blrPrice);
                jqNode.text(prefix + PriceFilterUtils.convertToUSD(PriceFilterUtils.removeAllButNumber(blrPrice)) + ' у.е.');
            }

            $('td[class="price"]').each(function () {
                modifyPriceNodeImpl($(this));
            });

            $('span[class="price"]').each(function () {
                modifyPriceNodeImpl($(this));
            });

            $('div[class="cItems"]').find('div[class="price"]').each(function () {
                modifyPriceNodeWithPrefixImpl($(this), 'от ');
            });

            $('#credit_compare').find('p[class="big"]').each(function () {
                modifyPriceNodeImpl($(this));
            });

            $('.wardrobe_list').find('div[class="price"]').each(function () {
                modifyPriceNodeWithPrefixImpl($(this), 'от ');
            });

            var cItems_rowField = $('div[class="cItems_row"]');
            cItems_rowField.find('big[class="prop_price"]').each(function () {
                modifyPriceNodeImpl($(this));
            });

            cItems_rowField.find('div[class="price"]').each(function () {
                modifyPriceNodeWithPrefixImpl($(this), 'от ');
            });

            var filterCurrencyField = $('.filter_currency');
            var noUiBase = filterCurrencyField.parent().find('.wrapper_slider').find('.noUi-base');
            var priceSliderLeft = noUiBase.children()[0];
            var priceSliderRight = noUiBase.children()[1];


            ObserverUtils.createStyleAttrObserver(priceSliderLeft, function (mutation) {
                PriceFilterUtils.updateFakeField(jPriceFromFieldFake, jPriceFromField);
            });

            ObserverUtils.createStyleAttrObserver(priceSliderRight, function (mutation) {
                PriceFilterUtils.updateFakeField(jPriceToFieldFake, jPriceToField);
            });

            $('div[class="filter_currency"]').parent().find('#brandTitle').find('label').text("Цена (у.е.):");
            var jPriceFromField = $(filterCurrencyField.parent().find('table[class="fields"]').find('td[class="field"]')[0]).find('input');
            jPriceFromField.css({"display": "none"});

            var jPriceFromFieldFake = $('\<input type="text" readonly/>');

            jPriceFromField.after(jPriceFromFieldFake);

            if (jPriceFromField.val() !== "") {
                PriceFilterUtils.updateFakeField(jPriceFromFieldFake, jPriceFromField);
            }

            var jPriceToField = $(filterCurrencyField.parent().find('table[class="fields"]').find('td[class="field"]')[1]).find('input');
            jPriceToField.css({"display": "none"});

            var jPriceToFieldFake = $('\<input type="text" readonly/>');
            jPriceToField.after(jPriceToFieldFake);


            if (jPriceToField.val() !== "") {
                PriceFilterUtils.updateFakeField(jPriceToFieldFake, jPriceToField);
            }


            $($('div[class="item_summary"]').find('.price').find('.in')[0]).find('p').each(function () {
                var text = $(this).text();
                var numbers = text.split('до');
                var fromPrice = PriceFilterUtils.convertToUSD(PriceFilterUtils.removeAllButNumber(numbers[0]));
                var toPrice = PriceFilterUtils.convertToUSD(PriceFilterUtils.removeAllButNumber(numbers[1]));
                var result = 'от ' + fromPrice + ' до ' + toPrice + ' у.е.';
                PriceFilterUtils.registerTooltip($(this),text);
                $(this).text(result);
            });

            PriceFilterUtils.turnOnTooltipster();

        });
    }

    return {
        run: run
    };

}
