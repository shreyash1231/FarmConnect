import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { over } from 'stompjs';

const CustomerInstrumentDashboard = () => {
    const [instruments, setInstruments] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');
    const [chatVisible, setChatVisible] = useState(false);
    const [chatWith, setChatWith] = useState({ id: null, name: '' });

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userType = localStorage.getItem('userType');
    const customerId = localStorage.getItem('userId');

    let stompClient = React.useRef(null);

    useEffect(() => {
        if (!token || userType !== 'customer') {
            alert('Unauthorized access. Please login as a customer.');
            navigate('/login');
            return;
        }

        fetchInstruments();
        connectWebSocket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const connectWebSocket = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        stompClient.current = over(socket);
        stompClient.current.connect({}, () => {
            stompClient.current.subscribe(`/user/${customerId}/queue/messages`, (msg) => {
                const message = JSON.parse(msg.body);
                setChatMessages(prev => [...prev, message]);
            });
        });
    };

    const fetchInstruments = async () => {
        try {
            const res = await fetch('http://localhost:8080/api/instruments', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error('Failed to fetch instruments');
            const data = await res.json();
            setInstruments(data);
        } catch (err) {
            console.error(err);
            alert('Failed to fetch instruments.');
        }
    };

    const openChat = async (farmerId, farmerName) => {
        setChatWith({ id: farmerId, name: farmerName });
        setChatVisible(true);
        await fetchChatMessages(farmerId);
        await markMessagesAsRead(customerId, farmerId);
    };

    const fetchChatMessages = async (farmerId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/chat/messages?senderId=${customerId}&receiverId=${farmerId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setChatMessages(data);
        } catch (err) {
            console.error('Error fetching chat messages', err);
        }
    };

    const markMessagesAsRead = async (senderId, receiverId) => {
        try {
            await fetch(`http://localhost:8080/api/chat/mark-as-read?senderId=${senderId}&receiverId=${receiverId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.error('Error marking messages as read', err);
        }
    };

    const sendMessage = () => {
        if (!chatInput.trim()) return;

        const message = {
            sender: { id: customerId },
            receiver: { id: chatWith.id },
            message: chatInput,
        };

        stompClient.current.send('/app/chat.sendMessage', {}, JSON.stringify(message));
        setChatMessages(prev => [...prev, { ...message, sender: { name: 'You', id: customerId } }]);
        setChatInput('');
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const redirectToConsumer = () => navigate('/consumer_dashboard');

    return (
        <div className="min-h-screen bg-cover bg-fixed bg-center" style={{ backgroundImage: "url('/1.jpg')" }}>
            <script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/stompjs@2.3.3/lib/stomp.min.js"></script>

            {/* Navbar */}
            <div className="w-full fixed top-0 bg-white/90 backdrop-blur-md shadow-md z-50 px-6 py-4 flex justify-between items-center">
                <span className="text-green-700 font-semibold text-lg">👋 Welcome, Customer!</span>
                <button onClick={redirectToConsumer} className="bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700">
                    Back
                </button>
            </div>

            {/* Container */}
            <div className="pt-24 pb-10 px-4 max-w-4xl mx-auto">
                <div className="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center text-teal-700 mb-6">Available Instruments</h2>
                    <div className="space-y-6">
                        {instruments.length === 0 ? (
                            <p className="text-center text-gray-600">No instruments available.</p>
                        ) : (
                            instruments.map((inst) => (
                                <div key={inst.id} className="bg-white p-5 rounded-lg border shadow hover:bg-green-50 transition">
                                    <h3 className="text-lg font-bold text-green-700">{inst.instrumentName}</h3>
                                    <p><strong>Description:</strong> {inst.description}</p>
                                    <p><strong>Rent Per Day:</strong> ₹{inst.rentPricePerDay}</p>
                                    <p><strong>Available:</strong> {new Date(inst.availableFrom).toLocaleDateString()} to {new Date(inst.availableTo).toLocaleDateString()}</p>
                                    <p><strong>Farmer:</strong> {inst.farmer.name}</p>
                                    <img src={`http://localhost:8080/api/instrument-image/${inst.id}`} alt={inst.instrumentName} className="mt-3 w-full max-w-md rounded-lg" />
                                    <button
                                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        onClick={() => openChat(inst.farmer.id, inst.farmer.name)}
                                    >
                                        Chat with Farmer
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Chat Modal */}
            {chatVisible && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-[90%] max-w-md p-5 relative">
                        <button className="absolute top-2 right-2 text-gray-600 text-xl" onClick={() => setChatVisible(false)}>&times;</button>
                        <h3 className="text-lg font-semibold mb-4">Chat with {chatWith.name}</h3>
                        <div className="max-h-60 overflow-y-auto border p-3 rounded mb-4 bg-gray-50">
                            {chatMessages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`mb-2 p-2 rounded ${msg.sender.id === customerId ? 'bg-green-100 text-right' : 'bg-blue-100 text-left'
                                        }`}
                                >
                                    <strong>{msg.sender.name}:</strong> {msg.message}
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                className="flex-1 border rounded px-3 py-2"
                                placeholder="Type a message..."
                            />
                            <button onClick={sendMessage} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerInstrumentDashboard;
