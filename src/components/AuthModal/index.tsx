"use client";
import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    // Giriş için
    email: "",
    password: "",
    
    // Kayıt için
    name: "",
    surname: "",
    registerEmail: "",
    registerPassword: "",
    confirmPassword: "",
    phone: "",
    birthDate: "",
    gender: "",
    agreements: {
      terms: false,
      privacy: false,
      marketing: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith("agreements.")) {
        const agreementKey = name.split(".")[1];
        setFormData(prev => ({
          ...prev,
          agreements: {
            ...prev.agreements,
            [agreementKey]: checkbox.checked
          }
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Giriş yapılıyor:", { email: formData.email, password: formData.password });
    // API çağrısı burada yapılacak
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.registerPassword !== formData.confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    console.log("Kayıt olunuyor:", formData);
    // API çağrısı burada yapılacak
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">
            {activeTab === "login" ? "Giriş Yap" : "Kayıt Ol"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("login")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "login"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "register"
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Kayıt Ol
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === "login" ? (
            /* Giriş Formu */
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="E-posta adresiniz"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                />
              </div>
              
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Şifreniz"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  Beni hatırla
                </label>
                <a href="#" className="text-black hover:underline">
                  Şifremi unuttum
                </a>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Giriş Yap
              </button>

              <div className="text-center text-sm text-gray-600">
                Hesabınız yok mu?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className="text-black hover:underline font-medium"
                >
                  Kayıt olun
                </button>
              </div>
            </form>
          ) : (
            /* Kayıt Formu */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Adınız"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                />
                <input
                  type="text"
                  name="surname"
                  placeholder="Soyadınız"
                  value={formData.surname}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                />
              </div>

              <input
                type="email"
                name="registerEmail"
                placeholder="E-posta adresiniz"
                value={formData.registerEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Telefon numaranız"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="birthDate"
                  placeholder="Doğum tarihiniz"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                  required
                >
                  <option value="">Cinsiyet seçiniz</option>
                  <option value="female">Kadın</option>
                  <option value="male">Erkek</option>
                  <option value="other">Diğer</option>
                </select>
              </div>

              <input
                type="password"
                name="registerPassword"
                placeholder="Şifreniz"
                value={formData.registerPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                required
                minLength={6}
              />

              <input
                type="password"
                name="confirmPassword"
                placeholder="Şifrenizi tekrar girin"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-black"
                required
                minLength={6}
              />

              {/* Sözleşmeler */}
              <div className="space-y-3 text-sm">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreements.terms"
                    checked={formData.agreements.terms}
                    onChange={handleInputChange}
                    className="mr-3 mt-1"
                    required
                  />
                  <span>
                    <a href="#" className="text-black hover:underline">Kullanım Koşulları</a> ve{" "}
                    <a href="#" className="text-black hover:underline">Gizlilik Politikası</a>&apos;nı okudum, kabul ediyorum.
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreements.privacy"
                    checked={formData.agreements.privacy}
                    onChange={handleInputChange}
                    className="mr-3 mt-1"
                    required
                  />
                  <span>
                    Kişisel verilerimin işlenmesine dair <a href="#" className="text-black hover:underline">Aydınlatma Metni</a>&apos;ni okudum, onaylıyorum.
                  </span>
                </label>

                <label className="flex items-start">
                  <input
                    type="checkbox"
                    name="agreements.marketing"
                    checked={formData.agreements.marketing}
                    onChange={handleInputChange}
                    className="mr-3 mt-1"
                  />
                  <span>
                    Kampanya, promosyon ve fırsatlardan haberdar olmak istiyorum.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors"
              >
                Kayıt Ol
              </button>

              <div className="text-center text-sm text-gray-600">
                Zaten hesabınız var mı?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="text-black hover:underline font-medium"
                >
                  Giriş yapın
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;