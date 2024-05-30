"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Select from 'react-select';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    const [errorPhone, setErrorPhone] = useState(null);
    const [errorPostalCode, setErrorPostalCode] = useState(null);

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

            const pages = response.data.data.totalPages;
            for (let i = 2; i <= pages; i++) {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/cities?page=${i}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                response.data.data.cities = response.data.data.cities.concat(res.data.data.cities);
            }

            setCities(response.data.data.cities.map(city => ({ value: city.id, label: `${city.id} : ${city.name}` })));
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

            const pages = response.data.data.totalPages;
            for (let i = 2; i <= pages; i++) {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users?page=${i}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                response.data.data.users = response.data.data.users.concat(res.data.data.users);
            }
            setUsers(response.data.data.users.map(user => ({ value: user.id, label: `${user.id} : ${user.name}`})));
        } catch (error) {
            console.error("Fetch users error:", error.message || error);
        }
    };

    const handleCreateAddress = async () => {
        setLoading(true);
        setError(null);

        setReceiverPhone(receiverPhone.replace(/\s/g, ''));
        const phoneRegex = /^[+]?\d+(-\d+)*$/;

        if (!phoneRegex.test(receiverPhone)) {
            setErrorPhone("Receiver Phone must be a valid number");
            setLoading(false);
            return;
        }

        const postalCodeRegex = /^\d{5}$/;
        if (!postalCodeRegex.test(postalCode)) {
            setErrorPostalCode("Postal Code must be a 5-digit number");
            setLoading(false);
            return;
        }
        

        try {
            const token = sessionStorage.getItem("token");
            const newAddress = {
                receiver_name: receiverName,
                receiver_phone: receiverPhone,
                detail_address: detailAddress,
                city_id: parseInt(cityId.value),
                province,
                postal_code: parseInt(postalCode),
                user_id: parseInt(userId.value)
            };
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/addresses`, newAddress, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Success Creating Address! Redirecting to Addresses List", {
                autoClose: 2000,
                onClose: () => router.push("/addresses"),
            });
        } catch (error) {
            toast.error("Error Creating Address");
            setError(error.message || "Error creating address");
            setLoading(false);
        }
    };

    return (
        <div className="relative p-4 pt-24 justify-center w-full h-screen">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Create New Address</h1>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateAddress(); }}>
                {error && <div className="text-color-red mb-4">{error}</div>}
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Receiver Name</label>
                    <input
                        type="text"
                        value={receiverName}
                        onChange={(e) => setReceiverName(e.target.value)}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Receiver Phone</label>
                    <input
                        type="text"
                        value={receiverPhone}
                        onChange={(e) => setReceiverPhone(e.target.value)}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                    {errorPhone && <div className="text-color-red">{errorPhone}</div>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Detail Address</label>
                    <input
                        type="text"
                        value={detailAddress}
                        onChange={(e) => setDetailAddress(e.target.value)}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">City</label>
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
                    <label className="block text-sm font-medium text-color-gray-700">Province</label>
                    <input
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Postal Code</label>
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                    {errorPostalCode && <div className="text-color-red">{errorPostalCode}</div>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">User</label>
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
                        className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10 md:w-32 w-40"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                    <button
                        type="button"
                        className="border border-green hover:bg-color-gray-400 hover:text-color-primary text-color-green rounded-lg h-10 md:w-32 w-40"
                        onClick={() => router.push('/addresses')}
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressCreatePage;