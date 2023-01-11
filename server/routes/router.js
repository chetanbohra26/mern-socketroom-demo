const express = require("express");

const loginRouter = require("./login");

const router = express.Router();
router.use(express.json());

router.use("/auth", loginRouter);

router.all("/", (req, res) => {
	res.json({ success: true, message: "Welcome to API" });
});

module.exports = router;
