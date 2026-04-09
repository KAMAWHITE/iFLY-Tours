"use client"; // Client-side check uchun kerak

import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Firebase configuratsiyang yo'li
import { useRouter } from "next/navigation";

import SwiperCarousel from "@/Components/Home/SwiperCarousel/SwiperCarousel";
import CountryInfo from "@/Components/Home/CountryInfo/CountryInfo";
import AboutUs from "@/Components/Home/AboutUs/AboutUs";
import Loading from "@/Components/Common/Loading";

export default function HomeContent() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.push("/auth");
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) return <Loading fullScreen={true} text="Yuklanmoqda, Boss..." />;

    return (
        <div>
            <SwiperCarousel />
            <CountryInfo />
            <AboutUs />
        </div>
    );
};