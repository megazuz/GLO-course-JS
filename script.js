'use strict';

const appData = {
    title: '',
    screen: [],
    exampleScreen: [  // Примеры типов экранов и их стоимость
        { name: 'Простые', price: 4000 },
        { name: 'Сложные', price: 8000 },
        { name: 'Интерактивные', price: 12000 }
    ],
    adaptivePrice: 0, // Стоимость реализации адаптивной вёрстки
    exampleAdaptivePrice: 0,  // установленная стоимость адаптивной вёрстки
    service: [],
    exampleService: [ // Примеры названия дополнительный сервисов/платных услуг
        { name: 'Метрика', price: 1000 },
        { name: 'Отправка форм', price: 2000 }
    ],
    allScreenPrice: 0, // сумму всех экранов
    allServicePrice: 0, // сумму всех дополнительных сервисов/платных услуг
    fullPrice: 0, // итоговая стоимость
    rollback: 23, // процент отката
    finalProfit: 0, // итоговый заработок
    start: function () {
        appData.asking();
        appData.getFullPrice();
        console.log(appData.discountMessage());
        appData.getFinalProfit();
        appData.logger();
    },
    asking: function () { // единый блок сбора начальных данных
        appData.getTitle();
        appData.getScreens();
        appData.getAdaptive();
        appData.getServices();
    },
    isNumber: function (num) { // проверяет ответ на возможность перевести в число
        return !(parseFloat(num) === 'number') && isFinite(num);
    },
    isDesignation: function (text) {  // проверяет ответ на наличие букв в строке
        return !(parseFloat(text)) && (text.trim() != '');
    },
    pricePrompt: function (request, example = '') { // запрашивает стоимость
        let answer = '';
        do {
            answer = Math.abs(parseFloat(prompt(request, example)));
        } while (!appData.isNumber(answer));
        return answer;
    },
    titlePrompt: function (request, example = '') { // запрашивает название проекта
        let answer = '';
        do {
            answer = prompt(request, example).trim();
        } while (!appData.isDesignation(answer));
        return answer;
    },
    getTitle: function () {  // обрабатывает title и выводим его в заголовок окна
        appData.title = appData.titlePrompt('Как называется ваш проект?', ' КаЛьКулятор Вёрстки 2.0          ');
        document.title = appData.title[0].toUpperCase() + appData.title.substring(1).toLowerCase();
    },
    getAdaptive: function () {
        if (confirm('Нужен ли делать сайт адаптивным?')) {
            appData.adaptivePrice = appData.exampleAdaptivePrice; // назначает стоимость реализации адаптивного сайта
        };
    },
    getScreens: function () {  // запрашивает набор однотипных услуг вида Название и Стоимость
        let name = '';
        let price = '';
        for (let id = 0; id < 3; id++) {
            name = appData.titlePrompt('Какой тип экрана нужно разработать?\nВводите название типа экрана:', appData.exampleScreen[id].name);
            price = appData.pricePrompt('Сколько это будет стоить?', appData.exampleScreen[id].price);
            appData.screen.push({ id, name, price });
        }
        appData.allScreenPrice += appData.screen.reduce(function (sum, item) {
            return sum + item.price;
        }, 0);
    },
    getServices: function () { // суммирует стоимость всех доп. услуг
        let name = '';
        let price = '';
        for (let id = 0; id < 2; id++) {
            name = appData.titlePrompt('Введите название дополнительной платной услуги/функционала', appData.exampleService[id].name);
            price = appData.pricePrompt('Сколько это будет стоить?', appData.exampleService[id].price);
            appData.service.push({ id, name, price });
            appData.allServicePrice += price;
        };
    },
    getFullPrice: function () { // находит итоговую стоимость всего проекта, суммируя базовую цену и цену всех доп услуг.
        appData.fullPrice = appData.allScreenPrice + appData.adaptivePrice + appData.allServicePrice;
    },
    discountMessage: function () { // возвращает строчку с величиной скидки (от общей цены)
        switch (true) {
            case appData.fullPrice >= 30000:
                return 'Даём скидку в 10%';
            case appData.fullPrice >= 15000:
                return 'Даём скидку в 5%';
            case appData.fullPrice >= 0:
                return 'Скидка не предусмотрена';
            default:
                return '! Функция определения скидки получила отрицательное число !';
        }
    },
    getFinalProfit: function () { // итоговый доход после вычета отката
        appData.finalProfit = Math.ceil(appData.fullPrice - (appData.fullPrice * (appData.rollback / 100)));
    },
    logger: function () {
        console.log(appData.fullPrice);
        console.log(appData.finalProfit);
        // при значениях стоимостей работ по умолчанию (из примеров) получаем 20790 и скидку 5%.
        // for (let key in appData) {
        //     console.log(appData[key]);
        // };
    },
}
appData.start();