"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import Select from 'react-select';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddressDetailPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [address, setAddress] = useState(null);
    const [cities, setCities] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [detailAddressError, setDetailAddressError] = useState('');
    const [cityError, setCityError] = useState('');
    const [provinceError, setProvinceError] = useState('');
    const [postalCodeError, setPostalCodeError] = useState('');
    const [userError, setUserError] = useState('');

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

    const saveAddress = async (updatedAddress) => {
        if (!updatedAddress.receiver_name) {
            setNameError("Receiver name cannot be empty");
            return;
        } else {
            setNameError("");
        }

        if (!updatedAddress.receiver_phone) {
            setPhoneError("Receiver phone cannot be empty");
            return;
        }

        if (!updatedAddress.detail_address) {
            setDetailAddressError("Detail address cannot be empty");
            return;
        }

        if (!updatedAddress.city_id) {
            setCityError("City cannot be empty");
            return;
        }

        if (!updatedAddress.province) {
            setProvinceError("Province cannot be empty");
            return;
        }

        if (!updatedAddress.postal_code) {
            setPostalCodeError("Postal code cannot be empty");
            return;
        }

        if (!updatedAddress.user_id) {
            setUserError("User cannot be empty");
            return;
        }

        updatedAddress.receiver_phone = updatedAddress.receiver_phone.replace(/\s/g, '');
        const phoneRegex = /^[+]?\d+(-\d+)*$/;

        if (!phoneRegex.test(updatedAddress.receiver_phone)) {
            setPhoneError("Receiver Phone must be a valid number");
            return;
        }

        const postalCodeRegex = /^\d{5}$/;
        if (!postalCodeRegex.test(updatedAddress.postal_code)) {
            setPostalCodeError("Postal Code must be a 5-digit number");
            return;
        }
        

        try {
            const token = sessionStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/addresses/${id}`, updatedAddress, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Success Saving Address Data! Redirecting to Addresses List", {
				autoClose: 2000,
                onClose: () => router.push('/addresses')
            });
        } catch (error) {
            toast.error("Error Saving Address Data");
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
            toast.success("Success Deleting Address! Redirecting to Addresses List", {
				autoClose: 2000,
                onClose: () => router.push('/addresses'),
            });
        } catch (error) {
            toast.error("Error Deleting Address");
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
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Address Details</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">ID</label>
                    <input
                        type="text"
                        value={address.id}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">User</label>
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
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Receiver Name</label>
                    <input
                        type="text"
                        value={address.receiver_name}
                        onChange={(e) => setAddress({ ...address, receiver_name: e.target.value })}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                    {nameError && <p className="text-color-red text-sm mt-1">{nameError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Receiver Phone</label>
                    <input
                        type="text"
                        value={address.receiver_phone}
                        onChange={(e) => setAddress({ ...address, receiver_phone: e.target.value })}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                    {phoneError && <p className="text-color-red text-sm mt-1">{phoneError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Detail Address</label>
                    <input
                        type="text"
                        value={address.detail_address}
                        onChange={(e) => setAddress({ ...address, detail_address: e.target.value })}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                    {detailAddressError && <p className="text-color-red text-sm mt-1">{detailAddressError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">City</label>
                    <Select
                        value={cities.find(city => city.value === address.city_id)}
                        onChange={(selected) => setAddress({ ...address, city_id: selected.value })}
                        options={cities}
                        className="mt-1 block w-full"
                        placeholder="Select City"
                        isSearchable
                        required
                    />
                    {cityError && <p className="text-color-red text-sm mt-1">{cityError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Province</label>
                    <input
                        type="text"
                        value={address.province}
                        onChange={(e) => setAddress({ ...address, province: e.target.value })}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                    {provinceError && <p className="text-color-red text-sm mt-1">{provinceError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Postal Code</label>
                    <input
                        type="text"
                        value={address.postal_code}
                        onChange={(e) => setAddress({ ...address, postal_code: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                    {postalCodeError && <p className="text-color-red text-sm mt-1">{postalCodeError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Created At</label>
                    <input
                        type="text"
                        value={formatDate(address.created_at)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Last Updated At</label>
                    <input
                        type="text"
                        value={formatDate(address.update_at)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    <button
                        type="button"
                        className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10 md:w-32 w-40"
                        onClick={() => saveAddress(address)}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="bg-color-red hover:bg-color-redhover text-color-primary rounded-lg h-10 md:w-32 w-40"
                        onClick={deleteAddress}
                    >
                        Delete
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

export default AddressDetailPage;