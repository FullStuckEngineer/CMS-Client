"use client";
import Button from "@/components/ui/Button";
import { ArrowSquareIn } from "@phosphor-icons/react";
import React, { useState, useEffect } from "react";
import axios from "axios";

const userData = [
    [
        { id: 1, email: "user1@example.com", name: "User One", role: "Admin", phone_number: "123-456-7890" },
        { id: 2, email: "user2@example.com", name: "User Two", role: "User", phone_number: "123-456-7891" },
        { id: 3, email: "user3@example.com", name: "User Three", role: "User", phone_number: "123-456-7892" },
        { id: 4, email: "user4@example.com", name: "User Four", role: "Admin", phone_number: "123-456-7893" },
        { id: 5, email: "user5@example.com", name: "User Five", role: "User", phone_number: "123-456-7894" },
        { id: 6, email: "user6@example.com", name: "User Six", role: "Admin", phone_number: "123-456-7895" },
        { id: 7, email: "user7@example.com", name: "User Seven", role: "User", phone_number: "123-456-7896" },
        { id: 8, email: "user8@example.com", name: "User Eight", role: "Admin", phone_number: "123-456-7897" },
        { id: 9, email: "user9@example.com", name: "User Nine", role: "User", phone_number: "123-456-7898" },
        { id: 10, email: "user10@example.com", name: "User Ten", role: "User", phone_number: "123-456-7899" }
    ],
    [
        { id: 11, email: "user11@example.com", name: "User Eleven", role: "Admin", phone_number: "123-456-7900" },
        { id: 12, email: "user12@example.com", name: "User Twelve", role: "User", phone_number: "123-456-7901" },
        { id: 13, email: "user13@example.com", name: "User Thirteen", role: "Admin", phone_number: "123-456-7902" },
        { id: 14, email: "user14@example.com", name: "User Fourteen", role: "User", phone_number: "123-456-7903" },
        { id: 15, email: "user15@example.com", name: "User Fifteen", role: "Admin", phone_number: "123-456-7904" }
    ]
];

const UsersPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    
    useEffect(() => {
        fetchUserData();
    }, [currentPage]);

    useEffect(() => {
        filterUserData();
    }, [searchTerm, filterRole, sortBy, users]);

    const fetchUserData = async () => {
        setUsers(userData[currentPage - 1]);
        setTotalPages(2);
        // try {
        //     const response = await axios.get(`{{baseURL}}/cms/products?page=${currentPage}`);
        //     setUsers(response.data.users);
        //     setTotalPages(response.data.totalPages);
        // } catch (error) {
        //     console.error("Error fetching user data:", error);
        // }
    };

    const filterUserData = () => {
        let filteredData = [...users];

        if (filterRole) {
            filteredData = filteredData.filter(user => user.role === filterRole);
        }

        if (searchTerm) {
            filteredData = filteredData.filter(user =>
                Object.values(user).some(value =>
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

        setFilteredUsers(filteredData);
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setFilterRole("");
        setSortBy("");
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="p-4 justify-center">
            <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-bold">Users</h1>
                <button onClick={handleResetAll} className="text-blue-500 hover:underline">
                    Reset All
                </button>
            </div>
            <div className="flex mb-8">
                <select
                    className="border p-2 rounded mr-2"
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                >
                    <option value="">Select By Role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
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
                    <option value="role">Role</option>
                    <option value="email">Email</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">ID</th>
                            <th className="px-4 py-2 border-b">Email</th>
                            <th className="px-4 py-2 border-b">Name</th>
                            <th className="px-4 py-2 border-b">Role</th>
                            <th className="px-4 py-2 border-b">Phone Number</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-100">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{user.id}</td>
                                <td className="px-4 py-2 w-60 overflow-hidden whitespace-nowrap truncate text-center">{user.email}</td>
                                <td className="px-4 py-2 w-80 overflow-hidden whitespace-nowrap truncate text-center">{user.name}</td>
                                <td className="px-4 py-2 w-40 overflow-hidden whitespace-nowrap truncate text-center">{user.role}</td>
                                <td className="px-4 py-2 w-80 overflow-hidden whitespace-nowrap truncate text-center">{user.phone_number}</td>
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

export default UsersPage;