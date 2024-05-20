"use client";
import Button from "@/components/ui/Button";
import { ArrowSquareIn } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const categoriesData = [
    { id: 1, name: "Category One", status: "Active" },
    { id: 2, name: "Category Two", status: "Inactive" },
    { id: 3, name: "Category Three", status: "Active" },
    { id: 4, name: "Category Four", status: "Inactive" },
    { id: 5, name: "Category Five", status: "Active" }
];

const CategoriesPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    
    useEffect(() => {
        fetchCategoriesData();
    }, [currentPage]);

    useEffect(() => {
        filterCategoriesData();
    }, [searchTerm, filterStatus, sortBy, categories]);

    const fetchCategoriesData = () => {
        setCategories(categoriesData);
        setTotalPages(1);
    };

    const filterCategoriesData = () => {
        let filteredData = [...categories];

        if (filterStatus) {
            filteredData = filteredData.filter(category => category.status === filterStatus);
        }

        if (searchTerm) {
            filteredData = filteredData.filter(category =>
                Object.values(category).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (sortBy) {
            filteredData.sort((a, b) => {
                if (a[sortBy] < b[sortBy]) return -1;
                if (a[sortBy] > b[sortBy]) return 1;
                return 0;
            });
        }

        setFilteredCategories(filteredData);
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setFilterStatus("");
        setSortBy("");
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-4 justify-center w-full">
            <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-bold">Categories</h1>
                <button onClick={handleResetAll} className="text-blue-500 hover:underline">
                    Reset All
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
                <input
                    type="text"
                    placeholder="Search here..."
                    className="border p-2 rounded flex-1 mr-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
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
                        {filteredCategories.map((category) => (
                            <tr key={category.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{category.id}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{category.name}</td>
                                <td className="px-4 py-2 w-60 overflow-hidden whitespace-nowrap truncate text-center">{category.status}</td>
                                <td className="px-4 py-2  text-center">
                                    <Button className="bg-green hover:bg-greenhover text-primary rounded-lg h-10">
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