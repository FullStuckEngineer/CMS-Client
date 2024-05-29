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

// Register the necessary Chart.js components
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
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch dashboard data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const ordersByStatusData = {
        labels: data.ordersByStatus.map(status => status.status),
        datasets: [
            {
                label: 'Orders by Status',
                data: data.ordersByStatus.map(status => status._count.status),
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
        labels: data.topSellingProducts.map(product => product.name),
        datasets: [
            {
                label: 'Top 5 Selling Products',
                data: data.topSellingProducts.map(product => product.quantity),
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold">Total Users</h2>
                    <p className="text-2xl">{data.totalUsers}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold">Total Products</h2>
                    <p className="text-2xl">{data.totalProducts}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold">Total Orders</h2>
                    <p className="text-2xl">{data.totalOrders}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold">Total Revenue</h2>
                    <p className="text-2xl">Rp{data.totalRevenue}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 col-span-2">
                    <h2 className="text-xl font-semibold">Orders by Status</h2>
                    <Doughnut data={ordersByStatusData} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-6 col-span-2">
                    <h2 className="text-xl font-semibold">Top 5 Selling Products</h2>
                    <Bar data={topSellingProductsData} />
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold">Total Cities</h2>
                    <p className="text-2xl">{data.totalCities}</p>
                </div>
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-xl font-semibold">Total Stores</h2>
                    <p className="text-2xl">{data.totalStores}</p>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
