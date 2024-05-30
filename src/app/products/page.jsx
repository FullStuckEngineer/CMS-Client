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
    ListPlus,
    ArrowLineLeft,
    ArrowLineRight,
} from "@phosphor-icons/react";
import Select from "react-select";
import { debounce } from "lodash";

const ProductPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
        router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    const [products, setProducts] = useState([]);
    const [searchTerms, setSearchTerms] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [sortBy, setSortBy] = useState(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const perPage = 10;

    useEffect(() => {
        fetchProductsData();
    }, [currentPage, searchTerms, selectedCategory, selectedStatus, sortBy]);

    useEffect(() => {
        if (products.length > 0 && initialLoad) {
        fetchCategories();
        setInitialLoad(false);
        }
    }, [products]);

    const fetchProductsData = async () => {
        try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/products`,
            {
            params: {
                page: currentPage,
                perPage: perPage,
                searchTerms: searchTerms,
                categoryId: selectedCategory ? selectedCategory.value : "",
                status: selectedStatus ? selectedStatus.value : "",
                sortBy: sortBy ? sortBy.value : "",
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );
        const productsData = response.data.data;
        setProducts(productsData.products);
        setTotalPages(productsData.totalPages);
        } catch (error) {
        console.error("Fetch products error:", error.message || error);
        toast.error("No Products Found");
        }
    };

    const fetchCategories = async () => {
        try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories`,
            {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            }
        );

        const pages = response.data.data.totalPages;
        for (let i = 2; i <= pages; i++) {
            const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories?page=${i}`,
            {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );
            response.data.data.categories = response.data.data.categories.concat(
            res.data.data.categories
            );
        }
        setCategories(
            response.data.data.categories.map((category) => ({
            value: category.id,
            label: `${category.id} : ${category.name}`,
            }))
        );
        } catch (error) {
        console.error("Fetch products error:", error.message || error);
        toast.error("No Products Found");
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
        setSelectedCategory(null);
        setSelectedStatus(null);
        setSortBy(null);
        setCurrentPage(1);
    };

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleEditProduct = (slug) => {
        router.push(`/products/${slug}`);
    };

    const handleCreateProduct = () => {
        router.push("/products/create");
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

    const getStatusLabel = (status) => {
        const baseClass = "inline-block px-3 py-1 rounded-full text-color-primary text-sm font-semibold";
        const statusClass = status === "Active" ? "bg-color-green" : "bg-color-red";
        return (
            <span className={`${baseClass} ${statusClass}`}>
            {status}
            </span>
        );
    };

    console.log("Search Term:", searchTerms);
    console.log("Selected Category:", selectedCategory);
    console.log("Selected Status:", selectedStatus);
    console.log("Sort By:", sortBy);

    return (
        <div className="relative p-4 pt-24 justify-center w-full h-screen">
        <ToastContainer />
        <div className="flex justify-between items-center mb-8 mt-4">
            <h1 className="text-2xl font-bold text-color-gray-700">Products</h1>
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
            <Button
            type="button"
            className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10 md:w-28 w-36 flex items-center justify-center"
            onClick={handleCreateProduct}
            >
            <ListPlus className="mr-2" />
            Create
            </Button>
        </div>
        <div className="flex mb-8">
            <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categories}
                className="flex-1 mr-3"
                placeholder="Select Category"
                isSearchable
            />
            <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={[
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                ]}
                className="flex-1 mr-3"
                placeholder="Select Status"
                isSearchable
            />
            <Select
                value={sortBy}
                onChange={setSortBy}
                options={[
                    { value: "name", label: "Name" },
                    { value: "price", label: "Price" },
                    { value: "weight", label: "Weight" },
                    { value: "category_id", label: "Category" },
                    { value: "stock", label: "Stock" },
                    { value: "sku", label: "SKU" },
                    { value: "slug", label: "Slug" },
                    { value: "status", label: "Status" }
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
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Price</th>
                <th className="px-4 py-2 border-b">Weight</th>
                <th className="px-4 py-2 border-b">Category</th>
                <th className="px-4 py-2 border-b">Stock</th>
                <th className="px-4 py-2 border-b">SKU</th>
                <th className="px-4 py-2 border-b">Slug</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                <tr key={product.id} className="hover:bg-color-gray-200">
                    <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">
                    {product.id}
                    </td>
                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                    {product.name}
                    </td>
                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                    {product.price}
                    </td>
                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                    {product.weight}
                    </td>
                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                    {product.category_id}
                    </td>
                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                    {product.stock}
                    </td>
                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                    {product.sku}
                    </td>
                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                    {product.slug}
                    </td>
                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">
                    {getStatusLabel(product.status)}
                    </td>
                    <td className="px-4 py-2 text-center">
                    <Button
                        className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10"
                        onClick={() => handleEditProduct(product.slug)}
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
                onClick={() => paginate(currentPage - 1)}
                className="mx-1 px-3 py-1 text-color-gray-600 hover:text-color-primary rounded hover:bg-color-green"
                >
                <ArrowLineLeft />
                </button>
            )}
            {renderPageNumbers()}
            {currentPage < totalPages && (
                <button
                onClick={() => paginate(currentPage + 1)}
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

export default ProductPage;
