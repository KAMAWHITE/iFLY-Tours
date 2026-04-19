"use client";
import React, { useState } from "react";
import { FaTimes, FaCreditCard, FaUser, FaCalendarAlt, FaLock } from "react-icons/fa";

export default function PaymentModal({ isOpen, onClose, onConfirm, t, darkMode }) {
    const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: "" });

    if (!isOpen) return null;

    const handleConfirm = (e) => {
        e.preventDefault();
        if (!isCardValid()) return;
        onConfirm();
    };

    const isCardValid = () => {
        const rawNumber = card.number.replace(/\s/g, "");
        if (rawNumber.length !== 16) return false;

        const [mm, yy] = card.expiry.split("/");
        if (!mm || !yy || mm.length !== 2 || yy.length !== 2) return false;
        
        const month = parseInt(mm);
        const year = parseInt(yy);
        
        if (month < 1 || month > 12) return false;
        if (year < 26) return false;

        if (card.cvc.length < 3) return false;
        const nameParts = card.name.trim().split(/\s+/);
        if (nameParts.length < 2) return false;

        return true;
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4">
            <div className={`w-full max-w-lg rounded-[40px] p-6 sm:p-10 relative overflow-hidden shadow-2xl border ${darkMode ? "bg-slate-900 border-white/10 text-white" : "bg-white border-gray-100 text-gray-900"}`}>
                
                {/* Decorative elements */}
                {darkMode && (
                    <>
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-3xl" />
                    </>
                )}

                <div className="relative z-10 space-y-8">
                    <div className="flex justify-between items-center">
                        <div className="space-y-1">
                            <h3 className="text-3xl font-black">{t.payment_title || "To'lov"}</h3>
                            <p className="text-orange-500 font-bold uppercase tracking-wider text-xs">
                                {t.secure_checkout || "Xavfsiz to'lov"}
                            </p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors">
                            <FaTimes />
                        </button>
                    </div>

                    <form onSubmit={handleConfirm} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block px-1">
                                {t.card_number || "Karta raqami"}
                            </label>
                            <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${darkMode ? "bg-white/5 border-white/10 focus-within:border-orange-500" : "bg-gray-50 border-gray-100 focus-within:border-orange-400"}`}>
                                <FaCreditCard className="text-orange-500" />
                                <input 
                                    className="bg-transparent outline-none w-full font-bold" 
                                    placeholder="0000 0000 0000 0000"
                                    value={card.number}
                                    onChange={e => {
                                        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                                        let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
                                        setCard({...card, number: formatted});
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block px-1">
                                    {t.expiry_date || "Muddati"}
                                </label>
                                <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${darkMode ? "bg-white/5 border-white/10 focus-within:border-orange-500" : "bg-gray-50 border-gray-100 focus-within:border-orange-400"}`}>
                                    <FaCalendarAlt className="text-orange-500" />
                                    <input 
                                        className="bg-transparent outline-none w-full font-bold" 
                                        placeholder="MM/YY"
                                        value={card.expiry}
                                        onChange={e => {
                                            let val = e.target.value.replace(/\D/g, '').substring(0, 4);
                                            const now = new Date();
                                            const curM = now.getMonth() + 1;
                                            const curY = now.getFullYear() % 100;

                                            if (val.length >= 2) {
                                                let month = parseInt(val.substring(0, 2));
                                                if (month > 12) month = 12;
                                                if (month < 1 && val.length === 2) month = 1;

                                                let year = val.length === 4 ? parseInt(val.substring(2, 4)) : null;

                                                if (year !== null) {
                                                    if (year < curY) {
                                                        year = curY;
                                                        month = curM;
                                                    } else if (year === curY && month < curM) {
                                                        month = curM;
                                                    }
                                                }
                                                
                                                val = month.toString().padStart(2, '0') + (year !== null ? year.toString().padStart(2, '0') : val.substring(2));
                                            }
                                            if (val.length > 2) val = val.substring(0, 2) + '/' + val.substring(2);
                                            setCard({ ...card, expiry: val });
                                        }}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block px-1">CVC</label>
                                <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${darkMode ? "bg-white/5 border-white/10 focus-within:border-orange-500" : "bg-gray-50 border-gray-100 focus-within:border-orange-400"}`}>
                                    <FaLock className="text-orange-500" />
                                    <input 
                                        className="bg-transparent outline-none w-full font-bold" 
                                        placeholder="123"
                                        type="text"
                                        maxLength={3}
                                        value={card.cvc}
                                        onChange={e => setCard({...card, cvc: e.target.value.replace(/\D/g, '')})}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest opacity-50 block px-1">
                                    {t.card_holder || "Karta egasi"}
                                </label>
                                <div className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${darkMode ? "bg-white/5 border-white/10 focus-within:border-orange-500" : "bg-gray-50 border-gray-100 focus-within:border-orange-400"}`}>
                                    <FaUser className="text-orange-500" />
                                    <input 
                                        className="bg-transparent outline-none w-full font-bold uppercase" 
                                        placeholder="JOHN DOE"
                                        value={card.name}
                                        onChange={e => setCard({...card, name: e.target.value})}
                                        required
                                    />
                                </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={!isCardValid()}
                            className={`w-full py-5 rounded-2xl font-black text-sm tracking-widest transition-all shadow-xl mt-4
                                ${isCardValid() 
                                    ? "bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white active:scale-95" 
                                    : "bg-gray-300 dark:bg-gray-800 text-gray-500 cursor-not-allowed shadow-none"}`}
                        >
                            {t.pay_done_btn || "TO'LOV QILINDI"}
                        </button>
                    </form>

                    <p className="text-center opacity-40 text-[10px] font-black tracking-widest uppercase">
                        iFLY-Tours Premium Experience
                    </p>
                </div>
            </div>
        </div>
    );
}
