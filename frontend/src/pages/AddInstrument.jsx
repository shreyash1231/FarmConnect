import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddInstrument = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        instrumentName: '',
        description: '',
        rentPricePerDay: '',
        availableFrom: '',
        availableTo: '',
        instrumentImage: null,
    });

    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const farmerId = localStorage.getItem('farmerId');

    useEffect(() => {
        if (!token || userType !== 'farmer' || !farmerId) {
            alert('Unauthorized access. Please login as a farmer.');
            navigate('/');
        }
    }, [navigate, token, userType, farmerId]);

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
            instrumentName,
            description,
            rentPricePerDay,
            availableFrom,
            availableTo,
            instrumentImage,
        } = formData;

        if (
            !instrumentName ||
            !description ||
            !rentPricePerDay ||
            !availableFrom ||
            !availableTo ||
            !instrumentImage
        ) {
            alert('Please fill in all fields.');
            return;
        }

        const data = new FormData();
        data.append('farmerId', farmerId);
        data.append('instrumentName', instrumentName);
        data.append('description', description);
        data.append('rentPricePerDay', rentPricePerDay);
        data.append('availableFrom', availableFrom);
        data.append('availableTo', availableTo);
        data.append('instrumentImage', instrumentImage);

        try {
            const response = await fetch('http://localhost:8080/api/farmer/add-instrument', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) throw new Error('Failed to add instrument');
            alert('Instrument added successfully!');
            setFormData({
                instrumentName: '',
                description: '',
                rentPricePerDay: '',
                availableFrom: '',
                availableTo: '',
                instrumentImage: null,
            });
        } catch (error) {
            console.error('Error adding instrument:', error);
            alert('Failed to add instrument. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-cover bg-center p-6" style={{ backgroundImage: "url('/1.jpg')" }}>
            <form
                onSubmit={handleSubmit}
                className="bg-white/90 backdrop-blur p-8 rounded-2xl shadow-lg max-w-lg w-full"
            >
                <h2 className="text-2xl font-semibold text-green-700 text-center mb-6">Add Instrument Details</h2>

                <input
                    type="text"
                    name="instrumentName"
                    value={formData.instrumentName}
                    onChange={handleChange}
                    placeholder="Instrument Name"
                    className="w-full mb-4 p-2 border rounded"
                    required
                />

                <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description"
                    className="w-full mb-4 p-2 border rounded"
                    required
                />

                <input
                    type="number"
                    name="rentPricePerDay"
                    value={formData.rentPricePerDay}
                    onChange={handleChange}
                    placeholder="Rent Price Per Day"
                    className="w-full mb-4 p-2 border rounded"
                    required
                />

                <label className="block mb-1 text-sm font-medium">Available From:</label>
                <input
                    type="date"
                    name="availableFrom"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded"
                    required
                />

                <label className="block mb-1 text-sm font-medium">Available To:</label>
                <input
                    type="date"
                    name="availableTo"
                    value={formData.availableTo}
                    onChange={handleChange}
                    className="w-full mb-4 p-2 border rounded"
                    required
                />

                <label className="block mb-2">Upload Instrument Image:</label>
                <input
                    type="file"
                    name="instrumentImage"
                    onChange={handleChange}
                    accept="image/*"
                    className="w-full mb-6"
                    required
                />

                <div className="flex justify-between">
                    <button type="submit" className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded">Add Instrument</button>
                    <button type="button" onClick={() => navigate('/farmer-dashboard')} className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded">Back</button>
                </div>
            </form>
        </div>
    );
};

export default AddInstrument;
