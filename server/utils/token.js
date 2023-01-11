const jwt = require("jsonwebtoken");

const createToken = (payload) => {
	if (!payload) return false;
	return jwt.sign(payload, process.env.TOKEN_SECRET);
};

module.exports.createToken = createToken;
