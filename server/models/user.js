const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: { type: String, required: true, maxlength: 100 },
	email: { type: String, unique: true, required: true, maxlength: 256 },
	password: { type: String, required: true },
	isVerified: { type: Boolean, default: false },
	createdAt: { type: Date, required: true, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
