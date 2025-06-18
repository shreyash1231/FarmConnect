import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Added import
import useLogin from "../hooks/useLogin";
import useSignup from "../hooks/useSignup";



const FarmersMarketApp = () => {
    const navigate = useNavigate();
    const { login } = useLogin(); // Added navigation hook
    const [signupModalOpen, setSignupModalOpen] = useState(false);
    const [otpModalOpen, setOtpModalOpen] = useState(false);
    const [userType, setUserType] = useState('');
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [formData, setFormData] = useState({});
    const [userData, setUserData] = useState(null); // Added state for user data
   
    // Added function to open OTP modal
    const handleOpenOTP = () => {
        setOtpModalOpen(true);
    };

    const handleOpenSignup = (type) => {
        setUserType(type);
        setSignupModalOpen(true);
    };

    const handleCloseSignup = () => {
        setSignupModalOpen(false);
        setFormData({});
    };

    const handleCloseOTP = () => {
        setOtpModalOpen(false);
        setOtp('');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

   const handleSignup = async () => {
    if (!formData.password || formData.password.length <= 6) {
        alert('Password must be more than 6 characters');
        return;
    }

    const data = { ...formData, userType };

    try {
        // ✅ Step 1: Signup to main backend
        const res = await fetch('http://127.0.0.1:8080/api/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Signup failed on main backend');
        }

        // ✅ Step 2: Prepare chat backend payload
        const chatsignup = {
            fullName: formData.name,
            username: formData.username,
            password: formData.password,
            confirmPassword: formData.password,
            gender: formData.gender
        };

        // ✅ Step 3: Signup to chat backend
        const chatResponse = await fetch('http://localhost:8000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chatsignup)
        });

        if (!chatResponse.ok) {
            const errorData = await chatResponse.json();
            throw new Error(errorData.message || 'Signup failed on chat backend');
        }

        // ✅ Success - open OTP modal
        handleCloseSignup();
        handleOpenOTP();
        setUserData(data); // store user data for OTP

    } catch (err) {
        alert(err.message);
    }
};

    const handleVerifyOTP = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8080/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: userData.email, 
                    otp, 
                    userType: userData.userType 
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'OTP verification failed');
            }
            
            handleCloseOTP();
            alert('OTP verified! Please login.');
        } catch (error) {
            alert(error.message);
        }
    };

  const handleLogin = async () => {
  try {

    // // Step 2: Call the second API
    const loginData = { username: loginUsername, password: loginPassword };
    const response = await fetch("http://127.0.0.1:8080/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json();

    // Save details from second API
    localStorage.setItem("token", data.token);
    localStorage.setItem("userType", data.userType);
    localStorage.setItem("farmerId", data.farmerId);

    // Step 3: Navigate based on user type
    const userType = data.userType.toLowerCase();
    if (userType === "farmer") {
      navigate("/FarmerDashboard");
    } else if (userType === "customer") {
      navigate("/ConsumerDashboard");
    } else {
      throw new Error("Invalid user type");
    }
  } catch (err) {
    alert(err.message);
  }
};

    return (
        <div className="min-h-screen bg-cover bg-center bg-fixed flex flex-col">
            {/* Fixed Navbar */}
            <nav className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-sm shadow-lg z-50 px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-green-600">🌱 Farmers Market</div>
                    <ul className="flex gap-6">
                        <li><a href="/" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">Home</a></li>
                        <li><a href="/about" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">About</a></li>
                        <li><a href="/contact" className="text-gray-700 hover:text-green-600 font-semibold transition-colors duration-300">Contact</a></li>
                    </ul>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow pt-24 px-4">
                <div className="max-w-lg w-full bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 text-center">
                    <h1 className="text-4xl font-bold text-green-600 mb-4">Welcome!</h1>
                    <p className="text-gray-600 text-lg mb-8">Connecting Farmers and Customers Directly</p>

                    {/* Signup Buttons */}
                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={() => handleOpenSignup('farmer')}
                            className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            Signup as Farmer
                        </button>
                        <button
                            onClick={() => handleOpenSignup('customer')}
                            className="flex-1 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                        >
                            Signup as Customer
                        </button>
                    </div>

                    {/* Login Section */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-gray-700 mb-6">Login</h2>
                        <input
                            type="text"
                            placeholder="Username"
                            value={loginUsername}
                            onChange={(e) => setLoginUsername(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-xl focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-300 text-lg"
                        />
                        <button
                            onClick={() => { 
                                handleLogin()
                                login(loginUsername, loginPassword) }}
                            className="w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>

            {/* Signup Modal */}
            {signupModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="flex relative justify-around p-6 border-b border-gray-100">
                            <h2 className="text-3xl font-semibold text-teal-600">Signup as {userType}</h2>
                            <button
                                className="w-10 absolute right-1 top-1 text-2xl bg-transparent text-gray-400 hover:text-gray-600 hover:bg-transparent"
                                onClick={handleCloseSignup}
                            >
                                ×
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg text-sm focus:border-teal-400 focus:outline-none bg-white"
                                    required
                                />
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg text-sm focus:border-teal-400 focus:outline-none bg-white"
                                    required
                                />
                            </div>

                            <input
                                name="name"
                                type="text"
                                placeholder="Name"
                                onChange={handleChange}
                                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:border-teal-400 focus:outline-none bg-white"
                                required
                            />

                            <input
                                name="password"
                                type="password"
                                placeholder="Password"
                                onChange={handleChange}
                                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:border-teal-400 focus:outline-none bg-white"
                                required
                            />

                            <input
                                name="mobileNumber"
                                type="text"
                                placeholder="Mobile Number"
                                onChange={handleChange}
                                className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:border-teal-400 focus:outline-none bg-white"
                                required
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    name="city"
                                    type="text"
                                    placeholder="City"
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg text-sm focus:border-teal-400 focus:outline-none bg-white"
                                    required
                                />
                                <input
                                    name="state"
                                    type="text"
                                    placeholder="State"
                                    onChange={handleChange}
                                    className="border border-gray-200 p-3 rounded-lg text-sm focus:border-teal-400 focus:outline-none bg-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-2">Gender:</label>
                                <select
                                    name="gender"
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 p-3 rounded-lg text-sm focus:border-teal-400 focus:outline-none bg-white text-gray-500"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            {userType === 'farmer' && (
                                <div className="grid grid-cols-2 gap-3">
                                    <input
                                        name="landOwnedAcres"
                                        type="text"
                                        placeholder="Land Owned (Acres)"
                                        onChange={handleChange}
                                        className="border border-gray-200 p-3 rounded-lg text-sm focus:border-teal-400 focus:outline-none bg-white"
                                        required
                                    />
                                    <input
                                        name="upiId"
                                        type="text"
                                        placeholder="UPI ID"
                                        onChange={handleChange}
                                        className="border border-gray-200 p-3 rounded-lg text-sm focus:border-teal-400 focus:outline-none bg-white"
                                        required
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleSignup}
                                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-lg font-medium text-sm transition-colors duration-200 mt-6"
                            >
                                {userType === 'farmer' ? 'Signup' : 'Create Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* OTP Modal */}
            {otpModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                        <div className="px-8 py-6 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-blue-600">OTP Verification</h2>
                                <button
                                    className="text-3xl text-gray-400 hover:text-gray-600 transition-colors duration-200"
                                    onClick={handleCloseOTP}
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="px-8 py-6 space-y-6">
                            <p className="text-gray-600 text-center">Please enter the OTP sent to your mobile number</p>
                            <input
                                type="text"
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full border border-gray-300 p-4 rounded-xl text-center text-2xl font-mono tracking-wider focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                                maxLength="6"
                            />
                            <button
                                onClick={handleVerifyOTP}
                                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                            >
                                Verify OTP
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FarmersMarketApp;