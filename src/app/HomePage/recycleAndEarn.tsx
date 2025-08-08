import React from "react";
import Image from "next/image";

const RecycleAndEarn = () => {
  return (
    <div className="container py-8">
      {/* Başlık */}
      <div className="text-center mb-8">
        <h2 className="text-[40px] font-normal">Geri Dönüştür & Kazan</h2>
      </div>
      
      {/* Görsel Section - container içinde */}
      <div className="relative w-full h-[596px] rounded-lg overflow-hidden">
        <Image 
          src="/images/recycleAndEarnPic.png" 
          alt="recycleAndEarn" 
          fill
          className="object-cover"
        />
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <p className="text-[20px] text-white mb-4">
            Kullanmadığın kıyafetleri gönder, ShopEase puanı olarak indirim kazan
          </p>
          <button className="bg-black rounded-[12px] text-white px-8 py-3 text-lg hover:bg-gray-800 transition-colors duration-300">
            Detaylı Bilgi İçin
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecycleAndEarn;