const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function checkAndWipe() {
  const collectionRef = db.collection("flights");
  const snapshot = await collectionRef.get();

  console.log(`📊 Bazada jami hujjatlar soni: ${snapshot.size}`);

  const idCounts = {};
  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const id = data.id || doc.id;
    idCounts[id] = (idCounts[id] || 0) + 1;
  });

  const duplicates = Object.keys(idCounts).filter(id => idCounts[id] > 1);
  if (duplicates.length > 0) {
    console.log(`⚠️  Duplikat ID-lar topildi: ${duplicates.join(", ")}`);
  } else {
    console.log("✅ Duplikat ID-lar topilmadi.");
  }

  console.log("♻️  Bazani butunlay tozalab, qayta tiklashni boshlaymiz...");

  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();
  console.log("🗑️  Hamma ma'lumotlar o'chirildi.");

  const fs = require("fs");
  const path = require("path");
  const flightsData = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "flights_db.json"), "utf8"));
  const flights = flightsData.flights;

  for (let i = 0; i < flights.length; i += 400) {
    const currentBatch = db.batch();
    const chunk = flights.slice(i, i + 400);
    chunk.forEach(flight => {
      const docRef = collectionRef.doc(flight.id.toString());
      currentBatch.set(docRef, {
        ...flight,
        price: Number(flight.price),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    await currentBatch.commit();
  }

  console.log(`🚀 ${flights.length} ta reys yangidan (toza) yuklandi.`);
}

checkAndWipe();
