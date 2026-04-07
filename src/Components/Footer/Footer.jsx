"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaTelegramPlane, FaFacebookF, FaYoutube } from "react-icons/fa";
import { MapPin, Phone, Mail, Plane, ArrowUpRight } from "lucide-react";
import { useApp } from "../../app/LanguageContext";
import FooterUz from "../../../locales/uz/Footer.json";
import FooterRu from "../../../locales/ru/Footer.json";
import FooterEn from "../../../locales/en/Footer.json";

const Footer = () => {
    const { til, darkMode } = useApp();

    const getContent = () => {
        switch (til) {
            case "ru": return FooterRu;
            case "en": return FooterEn;
            default: return FooterUz;
        }
    };

    const f = getContent();

    const socials = [
        { icon: <FaInstagram size={16} />, href: "https://www.instagram.com/", label: "Instagram", gradient: "from-pink-500 to-rose-500" },
        { icon: <FaTelegramPlane size={16} />, href: "https://web.telegram.org/", label: "Telegram", gradient: "from-sky-500 to-blue-600" },
        { icon: <FaFacebookF size={16} />, href: "https://www.facebook.com/", label: "Facebook", gradient: "from-blue-600 to-indigo-600" },
        { icon: <FaYoutube size={16} />, href: "https://www.youtube.com/", label: "YouTube", gradient: "from-red-500 to-rose-600" },
    ];

    const navLinks = [
        { label: f.link_1, href: "/" },
        { label: f.link_2, href: "/flights" },
        { label: f.link_3, href: "/hotels" },
        { label: f.link_4, href: "/profile" },
    ];

    const destinations = [
        { label: f.europa, href: "/" },
        { label: f.america, href: "/" },
        { label: f.asia, href: "/" },
        { label: f.africa, href: "/" },
    ];

    return (
        <footer className={`relative overflow-hidden ${darkMode
            ? "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white"
            : "bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white"
            }`}>
            {/* Top gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-rose-500/5 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
                {/* Main footer content */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 pt-14 pb-10">

                    {/* Brand column */}
                    <div className="col-span-2 lg:col-span-2 space-y-5">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-xl shadow-lg flex-shrink-0">
                                <Image src="/logo.png" alt="iFLY" width={40} height={40} className="w-10 h-10" />
                            </div>
                            <div>
                                <p className="font-black text-xl text-white">iFLY-Tours</p>
                                <p className="text-xs text-white/40 font-medium">Premium Travel Agency</p>
                            </div>
                        </div>

                        <p className="text-sm text-white/55 leading-relaxed max-w-xs">
                            {f.info}
                        </p>

                        {/* Social links */}
                        <div className="flex gap-2.5">
                            {socials.map((s, i) => (
                                <a
                                    key={i}
                                    href={s.href}
                                    aria-label={s.label}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 hover:border-transparent text-white/60 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:bg-gradient-to-br ${s.gradient}`}
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick links */}
                    <div className="col-span-1">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-5">{f.links}</h4>
                        <ul className="space-y-3">
                            {navLinks.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-white/50 hover:text-orange-400 transition-colors flex items-center gap-1.5 group"
                                    >
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Destinations */}
                    <div className="col-span-1">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-5">{f.locations}</h4>
                        <ul className="space-y-3">
                            {destinations.map((d, i) => (
                                <li key={i}>
                                    <Link
                                        href={d.href}
                                        className="text-sm text-white/50 hover:text-orange-400 transition-colors flex items-center gap-1.5 group"
                                    >
                                        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {d.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="col-span-2 lg:col-span-1">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-5">{f.title}</h4>
                        <ul className="space-y-3.5">
                            <li className="flex items-start gap-3">
                                <MapPin size={15} className="text-orange-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-white/55 leading-relaxed">Toshkent, O'zbekiston</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={15} className="text-orange-400 flex-shrink-0" />
                                <a href="tel:+998940990820" className="text-sm text-white/55 hover:text-white transition-colors">
                                    +998 94 099 08 20
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={15} className="text-orange-400 flex-shrink-0" />
                                <a href="mailto:aminboyevkamronbek2005@gmail.com" className="text-sm text-white/55 hover:text-white transition-colors">
                                    aminboyevkamronbek2005@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/5" />

                {/* Bottom bar */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 py-6 text-xs text-white/30">
                    <div className="flex items-center gap-2">
                        <Plane size={13} className="text-orange-500" />
                        <p>© {new Date().getFullYear()} iFLY-Tour. {f.copyright}</p>
                    </div>
                    <div className="flex gap-5">
                        <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;