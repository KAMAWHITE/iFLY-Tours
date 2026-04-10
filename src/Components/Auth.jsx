"use client";

import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    sendEmailVerification,
    signOut
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { Eye, EyeOff, Plane, ArrowRight, Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import Loading from "@/Components/Common/Loading";

const T = {
    uz: {
        welcome: "Xush kelibsiz",
        createAccount: "Hisob yarating",
        firstName: "Ism",
        lastName: "Familiya",
        email: "Email",
        password: "Parol",
        confirmPassword: "Parolni tasdiqlang",
        forgotPassword: "Parolni unutdingizmi?",
        login: "TIZIMGA KIRISH",
        register: "RO'YXATDAN O'TISH",
        loading: "YUKLANMOQDA...",
        or: "yoki",
        google: "Google bilan davom etish",
        facebook: "Facebook bilan davom etish",
        switchToRegister: "RO'YXATDAN O'TISH",
        switchToLogin: "KIRISH",
        tagline: "Boss, sayohatni\nbiz bilan boshlang.",
        resetSent: "Parolni tiklash havolasi emailga yuborildi!",
        enterEmail: "Avval email manzilingizni kiriting!",
        passWeak: "Parol juda zaif! Kamida 8 ta belgi, katta harf, raqam va maxsus belgi bo'lishi kerak.",
        passConfirmError: "Parollar mos kelmadi!",
        passReqs: [
            "Kamida 8 ta belgi",
            "Katta harf (A-Z)",
            "Raqam (0-9)",
            "Maxsus belgi (!@#$...)",
        ],
    },
    ru: {
        welcome: "Добро пожаловать",
        createAccount: "Создать аккаунт",
        firstName: "Имя",
        lastName: "Фамилия",
        email: "Электронн. почта",
        password: "Пароль",
        confirmPassword: "Подтвердите пароль",
        forgotPassword: "Забыли пароль?",
        login: "ВОЙТИ",
        register: "ЗАРЕГИСТРИРОВАТЬСЯ",
        loading: "ЗАГРУЗКА...",
        or: "или",
        google: "Продолжить с Google",
        facebook: "Продолжить с Facebook",
        switchToRegister: "РЕГИСТРАЦИЯ",
        switchToLogin: "ВОЙТИ",
        tagline: "Путешествуйте\nвместе с нами.",
        resetSent: "Ссылка для восстановления пароля отправлена!",
        enterEmail: "Сначала введите ваш email адрес!",
        passWeak: "Пароль слишком слабый! Минимум 8 символов, заглавная буква, цифра и спецсимвол.",
        passConfirmError: "Пароли не совпадают!",
        passReqs: [
            "Минимум 8 символов",
            "Заглавная буква (A-Z)",
            "Цифра (0-9)",
            "Спецсимвол (!@#$...)",
        ],
    },
    en: {
        welcome: "Welcome Back",
        createAccount: "Create Account",
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email",
        password: "Password",
        confirmPassword: "Confirm Password",
        forgotPassword: "Forgot password?",
        login: "SIGN IN",
        register: "CREATE ACCOUNT",
        loading: "LOADING...",
        or: "or",
        google: "Continue with Google",
        facebook: "Continue with Facebook",
        switchToRegister: "SIGN UP",
        switchToLogin: "SIGN IN",
        tagline: "Start your journey\nwith us today.",
        resetSent: "Password reset link sent to your email!",
        enterEmail: "Please enter your email address first!",
        passWeak: "Password too weak! Min 8 chars, uppercase, number, and symbol required.",
        passConfirmError: "Passwords do not match!",
        passReqs: [
            "At least 8 characters",
            "Uppercase letter (A-Z)",
            "Number (0-9)",
            "Special character (!@#$...)",
        ],
    },
};

const checkPassword = (pass) => ({
    length: pass.length >= 8,
    upper: /[A-Z]/.test(pass),
    number: /\d/.test(pass),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
});

export default function AuthPage() {
    const [mode, setMode] = useState("login");
    const [animating, setAnimating] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [lang, setLang] = useState("uz");
    const [passChecks, setPassChecks] = useState({ length: false, upper: false, number: false, special: false });
    const [passTyped, setPassTyped] = useState(false);
    const [formMessage, setFormMessage] = useState(null);

    if (typeof window !== "undefined") {
        const saved = localStorage.getItem("language");
        if (saved && saved !== lang && ["uz", "ru", "en"].includes(saved)) {
            setLang(saved);
        }
    }

    const t = T[lang] || T.uz;

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user && user.emailVerified) {
                window.location.replace("/");
            }
        });
        return () => unsubscribe();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (formMessage) setFormMessage(null);
        setFormData({ ...formData, [name]: value });
        if (name === "password") {
            setPassChecks(checkPassword(value));
            if (!passTyped && value.length > 0) setPassTyped(true);
        }
    };

    const switchMode = (newMode, keepMessage = false) => {
        if (newMode === mode) return;
        if (!keepMessage && formMessage) setFormMessage(null);
        setAnimating(true);
        setTimeout(() => { setMode(newMode); setAnimating(false); }, 220);
    };

    const secureRedirect = () => window.location.replace("/");

    const handleForgotPassword = async () => {
        if (!formData.email) { setFormMessage({ type: "error", text: t.enterEmail }); return; }
        try {
            await sendPasswordResetEmail(auth, formData.email.trim());
            setFormMessage({ type: "success", text: t.resetSent });
        } catch (error) { setFormMessage({ type: "error", text: error.message }); }
    };

    const handleGoogleAuth = async () => {
        if (loading) return;
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const nameParts = user.displayName ? user.displayName.split(" ") : ["Boss", ""];
            await setDoc(doc(db, "users", user.uid), {
                firstName: nameParts[0],
                lastName: nameParts[1] || "",
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                lastLogin: new Date().toISOString()
            }, { merge: true });
            secureRedirect();
        } catch (error) {
            if (error.code !== "auth/cancelled-popup-request") {
                setFormMessage({ type: "error", text: lang === "uz" ? "Xatolik yuz berdi yoki juda ko'p urinishlar" : lang === "ru" ? "Произошла ошибка или слишком много попыток" : "An error occurred or too many requests" });
            }
            setLoading(false);
        }
    };

    const handleFacebookAuth = async () => {
        if (loading) return;
        setLoading(true);
        const provider = new FacebookAuthProvider();
        provider.addScope('public_profile');
        provider.addScope('email');
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const nameParts = user.displayName ? user.displayName.split(" ") : ["Boss", ""];

            let finalPhotoURL = user.photoURL;
            try {
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                const facebookUid = user.providerData?.[0]?.uid || user.uid;

                const response = await fetch(`https://graph.facebook.com/${facebookUid}/picture?type=large&redirect=false&access_token=${accessToken}`);
                const data = await response.json();
                if (data?.data?.url) {
                    finalPhotoURL = data.data.url;
                }
            } catch (fbError) {
                console.error("Facebook Photo Fetch Error:", fbError);
            }

            await setDoc(doc(db, "users", user.uid), {
                firstName: nameParts[0],
                lastName: nameParts[1] || "",
                email: user.email || `${user.uid}@facebook.com`,
                photoURL: finalPhotoURL,
                uid: user.uid,
                lastLogin: new Date().toISOString(),
                provider: "facebook"
            }, { merge: true });
            secureRedirect();
        } catch (error) {
            console.error(error);
            if (error.code !== "auth/cancelled-popup-request") {
                setFormMessage({ type: "error", text: error.code === "auth/account-exists-with-different-credential"
                    ? (lang === "uz" ? "Ushbu email boshqa kirish usuli bilan bog'langan." : lang === "ru" ? "Этот адрес электронной почты связан с другим методом входа." : "This email is linked to a different sign-in method.")
                    : (lang === "uz" ? "Xatolik yuz berdi" : lang === "ru" ? "Произошла ошибка" : "An error occurred") });
            }
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);
        try {
            if (mode === "register") {
                const checks = checkPassword(formData.password);
                if (!checks.length || !checks.upper || !checks.number || !checks.special) {
                    setPassChecks(checks);
                    setPassTyped(true);
                    setLoading(false);
                    return;
                }
                if (formData.password !== formData.confirmPassword) throw new Error(t.passConfirmError);
                const res = await createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password);
                await updateProfile(res.user, { displayName: `${formData.firstName} ${formData.lastName}` });
                await setDoc(doc(db, "users", res.user.uid), {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email.trim(),
                    uid: res.user.uid,
                    createdAt: new Date().toISOString()
                });
                await sendEmailVerification(res.user);
                await signOut(auth);
                setFormMessage({ type: "success", text: lang === "uz" ? "Pochtangizga tasdiqlash xati yuborildi. Iltimos emailingizni tasdiqlang!" : lang === "ru" ? "Письмо отправлено. Пожалуйста, подтвердите вашу почту!" : "Verification email sent. Please verify your email!" });
                switchMode("login", true);
                setLoading(false);
                return;
            } else {
                const res = await signInWithEmailAndPassword(auth, formData.email.trim(), formData.password);
                if (!res.user.emailVerified) {
                    // Emailni qayta yubormasdan, faqat xabar ko'rsatamiz
                    await signOut(auth);
                    setFormMessage({ type: "error", text: lang === "uz" ? "Email hali tasdiqlanmagan! Pochtangizni oching va tasdiqlash havolasini bosing." : lang === "ru" ? "Email ещё не подтверждён! Откройте почту и перейдите по ссылке подтверждения." : "Email not verified! Please check your inbox and click the verification link." });
                    setLoading(false);
                    return;
                }
            }
            secureRedirect();
        } catch (error) {
            const code = error.code;
            const msg =
                code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found"
                    ? (lang === "uz" ? "Email yoki parol noto'g'ri!" : lang === "ru" ? "Неверный email или пароль!" : "Incorrect email or password!")
                    : code === "auth/too-many-requests"
                        ? (lang === "uz" ? "Juda ko'p urinish! Bir oz kuting." : lang === "ru" ? "Слишком много попыток! Подождите немного." : "Too many attempts! Please wait a moment.")
                        : code === "auth/network-request-failed"
                            ? (lang === "uz" ? "Internet aloqasida muammo!" : lang === "ru" ? "Проблема с интернет-соединением!" : "Network connection problem!")
                            : error.message;
            setFormMessage({ type: "error", text: msg });
            setLoading(false);
        }
    };

    const languages = [
        { value: "uz", label: "O'zbekcha", flag: "/UZ.png" },
        { value: "ru", label: "Русский", flag: "/RU.png" },
        { value: "en", label: "English", flag: "/US.jpg" },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
            {loading && <Loading fullScreen={true} text={t.loading} />}
            <div className="fixed top-4 right-4 flex gap-1.5 z-50">
                {languages.map((l) => (
                    <button
                        key={l.value}
                        onClick={() => { setLang(l.value); localStorage.setItem("language", l.value); }}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${lang === l.value
                            ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                            : "bg-white/80 text-gray-600 hover:bg-white shadow-sm"
                            }`}
                    >
                        <Image src={l.flag} alt={l.label} width={16} height={11} className="w-4 h-3 rounded-sm object-cover" />
                        {l.value.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="relative w-full max-w-[900px] flex rounded-3xl shadow-2xl overflow-hidden min-h-[580px]">

                <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 w-[42%] p-10 relative overflow-hidden">
                    <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/10" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2.5 mb-8">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                <Plane size={20} className="text-white -rotate-45" />
                            </div>
                            <span className="text-white font-black text-xl tracking-tight">iFLY-Tours</span>
                        </div>

                        <h2 className="text-white font-black text-3xl leading-tight mb-3">
                            {mode === "login" ? t.welcome : t.createAccount}
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed whitespace-pre-line font-medium">
                            {t.tagline}
                        </p>
                    </div>

                    <div className="relative z-10">
                        <button
                            type="button"
                            onClick={() => switchMode(mode === "login" ? "register" : "login")}
                            className="w-full border border-white/25 py-3.5 rounded-2xl text-white text-xs font-black tracking-[2px] hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            {mode === "login" ? t.switchToRegister : t.switchToLogin}
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 bg-white dark:bg-slate-900 p-8 md:p-12 flex flex-col justify-center">
                    <form onSubmit={handleSubmit}>
                        <div className={`transition-all duration-300 ${animating ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}`}>
                            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">
                                {mode === "login" ? t.welcome : t.createAccount}
                            </h1>
                            <p className="text-gray-400 dark:text-slate-500 text-sm mb-8 font-medium">
                                iFLY-Tours
                            </p>

                            {mode === "register" && (
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="relative">
                                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600" />
                                        <input
                                            name="firstName" required
                                            placeholder={t.firstName}
                                            onChange={handleChange}
                                            className="auth-input-new"
                                        />
                                    </div>
                                    <div className="relative">
                                        <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600" />
                                        <input
                                            name="lastName" required
                                            placeholder={t.lastName}
                                            onChange={handleChange}
                                            className="auth-input-new"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="relative mb-4">
                                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600" />
                                <input
                                    name="email" type="email" required
                                    placeholder={t.email}
                                    onChange={handleChange}
                                    className="auth-input-new"
                                />
                            </div>

                            <div className="relative mb-2">
                                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600" />
                                <input
                                    name="password" type={showPass ? "text" : "password"} required
                                    placeholder={t.password}
                                    onChange={handleChange}
                                    className={`auth-input-new pr-11 ${mode === "register" && passTyped && (!passChecks.length || !passChecks.upper || !passChecks.number || !passChecks.special)
                                        ? "border-rose-400 focus:border-rose-400"
                                        : ""
                                        }`}
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors"
                                >
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>

                            {mode === "register" && passTyped && (
                                <div className="pass-reqs-box mb-3">
                                    {[
                                        { key: "length", label: t.passReqs?.[0] },
                                        { key: "upper", label: t.passReqs?.[1] },
                                        { key: "number", label: t.passReqs?.[2] },
                                        { key: "special", label: t.passReqs?.[3] },
                                    ].map(({ key, label }) => (
                                        <div key={key} className={`pass-req-item ${passChecks[key] ? "pass-req-ok" : "pass-req-fail"}`}>
                                            <span className="pass-req-dot">{passChecks[key] ? "✓" : "✗"}</span>
                                            {label}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {mode === "login" && (
                                <div className="flex justify-end mb-6">
                                    <button type="button" onClick={handleForgotPassword}
                                        className="text-[10px] text-orange-500 hover:text-orange-600 transition-colors font-bold uppercase tracking-widest"
                                    >
                                        {t.forgotPassword}
                                    </button>
                                </div>
                            )}

                            {mode === "register" && (
                                <div className="relative mb-6 mt-4">
                                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600" />
                                    <input
                                        name="confirmPassword" type={showConfirm ? "text" : "password"} required
                                        placeholder={t.confirmPassword}
                                        onChange={handleChange}
                                        className="auth-input-new pr-11"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 dark:text-slate-600 dark:hover:text-slate-400 transition-colors"
                                    >
                                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            )}

                            {formMessage && (
                                <div className={`p-4 mb-5 rounded-2xl text-xs font-bold flex items-start gap-2.5 ${
                                    formMessage.type === "error" 
                                        ? "bg-rose-50 text-rose-600 border border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20" 
                                        : "bg-green-50 text-green-600 border border-green-100 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20"
                                }`}>
                                    <div className="mt-0.5">{formMessage.type === "error" ? "⚠️" : "✅"}</div>
                                    <span className="leading-snug">{formMessage.text}</span>
                                </div>
                            )}

                            <button
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 text-white py-4 rounded-2xl font-black text-xs tracking-[2px] transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-orange-200 dark:shadow-orange-900/30 mb-5 flex items-center justify-center gap-2"
                            >
                                {loading
                                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin-smooth" /> {t.loading}</>
                                    : <>{mode === "login" ? t.login : t.register} <ArrowRight size={14} /></>
                                }
                            </button>

                            <div className="relative flex items-center justify-center mb-5">
                                <div className="absolute w-full h-px bg-gray-100 dark:bg-slate-800" />
                                <span className="relative bg-white dark:bg-slate-900 px-4 text-[10px] text-gray-400 dark:text-slate-600 font-bold uppercase tracking-widest">
                                    {t.or}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                                <button
                                    type="button" onClick={handleGoogleAuth} disabled={loading}
                                    className="w-full border-2 border-gray-100 dark:border-slate-800 py-3 rounded-2xl flex items-center justify-center gap-2.5 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-bold text-[10px] uppercase tracking-wider text-gray-600 dark:text-slate-400 group"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="16" alt="G" className="transition-transform group-hover:scale-110" />
                                    Google
                                </button>
                                <button
                                    type="button" onClick={handleFacebookAuth} disabled={loading}
                                    className="w-full border-2 border-gray-100 dark:border-slate-800 py-3 rounded-2xl flex items-center justify-center gap-2.5 hover:bg-[#1877F2]/10 dark:hover:bg-[#1877F2]/20 hover:border-[#1877F2]/30 transition-all font-bold text-[10px] uppercase tracking-wider text-[#1877F2] group"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="transition-transform group-hover:scale-110">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                    Facebook
                                </button>
                            </div>

                            <p className="md:hidden mt-5 text-center text-xs text-gray-400 dark:text-slate-600">
                                <button type="button" onClick={() => switchMode(mode === "login" ? "register" : "login")}
                                    className="text-orange-500 font-bold hover:underline"
                                >
                                    {mode === "login" ? t.switchToRegister : t.switchToLogin}
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <style jsx>{`
                .auth-input-new {
                    width: 100%;
                    background: #f8fafc;
                    border: 2px solid #f1f5f9;
                    border-radius: 14px;
                    padding: 12px 16px 12px 36px;
                    outline: none;
                    font-size: 13px;
                    font-weight: 600;
                    color: #0f172a;
                    transition: all 0.25s ease;
                }
                .auth-input-new:focus {
                    border-color: #f97316;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
                }
                .auth-input-new::placeholder {
                    color: #94a3b8;
                    font-weight: 500;
                    text-transform: uppercase;
                    font-size: 10px;
                    letter-spacing: 0.8px;
                }
                :global(.dark) .auth-input-new {
                    background: #1e293b;
                    border-color: #1e293b;
                    color: #f1f5f9;
                }
                :global(.dark) .auth-input-new:focus {
                    border-color: #f97316;
                    background: #263350;
                    box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
                }
                /* Password requirements box */
                .pass-reqs-box {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4px 12px;
                    padding: 10px 12px;
                    background: #f8fafc;
                    border: 1.5px solid #f1f5f9;
                    border-radius: 12px;
                    animation: fadeSlideIn 0.2s ease;
                }
                :global(.dark) .pass-reqs-box {
                    background: #1e293b;
                    border-color: #334155;
                }
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .pass-req-item {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 10px;
                    font-weight: 600;
                    letter-spacing: 0.3px;
                    transition: color 0.2s ease;
                }
                .pass-req-dot {
                    font-size: 11px;
                    font-weight: 800;
                    flex-shrink: 0;
                    transition: color 0.2s ease;
                }
                .pass-req-ok  { color: #16a34a; }
                .pass-req-fail { color: #f43f5e; }
                :global(.dark) .pass-req-ok  { color: #4ade80; }
                :global(.dark) .pass-req-fail { color: #fb7185; }
            `}</style>
        </div>
    );
}