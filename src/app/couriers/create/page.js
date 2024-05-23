"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const CourierCreatePage = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateCourier = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = sessionStorage.getItem("token");
            const newCourier = { name };
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/couriers`, newCourier, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/couriers');
        } catch (error) {
            setError(error.message || "Error creating courier");
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Create New Courier</h1>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateCourier(); }}>
                {error && <div className="text-red mb-4">{error}</div>}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
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
                        onClick={() => router.push('/couriers')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CourierCreatePage;