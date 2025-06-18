import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
// import Home from "./pages/home/Home";
// import Login from "./pages/login/Login";
// import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import AddCrop from "./pages/AddCrop";
import AddInstrument from "./pages/AddInstrument";
import ViewProducts from "./pages/ViewProduct";
import CustomerInstrumentDashboard from "./pages/CustomerInstrumentDashboard";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Home from './pages/home/Home'

function App() {
	const { authUser } = useAuthContext();
	return (
		<div className='p-4 h-screen flex items-center justify-center'>
			<Routes>
				<Route path="/" element={<LoginPage />} />
				<Route path="/ConsumerDashboard" element={<ConsumerDashboard />} />
				<Route path="/FarmerDashboard" element={<FarmerDashboard />} />
				<Route path="/add-crop" element={<AddCrop />} />
				<Route path="/add-instrument" element={<AddInstrument />} />
				<Route path="/view-products" element={<ViewProducts />} />
				<Route path="/view-rentals" element={<CustomerInstrumentDashboard />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/contact" element={<ContactPage />} />
				<Route path="/Home" element={<Home />} />
				<Route path="/ChatApp" element={<Home />} />



			</Routes>
			<Toaster />s
		</div>
	);
}

export default App;