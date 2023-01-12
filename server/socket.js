const { verifyToken } = require("./utils/token");

const authenticateSocket = (socket, next) => {
	const token = socket?.handshake?.query?.token;
	if (!token) return next(new Error("Authentication error"));

	const verified = verifyToken(token);
	if (!verified) return next(new Error("Authentication error"));

	next();
};

module.exports = { authenticateSocket };
