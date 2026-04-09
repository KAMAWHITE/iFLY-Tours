import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
    metadataBase: new URL("https://ifly-tours.uz"),

    title: {
        default: "iFLY-Tours — Aviabilet & Mehmonxona Bron Qilish",
        template: "%s | iFLY-Tours",
    },
    description:
        "iFLY-Tours — O'zbekistonning eng qulay onlayn aviabilet va mehmonxona bron qilish platformasi. Arzon narxlarda parvozlar, 5 yulduzli mehmonxonalar va eksklyuziv takliflarni toping.",
    keywords: [
        "aviabilet",
        "mehmonxona bron",
        "arzon chipta",
        "parvoz qidirish",
        "ifly tours",
        "iFLY",
        "sayohat",
        "Toshkent",
        "O'zbekiston",
        "online ticket",
        "hotel booking",
        "авиабилет",
        "бронирование",
    ],
    authors: [{ name: "iFLY-Tours", url: "https://ifly-tours.uz" }],
    creator: "iFLY-Tours",
    publisher: "iFLY-Tours",
    category: "travel",
    classification: "Travel & Tourism",

    openGraph: {
        type: "website",
        locale: "uz_UZ",
        alternateLocale: ["ru_RU", "en_US"],
        url: "https://ifly-tours.uz",
        siteName: "iFLY-Tours",
        title: "iFLY-Tours — Aviabilet & Mehmonxona Bron Qilish",
        description:
            "Arzon aviabiletlar va mehmonxonalarni onlayn bron qiling. O'zbekistondan dunyoning istalgan nuqtasiga qulay sayohat.",
        images: [
            {
                url: "/og-cover.png",
                width: 1200,
                height: 630,
                alt: "iFLY-Tours — Onlayn Sayohat Platformasi",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        site: "@iflytours",
        creator: "@iflytours",
        title: "iFLY-Tours — Aviabilet & Mehmonxona",
        description:
            "O'zbekistonning eng qulay sayohat platformasi. Parvozlar, mehmonxonalar, arzon narxlar.",
        images: ["/og-cover.png"],
    },

    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/logo.png", type: "image/png" },
        ],
        apple: [{ url: "/logo.png" }],
        shortcut: "/favicon.ico",
    },

    robots: {
        index: true,
        follow: true,
        nocache: false,
        googleBot: {
            index: true,
            follow: true,
            noimageindex: false,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },

    verification: {
        google: "REPLACE_WITH_GOOGLE_SEARCH_CONSOLE_TOKEN",
        yandex: "REPLACE_WITH_YANDEX_WEBMASTER_TOKEN",
    },

    applicationName: "iFLY-Tours",
    referrer: "origin-when-cross-origin",
    formatDetection: { telephone: true, date: false, email: true },
};

export default function RootLayout({ children }) {
    return (
        <html lang="uz">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[var(--bg)] text-[var(--text)] transition-colors duration-300`}
            >
                <ClientLayout>{children}</ClientLayout>
            </body>
        </html>
    );
}