const jwt = require("jsonwebtoken");

const createToken = (payload) => {
	if (!payload) return;
	return jwt.sign(payload, process.env.TOKEN_SECRET);
};

const verifyToken = (token) => {
	if (!token) return;
	try {
		const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
		return decoded;
	} catch (err) {
		console.log("Invalid token");
	}
};

module.exports = { createToken, verifyToken };
