const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "data", "flights_db.json");
const flightsData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
const originalFlights = flightsData.flights;

console.log(`📡 Mavjud borish reyslari: ${originalFlights.length} ta.`);

const returnFlights = originalFlights.map(f => {
    const departureDate = new Date(f.date);
    departureDate.setDate(departureDate.getDate() + 2);
    const returnDateStr = departureDate.toISOString().split('T')[0];

    return {
        ...f,
        id: f.id + 100,
        from: f.to,
        to: f.from,
        date: returnDateStr,
        price: Math.floor(f.price * 0.95),
        occupiedSeats: []
    };
});

const allFlights = [...originalFlights, ...returnFlights];

flightsData.flights = allFlights;
fs.writeFileSync(dataPath, JSON.stringify(flightsData, null, 4));

console.log(`✅ Jami 120 ta reys (60 borish + 60 qaytish) flights_db.json fayliga yozildi.`);
