/* global chrome */

var config = {
    sprint: { 'estimate-time': true, 'actual-time': false },
    doing: { 'estimate-time': true, 'actual-time': true },
    done: { 'estimate-time': true, 'actual-time': true },
};
const isSupportLocalStorage = !!window.localStorage;
const storageKey = 'trelloConfig';


if (isSupportLocalStorage) {
    const str = localStorage.getItem(storageKey);

    str && (config = JSON.parse(str));
}

/**
 *  save config to storage
 */
function saveChange(name, val, state) { // eslint-disable-line
    config[name][val] = state;

    // 本地存储
    if (isSupportLocalStorage) {
        localStorage.setItem(storageKey, JSON.stringify(config));
    }
}

/**
 *  @param Array|Object msg
 *  {checkboxName, checkboxVal, checkboxState}
 *  or
 *  [{checkboxName, checkboxVal, checkboxState}]
 */
function sendToContextPage(msg) { // eslint-disable-line
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { code: 2, data: msg });
    });
}


chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        if (request.code === 1) {
            sendResponse({ code: 2, data: config });
        }
    });
