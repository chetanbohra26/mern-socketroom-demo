import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { removeToken } from "../utils/token";
import { removeUser } from "../reducers/user";

function Navbar() {
	const userState = useSelector((state) => state.user);
	const navigate = useNavigate();
	const userDispatch = useDispatch();

	const handleLogin = () => {
		navigate("/login");
	};

	const handleLogout = () => {
		removeToken();
		userDispatch(removeUser());
		navigate("/login", { replace: true });
		toast.success("Logged out successfully");
	};

	return (
		<nav className="navbar navbar-expand navbar-dark bg-dark">
			<div className="container-fluid">
				<NavLink className="navbar-brand" to="/">
					Room.io
				</NavLink>
				<div className="collapse navbar-collapse">
					{
						<ul className="navbar-nav me-auto">
							{/*
								<li className="nav-item">
									<NavLink to="/" className="nav-link">
										Home
									</NavLink>
								</li>
								*/}
						</ul>
					}
					{userState.name === "" ? (
						<button
							className="btn btn-outline-success"
							onClick={handleLogin}
						>
							Login
						</button>
					) : (
						<>
							<span className="text-white me-2">{`Welcome ${userState.name}`}</span>
							<button
								className="btn btn-outline-danger"
								onClick={handleLogout}
							>
								Logout
							</button>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}

export default Navbar;
