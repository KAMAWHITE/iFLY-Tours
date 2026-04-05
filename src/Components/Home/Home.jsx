"use client"; // Client-side check uchun kerak

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Firebase configuratsiyang yo'li
import { useRouter } from "next/navigation";

import SwiperCarousel from "@/Components/Home/SwiperCarousel/SwiperCarousel";
import CountryInfo from "@/Components/Home/CountryInfo/CountryInfo";
import AboutUs from "@/Components/Home/AboutUs/AboutUs";

const Page = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Firebase auth holatini kuzatamiz
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                // Agar foydalanuvchi login qilmagan bo'lsa, auth sahifasiga qaytaramiz
                router.push("/auth");
            } else {
                // Agar foydalanuvchi bo'lsa, yuklashni to'xtatamiz
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    // Auth holati aniq bo'lguncha hech narsa ko'rsatmaymiz (yoki Spinner qo'yamiz)
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8]">
                <p className="text-[#1c1612] font-medium">Yuklanmoqda, Boss...</p>
            </div>
        );
    }

    return (
        <div>
            <SwiperCarousel />
            <CountryInfo />
            <AboutUs />
        </div>
    );
};

export default Page;