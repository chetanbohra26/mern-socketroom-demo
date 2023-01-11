const express = require("express");
const User = require("../models/user");

const { hashPassword, verifyPassword } = require("../utils/hash");
const { createToken } = require("../utils/token");

const router = express.Router();

router.post("/login", async (req, res) => {
	try {
		console.log(req.body);
		const { email, password } = req.body;
		const user = await User.findOne({ email });
		console.log(user);
		if (!user)
			return res.status(404).json({
				success: false,
				message: "Incorrect email or password",
			});
		const verified = await verifyPassword(password, user.password);
		if (!verified)
			return res.status(404).json({
				success: false,
				message: "Incorrect email or password",
			});

		const payload = {
			email: user.email,
			isVerified: user.isVerified,
		};
		const token = createToken(payload);

		res.json({
			success: true,
			message: "Login Successful",
			token,
		});
	} catch (err) {
		console.log(err);
		throw err;
	}
});

router.post("/register", async (req, res) => {
	try {
		console.log(req.body);
		const { name, email, password } = req.body;

		const hash = await hashPassword(password);
		if (!hash)
			return res
				.status(500)
				.json({ success: false, message: "Unable to register user." });

		const user = new User({ name, email, password: hash });
		await user.save();

		const payload = {
			email: user.email,
			isVerified: user.isVerified,
		};
		const token = createToken(payload);

		res.json({
			success: true,
			message: "Registration successful",
			token,
		});
	} catch (err) {
		console.log(err.message);
		if (err.code === 11000)
			return res
				.status(400)
				.json({ success: false, message: "Email already in use" });
		res.status(500).json({ success: false, message: err.message });
	}
});

module.exports = router;
