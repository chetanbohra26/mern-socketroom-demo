const http = require("http");
const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { initDb } = require("./db");
initDb();

const { authenticateSocket } = require("./socket");
const apiRouter = require("./routes/router");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: { origin: "*", methods: ["GET", "POST"] },
});

io.use(authenticateSocket).on("connection", (socket) => {
	console.log("Connected to socket", socket.id);

	socket.on("disconnect", function () {
		console.log("user disconnected", socket.id);
	});

	socket.on("join-request", (roomName) => {
		console.log(socket.id, "joining", roomName);
		socket.join(roomName);
	});

	socket.on("leave-request", (roomName) => {
		console.log(socket.id, "leaving", roomName);
		socket.leave(roomName);
	});

	socket.on("message-room", (payload) => {
		const { id, room, message } = payload;
		const serverPayload = {
			id,
			message,
			room,
		};
		io.to(room).emit("response-room", serverPayload);
	});
});

app.use("/api/v1", apiRouter);

app.use(express.static(path.join(__dirname, "./../build")));
app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "./../build", "index.html"));
});

const PORT = process.env.PORT || 7500;
server.listen(PORT, (err) => {
	if (err) throw err;
	console.log(`Server running on port ${PORT}`);
});
