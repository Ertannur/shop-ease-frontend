'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAPI } from "@/features/auth/api";
import { useAuthStore } from "@/features/auth";
import { useCartStore } from "@/stores/cartStore";
import { useLikeStore } from "@/stores/likeStore";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const loadUserCart = useCartStore((s) => s.loadUserCart);
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
        
        // User bilgilerini auth store'a kaydet
        const userInfo = {
          id: result.userId || '',
          email: form.email,
          firstName: result.user?.firstName,
          lastName: result.user?.lastName,
          roles: result.user?.roles || []
        };
        
        setSession(userInfo, result.token.accessToken);
        
        // Kullanıcının backend'teki verilerini yükle
        try {
          await Promise.all([
            loadUserCart(),
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
    <div className="container max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">Giriş Yap</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="E-posta"
          className="w-full border p-3 rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          className="w-full border p-3 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          {loading ? "Gönderiliyor..." : "Giriş Yap"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Hesabın yok mu? <Link href="/register" className="underline">Kayıt ol</Link>
      </p>
    </div>
  );
}