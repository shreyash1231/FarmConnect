import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogout from '../hooks/useLogout'; 

const ConsumerDashboard = () => {
    const navigate = useNavigate();
    const {logout} = useLogout();

    useEffect(() => {
        const user = localStorage.getItem("loggedInUser");
        if (user) {
            document.getElementById("user-name").textContent = `Logged in as: ${user}`;
        }
    }, []);

    const handleClick = (url) => {
        navigate(url);
    };

    // const logout = () => {
    //     localStorage.removeItem('token');
    //     localStorage.removeItem('userType');
    //     localStorage.removeItem('farmerId');
    //     localStorage.removeItem('loggedInUser');
    //     localStorage.removeItem("chat-user");
    //     navigate('/');
    // };

    return (
        <div className="min-h-screen bg-cover bg-center pt-24 px-4 flex flex-col items-center text-gray-800" style={{ backgroundImage: "url('/1.jpg')" }}>
            <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md shadow-md z-50 px-8 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-green-800">Consumer Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span id="user-name" className="text-sm text-gray-700">Logged in as: Consumer</span>
                    <button
                        onClick={logout}
                        className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="w-full max-w-xl bg-white/90 backdrop-blur-lg p-8 mt-8 rounded-2xl shadow-lg">
                <div className="text-xl font-semibold text-center text-teal-700 mb-6">
                    Welcome, Consumer! What would you like to do today?
                </div>

                <div className="flex flex-col gap-6">
                    <div
                        onClick={() => handleClick('/view-products')}
                        className="cursor-pointer bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:bg-green-50 transition"
                    >
                        <div className="text-lg font-semibold text-green-800 mb-1">View Products</div>
                        <p className="text-sm text-gray-600">
                            Browse fresh crops directly from farmers and make purchases.
                        </p>
                    </div>

                    <div
                        onClick={() => handleClick('/view-rentals')}
                        className="cursor-pointer bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:bg-green-50 transition"
                    >
                        <div className="text-lg font-semibold text-green-800 mb-1">View Rental Instruments</div>
                        <p className="text-sm text-gray-600">
                            Rent agricultural tools and equipment from nearby farmers.
                        </p>
                    </div>

                    <div
                        onClick={() => handleClick('/view-cart')}
                        className="cursor-pointer bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:bg-green-50 transition"
                    >
                        <div className="text-lg font-semibold text-green-800 mb-1">View Cart</div>
                        <p className="text-sm text-gray-600">
                            See your selected items and proceed to checkout.
                        </p>
                    </div>

                    <a
                        href="/ChatApp"
                        rel="noopener noreferrer"
                        className="no-underline text-inherit"
                    >
                        <div className="cursor-pointer bg-white p-6 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:bg-green-50 transition">
                            <div className="text-lg font-semibold text-green-800 mb-1">Chat With Farmer</div>
                            <p className="text-sm text-gray-600">
                                Get assistance via chatbot for your questions and queries.
                            </p>
                        </div>
                    </a>
                </div>
            </main>
        </div>
    );
};

export default ConsumerDashboard;