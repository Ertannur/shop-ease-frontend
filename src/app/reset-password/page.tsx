"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordAPI } from '@/features/auth';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [form, setForm] = useState({
    email: '',
    newPassword: '',
    confirmPassword: '',
    token: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // URL'den token ve email parametrelerini al
    const tokenFromUrl = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');
    
    if (tokenFromUrl) {
      setForm(prev => ({ ...prev, token: tokenFromUrl }));
    }
    if (emailFromUrl) {
      setForm(prev => ({ ...prev, email: emailFromUrl }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): string | null => {
    if (!form.email) return 'E-posta adresi gereklidir';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Geçerli bir e-posta adresi girin';
    if (!form.newPassword) return 'Yeni şifre gereklidir';
    if (form.newPassword.length < 6) return 'Şifre en az 6 karakter olmalıdır';
    if (form.newPassword !== form.confirmPassword) return 'Şifreler eşleşmiyor';
    if (!form.token) return 'Doğrulama kodu gereklidir';
    
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setMessage({ type: 'error', text: validationError });
      return;
    }

    try {
      setLoading(true);
      setMessage(null);
      
      const response = await resetPasswordAPI({
        email: form.email,
        newPassword: form.newPassword,
        token: form.token
      });
      
      setIsSubmitted(true);
      setMessage({ 
        type: 'success', 
        text: response.message || 'Şifreniz başarıyla değiştirildi' 
      });
      
      // 3 saniye sonra login sayfasına yönlendir
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error: unknown) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Şifre sıfırlama işlemi başarısız oldu' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted && message?.type === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
                Şifre Başarıyla Değiştirildi
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Şifreniz başarıyla güncellendi. Yeni şifrenizle giriş yapabilirsiniz.
              </p>
              <p className="mt-4 text-xs text-gray-500">
                3 saniye içinde giriş sayfasına yönlendirileceksiniz...
              </p>
              
              <div className="mt-6">
                <Link
                  href="/login"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Şimdi Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Şifre Sıfırla
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Yeni şifrenizi belirleyin
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta Adresi
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={form.email}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="ornek@email.com"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700">
                Doğrulama Kodu
              </label>
              <div className="mt-1">
                <input
                  id="token"
                  name="token"
                  type="text"
                  required
                  value={form.token}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="E-postanızdan aldığınız kodu girin"
                  disabled={loading}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                E-postanızda gelen doğrulama kodunu girin
              </p>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Yeni Şifre
              </label>
              <div className="mt-1">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.newPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="En az 6 karakter"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Yeni Şifre (Tekrar)
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Şifrenizi tekrar girin"
                  disabled={loading}
                />
              </div>
            </div>

            {message && (
              <div className={`p-3 rounded ${
                message.type === 'error' 
                  ? 'bg-red-100 border border-red-400 text-red-700' 
                  : 'bg-green-100 border border-green-400 text-green-700'
              }`}>
                {message.text}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Şifre Sıfırlanıyor...
                  </div>
                ) : (
                  'Şifremi Sıfırla'
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">veya</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Giriş Sayfasına Dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
