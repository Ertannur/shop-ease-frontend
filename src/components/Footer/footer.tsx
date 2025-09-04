"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
const Footer = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (pathname.includes("/products")) {
      const urlParams = new URLSearchParams(window.location.search);
      const type = urlParams.get("type");
      return type === path;
    }
    return pathname === path;
  };
  return (
    <div className="footer">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* ShopEase Bölümü */}
          <div className="footer-section">
            <h3 className="footer-title">ShopEase</h3>
            <p className="footer-text">
              Lorem ipsum dolor sit amet consectetur. Vulputate nec ut eu
              senectus nulla. Amet proin bibendum sit dolor in mi eros elit
              eget.
            </p>
          </div>

          {/* Kampanyalar Bölümü 
        dinamik route kullanarak olan sayfa üzerinde başlık değişerek geliyor.
        query parametleri ile aynı sayfada farklı içerikler geliyor.
        next.js' nin özelliği olarak tek sayfada farklı içerikler geliyor.
        */}

          <div className="footer-section">
            <h4 className="footer-title">
              KAMPANYALAR
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/products?type=discounted"
                  className={`footer-link ${
                    isActive("discounted") ? "active" : ""
                  }`}
                >
                  İNDİRİMLİ ÜRÜNLER
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=best-sellers"
                  className={`footer-link ${
                    isActive("best-sellers") ? "active" : ""
                  }`}
                >
                  EN ÇOK SATANLAR
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=weekly"
                  className={`footer-link ${
                    isActive("weekly") ? "active" : ""
                  }`}
                >
                  HAFTANIN ÜRÜNLERİ
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=new"
                  className={`footer-link ${isActive("new") ? "active" : ""}`}
                >
                  YENİ ÜRÜNLER
                </Link>
              </li>
              <li>
                <Link
                  href="/products?type=discounted"
                  className={`footer-link ${
                    isActive("discounted") ? "active" : ""
                  }`}
                >
                  FIRSAT ÜRÜNLERİ
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim Bölümü */}
          <div className="footer-section">
            <h4 className="footer-title">
              İLETİŞİM
            </h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="contact-icon">
                  <svg
                    width="14"
                    height="16"
                    viewBox="0 0 14 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 6.6665C13 11.3332 7 15.3332 7 15.3332C7 15.3332 1 11.3332 1 6.6665C1 5.0752 1.63214 3.54908 2.75736 2.42386C3.88258 1.29864 5.4087 0.666504 7 0.666504C8.5913 0.666504 10.1174 1.29864 11.2426 2.42386C12.3679 3.54908 13 5.0752 13 6.6665Z"
                      stroke="#ADB5BD"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M7 8.6665C8.10457 8.6665 9 7.77107 9 6.6665C9 5.56193 8.10457 4.6665 7 4.6665C5.89543 4.6665 5 5.56193 5 6.6665C5 7.77107 5.89543 8.6665 7 8.6665Z"
                      stroke="#ADB5BD"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="contact-text text-sm">
                  Lorem ipsum dolor sit amet consectetur
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="contact-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M14.6666 11.2802V13.2802C14.6674 13.4659 14.6294 13.6497 14.555 13.8198C14.4806 13.9899 14.3715 14.1426 14.2347 14.2681C14.0979 14.3937 13.9364 14.4892 13.7605 14.5487C13.5846 14.6082 13.3982 14.6303 13.2133 14.6136C11.1619 14.3907 9.19131 13.6897 7.45998 12.5669C5.84919 11.5433 4.48353 10.1777 3.45998 8.56689C2.33329 6.8277 1.63214 4.84756 1.41331 2.78689C1.39665 2.60254 1.41856 2.41673 1.47764 2.24131C1.53673 2.06589 1.63169 1.90469 1.75649 1.76797C1.88128 1.63126 2.03318 1.52203 2.2025 1.44724C2.37183 1.37245 2.55487 1.33374 2.73998 1.33356H4.73998C5.06351 1.33038 5.37717 1.44495 5.62248 1.65592C5.8678 1.86689 6.02803 2.15986 6.07331 2.48023C6.15772 3.12027 6.31428 3.74871 6.53998 4.35356C6.62967 4.59218 6.64908 4.8515 6.59591 5.10081C6.54274 5.35012 6.41922 5.57897 6.23998 5.76023L5.39331 6.60689C6.34235 8.27592 7.72428 9.65786 9.39331 10.6069L10.24 9.76023C10.4212 9.58099 10.6501 9.45746 10.8994 9.40429C11.1487 9.35112 11.408 9.37053 11.6466 9.46023C12.2515 9.68593 12.8799 9.84248 13.52 9.92689C13.8438 9.97258 14.1396 10.1357 14.351 10.3852C14.5624 10.6348 14.6748 10.9533 14.6666 11.2802Z"
                      stroke="#ADB5BD"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <p className="contact-text text-sm">0555 555 55 55</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="contact-icon">
                  <svg
                    width="16"
                    height="12"
                    viewBox="0 0 16 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M2.07107 1.70263L8.00002 5.8529L13.929 1.70263C13.8187 1.48462 13.592 1.33333 13.3334 1.33333H2.66669C2.40805 1.33333 2.18133 1.48462 2.07107 1.70263ZM14 3.28044L8.38233 7.21282C8.15278 7.3735 7.84726 7.3735 7.61771 7.21282L2.00002 3.28044V10C2.00002 10.3651 2.30154 10.6667 2.66669 10.6667H13.3334C13.6985 10.6667 14 10.3651 14 10V3.28044ZM0.666687 2C0.666687 0.898477 1.56516 0 2.66669 0H13.3334C14.4349 0 15.3334 0.898477 15.3334 2V10C15.3334 11.1015 14.4349 12 13.3334 12H2.66669C1.56516 12 0.666687 11.1015 0.666687 10V2Z"
                      fill="#ADB5BD"
                    />
                  </svg>
                </span>
                <p className="contact-text text-sm">info@shopease.com</p>
              </div>
            </div>
          </div>

          {/* E-Bültene Kayıt + Sosyal Medya */}
          <div className="footer-section">
            <h4 className="footer-title">
              E- BÜLTENE KAYIT OL
            </h4>
            <p className="footer-text text-sm mb-4">
              Fırsatlardan haberdar olmak için
            </p>

            {/* Email Input */}
            <div className="flex mb-6">
              <input
                type="email"
                placeholder="E-mail adresinizi yazınız..."
                className="footer-input flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-black text-sm"
              />
              <button className="footer-button  px-6 py-2 rounded-r-md text-sm">
                Detaylı bilgi
              </button>
            </div>

            {/* Sosyal Medya */}
            <div className="footer-section">
              <h5 className="footer-title">
                SOSYAL MEDYA
              </h5>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="social-icon"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Instagram Icon */}
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="social-icon"
                >
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {/* Twitter/X Icon */}
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default Footer;
