"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const CategoryDetailPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState('');

    useEffect(() => {
        if (id) {
            fetchCategoryData(id);
        }
    }, [id]);

    const fetchCategoryData = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCategory(response.data.data);
            setLoading(false);
        } catch (error) {
            setError(error.message || "Error fetching category data");
            setLoading(false);
        }
    };

    const saveCategory = async (updatedCategory) => {
        if (!updatedCategory.name) {
            setNameError("Name cannot be empty");
            return;
        } else {
            setNameError("");
        }

        try {
            const token = sessionStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories/${id}`, updatedCategory, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/categories');
        } catch (error) {
            setError(error.message || "Error saving category data");
        }
    };

    const deleteCategory = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/categories');
        } catch (error) {
            setError(error.message || "Error deleting category");
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
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Category Details</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-darkGrey">ID</label>
                    <input
                        type="text"
                        value={category.id}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Name</label>
                    <input
                        type="text"
                        value={category.name}
                        onChange={(e) => setCategory({ ...category, name: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                    {nameError && <p className="text-red text-sm mt-1">{nameError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Status</label>
                    <input
                        type="text"
                        value={category.status}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Created At</label>
                    <input
                        type="text"
                        value={formatDate(category.created_at)}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Last Updated At</label>
                    <input
                        type="text"
                        value={formatDate(category.update_at)}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    <button
                        type="button"
                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10 md:w-32 w-40"
                        onClick={() => saveCategory(category)}
                    >
                        Save
                    </button>
                    {category.status === "Active" &&
                        <button
                            type="button"
                            className="bg-red hover:bg-redhover text-white rounded-lg h-10 md:w-32 w-40"
                            onClick={deleteCategory}
                        >
                            Delete
                        </button>
                    }
                    <button
                        type="button"
                        className="border border-green hover:bg-lightGrey text-green rounded-lg h-10 md:w-32 w-40"
                        onClick={() => router.push('/categories')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CategoryDetailPage;