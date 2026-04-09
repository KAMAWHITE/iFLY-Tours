import React from "react";
import Flights from "@/Components/Flights/Flights";

export const metadata = {
    title: "Aviabiletlar — Arzon Parvozlar Qidirish",
    description:
        "Dunyoning istalgan shahriga arzon aviabiletlarni qidiring va bron qiling. Toshkent, Dubai, Istanbul, Moscow va boshqa yo'nalishlardagi parvozlar. Real vaqt narxlari.",
    keywords: [
        "aviabilet qidirish",
        "arzon parvoz",
        "chipta sotib olish",
        "Toshkent Dubai parvoz",
        "Toshkent Moscow chipta",
        "xalqaro aviareys",
        "ichki reys",
        "авиабилет онлайн",
        "дешевые авиабилеты",
        "flight search",
        "cheap flights",
    ],
    openGraph: {
        title: "Aviabiletlar | iFLY-Tours",
        description:
            "Eng arzon aviabiletlarni qidiring. Dubai, Istanbul, Moscow va 200+ yo'nalish. Real vaqt narxlari va qulay bron.",
        url: "https://ifly-tours.uz/flights",
        images: [
            {
                url: "/og-cover.png",
                width: 1200,
                height: 630,
                alt: "iFLY-Tours — Aviabiletlar",
            },
        ],
    },
    alternates: {
        canonical: "https://ifly-tours.uz/flights",
    },
};

export default function FlightsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        name: "Aviabilet Bron Qilish",
                        serviceType: "Aviabilet Sotish",
                        provider: {
                            "@type": "Organization",
                            name: "iFLY-Tours",
                            url: "https://ifly-tours.uz",
                        },
                        url: "https://ifly-tours.uz/flights",
                        description:
                            "Dunyoning istalgan nuqtasiga eng arzon aviabiletlarni onlayn qidirish va bron qilish xizmati.",
                        areaServed: {
                            "@type": "Country",
                            name: "Uzbekistan",
                        },
                        hasOfferCatalog: {
                            "@type": "OfferCatalog",
                            name: "Aviabiletlar",
                            itemListElement: [
                                {
                                    "@type": "Offer",
                                    itemOffered: {
                                        "@type": "Flight",
                                        name: "Xalqaro Parvozlar",
                                    },
                                },
                                {
                                    "@type": "Offer",
                                    itemOffered: {
                                        "@type": "Flight",
                                        name: "Ichki Reyslar",
                                    },
                                },
                            ],
                        },
                    }),
                }}
            />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Flights />
            </div>
        </>
    );
}