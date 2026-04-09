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

async function cleanAndUpload() {
  const dataPath = path.join(__dirname, "data", "flights_db.json");
  const flightsData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const flights = flightsData.flights;

  const collectionRef = db.collection("flights");

  console.log("🚀 Boss, bazani tozalashni boshladik...");

  const snapshot = await collectionRef.get();
  const deleteBatch = db.batch();
  snapshot.docs.forEach((doc) => {
    deleteBatch.delete(doc.ref);
  });
  await deleteBatch.commit();
  console.log("🗑️ Barcha eski reyslar o'chirildi.");

  const uploadBatch = db.batch();
  flights.forEach((flight) => {
    const docRef = collectionRef.doc(flight.id.toString());
    uploadBatch.set(docRef, {
      ...flight,
      price: Number(flight.price),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });
  await uploadBatch.commit();
  console.log(`✅ ${flights.length} ta reys muvaffaqiyatli yuklandi. Duplikatlar muammosi hal qilindi!`);
}

cleanAndUpload();
