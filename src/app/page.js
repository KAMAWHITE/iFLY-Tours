import HomeContent from "@/Components/Home/Home";

export const metadata = {
    title: "Bosh Sahifa — Arzon Parvozlar & Mehmonxonalar",
    description:
        "iFLY-Tours bosh sahifasi. Dunyoning istalgan shahriga arzon aviabiletlar va mehmonxonalarni bir joydan bron qiling. Eksklyuziv takliflar, qulay narxlar.",
    openGraph: {
        title: "iFLY-Tours — Bosh Sahifa",
        description:
            "Dunyoning istalgan shahriga arzon aviabiletlar va mehmonxonalarni bir joydan bron qiling.",
        url: "https://ifly-tours.uz",
        images: [
            {
                url: "/og-cover.png",
                width: 1200,
                height: 630,
                alt: "iFLY-Tours Bosh Sahifa",
            },
        ],
    },
    alternates: {
        canonical: "https://ifly-tours.uz",
    },
};

export default function Page() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "WebSite",
                        name: "iFLY-Tours",
                        url: "https://ifly-tours.uz",
                        description:
                            "O'zbekistonning eng qulay onlayn aviabilet va mehmonxona bron qilish platformasi.",
                        potentialAction: {
                            "@type": "SearchAction",
                            target:
                                "https://ifly-tours.uz/flights?q={search_term_string}",
                            "query-input": "required name=search_term_string",
                        },
                        publisher: {
                            "@type": "Organization",
                            name: "iFLY-Tours",
                            url: "https://ifly-tours.uz",
                            logo: {
                                "@type": "ImageObject",
                                url: "https://ifly-tours.uz/logo.png",
                            },
                        },
                    }),
                }}
            />
            <HomeContent />
        </>
    );
}