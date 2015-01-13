$(function () {

  function loadSettings() {
    chrome.storage.sync.get("tutByConverter", function(items) {
      var tutByConverterProp  = items.tutByConverter;
      if (typeof tutByConverterProp === "undefined") {
        tutByConverterProp = false;
      }
      $('#tutByConverterCbx').prop('checked', tutByConverterProp);
    });
  }

  loadSettings();

   function saveSettings() {
     chrome.storage.sync.set({ "tutByConverter" : $('#tutByConverterCbx').prop('checked')}, function () {
          window.close();
     });
   }

  $('#saveSettingsBtn').click(function () {
    saveSettings();
  });

});
