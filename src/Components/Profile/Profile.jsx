"use client";
import { useState, useEffect } from "react";
import { auth, db } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { FaSignOutAlt, FaPlane, FaHotel, FaStar, FaMapMarkerAlt, FaUserCircle, FaMoon, FaSun, FaCalendarAlt, FaClock } from "react-icons/fa";
import { useApp } from "../../app/LanguageContext";
import Loading from "../Common/Loading";

export default function ProfilePage() {
    const router = useRouter();
    const { darkMode, toggleDarkMode, til } = useApp();
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) setUserData(userDoc.data());
                fetchUserActivities(currentUser.uid);
            } else {
                router.push("/auth");
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [router]);

    const fetchUserActivities = async (uid) => {
        try {
            const now = new Date();

            // 1. Parvozlarni olish (Active Flights)
            const qFlights = query(collection(db, "bookings"), where("userId", "==", uid));
            const flightSnap = await getDocs(qFlights);
            const activeFlights = flightSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(ticket => {
                    if (!ticket.date) return true; // Sana bo'lmasa ko'rsataveramiz
                    try {
                        const flightDate = new Date(`${ticket.date}T${ticket.time || "23:59"}`);
                        return flightDate >= now;
                    } catch (e) {
                        return true;
                    }
                })
                .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)); // Client-side sorting
            setBookings(activeFlights);

            // 2. Mehmonxonalarni olish (Active Stays)
            const qHotels = query(collection(db, "hotel_bookings"), where("userId", "==", uid), orderBy("bookedAt", "desc"));
            const hotelSnap = await getDocs(qHotels);
            const activeHotels = hotelSnap.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(hotel => {
                    // checkOut sanasi bo'yicha filtrlaymiz (muddati o'tgan bo'lsa chiqmaydi)
                    const checkOutDate = new Date(hotel.checkOut || hotel.bookedAt);
                    return checkOutDate >= now;
                });
            setHotelBookings(activeHotels);

        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    if (loading) return <Loading fullScreen={true} text={til === "ru" ? "Загрузка..." : til === "en" ? "Loading Dashboard..." : "Yuklanmoqda..."} />;

    return (
        <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"} p-4 md:p-6 pt-24`}>
            <div className="max-w-[1600px] lg:mt-10 mx-auto">

                {/* Header */}
                <div className={`mb-8 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 ${darkMode ? "bg-slate-900 border border-slate-800" : "bg-white shadow-sm border border-gray-100"}`}>
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-lg shadow-orange-200 dark:shadow-none bg-gradient-to-br from-orange-500 to-rose-500">
                            {userData?.photoURL ? (
                                <img 
                                    src={userData.photoURL} 
                                    alt="" 
                                    className="w-full h-full object-cover" 
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white">
                                    {userData?.firstName?.[0] || <FaUserCircle />}
                                </div>
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-black">Welcome back, {userData?.firstName || "Boss"}!</h2>
                            <p className={`text-sm ${darkMode ? "text-slate-500" : "text-gray-400"}`}>{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => signOut(auth)}
                            className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-200 dark:shadow-none hover:shadow-red-300 transition-all"
                        >
                            <FaSignOutAlt /> {til === "ru" ? "Выйти" : til === "en" ? "Log Out" : "Chiqish"}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Flights Column */}
                    <div className={`flex flex-col rounded-2xl overflow-hidden border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-sm"}`}>
                        <div className={`p-5 border-b flex items-center justify-between ${darkMode ? "border-slate-800" : "border-gray-100"}`}>
                            <h3 className="text-base font-black flex items-center gap-2">
                                <span className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center"><FaPlane className="text-orange-500" size={14} /></span>
                                {til === "ru" ? "Рейсы" : til === "en" ? "Flights" : "Parvozlar"}
                            </h3>
                            <span className={`text-xs font-black px-3 py-1 rounded-full ${darkMode ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-500"}`}>{bookings.length}</span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {bookings.length === 0 ? (
                                <div className={`text-center py-10 rounded-2xl border-2 border-dashed ${darkMode ? "border-slate-800 text-slate-600" : "border-gray-200 text-gray-400"}`}>
                                    <p className="text-3xl mb-2">✈️</p>
                                    <p className="text-sm font-semibold">{til === "ru" ? "Нет рейсов" : til === "en" ? "No active flights" : "Parvozlar yo'q"}</p>
                                </div>
                            ) : (
                                bookings.map(ticket => (
                                    <div key={ticket.id} className={`p-4 rounded-2xl border transition-all hover:-translate-y-0.5 ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-gray-100 shadow-sm"}`}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center p-1.5 ${darkMode ? "bg-slate-700" : "bg-gray-50"}`}>
                                                    <img src={ticket.logo} alt="" className="w-full h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="font-black text-sm">{ticket.from?.[til] || ticket.from?.uz} → {ticket.to?.[til] || ticket.to?.uz}</p>
                                                    <p className={`text-[10px] uppercase font-bold ${darkMode ? "text-slate-500" : "text-gray-400"}`}>{ticket.date} • {ticket.time}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`text-[9px] uppercase font-bold tracking-wider ${darkMode ? "text-slate-600" : "text-gray-400"}`}>SEAT</p>
                                                <p className="font-black text-lg text-orange-500">{ticket.seat}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Hotels Column */}
                    <div className={`flex flex-col rounded-2xl overflow-hidden border ${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-gray-100 shadow-sm"}`}>
                        <div className={`p-5 border-b flex items-center justify-between ${darkMode ? "border-slate-800" : "border-gray-100"}`}>
                            <h3 className="text-base font-black flex items-center gap-2">
                                <span className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center"><FaHotel className="text-rose-500" size={13} /></span>
                                {til === "ru" ? "Отели" : til === "en" ? "Hotel Stays" : "Mehmonxonalar"}
                            </h3>
                            <span className={`text-xs font-black px-3 py-1 rounded-full ${darkMode ? "bg-slate-800 text-slate-400" : "bg-gray-100 text-gray-500"}`}>{hotelBookings.length}</span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {hotelBookings.length === 0 ? (
                                <div className={`text-center py-10 rounded-2xl border-2 border-dashed ${darkMode ? "border-slate-800 text-slate-600" : "border-gray-200 text-gray-400"}`}>
                                    <p className="text-3xl mb-2">🏨</p>
                                    <p className="text-sm font-semibold">{til === "ru" ? "Нет бронирований" : til === "en" ? "No hotel stays" : "Mehmonxona yo'q"}</p>
                                </div>
                            ) : (
                                hotelBookings.map(hotel => (
                                    <div key={hotel.id} className={`p-3.5 rounded-2xl border transition-all hover:-translate-y-0.5 ${darkMode ? "bg-slate-800 border-slate-700 hover:border-orange-500/50" : "bg-white border-gray-100 shadow-sm hover:shadow-md"}`}>
                                        <div className="flex gap-3.5">
                                            <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                                                <img src={hotel.image} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <div className="min-w-0">
                                                        <h4 className="font-black text-sm truncate">{hotel.hotelName}</h4>
                                                        <p className={`text-[10px] flex items-center gap-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                                                            <FaMapMarkerAlt size={8} /> {hotel.city?.en}
                                                        </p>
                                                    </div>
                                                    <div className="text-right flex-shrink-0 ml-2">
                                                        <p className={`text-[9px] uppercase font-bold tracking-wider ${darkMode ? "text-slate-600" : "text-gray-400"}`}>Total</p>
                                                        <p className="font-black text-sm text-orange-500">{Number(hotel.price).toLocaleString()} UZS</p>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 gap-1.5">
                                                    <div className={`flex items-center gap-1.5 p-1.5 rounded-lg ${darkMode ? "bg-slate-700" : "bg-gray-50"}`}>
                                                        <FaCalendarAlt size={9} className="text-orange-500" />
                                                        <span className="text-[9px] font-bold opacity-70">{hotel.checkIn} → {hotel.checkOut}</span>
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 p-1.5 rounded-lg ${darkMode ? "bg-slate-700" : "bg-gray-50"}`}>
                                                        <FaClock size={9} className="text-rose-500" />
                                                        <span className="text-[9px] font-bold opacity-70">{hotel.nights} {til === "ru" ? "ночь" : til === "en" ? "night(s)" : "kecha"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}