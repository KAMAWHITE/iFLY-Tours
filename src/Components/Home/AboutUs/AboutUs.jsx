"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { useApp } from "../../../app/LanguageContext";
import { FaGlobeAmericas, FaSuitcaseRolling, FaUserCheck, FaAward } from "react-icons/fa";
import { CheckCircle, ArrowRight } from "lucide-react";

import AboutUz from "../../../../locales/uz/About.json";
import AboutRu from "../../../../locales/ru/About.json";
import AboutEn from "../../../../locales/en/About.json";

const About = () => {
    const { til, darkMode } = useApp();
    const router = useRouter();
    const t = til === "ru" ? AboutRu : til === "en" ? AboutEn : AboutUz;

    useEffect(() => {
        AOS.init({ duration: 1000, once: true, easing: "ease-out-cubic" });
    }, []);

    const features = [
        til === "ru" ? "Персональный гид" : til === "en" ? "Personal guide" : "Shaxsiy gid",
        til === "ru" ? "Лучшие отели"    : til === "en" ? "Best hotels"    : "Eng yaxshi mehmonxonalar",
        til === "ru" ? "Страховка"        : til === "en" ? "Insurance"      : "Sug'urta xizmati",
        til === "ru" ? "24/7 поддержка"  : til === "en" ? "24/7 support"   : "24/7 qo'llab-quvvatlash",
    ];

    return (
        <section className={`py-20 sm:py-32 overflow-hidden relative ${darkMode ? "bg-slate-950 text-white" : "bg-[#fcfaf7] text-gray-900"}`}>
            {/* Background decorative blob */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl -mr-64 -mt-64" />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

                    {/* ── LEFT: Image & Premium Floating Chips ── */}
                    <div className="relative group" data-aos="fade-right">
                        {/* Interactive Background Ring */}
                        <div className="absolute -inset-4 border-2 border-dashed border-orange-500/20 rounded-[40px] animate-[spin_20s_linear_infinite] hidden sm:block" />
                        
                        {/* Main Image Container */}
                        <div className="relative z-10 rounded-[32px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] aspect-[4/5] sm:aspect-auto sm:h-[550px]">
                            <Image
                                src="/logo.png"
                                alt="iFLY Tour Experience"
                                width={600}
                                height={700}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* --- CHIP 1: Experience (Top Left) --- */}
                        <div 
                            className={`absolute -top-6 -left-4 sm:-left-10 z-20 p-4 rounded-2xl shadow-xl animate-[bounce_4s_ease-in-out_infinite] flex items-center gap-3 border ${
                                darkMode ? "bg-slate-900/80 border-slate-700 backdrop-blur-xl" : "bg-white/80 border-white/50 backdrop-blur-xl"
                            }`}
                        >
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/40">
                                <FaAward className="text-xl" />
                            </div>
                            <div>
                                <p className="font-black text-xl leading-none text-orange-500">12</p>
                                <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                                    {t.statExperience}
                                </p>
                            </div>
                        </div>

                        {/* --- CHIP 2: Stats (Bottom Right) --- */}
                        <div 
                            className={`absolute -bottom-8 -right-4 sm:-right-12 z-20 p-6 rounded-[32px] shadow-2xl animate-[bounce_5s_ease-in-out_infinite_1s] border ${
                                darkMode ? "bg-slate-900/90 border-slate-700 backdrop-blur-2xl" : "bg-white/90 border-white/50 backdrop-blur-2xl"
                            }`}
                        >
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2 text-orange-500">
                                        <FaGlobeAmericas size={16} />
                                        <span className="font-black text-lg">50+</span>
                                    </div>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                                        {t.statCountries}
                                    </p>
                                </div>
                                <div className="space-y-1 border-l border-gray-100 dark:border-slate-700 pl-6">
                                    <div className="flex items-center gap-2 text-rose-500">
                                        <FaSuitcaseRolling size={16} />
                                        <span className="font-black text-lg">1500+</span>
                                    </div>
                                    <p className={`text-[9px] font-bold uppercase tracking-widest ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                                        {t.statTours}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* --- CHIP 3: Happy Clients (Center Left) --- */}
                        <div 
                            className={`absolute bottom-12 -left-4 sm:-left-16 z-20 p-4 rounded-2xl shadow-xl animate-[bounce_6s_ease-in-out_infinite_0.5s] border flex flex-col gap-3 ${
                                darkMode ? "bg-slate-900/80 border-slate-700 backdrop-blur-xl" : "bg-white/80 border-white/50 backdrop-blur-xl"
                            }`}
                        >
                            <div className="flex -space-x-3">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-rose-400 border-2 border-white dark:border-slate-800 shadow-md" />
                                ))}
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-black border-2 border-white dark:border-slate-800 shadow-md ${
                                    darkMode ? "bg-slate-700 text-white" : "bg-orange-50 text-orange-600"
                                }`}>10k+</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <p className={`text-[10px] font-bold uppercase tracking-widest ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
                                    {t.statClients}
                                </p>
                            </div>
                        </div>

                        {/* Decorative background blobs */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl" />
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-rose-500/10 rounded-full blur-3xl shadow-inner" />
                    </div>

                    {/* ── RIGHT: Content & Information ── */}
                    <div className="flex flex-col gap-8" data-aos="fade-left">
                        {/* Heading & Badge */}
                        <div className="space-y-4">
                            <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full ${
                                darkMode ? "bg-orange-500/10 text-orange-400 border border-orange-500/20" : "bg-orange-50 text-orange-600 border border-orange-100"
                            }`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                                {t.aboutSub}
                            </span>
                            <h2 className={`text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] ${darkMode ? "text-white" : "text-gray-900"}`}>
                                {t.aboutTitle}{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">iFLY-Tour</span>
                            </h2>
                        </div>

                        {/* Paragraphs */}
                        <div className="space-y-6">
                            <p className={`text-lg leading-relaxed font-medium ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
                                {t.aboutDesc1}
                            </p>
                            <p className={`text-base leading-relaxed ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                                {t.aboutDesc2}
                            </p>
                        </div>

                        {/* Feature Checklist */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {features.map((f, i) => (
                                <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 hover:translate-x-1 ${
                                    darkMode ? "bg-slate-900/50 hover:bg-slate-900" : "bg-white hover:bg-white shadow-sm hover:shadow-md"
                                }`}>
                                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
                                        <CheckCircle size={18} strokeWidth={3} />
                                    </div>
                                    <span className={`text-sm font-bold ${darkMode ? "text-slate-200" : "text-gray-700"}`}>{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button (Bonus) */}
                        <div className="pt-4">
                            <button 
                                onClick={() => router.push("/flights")}
                                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 group transition-all hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white hover:shadow-2xl hover:shadow-orange-500/30"
                            >
                                {til === "ru" ? "Начать приключение" : til === "en" ? "Start Adventure" : "Sayohatni boshlash"}
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;