"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/layout";
import { ArrowLineLeft, ArrowLineRight } from "@phosphor-icons/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CitiesPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    const [cities, setCities] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const citiesPerPage = 10;

    useEffect(() => {
        fetchCitiesData();
    }, [currentPage, searchTerm]);

    const fetchCitiesData = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/cities`, {
                params: {
                    page: currentPage,
                    perPage: citiesPerPage,
                    searchTerm: searchTerm
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const citiesData = response.data.data;
            setCities(citiesData.cities);
            setTotalPages(citiesData.totalPages);
        } catch (error) {
            console.error("Fetch cities error:", error.message || error);
            toast.error('No Cities Found');
        }
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setCurrentPage(1);
        fetchCitiesData();
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbersToShow = 3;
        let startPage = Math.max(currentPage - Math.floor(maxPageNumbersToShow / 2), 1);
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
                    className={`mx-1 px-3 py-1 text-darkGrey rounded hover:bg-lightGreen ${currentPage === i ? 'font-bold' : ''}`}
                >
                    {i}
                </button>
            );
        }

        return pageNumbers;
    };

    return (
        <div className="p-4 justify-center w-full">
            <ToastContainer />
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
                        {cities.map((city) => (
                            <tr key={city.id} className="hover:bg-grey-100">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{city.id}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{city.name}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="flex justify-center mt-4">
                    {currentPage > 1 && (
                        <button
                            onClick={() => paginate(1)}
                            className="mx-1 px-3 py-1 text-darkGrey rounded hover:bg-lightGreen"
                        >
                            <ArrowLineLeft/>
                        </button>
                    )}
                    {renderPageNumbers()}
                    {currentPage < totalPages && (
                        <button
                            onClick={() => paginate(totalPages)}
                            className="mx-1 px-3 py-1 text-darkGrey rounded hover:bg-lightGreen"
                        >
                            <ArrowLineRight/>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CitiesPage;