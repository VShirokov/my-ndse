#!/usr/bin/env node
const readline = require('readline');
const fs = require('fs');
const path = require('path');
const process = require('process');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});


const fileName = yargs.argv.f;
let file = path.join(__dirname, `${fileName || 'log'}.txt`);

const log = message => {
    fs.appendFile(file,`${new Date().toLocaleString('ru')} - input # ${message}\n`, err => {if (err) throw new Error(err)});
};

function randomInteger(min = 0, max = 100) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return rand > 50 ? 2 : 1;
}

const game = () => {
    const hiddenNumber = randomInteger();
    const content = `${new Date().toLocaleString('ru')} - output # start game, secret number - ${hiddenNumber}\n`
    fs.appendFile(file,content, err => {if (err) throw new Error(err)});

    rl.question('\nВведите 1 или 2 чтобы отгадать число\n', inputNumber => {
        if (inputNumber != 1 && inputNumber != 2) {
            log(`${inputNumber} - wrong input!`);
            console.log('Некорректный ввод!');
            game();
            return;
        }
        if (inputNumber == hiddenNumber) {
            console.log('\n### Правильно\n');
            log(`${inputNumber} - win!`)
            maybePlayAgain();
        } else {
            console.log(`\n### Неправильно, загаданное число - ${hiddenNumber}\n`);
            log(`${inputNumber} - fail!`)
            maybePlayAgain();
        }
    });
}

const maybePlayAgain = () => {
    rl.question('Попробуем еще раз?\n1 - да, 2 - нет\n', userAnswer => {
        if (userAnswer != 1 && userAnswer != 2) {
            log(`${userAnswer} - wrong input!`);
            console.log('Некорректный ввод!');
            maybePlayAgain();
            return;
        }

        if (userAnswer == 1) {
            game();
        } else {
            log('exit game');
            console.log('Не скучай!');
            rl.close();
            process.exit();
        }
    });
}

yargs(hideBin(process.argv))
    .usage('Usage: $0 start\nUse optionaly with option "f" and enter log-file name. By default - "log"\nExample:\ncmd start\ncmd start -f log-shmog')
    .command(
        'start',
        'Start the game',
        yargs => yargs.option('f', {
            default: 'log'
        }),
        () => {
            game();
    })
    .demandCommand(1)
    .argv;
