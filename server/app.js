const express = require("express");
const cors = require("cors");

require("dotenv").config();

const { initDb } = require("./db");
initDb();

const apiRouter = require("./routes/router");

const app = express();
app.use(cors());
app.use("/api/v1", apiRouter);

app.get("/", (req, res) => {
	res.json({ success: true, message: "Welcome to express" });
});

const PORT = process.env.PORT || 7500;
app.listen(PORT, (err) => {
	if (err) throw err;
	console.log(`Server running on port ${PORT}`);
});
