import z from "zod/v3";

// Customer bilgileri
export interface CustomerInfo {
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
}

// Ödeme bilgileri
export interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

// Ana sipariş request'i
export interface OrderRequest {
  addressTitle: string;
  customerInfo: CustomerInfo;
  paymentInfo: PaymentInfo;
}

// Zod şemaları
export const customerInfoSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Ad gerekli" })
    .min(2, { message: "Ad en az 2 karakter olmalıdır" }),
  surname: z
    .string()
    .min(1, { message: "Soyad gerekli" })
    .min(2, { message: "Soyad en az 2 karakter olmalıdır" }),
  email: z
    .string()
    .min(1, { message: "Email gerekli" })
    .email({ message: "Geçerli bir email adresi giriniz" })
    .refine(
      (value) => {
        const domain = value.split("@")[1];
        return domain && domain.includes(".");
      },
      { message: "Geçersiz email domain'i" }
    ),
  phone: z
    .string()
    .min(1, { message: "Telefon gerekli" })
    .regex(/^5\d{2}\s\d{3}\s\d{2}\s\d{2}$/, {
      message: "Geçerli bir telefon numarası giriniz (5XX XXX XX XX)",
    })
    .refine(
      (value) => {
        const cleanValue = value.replace(/\s/g, "");
        return cleanValue.length === 10 && cleanValue.startsWith("5");
      },
      { message: "Geçersiz telefon numarası formatı" }
    ),
  address: z
    .string()
    .min(1, { message: "Adres gerekli" })
    .min(10, { message: "Adres en az 10 karakter olmalıdır" }),
  city: z
    .string()
    .min(1, { message: "İl gerekli" })
    .min(2, { message: "İl en az 2 karakter olmalıdır" }),
  district: z
    .string()
    .min(1, { message: "İlçe gerekli" })
    .min(2, { message: "İlçe en az 2 karakter olmalıdır" }),
});

export const paymentInfoSchema = z.object({
  cardNumber: z
    .string()
    .min(1, { message: "Kart numarası gerekli" })
    .regex(/^(\d{4}\s){3}\d{4}$/, {
      message: "Geçerli bir kredi kartı numarası giriniz (1234 5678 9012 3456)",
    })
    .refine(
      (value) => {
        const cleanValue = value.replace(/\s/g, "");
        return cleanValue.length === 16 && /^\d+$/.test(cleanValue);
      },
      { message: "Geçersiz kredi kartı numarası" }
    ),
  expiryDate: z
    .string()
    .min(1, { message: "Kart süresi gerekli" })
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, {
      message: "Geçerli bir tarih giriniz (MM/YY)",
    })
    .refine(
      (value) => {
        const [month, year] = value.split("/");
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear() % 100;
        const currentMonth = currentDate.getMonth() + 1;

        // Geçmiş tarih kontrolü
        if (parseInt(year) < currentYear) return false;
        if (parseInt(year) === currentYear && parseInt(month) < currentMonth)
          return false;

        // Gelecek tarih kontrolü (max 10 yıl)
        if (parseInt(year) > currentYear + 10) return false;

        return true;
      },
      { message: "Kart süresi geçersiz veya çok uzak" }
    ),
  cvv: z
    .string()
    .min(1, { message: "Kart CVV gerekli" })
    .regex(/^[0-9]{3,4}$/, {
      message: "CVV 3 veya 4 haneli olmalıdır",
    })
    .refine(
      (value) => {
        // Visa, Mastercard: 3 haneli, Amex: 4 haneli
        return value.length === 3 || value.length === 4;
      },
      { message: "CVV uzunluğu geçersiz" }
    ),
  cardholderName: z
    .string()
    .min(1, { message: "Kart sahibi gerekli" })
    .min(3, { message: "Kart sahibi en az 3 karakter olmalıdır" })
    .regex(/^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]+$/, {
      message: "Kart sahibi sadece harf içermelidir",
    }),
});

export const orderRequestSchema = z.object({
  addressTitle: z
    .string()
    .min(1, { message: "Adres başlığı gerekli" })
    .min(2, { message: "Adres başlığı en az 2 karakter olmalıdır" }),
  customerInfo: customerInfoSchema,
  paymentInfo: paymentInfoSchema,
});

// Ürün bilgisi
export interface Product {
  name: string;
  price: number;
  quantity: number;
}

// Sipariş verisi (store'da saklanacak)
export interface OrderData {
  orderId: string;
  total: number;
  products: Product[];
  customerInfo: CustomerInfo;
  paymentInfo: PaymentInfo;
  createdAt: Date;
}

// Backend response
export interface OrderResponse {
  success: boolean;
  orderId: string;
  message: string;
}
