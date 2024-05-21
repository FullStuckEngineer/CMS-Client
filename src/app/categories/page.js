"use client";
import Button from "@/components/ui/Button";
import { ArrowSquareIn, ListPlus } from "@phosphor-icons/react";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/layout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CategoriesPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const perPage = 10;

    useEffect(() => {
        fetchCategoriesData();
    }, [currentPage]);

    useEffect(() => {
        fetchCategoriesData();
    }, [searchTerm, filterStatus, sortBy, categories]);

    const fetchCategoriesData = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories`, {
                params: {
                    page: currentPage,
                    perPage: perPage,
                    searchTerm: searchTerm,
                    status: filterStatus,
                    sortBy: sortBy
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const categoriesData = response.data.data;
            setCategories(categoriesData.categories);
            setTotalPages(categoriesData.totalPages);
        } catch (error) {
            console.error("Fetch categories error:", error.message || error);
            toast.error(error.response?.data?.message || 'No Categories Found');
        }
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setFilterStatus("");
        setSortBy("");
        setCurrentPage(1);
        fetchCategoriesData();
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchCategoriesData();
    };

    const handleEditCategory = (id) => {
        router.push(`/categories/${id}`);
    };

    const handleCreateCategory = () => {
        router.push('/categories/create');
    };

    return (
        <div className="p-4 justify-center w-full">
            <ToastContainer />
            <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button onClick={handleResetAll} className="text-blue-500 hover:underline">
                    Reset All
                </button>
            </div>
            <div className="flex mb-2">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="border p-2 rounded flex-1 mr-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    type="button"
                    className="bg-green hover:bg-greenhover text-primary rounded-lg h-10 md:w-28 w-36 flex items-center justify-center"
                    onClick={handleCreateCategory}
                >
                    <ListPlus className="mr-2"/>
                    Create
                </button>
            </div>
            <div className="flex mb-8">
                <select
                    className="border p-2 rounded mr-2"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">Select By Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
                <select
                    className="border p-2 rounded"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="">Sort by</option>
                    <option value="name">Name</option>
                    <option value="status">Status</option>
                    <option value="id">ID</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">ID</th>
                            <th className="px-4 py-2 border-b">Name</th>
                            <th className="px-4 py-2 border-b">Status</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{category.id}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{category.name}</td>
                                <td className="px-4 py-2 w-60 overflow-hidden whitespace-nowrap truncate text-center">{category.status}</td>
                                <td className="px-4 py-2 text-center">
                                    <Button
                                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10"
                                        onClick={() => handleEditCategory(category.id)}
                                    >
                                        <ArrowSquareIn className="w-10 h-5" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center mt-4">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`mx-1 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 ${currentPage === number ? 'font-bold' : ''}`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesPage;