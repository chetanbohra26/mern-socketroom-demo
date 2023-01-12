import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
//import { toast } from "react-toastify";

import { getToken } from "../utils/token";

const Home = () => {
	const [roomInput, setRoomInput] = useState("");
	const [rooms, setRooms] = useState([]);
	const [message, setMessage] = useState("");
	const [currentRoom, setCurrentRoom] = useState("");
	const userState = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [token] = useState(getToken());
	const [socketInstance, setSocketInstance] = useState();

	const handleSubmitRoom = (event) => {
		event.preventDefault();
		const roomValue = roomInput.trim();
		if (roomValue === "") return;
		if (rooms.includes(roomValue)) return setRoomInput("");

		socketInstance.emit("join-request", roomValue);

		const newRooms = [...rooms, roomValue];
		setRooms(newRooms);
		setRoomInput("");
		if (currentRoom === "") setCurrentRoom(roomValue);
	};

	const handleRoomDelete = (index) => {
		socketInstance.emit("leave-request", rooms[index]);

		const newRooms = [...rooms];
		newRooms.splice(index, 1);
		setRooms(newRooms);
		setCurrentRoom(newRooms.length === 0 ? "" : newRooms[0]);
	};

	const handleMessageInput = ({ target }) => {
		setMessage(target.value);
	};

	const handleSendMessage = (event) => {
		event.preventDefault();
		if (currentRoom === 0) return;
		setMessage("");
	};

	useEffect(() => {
		return () => {
			console.log("cleanup code");
			socketInstance && socketInstance.disconnect();
		};
	}, [socketInstance]);

	useEffect(() => {
		if (userState.name === "") {
			return navigate("/login", { replace: true });
		}

		const socket = io("http://localhost:7500", {
			query: { token: token },
		});

		socket.on("connect", () => {
			//toast.success("Connected");
			console.log(socket.id);
		});

		socket.on("disconnect", () => {
			//toast.error("Disconnected from server");
		});

		//socket.on("alert", (data) => console.log(`Alert: ${data}`));

		setSocketInstance(socket);
	}, [navigate, userState.name, token]);

	return (
		<div className="container-xxl d-flex flex-column flex-fill p-2">
			<div className="mb-2">
				<form onSubmit={handleSubmitRoom}>
					<div className="d-flex align-items-center">
						<input
							type="text"
							className="form-control ps-1 me-2 shadow"
							placeholder="Enter name of room to join"
							value={roomInput}
							onChange={({ target }) => {
								setRoomInput(target.value);
							}}
							required
						/>
						<button className="btn btn-dark shadow">Join</button>
					</div>
				</form>
			</div>
			<div className="row g-0 flex-fill">
				<div className="col-4 d-flex flex-column">
					<div className="card d-flex flex-fill me-2 shadow">
						<h4 className="card-header">Rooms</h4>
						<div className="card-body p-1 pb-0">
							<div>
								{rooms.length !== 0 ? (
									rooms.map((item, index) => (
										<div
											className="p-1 m-1 rounded border border-1 d-flex align-items-center"
											key={item}
										>
											<h6 className="me-auto m-0">
												{item}
											</h6>
											<button
												className="btn btn-dark"
												onClick={() =>
													handleRoomDelete(index)
												}
											>
												Delete
											</button>
										</div>
									))
								) : (
									<h4 className="text-center mt-2">
										Join a room to get started
									</h4>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className="col-8 d-flex flex-column">
					<div className="card d-flex flex-fill ms-0 shadow">
						<h4 className="card-header">
							Messages
							{currentRoom !== "" ? `(${currentRoom})` : ""}
						</h4>
						<div className="card-body p-2 d-flex flex-column flex-fill">
							<div className="d-flex flex-column flex-fill">
								messages sent are displayed here
							</div>
							<form onSubmit={handleSendMessage}>
								<div className="d-flex">
									<input
										type="text"
										className="form-control me-2"
										placeholder="Enter a message"
										value={message}
										onChange={handleMessageInput}
									/>
									<button
										className="btn btn-dark"
										disabled={currentRoom === ""}
									>
										Send
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
