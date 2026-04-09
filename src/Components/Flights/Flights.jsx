"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
    FaSearch, FaTimes, FaExchangeAlt, FaPlaneDeparture, FaCheckCircle,
} from "react-icons/fa";
import { useApp } from "../../app/LanguageContext";
import { useRouter } from "next/navigation";
import { db, auth } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, updateDoc, doc, arrayUnion } from "firebase/firestore";
import toast from "react-hot-toast";
import Loading from "../Common/Loading";

import FlightsUz from "../../../locales/uz/Flights.json";
import FlightsRu from "../../../locales/ru/Flights.json";
import FlightsEn from "../../../locales/en/Flights.json";

const translations = { uz: FlightsUz, ru: FlightsRu, en: FlightsEn };

const norm = (val) => {
    if (!val) return "";
    const res = (typeof val === "object") ? (val.uz || "") : val;
    return String(res).toLowerCase().trim();
};

function buildDoc(userId, flight, seat, extra = {}) {
    return {
        userId,
        company: flight.company,
        logo: flight.logo,
        from: flight.from,
        to: flight.to,
        date: flight.date,
        time: flight.time,
        cost: flight.price,
        currency: flight.currency ?? "UZS",
        seat,
        createdAt: serverTimestamp(),
        ...extra,
    };
}

function SeatMapModal({ isOpen, onClose, onConfirm, flight, darkMode, t, til }) {
    const [sel, setSel] = useState(null);
    useEffect(() => { if (isOpen) setSel(null); }, [isOpen]);
    if (!isOpen || !flight) return null;

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 backdrop-blur-md p-3">
            <div className={`w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden
                ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>

                <div className="flex justify-between items-start p-4 sm:p-8 border-b border-gray-100 dark:border-gray-700">
                    <div className="min-w-0 flex-1 pr-4">
                        <h3 className="text-2xl font-black truncate">{flight.company}</h3>
                        <p className="text-sm text-orange-500 font-bold truncate">
                            {flight.from?.[til]} ✈️ {flight.to?.[til]}
                        </p>
                    </div>
                    <button onClick={onClose}
                        className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="p-4 sm:p-8 flex flex-col items-center bg-slate-50 dark:bg-gray-900/40 overflow-x-auto scrollbar-hide">
                    <div className="w-40 h-8 bg-gray-300 dark:bg-gray-700 rounded-t-full mb-8 flex items-center justify-center flex-shrink-0">
                        <span className="text-[10px] uppercase font-bold opacity-40 tracking-widest">{t.front}</span>
                    </div>
                    <div className="grid gap-3">
                        {[1, 2, 3, 4, 5, 6].map((row) => (
                            <div key={row} className="flex gap-1.5 sm:gap-2 items-center justify-center">
                                <span className="w-5 text-[10px] font-black text-gray-400">{row}</span>
                                {["A", "B", "C", "D", "E", "F"].map((col, idx) => {
                                    const id = `${row}${col}`;
                                    const taken = Array.isArray(flight.occupiedSeats) && flight.occupiedSeats.includes(id);
                                    return (
                                        <React.Fragment key={col}>
                                            <button disabled={taken} onClick={() => setSel(id)}
                                                className={`w-[34px] sm:w-10 h-10 sm:h-11 rounded-xl text-[10px] font-black transition-all
                                                    flex items-center justify-center border-2
                                                    ${taken
                                                        ? "bg-gray-300 border-gray-400 text-gray-500 cursor-not-allowed"
                                                        : sel === id
                                                            ? "bg-blue-600 border-blue-700 text-white scale-110 shadow-lg"
                                                            : "bg-white dark:bg-gray-700 border-green-500 text-green-600 hover:bg-green-500 hover:text-white"
                                                    }`}
                                            >{col}</button>
                                            {idx === 2 && <div className="w-4 sm:w-6" />}
                                        </React.Fragment>
                                    );
                                })}
                                <span className="w-5" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-4 sm:p-8 flex justify-between items-center">
                    <div>
                        <p className="text-gray-400 text-[10px] font-bold uppercase">{t.selected}</p>
                        <p className="text-2xl sm:text-3xl font-black text-orange-500">{sel || "--"}</p>
                    </div>
                    <button disabled={!sel} onClick={() => onConfirm(flight, sel)}
                        className={`px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-xs sm:text-sm font-black transition-all
                            ${sel ? "bg-orange-500 hover:bg-orange-600 text-white shadow-lg active:scale-95"
                                : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                        {t.confirmSeat}
                    </button>
                </div>
            </div>
        </div>
    );
}

function PaymentModal({ isOpen, t, countdown }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <div className="w-full max-w-lg bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[40px] p-6 sm:p-10 text-center relative overflow-hidden shadow-[0_0_50px_rgba(255,165,0,0.2)] border border-white/10">
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl animate-pulse" />

                <div className="relative z-10 space-y-6">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.5)] animate-bounce">
                            <span className="text-3xl sm:text-4xl text-white">💳</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-3xl font-black text-white">{t.payment_message}</h3>
                        <p className="text-orange-400 font-bold uppercase tracking-[0.2em] text-xs">
                            {t.redirecting}
                        </p>
                    </div>

                    <div className="flex justify-center items-center gap-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl sm:text-3xl font-black text-orange-500">
                            {countdown}
                        </div>
                    </div>

                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                        <div
                            className="bg-gradient-to-r from-orange-500 to-rose-500 h-full transition-all duration-1000 ease-linear"
                            style={{ width: `${(countdown / 5) * 100}%` }}
                        />
                    </div>

                    <p className="text-gray-400 text-xs font-medium">
                        iFLY-Tours Premium Experience
                    </p>
                </div>
            </div>
        </div>
    );
}

function FlightCard({ flight, til, darkMode, t, isSelected, onSelect }) {
    return (
        <div onClick={onSelect}
            className={`p-5 sm:p-6 rounded-2xl border-2 transition-all cursor-pointer group relative
                ${isSelected
                    ? darkMode ? "bg-slate-800 border-orange-500 shadow-lg" : "bg-orange-50 border-orange-400 shadow-lg"
                    : darkMode ? "bg-slate-900 border-slate-800 hover:border-orange-500/70 hover:bg-slate-800"
                        : "bg-gray-200 border-gray-300 shadow-sm hover:shadow-xl hover:border-orange-400"}`}>
            {isSelected && (
                <div className="absolute top-4 right-4">
                    <FaCheckCircle className="text-orange-500" size={20} />
                </div>
            )}
            <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                <div className="flex items-center justify-center lg:justify-start gap-3 w-full lg:w-1/4 min-w-0">
                    <img src={flight.logo} alt=""
                        className="w-10 h-10 lg:w-12 lg:h-12 object-contain flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <h4 className="font-black text-sm lg:text-base xl:text-lg truncate">{flight.company}</h4>
                </div>
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-2 xl:gap-4 w-full px-2 min-w-0">
                    <div className="text-center flex-1 min-w-0">
                        <p className="text-base lg:text-xl xl:text-2xl font-black truncate">{flight.from?.[til]}</p>
                        <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">{t.from}</p>
                    </div>
                    <div className="w-10 sm:w-12 lg:w-16 xl:w-20 flex-shrink-0">
                        <div className="w-full h-[1px] lg:h-[2px] bg-gray-200 relative">
                            <span className={`absolute -top-2 left-1/2 -translate-x-1/2 px-1 text-xs lg:text-sm transition-colors
                                ${darkMode
                                    ? "bg-slate-900 group-hover:bg-slate-800"
                                    : isSelected
                                        ? "bg-orange-50"
                                        : "bg-gray-200 group-hover:bg-gray-200"
                                }`}>✈️</span>
                        </div>
                    </div>
                    <div className="text-center flex-1 min-w-0">
                        <p className="text-base lg:text-xl xl:text-2xl font-black truncate">{flight.to?.[til]}</p>
                        <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase">{t.to}</p>
                    </div>
                </div>
                <div className="w-full lg:w-1/4 text-center lg:text-right border-t lg:border-t-0 pt-4 lg:pt-0
                    border-gray-100 dark:border-gray-800 flex-shrink-0">
                    <p className="text-xl sm:text-2xl font-black text-orange-500">
                        {Number(flight.price).toLocaleString()}
                        <span className="text-[10px] sm:text-xs ml-1 font-bold">{flight.currency ?? "UZS"}</span>
                    </p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 mt-1">{flight.date} • {flight.time}</p>
                </div>
            </div>
        </div>
    );
}

function FlightList({ flights, loading, darkMode, til, t, selectedId, onSelect }) {
    if (loading) return (
        <div className="py-16">
            <Loading fullScreen={false} size={150} text={t.loading || "Yuklanmoqda..."} />
        </div>
    );
    if (!flights.length) return (
        <div className={`text-center py-16 rounded-3xl border-2 border-dashed
            ${darkMode ? "border-slate-800 text-slate-600" : "border-gray-200 text-gray-400"}`}>
            <p className="text-5xl mb-3">✈️</p>
            <p className="font-black text-lg mb-1">{t.lenght_0}</p>
            <p className="text-sm">{t.message}</p>
        </div>
    );
    return (
        <div className="grid gap-3">
            {flights.map((f) => (
                <FlightCard key={f.id} flight={f} til={til} darkMode={darkMode} t={t}
                    isSelected={selectedId === f.id} onSelect={() => onSelect(f)} />
            ))}
        </div>
    );
}

export default function FlightsPage() {
    const { til, darkMode } = useApp();
    const t = translations[til] || FlightsUz;
    const router = useRouter();

    const [allFlights, setAllFlights] = useState([]);
    const [loading, setLoading] = useState(true);

    const [tripType, setTripTypeState] = useState("oneWay");
    const [isSwapped, setIsSwapped] = useState(false);
    const [destKey, setDestKey] = useState("");
    const [date, setDate] = useState("");
    const [returnDate, setReturnDate] = useState("");
    const [appliedQuery, setAppliedQuery] = useState(null);

    const [selectedDep, setSelectedDep] = useState(null);
    const [selectedRet, setSelectedRet] = useState(null);
    const [modal, setModal] = useState({ open: false, flight: null, direction: null });

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        let timer;
        if (showPaymentModal && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (showPaymentModal && countdown === 0) {
            router.push("/profile");
        }
        return () => clearInterval(timer);
    }, [showPaymentModal, countdown, router]);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const snap = await getDocs(collection(db, "flights"));
                setAllFlights(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
            } catch (e) { console.error(e); }
            finally { setLoading(false); }
        })();
    }, []);

    const DESTINATIONS = useMemo(() =>
        Object.keys(FlightsUz.selectors)
            .filter((k) => k !== "sel_0")
            .map((k) => ({ key: k, name: t.selectors[k] }))
        , [t]);

    const q = appliedQuery ?? { isSwapped, destKey, date, returnDate, tripType };

    const BASE_UZ = FlightsUz.selectors.sel_0;
    const TARGET_UZ = q.destKey
        ? FlightsUz.selectors[q.destKey]
        : "";

    const departureFlights = useMemo(() => {
        const fromUz = q.isSwapped ? TARGET_UZ : BASE_UZ;
        const toUz = q.isSwapped ? BASE_UZ : TARGET_UZ;

        return allFlights
            .filter((f) => {
                if (!appliedQuery && !q.destKey && !q.date) return true;

                const mFrom = !fromUz || norm(f.from) === norm(fromUz);
                const mTo = !toUz || norm(f.to) === norm(toUz);
                const mDate = !q.date || f.date === q.date;
                return mFrom && mTo && mDate;
            })
            .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    }, [allFlights, q.isSwapped, q.date, q.destKey, appliedQuery, BASE_UZ, TARGET_UZ]);

    const returnFlights = useMemo(() => {
        if (tripType !== "roundTrip") return [];

        const retFromUz = TARGET_UZ;
        const retToUz = BASE_UZ;

        return allFlights
            .filter((f) => {
                const mFrom = !retFromUz || norm(f.from) === norm(retFromUz);
                const mTo = !retToUz || norm(f.to) === norm(retToUz);
                const mDate = !q.returnDate || f.date === q.returnDate;
                return mFrom && mTo && mDate;
            })
            .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
    }, [allFlights, tripType, TARGET_UZ, BASE_UZ, q.returnDate]);

    const handleTripType = useCallback((type) => {
        setTripTypeState(type);
        if (type === "roundTrip") setIsSwapped(false);
        setAppliedQuery(null);
        setSelectedDep(null);
        setSelectedRet(null);
    }, []);

    const handleSearch = useCallback(() => {
        setAppliedQuery({ isSwapped, destKey, date, returnDate, tripType });
        setSelectedDep(null);
        setSelectedRet(null);
    }, [isSwapped, destKey, date, returnDate, tripType]);

    const handleReset = useCallback(() => {
        setDestKey(""); setDate(""); setReturnDate("");
        setTripTypeState("oneWay"); setIsSwapped(false);
        setAppliedQuery(null); setSelectedDep(null); setSelectedRet(null);
    }, []);

    const executeBooking = useCallback(async (dep, ret) => {
        const user = auth.currentUser;
        if (!user) { toast.error(t.no_token); return; }
        try {
            const col = collection(db, "bookings");
            if (tripType === "roundTrip" && dep?.flight && ret?.flight) {
                const depId = String(dep.flight.id || dep.flight.firebaseId || "");
                const retId = String(ret.flight.id || ret.flight.firebaseId || "");

                if (!depId || !retId) throw new Error("Flight ID missing");

                await Promise.all([
                    addDoc(col, buildDoc(user.uid, dep.flight, dep.seat, {
                        tripType: "roundTrip", direction: "departure",
                        linkedFlightDate: ret.flight.date,
                    })),
                    addDoc(col, buildDoc(user.uid, ret.flight, ret.seat, {
                        tripType: "roundTrip", direction: "return",
                        linkedFlightDate: dep.flight.date,
                    })),
                    updateDoc(doc(db, "flights", depId), {
                        occupiedSeats: arrayUnion(dep.seat)
                    }),
                    updateDoc(doc(db, "flights", retId), {
                        occupiedSeats: arrayUnion(ret.seat)
                    })
                ]);
            } else if (tripType === "oneWay" && dep?.flight) {
                const depId = String(dep.flight.id || dep.flight.firebaseId || "");
                if (!depId) throw new Error("Flight ID missing");

                await Promise.all([
                    addDoc(col, buildDoc(user.uid, dep.flight, dep.seat, {
                        tripType: "oneWay",
                    })),
                    updateDoc(doc(db, "flights", depId), {
                        occupiedSeats: arrayUnion(dep.seat)
                    })
                ]);
            }
            toast.success(t.complate);

            setShowPaymentModal(true);

        } catch (e) { console.error(e); toast.error(t.error); }
    }, [tripType, t, router]);

    const handleBook = useCallback(() => executeBooking(selectedDep, selectedRet), [executeBooking, selectedDep, selectedRet]);

    const canBook = tripType === "oneWay" ? !!selectedDep : !!(selectedDep && selectedRet);

    const handleSeatConfirm = useCallback((flight, seat) => {
        if (modal.direction === "dep") {
            const depData = { flight, seat };
            setSelectedDep(depData);
            if (tripType === "oneWay") {
                executeBooking(depData, null);
            }
        }
        if (modal.direction === "ret") {
            setSelectedRet({ flight, seat });
        }
        setModal({ open: false, flight: null, direction: null });
    }, [modal.direction, tripType, executeBooking]);

    const sectionLabel = useMemo(() => {
        const dest = destKey ? t.selectors[destKey] : "*";
        const from = isSwapped ? dest : t.selectors.sel_0;
        const to = isSwapped ? t.selectors.sel_0 : dest;
        return `${from} ✈️ ${to}${date ? ` • ${date}` : ""}`;
    }, [t, destKey, isSwapped, date]);

    const returnDateMin = date
        ? new Date(new Date(date).getTime() + 86400000).toISOString().split("T")[0]
        : "";

    return (
        <div className={`min-h-screen w-full relative overflow-x-hidden ${darkMode ? "bg-slate-950 text-white" : "bg-gray-50 text-gray-900"}`}>

            <div className={`w-full pt-24 pb-16 px-4 relative overflow-hidden
                ${darkMode
                    ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
                    : "bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500"}`}>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute w-96 h-96 rounded-full bg-white/5 blur-3xl -top-24 -left-24" />
                    <div className="absolute w-64 h-64 rounded-full bg-white/5 blur-3xl bottom-0 right-0" />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                    <h1 className="flex justify-center items-center gap-3 text-3xl sm:text-5xl font-black text-white mb-8 text-center">
                        <FaPlaneDeparture /> {t.search}
                    </h1>

                    <div className="bg-white p-4 sm:p-6 rounded-[30px] shadow-2xl space-y-5 text-gray-800">

                        <div className="flex p-1 bg-gray-100 rounded-2xl w-fit gap-1">
                            {["oneWay", "roundTrip"].map((type) => (
                                <button key={type} onClick={() => handleTripType(type)}
                                    className={`px-6 py-2 rounded-xl text-xs font-black transition-all
                                        ${tripType === type
                                            ? "bg-white text-orange-600 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"}`}>
                                    {type === "oneWay" ? t.oneWay : t.roundTrip}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 xl:gap-4 items-end">

                            <div className="lg:col-span-3 min-w-0">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{t.from}</label>
                                {!isSwapped ? (
                                    <input readOnly value={t.selectors.sel_0}
                                        className={`w-full p-4 bg-orange-50 border-2 rounded-2xl font-bold outline-none
                                            ${darkMode ? "border-gray-700 text-gray-600" : "border-orange-100 text-orange-600"}`} />
                                ) : (
                                    <select value={destKey} onChange={(e) => setDestKey(e.target.value)}
                                        className="w-full p-4 bg-gray-100 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-400">
                                        <option value="">{t.input}</option>
                                        {DESTINATIONS.map((d) => <option key={d.key} value={d.key}>{d.name}</option>)}
                                    </select>
                                )}
                            </div>

                            <div className="lg:col-span-1 flex justify-center pb-2">
                                <button
                                    onClick={() => tripType === "oneWay" && setIsSwapped((v) => !v)}
                                    disabled={tripType === "roundTrip"}
                                    className={`w-12 h-12 flex items-center justify-center rounded-full shadow-lg
                                        hover:rotate-180 transition-all duration-500 text-white
                                        ${darkMode ? "bg-gray-700" : "bg-orange-500"}
                                        ${tripType === "roundTrip" ? "opacity-30 cursor-not-allowed" : ""}`}>
                                    <FaExchangeAlt />
                                </button>
                            </div>

                            <div className="lg:col-span-3 min-w-0">
                                <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">{t.to}</label>
                                {isSwapped ? (
                                    <input readOnly value={t.selectors.sel_0}
                                        className={`w-full p-4 bg-orange-50 border-2 rounded-2xl font-bold outline-none
                                            ${darkMode ? "border-gray-700 text-gray-600" : "border-orange-100 text-orange-600"}`} />
                                ) : (
                                    <select value={destKey} onChange={(e) => setDestKey(e.target.value)}
                                        className="w-full p-4 bg-gray-100 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-400">
                                        <option value="">{t.input}</option>
                                        {DESTINATIONS.map((d) => <option key={d.key} value={d.key}>{d.name}</option>)}
                                    </select>
                                )}
                            </div>

                            <div className={`lg:col-span-5 grid gap-2 xl:gap-3 ${tripType === "roundTrip" ? "grid-cols-2" : "grid-cols-1"}`}>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">📅 {t.date}</label>
                                    <input type="date" value={date}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={(e) => {
                                            setDate(e.target.value);
                                            if (returnDate && returnDate <= e.target.value) setReturnDate("");
                                        }}
                                        className="w-full px-2 xl:px-3.5 py-4 bg-gray-100 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-400 text-xs sm:text-sm lg:text-[13px] xl:text-base pointer-events-auto" />
                                </div>
                                {tripType === "roundTrip" && (
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">📅 {t.returnDate}</label>
                                        <input type="date" value={returnDate}
                                            disabled={!date}
                                            min={returnDateMin}
                                            onChange={(e) => setReturnDate(e.target.value)}
                                            className="w-full px-2 xl:px-3.5 py-4 bg-gray-100 rounded-2xl font-bold outline-none border-2 border-transparent
                                                focus:border-orange-400 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm lg:text-[13px] xl:text-base pointer-events-auto" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button onClick={handleSearch}
                                className={`flex-1 py-4 rounded-2xl font-black shadow-lg transition-all active:scale-95 text-white
                                    ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-orange-600 hover:bg-orange-500"}`}>
                                <FaSearch className="inline mr-2" /> {t.searchBtn}
                            </button>
                            {appliedQuery && (
                                <button onClick={handleReset}
                                    className="px-8 py-4 rounded-2xl font-black text-white bg-rose-500 hover:bg-rose-600 transition-all">
                                    {t.reset}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">

                {tripType === "oneWay" && (
                    <section>
                        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
                            <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-400">{sectionLabel}</p>
                            {!loading && (
                                <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-xs font-black">
                                    {departureFlights.length} {t.count_of_results}
                                </span>
                            )}
                        </div>
                        <FlightList flights={departureFlights} loading={loading} darkMode={darkMode}
                            til={til} t={t} selectedId={selectedDep?.flight?.id}
                            onSelect={(f) => setModal({ open: true, flight: f, direction: "dep" })} />
                    </section>
                )}

                {tripType === "roundTrip" && (
                    <>
                        <section>
                            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                        {t.departureFlight ?? "Borish reysis"}
                                    </p>
                                    <p className="text-lg font-black">
                                        {t.selectors.sel_0} ✈️ {TARGET_UZ || "*"}
                                        {q.date && <span className="text-sm font-bold text-gray-400 ml-2">• {q.date}</span>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {selectedDep && (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black">
                                            ✓ {selectedDep.flight.company} · {selectedDep.seat}
                                        </span>
                                    )}
                                    {!loading && (
                                        <span className="bg-orange-100 text-orange-600 px-4 py-1 rounded-full text-xs font-black">
                                            {departureFlights.length} {t.count_of_results}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <FlightList flights={departureFlights} loading={loading} darkMode={darkMode}
                                til={til} t={t} selectedId={selectedDep?.flight?.id}
                                onSelect={(f) => setModal({ open: true, flight: f, direction: "dep" })} />
                        </section>

                        <section>
                            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                                        {t.selectReturn ?? "Qaytish reysis"}
                                    </p>
                                    <p className="text-lg font-black">
                                        {TARGET_UZ || "*"} ✈️ {t.selectors.sel_0}
                                        {q.returnDate && <span className="text-sm font-bold text-gray-400 ml-2">• {q.returnDate}</span>}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    {selectedRet && (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black">
                                            ✓ {selectedRet.flight.company} · {selectedRet.seat}
                                        </span>
                                    )}
                                    {!loading && (
                                        <span className="bg-blue-100 text-blue-600 px-4 py-1 rounded-full text-xs font-black">
                                            {returnFlights.length} {t.count_of_results}
                                        </span>
                                    )}
                                </div>
                            </div>
                            <FlightList flights={returnFlights} loading={loading} darkMode={darkMode}
                                til={til} t={t} selectedId={selectedRet?.flight?.id}
                                onSelect={(f) => setModal({ open: true, flight: f, direction: "ret" })} />
                        </section>

                        {(selectedDep || selectedRet) && (
                            <div className={`sticky bottom-6 z-50 rounded-[28px] p-4 sm:p-5 shadow-2xl border
                                flex flex-col sm:flex-row items-center justify-between gap-4
                                ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
                                <div className="flex gap-4 sm:gap-6 flex-wrap justify-center sm:justify-start">
                                    {selectedDep && (
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">{t.departureFlight ?? "Borish"}</p>
                                            <p className="font-black text-orange-500">
                                                {Number(selectedDep.flight.price).toLocaleString()} UZS
                                                <span className="text-[10px] text-gray-400 ml-1">· {selectedDep.seat}</span>
                                            </p>
                                        </div>
                                    )}
                                    {selectedRet && (
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">{t.selectReturn ?? "Qaytish"}</p>
                                            <p className="font-black text-orange-500">
                                                {Number(selectedRet.flight.price).toLocaleString()} UZS
                                                <span className="text-[10px] text-gray-400 ml-1">· {selectedRet.seat}</span>
                                            </p>
                                        </div>
                                    )}
                                    {selectedDep && selectedRet && (
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase">Jami</p>
                                            <p className="font-black text-lg text-green-600">
                                                {(Number(selectedDep.flight.price) + Number(selectedRet.flight.price)).toLocaleString()} UZS
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <button onClick={handleBook} disabled={!canBook}
                                    className={`px-10 py-4 rounded-2xl font-black transition-all text-white whitespace-nowrap
                                        ${canBook
                                            ? "bg-orange-500 hover:bg-orange-600 active:scale-95 shadow-lg"
                                            : "bg-gray-300 cursor-not-allowed text-gray-500"}`}>
                                    {canBook
                                        ? (t.confirmSeat ?? "Buyurtma berish")
                                        : `${!selectedDep
                                            ? (t.departureFlight ?? "Borish")
                                            : (t.selectReturn ?? "Qaytish")} reysini tanlang`}
                                </button>
                            </div>
                        )}
                    </>
                )}

                {tripType === "oneWay" && selectedDep && (
                    <div className={`sticky bottom-6 z-50 rounded-[28px] p-4 sm:p-5 shadow-2xl border
                        flex items-center justify-between gap-4
                        ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-gray-100"}`}>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase">
                                {selectedDep.flight.company} · {selectedDep.seat}
                            </p>
                            <p className="font-black text-orange-500 text-lg">
                                {Number(selectedDep.flight.price).toLocaleString()} UZS
                            </p>
                        </div>
                        <button onClick={handleBook}
                            className="px-10 py-4 rounded-2xl font-black bg-orange-500 hover:bg-orange-600
                                text-white shadow-lg active:scale-95 transition-all">
                            {t.bookNow ?? "Buyurtma berish"}
                        </button>
                    </div>
                )}
            </div>

            <SeatMapModal
                isOpen={modal.open}
                flight={modal.flight}
                onClose={() => setModal({ open: false, flight: null, direction: null })}
                onConfirm={handleSeatConfirm}
                darkMode={darkMode}
                t={t}
                til={til}
            />

            <PaymentModal
                isOpen={showPaymentModal}
                t={t}
                countdown={countdown}
            />
        </div>
    );
}