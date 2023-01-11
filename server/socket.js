const { verifyToken } = require("./utils/token");

const authenticateSocket = (socket, next) => {
	const token =
		socket &&
		socket.handshake &&
		socket.handshake.query &&
		socket.handshake.query.token;
	if (!token) return next(new Error("Authentication error"));

	const verified = verifyToken(token);
	if (!verified) return next(new Error("Authentication error"));

	next();
};

const handleSocketConnection = (socket) => {
	console.log("Connected to socket", socket.id);

	socket.on("disconnect", function () {
		console.log("user disconnected");
	});
};

module.exports = { authenticateSocket, handleSocketConnection };
