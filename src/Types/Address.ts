// Address related types based on Backend API documentation

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

export interface UpdateAddressRequest extends AddAddressRequest {
  adressId: string;
}

export interface DeleteAddressRequest {
  adressId: string;
}

export interface AddressApiResponse {
  success: boolean;
  message: string;
}

export interface AddressValidationError {
  Message: string;
  Errors: {
    [key: string]: string[];
  };
}

export type UserAddressResponse = Address[];
