"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const NewCollection = () => {
  return (
    <div className="container py-12  dark:bg-slate-900">
      {/* Başlık - Marka kimliği ile uyumlu */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 dark:from-purple-400 dark:via-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-4">
          Yeni | Yaz Koleksiyonu
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          ShopEase&apos;in özel tasarım koleksiyonunu keşfedin. Modern, şık ve
          konforlu parçalar.
        </p>
      </div>

      <div className="relative w-full h-auto ">
        <div className="flex rounded-2xl transition-transform duration-700 group-hover:scale-105 ">
          {/* Sol Görsel */}
          <div className="w-1/2 h-full relative aspect-[4/3] rounded-l-2xl overflow-hidden">
            <Image
              src="/images/newCollectionFirst.png"
              fill
              className="object-cover "
              alt="Yaz Koleksiyonu - Plaj"
              priority={true}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>

          {/* Sağ Görsel */}
          <div className="w-1/2 h-full relative aspect-[4/3] rounded-r-2xl overflow-hidden">
            <Image
              src="/images/newCollectionSecond.png"
              fill
              alt="Yaz Koleksiyonu - Kıyafetler"
              className="object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,..."
            />
          </div>
          {/* Ana Keşfet Butonu - Gradient ve animasyonlu */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Link href="/products">
              <button className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-2xl text-xl font-bold shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 hover:shadow-purple-500/25">
                <span className="flex items-center gap-2">
                  Şimdi Keşfet
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewCollection;
