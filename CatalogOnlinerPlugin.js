function CatalogOnlinerPlugin(current_exchange_rate, settings) {

    var PriceFilterUtils = (function () {

        function convertToUSD(belPrice) {
            if (typeof belPrice === 'undefined') {
                return belPrice;
            }
            belPrice = removeAllButNumber(belPrice);
            return Math.round(((belPrice / removeAllButNumber(current_exchange_rate))));
        }

        function convertToBYR(price) {
            return Math.round(((price * removeAllButNumber(current_exchange_rate))));
        }

        function convertCatalogPrice(jNode) {
            var source = jNode.html();

            // if price range
            if(source.indexOf('-') > 0) {
                var arr = source.split('-');
                var originalFromPrice = arr[0].trim();
                var convertedFromPrice = convertToUSD(originalFromPrice);

                var originalToPrice = arr[1].trim().split('&nbsp;руб.')[0];
                var convertedToPrice = convertToUSD(originalToPrice);

                jNode.html(convertedFromPrice + ' - ' + convertedToPrice + '&nbsp;у.е.');
                var tooltipText = originalFromPrice + ' - ' + originalToPrice + ' б.р.';
                tooltipText = replaceAll('руб.','',tooltipText);
                registerTooltip(jNode, tooltipText);
            } else {
                var originalPrice = source.trim().split('&nbsp;руб.')[0];
                var convertedPrice = convertToUSD(originalPrice);
                jNode.html(convertedPrice + '&nbsp;у.е.');
                var tooltipText = originalPrice + ' б.р.';
                tooltipText = replaceAll('руб.','',tooltipText);
                registerTooltip(jNode, tooltipText);
            }

        }

        function convertInsItemPrice(insItem) {
            var value = insItem.nextSibling.nodeValue;

            //14&nbsp;880&nbsp;000 – 16&nbsp;275&nbsp;000 руб.

            value = replaceAll('&nbsp;','',value);

            //14880000 – 16275000 руб.

            var source = value;

            // if price range
            if(source.indexOf('–') > 0) {
                var arr = source.split('–');
                var originalFromPrice = arr[0].trim();
                var convertedFromPrice = convertToUSD(originalFromPrice);

                var originalToPrice = arr[1].trim().split(' руб.')[0];
                var convertedToPrice = convertToUSD(originalToPrice);

                insItem.nextSibling.nodeValue = ' ' + convertedFromPrice + ' - ' + convertedToPrice + ' у.е.';
                registerTooltip(insItem.parent(), originalFromPrice + ' - ' + originalToPrice + ' б.р.');
            } else {
                var originalPrice = source.trim().split(' руб.')[0];
                var convertedPrice = convertToUSD(originalPrice);
                insItem.nextSibling.nodeValue = ' ' + convertedPrice + ' у.е.';
                registerTooltip(insItem.parent(), originalPrice + ' б.р.');
            }

        }

        function convertProductDetailsPrice(jNode) {
            var source = null;
            try{
                source = jNode.html();
            } catch (e) {
                console.log(e);
            }

            if(typeof source == 'undefined') {
               return;
            }

            // if price range
            if(source.indexOf('–') > 0) {
                var arr = source.split('–');
                var originalFromPrice = arr[0].trim();
                var convertedFromPrice = convertToUSD(originalFromPrice);

                var originalToPrice = arr[1].trim().split('<small>')[0];
                var convertedToPrice = convertToUSD(originalToPrice);

                jNode.html(convertedFromPrice + ' - ' + convertedToPrice + '&nbsp;у.е.');
                var toolTipText = originalFromPrice + ' - ' + originalToPrice + ' б.р.';
                toolTipText = replaceAll('<small>','',toolTipText);
                toolTipText = replaceAll('</small>','',toolTipText);
                toolTipText = replaceAll('руб.','',toolTipText);
                registerTooltip(jNode, toolTipText);
            } else {
                var originalPrice = source.trim().split('&nbsp;руб.')[0];
                var convertedPrice = convertToUSD(originalPrice);
                jNode.html(convertedPrice + '&nbsp;у.е.');
                var toolTipText = originalPrice + ' б.р.';
                toolTipText = replaceAll('<small>','',toolTipText);
                toolTipText = replaceAll('</small>','',toolTipText);
                toolTipText = replaceAll('руб.','',toolTipText);
                registerTooltip(jNode, toolTipText);
            }
        }


        function replaceAll(find, replace, str) {
            return str.replace(new RegExp(find, 'g'), replace);
        }

        function registerTooltip(jqNode, tooltipText){
            try{
                jqNode.tooltipster('destroy');
            } catch (e) {

            }
            tooltipText = replaceAll('&nbsp;',' ',tooltipText);
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

        function commafy( num ) {
            var str = num.toString().split('.');
            if (str[0].length >= 5) {
                str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, '$1 ');
            }
            if (str[1] && str[1].length >= 5) {
                str[1] = str[1].replace(/(\d{3})/g, '$1 ');
            }
            return str.join('.');
        }

        function convertToByrAndFormat(val) {
            return PriceFilterUtils.commafy(PriceFilterUtils.convertToBYR(val)) + ' б.р.';
        }

        // 2867&nbsp;500&nbsp;<small>руб.</small>
        function convertCurrencyPrimary(jqNode) {
            var source = jqNode.html();

            source = replaceAll('&nbsp;','',source);
            var arr = source.split('<');
            var originalPrice = arr[0];
            var convertedPrice = convertToUSD(originalPrice);

            jqNode.html(convertedPrice + ' у.е.');
            jqNode.addClass('primaryMarker');
            registerTooltip(jqNode, commafy(originalPrice) + ' б.р.');
            jqNode.tooltipster();
        }

        return {
            updateFakeField: updateFakeField,
            removeAllButNumber: removeAllButNumber,
            convertToUSD: convertToUSD,
            convertToBYR:convertToBYR,
            registerTooltip:registerTooltip,
            turnOnTooltipster:turnOnTooltipster,
            convertCatalogPrice:convertCatalogPrice,
            commafy:commafy,
            convertToByrAndFormat:convertToByrAndFormat,
            convertProductDetailsPrice:convertProductDetailsPrice,
            convertCurrencyPrimary:convertCurrencyPrimary,
            convertInsItemPrice:convertInsItemPrice
        };

    })();


    function run() {

        $(document).ready(function() {
            var jPriceFromField = $('#smth2');
            var jPriceToField = $('#smth3');
            jPriceFromField.css({"display": "none"});
            jPriceToField.css({"display": "none"});

            var jPriceFromFieldFake = $('\<input type="text" size="4" maxlength="5" />');
            jPriceFromField.after(jPriceFromFieldFake);


            var jPriceToFieldFake = $('\<input type="text" size="4" maxlength="5"/>');
            jPriceToField.after(jPriceToFieldFake);
            try{
            $(jPriceFromFieldFake)[0].nextSibling.nodeValue = " ";
            $(jPriceToFieldFake)[0].nextSibling.nodeValue  = " у.е. ";
            } catch(e){}

            if(jPriceFromField.val() > 0) {
                jPriceFromFieldFake.val(PriceFilterUtils.convertToUSD(jPriceFromField.val()));
            }

            if(jPriceToField.val() > 0) {
                jPriceToFieldFake.val(PriceFilterUtils.convertToUSD(jPriceToField.val()));
            }

            PriceFilterUtils.registerTooltip(jPriceFromFieldFake, PriceFilterUtils.convertToByrAndFormat(jPriceFromFieldFake.val()));

            jPriceFromFieldFake.on('keyup', function(){
                PriceFilterUtils.registerTooltip(jPriceFromFieldFake, PriceFilterUtils.convertToByrAndFormat(jPriceFromFieldFake.val()));
                jPriceFromFieldFake.tooltipster();
                jPriceFromFieldFake.tooltipster('show', function(){});
            });

            jPriceFromFieldFake.on('blur', function(){
                jPriceFromFieldFake.tooltipster('hide', function(){});
            });

            PriceFilterUtils.registerTooltip(jPriceToFieldFake, PriceFilterUtils.convertToByrAndFormat(jPriceToFieldFake.val()));

            jPriceToFieldFake.on('keyup', function(){
                PriceFilterUtils.registerTooltip(jPriceToFieldFake, PriceFilterUtils.convertToByrAndFormat(jPriceToFieldFake.val()));
                jPriceToFieldFake.tooltipster();
                jPriceToFieldFake.tooltipster('show', function(){});
            });

            jPriceToFieldFake.on('blur', function(){
                jPriceToFieldFake.tooltipster('hide', function(){});
            });




            $('input[name="search"]').on('click', function () {
                var fromBYRprice = PriceFilterUtils.convertToBYR(jPriceFromFieldFake.val());
                var toBYRprice = PriceFilterUtils.convertToBYR(jPriceToFieldFake.val());

                jPriceFromField.val(fromBYRprice);
                jPriceToField.val(toBYRprice);
            });

            $('div.pprice').each(function(){
                PriceFilterUtils.convertCatalogPrice($(this));
            });

            $('.pgprice').find('a').each(function(){
                PriceFilterUtils.convertCatalogPrice($(this));
            });

            var b_offers_desc__info_sub = $('div.b-offers-desc__info-sub');
            var b_offers_desc__info_sub_href = b_offers_desc__info_sub.find('a:first');
            if(b_offers_desc__info_sub_href.length == 0) {
                PriceFilterUtils.convertProductDetailsPrice(b_offers_desc__info_sub);
            } else {
                PriceFilterUtils.convertProductDetailsPrice(b_offers_desc__info_sub_href);
            }



            $('span.product-aside__price--primary').each(function() {
                PriceFilterUtils.convertCatalogPrice($(this));
            });



            $('span.item-i').find('ins').each(function(){
                // TODO
                try {
                    PriceFilterUtils.convertInsItemPrice($(this)[0]);
                } catch(e) {}
            });


                $(document).arrive('a.js-currency-primary', function() {
                    PriceFilterUtils.convertCurrencyPrimary($(this));
                });

            PriceFilterUtils.turnOnTooltipster();
        });

    }

    return {
        run: run
    };

}
