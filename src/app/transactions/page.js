"use client";
import Button from "@/components/ui/Button";
import { ArrowSquareIn } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";

const transactionsData = [
    [
        { id: 1, userId: 101, address: "123 Main St", courier: "DHL", paymentMethod: "Credit Card", status: "Completed", netPrice: 100 },
        { id: 2, userId: 102, address: "456 Elm St", courier: "FedEx", paymentMethod: "PayPal", status: "Pending", netPrice: 150 },
        { id: 3, userId: 103, address: "789 Oak St", courier: "UPS", paymentMethod: "Bank Transfer", status: "Cancelled", netPrice: 200 },
        { id: 4, userId: 104, address: "101 Pine St", courier: "DHL", paymentMethod: "Credit Card", status: "Completed", netPrice: 120 },
        { id: 5, userId: 105, address: "202 Birch St", courier: "FedEx", paymentMethod: "PayPal", status: "Pending", netPrice: 180 },
        { id: 6, userId: 106, address: "303 Cedar St", courier: "UPS", paymentMethod: "Bank Transfer", status: "Cancelled", netPrice: 130 },
        { id: 7, userId: 107, address: "404 Maple St", courier: "DHL", paymentMethod: "Credit Card", status: "Completed", netPrice: 170 },
        { id: 8, userId: 108, address: "505 Walnut St", courier: "FedEx", paymentMethod: "PayPal", status: "Pending", netPrice: 140 },
        { id: 9, userId: 109, address: "606 Ash St", courier: "UPS", paymentMethod: "Bank Transfer", status: "Cancelled", netPrice: 190 },
        { id: 10, userId: 110, address: "707 Willow St", courier: "DHL", paymentMethod: "Credit Card", status: "Completed", netPrice: 110 },
    ],
    [
        { id: 11, userId: 111, address: "808 Spruce St", courier: "FedEx", paymentMethod: "PayPal", status: "Pending", netPrice: 160 },
        { id: 12, userId: 112, address: "909 Fir St", courier: "UPS", paymentMethod: "Bank Transfer", status: "Cancelled", netPrice: 210 },
        { id: 13, userId: 113, address: "1010 Cypress St", courier: "DHL", paymentMethod: "Credit Card", status: "Completed", netPrice: 125 },
        { id: 14, userId: 114, address: "1111 Redwood St", courier: "FedEx", paymentMethod: "PayPal", status: "Pending", netPrice: 175 },
        { id: 15, userId: 115, address: "1212 Sequoia St", courier: "UPS", paymentMethod: "Bank Transfer", status: "Cancelled", netPrice: 195 },
    ]
];

const getUniqueCouriers = (data) => {
    const couriers = new Set();
    data.forEach(page => {
        page.forEach(transaction => {
            couriers.add(transaction.courier);
        });
    });
    return Array.from(couriers);
};

const getUniquePaymentMethods = (data) => {
    const paymentMethods = new Set();
    data.forEach(page => {
        page.forEach(transaction => {
            paymentMethods.add(transaction.paymentMethod);
        });
    });
    return Array.from(paymentMethods);
};

const TransactionsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterCourier, setFilterCourier] = useState("");
    const [filterPaymentMethod, setFilterPaymentMethod] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const uniqueCouriers = getUniqueCouriers(transactionsData);
    const uniquePaymentMethods = getUniquePaymentMethods(transactionsData);

    useEffect(() => {
        fetchTransactionData();
    }, [currentPage]);

    useEffect(() => {
        filterTransactionData();
    }, [searchTerm, filterStatus, filterCourier, filterPaymentMethod, sortBy, transactions]);

    const fetchTransactionData = async () => {
        // TODO: Fetch data from API
        setTransactions(transactionsData[currentPage - 1]);
        setTotalPages(2);
    };

    const filterTransactionData = () => {
        let filteredData = [...transactions];

        if (filterStatus) {
            filteredData = filteredData.filter(transaction => transaction.status === filterStatus);
        }

        if (filterCourier) {
            filteredData = filteredData.filter(transaction => transaction.courier === filterCourier);
        }

        if (filterPaymentMethod) {
            filteredData = filteredData.filter(transaction => transaction.paymentMethod === filterPaymentMethod);
        }

        if (searchTerm) {
            filteredData = filteredData.filter(transaction =>
                Object.values(transaction).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (sortBy) {
            filteredData.sort((a, b) => {
                const aValue = a[sortBy];
                const bValue = b[sortBy];
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return aValue - bValue;
                }
                return aValue.localeCompare(bValue);
            });
        }

        setFilteredTransactions(filteredData);
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setFilterStatus("");
        setFilterCourier("");
        setFilterPaymentMethod("");
        setSortBy("");
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-4 justify-center">
            <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-bold">Transactions</h1>
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
                <select
                    className="border p-2 rounded"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="">Sort by</option>
                    <option value="id">ID</option>
                    <option value="userId">User ID</option>
                    <option value="address">Address</option>
                    <option value="courier">Courier</option>
                    <option value="paymentMethod">Payment Method</option>
                    <option value="status">Status</option>
                    <option value="netPrice">Net Price</option>
                </select>
            </div>
            <div className="flex mb-8">
            <select
                    className="border p-2 rounded mr-2"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="">Select By Status</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                <select
                    className="border p-2 rounded mr-2"
                    value={filterCourier}
                    onChange={(e) => setFilterCourier(e.target.value)}
                >
                    <option value="">Select By Courier</option>
                    {uniqueCouriers.map(courier => (
                        <option key={courier} value={courier}>{courier}</option>
                    ))}
                </select>
                <select
                    className="border p-2 rounded mr-2"
                    value={filterPaymentMethod}
                    onChange={(e) => setFilterPaymentMethod(e.target.value)}
                >
                    <option value="">Select By Payment Method</option>
                    {uniquePaymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                    ))}
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">ID</th>
                            <th className="px-4 py-2 border-b">User ID</th>
                            <th className="px-4 py-2 border-b">Address</th>
                            <th className="px-4 py-2 border-b">Courier</th>
                            <th className="px-4 py-2 border-b">Net Price</th>
                            <th className="px-4 py-2 border-b">Payment Method</th>
                            <th className="px-4 py-2 border-b">Status</th>
                            <th className="px-4 py-2 border-b">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{transaction.id}</td>
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{transaction.userId}</td>
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate">{transaction.address}</td>
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{transaction.courier}</td>
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">${transaction.netPrice}</td>
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{transaction.paymentMethod}</td>
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{transaction.status}</td>
                                <td className="px-4 py-2 text-center">
                                    <Button className="bg-green hover:bg-greenhover text-primary rounded-lg h-10">
                                        <ArrowSquareIn className="w-10 h-5" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
    );
};

export default TransactionsPage;
