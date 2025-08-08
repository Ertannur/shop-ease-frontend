import React from "react";
import Image from "next/image";

const NewCollection = () => {
  return (
    <div className="container py-8">
      {/* Başlık */}
      <div className="text-center mb-8">
        <h2 className="text-[40px] font-normal">Yeni | Yaz Koleksiyonu</h2>
      </div>
      
      {/* Görsel Section - container içinde */}
      <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
        <div className="flex h-full">
          {/* Sol Görsel */}
          <div className="w-1/2 h-full">
            <Image
              src="/images/newCollectionFirst.png"
              width={960}
              height={600}
              alt="Yaz Koleksiyonu - Plaj"
              className="w-full h-full object-cover"
              priority={true}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>

          {/* Sağ Görsel*/}
          <div className="w-1/2 h-full">
            <Image
              src="/images/newCollectionSecond.png"
              width={960}
              height={600}
              alt="Yaz Koleksiyonu - Kıyafetler"
              className="w-full h-full object-cover"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
        </div>

        {/* Şimdi Keşfet Butonu */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <button className="bg-black rounded-[12px] text-white px-8 py-3 text-lg hover:bg-gray-800 transition-colors duration-300">
            Şimdi Keşfet
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCollection;