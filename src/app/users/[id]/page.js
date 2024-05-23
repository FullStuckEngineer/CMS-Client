"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

const UserDetailPage = () => {
    const router = useRouter();
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (id) {
            fetchUserData(id);
        }
    }, [id]);
    
    const fetchUserData = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("Fetched User Data:", response.data.data);
            setUser(response.data.data);
            setLoading(false);
        } catch (error) {
            setError(error.message || "Error fetching user data");
            setLoading(false);
        }
    };
    
    const saveUser = async (updatedUser) => {
        try {
            const token = sessionStorage.getItem("token");
            const url = `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users/${id}`;
            
            const userData = {
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role.toLowerCase(),
                phone_number: updatedUser.phone_number,
            };
            
            console.log("Request Data:", userData);
    
            const response = await axios.put(url, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            console.log("Save response:", response);
            router.push('/users');
        } catch (error) {
            console.error("Error saving user data:", error);
            setError(error.message || "Error saving user data");
        }
    };    

    const deleteUser = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/users');
        } catch (error) {
            setError(error.message || "Error deleting user");
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

    console.log("User Details", user);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 justify-center flex">User Details</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">ID</label>
                    <input
                        type="text"
                        value={user.id}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="text"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Role</label>
                    <select
                        value={user.role}
                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    >
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>                
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                        type="text"
                        value={user.phone_number}
                        onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Created At</label>
                    <input
                        type="text"
                        value={formatDate(user.created_at)}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated At</label>
                    <input
                        type="text"
                        value={formatDate(user.update_at)}
                        readOnly
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    <button
                        type="button"
                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10 md:w-32 w-40"
                        onClick={() => saveUser(user)}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        className="bg-red hover:bg-redhover text-white rounded-lg h-10 md:w-32 w-40"
                        onClick={deleteUser}
                    >
                        Delete
                    </button>
                    <button
                        type="button"
                        className="border border-green hover:bg-lightGrey text-green rounded-lg h-10 md:w-32 w-40"
                        onClick={() => router.push('/users')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserDetailPage;