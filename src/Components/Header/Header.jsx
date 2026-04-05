"use client";
import React, { useEffect, useState, useRef } from "react";
import { Menu, X, Sun, Moon, ChevronDown, Plane, Home, Hotel, User } from "lucide-react";
import Image from "next/image";
import { useApp } from "../../app/LanguageContext";
import Link from "next/link";
import HeaderUz from "../../../locales/uz/Header.json";
import HeaderRu from "../../../locales/ru/Header.json";
import HeaderEn from "../../../locales/en/Header.json";
import { auth, db } from "../../lib/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
    const { til, changeLanguage, darkMode, toggleDarkMode } = useApp();
    const dropdownRef = useRef(null);
    const pathname = usePathname();

    const languages = [
        { value: "en", label: "English", flag: "/US.jpg" },
        { value: "ru", label: "Русский", flag: "/RU.png" },
        { value: "uz", label: "O'zbekcha", flag: "/UZ.png" },
    ];

    const selectedLanguage = languages.find((lang) => lang.value === til) || languages[2];

    const syncWithFirebase = async (data) => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userRef = doc(db, "users", user.uid);
                await updateDoc(userRef, data);
            } catch (error) {
                console.error("Firebase sinxronizatsiyada xato:", error);
            }
        }
    };

    const handleLanguageChange = (language) => {
        changeLanguage(language);
        setIsLanguageDropdownOpen(false);
        const user = auth.currentUser;
        if (user) {
            updateDoc(doc(db, "users", user.uid), { preferredLanguage: language });
        }
    };

    const handleDarkModeToggle = () => {
        const nextMode = !darkMode;
        toggleDarkMode();
        syncWithFirebase({ darkMode: nextMode });
    };

    const getHeaderContent = () => {
        switch (til) {
            case "ru": return HeaderRu;
            case "en": return HeaderEn;
            default: return HeaderUz;
        }
    };

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLanguageDropdownOpen(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        document.addEventListener("mousedown", handleClickOutside);
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            window.removeEventListener("scroll", handleScroll);
            document.removeEventListener("mousedown", handleClickOutside);
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists() && userDoc.data().preferredLanguage) {
                    changeLanguage(userDoc.data().preferredLanguage);
                }
            }
        });
        return () => unsubscribe();
    }, []);

    const headerContent = getHeaderContent();

    const navLinks = [
        { label: headerContent.navbar_1, href: "/", icon: <Home size={15} /> },
        { label: headerContent.navbar_2, href: "/flights", icon: <Plane size={15} /> },
        { label: headerContent.navbar_3, href: "/hotels", icon: <Hotel size={15} /> },
        { label: headerContent.navbar_4, href: "/profile", icon: <User size={15} /> },
    ];

    const isActive = (href) => pathname === href;

    /* ── nav background ── */
    const navBg = isScrolled
        ? darkMode
            ? "bg-slate-900/95 backdrop-blur-xl border-b border-white/5 shadow-2xl"
            : "bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg"
        : darkMode
            ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500";

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${navBg}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">

                {/* ── LOGO ── */}
                <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
                    <div className="relative">
                        <div className={`absolute inset-0 rounded-xl blur-sm transition-opacity duration-300 ${isScrolled ? "opacity-0" : "opacity-30 bg-white"}`} />
                        <Image
                            src="/logo.png"
                            alt="IFLY Tours"
                            width={38}
                            height={38}
                            quality={100}
                            className="relative h-9 w-auto rounded-lg"
                        />
                    </div>
                    <span className={`hidden md:block font-black text-xl tracking-tight transition-colors duration-300 ${
                        isScrolled
                            ? darkMode ? "text-white" : "text-gray-900"
                            : "text-white"
                    }`}>
                        iFLY<span className={`${isScrolled && !darkMode ? "text-orange-500" : "text-white/70"}`}>-Tours</span>
                    </span>
                </Link>

                {/* ── DESKTOP NAV LINKS ── */}
                <div className="hidden sm:flex items-center gap-1">
                    {navLinks.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                isActive(item.href)
                                    ? isScrolled
                                        ? darkMode
                                            ? "bg-orange-500/20 text-orange-400"
                                            : "bg-orange-500 text-white shadow-md shadow-orange-200"
                                        : "bg-white/25 text-white"
                                    : isScrolled
                                        ? darkMode
                                            ? "text-slate-300 hover:bg-white/10 hover:text-white"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-orange-600"
                                        : "text-white/90 hover:bg-white/15 hover:text-white"
                            }`}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            <span className="hidden lg:block">{item.label}</span>
                        </Link>
                    ))}
                </div>

                {/* ── RIGHT CONTROLS ── */}
                <div className="flex items-center gap-2">
                    {/* Language Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                            className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                isScrolled
                                    ? darkMode
                                        ? "bg-white/10 text-white hover:bg-white/15"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    : "bg-white/15 text-white hover:bg-white/25"
                            }`}
                        >
                            <Image
                                src={selectedLanguage.flag}
                                alt={selectedLanguage.label}
                                width={18}
                                height={18}
                                quality={100}
                                className="w-4.5 h-4 rounded-sm object-cover flex-shrink-0"
                            />
                            <span className="hidden xs:block text-xs font-bold tracking-wide">
                                {selectedLanguage.value.toUpperCase()}
                            </span>
                            <ChevronDown
                                size={13}
                                className={`transition-transform duration-200 ${isLanguageDropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {isLanguageDropdownOpen && (
                            <div className={`absolute right-0 mt-2 w-40 rounded-2xl shadow-2xl z-50 overflow-hidden border animate-fade-down ${
                                darkMode
                                    ? "bg-slate-800 border-white/10"
                                    : "bg-white border-gray-100"
                            }`}>
                                {languages.map((language) => (
                                    <button
                                        key={language.value}
                                        onClick={() => handleLanguageChange(language.value)}
                                        className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold transition-all duration-150 ${
                                            til === language.value
                                                ? darkMode
                                                    ? "bg-orange-500/20 text-orange-400"
                                                    : "bg-orange-50 text-orange-600"
                                                : darkMode
                                                    ? "text-slate-300 hover:bg-white/5"
                                                    : "text-gray-600 hover:bg-gray-50"
                                        }`}
                                    >
                                        <Image
                                            src={language.flag}
                                            alt={language.label}
                                            width={20}
                                            height={14}
                                            quality={100}
                                            className="w-5 h-3.5 rounded-sm object-cover flex-shrink-0"
                                        />
                                        <span>{language.label}</span>
                                        {til === language.value && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={handleDarkModeToggle}
                        className={`p-2.5 rounded-xl transition-all duration-300 flex-shrink-0 ${
                            isScrolled
                                ? darkMode
                                    ? "bg-white/10 text-amber-400 hover:bg-white/15"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                : "bg-white/15 text-white hover:bg-white/25"
                        }`}
                        title={darkMode ? "Light Mode" : "Dark Mode"}
                    >
                        {darkMode
                            ? <Sun size={17} className="transition-transform duration-300 rotate-0 hover:rotate-45" />
                            : <Moon size={17} className="transition-transform duration-300" />
                        }
                    </button>

                    {/* Mobile Burger */}
                    <button
                        className={`sm:hidden p-2.5 rounded-xl transition-all duration-200 flex-shrink-0 ${
                            isScrolled
                                ? darkMode
                                    ? "bg-white/10 text-white hover:bg-white/15"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                : "bg-white/15 text-white hover:bg-white/25"
                        }`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </div>

            {/* ── MOBILE MENU ── */}
            {isOpen && (
                <div
                    className={`sm:hidden fixed inset-0 z-[9999] flex flex-col ${
                        darkMode
                            ? "bg-slate-900"
                            : "bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500"
                    }`}
                    style={{ top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    {/* Mobile Header */}
                    <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
                        <div className="flex items-center gap-2.5">
                            <Image src="/logo.png" alt="IFLY Tours" width={36} height={36} quality={100} className="h-9 w-auto rounded-lg" />
                            <span className="font-black text-lg text-white tracking-tight">
                                iFLY-Tours
                            </span>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Mobile Links */}
                    <div className="flex flex-col gap-2 p-5 flex-1 overflow-y-auto">
                        {navLinks.map((item, i) => (
                            <Link
                                href={item.href}
                                key={item.href}
                                onClick={() => setIsOpen(false)}
                                style={{ animationDelay: `${i * 80}ms` }}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-semibold text-base transition-all duration-200 animate-fade-up ${
                                    isActive(item.href)
                                        ? "bg-white text-orange-600 shadow-lg"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Bottom Controls */}
                    <div className="px-5 py-5 border-t border-white/10">
                        <div className="flex items-center justify-between">
                            <span className="text-white/70 text-sm font-medium">Til / Язык / Language</span>
                            <div className="flex gap-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.value}
                                        onClick={() => handleLanguageChange(lang.value)}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                                            til === lang.value
                                                ? "bg-white text-orange-600"
                                                : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                    >
                                        <Image src={lang.flag} alt={lang.label} width={16} height={12} className="w-4 h-3 rounded-sm object-cover" />
                                        {lang.value.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}