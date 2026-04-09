const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require("fs");

const path = require("path");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

const dataPath = path.join(__dirname, "data", "flights_db.json");
const flightsData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

async function uploadData() {
  const flights = flightsData.flights;

  const batch = db.batch();

  flights.forEach((flight) => {
    const docRef = db.collection("flights").doc(flight.id.toString());

    batch.set(docRef, {
      logo: flight.logo,
      company: flight.company,
      from: flight.from,
      to: flight.to,
      date: flight.date,
      time: flight.time,
      price: Number(flight.price),
      occupiedSeats: flight.occupiedSeats || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  try {
    await batch.commit();
    console.log("✅ Boss, yangi formatdagi barcha reyslar muvaffaqiyatli yuklandi!");
  } catch (error) {
    console.error("❌ Xatolik yuz berdi:", error);
  }
}

uploadData();