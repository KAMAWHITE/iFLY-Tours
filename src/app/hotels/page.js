import React from "react";
import Hotels from "../../Components/Hotels/Hotels";

export const metadata = {
    title: "Mehmonxonalar — Arzon Bron & 5 Yulduzli Xizmat",
    description:
        "Dunyo bo'ylab mehmonxonalarni qidiring va bron qiling. Byudjet hotellardan 5 yulduzli rezortlargacha. Dubai, Istanbul, Dubai, Maldiv va boshqa yo'nalishlarda eng yaxshi narxlar.",
    keywords: [
        "mehmonxona bron",
        "arzon hotel",
        "5 yulduzli mehmonxona",
        "Dubai hotel",
        "Istanbul mehmonxona",
        "Toshkent hotel",
        "onlayn bron",
        "гостиница онлайн",
        "бронирование отеля",
        "hotel booking",
        "cheap hotels",
        "luxury hotels",
        "resort booking",
    ],
    openGraph: {
        title: "Mehmonxonalar | iFLY-Tours",
        description:
            "Dunyo bo'ylab 100,000+ mehmonxonani qidiring. Byudjet hotellardan 5 yulduzli rezortlargacha. Eng yaxshi narxlar garantiya qilingan.",
        url: "https://ifly-tours.uz/hotels",
        images: [
            {
                url: "/og-cover.png",
                width: 1200,
                height: 630,
                alt: "iFLY-Tours — Mehmonxonalar",
            },
        ],
    },
    alternates: {
        canonical: "https://ifly-tours.uz/hotels",
    },
};

export default function HotelsPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        name: "Mehmonxona Bron Qilish",
                        serviceType: "Hotel Booking",
                        provider: {
                            "@type": "Organization",
                            name: "iFLY-Tours",
                            url: "https://ifly-tours.uz",
                        },
                        url: "https://ifly-tours.uz/hotels",
                        description:
                            "Dunyo bo'ylab 100,000+ mehmonxonani onlayn qidirish va bron qilish xizmati. Eng yaxshi narxlar garantiya qilingan.",
                        areaServed: {
                            "@type": "Country",
                            name: "Worldwide",
                        },
                        hasOfferCatalog: {
                            "@type": "OfferCatalog",
                            name: "Mehmonxonalar",
                            itemListElement: [
                                {
                                    "@type": "Offer",
                                    itemOffered: {
                                        "@type": "LodgingBusiness",
                                        name: "Byudjet Mehmonxonalar",
                                    },
                                },
                                {
                                    "@type": "Offer",
                                    itemOffered: {
                                        "@type": "LodgingBusiness",
                                        name: "5 Yulduzli Mehmonxonalar",
                                    },
                                },
                                {
                                    "@type": "Offer",
                                    itemOffered: {
                                        "@type": "Resort",
                                        name: "Kurort va Rezortlar",
                                    },
                                },
                            ],
                        },
                    }),
                }}
            />
            <div>
                <Hotels />
            </div>
        </>
    );
}