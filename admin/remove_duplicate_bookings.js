const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function removeDuplicates() {
  const collectionRef = db.collection("bookings");
  const snapshot = await collectionRef.get();
  
  console.log(`📊 Jami band qilingan biletlar (bookings) soni: ${snapshot.size}`);

  const bookingsByKey = {};

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    
    // Qaysi reysdagi qaysi joy ekanligini aniqlovchi noyob kalit (unique key)
    const flightKey = `${data.company}_${JSON.stringify(data.from)}_${JSON.stringify(data.to)}_${data.date}_${data.time}`;
    const seatKey = `${flightKey}_${data.seat}`;

    if (!bookingsByKey[seatKey]) {
      bookingsByKey[seatKey] = [];
    }
    
    bookingsByKey[seatKey].push({
      id: doc.id,
      ref: doc.ref,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(0), // Eng birinchi olinganini saqlash uchun
    });
  });

  const batch = db.batch();
  let deleteCount = 0;

  for (const [key, bookings] of Object.entries(bookingsByKey)) {
    if (bookings.length > 1) {
      // Vaqt bo'yicha saralash: birinchi yaratilganini saqlab qolamiz, qolganlarini o'chiramiz
      bookings.sort((a, b) => a.createdAt - b.createdAt);
      
      const keep = bookings[0];
      const duplicates = bookings.slice(1);
      
      console.log(`⚠️ Duplikat aniqlandi: ${key}`);
      console.log(`   -> Asl nusxa sifatida saqlanmoqda: ${keep.id}`);
      
      duplicates.forEach(dup => {
        console.log(`   -> O'chirilmoqda: ${dup.id}`);
        batch.delete(dup.ref);
        deleteCount++;
      });
    }
  }

  if (deleteCount > 0) {
    await batch.commit();
    console.log(`✅ Jami ${deleteCount} ta o'xshash (duplikat) biletlar muvaffaqiyatli o'chirildi!`);
  } else {
    console.log("✅ Baza toza. Bitta joyga ikkita bilet olingan holatlar topilmadi.");
  }
}

removeDuplicates()
  .then(() => process.exit(0))
  .catch(err => {
    console.error("❌ Xatolik yuz berdi:", err);
    process.exit(1);
  });
