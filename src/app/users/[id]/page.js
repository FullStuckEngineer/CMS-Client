"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from "@/app/layout";
import axios from 'axios';
import Image from "next/image";
import profilPlaceholder from "@/assets/images/profile-placeholder.jpg";

const UserDetailPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    const { id } = useParams();
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        role: 'user',
        phone_number: '',
        created_at: '',
        update_at: '',
        photo: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

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

            const userData = response.data.data;

            if (userData.photo){
                await fetchImage(`${userData.photo}`);
            }

            setUser(userData);
            setLoading(false);
        } catch (error) {
            setError(error.message || "Error fetching user data");
            setLoading(false);
        }
    };

    const fetchImage = async (path) => {
        try {
            setImage(`${process.env.NEXT_PUBLIC_BACKEND_PATH}/${path}`);
            return;
        } catch (error) {
            console.error("Error fetching image:", error.message || error);
            return null;
        }
    };

    const saveUser = async (updatedUser) => {
        let valid = true;

        if (!updatedUser.name) {
            setNameError("Name cannot be empty");
            valid = false;
        } else {
            setNameError("");
        }

        if (!updatedUser.email) {
            setEmailError("Email cannot be empty");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!valid) {
            return;
        }

        try {
            const token = sessionStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users/${updatedUser.id}`, updatedUser, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('id', updatedUser.id);
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users/uploads`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            router.push('/users');
        } catch (error) {
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

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
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
            <h1 className="text-2xl font-bold mb-4 justify-center flex">User Details</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-darkGrey">ID</label>
                    <input
                        type="text"
                        value={user.id || ''}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Name</label>
                    <input
                        type="text"
                        value={user.name || ''}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    />
                    {nameError && <p className="text-red text-sm mt-1">{nameError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Email</label>
                    <input
                        type="text"
                        value={user.email || ''}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    />
                    {emailError && <p className="text-red text-sm mt-1">{emailError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Role</label>
                    <select
                        value={user.role || 'user'}
                        onChange={(e) => setUser({ ...user, role: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Phone Number</label>
                    <input
                        type="text"
                        value={user.phone_number || ''}
                        onChange={(e) => setUser({ ...user, phone_number: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Image</label>
                    {image ? (
                        <Image
                            src={image}
                            alt={user.name}
                            className="w-32 h-32 object-cover"
                            width={128}
                            height={128}
                        />
                    ) : (
                        <Image
                            src={profilPlaceholder}
                            alt="Placeholder"
                            className="w-32 h-32 object-cover"
                            width={128}
                            height={128}
                        />
                    )}
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Created At</label>
                    <input
                        type="text"
                        value={formatDate(user.created_at) || ''}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Last Updated At</label>
                    <input
                        type="text"
                        value={formatDate(user.update_at) || ''}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
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
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserDetailPage;
