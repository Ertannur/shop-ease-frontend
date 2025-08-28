"use client";
import { useState } from "react";
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
    gender: 0 as 0 | 1 | 2, // 0: Erkek, 1: Kadın, 2: Diğer (backend enum'una göre ayarla)
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

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
            id: result.userId || '',
            email: form.email,
            firstName: result.user?.firstName || form.firstName,
            lastName: result.user?.lastName || form.lastName,
            roles: result.user?.roles || []
          };
          
          setSession(userInfo, result.token.accessToken);
          
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
    <div className="container max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">Kayıt Ol</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Ad"
          className="w-full border p-3 rounded"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Soyad"
          className="w-full border p-3 rounded"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          required
        />
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
          minLength={7}
        />
        
        {/* Şifre Gereksinimleri */}
        <div className="bg-blue-50 p-3 rounded text-sm">
          <p className="font-semibold mb-2">Şifre gereksinimleri:</p>
          <ul className="text-xs space-y-1">
            <li className={form.password.length >= 7 ? "text-green-600" : "text-gray-600"}>
              ✓ En az 7 karakter
            </li>
            <li className={/[A-Z]/.test(form.password) ? "text-green-600" : "text-gray-600"}>
              ✓ En az bir büyük harf (A-Z)
            </li>
            <li className={/[!@#$%^&*(),.?":{}|<>]/.test(form.password) ? "text-green-600" : "text-gray-600"}>
              ✓ En az bir özel karakter (!@#$%^&* gibi)
            </li>
          </ul>
        </div>
        <input
          type="tel"
          placeholder="Telefon (örn: 05551234567 veya +905551234567)"
          className="w-full border p-3 rounded"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Doğum Tarihi"
          className="w-full border p-3 rounded"
          value={form.dateOfBirth}
          onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
          required
        />
        <select
          className="w-full border p-3 rounded"
          value={form.gender}
          onChange={(e) =>
            setForm({ ...form, gender: Number(e.target.value) as 0 | 1 | 2 })
          }
          required
        >
          <option value={0}>Erkek</option>
          <option value={1}>Kadın</option>
          <option value={2}>Diğer</option>
        </select>

        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          {loading ? "Gönderiliyor..." : "Kayıt Ol"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        Zaten hesabın var mı? <Link href="/login" className="underline">Giriş yap</Link>
      </p>
    </div>
  );
}