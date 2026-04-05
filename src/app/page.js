"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase"; 
import { useRouter } from "next/navigation";
import HomeContent from "@/Components/Home/Home";

export default function Page() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                // Foydalanuvchi yo'q bo'lsa, auth sahifasiga o'tish
                router.replace("/auth");
            } else {
                setUser(currentUser);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-400 font-medium tracking-widest uppercase text-xs">Yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    return <HomeContent user={user} />;
}