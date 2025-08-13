import { api, AUTH_ENDPOINTS } from "@/lib";

export type LoginDto = { email: string; password: string };
export type RegisterDto = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: 0 | 1 | 2   // 0: male, 1: female, 2: other
};

export type AuthResponse = {
  user: { id: string; email: string; name?: string; roles?: string[] };
  accessToken?: string; // httpOnly cookie kullanılıyorsa bu alan gelmeyebilir
  refreshToken?: string; // refresh varsa
};

export async function login(data: LoginDto): Promise<AuthResponse> {
  const res = await api.post(AUTH_ENDPOINTS.login, data);
  return res.data;
}

export async function register(data: RegisterDto): Promise<AuthResponse> {
  const res = await api.post(AUTH_ENDPOINTS.register, data);
  return res.data;
}
