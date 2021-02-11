#!/usr/bin/env node
import { Command } from 'commander';
import { formatISO, add, sub, format } from 'date-fns';

const program = new Command();
program.version('0.0.1');

program
    .arguments('<executeCommand>')
    .option('-y, --year [count]', 'with "current" - get current year, with "add" or "sub" - you you will get a future or past year')
    .option('-m, --month [count]', 'with "current" - get current month, with "add" or "sub" - get a future or past month')
    .option('-d, --date [count]', 'with "current" - get current day, with "add" or "sub" - get a future or past day')
    .action((executeCommand, options, command) => {
        const currentDate = format(new Date(), 'yyyy, M, d');

        const normalizedOption = option => option?.toString() === 'true' ? 0 : option || 0;

        const getFormatFutureDate = handler => (
            formatISO(handler(
                new Date(currentDate),
                {
                    years:  normalizedOption(options.year),
                    months: normalizedOption(options.month),
                    days: normalizedOption(options.date),
                })
            )
        );

        switch(executeCommand) {
            case 'current':
                options.year && console.log('Current year:', new Date().getFullYear());
                options.month && console.log('Current month:', new Date().getMonth());
                (Object.keys(options).length === 0 || options.date) && console.log('Current date:', formatISO(new Date()));
                break;
            case 'add':
                console.log('You future date -> ', getFormatFutureDate(add))
                break;
            case 'sub':
                console.log('You past date -> ', getFormatFutureDate(sub))
                break;
            default:
                console.error('Unknown operation')
                break;
        }
    });
program.usage('[command] <option> \n where [command] may be "current", "add" or "sub" \n with options:')
program.addHelpText('after', `
For commands "add" and "sub" you can pass values for options.
Examples:

cmd current
cmd current -y
cmd current --month

cmd add --date 10
cmd add -y 4 -m 5 -d 7
cmd sub --month 3
`);
program.parse();
