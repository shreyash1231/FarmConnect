import React from 'react';

const AboutPage = () => {
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed text-gray-800 font-[Montserrat]"
            style={{ backgroundImage: `./assets/1.jpg` }}
        >
            {/* Navbar */}
            <nav className="w-full fixed top-0 left-0 bg-white/90 backdrop-blur-md shadow-md z-50 px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-green-700">Farmers Market</div>
                <ul className="flex space-x-6 font-semibold">
                    <li>
                        <a href="/Home" className="hover:text-teal-600 transition">Home</a>
                    </li>
                    <li>
                        <a href="/" className="hover:text-teal-600 transition">Login</a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-teal-600 transition">About</a>
                    </li>
                    <li>
                        <a href="#" className="hover:text-teal-600 transition">.....</a>
                    </li>
                </ul>
            </nav>

            {/* About Section */}
            <div className="max-w-4xl mx-auto mt-32 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-green-700 mb-4">About Farmers Market</h1>
                <p className="text-lg leading-8 text-gray-700 mb-8">
                    Farmers Market is a platform designed to connect farmers directly with customers,
                    enabling them to buy and sell fresh, locally grown produce. Our goal is to support
                    sustainable agriculture, promote healthy eating, and help local communities thrive by
                    cutting down on intermediaries.
                </p>

                <h2 className="text-2xl font-semibold text-green-800 mb-3">Our Vision</h2>
                <p className="text-lg leading-8 text-gray-700 mb-8">
                    We envision a world where everyone has access to fresh, affordable, and healthy food
                    while supporting local farmers and agriculture. Farmers Market aims to revolutionize the
                    way we approach food sourcing, focusing on transparency and direct relationships between
                    farmers and customers.
                </p>

                <h2 className="text-2xl font-semibold text-green-800 mb-3">Features</h2>
                <ul className="text-left list-none space-y-4 text-gray-700 text-lg">
                    <li><span className="font-bold">🥬 Fresh Produce:</span> Buy directly from local farmers to get the freshest produce available.</li>
                    <li><span className="font-bold">✅ Verified Farmers:</span> Only trusted, verified farmers are allowed to sell on our platform.</li>
                    <li><span className="font-bold">🔐 Secure Transactions:</span> Our platform ensures safe and secure transactions for both farmers and customers.</li>
                    <li><span className="font-bold">🤝 Community Support:</span> By buying locally, you are directly supporting the farmers in your community.</li>
                </ul>

                <img
                    src={'./assets/farm-img.jpg'}
                    alt="Farmers Market"
                    className="mt-8 w-full rounded-lg shadow-lg"
                />
            </div>
        </div>
    );
};

export default AboutPage;
