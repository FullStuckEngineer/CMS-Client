"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Select from 'react-select';

const AddressDetailPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [address, setAddress] = useState(null);
    const [cities, setCities] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        if (id) {
            fetchAddressData(id);
            fetchCities();
            fetchUsers();
        }
    }, [id]);

    const fetchAddressData = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/addresses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAddress(response.data.data);
            setLoading(false);
        } catch (error) {
            setError(error.message || "Error fetching address data");
            setLoading(false);
        }
    };

    const fetchCities = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/cities`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCities(response.data.data.cities.map(city => ({ value: city.id, label: city.name })));
        } catch (error) {
            console.error("Fetch cities error:", error.message || error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setUsers(response.data.data.users.map(user => ({ value: user.id, label: user.name })));
        } catch (error) {
            console.error("Fetch users error:", error.message || error);
        }
    };

    const saveAddress = async (updatedAddress) => {
        if (!updatedAddress.receiver_name) {
            setNameError("Receiver name cannot be empty");
            return;
        } else {
            setNameError("");
        }

        try {
            const token = sessionStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/addresses/${id}`, updatedAddress, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/addresses');
        } catch (error) {
            setError(error.message || "Error saving address data");
        }
    };

    const deleteAddress = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/addresses/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/addresses');
        } catch (error) {
            setError(error.message || "Error deleting address");
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return formattedDate;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Address Details</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-darkGrey">ID</label>
                    <input
                        type="text"
                        value={address.id}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Receiver Name</label>
                    <input
                        type="text"
                        value={address.receiver_name}
                        onChange={(e) => setAddress({ ...address, receiver_name: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                    {nameError && <p className="text-red text-sm mt-1">{nameError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Receiver Phone</label>
                    <input
                        type="text"
                        value={address.receiver_phone}
                        onChange={(e) => setAddress({ ...address, receiver_phone: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Detail Address</label>
                    <input
                        type="text"
                        value={address.detail_address}
                        onChange={(e) => setAddress({ ...address, detail_address: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">City</label>
                    <Select
                        value={cities.find(city => city.value === address.city_id)}
                        onChange={(selected) => setAddress({ ...address, city_id: selected.value })}
                        options={cities}
                        className="mt-1 block w-full"
                        placeholder="Select City"
                        isSearchable
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Province</label>
                    <input
                        type="text"
                        value={address.province}
                        onChange={(e) => setAddress({ ...address, province: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Postal Code</label>
                    <input
                        type="text"
                        value={address.postal_code}
                        onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">User</label>
                    <Select
                        value={users.find(user => user.value === address.user_id)}
                        onChange={(selected) => setAddress({ ...address, user_id: selected.value })}
                        options={users}
                        className="mt-1 block w-full"
                        placeholder="Select User"
                        isSearchable
                        required
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    <button
                        type="button"
                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10 md:w-32 w-40"
                        onClick={() => saveAddress(address)}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="bg-red hover:bg-redhover text-white rounded-lg h-10 md:w-32 w-40"
                        onClick={deleteAddress}
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="border border-green hover:bg-lightGrey text-green rounded-lg h-10 md:w-32 w-40"
                        onClick={() => router.push('/addresses')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressDetailPage;