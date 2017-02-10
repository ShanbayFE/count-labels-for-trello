const supportLocalStorage = window.hasOwnProperty('localStorage');
let allCheckbox = document.querySelectorAll('input[type=checkbox]');
let forEach = (ctx, action) => [].forEach.call(ctx, action);
let config = {
    sprint: ['estimate-time'],
    doing:  ['estimate-time', 'actual-time'],
    done:   ['estimate-time', 'actual-time']
};
let storageKey = 'trelloConfig';


if (supportLocalStorage) {
    let str = localStorage.getItem(storageKey);

    str && (config = JSON.parse(str));
}

/**
 *   初始化 config, from storage
 */
function init(config) {
    checkboxsInit(config);
    sendToContextPage(
        transformConfig2Msg(config)
    );
    eventListen();
}

/**
 * checkbox init
 */
function checkboxsInit(config) {
    let configK = Object.keys(config);

    configK.forEach(k => {
        const vals = config[k];
        const checkboxs = document.querySelectorAll(`input[name=${k}]`);

        forEach(checkboxs, checkbox => {
            const val = checkbox.value;

            checkbox.checked = vals.indexOf(val) !== -1;
        });
    });
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

        saveChange(checkboxName, checkboxVal, checkboxState);
        sendToContextPage({checkboxName, checkboxVal, checkboxState});
    });
}


/**
 *  save config to storage
 */
function saveChange(name, val, state) {
    let vals = config[name];
    let index = vals.indexOf(val);

    if (state) {
        (index === -1) && vals.push(val);
    }  else {
        (index !== -1) && vals.splice(index, 1);
    }

    // 本地存储
    if (supportLocalStorage) {
        localStorage.setItem(storageKey, JSON.stringify(config));
    }
}


function transformConfig2Msg(config){
    let result = [];

    for (let [k, v] of Object.entries(config)) {
        if (!v.length) {
            continue;
        }

        v.forEach(checkedVal => {
            result.push({
                checkboxName: k,
                checkboxVal: checkedVal,
                checkboxState: true
            });
        })
        
    }

    return result;
}

/**
 *  @param Array|Object msg
 *  {checkboxName, checkboxVal, checkboxState}
 *  or 
 *  [{checkboxName, checkboxVal, checkboxState}]
 */
function sendToContextPage(msg) {
    msg = [].concat(msg);

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {code: 2, data: msg}, function(response) {
            console.log('(context page): Copy that');
        });
    });
}


init(config);