"use client";

import React, { useState, useEffect } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from './LanguageContext';
import Header from '../Components/Header/Header';
import Footer from '../Components/Footer/Footer';
import Auth from '../Components/Auth';
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db, auth } from "../lib/firebase";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

function LoadingSpinner() {
  return (
    <html lang="uz">
      <body className="bg-white dark:bg-slate-950 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-5">
          {/* Animated plane icon */}
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 animate-pulse opacity-20 blur-xl" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-rose-500 flex items-center justify-center shadow-2xl shadow-orange-200">
              <svg viewBox="0 0 24 24" fill="none" className="w-9 h-9 text-white -rotate-45 animate-float" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </div>
          {/* Brand */}
          <div className="text-center">
            <p className="font-black text-2xl text-gray-900 dark:text-white tracking-tight">iFLY<span className="text-orange-500">-Tours</span></p>
            <p className="text-xs text-gray-400 font-medium tracking-widest uppercase mt-1">Yuklanmoqda...</p>
          </div>
          {/* Progress dots */}
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-orange-400"
                style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
        </div>
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <html lang="uz">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg)] text-[var(--text)] transition-colors duration-300`}>
        <AppProvider>
          {!user ? (
            <Auth />
          ) : (
            <>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </>
          )}
        </AppProvider>
      </body>
    </html>
  );
}