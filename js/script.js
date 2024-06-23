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

    toInt: function (str) { return Math.abs(parseInt(str.trim().split(/\D/).join(''))) },

    updateStatus: function (element) {
        if (this.screenSelect && this.screenInput) {
            element.disabled = false;
            element.classList.remove('disabled');
        } else {
            element.disabled = true;
            element.classList.add('disabled');
        }
    },
    isSelected: function () {
        let temp = true;
        screenBlocksSelects.forEach((item) => (item.value === undefined) ? temp = false : {});
        this.screenSelect = temp;
        appData.updateStatus(buttonStart);
    },
    isFilled: function () {
        let temp = true;
        screenBlocksInputs.forEach((item) => (!appData.toInt(item.value)) ? temp = false : {});
        this.screenInput = temp;
        this.updateStatus(buttonStart);
    },
    addListenersToForms: function () {
        screenBlocksSelects = document.querySelectorAll('.screen select');
        screenBlocksInputs = document.querySelectorAll('.screen input');
        screenBlocksSelects.forEach((elem) => elem.addEventListener('change', () => this.isSelected()));
        screenBlocksInputs.forEach((elem) => elem.addEventListener('input', () => this.isFilled()));
    },
    init: function () {
        this.updateStatus(buttonStart);
        this.addTitle();
        inputRange.addEventListener('input', (event) => {
            this.rollback = event.target.value;
            spanRangeValue.textContent = event.target.value + '%';
        });
        this.addListenersToForms();
        buttonPlus.addEventListener('click', this.addScreenBlock);
        buttonStart.addEventListener('click', this.start);
    },
    addTitle: () => document.title = pageTitle.textContent,
    addScreenBlock: function () {
        const screenClone = screenBlocks[0].cloneNode(true);
        screenClone.querySelector('input').value = '';
        screenBlocks[screenBlocks.length - 1].after(screenClone);
        this.screenSelect = false;
        this.screenInput = false;
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
        this.screenArray.length = 0;
        screenBlocks.forEach(function (item, index) {
            const select = item.querySelector('select');
            const count = item.querySelector('input');
            appData.screenArray.push({
                id: index,
                name: select.options[select.selectedIndex].textContent,
                count: appData.toInt(count.value),
                price: appData.toInt(select.value) * appData.toInt(count.value),
            });
        });
    },
    addServices: function () {
        otherItemsPercent.forEach((item) => {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');
            if (check.checked) {
                this.servicePercentArray[label.textContent] = appData.toInt(input.value);
            }
        });
        otherItemsNumber.forEach((item) => {
            const check = item.querySelector('input[type=checkbox]');
            const label = item.querySelector('label');
            const input = item.querySelector('input[type=text]');
            (check.checked) ? this.serviceNumberArray[label.textContent] = appData.toInt(input.value) : {};
        });
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
        for (let key in this.servicePercentArray) tempPercent += this.servicePercentArray[key];
        this.totalServicePercent = Math.round(this.totalScreen * (tempPercent / 100));
        let tempNumber = 0;
        for (let key in this.serviceNumberArray) tempNumber += +this.serviceNumberArray[key];
        this.totalServiceNumber = tempNumber;
    },  // суммирует стоимость всех доп. услуг
    getFullPrice: function () {
        this.fullPrice = this.totalScreen + this.totalServicePercent + this.totalServiceNumber;
    },   // находит итоговую стоимость всего проекта, суммируя базовую цену и цену всех доп услуг.
    getFinalProfit: function () {
        this.finalProfit = Math.ceil(this.fullPrice - this.fullPrice * (this.rollback / 100));
    },   // итоговый доход после вычета отката
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
    },

    logger: function () { console.log(this) },
};
appData.init();
