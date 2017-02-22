/* global chrome */
const forEach = (ctx, action) => [].forEach.call(ctx, action);

function saveChange(name, val, state) {
    window.config[name][val] = state;
    chrome.storage.local.set({
        trelloConfig: window.config,
    });
}

function bindEvents() {
    document.body.addEventListener('change', (event) => {
        const target = event.target;
        const checkboxName = target.name;
        const checkboxVal = target.value;
        const checkboxState = target.checked;

        saveChange(checkboxName, checkboxVal, checkboxState);
    });
}

function initCheckboxs(config) {
    if (config) {
        Object.keys(config).forEach((k) => {
            const checkboxs = document.querySelectorAll(`input[name=${k}]`);

            forEach(checkboxs, (_checkbox) => {
                const checkbox = _checkbox;
                const val = checkbox.value;
                checkbox.checked = config[k][val];
            });
        });
    }

    bindEvents();
}

chrome.storage.local.get({ trelloConfig: null }, (result) => {
    window.config = result.trelloConfig;
    initCheckboxs(window.config);
});
