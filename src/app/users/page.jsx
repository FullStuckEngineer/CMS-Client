"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/layout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import Button from "@/components/ui/Button";
import {
  ArrowSquareIn,
  ArrowLineLeft,
  ArrowLineRight,
} from "@phosphor-icons/react";

const UserPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("");
    const [sortBy, setSortBy] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const perPage = 10;

    useEffect(() => {
        fetchUsersData();
    }, [currentPage, searchTerm, filterRole, sortBy]);

    const fetchUsersData = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users`,
                {
                    params: {
                        page: currentPage,
                        perPage: perPage,
                        searchTerm: searchTerm,
                        role: filterRole ? filterRole.value : "",
                        sortBy: sortBy ? sortBy.value : "",
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const usersData = response.data.data;
            setUsers(usersData.users);
            setTotalPages(usersData.totalPages);
        } catch (error) {
            console.error("Fetch users error:", error.message || error);
            toast.error("No Users Found");
        }
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setFilterRole("");
        setSortBy("");
        setCurrentPage(1);
        fetchUsersData();
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        fetchUsersData();
    };

    const handleEditUser = (id) => {
        router.push(`/users/${id}`);
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

    const roleOptions = [
        { value: "admin", label: "Admin" },
        { value: "user", label: "User" },
    ];

    const sortByOptions = [
        { value: "name", label: "Name" },
        { value: "email", label: "Email" },
        { value: "role", label: "Role" },
        { value: "id", label: "ID" },
    ];

    return (
        <div className="relative p-4 pt-24 justify-center w-full h-screen">
            <ToastContainer />
            <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-bold text-color-gray-700">Users</h1>
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
            </div>
            <div className="flex mb-8 space-x-2">
                <Select
                    value={filterRole}
                    onChange={setFilterRole}
                    options={roleOptions}
                    className="flex-1"
                    placeholder="Select By Role"
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
                            <th className="px-4 py-2 border-b">Email</th>
                            <th className="px-4 py-2 border-b">Role</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-color-gray-200">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">
                                    {user.id}
                                </td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                                    {user.name}
                                </td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                                    {user.email}
                                </td>
                                <td className="px-4 py-2 w-60 overflow-hidden whitespace-nowrap truncate text-center">
                                    {user.role}
                                </td>
                                <td className="px-4 py-2 text-center">
                                    <Button
                                        className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10"
                                        onClick={() => handleEditUser(user.id)}
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

export default UserPage;