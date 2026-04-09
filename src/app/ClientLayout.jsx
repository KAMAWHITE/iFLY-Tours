"use client";

import { useState, useEffect } from "react";
import { AppProvider } from "./LanguageContext";
import Header from "../Components/Header/Header";
import Footer from "../Components/Footer/Footer";
import Auth from "../Components/Auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { Toaster } from "react-hot-toast";
import Loading from "../Components/Common/Loading";

export default function ClientLayout({ children }) {
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
    );
}
