'use strict';

const pageTitle = document.getElementsByTagName('h1')[0]; // заголовок страницы из первого h1 элемента
const buttonPlus = document.querySelector('.screen-btn'); // кнопка "+"
const buttonStart = document.getElementsByClassName('handler_btn')[0]; // Кнопка "Рассчитать"
const buttonReset = document.getElementsByClassName('handler_btn')[1]; // Кнопка "Очистить форму"
const otherItemsPercent = document.querySelectorAll('.other-items.percent'); // все формы с процентными сервисами
const otherItemsNumber = document.querySelectorAll('.other-items.number'); // все формы с сервисами по фиксированной цене
const inputRange = document.querySelector('.rollback input'); // ползунок от 0 до 100
const spanRangeValue = document.querySelector('.range-value'); // подпись под ползунком
const showTotalScreen = document.getElementsByClassName('total-input')[0]; // Стоимость вёрстки
const showScreenCount = document.getElementsByClassName('total-input')[1]; // Количество экранов
const showTotalService = document.getElementsByClassName('total-input')[2]; // Стоимость доп. услуг
const showFullPrice = document.getElementsByClassName('total-input')[3]; // Итоговая стоимость
const showFinalProfit = document.getElementsByClassName('total-input')[4]; // Стоимость с учётом отката
let screenBlocks = document.querySelectorAll('.screen');
let screenBlocksSelects = document.querySelectorAll('.screen select');
let screenBlocksInputs = document.querySelectorAll('.screen input');

const appData = {
    screenSelect: false, // выбран тип экрана
    screenInput: false, //заполнение поля ввода количества экрана данного типа
    screenArray: [], // содержит тип экрана и общую стоимость экранов этого типа ( = цена экрана * количество экранов)
    screenCount: 0, // Общее количество экранов в проекте
    servicePercentArray: [], // хранит перечень сервисов, цена которых выражается в процентах от общей стоимости работ
    serviceNumberArray: [], // хранит перечень сервисов, цена которых фиксированная
    totalScreen: 0, // сумму всех экранов
    totalServicePercent: 0, // сумма всех дополнительных сервисов, цена которых выражается в процентах от общей стоимости
    totalServiceNumber: 0, //  сумма всех дополнительных сервисов с фиксированной ценой
    fullPrice: 0, // итоговая стоимость работ ( = сумме всех экранов + учёт процентных сервисов + сервисы с фиксированной ценой)
    rollback: 0, // процент отката заказчику
    finalProfit: 0, // итоговый заработок ( = итоговая стоимость работ - откат)

    toNumber: function (str) {
        return Math.abs(parseFloat(str.trim().split(/\D/).join('')));
    },
    updateStatus: function (element) {
        if (appData.screenSelect && appData.screenInput) {
            element.disabled = false;
            element.classList.remove('disabled');
        } else {
            element.disabled = true;
            element.classList.add('disabled');
        }
    },
    isSelected: function () {
        let temp = true;
        screenBlocksSelects.forEach((item) => {
            if (item.value === undefined) {
                temp = false;
            }
        });
        appData.screenSelect = temp;
        appData.updateStatus(buttonStart);
    },
    isFilled: function () {
        let temp = true;
        screenBlocksInputs.forEach((item) => {
            if (item.value === undefined) {
                temp = false;
            }
        });
        appData.screenInput = temp;
        appData.updateStatus(buttonStart);
    },
    addListenersToForms: function () {
        screenBlocksSelects = document.querySelectorAll('.screen select');
        screenBlocksInputs = document.querySelectorAll('.screen input');
        screenBlocksSelects.forEach((elem) => {
            elem.addEventListener('change', () => {
                appData.isSelected();
            });
        });
        screenBlocksInputs.forEach((elem) => {
            elem.addEventListener('change', () => {
                appData.isFilled();
            });
        });
    },
    init: function () {
        appData.updateStatus(buttonStart);
        appData.addTitle();
        inputRange.addEventListener('input', function (event) {
            appData.rollback = event.target.value;
            spanRangeValue.textContent = event.target.value + '%';
        });
        appData.addListenersToForms();
        buttonPlus.addEventListener('click', appData.addScreenBlock);
        buttonStart.addEventListener('click', appData.start);
    },
    addTitle: function () {
        document.title = pageTitle.textContent;
    },
    addScreenBlock: function () {
        const screenClone = screenBlocks[0].cloneNode(true);
        screenBlocks[screenBlocks.length - 1].after(screenClone);
        appData.screenSelect = false;
        appData.screenInput = false;
        appData.updateStatus(buttonStart);
        screenBlocks = document.querySelectorAll('.screen');
        appData.addListenersToForms();
    },
    start: function () {
        appData.addScreens();
        appData.addServices();
        appData.getScreens();
        appData.getServices();
        appData.getFullPrice();
        appData.getFinalProfit();
        appData.logger();
        appData.showResult();
    },
    addScreens: function () {
        screenBlocks = document.querySelectorAll('.screen');
        appData.screenArray.length = 0;
        screenBlocks.forEach(function (item, index) {
            const select = item.querySelector('select');
            const count = item.querySelector('input');
            appData.screenArray.push({
                id: index,
                name: select.options[select.selectedIndex].textContent,
                count: appData.toNumber(count.value),
                price: appData.toNumber(select.value) * appData.toNumber(count.value),
            });
        });
    },
    addServices: function () {
        otherItemsPercent.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');
            if (check.checked) {
                appData.servicePercentArray[label.textContent] = appData.toNumber(input.value);
            }
        });
        otherItemsNumber.forEach(function (item) {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');
            if (check.checked) {
                appData.serviceNumberArray[label.textContent] = appData.toNumber(input.value);
            }
        });
    },
    getScreens: function () {
        // запрашивает набор однотипных услуг вида Название и Стоимость
        let tempScreen = 0;
        let tempCount = 0;
        for (let key in appData.screenArray) {
            tempScreen += appData.screenArray[key].price;
            tempCount += appData.screenArray[key].count;
        }
        appData.totalScreen = tempScreen;
        appData.screenCount = tempCount;
    },
    getServices: function () {
        // суммирует стоимость всех доп. услуг
        let tempPercent = 0;
        for (let key in appData.servicePercentArray) {
            tempPercent += appData.servicePercentArray[key];
        }
        appData.totalServicePercent = Math.round(appData.totalScreen * (tempPercent / 100));
        let tempNumber = 0;
        for (let key in appData.serviceNumberArray) {
            tempNumber += +appData.serviceNumberArray[key];
        }
        appData.totalServiceNumber = tempNumber;
    },
    getFullPrice: function () {
        // находит итоговую стоимость всего проекта, суммируя базовую цену и цену всех доп услуг.
        appData.fullPrice = appData.totalScreen + appData.totalServicePercent + appData.totalServiceNumber;
    },
    getFinalProfit: function () {
        // итоговый доход после вычета отката
        appData.finalProfit = Math.ceil(appData.fullPrice - appData.fullPrice * (appData.rollback / 100));
    },
    showResult: function () {
        showTotalScreen.value = appData.totalScreen; // Стоимость вёрстки
        showScreenCount.value = appData.screenCount; // Количество экранов
        showTotalService.value = appData.totalServicePercent + appData.totalServiceNumber; // Стоимость доп. услуг
        showFullPrice.value = appData.fullPrice; // Итоговая стоимость
        showFinalProfit.value = appData.finalProfit; // Стоимость с учётом отката
        inputRange.addEventListener('input', function (event) {
            appData.rollback = event.target.value;
            spanRangeValue.textContent = event.target.value + '%';
            appData.getFinalProfit();
            showFinalProfit.value = appData.finalProfit;
        });
    },

    logger: function () {
        console.log(appData);
    },
};
appData.init();
