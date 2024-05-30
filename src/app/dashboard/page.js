"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { AuthContext } from "@/app/layout";
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from 'chart.js';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

const DashboardPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();
    const [isNoOrders, setIsNoOrders] = useState(false);
    const [isNoProducts, setIsNoProducts] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = sessionStorage.getItem("token");
                const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/dashboard`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setData(response.data);
                if (response.data.ordersByStatus.length === 0) setIsNoOrders(true);
                if (response.data.topSellingProducts.length === 0) setIsNoProducts(true);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch dashboard data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="flex justify-center items-center h-screen">{error}</div>;

    const ordersByStatusData = {
        labels: isNoOrders ? ["No Orders Yet"] : data.ordersByStatus.map(status => status.status),
        datasets: [
            {
                label: 'Orders by Status',
                data: isNoOrders ? [0] : data.ordersByStatus.map(status => status._count.status),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(199, 199, 199, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(199, 199, 199, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const topSellingProductsData = {
        labels: isNoProducts ? ["No Products Sold Yet"] : data.topSellingProducts.map(product => product.name),
        datasets: [
            {
                label: 'Top 5 Selling Products',
                data: isNoProducts ? [0] : data.topSellingProducts.map(product => product.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="relative p-4 pt-24 justify-center w-full h-screen">
            <h1 className="text-3xl font-bold text-color-gray-800 mb-2 text-left">Dashboard</h1>
            <div className="flex flex-col items-center">
                <div className="grid grid-cols-1 gap-6 w-full max-w-6xl">
                    <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center justify-center h-full">
                        <h2 className="text-2xl font-semibold text-color-gray-800 text-center mb-4">Total Products</h2>
                        <div className="flex justify-between w-full">
                            <div className="flex flex-col items-center w-1/2">
                                <h4 className="text-lg font-medium text-color-gray-700 text-center">Active</h4>
                                <p className="text-3xl font-bold text-color-green text-center">{data.totalProducts.active || "-"}</p>
                            </div>
                            <div className="flex flex-col items-center w-1/2">
                                <h4 className="text-lg font-medium text-color-gray-700 text-center">Inactive</h4>
                                <p className="text-3xl font-bold text-color-red text-center">{data.totalProducts.inactive || "-"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mt-6" style={{ gridTemplateColumns: '1fr 1.7fr' }}>
                    <div className="grid grid-rows-3 gap-6 w-full">
                        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center justify-center h-full">
                            <h2 className="text-xl font-semibold text-color-gray-800 text-center">Total Users</h2>
                            <p className="text-3xl font-bold text-color-gray-800 text-center">{data.totalUsers || "-"}</p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center justify-center h-full">
                            <h2 className="text-xl font-semibold text-color-gray-800 text-center">Total Orders</h2>
                            <p className="text-3xl font-bold text-color-gray-800  text-center">{data.totalOrders || "-"}</p>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center justify-center h-full">
                            <h2 className="text-xl font-semibold text-color-gray-800 text-center">Total Revenue</h2>
                            <p className="text-3xl font-bold text-color-green text-center">{data.totalRevenue ? `Rp${data.totalRevenue}` : "-"}</p>
                        </div>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
                        <h2 className="text-xl font-semibold text-gray-800 text-center">Orders by Status</h2>
                        {isNoOrders ? (
                            <p className="text-lg font-semibold text-gray-800 text-center">No Orders Yet</p>
                        ) : (
                            <Doughnut data={ordersByStatusData} 
                                options={
                                    {
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                            },
                                        },
                                    }
                                } 
                            />
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mt-6 w-full max-w-6xl">
                    <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col items-center">
                        <h2 className="text-xl font-semibold text-color-gray-800 text-center">Top 5 Selling Products</h2>
                        {isNoProducts ? (
                            <p className="text-lg font-semibold text-color-gray-800 text-center">No Products Sold Yet</p>
                        ) : (
                            <Bar data={topSellingProductsData} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;