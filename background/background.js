chrome.storage.local.get({ trelloConfig: null }, (result) => {
    if (!result.trelloConfig) {
        chrome.storage.local.set({
            trelloConfig: {
                doing: { 'actual-time': true, 'estimate-time': true },
                done: { 'actual-time': true, 'estimate-time': true },
                sprint: { 'actual-time': false, 'estimate-time': true },
                sumToggle: { 'enable': true },
            },
        });
    }
});
