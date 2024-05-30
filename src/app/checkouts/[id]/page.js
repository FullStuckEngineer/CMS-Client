"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from "@/app/layout";
import axios from 'axios';
import Select from 'react-select';
import Image from "next/image";
import receiptPlaceholder from "@/assets/images/receipt-placeholder.jpg";

const CheckoutDetailPage = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const router = useRouter();
    const { id } = useParams();

    const [checkout, setCheckout] = useState(null);
    const [checkoutProducts, setCheckoutProducts] = useState([]);
    const [status, setStatus] = useState('');
    const [payment_method, setPaymentMethod] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);
    const [userEmail, setUserEmail] = useState('');

    const statusOptions = [
        { value: 'waiting_payment', label: 'Waiting Payment' },
        { value: 'payment_verified', label: 'Payment Verified' },
        { value: 'processing', label: 'Processing' },
        { value: 'shipping', label: 'Shipping' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    useEffect(() => {
        if (!isLoggedIn) {
            router.push("/auth/login");
        }
    }, [isLoggedIn, router]);

    useEffect(() => {
        if (id) {
            fetchCheckoutData(id);
        }
    }, [id]);

    const fetchCheckoutData = async (id) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/checkouts/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const checkoutData = response.data.data;
            const userData = await fetchUserData(checkoutData.user_id);
            const username = userData.name;
            setUserEmail(userData.email);
            const courierName = await fetchCourierName(checkoutData.courier_id);
    
            const checkoutProducts = checkoutData.checkout_products;
            const productsWithNames = checkoutProducts.map((checkoutProduct) => {
                const productName = checkoutProduct.product.name;
                return { ...checkoutProduct, product: { name: productName } };
            });
    
            console.log(productsWithNames);
            setCheckoutProducts(productsWithNames);
    
            setCheckout({ ...checkoutData, user: { username }, courier: { name: courierName } });
            setStatus(checkoutData.status);
            setPaymentMethod(checkoutData.payment_method.toLowerCase());
            setLoading(false);
    
            if (checkoutData.payment_receipt) {
                fetchImage(checkoutData.payment_receipt);
            }
        } catch (error) {
            setError(error.message || "Error fetching checkout data");
            setLoading(false);
        }
    };    

    const fetchUserData = async (userId) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/users/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching user name:", error.message || error);
        }
    };

    const fetchCourierName = async (courierId) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/couriers/${courierId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data.data.name;
        } catch (error) {
            console.error("Error fetching courier name:", error.message || error);
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

    const acceptPayment = async () => {
        try {
            const token = sessionStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/checkouts/${checkout.id}`, { status: 'processing' }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            const transactionDetails = {
                id: checkout.id,
                total_cost: checkout.net_price,
                payment_method: checkout.payment_method,
                shipping_method: checkout.shipping_method
            };
            
            await sendEmailNotification(userEmail, transactionDetails);
            setStatus('processing');
        } catch (error) {
            setError(error.message || "Error accepting payment");
        }
    };
    
    
    const sendEmailNotification = async (email, transactionDetails) => {
        try {
            const token = sessionStorage.getItem("token");
            const { id, total_cost, payment_method, shipping_method } = transactionDetails;
    
            const emailBody = `
                <div style="font-family: Arial, sans-serif; color: #000;">
                    <p>Dear Customer,</p>
                    <p>We are pleased to inform you that your transaction has been successfully approved by our admin team. Here are the details of your transaction:</p>
                    <ul>
                        <li><strong>Transaction ID:</strong> ${id}</li>
                        <li><strong>Total Amount:</strong> ${total_cost}</li>
                        <li><strong>Payment Method:</strong> ${payment_method}</li>
                        <li><strong>Shipping Method:</strong> ${shipping_method}</li>
                    </ul>
                    <p>We are now processing your order and will notify you once it has been shipped.</p>
                    <p>If you have any questions or need further assistance, please feel free to contact our customer support team.</p>
                    <p>Thank you for shopping with us!</p>
                    <p>Best regards,<br/>The Company Team</p>
                </div>
            `;
    
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/checkouts/email-notif`, {
                to: email,
                subject: 'Transaction Approved',
                html: emailBody
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error("Error sending email notification:", error.message || error);
        }
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
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Transaction Details</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">ID</label>
                    <input
                        type="text"
                        value={checkout.id}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">User</label>
                    <input
                        type="text"
                        value={`${checkout.user_id}: ${checkout.user.username}`}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Address ID</label>
                    <input
                        type="text"
                        value={checkout.address_id}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Courier</label>
                    <input
                        type="text"
                        value={`${checkout.courier_id}: ${checkout.courier.name}`}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Shipping Method</label>
                    <input
                        type="text"
                        value={checkout.shipping_method}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Shipping Note</label>
                    <input
                        type="text"
                        value={checkout.shipping_note}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Total Weight</label>
                    <input
                        type="text"
                        value={checkout.total_weight}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Total Cost</label>
                    <input
                        type="text"
                        value={checkout.total_cost}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Shipping Cost</label>
                    <input
                        type="text"
                        value={checkout.shipping_cost}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Net Price</label>
                    <input
                        type="text"
                        value={checkout.net_price}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Payment Method</label>
                    <input
                        type="text"
                        value={checkout.payment_method}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Bank</label>
                    <input
                        type="text"
                        value={checkout.bank}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Payment Receipt</label>
                    {checkout.payment_receipt ? (
                        <div className="flex items-center">
                            <Image
                                src={image}
                                alt="Payment Receipt"
                                className="w-32 h-32 object-cover"
                                width={128}
                                height={128}
                            />
                            {status === 'payment_verified' && payment_method === 'manual' && (
                                <button
                                    type="button"
                                    className="bg-green hover:bg-greenhover text-color-primary rounded-lg h-10 ml-4 px-4"
                                    onClick={acceptPayment}
                                >
                                    Accept
                                </button>
                            )}
                        </div>
                    ) : (
                        <Image
                            src={receiptPlaceholder}
                            alt="Placeholder"
                            className="w-32 h-32 object-cover"
                            width={128}
                            height={128}
                        />
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Status</label>
                    <Select
                        value={statusOptions.find(option => option.value === status)}
                        onChange={(selected) => setStatus(selected.value)}
                        options={statusOptions}
                        className="mt-1 block w-full"
                        placeholder="Select Status"
                        isSearchable
                        isDisabled={true}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Midtrans Data</label>
                    <textarea
                        value={JSON.stringify(checkout.midtrans_data, null, 2)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                        rows="4"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Created At</label>
                    <input
                        type="text"
                        value={formatDate(checkout.created_at)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Updated At</label>
                    <input
                        type="text"
                        value={formatDate(checkout.update_at)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgreen text-color-primary"
                    />
                </div>
            </form>
            <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Checkout Products</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full w-full">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">ID</th>
                                <th className="px-4 py-2 border-b">Product ID</th>
                                <th className="px-4 py-2 border-b">Product Name</th>
                                <th className="px-4 py-2 border-b">Quantity</th>
                                <th className="px-4 py-2 border-b">Price</th>
                                <th className="px-4 py-2 border-b">Created At</th>
                                <th className="px-4 py-2 border-b">Updated At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {checkoutProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-color-gray-200">
                                    <td className="px-4 py-2 w-32 overflow-hidden whitespace-nowrap truncate text-center">{product.id}</td>
                                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{product.product_id}</td>
                                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{product.product.name}</td>
                                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{product.quantity}</td>
                                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{product.price}</td>
                                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{formatDate(product.created_at)}</td>
                                    <td className="px-4 py-2 w-100 overflow-hidden whitespace-nowrap truncate text-center">{formatDate(product.update_at)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-center mt-10">
                <button
                    type="button"
                    className="border border-green hover:bg-color-gray-400 hover:text-color-primary text-green rounded-lg h-10 md:w-32 w-40"
                    onClick={() => router.push('/checkouts')}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default CheckoutDetailPage;