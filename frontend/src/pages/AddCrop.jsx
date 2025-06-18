import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCrop = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        cropName: '',
        cropType: '',
        harvestDate: '',
        minMsp: '',
        maxMsp: '',
        minQty: '',
        farmersPrice: '',
        cropImage: null,
    });

    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const farmerId = localStorage.getItem('farmerId');

    useEffect(() => {
        if (!token || userType !== 'farmer' || !farmerId) {
            alert('Unauthorized access. Please login as a farmer.');
            navigate('/');
        }
    }, [navigate]);

    // Fetch predicted prices
    useEffect(() => {
        const fetchMarketPrediction = async () => {
            if (!formData.cropName || !formData.harvestDate) return;

            try {
                const res = await fetch(`http://127.0.0.1:5000/predict?commodity=${formData.cropName}&date=${formData.harvestDate}`);
                const data = await res.json();

                if (data && data.predictions) {
                    setFormData(prev => ({
                        ...prev,
                        minMsp: data.predictions.minimum_price.toFixed(2),
                        maxMsp: data.predictions.maximum_price.toFixed(2),
                    }));
                } else {
                    console.error("Invalid prediction response:", data);
                    alert("Could not fetch market prediction.");
                }
            } catch (error) {
                console.error("Prediction fetch error:", error);
                alert("Prediction API failed.");
            }
        };

        fetchMarketPrediction();
    }, [formData.cropName, formData.harvestDate]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const {
            cropName, cropType, harvestDate, minMsp, maxMsp,
            minQty, farmersPrice, cropImage
        } = formData;

        // Basic validation
        if (
            !cropName || !cropType || !harvestDate || !minMsp || !maxMsp ||
            !minQty || !farmersPrice || !cropImage
        ) {
            alert("Please fill in all fields before submitting.");
            return;
        }

        const data = new FormData();
        data.append('farmerId', farmerId);
        data.append('cropName', cropName);
        data.append('cropType', cropType);
        data.append('minMsp', minMsp);
        data.append('maxMsp', maxMsp);
        data.append('minQty', minQty);
        data.append('farmersPrice', farmersPrice);
        data.append('harvestDate', harvestDate);
        data.append('cropImage', cropImage);

        try {
            const res = await fetch('http://localhost:8080/api/farmer/add-crop', {
                method: 'POST',
                // headers: { Authorization: `Bearer ${token}` }, // if your backend uses token
                body: data,
            });

            if (!res.ok) throw new Error("Failed to add crop");

            alert("Crop added successfully!");
            setFormData({
                cropName: '',
                cropType: '',
                harvestDate: '',
                minMsp: '',
                maxMsp: '',
                minQty: '',
                farmersPrice: '',
                cropImage: null,
            });
        } catch (err) {
            console.error("Error:", err);
            alert("Failed to add crop. Try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-6" style={{ backgroundImage: "url('/1.jpg')" }}>
            <form
                onSubmit={handleSubmit}
                className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-lg max-w-lg w-full"
            >
                <h2 className="text-2xl font-semibold text-green-700 text-center mb-6">Add Crop Details</h2>

                <label className="block mb-2">Crop Name:</label>
                <select name="cropName" value={formData.cropName} onChange={handleChange} className="w-full mb-4 p-2 border rounded" required>
                    <option value="" disabled>Select a crop</option>
                    {["apple", "bajra", "banana", "cotton", "grapes", "groundnut", "guava", "jower", "mango", "orange", "pom", "rice", "soyabean", "sunflower", "wheat"].map((crop) => (
                        <option key={crop} value={crop}>{crop[0].toUpperCase() + crop.slice(1)}</option>
                    ))}
                </select>

                <label className="block mb-2">Harvest Date:</label>
                <input type="date" name="harvestDate" value={formData.harvestDate} onChange={handleChange} className="w-full mb-4 p-2 border rounded" required />

                <label className="block mb-2">Crop Type:</label>
                <select name="cropType" value={formData.cropType} onChange={handleChange} className="w-full mb-4 p-2 border rounded" required>
                    <option value="" disabled>Select crop type</option>
                    <option value="cereal">Cereal Crop</option>
                    <option value="pulse">Pulse / Legume</option>
                    <option value="oilseed">Oilseed Crop</option>
                    <option value="fruit">Fruit Crop</option>
                    <option value="cash">Cash / Commercial Crop</option>
                </select>

                <input type="number" name="minMsp" value={formData.minMsp} onChange={handleChange} placeholder="Minimum Selling Price" className="w-full mb-4 p-2 border rounded" required />
                <input type="number" name="maxMsp" value={formData.maxMsp} onChange={handleChange} placeholder="Maximum Selling Price" className="w-full mb-4 p-2 border rounded" required />
                <input type="number" name="minQty" value={formData.minQty} onChange={handleChange} placeholder="Minimum Quantity (quintals)" className="w-full mb-4 p-2 border rounded" required />
                <input type="number" name="farmersPrice" value={formData.farmersPrice} onChange={handleChange} placeholder="Farmer's Price" className="w-full mb-4 p-2 border rounded" required />

                <label className="block mb-2">Upload Crop Image:</label>
                <input type="file" name="cropImage" onChange={handleChange} accept="image/*" className="w-full mb-6" required />

                <div className="flex justify-between">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Add Crop</button>
                    <button type="button" onClick={() => navigate('/FarmerDashboard')} className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded">Back</button>
                </div>
            </form>
        </div>
    );
};

export default AddCrop;
