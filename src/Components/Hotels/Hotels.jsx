"use client";
import React, { useState, useMemo, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../lib/firebase";
import { FaSearch, FaMapMarkerAlt, FaTimes, FaCalendarAlt } from "react-icons/fa";
import { useApp } from "../../app/LanguageContext";
import { useRouter } from "next/navigation";

import HotelsUz from "../../../locales/uz/Hotels.json";
import HotelsEn from "../../../locales/en/Hotels.json";
import HotelsRu from "../../../locales/ru/Hotels.json";

const translations = {
    uz: HotelsUz,
    ru: HotelsRu,
    en: HotelsEn,
};

// Shaharlar ID-si JSON'dagi selectors bilan bir xil bo'lishi kerak
const DESTINATIONS = [
    { id: "sel_1", en: "Rome" }, { id: "sel_2", en: "Giza" }, { id: "sel_3", en: "Kyoto" },
    { id: "sel_4", en: "Petra" }, { id: "sel_5", en: "Machu Picchu" }, { id: "sel_6", en: "Maldives" },
    { id: "sel_7", en: "Bora Bora" }, { id: "sel_8", en: "Bali" }, { id: "sel_9", en: "Santorini" },
    { id: "sel_10", en: "Amalfi Coast" }, { id: "sel_11", en: "Dubai" }, { id: "sel_12", en: "New York" },
    { id: "sel_13", en: "Paris" }, { id: "sel_14", en: "Tokyo" }, { id: "sel_15", en: "London" },
    { id: "sel_16", en: "Iceland" }, { id: "sel_17", en: "Banff National Park" },
    { id: "sel_18", en: "Cappadocia" }, { id: "sel_19", en: "Serengeti" }, { id: "sel_20", en: "Swiss Alps" }
];

export default function Hotels() {
    const { darkMode, til } = useApp();
    const t = translations[til] || translations.en; // Hozirgi til obyekti

    const router = useRouter();
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCity, setSelectedCity] = useState("All");
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "hotels"));
                const data = querySnapshot.docs.map(doc => ({
                    firebaseId: doc.id,
                    ...doc.data()
                }));
                setHotels(data);
            } catch (error) {
                console.error("Error fetching hotels:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    const calculateNights = () => {
        if (!checkIn || !checkOut) return 1;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 1;
    };

    const handleBookHotel = async (hotel) => {
        const user = auth.currentUser;
        if (!user) {
            alert(language === "uz" ? "Boss, avval tizimga kirishingiz kerak!" : "Please login first!");
            router.push("/auth");
            return;
        }

        if (!checkIn || !checkOut) {
            alert(language === "uz" ? "Sanalarni tanlang!" : "Select dates!");
            return;
        }

        setBookingLoading(true);
        const nights = calculateNights();
        const totalPrice = hotel.price * nights;

        try {
            await addDoc(collection(db, "hotel_bookings"), {
                userId: user.uid,
                hotelId: hotel.firebaseId,
                hotelName: hotel.name,
                image: hotel.image,
                city: hotel.city,
                price: totalPrice,
                nights: nights,
                checkIn,
                checkOut,
                bookedAt: serverTimestamp(),
            });
            alert(language === "uz" ? "Muvaffaqiyatli band qilindi!" : "Successfully booked!");
            setSelectedHotel(null);
            router.push("/profile");
        } catch (error) {
            alert("Error: " + error.message);
        } finally {
            setBookingLoading(false);
        }
    };

    const filteredHotels = useMemo(() => {
        return hotels.filter(hotel => {
            const cityName = hotel.city[til] || hotel.city.en;
            const matchesSearch =
                hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cityName.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = selectedCity === "All" || hotel.city.en === selectedCity;
            return matchesSearch && matchesCity;
        });
    }, [searchQuery, selectedCity, hotels, til]);

    if (loading) return (
        <div className={`min-h-screen flex flex-col items-center justify-center gap-5 ${darkMode ? "bg-slate-950" : "bg-gray-50"}`}>
            <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin-smooth" />
            <p className={`text-sm font-semibold ${darkMode ? "text-slate-500" : "text-gray-400"}`}>
                {til === "ru" ? "Загрузка..." : til === "en" ? "Loading..." : "Yuklanmoqda..."}
            </p>
        </div>
    );

    return (
        <div className={`min-h-screen w-full pb-20 ${darkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>

            {/* Header Section */}
            <div className={`w-full pt-24 pb-20 px-4 relative overflow-hidden ${darkMode ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" : "bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500"}`}>
                <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl translate-x-1/2 -translate-y-1/4 pointer-events-none" />
                <div className="max-w-6xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-6">{t.BigTitle}</h1>
                    <div className="max-w-3xl mx-auto relative">
                        <div className="bg-white p-2 rounded-[25px] shadow-2xl flex flex-col md:flex-row gap-2">
                            <div className="flex-1 flex items-center px-4 gap-3 border-r border-gray-100 text-gray-800">
                                <FaSearch className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t.SearchInput}
                                    className="w-full py-3 outline-none font-medium"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <select
                                className="bg-gray-100 p-4 rounded-2xl font-bold text-gray-700 outline-none min-w-[150px]"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                            >
                                <option value="All">{t.selectors.sel_0}</option>
                                {DESTINATIONS.map(city => (
                                    <option key={city.id} value={city.en}>{t.selectors[city.id]}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="max-w-7xl mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredHotels.map((hotel) => (
                        <div
                            key={hotel.firebaseId}
                            onClick={() => setSelectedHotel(hotel)}
                            className={`group rounded-3xl overflow-hidden border-2 transition-all duration-500 cursor-pointer hover:-translate-y-1 ${darkMode ? "bg-slate-900 border-slate-800 hover:border-orange-500/50" : "bg-white border-gray-100 shadow-sm hover:shadow-xl hover:border-orange-300"}`}
                        >
                            <div className="relative h-56 overflow-hidden">
                                <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="p-5">
                                <h3 className="font-black text-lg truncate mb-1">{hotel.name}</h3>
                                <p className={`text-sm font-medium mb-2 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{hotel.city?.[til] || hotel.city?.en}</p>
                                <p className="text-xl font-black text-orange-500">
                                    {Number(hotel.price).toLocaleString()}
                                    <span className={`text-xs font-medium ml-1 ${darkMode ? "text-slate-500" : "text-gray-400"}`}>/ {t.modal.duration_time}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── HOTEL DETAILS MODAL ── */}
            {selectedHotel && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedHotel(null)} />
                    <div className={`relative w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-3xl shadow-2xl ${darkMode ? "bg-slate-900 text-white" : "bg-white text-gray-900"}`}>

                        {/* Modal hero image */}
                        <div className="relative h-60 w-full overflow-hidden rounded-t-3xl">
                            <img src={selectedHotel.image} className="w-full h-full object-cover" alt={selectedHotel.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <button
                                onClick={() => setSelectedHotel(null)}
                                className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm text-white rounded-xl hover:bg-black/50 transition-colors"
                            >
                                <FaTimes size={16} />
                            </button>
                            <div className="absolute bottom-5 left-6">
                                <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">
                                    {til === "ru" ? "Отель" : til === "en" ? "Hotel" : "Mehmonxona"}
                                </p>
                                <h2 className="text-white font-black text-2xl">{selectedHotel.name}</h2>
                                <p className="text-white/70 text-sm flex items-center gap-1.5 mt-1">
                                    <FaMapMarkerAlt size={11} /> {selectedHotel.city?.[til] || selectedHotel.city?.en}
                                </p>
                            </div>
                        </div>

                        {/* Modal body */}
                        <div className="p-6">
                            {/* Date pickers */}
                            <div className="grid grid-cols-2 gap-3 mb-5">
                                <div>
                                    <label className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${darkMode ? "text-slate-500" : "text-gray-400"}`}>{t.modal.from}</label>
                                    <div className={`flex items-center gap-2 p-3.5 rounded-xl border-2 transition-colors ${darkMode ? "bg-slate-800 border-slate-700 focus-within:border-orange-500" : "bg-gray-50 border-gray-100 focus-within:border-orange-400"}`}>
                                        <FaCalendarAlt className="text-orange-500 text-sm flex-shrink-0" />
                                        <input
                                            type="date"
                                            className="bg-transparent outline-none text-xs font-bold w-full"
                                            value={checkIn}
                                            min={new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={`text-[10px] font-bold uppercase tracking-widest mb-2 block ${darkMode ? "text-slate-500" : "text-gray-400"}`}>{t.modal.to}</label>
                                    <div className={`flex items-center gap-2 p-3.5 rounded-xl border-2 transition-colors ${darkMode ? "bg-slate-800 border-slate-700 focus-within:border-orange-500" : "bg-gray-50 border-gray-100 focus-within:border-orange-400"}`}>
                                        <FaCalendarAlt className="text-orange-500 text-sm flex-shrink-0" />
                                        <input
                                            type="date"
                                            className="bg-transparent outline-none text-xs font-bold w-full"
                                            value={checkOut}
                                            min={checkIn || new Date().toISOString().split("T")[0]}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Price summary */}
                            <div className={`flex items-center justify-between p-4 rounded-2xl mb-5 border-l-4 border-orange-500 ${darkMode ? "bg-slate-800" : "bg-orange-50"}`}>
                                <div>
                                    <p className={`text-xs font-bold mb-0.5 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{t.modal.duration}: {calculateNights()} {t.modal.duration_time}</p>
                                    <p className={`text-sm font-bold ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{t.modal.total_price}</p>
                                </div>
                                <p className="text-2xl font-black text-orange-500">
                                    {(selectedHotel.price * calculateNights()).toLocaleString()}
                                    <span className="text-xs font-medium ml-1 text-gray-400">UZS</span>
                                </p>
                            </div>

                            {/* Book button */}
                            <button
                                disabled={bookingLoading}
                                onClick={() => handleBookHotel(selectedHotel)}
                                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white py-4 rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg shadow-orange-200 dark:shadow-none active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {bookingLoading
                                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> {til === "ru" ? "Бронирование..." : til === "en" ? "Booking..." : "Band qilinmoqda..."}</>
                                    : t.modal.book_now
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}