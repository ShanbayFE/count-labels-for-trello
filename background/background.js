const supportLocalStorage = window.hasOwnProperty('localStorage');
let allCheckbox = document.querySelectorAll('input[type=checkbox]');
let forEach = (ctx, action) => [].forEach.call(ctx, action);
var config = {
    sprint: {'estimate-time': true, 'actual-time': false},
    doing:  {'estimate-time': true, 'actual-time': true},
    done:   {'estimate-time': true, 'actual-time': true}
};
let storageKey = 'trelloConfig';


if (supportLocalStorage) {
    let str = localStorage.getItem(storageKey);

    str && (config = JSON.parse(str));
}


/**
 *  save config to storage
 */
function saveChange(name, val, state) {
    config[name][val] = state;
  
    // 本地存储
    if (supportLocalStorage) {
        localStorage.setItem(storageKey, JSON.stringify(config));
    }
}

/**
 *  @param Array|Object msg
 *  {checkboxName, checkboxVal, checkboxState}
 *  or 
 *  [{checkboxName, checkboxVal, checkboxState}]
 */
function sendToContextPage(msg) {
    chrome.tabs.query({active:true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {code: 2, data: msg}, function(response) {
            console.log('(context page): Copy that');
        });
    });
}


chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.code === 1) {
            sendResponse({code: 2, data: config})
        }
    }
);