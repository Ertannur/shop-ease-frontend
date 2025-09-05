'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/features/auth';
import { 
  addAddressAPI, 
  getUserAddressAPI, 
  updateAddressAPI, 
  deleteAddressAPI 
} from '@/features/address';
import { 
  Address, 
  AddAddressRequest, 
  UpdateAddressRequest 
} from '@/Types';

export default function AddressTestPage() {
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state for adding/updating addresses
  const [formData, setFormData] = useState<AddAddressRequest>({
    title: '',
    name: '',
    surname: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    postCode: ''
  });

  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  // Fetch user addresses on component mount
  useEffect(() => {
    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const userAddresses = await getUserAddressAPI();
      setAddresses(userAddresses);
    } catch (err) {
      setError('Adresler yüklenirken hata oluştu: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await addAddressAPI(formData);
      
      if (response.success) {
        setSuccess(response.message);
        setFormData({
          title: '',
          name: '',
          surname: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          district: '',
          postCode: ''
        });
        await fetchAddresses(); // Refresh addresses list
      } else {
        setError('Adres eklenirken hata oluştu');
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { Errors?: Record<string, string[]> } } };
        if (error.response?.data?.Errors) {
          // Handle validation errors
          const errors = error.response.data.Errors;
          const errorMessages = Object.values(errors).flat().join(', ');
          setError('Validasyon hatası: ' + errorMessages);
        } else {
          setError('Adres eklenirken hata oluştu');
        }
      } else {
        setError('Adres eklenirken hata oluştu: ' + String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddress) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const updateData: UpdateAddressRequest = {
        ...formData,
        adressId: editingAddress.adressId
      };

      const response = await updateAddressAPI(updateData);
      
      if (response.success) {
        setSuccess(response.message);
        setEditingAddress(null);
        setFormData({
          title: '',
          name: '',
          surname: '',
          email: '',
          phone: '',
          address: '',
          city: '',
          district: '',
          postCode: ''
        });
        await fetchAddresses(); // Refresh addresses list
      } else {
        setError('Adres güncellenirken hata oluştu');
      }
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { Errors?: Record<string, string[]> } } };
        if (error.response?.data?.Errors) {
          const errors = error.response.data.Errors;
          const errorMessages = Object.values(errors).flat().join(', ');
          setError('Validasyon hatası: ' + errorMessages);
        } else {
          setError('Adres güncellenirken hata oluştu');
        }
      } else {
        setError('Adres güncellenirken hata oluştu: ' + String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (adressId: string) => {
    if (!confirm('Bu adresi silmek istediğinizden emin misiniz?')) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const response = await deleteAddressAPI({ adressId });
      
      if (response.success) {
        setSuccess(response.message);
        await fetchAddresses(); // Refresh addresses list
      } else {
        setError('Adres silinirken hata oluştu');
      }
    } catch (err) {
      setError('Adres silinirken hata oluştu: ' + String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      title: address.title,
      name: address.name,
      surname: address.surname,
      email: address.email,
      phone: address.phone,
      address: address.address,
      city: address.city,
      district: address.district,
      postCode: address.postCode
    });
  };

  const cancelEdit = () => {
    setEditingAddress(null);
    setFormData({
      title: '',
      name: '',
      surname: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      district: '',
      postCode: ''
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Address API Test</h1>
        <p>Please login to test address functionality.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Address API Test</h1>
      
      {/* User Info */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">User Info</h2>
        <p>User ID: {user.id}</p>
        <p>Email: {user.email}</p>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      {/* Add/Update Address Form */}
      <div className="bg-blue-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editingAddress ? 'Update Address' : 'Add New Address'}
        </h2>
        
        <form onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="title"
              placeholder="Title (e.g., Ev, İş Yeri)"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="surname"
              placeholder="Surname"
              value={formData.surname}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone (e.g., 05510876804)"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="district"
              placeholder="District"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
            <input
              type="text"
              name="postCode"
              placeholder="Post Code"
              value={formData.postCode}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          
          <textarea
            name="address"
            placeholder="Full Address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 border rounded h-24"
            required
          />

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Processing...' : (editingAddress ? 'Update Address' : 'Add Address')}
            </button>
            
            {editingAddress && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Addresses List */}
      <div className="bg-green-100 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">User Addresses ({addresses.length})</h2>
          <button
            onClick={fetchAddresses}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        {loading && <p>Loading addresses...</p>}

        <div className="space-y-4">
          {addresses.map(address => (
            <div key={address.adressId} className="bg-white p-4 rounded border">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{address.title}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.adressId)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><strong>Name:</strong> {address.name} {address.surname}</p>
                <p><strong>Email:</strong> {address.email}</p>
                <p><strong>Phone:</strong> {address.phone}</p>
                <p><strong>City:</strong> {address.city}, {address.district}</p>
                <p><strong>Post Code:</strong> {address.postCode}</p>
                <p className="md:col-span-2"><strong>Address:</strong> {address.address}</p>
                <p className="md:col-span-2"><strong>ID:</strong> {address.adressId}</p>
              </div>
            </div>
          ))}
        </div>

        {addresses.length === 0 && !loading && (
          <p className="text-gray-500">No addresses found. Add your first address above.</p>
        )}
      </div>

      {/* Debug Info */}
      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Debug Info</h2>
        <pre className="text-xs bg-white p-2 rounded overflow-auto">
          {JSON.stringify({
            userLoaded: !!user,
            addressesCount: addresses.length,
            isEditing: !!editingAddress,
            formDataValid: Object.values(formData).every(value => value.trim() !== ''),
            loading,
            hasError: !!error,
            hasSuccess: !!success
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
