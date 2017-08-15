/* global chrome */
const arrayMethods = Object.getOwnPropertyNames(Array.prototype);
const attachArrayMethodsToNodeList = (methodName) => {
    if (methodName !== 'length') {
        NodeList.prototype[methodName] = Array.prototype[methodName];
    }
};
arrayMethods.forEach(item => attachArrayMethodsToNodeList(item));

const getHourCount = (labels, sumToggle) => labels.map((label) => {
    const labelsArray = label.map(item => {
        let memberNum = item.parentNode.parentNode.querySelectorAll('.list-card-members .member').length;
        if (memberNum === 0) {
            memberNum = 1;
        }
        return sumToggle ? parseFloat(item.innerHTML) * memberNum : parseFloat(item.innerHTML);
    });
    return labelsArray.length === 0 ? 0 :
        labelsArray.reduce((pre, next) => pre + next);
});

const showHoursCount = (sumToggle = true) => {
    const listCards = document.querySelectorAll('.list-cards');
    const estimateLabels = listCards.map(list => list.querySelectorAll('.list-card:not(.hide) .card-label-yellow'));
    const actualLabels = listCards.map(list => list.querySelectorAll('.list-card:not(.hide) .card-label-green'));

    const estimateTimeCounts = getHourCount(estimateLabels, sumToggle);
    const actualTimeCounts = getHourCount(actualLabels, sumToggle);

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
    let sumToggle = true;

    setInterval(() => {
        showHoursCount(sumToggle);
        formatDividerList();
    }, 3000);

    chrome.storage.local.get({ trelloConfig: {} }, (result) => {
        toggleListCountByConfig(result.trelloConfig);
        sumToggle = result.trelloConfig.sumToggle.enable;
        showHoursCount(sumToggle);
        formatDividerList();
    });

    chrome.storage.onChanged.addListener((changes) => {
        if (changes.trelloConfig) {
            toggleListCountByConfig(changes.trelloConfig.newValue);
            sumToggle = changes.trelloConfig.newValue.sumToggle.enable;
            showHoursCount(sumToggle);
            formatDividerList();
        }
    });
};

// setInterval(showHoursCount, 3000);
