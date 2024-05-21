"use client";
import Button from "@/components/ui/Button";
import { ArrowSquareIn, ListPlus } from "@phosphor-icons/react";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/layout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CouriersPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    const [couriers, setCouriers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const perPage = 10;

    useEffect(() => {
        fetchCouriersData();
    }, [currentPage]);

    useEffect(() => {
        fetchCouriersData();
    }, [searchTerm, couriers]);

    const fetchCouriersData = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/couriers`, {
                params: {
                    page: currentPage,
                    perPage: perPage,
                    searchTerm: searchTerm
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const couriersData = response.data.data;
            setCouriers(couriersData.couriers);
            setTotalPages(couriersData.totalPages);
        } catch (error) {
            console.error("Fetch couriers error:", error.message || error);
            toast.error('No Couriers Found');
        }
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setCurrentPage(1);
        fetchCouriersData();
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchCouriersData();
    };

    const handleEditCourier = (id) => {
        router.push(`/couriers/${id}`);
    };

    const handleCreateCourier = () => {
        router.push('/couriers/create');
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbersToShow = 5;
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
                    className={`mx-1 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 ${currentPage === i ? 'font-bold' : ''}`}
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
                <h1 className="text-2xl font-bold">Couriers</h1>
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
                    onClick={handleCreateCourier}
                >
                    <ListPlus className="mr-2"/>
                    Create
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">ID</th>
                            <th className="px-4 py-2 border-b">Name</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {couriers.map((courier) => (
                            <tr key={courier.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{courier.id}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{courier.name}</td>
                                <td className="px-4 py-2 text-center">
                                    <Button
                                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10"
                                        onClick={() => handleEditCourier(courier.id)}
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
                            onClick={() => paginate(1)}
                            className="mx-1 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            First
                        </button>
                    )}
                    {renderPageNumbers()}
                    {currentPage < totalPages && (
                        <button
                            onClick={() => paginate(totalPages)}
                            className="mx-1 px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                        >
                            Last
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CouriersPage;
