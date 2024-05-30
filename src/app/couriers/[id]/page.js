"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const CourierDetailPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [courier, setCourier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        if (id) {
            fetchCourierData(id);
        }
    }, [id]);

    const fetchCourierData = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/couriers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCourier(response.data.data);
            setLoading(false);
        } catch (error) {
            setError(error.message || "Error fetching courier data");
            setLoading(false);
        }
    };

    const saveCourier = async (updatedCourier) => {
        if (!updatedCourier.name) {
            setNameError("Name cannot be empty");
            return;
        } else {
            setNameError("");
        }

        try {
            const token = sessionStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/couriers/${id}`, updatedCourier, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/couriers');
        } catch (error) {
            setError(error.message || "Error saving courier data");
        }
    };

    const deleteCourier = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/couriers/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/couriers');
        } catch (error) {
            setError(error.message || "Error deleting courier");
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
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Courier Details</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">ID</label>
                    <input
                        type="text"
                        value={courier.id}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Name</label>
                    <input
                        type="text"
                        value={courier.name}
                        onChange={(e) => setCourier({ ...courier, name: e.target.value })}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        required
                    />
                    {nameError && <p className="text-red text-sm mt-1">{nameError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Created At</label>
                    <input
                        type="text"
                        value={formatDate(courier.created_at)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Last Updated At</label>
                    <input
                        type="text"
                        value={formatDate(courier.update_at)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    <button
                        type="button"
                        className="bg-green hover:bg-greenhover text-color-primary rounded-lg h-10 md:w-32 w-40"
                        onClick={() => saveCourier(courier)}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="bg-red hover:bg-redhover text-color-primary rounded-lg h-10 md:w-32 w-40"
                        onClick={deleteCourier}
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="border border-green hover:bg-color-gray-400 hover:text-color-primary text-green rounded-lg h-10 md:w-32 w-40"
                        onClick={() => router.push('/couriers')}
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourierDetailPage;