/* global chrome */

window.config = {
    sprint: { 'estimate-time': false, 'actual-time': false },
    doing: { 'estimate-time': false, 'actual-time': false },
    done: { 'estimate-time': false, 'actual-time': false },
};

const isSupportLocalStorage = !!window.localStorage;
const storageKey = 'trelloConfig';

if (isSupportLocalStorage) {
    const str = localStorage.getItem(storageKey);
    if (str) window.config = JSON.parse(str);
}

/**
 *  save config to storage
 */
function saveChange(name, val, state) { // eslint-disable-line
    window.config[name][val] = state;
    // 本地存储
    if (isSupportLocalStorage) {
        localStorage.setItem(storageKey, JSON.stringify(window.config));
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.code === 1) {
        sendResponse({ code: 2, data: window.config });
    }
});
