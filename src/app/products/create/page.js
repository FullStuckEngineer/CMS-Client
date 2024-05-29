"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Select from 'react-select';

const CreateProductPage = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [weight, setWeight] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [stock, setStock] = useState('');
    const [sku, setSku] = useState('');
    const [description, setDescription] = useState('');
    const [keywords, setKeywords] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const token = sessionStorage.getItem("token");
            let categories = [];
            
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories`, {
                params: {
                    status: "Active"
                },
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            categories = response.data.data.categories;
            const pages = response.data.data.totalPages;
    
            for (let i = 2; i <= pages; i++) {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories`, {
                    params: {
                        status: "Active",
                        page: i
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                categories = categories.concat(res.data.data.categories);
            }
    
            setCategories(categories.map(category => ({ value: category.id, label: `${category.id} : ${category.name}` })));
        } catch (error) {
            console.error("Fetch categories error:", error.message || error);
        }
    };    

    const handleCreateProduct = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = sessionStorage.getItem("token");
            const newProduct = {
                name,
                price: parseFloat(price),
                weight: parseFloat(weight),
                category_id: parseInt(categoryId.value),
                stock: parseInt(stock),
                sku,
                description,
                keywords
            };

            const productResponse = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/products`, newProduct, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (imageFile) {
                const formData = new FormData();
                formData.append('image', imageFile);
                formData.append('id', productResponse.data.data.id);
                await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/products/uploads`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            router.push('/products');
        } catch (error) {
            setError(error.message || "Error creating product");
            setLoading(false);
        }
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Create New Product</h1>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreateProduct(); }}>
                {error && <div className="text-red mb-4">{error}</div>}
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Weight</label>
                    <input
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Category</label>
                    <Select
                        value={categoryId}
                        onChange={setCategoryId}
                        options={categories}
                        className="mt-1 block w-full"
                        placeholder="Select Category"
                        isSearchable
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">SKU</label>
                    <input
                        type="text"
                        value={sku}
                        onChange={(e) => setSku(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Keywords</label>
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-darkGrey">Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="mt-1 block w-full border border-grey rounded-md shadow-sm p-2"
                    />
                </div>
                <div className="flex space-x-2 justify-center">
                    <button
                        type="submit"
                        className="bg-green hover:bg-greenhover text-primary rounded-lg h-10 md:w-32 w-40"
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create'}
                    </button>
                    <button
                        type="button"
                        className="border border-green hover:bg-lightGrey text-green rounded-lg h-10 md:w-32 w-40"
                        onClick={() => router.push('/products')}
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProductPage;
