'use strict';

let title = 'GLO-course-JS',
    screens = 'Простые, Сложные, Интерактивные',
    screenPrice = 12000,
    rollback = 23,
    fullPrice = 100500,
    adaptive = true;

console.log(typeof title);
console.log(typeof fullPrice);
console.log(typeof adaptive);
console.log(screens.length);

console.log('Стоимость вёрстки экранов ' + String(screenPrice) + ' рублей/долларов/гривен/юани');
console.log('Стоимость разработки сайта ' + String(fullPrice) + ' рублей/долларов/гривен/юани');

console.log(screens.toLowerCase().split(', '));
console.log('Процент отката посреднику за работу ' + String(fullPrice * (rollback / 100)) + ' рублей/долларов/гривен/юани');

alert('File script.js successfully loaded');
console.log('File script.js successfully loaded');

title = prompt('Как называется ваш проект?', 'Например: ' + title);
screens = prompt('Какие типы экранов нужно разработать?', 'Например: ' + screens);
screenPrice = parseFloat(prompt('Сколько будет стоить данная работа?', screenPrice + ' руб'));

let service1 = prompt('Какой дополнительный тип услуги нужен?\nВведите название услуги:', 'Например: Тщательно протестировать');
let servicePrice1 = parseFloat(prompt('Сколько это будет стоить?', '10000 руб'));
let service2 = prompt('Какой ещё дополнительный тип услуги нужен?\nВведите название второй доп. услуги:', 'Например: Показать фокус-группе');
let servicePrice2 = parseFloat(prompt('Сколько это будет стоить?', '5000 руб'));

fullPrice = Math.abs(screenPrice) + Math.abs(servicePrice1) + Math.abs(servicePrice2);
let servicePercentPrice = Math.ceil(fullPrice - (fullPrice * (rollback / 100)));
console.log('servicePercentPrice = ' + servicePercentPrice + ' рублей.');
// при значениях стоимостей работ по умолчанию (из примеров) получаем 20790 и скидку 5%.
switch (true) {
    case servicePercentPrice >= 30000:
        console.log('Даём скидку в 10%');
        break;
    case servicePercentPrice >= 15000:
        console.log('Даём скидку в 5%');
        break;
    case servicePercentPrice >= 0:
        console.log('Скидка не предусмотрена');
        break;
    default:
        console.log('Что-то пошло не так');
}