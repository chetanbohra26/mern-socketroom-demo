import { useNavigate } from "react-router-dom";
import logo from "../assets/logo-connect.svg";

const Intro = () => {
	const navigate = useNavigate();
	return (
		<div className="d-flex flex-column flex-fill justify-content-center">
			<div className="row g-0">
				<div className="col-xs-12 col-sm-6 col-lg-3 col-xl-2 mx-auto mb-3">
					<img src={logo} className="w-100" alt="" />
				</div>
			</div>
			<h1 className="text-center">Room.io</h1>
			<div className="d-flex justify-content-center my-2">
				<button
					className="btn btn-dark"
					onClick={() => navigate("/home")}
				>
					Get Started
				</button>
			</div>
			<h5 className="text-center">
				Developed with <span className="text-danger">❤</span> by Chetan
				Bohra
			</h5>
		</div>
	);
};

export default Intro;
