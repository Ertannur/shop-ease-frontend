"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register, useAuthStore } from "@/features/auth";

function extractErrorMessage(err: unknown): string {
  const anyErr = err as any;
  const msg =
    anyErr?.response?.data?.message ??
    anyErr?.response?.data?.error ??
    anyErr?.message ??
    anyErr?.response?.data?.title ??
    anyErr?.response?.data?.detail ??
    "";

  const errorsObj = anyErr?.response?.data?.errors;
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
    if (form.password.length < 6) {
      setErr("Şifre en az 6 karakter olmalıdır.");
      setLoading(false);
      return;
    }
    if (!/^\+?\d{10,15}$/.test(form.phoneNumber.replace(/\s/g, ""))) {
      setErr("Lütfen geçerli bir telefon numarası giriniz (10‑15 haneli).");
      setLoading(false);
      return;
    }
    if (!form.dateOfBirth) {
      setErr("Lütfen doğum tarihinizi seçiniz.");
      setLoading(false);
      return;
    }

    try {
      const res = await register(form);
      setSession(res.user, res.accessToken ?? null, res.refreshToken ?? null);
      router.push("/");
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
          placeholder="Şifre (en az 6 karakter)"
          className="w-full border p-3 rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={6}
        />
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