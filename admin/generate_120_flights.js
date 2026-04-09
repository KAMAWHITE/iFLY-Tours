const fs = require('fs');
const path = require('path');

const uz = require('../../locales/uz/Flights.json').selectors;
const ru = require('../../locales/ru/Flights.json').selectors;
const en = require('../../locales/en/Flights.json').selectors;

const dates = ["2026-05-01", "2026-05-02", "2026-05-03"];
const times = ["08:00", "12:00", "15:30", "19:00", "22:30", "06:15"]; // Sample times

const logos = [
    "/logos/uzbekistan_airways.png",
    "/logos/turkish_airlines.png",
    "/logos/emirates.png",
    "/logos/lufthansa.png",
    "/logos/air_arabia.png"
];

const companies = [
    "Uzbekistan Airways",
    "Turkish Airlines",
    "Emirates",
    "Lufthansa",
    "Air Arabia"
];

const tashkent = {
    uz: uz.sel_0,
    ru: ru.sel_0,
    en: en.sel_0
};

const destinations = [];
for (let i = 1; i <= 20; i++) {
    const key = `sel_${i}`;
    destinations.push({
        uz: uz[key],
        ru: ru[key],
        en: en[key]
    });
}

const flights = [];
let id = 1;

destinations.forEach((dest, dIdx) => {
    dates.forEach((date, dateIdx) => {
        const companyIdx = (dIdx + dateIdx) % companies.length;
        const timeIdx = (dIdx + dateIdx) % times.length;
        flights.push({
            id: id++,
            logo: logos[companyIdx],
            company: companies[companyIdx],
            from: tashkent,
            to: dest,
            date: date,
            time: times[timeIdx],
            price: 2500000 + (dIdx * 200000) + (dateIdx * 100000),
            occupiedSeats: []
        });
    });
});

destinations.forEach((dest, dIdx) => {
    dates.forEach((date, dateIdx) => {
        const companyIdx = (dIdx + dateIdx + 2) % companies.length;
        const timeIdx = (dIdx + dateIdx + 1) % times.length;
        flights.push({
            id: id++,
            logo: logos[companyIdx],
            company: companies[companyIdx],
            from: dest,
            to: tashkent,
            date: date,
            time: times[timeIdx],
            price: 2400000 + (dIdx * 200000) + (dateIdx * 100000),
            occupiedSeats: []
        });
    });
});

const output = { flights };
const outputPath = path.join(__dirname, 'data', 'flights_db.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 4));

console.log(`✅ Successfully generated ${flights.length} flights in ${outputPath}`);
