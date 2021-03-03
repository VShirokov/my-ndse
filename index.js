#!/usr/bin/env node
require('dotenv').config();
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const http = require('http');
const API_KEY = process.env.API_KEY;

const fetchWeatherReport = city => {
const url = `http://api.weatherstack.com/current?access_key=${API_KEY}&query=${city}`;

    http.get(url, res => {
        const { statusCode } = res;
        if (statusCode !== 200) {
            console.error(`Error with status: ${statusCode}`);
            return;
        }
        res.setEncoding('utf8');
        let rawData = '';
        res.on('data', chunk => { rawData += chunk; });
        res.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                const { current: { temperature = 'Неопределено', feelslike = 'Неопределено' } } = parsedData;
                console.log(`
Город: ${city}.
Текущая температура: ${temperature} градусов.
Ощущается как: ${feelslike} градусов.
                `);
            } catch (e) {
                console.error(e.message);
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
    });
}

yargs(hideBin(process.argv))
.usage('Usage: $0 report [city], by default city is "Moscow"\nExample:\ncmd report\ncmd report Kirov\ncmd report \'New York\'')
.command('report [city]', '- log weather report in console.', yargs => {
    yargs
    .positional('city', {
        describe: 'the city is the city',
        default: 'Moscow'
    })
}, argv => {
    const { city } = argv;
    fetchWeatherReport(city);
})
.demandCommand(1)
.argv;
