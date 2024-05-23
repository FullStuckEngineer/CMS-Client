"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from "@/app/layout";
import axios from 'axios';
import Select from 'react-select';
import Image from "next/image";
import profilPlaceholder from "@/assets/images/profile-placeholder.jpg";

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
    const [users, setUsers] = useState([]);
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
            fetchUsers();
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

            await fetchImage(`${productData.photo}`);

            setProduct(productData);
            setLoading(false);
        } catch (error) {
            setError(error.message || "Error fetching product data");
            setLoading(false);
        }
    };

    const fetchImage = async (path) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_PATH}/${path}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob'
            });
            console.log("Image response:", response);
            setImage(response.data);
            return;
        } catch (error) {
            console.error("Error fetching image:", error.message || error);
            return null;
        }
    }; 

    const fetchCategories = async () => {
        try {
            const token = sessionStorage.getItem("token");

            let where = {};
            if (product.status === 'Active') {
                where.status = 'Active';
            }
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories`, {
                where,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const pages = response.data.data.totalPages;
            for (let i = 2; i <= pages; i++) {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories?page=${i}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                response.data.data.categories = response.data.data.categories.concat(res.data.data.categories);
            }

            setCategories(response.data.data.categories.map(category => ({ value: category.id, label: `${category.id} : ${category.name}` })));
        } catch (error) {
            console.error("Fetch categories error:", error.message || error);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const pages = response.data.data.totalPages;
            for (let i = 2; i <= pages; i++) {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users?page=${i}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                response.data.data.users = response.data.data.users.concat(res.data.data.users);
            }
            setUsers(response.data.data.users.map(user => ({ value: user.id, label: `${user.id} : ${user.name}`})));
        } catch (error) {
            console.error("Fetch users error:", error.message || error);
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
                headers: {
                    Authorization: `Bearer ${token}`
                }
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
            router.push('/products');
        } catch (error) {
            setError(error.message || "Error saving product data");
        }
    };

    const deleteProduct = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/products/${product.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            router.push('/products');
        } catch (error) {
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
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return formattedDate;
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Product Details</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-darkGrey">ID</label>
                    <input
                        type="text"
                        value={product.id}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Name</label>
                    <input
                        type="text"
                        value={product.name}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                    {nameError && <p className="text-red text-sm mt-1">{nameError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Price</label>
                    <input
                        type="number"
                        value={product.price}
                        onChange={(e) => setProduct({ ...product, price: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                    {priceError && <p className="text-red text-sm mt-1">{priceError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Weight</label>
                    <input
                        type="number"
                        value={product.weight}
                        onChange={(e) => setProduct({ ...product, weight: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                    {weightError && <p className="text-red text-sm mt-1">{weightError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Category</label>
                    <Select
                        value={categories.find(category => category.value === product.category_id)}
                        onChange={(selected) => setProduct({ ...product, category_id: selected.value })}
                        options={categories}
                        className="mt-1 block w-full"
                        placeholder="Select Category"
                        isSearchable
                        required
                    />
                    {categoryError && <p className="text-red text-sm mt-1">{categoryError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Stock</label>
                    <input
                        type="number"
                        value={product.stock}
                        onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                    {stockError && <p className="text-red text-sm mt-1">{stockError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">SKU</label>
                    <input
                        type="text"
                        value={product.sku}
                        onChange={(e) => setProduct({ ...product, sku: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                    {skuError && <p className="text-red text-sm mt-1">{skuError}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Slug</label>
                    <input
                        type="text"
                        value={product.slug}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Description</label>
                    <textarea
                        value={product.description}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Keywords</label>
                    <input
                        type="text"
                        value={product.keywords}
                        onChange={(e) => setProduct({ ...product, keywords: e.target.value })}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Image</label>
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
                            src={profilPlaceholder}
                            alt="Placeholder"
                            className="w-32 h-32 object-cover"
                            width={128}
                            height={128}
                        />
                    )}
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Created At</label>
                    <input
                        type="text"
                        value={formatDate(product.created_at)}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Last Updated At</label>
                    <input
                        type="text"
                        value={formatDate(product.update_at)}
                        readOnly
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2 bg-lightGrey"
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    <button
                        type="button"
                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10 md:w-32 w-40"
                        onClick={() => saveProduct(product)}
                    >
                        Save
                    </button>
                    {product.status === 'Active' &&
                        <button
                            type="button"
                            className="bg-red hover:bg-redhover text-white rounded-lg h-10 md:w-32 w-40"
                            onClick={deleteProduct}
                        >
                            Delete
                        </button>
                    }
                    <button
                        type="button"
                        className="border border-green hover:bg-lightGrey text-green rounded-lg h-10 md:w-32 w-40"
                        onClick={() => router.push('/products')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductDetailPage;