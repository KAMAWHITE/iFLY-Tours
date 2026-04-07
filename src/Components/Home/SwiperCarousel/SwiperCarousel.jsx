"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import React, { useState, useEffect } from "react";
import { useApp } from "../../../app/LanguageContext";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MapPin } from "lucide-react";
import Loading from "@/Components/Common/Loading";

export default function SwiperCarousel() {
    const { til, darkMode } = useApp();
    const [slides, setSlides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const q = query(collection(db, "countries"), orderBy("id", "asc"));
                const querySnapshot = await getDocs(q);
                const fetchedSlides = querySnapshot.docs.map(doc => ({
                    firebaseId: doc.id,
                    ...doc.data()
                }));
                setSlides(fetchedSlides);
            } catch (error) {
                console.error("Error fetching slides:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSlides();
    }, []);

    if (loading) return <Loading fullScreen={true} text="IFLY TOURS..." />;

    return (
        <div className="relative w-full">
            <Swiper
                modules={[Pagination, Autoplay, Navigation, EffectFade]}
                effect="fade"
                pagination={{ clickable: true, dynamicBullets: false }}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                navigation
                loop={slides.length > 1}
                speed={900}
                className="w-full h-[100svh] min-h-[600px] max-h-[900px]"
            >
                {slides.map((slide) => {
                    const title = slide.title?.[til] || slide.title?.uz || "Noma'lum";
                    const desc = slide.desc?.[til] || slide.desc?.uz || "";

                    return (
                        <SwiperSlide key={slide.firebaseId} className="relative w-full h-full overflow-hidden">
                            {/* Background image */}
                            <div className="absolute inset-0">
                                <img
                                    src={slide.image}
                                    alt={title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Multi-layered overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                            {darkMode && <div className="absolute inset-0 bg-black/30" />}

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-end pb-24 sm:pb-28 px-6 sm:px-12 md:px-20 max-w-5xl">
                                {/* Location badge */}
                                <div className="mb-4 animate-fade-up" style={{ animationDelay: "200ms" }}>
                                    <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20">
                                        <MapPin size={11} />
                                        {title}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2
                                    className="text-4xl sm:text-6xl md:text-7xl font-black text-white leading-tight mb-3 drop-shadow-2xl animate-fade-up"
                                    style={{ animationDelay: "300ms" }}
                                >
                                    {title}
                                </h2>

                                {/* Description */}
                                <p
                                    className="text-white/85 text-base sm:text-xl max-w-lg leading-relaxed mb-6 font-medium animate-fade-up"
                                    style={{ animationDelay: "400ms" }}
                                >
                                    {desc}
                                </p>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>

            {/* Bottom fade for smooth section transition */}
            <div className={`absolute bottom-0 left-0 right-0 h-24 z-10 pointer-events-none ${
                darkMode
                    ? "bg-gradient-to-t from-slate-900 to-transparent"
                    : "bg-gradient-to-t from-white to-transparent"
            }`} />
        </div>
    );
}