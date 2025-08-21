// Address related types based on Swagger documentation

export interface Address {
  adressId: string; // Note: Backend uses "adressId" not "addressId"
  title: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postCode: string;
}

export interface AddAddressRequest {
  title: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postCode: string;
}

export type UserAddressResponse = Address[];
