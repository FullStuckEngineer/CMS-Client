"use client";
import Button from "@/components/ui/Button";
import {
    ArrowSquareIn,
    ListPlus,
    ArrowLineLeft,
    ArrowLineRight,
} from "@phosphor-icons/react";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";

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
    }, [currentPage, searchTerm, filterStatus, sortBy]);

    const fetchCategoriesData = async () => {
        try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories`,
            {
            params: {
                page: currentPage,
                perPage: perPage,
                searchTerm: searchTerm,
                status: filterStatus ? filterStatus.value : "",
                sortBy: sortBy ? sortBy.value : "",
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );
        const categoriesData = response.data.data;
        setCategories(categoriesData.categories);
        setTotalPages(categoriesData.totalPages);
        } catch (error) {
        console.error("Fetch categories error:", error.message || error);
        toast.error("No Categories Found");
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
        router.push("/categories/create");
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbersToShow = 3;
        let startPage = Math.max(
        currentPage - Math.floor(maxPageNumbersToShow / 2),
        1
        );
        let endPage = startPage + maxPageNumbersToShow - 1;

        if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(endPage - maxPageNumbersToShow + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
            <button
            key={i}
            onClick={() => paginate(i)}
            className={`mx-1 px-3 py-1 text-color-gray-600 hover:text-color-primary rounded hover:bg-color-green ${
                currentPage === i ? "font-bold" : ""
            }`}
            >
            {i}
            </button>
        );
        }

        return pageNumbers;
    };

    const statusOptions = [
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
    ];

    const sortByOptions = [
        { value: "name", label: "Name" },
        { value: "status", label: "Status" },
        { value: "id", label: "ID" },
    ];

    const getStatusLabel = (status) => {
        const baseClass = "inline-block px-3 py-1 rounded-full text-color-primary text-sm font-semibold";
        const statusClass = status === "Active" ? "bg-color-green" : "bg-color-red";
        return (
            <span className={`${baseClass} ${statusClass}`}>
            {status}
            </span>
        );
    };

    return (
        <div className="relative p-4 pt-24 justify-center w-full h-screen">
        <ToastContainer />
        <div className="flex justify-between items-center mb-8 mt-4">
            <h1 className="text-2xl font-bold text-color-gray-700">Categories</h1>
            <button
            onClick={handleResetAll}
            className="text-color-blue-500 hover:underline"
            >
                Reset All
            </button>
        </div>
        <div className="flex mb-2">
            <input
            type="text"
            placeholder="Search here..."
            className="ring-2 ring-color-gray-200 focus:ring-color-blue-500 focus:outline-none p-2 rounded flex-1 mr-2"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button
            type="button"
            className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10 md:w-28 w-36 flex items-center justify-center"
            onClick={handleCreateCategory}
            >
                <ListPlus className="mr-2" />
                Create
            </Button>
        </div>
        <div className="flex mb-8 space-x-2">
            <Select
            value={filterStatus}
            onChange={setFilterStatus}
            options={statusOptions}
            className="flex-1"
            placeholder="Select By Status"
            isSearchable
            />
            <Select
            value={sortBy}
            onChange={setSortBy}
            options={sortByOptions}
            className="flex-1"
            placeholder="Sort By"
            isSearchable
            />
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
                <tr key={category.id} className="hover:bg-color-gray-200">
                    <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">
                    {category.id}
                    </td>
                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                    {category.name}
                    </td>
                    <td className="px-4 py-2 w-60 overflow-hidden whitespace-nowrap truncate text-center">
                    {getStatusLabel(category.status)}
                    </td>
                    <td className="px-4 py-2 text-center">
                    <Button
                        className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10"
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
            {currentPage > 1 && (
                <button
                onClick={() => paginate(currentPage - 1)}
                className="mx-1 px-3 py-1 text-color-gray-600 hover:text-color-primary rounded hover:bg-color-green"
                >
                <ArrowLineLeft />
                </button>
            )}
            {renderPageNumbers()}
            {currentPage < totalPages && (
                <button
                onClick={() => paginate(currentPage + 1)}
                className="mx-1 px-3 py-1 text-color-gray-600 hover:text-color-primary rounded hover:bg-color-green"
                >
                <ArrowLineRight />
                </button>
            )}
            </div>
        </div>
        </div>
    );
};

export default CategoriesPage;