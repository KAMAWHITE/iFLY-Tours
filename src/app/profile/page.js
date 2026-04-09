import React from "react";
import Profile from "../../Components/Profile/Profile";

export const metadata = {
    title: "Mening Profilim",
    description:
        "iFLY-Tours shaxsiy profilingiz. Bronlaringizni ko'ring, ma'lumotlaringizni tahrirlang va sayohat tarixingizni kuzating.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Profil | iFLY-Tours",
        description:
            "Shaxsiy profilingizni boshqaring. Bronlaringiz, sayohat tarixi va sozlamalaringiz.",
        url: "https://ifly-tours.uz/profile",
        images: [
            {
                url: "/og-cover.png",
                width: 1200,
                height: 630,
                alt: "iFLY-Tours — Profil",
            },
        ],
    },
    alternates: {
        canonical: "https://ifly-tours.uz/profile",
    },
};

export default function ProfilePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ProfilePage",
                        name: "iFLY-Tours Foydalanuvchi Profili",
                        url: "https://ifly-tours.uz/profile",
                        description:
                            "iFLY-Tours platformasidagi shaxsiy foydalanuvchi profili va bron tarixini boshqarish sahifasi.",
                        isPartOf: {
                            "@type": "WebSite",
                            name: "iFLY-Tours",
                            url: "https://ifly-tours.uz",
                        },
                    }),
                }}
            />
            <Profile />
        </>
    );
}