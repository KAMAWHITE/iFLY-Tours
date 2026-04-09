export default function robots() {
    return {
        rules: [
            {
                userAgent: "*",
                allow: ["/", "/flights", "/hotels"],
                disallow: ["/profile", "/auth", "/api/"],
            },
            {
                userAgent: "Googlebot",
                allow: ["/", "/flights", "/hotels"],
                disallow: ["/profile", "/auth", "/api/"],
                crawlDelay: 1,
            },
            {
                userAgent: "Yandex",
                allow: ["/", "/flights", "/hotels"],
                disallow: ["/profile", "/auth", "/api/"],
                crawlDelay: 2,
            },
        ],
        sitemap: "https://ifly-tours.uz/sitemap.xml",
        host: "https://ifly-tours.uz",
    };
}
