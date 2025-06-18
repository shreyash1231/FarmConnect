import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewProducts = () => {
    const [crops, setCrops] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userType = localStorage.getItem('userType');

        if (!token || userType !== 'customer') {
            alert('Unauthorized. Please login as a customer.');
            navigate('/login'); // or whatever your login route is
            return;
        }

        const fetchCrops = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/crops', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error('Failed to fetch crops');
                const data = await response.json();
                setCrops(data);
            } catch (err) {
                console.error(err);
                alert('Error loading crops');
            }
        };

        fetchCrops();
    }, [navigate]);

    const handleBuy = (price, upiId) => {
        const paymentUrl = `http://localhost:8081/index.html?pa=${encodeURIComponent(
            upiId
        )}&pn=&cu=INR&am=${encodeURIComponent(price)}`;
        navigate(paymentUrl);
    };

    const redirectToConsumer = () => {
        navigate('/consumer_dashboard');
    };

    return (
        <div className="min-h-screen bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('/1.jpg')" }}>
            <nav className="w-full fixed top-0 left-0 bg-white/90 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-md z-50">
                <span className="text-green-700 font-semibold text-lg">👋 Welcome, Customer!</span>
                <button
                    onClick={redirectToConsumer}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-semibold transition-all"
                >
                    Back
                </button>
            </nav>

            <div className="pt-24 pb-10 px-4 max-w-4xl mx-auto">
                <div className="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">Available Crops</h2>
                    <div className="space-y-6">
                        {crops.map((crop) => (
                            <div
                                key={crop.id}
                                className="bg-white border border-gray-200 p-4 rounded-lg shadow hover:bg-green-50 hover:shadow-lg transition-all relative"
                            >
                                <h3 className="text-lg font-semibold text-green-700">{crop.cropName}</h3>
                                <p><strong>Type:</strong> {crop.cropType}</p>
                                <p><strong>Min QTY:</strong> {crop.minQty} quintals</p>
                                <p><strong>Price:</strong> ₹{crop.farmersPrice}</p>
                                <p><strong>Farmer:</strong> {crop.farmer.name}</p>
                                <img
                                    src={`http://localhost:8080/api/crop-image/${crop.id}`}
                                    alt={crop.cropName}
                                    onError={(e) => (e.target.src = '/fallback.jpg')}
                                    className="absolute top-4 right-4 w-28 h-20 object-cover rounded-md hidden sm:block"
                                />
                                <button
                                    onClick={() => handleBuy(crop.farmersPrice, crop.farmer.upiId)}
                                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md font-medium hover:bg-green-700 transition-all"
                                >
                                    Buy
                                </button>
                            </div>
                        ))}

                        {crops.length === 0 && (
                            <p className="text-center text-gray-500">No crops available right now.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewProducts;
