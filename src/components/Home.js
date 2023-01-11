import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
	const userState = useSelector((state) => state.user);
	const navigate = useNavigate();
	useEffect(() => {
		if (userState.name === "") {
			return navigate("/login", { replace: true });
		}
	}, [navigate, userState.name]);
	return (
		<>
			<h1>Home</h1>
			<div>my name is {userState.name}</div>
			<div>my email is {userState.email}</div>
		</>
	);
};

export default Home;
