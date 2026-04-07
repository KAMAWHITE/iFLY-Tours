"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Loading from "@/Components/Common/Loading";
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

    if (loading) return <Loading fullScreen={true} />;


    return <HomeContent user={user} />;
}