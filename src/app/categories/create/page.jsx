"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const CategoryCreatePage = () => {
	const router = useRouter();
	const [name, setName] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleCreateCategory = async () => {
		setLoading(true);
		setError(null);
		try {
		const token = sessionStorage.getItem("token");
		const newCategory = { name };
		await axios.post(
			`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/categories`,
			newCategory,
			{
			headers: {
				Authorization: `Bearer ${token}`,
			},
			}
		);
		router.push("/categories");
		} catch (error) {
		setError(error.message || "Error creating category");
		setLoading(false);
		}
	};

	return (
        <div className="relative p-4 pt-24 justify-center w-full h-screen">
			<h1 className="text-2xl font-bold mb-4 justify-center flex">
				Create New Category
			</h1>
			<form
				className="space-y-4"
				onSubmit={(e) => {
				e.preventDefault();
				handleCreateCategory();
				}}
			>
				<div>
					<label className="block text-sm font-medium text-color-gray-700">
						Name
					</label>
					<input
						type="text"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2"
						required
				/>
				</div>
				<div className="flex space-x-2 justify-center">
					<button
						type="submit"
						className="bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10 md:w-32 w-40"
						disabled={loading}
					>
						{loading ? "Creating..." : "Create"}
					</button>
					<button
						type="button"
						className="border border-color-green hover:bg-color-gray-400 hover:text-color-primary text-color-green rounded-lg h-10 md:w-32 w-40"
						onClick={() => router.push("/categories")}
					>
						Close
					</button>
				</div>
				{error && <div className="text-color-red mb-4">{error}</div>}
			</form>
		</div>
	);
};

export default CategoryCreatePage;
