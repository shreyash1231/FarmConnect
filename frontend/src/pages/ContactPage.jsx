import React, { useState } from 'react';


const ContactPage = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Your message has been sent!');
        // Add backend integration or API call here
        setForm({ name: '', email: '', message: '' });
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed font-[Montserrat] text-gray-800"
            style={{ backgroundImage: `./asset/1.jpg` }}
        >
            {/* Navbar */}
            <nav className="w-full fixed top-0 left-0 bg-white/90 backdrop-blur-md shadow-md z-50 px-6 py-4 flex justify-between items-center">
                <div className="text-2xl font-bold text-green-700">Farmers Market</div>
                <ul className="flex space-x-6 font-semibold">
                    <li><a href="/Home" className="hover:text-teal-600 transition">Home</a></li>
                    <li><a href="/" className="hover:text-teal-600 transition">Login</a></li>
                    <li><a href="about.html" className="hover:text-teal-600 transition">About</a></li>
                    <li><a href="#" className="hover:text-teal-600 transition">......</a></li>
                </ul>
            </nav>

            {/* Contact Container */}
            <div className="max-w-3xl mx-auto mt-32 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg text-center">
                <h1 className="text-3xl font-bold text-green-700 mb-4">Contact Us</h1>
                <p className="text-lg leading-8 text-gray-700 mb-8">
                    We’d love to hear from you! If you have any questions or feedback, feel free to reach out
                    to us through the contact form below or use any of the following methods.
                </p>

                {/* Contact Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 mb-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <textarea
                        name="message"
                        placeholder="Your Message"
                        rows="5"
                        value={form.message}
                        onChange={handleChange}
                        required
                        className="p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
                    />
                    <button
                        type="submit"
                        className="bg-teal-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-teal-600 transition transform hover:scale-105"
                    >
                        Send Message
                    </button>
                </form>

                {/* Contact Details */}
                <div className="text-lg text-gray-700">
                    <p className="mb-2"><span className="font-bold">Email:</span> support@farmersmarket.com</p>
                    <p className="mb-2"><span className="font-bold">Phone:</span> +1 (800) 123-4567</p>
                    <p><span className="font-bold">Address:</span> 123 Green Lane, Agriculture City, USA</p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
