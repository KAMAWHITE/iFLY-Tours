"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { useApp } from "../../../app/LanguageContext";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import InfoUz from "../../../../locales/uz/Info.json";
import InfoRu from "../../../../locales/ru/Info.json";
import InfoEn from "../../../../locales/en/Info.json";
import { X, Users, MapPin, Building2, Coins, Globe, ArrowRight } from "lucide-react";
import Loading from "@/Components/Common/Loading";

const CountryInfo = () => {
    const { til, darkMode } = useApp();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AOS.init({ easing: "ease-out-cubic", once: true, offset: 50, duration: 700 });

        const fetchCountries = async () => {
            try {
                const q = query(collection(db, "countries"), orderBy("id", "asc"));
                const querySnapshot = await getDocs(q);
                const fetchedCountries = querySnapshot.docs.map(doc => ({
                    firebaseId: doc.id,
                    ...doc.data()
                }));
                setCountries(fetchedCountries);
            } catch (error) {
                console.error("Error fetching countries:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCountries();
    }, []);

    const getModalContent = (country) => {
        // Modal uchun qo'shimcha ma'lumotlar hali ham Info.json'dan kelishi mumkin
        // Lekin biz Firestore'dan kelgan yangi maydonlarni (aholi, maydon, valyuta) prioritizatsiya qilamiz
        let d = {};
        try {
            const src = til === "ru" ? InfoRu : til === "en" ? InfoEn : InfoUz;
            d = src?.Country_info?.find((it) => it.id === country.id) || {};
        } catch { /* */ }

        // Firestore dan kelgan ma'lumotlarni tilga qarab ajratamiz
        const translate = (field) => field?.[til] || field?.uz || "—";

        return {
            img:       country.image || d.img || "/placeholder.jpg",
            title:     translate(country.title) || d.title || "Noma'lum",
            desc:      translate(country.desc) || d.text || "Ma'lumot topilmadi",
            population:translate(country.population) || d.aholi || "—",
            area:      translate(country.area) || d.hudud || "—",
            cities:    d.shaxarlar || "—", // Shaxarlar hali firestore'da yo'q
            currency:  translate(country.currency) || d.valyuta || "—",
            closeBtn:  d.btn1 || (til === "ru" ? "ЗАКРЫТЬ" : til === "en" ? "CLOSE" : "YOPISH"),
        };
    };

    const openModal = (c) => { setSelectedCountry(c); setIsModalOpen(true); };
    const closeModal = () => { setIsModalOpen(false); setSelectedCountry(null); };

    const parseField = (raw = "") => {
        if (typeof raw !== "string") return { label: "", value: raw };
        const parts = raw.split(": ");
        if (parts.length > 1) {
            return { label: parts[0], value: parts[1] };
        }
        return { label: "", value: raw };
    };

    return (
        <section className={`py-16 sm:py-20 ${darkMode ? "bg-slate-900" : "bg-gray-50"}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section Header */}
                <div className="text-center mb-12" data-aos="fade-up">
                    <div className={`inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full border mb-4 ${
                        darkMode ? "bg-slate-800 border-slate-700 text-orange-400" : "bg-orange-50 border-orange-100 text-orange-600"
                    }`}>
                        <Globe size={13} />
                        {til === "ru" ? "Направления" : til === "en" ? "Destinations" : "Yo'nalishlar"}
                    </div>
                    <h2 className={`text-3xl sm:text-4xl font-black section-title ${darkMode ? "text-white" : "text-gray-900"}`}>
                        {til === "ru" ? "Путешествуйте в удовольствие" : til === "en" ? "Journey for enjoyment" : "Zavqlanish uchun sayohat"}
                    </h2>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {!loading ? countries.map((country, i) => (
                        <div
                            key={country.firebaseId}
                            data-aos="fade-up"
                            data-aos-delay={`${(i % 4) * 80}`}
                            className={`group flex flex-col rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border ${
                                darkMode
                                    ? "bg-slate-800 border-slate-700 hover:border-orange-500/30"
                                    : "bg-white border-gray-100 hover:border-orange-200"
                            }`}
                        >
                            {/* Image */}
                            <div className="relative h-48 overflow-hidden flex-shrink-0">
                                <Image
                                    src={country.image}
                                    alt={country.title?.[til] || country.title?.uz}
                                    width={400}
                                    height={250}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                {/* Country chip overlay */}
                                <div className="absolute top-3 right-3">
                                    <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                                        <MapPin size={9} />
                                        {(country.title?.[til] || country.title?.uz).split(",")[1]?.trim() || ""}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-5 flex flex-col flex-1">
                                <h3 className={`font-black text-base leading-snug mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                                    {country.title?.[til] || country.title?.uz}
                                </h3>
                                <p className={`text-sm leading-relaxed line-clamp-2 mb-4 flex-1 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                                    {country.desc?.[til] || country.desc?.uz}
                                </p>
                                <button
                                    onClick={() => openModal(country)}
                                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 group/btn ${
                                        darkMode
                                            ? "bg-slate-700 text-white hover:bg-orange-500 border border-slate-600 hover:border-orange-500"
                                            : "bg-gray-900 text-white hover:bg-orange-500"
                                    }`}
                                >
                                    {til === "ru" ? "Подробнее" : til === "en" ? "Learn More" : "Batafsil"}
                                    <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-20">
                            <Loading 
                                fullScreen={false} 
                                size={120} 
                                text={til === "ru" ? "Загрузка направлений..." : til === "en" ? "Loading destinations..." : "Yo'nalishlar yuklanmoqda..."} 
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* ── MODAL ── */}
            {isModalOpen && selectedCountry && (() => {
                const c = getModalContent(selectedCountry);
                const stats = [
                    { icon: <Users size={14} />, raw: c.population, label: til === "ru" ? "Население" : til === "en" ? "Population" : "Aholisi" },
                    { icon: <MapPin size={14} />, raw: c.area, label: til === "ru" ? "Площадь" : til === "en" ? "Area" : "Maydoni" },
                    { icon: <Coins size={14} />, raw: c.currency, label: til === "ru" ? "Валюта" : til === "en" ? "Currency" : "Valyuta" },
                ];
                return (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={closeModal} />
                        <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-fade-up ${
                            darkMode ? "bg-slate-800" : "bg-white"
                        }`}>
                            {/* Hero image */}
                            <div className="relative h-56 w-full">
                                <Image src={c.img} alt={c.title} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-black/10" />
                                <button
                                    onClick={closeModal}
                                    className="absolute top-4 right-4 p-2 bg-black/30 backdrop-blur-sm rounded-xl text-white hover:bg-black/50 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                                <div className="absolute bottom-5 left-6">
                                    <p className={`text-white/60 text-xs font-bold uppercase tracking-widest mb-1`}>
                                        {til === "ru" ? "Направление" : til === "en" ? "Destination" : "Yo'nalish"}
                                    </p>
                                    <h3 className="text-white font-black text-2xl leading-tight">{c.title}</h3>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <p className={`text-sm leading-relaxed mb-6 italic ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                                    "{c.desc}"
                                </p>

                                {/* Stats grid */}
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {stats.map((s, i) => {
                                        const { label: parsedLabel, value } = parseField(s.raw);
                                        const label = parsedLabel || s.label;
                                        return (
                                            <div
                                                key={i}
                                                className={`flex items-start gap-3 p-3 rounded-2xl border-l-4 border-orange-500 ${
                                                    darkMode ? "bg-slate-700" : "bg-orange-50"
                                                }`}
                                            >
                                                <span className={`mt-0.5 flex-shrink-0 ${darkMode ? "text-orange-400" : "text-orange-500"}`}>{s.icon}</span>
                                                <div>
                                                    <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 dark:text-slate-500">{label}</p>
                                                    <p className={`text-sm font-black mt-0.5 ${darkMode ? "text-white" : "text-gray-900"}`}>{value}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <button
                                    onClick={closeModal}
                                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white rounded-2xl font-black text-xs tracking-[3px] uppercase transition-all active:scale-[0.98] shadow-lg shadow-orange-200 dark:shadow-orange-900/20"
                                >
                                    {c.closeBtn}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </section>
    );
};

export default CountryInfo;