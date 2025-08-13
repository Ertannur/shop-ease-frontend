"use client";
import { AuthGuard } from "@/components";
import { useAuthStore, useLogout } from "@/features/auth";

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  const displayName = user?.firstName || user?.name || user?.email || "Kullanıcı";

  return (
    <AuthGuard>
      <div className="container py-12 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Hesabım</h1>
          <p className="text-gray-600 mt-1">Hoş geldin, <strong>{displayName}</strong> 👋</p>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Profil Bilgileri</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><span className="text-gray-500">Ad: </span>{user?.firstName ?? "-"}</li>
            <li><span className="text-gray-500">Soyad: </span>{user?.lastName ?? "-"}</li>
            <li><span className="text-gray-500">E‑posta: </span>{user?.email ?? "-"}</li>
            <li><span className="text-gray-500">Roller: </span>{user?.roles?.join(", ") || "-"}</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Hesap İşlemleri</h3>
          <button className="px-4 py-2 border rounded hover:bg-gray-50">Parola Değiştir</button>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Oturum</h3>
          <button onClick={logout} className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800">Çıkış Yap</button>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}