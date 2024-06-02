let title = 'GLO-course-JS',
    screens = 'Простые, Сложные, Интерактивные',
    screenPrice = 4,
    rollback = 23,
    fullPrice = 100500,
    adaptive = true;

console.log(typeof title);
console.log(typeof fullPrice);
console.log(typeof adaptive);
console.log(screens.length);

console.log('Стоимость верстки экранов ' + screenPrice + ' рублей/долларов/гривен/юани');
console.log('Стоимость разработки сайта ' + fullPrice + ' рублей/долларов/гривен/юани');

console.log(screens.toLowerCase().split(', '));
let cost = fullPrice * (rollback / 100)
console.log('Процент отката посреднику за работу ' + cost.toString() + ' рублей/долларов/гривен/юани');

alert('File script.js successfully loaded');
console.log('File script.js successfully loaded');