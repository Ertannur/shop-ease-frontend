'use client';
import { useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAPI } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth";
/* import { useCartStore } from "@/stores/cartStore"; */
import { useLikeStore } from "@/stores/likeStore";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  /* const loadUserCart = useCartStore((s) => s.loadUserCart); */
  const loadUserFavorites = useLikeStore((s) => s.loadUserFavorites);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError('');

    try {
      const result = await loginAPI(form.email, form.password);
      
      console.log('Login result:', result);
      
      if (result.success && result.token?.accessToken) {
        // Token'ı localStorage'a kaydet
        localStorage.setItem('token', result.token.accessToken);
        
        // User bilgilerini auth store'a kaydet (backend response'tan al)
        const userInfo = {
          id: result.user?.userId || result.userId || '',
          email: result.user?.email || form.email,
          firstName: result.user?.firstName,
          lastName: result.user?.lastName,
          roles: result.user?.roles || []
        };
        
        setSession(userInfo, result.token.accessToken, result.token.refreshToken);
        
        // Kullanıcının backend'teki verilerini yükle
        try {
          await Promise.all([
            /* loadUserCart(), */
            loadUserFavorites()
          ]);
        } catch (error) {
          console.error('Failed to load user data:', error);
          // Veri yükleme hatası olsa bile devam et
        }
        
        // Account sayfasına yönlendir
        router.push('/account');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Giriş Yap</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Hesabınıza giriş yapın</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
              />
            </div>
            
            {error && (
              <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-3 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline transition-colors duration-200"
            >
              Şifremi Unuttum
            </Link>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Hesabın yok mu?{" "}
            <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium hover:underline transition-colors duration-200">
              Kayıt ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}