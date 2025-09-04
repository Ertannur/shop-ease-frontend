"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const RecycleAndEarn = () => {
  const router = useRouter();

  const handleJeanClick = () => {
    console.log("Jean button clicked!");
    router.push("/products?category=jean");
  };

  const handleNewClick = () => {
    console.log("New models button clicked!");
    router.push("/products?type=new");
  };

  return (
    <div className="container py-12  from-indigo-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
      {/* Başlık - Jean teması ile uyumlu */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-4">
          Jean Koleksiyonu
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Klasik ve modern jean modelleri ile tarzınızı tamamlayın
        </p>
      </div>

      {/* Görsel Section - Jean teması ile */}
      <div className="relative w-full h-[596px] rounded-2xl overflow-hidden group shadow-2xl">
        <Image
          src="/images/recycleAndEarnPic.png"
          alt="Jean Koleksiyonu - Klasik ve Modern Modeller"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
        />

        {/* Gradient Overlay - Jean teması */}
        {/* <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 via-blue-800/40 to-transparent"></div>
 */}
        {/* Content */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center w-full px-8 z-10">
          <div className="max-w-2xl mx-auto">
            <p className="text-xl md:text-2xl text-white mb-6 font-light leading-relaxed">
              En kaliteli jean modelleri ile
              <span className="font-semibold text-blue-300">
                {" "}
                tarzınızı keşfedin
              </span>
            </p>

            {/* Özellikler - Jean teması */}
            <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-gray-200">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>%100 Pamuk</span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
                <span>Kaliteli Kumaş</span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <svg
                  className="w-4 h-4 text-blue-400"
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
                <span>Klasik Tasarım</span>
              </div>
            </div>

            {/* Butonlar - Jean koleksiyonu */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleJeanClick}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 hover:shadow-blue-500/25 group cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  Jean Koleksiyonunu İncele
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

              <button
                onClick={handleNewClick}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-2xl text-lg font-semibold border border-white/30 hover:border-white/50 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Yeni Modeller
              </button>
            </div>
          </div>
        </div>

        {/* Hover efekti - Jean teması */}
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Alt bilgi - Jean teması */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          * Tüm jean modellerimiz dayanıklı kumaş ve kaliteli dikiş ile
          üretilmiştir
        </p>
      </div>
    </div>
  );
};

export default RecycleAndEarn;