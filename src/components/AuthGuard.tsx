"use client";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/auth";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isAuthed = useAuthStore((s) => s.isAuthed());

  useEffect(() => {
    if (!isAuthed) router.replace("/login");
  }, [isAuthed, router]);

  if (!isAuthed) return null; // veya loading skeleton
  return <>{children}</>;
}