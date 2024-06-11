'use strict';

const appData = {
    title: '',
    screens: '',
    screenPrice: 0,
    adaptive: true,
    serviceNames: ['Названия дополнительных платных услуг', 'Например: Тщательно протестировать', 'Например: Показать фокус-группе'],
    exampleServiceNames: ['Примеры названий дополнительных платных услуг', 'Например: Тщательно протестировать', 'Например: Показать фокус-группе'],
    exampleServicePrices: ['Примеры стоимости дополнительных платных услуг', '10000 руб', '5000 руб'],
    allServicePrices: 0, // сумму всех дополнительных услуг
    fullPrice: 100500, // итоговая стоимость
    rollback: 23, // процент отката
    servicePercentPrice: 0, // итоговая стоимость минус сумма отката
    isNumber: function (num) {
        return !(parseFloat(num) === 'number') && isFinite(num);
    },
    pricePrompt: function (request, example = 0) {
        let answer = 0;
        do {
            answer = Math.abs(parseFloat(prompt(request, example)));
        } while (!appData.isNumber(answer));
        return answer;
    },
    getTitle: function () {
        appData.title = prompt('Как называется ваш проект?', ' КаЛьКулятор Вёрстки           ');
        appData.title = appData.title.trim();
        document.title = appData.title[0].toUpperCase() + appData.title.substring(1).toLowerCase();
    },
    asking: function () {
        appData.getTitle();
        appData.screens = prompt('Какие типы экранов нужно разработать?', 'Простые, Сложные, Интерактивные');
        appData.screenPrice = appData.pricePrompt('Сколько будет стоить данная работа?', 12000 + ' руб');
        appData.adaptive = confirm('Нужен ли делать сайт адаптивным?');
    },
    getAllServicePrices: function () {
        let sum = 0;
        for (let i = 1; i < 3; i++) {
            appData.serviceNames[i] = prompt('Какой дополнительный тип услуги нужен?\nВведите название услуги:', appData.serviceNames[i]);
            sum += appData.pricePrompt('Сколько это будет стоить?', appData.exampleServicePrices[i]);
        };
        return sum;
    },
    getServicePercentPrice: function () {
        return appData.fullPrice - (appData.fullPrice * (appData.rollback / 100));
    },
    getFullPrice: function () {
        return Math.abs(appData.screenPrice) + appData.allServicePrices;
    },
    discountMessage: function (total, d5 = 15000, d10 = 30000) {
        switch (true) {
            case total >= d10:
                return 'Даём скидку в 10%';
            case total >= d5:
                return 'Даём скидку в 5%';
            case total >= 0:
                return 'Скидка не предусмотрена';
            default:
                return '! Функция определения скидки получила отрицательное число !';
        }
    },
    getServicePercentPrices: function () {
        return Math.ceil(appData.fullPrice - (appData.fullPrice * (appData.rollback / 100)));
    },
    logger: function () {
        console.log(appData.fullPrice);
        console.log(appData.servicePercentPrice);
        // при значениях стоимостей работ по умолчанию (из примеров) получаем 20790 и скидку 5%.
        for (let key in appData) {
            console.log(appData[key]);
        };
    },
    start: function () {
        appData.asking(); // обрабатывает title и выводим его в заголовок окна
        appData.allServicePrices = appData.getAllServicePrices();
        appData.fullPrice = appData.getFullPrice();
        appData.discountMessage();
        appData.servicePercentPrice = appData.getServicePercentPrices();
        appData.logger();
    },
}
appData.start();