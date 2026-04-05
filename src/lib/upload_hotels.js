const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const fs = require("fs");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

// JSON faylingiz yo'lini tekshirib oling
const hotelsData = JSON.parse(fs.readFileSync("./data/hotels_db.json", "utf8"));

async function uploadHotelsData() {
  const hotels = hotelsData.hotels;
  const batch = db.batch();

  hotels.forEach((hotel) => {
    // Har bir mehmonxona uchun yangi document referensi
    const docRef = db.collection("hotels").doc(); 
    
    batch.set(docRef, {
      id: hotel.id,
      name: hotel.name,
      city: hotel.city, // Bu yerda {uz, ru, en} ob'ekti saqlanadi
      price: Number(hotel.price),
      rating: Number(hotel.rating),
      reviews: Number(hotel.reviews),
      image: hotel.image,
      featured: hotel.featured || false,
      // Agar qo'shimcha qulayliklar bo'lsa:
      amenities: hotel.amenities || [],
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  });

  try {
    await batch.commit();
    console.log("✅ Kyuro: Boss, barcha 20 ta mehmonxona muvaffaqiyatli yuklandi!");
  } catch (error) {
    console.error("❌ Xatolik yuz berdi:", error);
  }
}

uploadHotelsData();