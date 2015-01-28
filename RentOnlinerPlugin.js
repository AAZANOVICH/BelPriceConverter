function RentOnlinerPlugin(current_exchange_rate, settings) {

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



    var PriceFilterUtils = (function () {

        function convertToUSD(belPrice) {
            if (typeof belPrice === 'undefined') {
                return belPrice;
            }
            belPrice = removeAllButNumber(belPrice);
            return Math.round(((belPrice / removeAllButNumber(current_exchange_rate))));
        }

        function registerTooltip(jqNode, tooltipText){
            try{
                jqNode.tooltipster('destroy');
            } catch (e) {

            }

            jqNode.attr('title', tooltipText);
            jqNode.addClass('tooltip-marker');
        }

        function turnOnTooltipster() {
            $('.tooltip-marker').tooltipster();
        }


        function updateFakeField(fakeField, realField) {
            var byrValue = realField.val();
            fakeField.val(convertToUSD(byrValue));
            registerTooltip(fakeField, byrValue + " б.р.");
            turnOnTooltipster();

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

    function modifyPriceNodeWithCurrency(price,currency) {
        modifyPriceNode(price);
        currency.innerHTML = 'у.е.';
    }

    function modifyPriceNode(price) {
        var originalPrice = price.innerText;
        if(typeof originalPrice == 'undefined') {
            originalPrice = price.text();
            price.text(PriceFilterUtils.convertToUSD(originalPrice));
        } else {
            price.innerHTML = PriceFilterUtils.convertToUSD(originalPrice);
        }

        PriceFilterUtils.registerTooltip($(price), originalPrice + ' б.р.')
        PriceFilterUtils.turnOnTooltipster();
    }

    function run() {

        $(document).ready(function() {

            var jPriceFromField = $('#search-filter-price-from');
            jPriceFromField.css({"display": "none"});

            var jPriceFromFieldFake = $('\<input type="text" class="filter__input filter__item-inner" readonly/>');
            jPriceFromField.after(jPriceFromFieldFake);
            PriceFilterUtils.updateFakeField(jPriceFromFieldFake, jPriceFromField);

            var jPriceToField = $('#search-filter-price-to');
            jPriceToField.css({"display": "none"});

            var jPriceToFieldFake = $('\<input type="text" class="filter__input filter__item-inner" readonly/>');
            jPriceToField.after(jPriceToFieldFake);
            PriceFilterUtils.updateFakeField(jPriceToFieldFake, jPriceToField);


            $(document).arrive('span.classified__price',function() {
                var spanPriceChildren = $(this).children();
                var price = spanPriceChildren[0];
                var currency =  spanPriceChildren[1];

                modifyPriceNodeWithCurrency(price,currency);
            });


            var slider = $('#search-filter-price-slider');

            ObserverUtils.createStyleAttrObserver(slider.find('div.noUi-connect').get(0), function (mutation) {
                PriceFilterUtils.updateFakeField(jPriceFromFieldFake, jPriceFromField);
            });

            ObserverUtils.createStyleAttrObserver(slider.find('div.noUi-background').get(0), function (mutation) {
                PriceFilterUtils.updateFakeField(jPriceToFieldFake, jPriceToField);
            });

            var barItemPrice = $('div.apartment-bar__item_price');
            var bannerPriceValueKey = barItemPrice.find('div.apartment-bar__value_key');
            modifyPriceNode(bannerPriceValueKey);
            barItemPrice.find('div.apartment-bar__value').each(function(index){
                if(index > 0) {
                    $(this).text($(this).text().replace('руб', 'у.е'));
                }
            });

            $('div.filter__row-title').text('Цена, у.е.');
            PriceFilterUtils.turnOnTooltipster();
        });

    }

    return {
        run: run
    };

}