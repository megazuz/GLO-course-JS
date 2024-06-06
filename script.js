'use strict';

// Блок чтения данных их DOM и объявления переменных

let title;
let screens;
let screenPrice;
let adaptive;
let serviceNames = ['Названия дополнительных платных услуг'];
let exampleServiceNames = ['Примеры названий дополнительных платных услуг', 'Например: Тщательно протестировать', 'Например: Показать фокус-группе'];
let exampleServicePrices = ['Примеры стоимости дополнительных платных услуг', '10000 руб', '5000 руб'];

let allServicePrices; // сумму всех дополнительных услуг
let fullPrice = 100500; // итоговая стоимость
let rollback = 23; // процент отката
let servicePercentPrice; // итоговая стоимость минус сумма отката

// Блок описания функций

const isNumber = function (num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
};

const getTitle = function () {
    title = prompt('Как называется ваш проект?', ' КаЛьКулятор Вёрстки           ');
    document.title = title.trim()[0].toUpperCase() + title.trim().substring(1).toLowerCase();
}

const asking = function () {
    getTitle();
    screens = prompt('Какие типы экранов нужно разработать?', 'Простые, Сложные, Интерактивные');
    screenPrice = pricePrompt('Сколько будет стоить данная работа?', 12000 + ' руб');
    adaptive = confirm('Нужен ли делать сайт адаптивным?');
};

const pricePrompt = function (request, example = 0) {
    let answer = 0;
    do {
        answer = Math.abs(parseFloat(prompt(request, example)));
    } while (!isNumber(answer));
    return answer;
};

const getAllServicePrices = function () {
    let sum = 0;
    for (let i = 1; i < 3; i++) {
        serviceNames[i] = prompt('Какой дополнительный тип услуги нужен?\nВведите название услуги:', serviceNames[i]);
        sum += pricePrompt('Сколько это будет стоить?', exampleServicePrices[i]);
    };
    return sum;
};

const showTypeOf = function (variable) {
    console.log(variable, ' имеет тип данных =', typeof variable);
}

const discountMessage = function (total, d5 = 15000, d10 = 30000) {
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
};

const getServicePercentPrice = function () {
    return fullPrice - (fullPrice * (rollback / 100));
};

const getFullPrice = function () {
    return Math.abs(screenPrice) + allServicePrices;
}

const getServicePercentPrices = function () {
    return Math.ceil(fullPrice - (fullPrice * (rollback / 100)));
}

// Функциональный блок

asking(); // обрабатывает title и выводим его в заголовок окна
showTypeOf(title);
showTypeOf(fullPrice);
showTypeOf(adaptive);
console.log(screens.length);
screens.toLowerCase().split(', ');
// console.log('Стоимость вёрстки экранов ', String(screenPrice), ' рублей/долларов/гривен/юани');
// console.log('Стоимость разработки сайта ', String(fullPrice), ' рублей/долларов/гривен/юани');
// console.log('Процент отката посреднику за работу ', String(fullPrice * (rollback / 100)), ' рублей/долларов/гривен/юани');
// console.log(servicePrice1, ' и ', servicePrice2);
allServicePrices = getAllServicePrices();
fullPrice = getFullPrice();
servicePercentPrice = getServicePercentPrices();
console.log('servicePercentPrice = ' + servicePercentPrice + ' рублей.');
console.log(discountMessage(fullPrice, 15000, 30000));
// при значениях стоимостей работ по умолчанию (из примеров) получаем 20790 и скидку 5%.

// Мусорный блок

// console.log('Script.js finished.');