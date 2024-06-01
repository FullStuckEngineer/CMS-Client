"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from "@/app/layout";
import axios from 'axios';
import Select from 'react-select';
import Image from "next/image";
import productPlaceholder from "@/assets/images/product-placeholder.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetailPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [nameError, setNameError] = useState('');
    const [priceError, setPriceError] = useState('');
    const [weightError, setWeightError] = useState('');
    const [categoryError, setCategoryError] = useState('');
    const [stockError, setStockError] = useState('');
    const [skuError, setSkuError] = useState('');
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        if (slug) {
            fetchProductData(slug);
            fetchCategories();
        }
    }, [slug]);

    const fetchProductData = async (slug) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/products/${slug}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const productData = response.data.data;

            if (productData.photo) {
                await fetchImage(`${productData.photo}`);
            }

            setProduct(productData);
            setLoading(false);
        } catch (error) {
            setError(error.message || "Error fetching product data");
            setLoading(false);
        }
    };

    const fetchImage = async (path) => {
        try {
            setImage(`${process.env.NEXT_PUBLIC_BACKEND_PATH}/${path}`);
            return;
        } catch (error) {
            console.error("Error fetching image:", error.message || error);
            return null;
        }
    };

    const fetchCategories = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories`, {
                params: { status: "Active" },
                headers: { Authorization: `Bearer ${token}` }
            });

            const categories = response.data.data.categories.map(category => ({ value: category.id, label: `${category.id} : ${category.name}` }));
            setCategories(categories);
        } catch (error) {
            console.error("Fetch categories error:", error.message || error);
        }
    };

    const saveProduct = async (updatedProduct) => {
        if (!updatedProduct.name) {
            setNameError("Name cannot be empty");
            return;
        } else {
            setNameError("");
        }

        if (updatedProduct.price < 0) {
            setPriceError("Price cannot be negative");
            return;
        }

        if (updatedProduct.weight < 0) {
            setWeightError("Weight cannot be negative");
            return;
        }

        if (!updatedProduct.category_id) {
            setCategoryError("Category cannot be empty");
            return;
        }

        if (updatedProduct.stock < 0) {
            setStockError("Stock cannot be negative");
            return;
        }

        if (!updatedProduct.sku) {
            setSkuError("SKU cannot be empty");
            return;
        }

        try {
            const token = sessionStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/products/${product.id}`, updatedProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('id', product.id);
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/products/uploads`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            toast.success("Product data saved successfully! Redirecting to Products List", {
                autoClose: 2000,
                onClose: () => router.push("/products"),
            });
        } catch (error) {
            toast.error(error.message || "Error saving product data");
            setError(error.message || "Error saving product data");
        }
    };

    const deleteProduct = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/products/${product.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Product deleted successfully! Redirecting to Products List", {
                autoClose: 2000,
                onClose: () => router.push("/products"),
            });
        } catch (error) {
            toast.error(error.message || "Error deleting product");
            setError(error.message || "Error deleting product");
        }
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
    };

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const inputClass = (isReadOnly) => isReadOnly ? "mt-1 block w-full border border-color-gray-200 text-color-primary rounded-md shadow-sm p-2 bg-color-darkgray" : "mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2";

    return (
        <div className="relative p-4 pt-24 justify-center w-full h-screen">
            <ToastContainer />
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Product Details</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">ID</label>
                    <input
                        type="text"
                        value={product.id}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 text-color-primary rounded-md shadow-sm p-2 bg-color-darkgray"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Name</label>
                    <input
                        type="text"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        className={inputClass(product.status === 'Inactive')}
                        required
                        readOnly={product.status === 'Inactive'}
                    />
                    {nameError && <p className="text-color-red text-sm mt-1">{nameError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Price</label>
                    <input
                        type="number"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
                        className={inputClass(product.status === 'Inactive')}
                        required
                        readOnly={product.status === 'Inactive'}
                    />
                    {priceError && <p className="text-color-red text-sm mt-1">{priceError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Weight</label>
                    <input
                        type="number"
                        value={product.weight}
                        onChange={(e) => setProduct({ ...product, weight: parseFloat(e.target.value) })}
                        className={inputClass(product.status === 'Inactive')}
                        required
                        readOnly={product.status === 'Inactive'}
                    />
                    {weightError && <p className="text-color-red text-sm mt-1">{weightError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Category</label>
                    <Select
                        value={categories.find(category => category.value === product.category_id)}
                        onChange={(selected) => setProduct({ ...product, category_id: selected.value })}
                        options={categories}
                        className="mt-1 block w-full"
                        placeholder="Select Category"
                        isSearchable
                        isDisabled={product.status === 'Inactive'}
                    />
                    {categoryError && <p className="text-color-red text-sm mt-1">{categoryError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Stock</label>
                    <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) })}
                        className={inputClass(product.status === 'Inactive')}
                        required
                        readOnly={product.status === 'Inactive'}
                    />
                    {stockError && <p className="text-color-red text-sm mt-1">{stockError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">SKU</label>
                    <input
                        type="text"
                        value={product.sku}
                        onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                        className={inputClass(product.status === 'Inactive')}
                        required
                        readOnly={product.status === 'Inactive'}
                    />
                    {skuError && <p className="text-color-red text-sm mt-1">{skuError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Slug</label>
                    <input
                        type="text"
                        value={product.slug}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 text-color-primary rounded-md shadow-sm p-2 bg-color-darkgray"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Description</label>
                    <textarea
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        className={inputClass(product.status === 'Inactive')}
                        readOnly={product.status === 'Inactive'}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Keywords</label>
                    <input
                        type="text"
                        value={product.keywords}
                        onChange={(e) => setProduct({ ...product, keywords: e.target.value })}
                        className={inputClass(product.status === 'Inactive')}
                        readOnly={product.status === 'Inactive'}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Image</label>
                    {image ? (
                        <Image
                            src={image}
                            alt={product.name}
                            className="w-32 h-32 object-cover"
                            width={128}
                            height={128}
                        />
                    ) : (
                        <Image
                            src={productPlaceholder}
                            alt="Placeholder"
                            className="w-32 h-32 object-cover"
                            width={128}
                            height={128}
                        />
                    )}
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
                        disabled={product.status === 'Inactive'}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Created At</label>
                    <input
                        type="text"
                        value={formatDate(product.created_at)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 text-color-primary rounded-md shadow-sm p-2 bg-color-darkgray"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Last Updated At</label>
                    <input
                        type="text"
                        value={formatDate(product.update_at)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 text-color-primary rounded-md shadow-sm p-2 bg-color-darkgray"
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    {product.status === 'Active' && (
                        <button
                            type="button"
                            className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10 md:w-32 w-40"
                            onClick={() => saveProduct(product)}
                        >
                            Save
                        </button>
                    )}
                    {product.status === 'Active' && (
                        <button
                            type="button"
                            className="bg-color-red hover:bg-color-redhover text-color-primary rounded-lg h-10 md:w-32 w-40"
                            onClick={deleteProduct}
                        >
                            Delete
                        </button>
                    )}
                    <button
                        type="button"
                        className="border border-green hover:bg-color-gray-400 hover:text-color-primary text-color-green rounded-lg h-10 md:w-32 w-40"
                        onClick={() => router.push('/products')}
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductDetailPage;
