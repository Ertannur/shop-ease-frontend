"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useCartStore, useLikeStore } from "@/stores";
import { useAuthStore } from "@/features/auth";
import { useLogout } from "@/features/auth";
import AuthToast from "@/components/Toast/AuthToast";

const Navbar = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    position?: { x: number; y: number };
  }>({ show: false, message: "" });

  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalLikes = useLikeStore((state) => state.getTotalItems());
  const isAuthenticated = useAuthStore((state) => state.isAuthed());
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const displayName =
    user?.firstName || user?.name || user?.email || "Kullanıcı";

  // Hydration tamamlandığında state'i güncelle
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Hydration tamamlanmadıysa authentication state'ini gösterme
  const showAuthState = isHydrated && isAuthenticated;

  // Favorites'a auth check ile git
  const handleFavoritesClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();

      // Mouse pozisyonunu al
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: rect.left + rect.width / 2,
        y: rect.top,
      };

      setToast({
        show: true,
        message: "Beğenilerinizi görmek için giriş yapmanız gerekiyor.",
        position,
      });
    }
  };

  const handleSearch = () => {
    if (search.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        search.trim()
      )}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === `Enter`) {
      handleSearch();
    }
  };

  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoadingSuggestions(true);
    try {
      // Basit öneriler - gerçek API'den gelecek
      const mockSuggestions = [
        "Kadın Bluz",
        "Erkek Gömlek",
        "Çocuk Tişört",
        "Kadın Pantolon",
        "Erkek Jean",
        "Kadın Elbise",
        "Erkek Mont",
        "Çocuk Ayakkabı",
      ].filter((item) => item.toLowerCase().includes(query.toLowerCase()));

      setSuggestions(mockSuggestions.slice(0, 5));
      setShowSuggestions(true);
      console.log('Suggestions set:', mockSuggestions.slice(0, 5));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search.length >= 2) {
        fetchSuggestions(search);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300); // 300ms bekle
  
    return () => clearTimeout(timeoutId);
  }, [search]);

  return (
    <>
      <div className="container py-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link
              href="/products?category=kadın"
              className="hover:text-gray-600 transition-colors"
            >
              Kadın
            </Link>
            <Link
              href="/products?category=erkek"
              className="hover:text-gray-600 transition-colors"
            >
              Erkek
            </Link>
            <Link
              href="/products?category=çocuk"
              className="hover:text-gray-600 transition-colors"
            >
              Çocuk
            </Link>
            <Link
              href="/products?category=montlar"
              className="hover:text-gray-600 transition-colors"
            >
              Outlet
            </Link>
            <Link
              href="/products?category=jean"
              className="hover:text-gray-600 transition-colors"
            >
              Geri Dönüştür
            </Link>
          </div>
          {/* logo */}
          <div className="text-2xl font-bold">
            <Link href="/">ShopEase</Link>
          </div>
          {/* arama butonu */}
          <div className="flex gap-4 items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Ürün ara..."
                value={search}
                onFocus={() => {
                  if (suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowSuggestions(false);
                  }, 200);
                }}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                onKeyDown={handleKeyPress}
                className="px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* Arama butonu iconu - tıklanabilir hale getir */}
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-70 transition-opacity"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 2C5.13401 2 2 5.13401 2 9C2 12.866 5.13401 16 9 16C10.8859 16 12.5977 15.2542 13.8564 14.0414C13.8827 14.0072 13.9115 13.9742 13.9429 13.9429C13.9742 13.9115 14.0072 13.8827 14.0414 13.8564C15.2542 12.5977 16 10.8859 16 9C16 5.13401 12.866 2 9 2ZM16.0319 14.6177C17.2635 13.078 18 11.125 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C11.125 18 13.078 17.2635 14.6177 16.0319L18.2929 19.7071C18.6834 20.0976 19.3166 20.0976 19.7071 19.7071C20.0976 19.3166 20.0976 18.6834 19.7071 18.2929L16.0319 14.6177Z"
                    fill="black"
                  />
                </svg>
              </button>
              
              {/* arama önerileri */}
              {showSuggestions && (
                console.log('Rendering dropdown with suggestions:', suggestions),
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-[9999] max-h-60 overflow-y-auto">
                  {isLoadingSuggestions ? (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2"></div>
                        Öneriler yükleniyor...
                      </div>
                    </div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearch(suggestion);
                          setShowSuggestions(false);
                          window.location.href = `/products?search=${encodeURIComponent(
                            suggestion
                          )}`;
                        }}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        {suggestion}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-500 text-sm">
                      Öneri bulunamadı
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* profil iconu */}
            {showAuthState ? (
              <>
                {/* Hoş geldin etiketi */}
                <span className="hidden md:inline-block text-sm text-gray-700 mr-2">
                  Hoş geldin, <strong>{displayName}</strong>
                </span>

                <div className="relative group">
                  <button className="hover:opacity-70 transition-opacity flex items-center gap-2">
                    <svg
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M9 0C11.2091 0 13 1.79086 13 4C13 6.20914 11.2091 8 9 8C6.79086 8 5 6.20914 5 4C5 1.79086 6.79086 0 9 0ZM9 2C7.89543 2 7 2.89543 7 4C7 5.10457 7.89543 6 9 6C10.1046 6 11 5.10457 11 4C11 2.89543 10.1046 2 9 2ZM9 10C13.9706 10 18 14.0294 18 19V20H16V19C16 15.134 12.866 12 9 12C5.13401 12 2 15.134 2 19V20H0V19C0 14.0294 4.02944 10 9 10Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-500">Merhaba,</p>
                        <p className="text-sm font-medium truncate">
                          {displayName}
                        </p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Hesabım
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        Siparişlerim
                      </Link>
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : isHydrated ? (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm hover:underline">
                  Giriş Yap
                </Link>
                <span className="text-gray-300">/</span>
                <Link href="/register" className="text-sm hover:underline">
                  Kayıt Ol
                </Link>
              </div>
            ) : null}

            {/* sepet iconu */}
            <Link
              href="/cart"
              className="hover:opacity-70 transition-opacity relative"
            >
              <svg
                width="20"
                height="22"
                viewBox="0 0 20 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M3.2 0.4C3.38885 0.148194 3.68524 0 4 0H16C16.3148 0 16.6111 0.148194 16.8 0.4L19.8 4.4C19.9298 4.5731 20 4.78363 20 5V19C20 19.7957 19.6839 20.5587 19.1213 21.1213C18.5587 21.6839 17.7957 22 17 22H3C2.20435 22 1.44129 21.6839 0.87868 21.1213C0.31607 20.5587 0 19.7957 0 19V5C0 4.78363 0.0701779 4.5731 0.2 4.4L3.2 0.4ZM4.5 2L3 4H17L15.5 2H4.5ZM18 6H2V19C2 19.2652 2.10536 19.5196 2.29289 19.7071C2.48043 19.8946 2.73478 20 3 20H17C17.2652 20 17.5196 19.8946 17.7071 19.7071C17.8946 19.5196 18 19.2652 18 19V6ZM6 8C6.55228 8 7 8.44772 7 9C7 9.79565 7.31607 10.5587 7.87868 11.1213C8.44129 11.6839 9.20435 12 10 12C10.7956 12 11.5587 11.6839 12.1213 11.1213C12.6839 10.5587 13 9.79565 13 9C13 8.44772 13.4477 8 14 8C14.5523 8 15 8.44772 15 9C15 10.3261 14.4732 11.5979 13.5355 12.5355C12.5979 13.4732 11.3261 14 10 14C8.67392 14 7.40215 13.4732 6.46447 12.5355C5.52678 11.5979 5 10.3261 5 9C5 8.44772 5.44772 8 6 8Z"
                  fill="black"
                />
              </svg>
              {isHydrated && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* wishlist iconu */}
            <Link
              href="/favorites"
              onClick={handleFavoritesClick}
              className="hover:opacity-70 transition-opacity relative"
            >
              <svg
                className="w-5 h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {isHydrated && totalLikes > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalLikes}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Auth Toast */}
      <AuthToast
        show={toast.show}
        message={toast.message}
        position={toast.position}
        onClose={() => setToast({ show: false, message: "" })}
      />
    </>
  );
};

export default Navbar;
