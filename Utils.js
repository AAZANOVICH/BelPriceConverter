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

