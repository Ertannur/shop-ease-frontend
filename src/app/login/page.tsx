'use client';
import { useState } from "react";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Giriş Yap</h1>
          <p className="text-sm text-gray-600">Hesabınıza giriş yapın</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                E-posta Adresi
              </label>
              <input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Şifre
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200"
            >
              Şifremi Unuttum
            </Link>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Hesabın yok mu?{" "}
            <Link href="/register" className="text-blue-600 hover:text-blue-500 font-medium hover:underline transition-colors duration-200">
              Kayıt ol
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}