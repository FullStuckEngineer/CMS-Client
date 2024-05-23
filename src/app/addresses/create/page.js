"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Select from 'react-select';

const AddressCreatePage = () => {
    const router = useRouter();
    const [receiverName, setReceiverName] = useState('');
    const [receiverPhone, setReceiverPhone] = useState('');
    const [detailAddress, setDetailAddress] = useState('');
    const [cityId, setCityId] = useState('');
    const [province, setProvince] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [userId, setUserId] = useState('');
    const [cities, setCities] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCities();
        fetchUsers();
    }, []);

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

    const handleCreateAddress = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = sessionStorage.getItem("token");
            const newAddress = {
                receiver_name: receiverName,
                receiver_phone: receiverPhone,
                detail_address: detailAddress,
                city_id: cityId.value,
                province,
                postal_code: postalCode,
                user_id: userId.value
            };
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/addresses`, newAddress, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/addresses');
        } catch (error) {
            setError(error.message || "Error creating address");
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Create New Address</h1>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateAddress(); }}>
                {error && <div className="text-red mb-4">{error}</div>}
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Receiver Name</label>
                    <input
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Receiver Phone</label>
                    <input
                        type="text"
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Detail Address</label>
                    <input
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">City</label>
                    <Select
                        value={cityId}
                        onChange={setCityId}
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
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Postal Code</label>
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">User</label>
                    <Select
                        value={userId}
                        onChange={setUserId}
                        options={users}
                        className="mt-1 block w-full"
                        placeholder="Select User"
                        isSearchable
                        required
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    <button
                        type="submit"
                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10 md:w-32 w-40"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create'}
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

export default AddressCreatePage;