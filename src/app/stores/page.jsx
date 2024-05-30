"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Select from "react-select";
import { XCircle } from "@phosphor-icons/react";
import Button from "@/components/ui/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StoreProfilePage = () => {
    const router = useRouter();
    const [storeId, setStoreId] = useState("");
    const [name, setName] = useState("");
    const [cityId, setCityId] = useState("");
    const [province, setProvince] = useState("");
    const [postalcode, setPostalcode] = useState("");
    const [bankAccountNumber, setBankAccountNumber] = useState("");
    const [createdAt, setCreatedAt] = useState("");
    const [updatedAt, setUpdatedAt] = useState("");
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [postalCodeError, setPostalCodeError] = useState(null);
    const [bankAccountError, setBankAccountError] = useState(null);

    useEffect(() => {
        fetchCities();
        fetchStoreProfile();
    }, []);

    const fetchCities = async () => {
        try {
            const token = sessionStorage.getItem("token");
            let cities = [];
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/cities`,
                {
                    params: { status: "Active" },
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            cities = response.data.data.cities;
            const pages = response.data.data.totalPages;
            for (let i = 2; i <= pages; i++) {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/cities`,
                    {
                        params: { status: "Active", page: i },
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                cities = cities.concat(res.data.data.cities);
            }
            setCities(
                cities.map((city) => ({
                    value: city.id,
                    label: `${city.id} : ${city.name}`,
                }))
            );
        } catch (error) {
            console.error("Fetch cities error:", error.message || error);
        }
    };

    const fetchStoreProfile = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/stores`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

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

            const postalCodeRegex = /^\d{5}$/;
            if (!postalCodeRegex.test(postalcode)) {
                setPostalCodeError("Postal Code must be a 5-digit number");
                setLoading(false);
                return;
            } else {
                setPostalCodeError(null);
            }

            const bankAccountRegex = /^[0-9\s-]+$/;
            if (!bankAccountRegex.test(bankAccountNumber)) {
                setBankAccountError("Invalid Bank Account Number");
                setLoading(false);
                return;
            } else {
                setBankAccountError(null);
            }

            const token = sessionStorage.getItem("token");
            const updatedProfile = {
                name,
                city_id: parseInt(cityId),
                province,
                postalcode: postalcode,
                bank_account_number: bankAccountNumber,
            };
            console.log("UpdatedProfile", updatedProfile);

            await axios.put(
                `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/stores/${storeId}`,
                updatedProfile,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setLoading(false);
            toast.success("Success Updating Store Profile");
        } catch (error) {
            setError(error.message || "Error updating store profile");
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <div className="relative p-4 pt-24 justify-center w-full h-screen">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4 justify-center flex text-color-gray-700">
                Store Profile
            </h1>
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveProfile();
                }}
            >
                {error && (
                    <p className="flex gap-2 items-center border rounded-md border-color-red p-3 mb-5 text-color-red text-xs bg-color-red bg-opacity-10">
                        <XCircle size={20} /> {error}
                    </p>
                )}
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">
                        Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full ring-1 ring-color-gray-200 focus:ring-color-blue-500 focus:outline-none rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">
                        City
                    </label>
                    <Select
                        value={cities.find((city) => city.value === cityId)}
                        onChange={(selected) => setCityId(selected.value)}
                        options={cities}
                        className="mt-1 block w-full"
                        placeholder="Select City"
                        isSearchable
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">
                        Province
                    </label>
                    <input
                        type="text"
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="mt-1 block w-full ring-1 ring-color-gray-200 focus:ring-color-blue-500 focus:outline-none rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">
                        Postal Code
                    </label>
                    <input
                        type="text"
                        value={postalcode}
                        onChange={(e) => setPostalcode(e.target.value)}
                        className="mt-1 block w-full ring-1 ring-color-gray-200 focus:ring-color-blue-500 focus:outline-none rounded-md shadow-sm p-2"
                        required
                    />
                    {postalCodeError && (
                        <p className="text-color-red text-xs">{postalCodeError}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">
                        Bank Account Number
                    </label>
                    <input
                        type="text"
                        value={bankAccountNumber}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                        className="mt-1 block w-full ring-1 ring-color-gray-200 focus:ring-color-blue-500 focus:outline-none rounded-md shadow-sm p-2"
                        required
                    />
                    {bankAccountError && (
                        <p className="text-color-red text-xs">{bankAccountError}</p>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">
                        Created At
                    </label>
                    <input
                        type="text"
                        value={createdAt}
                        className="mt-1 block w-full border border-color-gray-200 text-color-primary rounded-md shadow-sm p-2 bg-color-darkgreen"
                        readOnly
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">
                        Updated At
                    </label>
                    <input
                        type="text"
                        value={updatedAt}
                        className="mt-1 block w-full border border-color-gray-200 text-color-primary rounded-md shadow-sm p-2 bg-color-darkgreen"
                        readOnly
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    <Button
                        type="submit"
                        className="bg-color-green hover:bg-colorgreenhover text-color-primary rounded-lg h-10 md:w-32 w-40"
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StoreProfilePage;