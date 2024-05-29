"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Select from 'react-select';
import { set } from 'lodash';

const StoreProfilePage = () => {
    const router = useRouter();
    const [storeId, setStoreId] = useState('');
    const [name, setName] = useState('');
    const [cityId, setCityId] = useState('');
    const [province, setProvince] = useState('');
    const [postalcode, setPostalcode] = useState('');
    const [bankAccountNumber, setBankAccountNumber] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [updatedAt, setUpdatedAt] = useState('');
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCities();
        fetchStoreProfile();
    }, []);

    const fetchCities = async () => {
        try {
            const token = sessionStorage.getItem("token");
            let cities = [];
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/cities`, {
                params: { status: "Active" },
                headers: { Authorization: `Bearer ${token}` }
            });
            cities = response.data.data.cities;
            const pages = response.data.data.totalPages;
            for (let i = 2; i <= pages; i++) {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/cities`, {
                    params: { status: "Active", page: i },
                    headers: { Authorization: `Bearer ${token}` }
                });
                cities = cities.concat(res.data.data.cities);
            }
            setCities(cities.map(city => ({ value: city.id, label: `${city.id} : ${city.name}` })));
        } catch (error) {
            console.error("Fetch cities error:", error.message || error);
        }
    };

    const fetchStoreProfile = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/stores`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const profile = response.data[0];
            setStoreId(profile.id);
            setName(profile.name);
            setCityId(profile.city_id);
            setProvince(profile.province);
            setPostalcode(profile.postal_code);
            setBankAccountNumber(profile.bank_account_number);
            setCreatedAt(formatDate(profile.created_at));
            setUpdatedAt(formatDate(profile.update_at));
        } catch (error) {
            console.error("Fetch store profile error:", error.message || error);
            setError(error.message || "Error fetching store profile");
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            if (!name || !cityId || !province || !postalcode || !bankAccountNumber) {
                setError("All fields are required.");
                setLoading(false);
                return;
            }
            const token = sessionStorage.getItem("token");
            const updatedProfile = {
                name,
                city_id: parseInt(cityId),
                province,
                postalcode,
                bank_account_number: bankAccountNumber
            };
            console.log("UpdatedProfile", updatedProfile);

            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/stores/${storeId}`, updatedProfile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoading(false);
        } catch (error) {
            setError(error.message || "Error updating store profile");
            setLoading(false);
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
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Store Profile</h1>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
                {error && <div className="text-red mb-4">{error}</div>}
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">City</label>
                    <Select
                        value={cities.find(city => city.value === cityId)}
                        onChange={(selected) => setCityId(selected.value)}
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
                        value={postalcode}
                        onChange={(e) => setPostalcode(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Bank Account Number</label>
                    <input
                        type="text"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Created At</label>
                    <input
                        type="text"
                        value={createdAt}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Updated At</label>
                    <input
                        type="text"
                        value={updatedAt}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                        readOnly
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    <button
                        type="submit"
                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10 md:w-32 w-40"
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StoreProfilePage;