"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const citiesData = [
    { id: 1, name: "City One" },
    { id: 2, name: "City Two" },
    { id: 3, name: "City Three" },
    { id: 4, name: "City Four" },
    { id: 5, name: "City Five" },
    { id: 6, name: "City Six" },
    { id: 7, name: "City Seven" },
    { id: 8, name: "City Eight" },
    { id: 9, name: "City Nine" },
    { id: 10, name: "City Ten" },
    { id: 11, name: "City Eleven" },
    { id: 12, name: "City Twelve" },
    { id: 13, name: "City Thirteen" },
    { id: 14, name: "City Fourteen" },
    { id: 15, name: "City Fifteen" }
]

const CitiesPage = () => {
    const [cities, setCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const citiesPerPage = 10;

    useEffect(() => {
        fetchCitiesData();
    }, [currentPage]);

    useEffect(() => {
        filterCitiesData();
    }, [searchTerm]);

    const fetchCitiesData = () => {
        // TODO: Fetch data from API
        setCities(citiesData);
        setTotalPages(Math.ceil(citiesData.length / citiesPerPage));
    };

    const filterCitiesData = () => {
        let filteredData = [...citiesData];

        if (searchTerm) {
            filteredData = filteredData.filter(city =>
                city.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setTotalPages(Math.ceil(filteredData.length / citiesPerPage));

        setCities(filteredData);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setCurrentPage(1);
    };

    const startIndex = (currentPage - 1) * citiesPerPage;
    const endIndex = startIndex + citiesPerPage;
    const currentCities = cities.slice(startIndex, endIndex);

    return (
        <div className="p-4 justify-center w-full">
            <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-bold">Cities</h1>
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
                        {currentCities.map((city) => (
                            <tr key={city.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{city.id}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{city.name}</td>
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

export default CitiesPage;