const http = require("http");
const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { initDb } = require("./db");
initDb();

const { authenticateSocket, handleSocketConnection } = require("./socket");
const apiRouter = require("./routes/router");
const socketInit = require("./socket");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = require("socket.io")(server, {
	cors: { origin: "*", methods: ["GET", "POST"] },
});

io.use(authenticateSocket).on("connection", handleSocketConnection);

app.use("/api/v1", apiRouter);

app.get("/", (req, res) => {
	res.json({ success: true, message: "Welcome to express" });
});

const PORT = process.env.PORT || 7500;
server.listen(PORT, (err) => {
	if (err) throw err;
	console.log(`Server running on port ${PORT}`);
});
