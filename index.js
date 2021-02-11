#!/usr/bin/env node
const readline = require('readline');

const getRandom = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const rl = readline.createInterface({
    input: process.stdin,
});

const hiddenNumber = getRandom(0, 100);
console.log('Загадано число в диапазоне от 0 до 100', hiddenNumber);

rl.on('line', inputNumber => {
    if (inputNumber < hiddenNumber) console.log('Больше');
    if (inputNumber > hiddenNumber) console.log('Меньше');
    if (inputNumber == hiddenNumber) {
        console.log(`Отгадано число ${inputNumber}`);
        rl.close();
    }
});

rl.on('close', () => console.log('Заходи ещё!'));
