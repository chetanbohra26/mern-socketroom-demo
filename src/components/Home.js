import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import { getToken } from "../utils/token";

const Home = () => {
	const userState = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [token] = useState(getToken());
	useEffect(() => {
		if (userState.name === "") {
			return navigate("/login", { replace: true });
		}
		const socket = io("http://localhost:7500", {
			query: { token: token },
		});
		socket.on("connect", () => {
			toast.success("Connected");
			console.log(socket.id);
		});

		socket.on("disconnect", () => {
			toast.error("Disconnected from server");
		});
	}, [navigate, userState.name, token]);
	return (
		<>
			<h1>Home</h1>
			<div>my name is {userState.name}</div>
			<div>my email is {userState.email}</div>
		</>
	);
};

export default Home;
