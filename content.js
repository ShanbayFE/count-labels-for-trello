/* global chrome */
const showHoursCount = () => {
    const arrayMethods = Object.getOwnPropertyNames(Array.prototype);
    const attachArrayMethodsToNodeList = (methodName) => {
        if (methodName !== 'length') {
            NodeList.prototype[methodName] = Array.prototype[methodName];
        }
    };
    arrayMethods.forEach(item => attachArrayMethodsToNodeList(item));

    const listCards = document.querySelectorAll('.list-cards');
    const estimateLabels = listCards.map(list => list.querySelectorAll('.list-card:not(.hide) .card-label-yellow'));
    const actualLabels = listCards.map(list => list.querySelectorAll('.list-card:not(.hide) .card-label-green'));

    const getHourCount = labels => labels.map((label) => {
        const labelsArray = label.map(item => parseFloat(item.innerHTML));
        return labelsArray.length === 0 ? 0 :
            labelsArray.reduce((pre, next) => pre + next);
    });

    const estimateTimeCounts = getHourCount(estimateLabels);
    const actualTimeCounts = getHourCount(actualLabels);

    listCards.map((item, i) => {
        const countContainer = document.createElement('div');
        countContainer.className = 'time-label-count';
        countContainer.innerHTML = `<span class="actual-time">${actualTimeCounts[i]}</span><span class="estimate-time">${estimateTimeCounts[i]}</span>`;

        if (item) {
            const oldCountContainer = item.previousSibling;
            if (oldCountContainer.className === 'time-label-count') {
                item.parentNode.replaceChild(countContainer, oldCountContainer);
            } else {
                item.parentNode.insertBefore(countContainer, item);
            }
        }
    });
};

const formatDividerList = () => {
    $('.list-header-name')
        .filter(function () {
            return $(this).text().trim().toLowerCase().indexOf('divider') !== -1;
        })
        .each(function () {
            $(this)
                .parent().html('')
                .siblings().remove().end()
                .closest('.list-wrapper').addClass('cus-divider');
        });
};

function toggleListCountByConfig(data) {
    const listPanels = document.querySelectorAll('.list');

    listPanels.forEach((panel) => {
        const listHeaderNameDOM = panel.querySelector('.list-header-name');

        if (!listHeaderNameDOM) {
            return;
        }

        let listName = listHeaderNameDOM.innerHTML
            .toLowerCase();
        const result = /\w+/.exec(listName);

        if (!result) {
            return;
        }

        listName = result[0];

        const countInfo = data[listName];

        if (!countInfo) {
            return;
        }

        Object.keys(countInfo).forEach((countName) => {
            const countState = countInfo[countName];
            panel.classList.toggle(`${countName}-hide`, !countState);
        });
    });
}

window.onload = () => {
    setInterval(() => {
        showHoursCount();
        formatDividerList();
    }, 3000);

    chrome.runtime.onMessage.addListener(
        (request /* ,sender ,senderResponse */) => {
            /**
             *  request format:
             *  [
             *      {checkboxName, checkboxVal, checkboxState},
             *  ]
             */
            const { code, data } = request;

            if (code === 2) {
                toggleListCountByConfig(data);
            }
        });


    chrome.runtime.sendMessage({ code: 1 }, (response) => {
        if (!response) {
            return;
        }

        const { code, data } = response;

        if (code === 2) {
            toggleListCountByConfig(data);
        }
    });
};

// setInterval(showHoursCount, 3000);
