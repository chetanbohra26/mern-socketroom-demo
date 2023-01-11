import { Outlet, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function App() {
	const userState = useSelector((state) => state.user);
	const navigate = useNavigate();
	useEffect(() => {
		if (userState.name !== "") {
			navigate("/home");
		}
	}, [userState.name, navigate]);
	return (
		<div className="vh-100 d-flex flex-column">
			<ToastContainer theme="dark" />
			<Navbar />
			<div className="d-flex flex-column flex-fill container-fluid p-0">
				<Outlet />
			</div>
		</div>
	);
}

export default App;
