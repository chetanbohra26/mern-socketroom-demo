const http = require("http");
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

// const rooms = new Set();
io.use(authenticateSocket).on("connection", (socket) => {
	console.log("Connected to socket", socket.id);

	socket.on("disconnect", function () {
		console.log("user disconnected");
	});

	socket.on("join-request", (roomName) => {
		console.log(socket.id, "joining", roomName);
		socket.join(roomName);
		//rooms.add(roomName);

		/*
		rooms.forEach((room) =>
			io.to(room).emit("alert", `Socket ${socket.id} is in room ${room}`)
		);
		*/
	});

	socket.on("leave-request", (roomName) => {
		console.log(socket.id, "leaving", roomName);
		socket.leave(roomName);
	});

	socket.on("message-room", (payload) => {
		console.log(payload);
	});
});

app.use("/api/v1", apiRouter);

app.get("/", (req, res) => {
	res.json({ success: true, message: "Welcome to express" });
});

const PORT = process.env.PORT || 7500;
server.listen(PORT, (err) => {
	if (err) throw err;
	console.log(`Server running on port ${PORT}`);
});
