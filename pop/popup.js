/* global chrome */
const ext = chrome.extension.getBackgroundPage();

const forEach = (ctx, action) => [].forEach.call(ctx, action);

function initCheckboxs(config) {
//     var config = {
//     sprint: {'estimate-time': true, 'actual-time': false},
//     doing:  {'estimate-time': true, 'actual-time': false},
//     done:   {'estimate-time': true, 'actual-time': false}
// };
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

    bindEvents(); // eslint-disable-line
}

function bindEvents() {
    document.body.addEventListener('change', (event) => {
        const target = event.target;
        const checkboxName = target.name;
        const checkboxVal = target.value;
        const checkboxState = target.checked;

        ext.saveChange(checkboxName, checkboxVal, checkboxState);
        ext.sendToContextPage({ [checkboxName]: { [checkboxVal]: checkboxState } });
    });
}

initCheckboxs(ext.config);
