"use client";
import Link from "next/link";
import React, { useState } from "react";
import AuthModal from "../AuthModal";
import { useCartStore } from "../../stores/cartStore";
import { useLikeStore } from "../../stores/likeStore";

const Navbar = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalLikes = useLikeStore((state) => state.getTotalItems());

  return (
    <>
      <div className="container py-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Link
              href="/products?category=kadin"
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
              href="/products?category=cocuk"
              className="hover:text-gray-600 transition-colors"
            >
              Çocuk
            </Link>
            <Link
              href="/products?category=outlet"
              className="hover:text-gray-600 transition-colors"
            >
              Outlet
            </Link>
            <Link
              href="/products?category=recycle"
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
                placeholder="Ara..."
                className="px-4 py-2 pr-10 border border-gray-300 rounded-md"
              />
              {/* arama butonu iconu */}
              <svg
                className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer"
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
            </div>

            {/* profil iconu */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="hover:opacity-70 transition-opacity"
            >
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
                  d="M9 2C7.34315 2 6 3.34315 6 5C6 6.65685 7.34315 8 9 8C10.6569 8 12 6.65685 12 5C12 3.34315 10.6569 2 9 2ZM4 5C4 2.23858 6.23858 0 9 0C11.7614 0 14 2.23858 14 5C14 7.76142 11.7614 10 9 10C6.23858 10 4 7.76142 4 5ZM1.46447 13.4645C2.40215 12.5268 3.67392 12 5 12H13C14.3261 12 15.5979 12.5268 16.5355 13.4645C17.4732 14.4021 18 15.6739 18 17V19C18 19.5523 17.5523 20 17 20C16.4477 20 16 19.5523 16 19V17C16 16.2044 15.6839 15.4413 15.1213 14.8787C14.5587 14.3161 13.7956 14 13 14H5C4.20435 14 3.44129 14.3161 2.87868 14.8787C2.31607 15.4413 2 16.2043 2 17V19C2 19.5523 1.55228 20 1 20C0.447715 20 0 19.5523 0 19V17C0 15.6739 0.526784 14.4021 1.46447 13.4645Z"
                  fill="black"
                />
              </svg>
            </button>
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
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalItems}
                </span>
              )}
            </Link>
            <Link href="/like" className="hover:opacity-70 transition-opacity relative">
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
              {totalLikes > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {totalLikes}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
