"use client";
import React, { useState, useEffect } from "react";

const DiscountSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 1,
      title: "%50 İndirim",
      subtitle: "Yeni Sezon Ürünlerinde",
      image: "/images/unsplash_qnKhZJPKFD8.png",
    },
    {
      id: 2,
      title: "Ücretsiz Kargo",
      subtitle: "500₺ ve Üzeri Alışverişlerde",
      bgColor: "#3B82F6",
    },
    {
      id: 3,
      title: "Yeni Koleksiyon",
      subtitle: "2025 Bahar Modelleri",
      bgColor: "#10B981",
    },
  ];

  // Otomatik ilerleme
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 4000); // 4 saniyede bir

      return () => clearInterval(interval);
    }
  }, [isPaused, slides.length]);

  // Manuel kontrol
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };
  //noktalar
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="container py-8">
    <div 
      className="relative w-full h-[596px] overflow-hidden rounded-lg"
      onMouseEnter={() => setIsPaused(true)}  // Mouse üzerindeyken durdur
      onMouseLeave={() => setIsPaused(false)} // Mouse çıkınca devam et
    >
      {/* Slider Container */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-[596px] flex items-center justify-center text-white relative"
            style={{
              backgroundImage: slide.image ? `url('${slide.image}')` : 'none',
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundColor: slide.bgColor || "#000000",
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>
            <div className="text-center relative z-10">
              <p className="text-[40px]">{slide.subtitle}</p>
              <h2 className="text-[80px] font-bold mb-2">{slide.title}</h2>
              <div className="mt-20">
                <button className="bg-white text-black px-10 py-2 rounded-[12px]">
                  Alışverişe Başla
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Okları */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 z-10"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full p-2 z-10"
      >
        →
      </button>

      {/* Noktalar */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full ${
              currentSlide === index ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
    </div>
  );
};

export default DiscountSection;