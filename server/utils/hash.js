const argon2 = require("argon2");

const hashPassword = (pass) => {
	if (!pass) return;
	return argon2.hash(pass);
};

const verifyPassword = (pass, hash) => {
	if (!pass || !hash) return;
	return argon2.verify(hash, pass);
};

module.exports = { hashPassword, verifyPassword };
