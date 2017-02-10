console.log('background');

chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    chrome.tabs.sendMessage(tabs[0].id, 'adsfasdfasdf', function(response) {
        console.log('阿短发短发短发');
    });
});