import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { toast } from "react-toastify";

import { getToken } from "../utils/token";
import { v4 as uuid } from "uuid";

const Home = () => {
	const [roomInput, setRoomInput] = useState("");
	const [rooms, setRooms] = useState([]);
	const roomsRef = useRef(rooms);
	const [messageInput, setMessageInput] = useState("");
	const [roomMessages, setRoomMessages] = useState({});
	const roomMessageRef = useRef(roomMessages);
	const [currentRoom, setCurrentRoom] = useState("");
	const userState = useSelector((state) => state.user);
	const navigate = useNavigate();
	const [token] = useState(getToken());
	const [socketInstance, setSocketInstance] = useState();
	const chatRef = useRef();
	const [me] = useState(uuid());

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
		const updatedMessages = { ...roomMessages };
		updatedMessages[roomValue] = [];
		setRoomMessages(updatedMessages);
	};

	const handleRoomDelete = (index) => {
		const roomToDelete = rooms[index];
		socketInstance.emit("leave-request", rooms[index]);

		const newRooms = [...rooms];
		newRooms.splice(index, 1);
		setRooms(newRooms);

		if (currentRoom === roomToDelete) setCurrentRoom(newRooms[0] || "");
		const updatedMessages = { ...roomMessages };
		delete updatedMessages[roomToDelete];
		setRoomMessages(updatedMessages);
	};

	const handleMessageInput = ({ target }) => {
		setMessageInput(target.value);
	};

	const handleSwitchRoom = (value) => {
		setCurrentRoom(value);
	};

	const handleSendMessage = (event) => {
		event.preventDefault();
		if (currentRoom === "" || messageInput.trim() === "") return;

		if (!socketInstance || !socketInstance.id)
			return toast.error("Refresh the page");

		const payload = {
			id: socketInstance.id,
			room: currentRoom,
			message: messageInput,
			name: userState.name,
			senderId: me,
		};

		socketInstance.emit("message-room", payload);
		setMessageInput("");
	};

	useEffect(() => {
		roomMessageRef.current = roomMessages;
	}, [roomMessages]);

	useEffect(() => {
		roomsRef.current = rooms;
	}, [rooms]);

	useEffect(() => {
		return () => {
			console.log("socketinstance", socketInstance);
			if (!socketInstance) return;
			socketInstance.disconnect();
		};
	}, [socketInstance]);

	useEffect(() => {
		if (userState.name === "") {
			return navigate("/login", { replace: true });
		}

		const socket =
			process.env.NODE_ENV === "development"
				? io("http://localhost:7500", { query: { token } })
				: io({ query: { token } });

		socket.on("connect", () => {
			toast.success("Connected to server");
			console.log("Your socket:", socket.id);
			if (roomsRef.current.length > 0) {
				console.log("request to rejoin", roomsRef.current);
				socket.emit("reconnect-room", roomsRef.current);
			}
		});

		socket.on("disconnect", () => {
			toast.error("Disconnected from server");
		});

		socket.on("response-room", (payload) => {
			const { id, message, room, name, senderId } = payload;

			const updatedMessages = { ...roomMessageRef.current };
			updatedMessages[room] = [
				...updatedMessages[room],
				{ id, message, name, senderId },
			];

			setRoomMessages(updatedMessages);

			const chatBox = chatRef.current;
			chatBox.scrollTop = chatBox.scrollHeight;
		});

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
						<div
							className="card-body p-1 pb-0 overflow-auto"
							style={{ height: 0 }}
						>
							<div>
								{rooms.length !== 0 ? (
									rooms.map((item, index) => (
										<div
											className="m-1 rounded border border-1 d-flex align-items-center pe-auto"
											key={item}
											onClick={() =>
												handleSwitchRoom(item)
											}
										>
											<h6 className="p-2 me-auto m-0 pe-auto text-truncate">
												{item}
											</h6>
											<button
												className="btn btn-dark p-1 m-1"
												style={{ zIndex: 10 }}
												onClick={(event) => {
													event.stopPropagation();
													handleRoomDelete(index);
												}}
											>
												❌
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
							{currentRoom !== "" ? ` (${currentRoom})` : ""}
						</h4>
						<div className="card-body p-2 d-flex flex-column flex-fill">
							<div
								className="d-flex flex-column flex-fill overflow-auto pb-4 mb-2"
								ref={chatRef}
								style={{ height: 0 }}
							>
								{" "}
								<>
									{roomMessages[currentRoom] &&
									roomMessages[currentRoom].length > 0 ? (
										roomMessages[currentRoom].map(
											(item, index) => (
												<div
													key={index + item.message}
													className={`w-75 d-flex flex-column mb-2 ${
														item.senderId === me
															? "ms-auto"
															: ""
													}`}
												>
													<div className="bg-dark text-white p-2 rounded">
														<h6 className="text-white">
															{item.name}
														</h6>
														<span>
															{item.message}
														</span>
													</div>
												</div>
											)
										)
									) : (
										<h2 className="text-center mt-2">
											No Messages here
										</h2>
									)}
									<div className="pb-4"></div>
								</>
							</div>
							<form onSubmit={handleSendMessage}>
								<div className="d-flex">
									<input
										type="text"
										className="form-control me-2"
										placeholder="Enter a message"
										value={messageInput}
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
