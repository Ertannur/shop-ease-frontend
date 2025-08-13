"use client";
import { AuthGuard } from "@/components";

export default function AccountPage() {
  return (
    <AuthGuard>
      <div className="container py-12">
        <h1 className="text-2xl font-bold">Hesabım</h1>
        <p>Hoş geldin!</p>
      </div>
    </AuthGuard>
  );
}