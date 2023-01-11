import jwtDecode from "jwt-decode";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { loginRequest, registerRequest } from "../utils/httpHelper";
import { setToken } from "../utils/token";
import { setUser } from "../reducers/user";
import { useNavigate } from "react-router-dom";

function Login() {
	const [showLogin, setShowLogin] = useState(true);
	const userDispatch = useDispatch();
	const navigate = useNavigate();
	const [login, setLogin] = useState({ email: "", pass: "" });
	const [register, setRegister] = useState({
		email: "",
		name: "",
		pass: "",
	});

	const handleLoginChange = ({ currentTarget: input }) => {
		const updated = { ...login };
		updated[input.name] = input.value;
		setLogin(updated);
	};
	const handleRegisterChange = ({ currentTarget: input }) => {
		const updated = { ...register };
		updated[input.name] = input.value;
		setRegister(updated);
	};

	const handleLoginSubmit = async (event) => {
		event.preventDefault();
		const { email, pass } = login;
		const response = await loginRequest(email, pass);
		if (!response.success) return toast.error(response.message);
		if (response.token) {
			toast.success(response.message);
			setUserAndGoHome(response.token);
		}
	};

	const handleRegisterSubmit = async (event) => {
		event.preventDefault();
		const { name, email, pass } = register;
		const response = await registerRequest(name, email, pass);

		if (!response.success) return toast.error(response.message);
		if (response.token) {
			toast.success(response.message);
			setUserAndGoHome(response.token);
		}
	};

	const setUserAndGoHome = (token) => {
		try {
			setToken(token);
			const user = jwtDecode(token);
			if (user) {
				const payload = {
					name: user.name,
					email: user.email,
				};
				userDispatch(setUser(payload));
			}
			navigate("/home", { replace: true });
		} catch (err) {
			console.log(err);
			toast.error("Could not fetch user details");
		}
	};

	const getLoginUI = () => {
		return (
			<>
				<form onSubmit={handleLoginSubmit}>
					<div className="form-floating mb-3">
						<input
							id="login-email"
							name="email"
							type="email"
							className="form-control"
							placeholder=" "
							required
							value={login.email}
							onChange={handleLoginChange}
						/>
						<label htmlFor="login-email" className="form-label">
							Email address
						</label>
					</div>
					<div className="form-floating  mb-3">
						<input
							id="login-pass"
							name="pass"
							type="password"
							className="form-control"
							placeholder=" "
							required
							value={login.pass}
							onChange={handleLoginChange}
						/>
						<label htmlFor="login-pass" className="form-label">
							Password
						</label>
					</div>
					<div className="d-flex">
						<button className="btn btn-primary mx-auto">
							Submit
						</button>
					</div>
				</form>
				<div className="d-flex align-items-center justify-content-center">
					<span>New user?</span>
					<button
						className="btn btn-link"
						onClick={() => setShowLogin(false)}
					>
						Register
					</button>
				</div>
			</>
		);
	};

	const getRegisterUI = () => {
		return (
			<>
				<form onSubmit={handleRegisterSubmit}>
					<div className="form-floating mb-3">
						<input
							id="register-name"
							name="name"
							type="text"
							className="form-control"
							placeholder=" "
							required
							value={register.name}
							onChange={handleRegisterChange}
						/>
						<label htmlFor="register-name" className="form-label">
							Name
						</label>
					</div>
					<div className="form-floating mb-3">
						<input
							id="register-email"
							name="email"
							type="email"
							className="form-control"
							placeholder=" "
							required
							value={register.email}
							onChange={handleRegisterChange}
						/>
						<label htmlFor="register-email" className="form-label">
							Email address
						</label>
					</div>
					<div className="form-floating mb-3">
						<input
							id="register-pass"
							name="pass"
							type="password"
							className="form-control"
							placeholder=" "
							required
							value={register.pass}
							onChange={handleRegisterChange}
						/>
						<label htmlFor="register-pass" className="form-label">
							Password
						</label>
					</div>
					<div className="d-flex">
						<button
							type="submit"
							className="btn btn-primary mx-auto"
						>
							Submit
						</button>
					</div>
				</form>
				<div className="d-flex align-items-center justify-content-center">
					<span>Already having an account?</span>
					<button
						className="btn btn-link"
						onClick={() => setShowLogin(true)}
					>
						Login
					</button>
				</div>
			</>
		);
	};

	return (
		<div className="d-flex justify-content-center">
			<div className="card w-50 mt-2">
				<h4 className="card-header text-center">
					{showLogin ? "Login" : "Register"}
				</h4>
				<div className="card-body">
					{showLogin ? getLoginUI() : getRegisterUI()}
				</div>
			</div>
		</div>
	);
}

export default Login;
