const express = require("express");
const User = require("../models/user");

const { hashPassword, verifyPassword } = require("../utils/hash");
const { createToken } = require("../utils/token");

const router = express.Router();

router.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password)
			return res.status(400).json({
				success: false,
				message: "Kindly fill all the fields",
			});
		const user = await User.findOne({ email });
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
			name: user.name,
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
		console.log(err.message);
		res.status(500).json({ success: false, message: err.message });
	}
});

router.post("/register", async (req, res) => {
	try {
		const { name, email, password } = req.body;
		if (!email || !password || !name)
			return res.status(400).json({
				success: false,
				message: "Kindly fill all the fields",
			});

		const hash = await hashPassword(password);
		if (!hash)
			return res
				.status(500)
				.json({ success: false, message: "Unable to register user." });

		const user = new User({ name, email, password: hash });
		await user.save();

		const payload = {
			name: user.name,
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
