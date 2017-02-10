const forEach = (ctx, fun) => [].forEach.call(ctx, fun);

const showHoursCount = () => {
    const arrayMethods = Object.getOwnPropertyNames( Array.prototype );
    const attachArrayMethodsToNodeList = (methodName) => {
      if(methodName !== "length") {
        NodeList.prototype[methodName] = Array.prototype[methodName];
      }
    };
    arrayMethods.forEach((item) => attachArrayMethodsToNodeList(item));

    const listCards = document.querySelectorAll('.list-cards');
    const estimateLabels = listCards.map((list) => list.querySelectorAll('.list-card:not(.hide) .card-label-yellow'));
    const actualLabels = listCards.map((list) => list.querySelectorAll('.list-card:not(.hide) .card-label-green'));

    const getHourCount = (labels) => labels.map((label) => {
        const labelsArray = label.map((item) => parseFloat(item.innerHTML));
        return labelsArray.length === 0 ? 0 :
            labelsArray.reduce((pre, next) => pre + next);
    });

    const estimateTimeCounts = getHourCount(estimateLabels);
    const actualTimeCounts = getHourCount(actualLabels);

    listCards.map((item, i) => {
        const countContainer = document.createElement('div');
        countContainer.className = 'time-label-count';
        countContainer.innerHTML = `<span class="actual-time">${actualTimeCounts[i]}</span><span class="estimate-time">${estimateTimeCounts[i]}</span>`;

        if (!!item) {
            const oldCountContainer = item.previousSibling;
            if (oldCountContainer.className === 'time-label-count') {
                item.parentNode.replaceChild(countContainer, oldCountContainer);
            } else {
                item.parentNode.insertBefore(countContainer, item);
            }
        }
    });
};

const toggleCountAbountList = (listPanel, counterName, bool) => {
    listPanel.classList.toggle(`${counterName}-hide`, bool);
};

window.onload = () => showHoursCount();

chrome.runtime.onMessage.addListener(
    function (request, sender, senderResponse) {
        /**
         *  request format:
         *  [
         *      {checkboxName, checkboxVal, checkboxState},
         *  ]
         */
         let {code, data} = request

        if (code === 2) {
            let listPanels = document.querySelectorAll('.list');

            listPanels.forEach(panel => {
                let listName = panel.querySelector('.list-header-name').innerHTML
                    .toLowerCase();
                let result = /\w+/.exec(listName);

                if (!result) {
                    return;
                }

                listName = result[0];

                data
                    .filter(checkbox => checkbox.checkboxName === listName)
                    .forEach(checkbox => {
                        let {checkboxName, checkboxVal, checkboxState} = checkbox;

                        panel.classList.toggle(`${checkboxVal}-hide`, !checkboxState)
                    });
            });
        }
    }
);


// chrome.runtime.sendMessage({code: 1} , function(response) {

// })

setInterval(showHoursCount, 3000);



