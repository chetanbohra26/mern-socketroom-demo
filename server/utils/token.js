const jwt = require("jsonwebtoken");

const createToken = (payload) => {
	if (!payload) return false;
	const token = jwt.sign(payload, process.env.TOKEN_SECRET);
	console.log(token);
	return token;
};

module.exports.createToken = createToken;
