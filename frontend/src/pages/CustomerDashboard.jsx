import React, { useEffect, useState } from 'react';
import { useNavigation } from 'react-router-dom';

const CustomerDashboard = () => {
    const [crops, setCrops] = useState([]);
    const navigate = useNavigation()
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'customer') {
            alert('Unauthorized. Please login as a customer.');
            navigate('/')
        } else {
            fetchCrops(token);
        }
    }, []);

    const fetchCrops = async (token) => {
        try {
            const response = await fetch('http://localhost:8080/api/crops', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) throw new Error('Failed to fetch crops');
            const data = await response.json();
            setCrops(data);
        } catch (err) {
            console.error(err);
            alert('Failed to load crops.');
        }
    };

    const handleBuy = (price, upiId) => {
        const paymentUrl =
            `http://localhost:8081/index.html?` +
            `pa=${encodeURIComponent(upiId)}` +
            `&pn=&cu=INR` +
            `&am=${encodeURIComponent(price)}`;

        // window.location.href = paymentUrl;
        navigate(paymentUrl)
    };

    const handleBack = () => {
        // window.location.href = '/consumer_dashboard.html'; // or use ''
        navigate('/ConsumerDashboard')
    };

    return (
        <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('1.jpg')" }}>
            {/* Navbar */}
            <nav className="w-full fixed top-0 left-0 bg-white/80 backdrop-blur-lg shadow-md px-6 py-4 flex justify-between items-center z-50">
                <span className="text-green-700 font-semibold text-lg">👋 Welcome, Customer!</span>
                <button
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    onClick={handleBack}
                >
                    Back
                </button>
            </nav>

            {/* Content */}
            <div className="pt-24 px-4 max-w-5xl mx-auto">
                <div className="bg-white/90 backdrop-blur-lg rounded-xl p-6 shadow-xl">
                    <h2 className="text-2xl font-bold text-center text-green-800 mb-6">Available Crops</h2>

                    {crops.length === 0 ? (
                        <p className="text-center text-gray-600">No crops available.</p>
                    ) : (
                        <div className="space-y-6">
                            {crops.map((crop) => (
                                <div
                                    key={crop.id}
                                    className="relative bg-white p-5 rounded-lg shadow hover:bg-green-50 transition-all"
                                >
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                                        <div>
                                            <h3 className="text-xl font-semibold text-green-700">{crop.cropName}</h3>
                                            <p><strong>Type:</strong> {crop.cropType}</p>
                                            <p><strong>Min Qty:</strong> {crop.minQty} quintals</p>
                                            <p><strong>Price:</strong> ₹{crop.farmersPrice}</p>
                                            <p><strong>Farmer:</strong> {crop.farmer?.name || 'N/A'}</p>
                                        </div>
                                        <img
                                            src={`http://localhost:8080/api/crop-image/${crop.id}`}
                                            alt={crop.cropName}
                                            onError={(e) => { e.target.src = '/fallback.jpg'; }}
                                            className="w-32 h-20 object-cover rounded-lg mt-4 md:mt-0 md:ml-4"
                                        />
                                    </div>
                                    <button
                                        onClick={() => handleBuy(crop.farmersPrice, crop.farmer?.upiId)}
                                        className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                                    >
                                        Buy
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerDashboard;
