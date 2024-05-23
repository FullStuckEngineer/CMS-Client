"use client";
import React, { useState, useEffect, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/layout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Button from "@/components/ui/Button";
import { ArrowSquareIn, ListPlus, ArrowLineLeft, ArrowLineRight } from "@phosphor-icons/react";
import Select from 'react-select';
import { debounce } from 'lodash';

const AddressPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    const [addresses, setAddresses] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [users, setUsers] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);
    const [sortBy, setSortBy] = useState("");
    const [initialLoad, setInitialLoad] = useState(true);
    const perPage = 10;

    useEffect(() => {
        fetchAddressesData();
    }, [currentPage, searchTerm, selectedUser, selectedCity, sortBy]);

    useEffect(() => {
        if (addresses.length > 0 && initialLoad) {
            fetchUsersAndCities();
            setInitialLoad(false);
        }
    }, [addresses]);

    const fetchAddressesData = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/addresses`, {
                params: {
                    page: currentPage,
                    perPage: perPage,
                    searchTerm: searchTerm,
                    userId: selectedUser ? selectedUser.value : "",
                    cityId: selectedCity ? selectedCity.value : "",
                    sortBy: sortBy
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const addressesData = response.data.data;
            setAddresses(addressesData.addresses);
            setTotalPages(addressesData.totalPages);
        } catch (error) {
            console.error("Fetch addresses error:", error.message || error);
            toast.error('No Addresses Found');
        }
    };

    const fetchUsersAndCities = async () => {
        const uniqueUserIds = [...new Set(addresses.map(address => address.user_id))];
        const uniqueCityIds = [...new Set(addresses.map(address => address.city_id))];

        await Promise.all([fetchResourceData('users', uniqueUserIds, setUsers), fetchResourceData('cities', uniqueCityIds, setCities)]);
    };

    useEffect(() => {
        fetchUsersAndCities();
    }, []);

    const fetchResourceData = async (resource, ids, setData) => {
        try {
            const token = sessionStorage.getItem("token");
            const dataResult = await Promise.all(ids.map(async (id) => {
                console.log(`Fetching Data on ${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/${resource}/${id}`);

                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/${resource}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(`Fetched Data on ${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/${resource}/${id}:`, response.data.data);

                return { value: response.data.data.id, label: `${response.data.data.id}: ${response.data.data.name}` };
            }));
            setData(dataResult);

            console.log(`Fetch ${resource} data:`, dataResult);
        } catch (error) {
            console.error(`Fetch ${resource} error:`, error.message || error);
        }
    };

    const debouncedSearch = useCallback(
        debounce((value) => {
            setSearchTerm(value);
        }, 300),
        []
    );

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleResetAll = () => {
        setSearchTerm("");
        setSelectedUser(null);
        setSelectedCity(null);
        setSortBy("");
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditAddress = (id) => {
        router.push(`/addresses/${id}`);
    };

    const handleCreateAddress = () => {
        router.push('/addresses/create');
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
                    className={`mx-1 px-3 py-1 text-darkGrey rounded hover:bg-lightGreen ${currentPage === i ? 'font-bold' : ''}`}
                >
                    {i}
                </button>
            );
        }

        return pageNumbers;
    };
    
    console.log("Search Term:", searchTerm);
    console.log("Selected User:", selectedUser);
    console.log("Selected City:", selectedCity);
    console.log("Sort By:", sortBy);

    return (
        <div className="p-4 justify-center w-full">
            <ToastContainer />
            <div className="flex justify-between items-center mb-8 mt-4">
                <h1 className="text-2xl font-bold">Addresses</h1>
                <button onClick={handleResetAll} className="text-blue-500 hover:underline">
                    Reset All
                </button>
            </div>
            <div className="flex mb-2 space-x-2">
                <input
                    type="text"
                    placeholder="Search here..."
                    className="border p-2 rounded flex-1 mr-2"
                    onChange={handleSearchChange}
                />
                <button
                    type="button"
                    className="bg-green hover:bg-greenhover text-primary rounded-lg h-10 md:w-28 w-36 flex items-center justify-center"
                    onClick={handleCreateAddress}
                >
                    <ListPlus className="mr-2"/>
                    Create
                </button>
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
                    value={selectedCity}
                    onChange={setSelectedCity}
                    options={cities}
                    className="flex-1 mr-3"
                    placeholder="Select City"
                    isSearchable
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border p-2 rounded flex-1"
                >
                    <option value="">Sort By</option>
                    <option value="receiver_name">Receiver Name</option>
                    <option value="receiver_phone">Receiver Phone</option>
                    <option value="detail_address">Detail Address</option>
                    <option value="city_id">City</option>
                    <option value="province">Province</option>
                    <option value="postal_code">Postal Code</option>
                    <option value="user_id">User</option>
                </select>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 border-b">ID</th>
                            <th className="px-4 py-2 border-b">Receiver Name</th>
                            <th className="px-4 py-2 border-b">Receiver Phone</th>
                            <th className="px-4 py-2 border-b">Details</th>
                            <th className="px-4 py-2 border-b">City</th>
                            <th className="px-4 py-2 border-b">Province</th>
                            <th className="px-4 py-2 border-b">Postal Code</th>
                            <th className="px-4 py-2 border-b">User</th>
                            <th className="px-4 py-2 border-b">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {addresses.map((address) => (
                            <tr key={address.id} className="hover:bg-grey-100">
                                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{address.id}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{address.receiver_name}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{address.receiver_phone}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{address.detail_address}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{address.city_id}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{address.province}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{address.postal_code}</td>
                                <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{address.user_id}</td>
                                <td className="px-4 py-2 text-center">
                                    <Button
                                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10"
                                        onClick={() => handleEditAddress(address.id)}
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

export default AddressPage;