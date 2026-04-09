import AuthComponent from "@/Components/Auth";

export const metadata = {
    title: "Kirish & Ro'yxatdan O'tish",
    description:
        "iFLY-Tours platformasiga kiring yoki yangi hisob yarating. Google va Facebook orqali tez kirish imkoniyati. Aviabiletlar va mehmonxonalarni bron qilishni boshlang.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        title: "Kirish | iFLY-Tours",
        description:
            "iFLY-Tours hisobingizga kiring yoki yangi hisob yarating. Qulay sayohat bron qilishni boshlang.",
        url: "https://ifly-tours.uz/auth",
        images: [
            {
                url: "/og-cover.png",
                width: 1200,
                height: 630,
                alt: "iFLY-Tours — Kirish sahifasi",
            },
        ],
    },
    alternates: {
        canonical: "https://ifly-tours.uz/auth",
    },
};

export default function AuthPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "LoginPage",
                        name: "iFLY-Tours — Kirish",
                        url: "https://ifly-tours.uz/auth",
                        description:
                            "iFLY-Tours platformasiga kirish va ro'yxatdan o'tish sahifasi.",
                    }),
                }}
            />
            <AuthComponent />
        </>
    );
}