"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const couriersData = [
    { id: 1, name: "Courier One" },
    { id: 2, name: "Courier Two" },
    { id: 3, name: "Courier Three" },
    { id: 4, name: "Courier Four" },
    { id: 5, name: "Courier Five" },
    { id: 6, name: "Courier Six" },
    { id: 7, name: "Courier Seven" },
    { id: 8, name: "Courier Eight" },
    { id: 9, name: "Courier Nine" },
    { id: 10, name: "Courier Ten" },
    { id: 11, name: "Courier Eleven" },
    { id: 12, name: "Courier Twelve" },
    { id: 13, name: "Courier Thirteen" },
    { id: 14, name: "Courier Fourteen" },
    { id: 15, name: "Courier Fifteen" }
];

const CouriersPage = () => {
    const [couriers, setCouriers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const couriersPerPage = 10;

    useEffect(() => {
        fetchCouriersData();
    }, [currentPage]);

    useEffect(() => {
        filterCouriersData();
    }, [searchTerm]);

    const fetchCouriersData = () => {
        // TODO: Fetch data from API
        setCouriers(couriersData);
        setTotalPages(Math.ceil(couriersData.length / couriersPerPage));
    };

    const filterCouriersData = () => {
        let filteredData = [...couriersData];

        if (searchTerm) {
            filteredData = filteredData.filter(courier =>
                courier.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setTotalPages(Math.ceil(filteredData.length / couriersPerPage));

        setCouriers(filteredData);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    const startIndex = (currentPage - 1) * couriersPerPage;
    const endIndex = startIndex + couriersPerPage;
    const currentCouriers = couriers.slice(startIndex, endIndex);

    return (
        <div className="p-4 justify-center w-full">
            <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-bold">Couriers</h1>
                <button onClick={handleResetAll} className="text-blue-500 hover:underline">
                    Reset All
                </button>
            </div>
            <div className="flex mb-8">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="border p-2 rounded flex-1 mr-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">ID</th>
                            <th className="px-4 py-2 border-b">Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCouriers.map((courier) => (
                            <tr key={courier.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{courier.id}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{courier.name}</td>
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

export default CouriersPage;
