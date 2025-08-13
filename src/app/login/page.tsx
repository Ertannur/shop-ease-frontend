'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login, useAuthStore } from "@/features/auth";

export default function LoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    try {
      const res = await login(form);
      // httpOnly cookie ise accessToken gelmeyebilir; sorun değil.
      setSession(res.user, res.accessToken ?? null, res.refreshToken ?? null);
      router.push("/"); // giriş sonrası ana sayfaya yönlendir
    } catch (error: unknown) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Giriş başarısız";
      setErr(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md py-12">
      <h1 className="text-2xl font-bold mb-6">Giriş Yap</h1>
      <form onSubmit={onSubmit} className="space-y-4">
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
        {err && <p className="text-red-600 text-sm">{err}</p>}
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