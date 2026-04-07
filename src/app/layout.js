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

import { Toaster } from 'react-hot-toast';
import Loading from "../Components/Common/Loading";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

function LoadingSpinner() {
  return (
    <html lang="uz">
      <body className="bg-[#102131] min-h-screen">
        <Loading fullScreen={true} text="Yuklanmoqda..." />
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

  return (
    <html lang="uz">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg)] text-[var(--text)] transition-colors duration-300`}>
        <AppProvider>
          <Toaster position="top-center" reverseOrder={false} />
          {loading ? (
            <div className="bg-[#102131] min-h-screen">
              <Loading fullScreen={true} />
            </div>
          ) : !user ? (
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