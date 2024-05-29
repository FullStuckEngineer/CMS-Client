"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/layout";
import { ArrowLineLeft, ArrowLineRight } from "@phosphor-icons/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "@/components/ui/Input";

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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/cities`,
        {
          params: {
            page: currentPage,
            perPage: citiesPerPage,
            searchTerm: searchTerm,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const citiesData = response.data.data;
      setCities(citiesData.cities);
      setTotalPages(citiesData.totalPages);
    } catch (error) {
      console.error("Fetch cities error:", error.message || error);
      toast.error("No Cities Found");
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

  return (
    <div className="relative p-4 pt-24 justify-center w-full h-screen">
      <ToastContainer />
      <div className="flex justify-between items-center mb-8 mt-4">
        <h1 className="text-2xl font-bold text-color-gray-700">Cities</h1>
        <button
          onClick={handleResetAll}
          className="text-color-blue-500 hover:underline"
        >
          Reset All
        </button>
      </div>
      <div className="flex mb-8">
        <input
          type="text"
          placeholder="Search here..."
          className="ring-2 ring-color-gray-200 focus:ring-color-blue-500 focus:outline-none p-2 rounded flex-1 mr-2"
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
              <tr key={city.id} className="hover:bg-color-gray-200">
                <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">
                  {city.id}
                </td>
                <td className="px-4 py-2 overflow-hidden whitespace-nowrap truncate text-center">
                  {city.name}
                </td>
              </tr>
            ))}
            {cities.length === 1 && (
              <tr className="hover:bg-color-gray-200">
                <td className="px-4 py-2 w-32"></td>
                <td className="px-4 py-2"></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className=" absolute right-[28rem] bottom-5 flex justify-center mt-4">
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
  );
};

export default CitiesPage;
