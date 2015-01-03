/**********************************************************************
*  Copyright (C) 2014 by a.azanovich@gmail.com
*  All rights reserved.
*
**********************************************************************/


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action == "show") {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.pageAction.show(tabs[0].id);
        });
    }
});








