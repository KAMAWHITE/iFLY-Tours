const admin = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");
const fs = require("fs");
const path = require("path");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// Path: src/lib/data/countries_db.json
const dataPath = path.join(__dirname, "data/countries_db.json");
const countriesData = JSON.parse(fs.readFileSync(dataPath, "utf8"));

async function uploadCountries() {
  const countries = countriesData.countries;
  const batch = db.batch();
  const collectionRef = db.collection("countries");

  countries.forEach((country) => {
    // Har bir davlat uchun id ni hujjat nomi sifatida ishlatamiz
    const docRef = collectionRef.doc(country.id.toString());
    
    batch.set(docRef, {
      ...country,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  });

  try {
    await batch.commit();
    console.log(`✅ Muvaffaqiyatli: ${countries.length} ta davlat ma'lumotlari Firestore-ga yuklandi!`);
  } catch (error) {
    console.error("❌ Xatolik yuz berdi:", error);
    process.exit(1);
  }
}

uploadCountries();
