"use client";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "@/components/ui/Button";
import {
    ArrowSquareIn,
    ArrowLineLeft,
    ArrowLineRight,
} from "@phosphor-icons/react";
import Select from "react-select";
import { debounce, first } from "lodash";

const CheckoutPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    const [checkouts, setCheckouts] = useState([]);
    const [searchTerms, setSearchTerms] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [users, setUsers] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [sortBy, setSortBy] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);
    const [paymentMethodOptions, setPaymentMethodOptions] = useState([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const perPage = 10;

    useEffect(() => {
        fetchCheckoutsData();
    }, [
        currentPage,
        searchTerms,
        selectedUser,
        selectedCourier,
        selectedStatus,
        selectedPaymentMethod,
        sortBy,
    ]);

    useEffect(() => {
        if (initialLoad) {
            fetchUsers();
            fetchCouriers();
            setInitialLoad(false);
        }
    }, []);

    const fetchCheckoutsData = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/checkouts`,
                {
                    params: {
                        page: currentPage,
                        perPage: perPage,
                        searchTerms: searchTerms,
                        userId: selectedUser ? selectedUser.value : "",
                        courierId: selectedCourier ? selectedCourier.value : "",
                        paymentMethod: selectedPaymentMethod
                            ? selectedPaymentMethod.value
                            : "",
                        status: selectedStatus ? selectedStatus.value : "",
                        sortBy: sortBy ? sortBy.value : "",
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const checkoutsData = response.data.data;
            setCheckouts(checkoutsData.checkouts);
            setTotalPages(checkoutsData.totalPages);

            if (isFirstLoad) {
                const paymentMethods = [
                    ...new Set(
                        checkoutsData.checkouts.map((checkout) => checkout.payment_method)
                    ),
                ];
                setPaymentMethodOptions(
                    paymentMethods.map((method) => ({ value: method, label: method }))
                );
                setIsFirstLoad(false);
            }
        } catch (error) {
            console.error("Fetch checkouts error:", error.message || error);
            toast.error("No Checkouts Found");
        }
    };

    const fetchUsers = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        role: "user",
                    },
                }
            );

            const allUsers = [];
            const totalPages = response.data.data.totalPages;
            for (let i = 1; i <= totalPages; i++) {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users?page=${i}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        params: {
                            role: "user",
                        },
                    }
                );
                allUsers.push(...res.data.data.users);
            }
            setUsers(
                allUsers.map((user) => ({
                    value: user.id,
                    label: `${user.id} : ${user.name}`,
                }))
            );
        } catch (error) {
            console.error("Fetch users error:", error.message || error);
            toast.error("No Users Found");
        }
    };

    const fetchCouriers = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/couriers`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const allCouriers = [];
            const totalPages = response.data.data.totalPages;
            for (let i = 1; i <= totalPages; i++) {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/couriers?page=${i}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                allCouriers.push(...res.data.data.couriers);
            }
            setCouriers(
                allCouriers.map((courier) => ({
                    value: courier.id,
                    label: `${courier.id} : ${courier.name}`,
                }))
            );
        } catch (error) {
            console.error("Fetch couriers error:", error.message || error);
            toast.error("No Couriers Found");
        }
    };

    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchTerms(value);
        }, 300),
        []
    );

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleResetAll = () => {
        setSearchTerms("");
        setSelectedUser(null);
        setSelectedCourier(null);
        setSelectedStatus(null);
        setSelectedPaymentMethod(null);
        setSortBy("");
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditCheckout = (id) => {
        router.push(`/checkouts/${id}`);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbersToShow = 5;
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
        { value: "waiting_payment", label: "Waiting Payment" },
        { value: "payment_verified", label: "Payment Verified" },
        { value: "processing", label: "Processing" },
        { value: "shipping", label: "Shipping" },
        { value: "delivered", label: "Delivered" },
        { value: "completed", label: "Completed" },
        { value: "cancelled", label: "Cancelled" },
    ];

    const statusLabels = {
        waiting_payment: "inline-block px-3 py-1 rounded-full text-color-primary text-sm font-semibold bg-color-darkyellow",
        payment_verified: "inline-block px-3 py-1 rounded-full text-color-primary text-sm font-semibold bg-color-green",
        processing: "inline-block px-3 py-1 rounded-full text-color-primary text-sm font-semibold bg-color-purple",
        shipping: "inline-block px-3 py-1 rounded-full text-color-primary text-sm font-semibold bg-color-blue-600",
        delivered: "inline-block px-3 py-1 rounded-full text-color-primary text-sm font-semibold bg-color-blue-500",
        completed: "inline-block px-3 py-1 rounded-full text-color-primary text-sm font-semibold bg-color-darkgreen2",
        cancelled: "inline-block px-3 py-1 rounded-full text-color-primary text-sm font-semibold bg-color-red",
    };

    return (
        <div className="relative p-4 pt-24 justify-center w-full h-screen">
            <ToastContainer />
            <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-bold text-color-gray-700">Transactions</h1>
                <button
                    onClick={handleResetAll}
                    className="text-color-blue-500 hover:underline"
                >
                    Reset All
                </button>
            </div>
            <div className="flex mb-2 space-x-2">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="ring-2 ring-color-gray-200 focus:ring-color-blue-500 focus:outline-none p-2 rounded flex-1 mr-2"
                    onChange={handleSearchChange}
                />
            </div>
            <div className="flex mb-8">
                <Select
                    value={selectedUser}
                    onChange={setSelectedUser}
                    options={users}
                    className="flex-1 mr-3"
                    placeholder="Select User"
                    isSearchable
                />
                <Select
                    value={selectedCourier}
                    onChange={setSelectedCourier}
                    options={couriers}
                    className="flex-1 mr-3"
                    placeholder="Select Courier"
                    isSearchable
                />
                <Select
                    value={selectedPaymentMethod}
                    onChange={setSelectedPaymentMethod}
                    options={paymentMethodOptions}
                    className="flex-1 mr-3"
                    placeholder="Select Payment"
                    isSearchable
                />
                <Select
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={statusOptions}
                    className="flex-1 mr-3"
                    placeholder="Select Status"
                    isSearchable
                />
                <Select
                    value={sortBy}
                    onChange={setSortBy}
                    options={[
                        { value: "user_id", label: "User ID" },
                        { value: "courier_id", label: "Courier ID" },
                        { value: "payment_method", label: "Payment Method" },
                        { value: "bank", label: "Bank" },
                        { value: "status", label: "Status" },
                    ]}
                    className="flex-1 mr-3"
                    placeholder="Sort By"
                    isSearchable
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">ID</th>
                            <th className="px-4 py-2 border-b">User ID</th>
                            <th className="px-4 py-2 border-b">Address ID</th>
                            <th className="px-4 py-2 border-b">Courier ID</th>
                            <th className="px-4 py-2 border-b">Payment Method</th>
                            <th className="px-4 py-2 border-b">Bank</th>
                            <th className="px-4 py-2 border-b">Net Price</th>
                            <th className="px-4 py-2 border-b">Status</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {checkouts.map((checkout) => (
                            <tr key={checkout.id} className="hover:bg-color-gray-200">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">
                                    {checkout.id}
                                </td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                                    {checkout.user_id}
                                </td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                                    {checkout.address_id}
                                </td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                                    {checkout.courier_id}
                                </td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                                    {checkout.payment_method}
                                </td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                                    {checkout.bank}
                                </td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                                    {checkout.net_price}
                                </td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                                    <span className={`px-2 py-1 rounded ${statusLabels[checkout.status]}`}>
                                        {checkout.status.replace("_", " ")}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <Button
                                        className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10"
                                        onClick={() => handleEditCheckout(checkout.id)}
                                    >
                                        <ArrowSquareIn className="w-10 h-5" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-4 bottom-5 flex justify-center mt-4">
                    {currentPage > 1 && (
                    <button
                        onClick={() => paginate(1)}
                        className="mx-1 px-3 py-1 text-color-gray-600 hover:text-color-primary rounded hover:bg-color-green"
                    >
                        <ArrowLineLeft />
                    </button>
                    )}
                    {renderPageNumbers()}
                    {currentPage < totalPages && (
                    <button
                        onClick={() => paginate(totalPages)}
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

export default CheckoutPage;