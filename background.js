////////////////

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

    function updateFakeField(fakeField, realField) {
        fakeField.val(convertToUSD(realField.val()));
        fakeField.attr('title',realField.val() + " б.р.");
    }

    return {
        updateFakeField: updateFakeField
    };

})();

///////////////

var priceList = $(".itemList");
var current_exchange_rate = 13800;

$.fn.exists = function () {
    return this.length !== 0;
}

function removeTextFromElement(jqNode) {
   jqNode.contents().filter(function(){
    return this.nodeType === 3;
   }).remove();
}

function convertToUSD(belPrice) {
    belPrice = belPrice.replace(/\s/g, '');
    return Math.round(((belPrice / current_exchange_rate)));
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
     context.innerHTML = (convertToUSD(belPrice) + " USD");
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

    jqNode.text('ot 1 666 666 р.б.');

}
//$('td[class="price"]')
/*
$('.item_table').arrive('td[class="price"]', function(){
    modifyPriceNodeImpl($(this));
});
*/

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
var jPriceFromField = $('#2140131888');
jPriceFromField.css({"display":"none"});

var jPriceFromFieldFake = $('\<input type="text" readonly/>');

jPriceFromField.after(jPriceFromFieldFake);

if(jPriceFromField.val() !== "") {
    PriceFilterUtils.updateFakeField(jPriceFromFieldFake, jPriceFromField);
}

var jPriceToField = $('#2140131887');
jPriceToField.css({"display":"none"});

var jPriceToFieldFake = $('\<input type="text" readonly/>');
jPriceToField.after(jPriceToFieldFake);


if(jPriceToField.val() !== "") {
    PriceFilterUtils.updateFakeField(jPriceToFieldFake, jPriceToField);
}







/*var code = function() {

    var current_exchange_rate = 13800;

    function convertToUSD(belPrice) {
        belPrice = belPrice.replace(/\s/g, '');
        return Math.round(((belPrice / current_exchange_rate)));
    }


};

var script = document.createElement('script');
script.textContent = '(' + code + ')()';
(document.head||document.documentElement).appendChild(script);
script.parentNode.removeChild(script);*/







/*function showTooltip(value) {
  var currentFromValue = from.val();
  if(oldFromValue === currentFromValue) {

  } else {

    from.tooltip("close");
    oldFromValue = currentFromValue;
    from.attr('title', currentFromValue + " USD");

    from.tooltip("open");
  }
}*/













