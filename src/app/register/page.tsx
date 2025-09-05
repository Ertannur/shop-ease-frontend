"use client";
import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAPI } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth";
import { useCartStore } from "@/stores/cartStore";
import { useLikeStore } from "@/stores/likeStore";

function extractErrorMessage(err: unknown): string {
  // Type-safe error handling
  const errorObj = err as { 
    response?: { 
      data?: { 
        message?: string; 
        error?: string; 
        title?: string; 
        detail?: string; 
        errors?: Record<string, string[]>;
      } 
    }; 
    message?: string; 
  };
  
  const msg =
    errorObj?.response?.data?.message ??
    errorObj?.response?.data?.error ??
    errorObj?.message ??
    errorObj?.response?.data?.title ??
    errorObj?.response?.data?.detail ??
    "";

  const errorsObj = errorObj?.response?.data?.errors;
  if (errorsObj && typeof errorsObj === "object") {
    const firstKey = Object.keys(errorsObj)[0];
    const firstArr = firstKey ? errorsObj[firstKey] : undefined;
    if (Array.isArray(firstArr) && firstArr.length > 0) {
      return firstArr[0];
    }
  }
  return msg || "Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.";
}

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const loadUserCart = useCartStore((s) => s.loadUserCart);
  const loadUserFavorites = useLikeStore((s) => s.loadUserFavorites);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: 0 as 0 | 1, // 0: Erkek, 1: Kadın
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Component mount olduğunda dark mode'u kontrol et
  useLayoutEffect(() => {
    const checkDarkMode = () => {
      try {
        const savedDarkMode = localStorage.getItem("darkMode") === "true";
        if (savedDarkMode) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } catch (e) {
        console.error("Dark mode check failed:", e);
      }
      setMounted(true);
    };

    checkDarkMode();

    const handleDarkModeChange = () => {
      checkDarkMode();
    };

    // Storage event dinle (başka tab'dan değişirse)
    window.addEventListener('storage', handleDarkModeChange);
    
    // Custom event dinle (navbar'dan değişirse)
    window.addEventListener('darkModeChanged', handleDarkModeChange);

    return () => {
      window.removeEventListener('storage', handleDarkModeChange);
      window.removeEventListener('darkModeChanged', handleDarkModeChange);
    };
  }, []);

  // Mount olmadan render etme (hydration mismatch'i önle)
  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);

    // Basit validasyon
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setErr("Lütfen geçerli bir e‑posta giriniz.");
      setLoading(false);
      return;
    }
    if (form.password.length < 7) {
      setErr("Şifre en az 7 karakter olmalıdır.");
      setLoading(false);
      return;
    }
    
    // Şifre validation kuralları (backend'e göre)
    const hasUpperCase = /[A-Z]/.test(form.password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(form.password);
    
    if (!hasUpperCase) {
      setErr("Şifre en az bir büyük harf içermelidir.");
      setLoading(false);
      return;
    }
    
    if (!hasSpecialChar) {
      setErr("Şifre en az bir özel karakter içermelidir (!@#$%^&* gibi).");
      setLoading(false);
      return;
    }
    if (!/^(?:\+90|0)?(?:\d{10})$/.test(form.phoneNumber.replace(/\s/g, ""))) {
      setErr("Lütfen geçerli bir telefon numarası giriniz (örn: 05XX XXX XX XX veya +905XX XXX XX XX).");
      setLoading(false);
      return;
    }
    if (!form.dateOfBirth) {
      setErr("Lütfen doğum tarihinizi seçiniz.");
      setLoading(false);
      return;
    }

    try {
      const result = await registerAPI(form);
      
      console.log('Register result:', result);
      
      if (result.success) {
        if (result.token?.accessToken) {
          // Token dönmüşse direkt login yap
          localStorage.setItem('token', result.token.accessToken);
          
          const userInfo = {
            id: result.user?.userId || result.userId || '',
            email: result.user?.email || form.email,
            firstName: result.user?.firstName || form.firstName,
            lastName: result.user?.lastName || form.lastName,
            roles: result.user?.roles || []
          };
          
          setSession(userInfo, result.token.accessToken, result.token.refreshToken);
          
          // Kullanıcının backend'teki verilerini yükle (yeni kullanıcı için boş olacak)
          try {
            await Promise.all([
              loadUserCart(),
              loadUserFavorites()
            ]);
          } catch (error) {
            console.error('Failed to load user data:', error);
            // Veri yükleme hatası olsa bile devam et
          }
          
          router.push('/account');
        } else {
          // Token dönmemişse login sayfasına yönlendir
          alert('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
          router.push('/login');
        }
      } else {
        setErr(result.message || 'Register failed');
      }
    } catch (error: unknown) {
      setErr(extractErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kayıt Ol</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Yeni hesap oluşturun</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Ad
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Adınız"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Soyad
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Soyadınız"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={7}
              />
              
              {/* Şifre Gereksinimleri */}
              <div className="mt-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="font-semibold text-sm text-blue-800 dark:text-blue-300 mb-2">Şifre gereksinimleri:</p>
                <ul className="text-xs space-y-1">
                  <li className={`flex items-center gap-2 ${form.password.length >= 7 ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${form.password.length >= 7 ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}></span>
                    En az 7 karakter
                  </li>
                  <li className={`flex items-center gap-2 ${/[A-Z]/.test(form.password) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${/[A-Z]/.test(form.password) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}></span>
                    En az bir büyük harf (A-Z)
                  </li>
                  <li className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(form.password) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(form.password) ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"}`}></span>
                    En az bir özel karakter (!@#$%^&* gibi)
                  </li>
                </ul>
              </div>
            </div>
            
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefon Numarası
              </label>
              <input
                id="phoneNumber"
                type="tel"
                placeholder="05XX XXX XX XX"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Doğum Tarihi
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Cinsiyet
                </label>
                <select
                  id="gender"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={form.gender}
                  onChange={(e) =>
                    setForm({ ...form, gender: Number(e.target.value) as 0 | 1 })
                  }
                  required
                >
                  <option value={0}>Erkek</option>
                  <option value={1}>Kadın</option>
                </select>
              </div>
            </div>

            {err && (
              <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{err}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {loading ? "Kayıt oluşturuluyor..." : "Kayıt Ol"}
            </button>
          </form>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium hover:underline transition-colors duration-200">
              Giriş yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}