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
        const labelsArray = label.map(item => {
            let memberNum = item.parentNode.parentNode.querySelectorAll('.list-card-members .member').length;
            if (memberNum === 0) {
                memberNum = 1;
            }
            return parseFloat(item.innerHTML) * memberNum;
        });
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

    chrome.storage.local.get({ trelloConfig: {} }, (result) => {
        toggleListCountByConfig(result.trelloConfig);
    });

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.trelloConfig) {
            toggleListCountByConfig(changes.trelloConfig.newValue);
        }
    });
};

// setInterval(showHoursCount, 3000);
