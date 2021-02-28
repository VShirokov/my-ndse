#!/usr/bin/env node
const fs = require('fs');
const yargs = require('yargs')
const { hideBin } = require('yargs/helpers')

yargs(hideBin(process.argv))
    .usage('Usage: $0 stat [source], where [source] - path to the log file.\nBy default - "./log.txt"\nExample:\ncmd stat\ncmd stat ../log-shmog.txt')
    .command('stat [source]', '- display statistics on the log file.', yargs => {
        yargs
        .positional('source', {
            describe: 'source to log file',
            default: './log.txt'
        })
    }, (argv) => {
        fs.readFile(argv.source, 'utf8', (err, data) => {
            if (err) {
                throw new Error(err);
            }
            const gameCount = (data.toString().match(/start game/g)||[]).length;
            const gameWinCount = (data.toString().match(/win/g)||[]).length;
            const winningPercentage = gameWinCount ? parseInt((gameWinCount * 100)/gameCount) : 0;
            if (gameCount) {
                console.log(`
    Количество партий: ${gameCount}
    Количество выигрышей: ${gameWinCount}
    Количество проигрышей: ${gameCount - gameWinCount}
    Вы выиграли в ${winningPercentage}% партий
                `);
            } else {
                console.log(`Вы не сыграли ни одной партии!`);
            }
        });
    })
    .demandCommand(1)
    .argv;
