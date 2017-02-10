const ext = chrome.extension.getBackgroundPage();

let allCheckbox = document.querySelectorAll('input[type=checkbox]');
let forEach = (ctx, action) => [].forEach.call(ctx, action);


function checkboxsInit(config) {
//     var config = {
//     sprint: {'estimate-time': true, 'actual-time': false},
//     doing:  {'estimate-time': true, 'actual-time': false},
//     done:   {'estimate-time': true, 'actual-time': false}
// };
    let configK = Object.keys(config);

    configK.forEach(k => {
        const vals = config[k];
        const checkboxs = document.querySelectorAll(`input[name=${k}]`);

        forEach(checkboxs, checkbox => {
            const val = checkbox.value;

            checkbox.checked = config[k][val] ;
        });
    });

    eventListen();
}

function eventListen() {
    document.body.addEventListener('change', (event) => {
        const target = event.target;
        const checkboxName = target.name;
        const checkboxVal = target.value;
        let checkboxState = target.checked;

        /**
         *  TODO: send change to contextPage
         */
        console.log(`name: ${checkboxName}, val: ${checkboxVal}, state: ${checkboxState}`)

        ext.saveChange(checkboxName, checkboxVal, checkboxState);
        ext.sendToContextPage({[checkboxName]: {[checkboxVal]: checkboxState}});
    });
}

checkboxsInit(ext.config);