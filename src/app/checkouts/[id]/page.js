"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter, useParams } from 'next/navigation';
import { AuthContext } from "@/app/layout";
import axios from 'axios';
import Select from 'react-select';
import Image from "next/image";
import receiptPlaceholder from "@/assets/images/receipt-placeholder.jpg";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);

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
        setButtonLoading(true);
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
            
            await sendEmailNotification(userEmail, transactionDetails, 'Transaction Approved');
            setStatus('processing');
            toast.success("Payment accepted successfully!");
        } catch (error) {
            setError(error.message || "Error accepting payment");
            toast.error("Error accepting payment");
        } finally {
            setButtonLoading(false);
        }
    };

    const rejectPayment = async () => {
        setButtonLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/checkouts/${checkout.id}`, { status: 'cancelled' }, {
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
            
            await sendEmailNotification(userEmail, transactionDetails, 'Payment Rejected');
            setStatus('cancelled');
            toast.success("Payment rejected successfully!");
        } catch (error) {
            setError(error.message || "Error rejecting payment");
            toast.error("Error rejecting payment");
        } finally {
            setButtonLoading(false);
        }
    };

    const sendEmailNotification = async (email, transactionDetails, subject) => {
        try {
            const token = sessionStorage.getItem("token");
            const { id, total_cost, payment_method, shipping_method } = transactionDetails;

            let emailBody = '';
            if (subject === 'Transaction Approved') {
                emailBody = `
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
            } else if (subject === 'Payment Rejected') {
                emailBody = `
                    <div style="font-family: Arial, sans-serif; color: #000;">
                        <p>Dear Customer,</p>
                        <p>We regret to inform you that your payment has been rejected by our admin team. Here are the details of your transaction:</p>
                        <ul>
                            <li><strong>Transaction ID:</strong> ${id}</li>
                            <li><strong>Total Amount:</strong> ${total_cost}</li>
                            <li><strong>Payment Method:</strong> ${payment_method}</li>
                            <li><strong>Shipping Method:</strong> ${shipping_method}</li>
                        </ul>
                        <p>The transaction has been canceled and you will not be charged for this order.</p>
                        <p>If you have any questions or need further assistance, please feel free to contact our customer support team.</p>
                        <p>Thank you for shopping with us!</p>
                        <p>Best regards,<br/>The Company Team</p>
                    </div>
                `;
            } else if (subject === 'Order Shipped') {
                emailBody = `
                    <div style="font-family: Arial, sans-serif; color: #000;">
                        <p>Dear Customer,</p>
                        <p>We are pleased to inform you that your order has been shipped. Here are the details of your transaction:</p>
                        <ul>
                            <li><strong>Transaction ID:</strong> ${id}</li>
                            <li><strong>Total Amount:</strong> ${total_cost}</li>
                            <li><strong>Payment Method:</strong> ${payment_method}</li>
                            <li><strong>Shipping Method:</strong> ${shipping_method}</li>
                        </ul>
                        <p>Your order is now on its way to you and you can track the delivery status using the tracking number provided by the courier.</p>
                        <p>If you have any questions or need further assistance, please feel free to contact our customer support team.</p>
                        <p>Thank you for shopping with us!</p>
                        <p>Best regards,<br/>The Company Team</p>
                    </div>
                `;
            } else if (subject === 'Order Delivered') {
                emailBody = `
                    <div style="font-family: Arial, sans-serif; color: #000;">
                        <p>Dear Customer,</p>
                        <p>We are pleased to inform you that your order has been successfully delivered. Here are the details of your transaction:</p>
                        <ul>
                            <li><strong>Transaction ID:</strong> ${id}</li>
                            <li><strong>Total Amount:</strong> ${total_cost}</li>
                            <li><strong>Payment Method:</strong> ${payment_method}</li>
                            <li><strong>Shipping Method:</strong> ${shipping_method}</li>
                        </ul>
                        <p>Your order has been received and we hope you are satisfied with your purchase. If you have any questions or need further assistance, please feel free to contact our customer support team.</p>
                        <p>Thank you for shopping with us!</p>
                        <p>Best regards,<br/>The Company Team</p>
                    </div>
                `;
            } else if (subject === 'Order Completed') {
                emailBody = `
                    <div style="font-family: Arial, sans-serif; color: #000;">
                        <p>Dear Customer,</p>
                        <p>We are pleased to inform you that your order has been successfully completed. Here are the details of your transaction:</p>
                        <ul>
                            <li><strong>Transaction ID:</strong> ${id}</li>
                            <li><strong>Total Amount:</strong> ${total_cost}</li>
                            <li><strong>Payment Method:</strong> ${payment_method}</li>
                            <li><strong>Shipping Method:</strong> ${shipping_method}</li>
                        </ul>
                        <p>Your order has been completed and we hope you are satisfied with your purchase. If you have any questions or need further assistance, please feel free to contact our customer support team.</p>
                        <p>Thank you for shopping with us!</p>  
                        <p>Best regards,<br/>The Company Team</p>
                    </div>
                `;
            }
    
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/checkouts/email-notif`, {
                to: email,
                subject: subject,
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

    const advanceStatus = async () => {
        setButtonLoading(true);
        const statusOrder = [
            'waiting_payment',
            'payment_verified',
            'processing',
            'shipping',
            'delivered',
            'completed'
        ];
        const currentIndex = statusOrder.indexOf(status);
        if (currentIndex < statusOrder.length - 1) {
            const nextStatus = statusOrder[currentIndex + 1];
            try {
                const token = sessionStorage.getItem("token");
                await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL_API}/cms/checkouts/${checkout.id}`, { status: nextStatus }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                let emailSubject = '';
                if (nextStatus === 'processing') {
                    emailSubject = 'Transaction Approved';
                } else if (nextStatus === 'shipping') {
                    emailSubject = 'Order Shipped';
                } else if (nextStatus === 'delivered') {
                    emailSubject = 'Order Delivered';
                } else if (nextStatus === 'completed') {
                    emailSubject = 'Order Completed';
                }

                const transactionDetails = {
                    id: checkout.id,
                    total_cost: checkout.net_price,
                    payment_method: checkout.payment_method,
                    shipping_method: checkout.shipping_method
                };
                await sendEmailNotification(userEmail, transactionDetails, emailSubject);

                setStatus(nextStatus);
                toast.success("Status advanced successfully!");
            } catch (error) {
                console.error("Error advancing status:", error.message || error);
                toast.error("Error advancing status");
            } finally {
                setButtonLoading(false);
            }
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
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
        <div className="relative p-4 pt-24 justify-center w-full h-screen">
            <h1 className="text-2xl font-bold mb-4 justify-center flex">Transaction Details</h1>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">ID</label>
                    <input
                        type="text"
                        value={checkout.id}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">User</label>
                    <input
                        type="text"
                        value={`${checkout.user_id}: ${checkout.user.username}`}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Address ID</label>
                    <input
                        type="text"
                        value={checkout.address_id}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Courier</label>
                    <input
                        type="text"
                        value={`${checkout.courier_id}: ${checkout.courier.name}`}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Shipping Method</label>
                    <input
                        type="text"
                        value={checkout.shipping_method}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Shipping Note</label>
                    <input
                        type="text"
                        value={checkout.shipping_note}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Total Weight</label>
                    <input
                        type="text"
                        value={checkout.total_weight}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Total Cost</label>
                    <input
                        type="text"
                        value={checkout.total_cost}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Shipping Cost</label>
                    <input
                        type="text"
                        value={checkout.shipping_cost}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Net Price</label>
                    <input
                        type="text"
                        value={checkout.net_price}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Payment Method</label>
                    <input
                        type="text"
                        value={checkout.payment_method}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Bank</label>
                    <input
                        type="text"
                        value={checkout.bank}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Payment Receipt</label>
                    {checkout.payment_receipt ? (
                        <div className="flex items-center">
                            <Image
                                src={image}
                                alt="Payment Receipt"
                                className="w-32 h-32 object-cover cursor-pointer"
                                width={128}
                                height={128}
                                onClick={openModal}
                            />
                            {status === 'payment_verified' && payment_method === 'manual' && (
                                <div className="flex flex-col space-y-5">
                                    <button
                                        type="button"
                                        className={`bg-color-green hover:bg-color-greenhover text-color-primary rounded-lg h-10 ml-4 px-4 ${buttonLoading ? "cursor-not-allowed" : ""}`}
                                        onClick={acceptPayment}
                                        disabled={buttonLoading}
                                    >
                                        {buttonLoading ? "Loading..." : "Accept"}
                                    </button>
                                    <button
                                        type="button"
                                        className={`bg-color-red hover:bg-color-redhover text-color-primary rounded-lg h-10 ml-4 px-4 ${buttonLoading ? "cursor-not-allowed" : ""}`}
                                        onClick={rejectPayment}
                                        disabled={buttonLoading}
                                    >
                                        {buttonLoading ? "Loading..." : "Reject"}
                                    </button>
                                </div>
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
                    <div className="flex items-center space-x-2 justify-center">
                        {statusOptions.map((option, index) => (
                            <div key={option.value} className="flex items-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                        status === option.value 
                                            ? 'bg-color-darkgreen text-color-primary' 
                                            : statusOptions.findIndex(opt => opt.value === status) > index 
                                                ? 'bg-color-green text-color-primary' 
                                                : 'bg-color-gray-200 text-gray-600'
                                    }`}
                                >
                                    {option.label}
                                </span>
                                {index < statusOptions.length - 1 && (
                                    <div className="flex-1 text-color-gray-400 mx-2"> -- </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        type="button"
                        className={`border rounded-lg h-8 mt-4 md:w-32 w-40 items-center justify-center flex mx-auto ${
                            status === 'completed' || status === 'cancelled' || (status === 'payment_verified' && payment_method === 'manual') 
                                ? 'border-color-gray-300 bg-color-gray-300 text-gray-600 cursor-not-allowed text-color-primary' 
                                : 'border-color-green bg-color-green hover:bg-color-greenhover hover:text-color-primary text-color-primary'
                        } ${buttonLoading ? "cursor-not-allowed" : ""}`}
                        onClick={advanceStatus}
                        disabled={status === 'completed' || status === 'cancelled' || (status === 'payment_verified' && payment_method === 'manual') || buttonLoading}
                    >
                        {buttonLoading ? "Loading..." : "Next Status"}
                    </button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Midtrans Data</label>
                    <textarea
                        value={JSON.stringify(checkout.midtrans_data, null, 2)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                        rows="4"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Created At</label>
                    <input
                        type="text"
                        value={formatDate(checkout.created_at)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-color-gray-700">Updated At</label>
                    <input
                        type="text"
                        value={formatDate(checkout.update_at)}
                        readOnly
                        className="mt-1 block w-full border border-color-gray-200 rounded-md shadow-sm p-2 bg-color-darkgray text-color-primary"
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
                    className="border border-green hover:bg-color-gray-400 hover:text-color-primary text-color-green rounded-lg h-10 md:w-32 w-40"
                    onClick={() => router.push('/checkouts')}
                >
                    Close
                </button>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Payment Receipt"
                className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center"
                overlayClassName="fixed inset-0 bg-color-dark bg-opacity-50"
            >
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-lg w-full bg-color-primary">
                    <h2 className="text-2xl font-bold mb-4">Payment Receipt</h2>
                    <Image
                        src={image}
                        alt="Payment Receipt"
                        className="w-full h-auto"
                        width={500}
                        height={500}
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="bg-color-red hover:bg-color-redhover text-color-primary rounded-lg h-10 px-4 ml-2"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            <ToastContainer />
        </div>
    );
};

export default CheckoutDetailPage;