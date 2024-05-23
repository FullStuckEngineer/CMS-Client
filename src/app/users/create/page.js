"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const UserCreatePage = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreateUser = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = sessionStorage.getItem("token");
            const newUser = { name, email, role: role.toLowerCase(), password, phone_number: phoneNumber };
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users`, newUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/users');
        } catch (error) {
            setError(error.message || "Error creating user");
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Create New User</h1>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateUser(); }}>
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
                    <label className="block text-sm font-medium text-darkGrey">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    >
                        <option value="">Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>
                </div>     
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
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
                        onClick={() => router.push('/users')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserCreatePage;
