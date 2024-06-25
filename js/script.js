'use strict';

const pageTitle = document.getElementsByTagName('h1')[0]; // заголовок страницы из первого h1 элемента
const buttonPlus = document.querySelector('.screen-btn'); // кнопка "+"
const buttonStart = document.getElementById('start'); // Кнопка "Рассчитать"
const buttonReset = document.getElementById('reset'); // Кнопка "Очистить форму"
const otherItemsPercent = document.querySelectorAll('.other-items.percent'); // все формы с процентными сервисами
const otherItemsNumber = document.querySelectorAll('.other-items.number'); // все формы с сервисами по фиксированной цене
const inputRange = document.querySelector('.rollback input'); // ползунок от 0 до 100
const spanRangeValue = document.querySelector('.range-value'); // подпись под ползунком
const showTotalScreen = document.getElementsByClassName('total-input')[0]; // Стоимость вёрстки
const showScreenCount = document.getElementsByClassName('total-input')[1]; // Количество экранов
const showTotalService = document.getElementsByClassName('total-input')[2]; // Стоимость доп. услуг
const showFullPrice = document.getElementsByClassName('total-input')[3]; // Итоговая стоимость
const showFinalProfit = document.getElementsByClassName('total-input')[4]; // Стоимость с учётом отката
const screenBlocks = document.getElementsByClassName('screen');
let screenBlocksSelects = document.querySelectorAll('.screen select');
let screenBlocksInputs = document.querySelectorAll('.screen input');

const appData = {
    screenSelect: false, // выбран тип экрана
    screenInput: false, //заполнение поля ввода количества экрана данного типа
    screenArray: [], // содержит тип экрана и общую стоимость экранов этого типа ( = цена экрана * количество экранов)
    screenCount: 0, // Общее количество экранов в проекте
    totalScreen: 0, // сумму всех экранов
    servicePercentArray: [], // хранит перечень сервисов, цена которых выражается в процентах от общей стоимости работ
    serviceNumberArray: [], // хранит перечень сервисов, цена которых фиксированная
    totalServicePercent: 0, // сумма всех дополнительных сервисов, цена которых выражается в процентах от общей стоимости
    totalServiceNumber: 0, //  сумма всех дополнительных сервисов с фиксированной ценой
    fullPrice: 0, // итоговая стоимость работ ( = сумме всех экранов + учёт процентных сервисов + сервисы с фиксированной ценой)
    rollback: 0, // процент отката заказчику
    finalProfit: 0, // итоговый заработок ( = итоговая стоимость работ - откат)

    toInt: function (str) { return Math.abs(parseInt(str.trim().split(/\D/).join(''))) },

    toDisplay: function (elems, value) {
        value = value || "block";  // Если функцию вызвать только с одним аргументом, второй будет "block"
        if (elems instanceof HTMLElement) {   // Если elems - один HTML-элемент
            elems.style.display = value;      // изменится свойство элемента и выполнение функции прервется из-за return.
            return;
        };
        for (let i = 0; i < elems.length; i++) { // А можно передать список элементов и одним вызовом скрыть все.
            elems[i].style.display = value;
        };
    },
    toUncheck: function (elems) {
        if (elems instanceof HTMLElement) {   // Если elems - один HTML-элемент
            elems.querySelector('input[type=checkbox]').checked = false;   // изменится свойство элемента и выполнение функции прервется из-за return.
            return;
        };
        for (let i = 0; i < elems.length; i++) { // А можно передать список элементов и одним вызовом скрыть все.
            elems[i].querySelector('input[type=checkbox]').checked = false;
        };
    },
    toClearValue: function (elems) {
        if (elems instanceof HTMLElement) {   // Если elems - один HTML-элемент
            elems.value = '';   // изменится свойство элемента и выполнение функции прервется из-за return.
            return;
        };
        for (let i = 0; i < elems.length; i++) { // А можно передать список элементов и одним вызовом скрыть все.
            elems[i].value = '';
        };
    },
    toEnableOne: function (element, isEnable = true) {
        if (isEnable) {
            element.disabled = false;
            element.classList.remove('disabled');
        } else {
            element.disabled = true;
            element.classList.add('disabled');
        }
    },
    toEnableAll: function (elems, isEnable = true) {
        if (elems instanceof HTMLElement) {   // Если elems - один HTML-элемент
            this.toEnableOne(elems, isEnable);   // изменится свойство элемента и выполнение функции прервется из-за return.
            return;
        };
        for (let i = 0; i < elems.length; i++) { // А можно передать список элементов и одним вызовом скрыть все.
            this.toEnableOne(elems[i], isEnable);
        };
    },
    isSelected: function () {
        let temp = true;
        screenBlocksSelects.forEach((item) => (item.value === undefined) ? temp = false : {});
        this.screenSelect = temp;
        this.toEnableOne(buttonStart, this.screenSelect && this.screenInput);
    },
    isFilled: function () {
        let temp = true;
        screenBlocksInputs.forEach((item) => (!this.toInt(item.value)) ? temp = false : {});
        this.screenInput = temp;
        this.toEnableOne(buttonStart, this.screenSelect && this.screenInput);
    },
    addListenersToForms: function () {
        screenBlocksSelects.forEach((elem) => elem.addEventListener('input', () => this.isSelected()));
        screenBlocksInputs.forEach((elem) => elem.addEventListener('input', () => this.isFilled()));
    },
    init: function () {
        this.toEnableOne(buttonStart, false);
        this.addTitle();
        inputRange.addEventListener('input', (event) => {
            this.rollback = event.target.value;
            spanRangeValue.textContent = event.target.value + '%';
        });
        this.addListenersToForms();
        buttonPlus.addEventListener('click', this.addScreenBlock);
        buttonStart.addEventListener('click', this.start);
    },
    addTitle: function () { document.title = pageTitle.textContent },
    addScreenBlock: function () {
        const screenClone = screenBlocks[0].cloneNode(true);
        screenClone.querySelector('input').value = '';
        screenBlocks[screenBlocks.length - 1].after(screenClone);
        appData.screenSelect = false;
        appData.screenInput = false;
        appData.toEnableOne(buttonStart, false);
        screenBlocksSelects = document.querySelectorAll('.screen select');
        screenBlocksInputs = document.querySelectorAll('.screen input');
        appData.addListenersToForms();
    },
    start: function () {
        appData.addScreens();
        appData.addServices();
        appData.getScreens();
        appData.getServices();
        appData.getFullPrice();
        appData.getFinalProfit();
        // appData.logger();
        appData.showResult();
    },
    addScreens: function () {
        this.screenArray.push(0);
        this.screenArray.length = 0;
        for (let i = 0; i < screenBlocks.length; i++) {
            this.screenArray.push({
                id: i + 1,
                name: screenBlocksSelects[i].options[screenBlocksSelects[i].selectedIndex].textContent,
                count: this.toInt(screenBlocksInputs[i].value),
                price: this.toInt(screenBlocksSelects[i].value) * this.toInt(screenBlocksInputs[i].value),
            });
        };
    },
    addServices: function () {
        for (let i = 0; i < otherItemsPercent.length; i++) {
            const check = otherItemsPercent[i].querySelector('input[type=checkbox]');
            const label = otherItemsPercent[i].querySelector('label');
            const percent = otherItemsPercent[i].querySelector('input[type=text]');
            if (check.checked) {
                this.servicePercentArray.push({
                    id: i + 1,
                    name: label.textContent,
                    checked: check.checked,
                    percent: this.toInt(percent.value),
                });
            };
        };
        for (let i = 0; i < otherItemsNumber.length; i++) {
            const check = otherItemsNumber[i].querySelector('input[type=checkbox]');
            const label = otherItemsNumber[i].querySelector('label');
            const price = otherItemsNumber[i].querySelector('input[type=text]');
            if (check.checked) {
                this.serviceNumberArray.push({
                    id: i + 1,
                    name: label.textContent,
                    checked: check.checked,
                    price: this.toInt(price.value),
                });
            };
        };
    },
    getScreens: function () {
        let tempScreen = 0;
        let tempCount = 0;
        for (let key in this.screenArray) {
            tempScreen += this.screenArray[key].price;
            tempCount += this.screenArray[key].count;
        }
        this.totalScreen = tempScreen;
        this.screenCount = tempCount;
    },   // запрашивает набор однотипных услуг вида Название и Стоимость
    getServices: function () {
        let tempPercent = 0;
        for (let i in this.servicePercentArray) tempPercent += this.servicePercentArray[i].percent;
        this.totalServicePercent = Math.round(this.totalScreen * (tempPercent / 100));
        let tempNumber = 0;
        for (let j in this.serviceNumberArray) tempNumber += +this.serviceNumberArray[j].price;
        this.totalServiceNumber = tempNumber;
    },  // суммирует стоимость всех доп. услуг
    getFullPrice: function () {
        this.fullPrice = this.totalScreen + this.totalServicePercent + this.totalServiceNumber;
    },   // находит итоговую стоимость всего проекта, суммируя базовую цену и цену всех доп услуг.
    getFinalProfit: function () {
        this.finalProfit = Math.ceil(this.fullPrice - this.fullPrice * (this.rollback / 100));
    },   // итоговый доход после вычета отката
    enableAllInputs: function (enable = true) {
        this.toEnableAll(screenBlocksSelects, enable);
        this.toEnableAll(screenBlocksInputs, enable);
        this.toEnableOne(buttonPlus, enable);
        this.toEnableAll(otherItemsPercent, enable);
        this.toEnableAll(otherItemsNumber, enable);
    },
    reset: function () {
        for (let i = screenBlocks.length - 1; i > 0; i--) {
            screenBlocks[i].remove();
        }
        showTotalScreen.value = '';
        showScreenCount.value = '';
        showTotalService.value = '';
        showFullPrice.value = '';
        showFinalProfit.value = '';
        this.toClearValue(screenBlocksSelects);
        this.toClearValue(screenBlocksInputs);
        this.toClearValue(otherItemsPercent);
        this.toClearValue(otherItemsNumber);
        this.toEnableOne(buttonPlus, true);
        this.enableAllInputs();
        this.toUncheck(otherItemsPercent);
        this.toUncheck(otherItemsNumber);
        this.toDisplay(buttonReset, 'none');
        this.toDisplay(buttonStart);
        this.screenArray.length = 0;
        this.servicePercentArray.length = 0;
        this.serviceNumberArray.length = 0;
        screenBlocksSelects = document.querySelectorAll('.screen select');
        screenBlocksInputs = document.querySelectorAll('.screen input');
        this.addListenersToForms();
        this.init();
        // this.logger();
    },
    showResult: function () {
        showTotalScreen.value = this.totalScreen; // Стоимость вёрстки
        showScreenCount.value = this.screenCount; // Количество экранов
        showTotalService.value = this.totalServicePercent + this.totalServiceNumber; // Стоимость доп. услуг
        showFullPrice.value = this.fullPrice; // Итоговая стоимость
        showFinalProfit.value = this.finalProfit; // Стоимость с учётом отката
        inputRange.addEventListener('input', (event) => {
            this.rollback = event.target.value;
            spanRangeValue.textContent = event.target.value + '%';
            this.getFinalProfit();
            showFinalProfit.value = this.finalProfit;
        });
        this.enableAllInputs(false);
        this.toDisplay(buttonStart, 'none');
        this.toDisplay(buttonReset);
        buttonReset.addEventListener('click', () => { this.reset(); });
    },
    logger: function () { console.log(this) },
};
appData.init();