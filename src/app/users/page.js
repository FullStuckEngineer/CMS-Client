"use client";
import Button from "@/components/ui/Button";
import { ArrowSquareIn, ListPlus, ArrowLineLeft, ArrowLineRight } from "@phosphor-icons/react";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/layout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    }, [currentPage]);

    useEffect(() => {
        fetchUsersData();
    }, [searchTerm, filterRole, sortBy]);

    const fetchUsersData = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users`, {
                params: {
                    page: currentPage,
                    perPage: perPage,
                    searchTerm: searchTerm,
                    role: filterRole,
                    sortBy: sortBy
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const usersData = response.data.data;
            setUsers(usersData.users);
            setTotalPages(usersData.totalPages);
        } catch (error) {
            console.error("Fetch users error:", error.message || error);
            toast.error('No Users Found');
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

    const handleCreateUser = () => {
        router.push('/users/create');
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
                <h1 className="text-2xl font-bold">Users</h1>
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
                    onClick={handleCreateUser}
                >
                    <ListPlus className="mr-2"/>
                    Create
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
                <select
                    className="border p-2 rounded"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="">Sort by</option>
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="role">Role</option>
                    <option value="id">ID</option>
                </select>
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
                            <tr key={user.id} className="hover:bg-grey-100">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{user.id}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{user.name}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{user.email}</td>
                                <td className="px-4 py-2 w-60 overflow-hidden whitespace-nowrap truncate text-center">{user.role}</td>
                                <td className="px-4 py-2 text-center">
                                    <Button
                                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10"
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

export default UserPage;