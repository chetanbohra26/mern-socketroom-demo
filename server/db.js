const mongoose = require("mongoose");

const initDb = () => {
	mongoose.set("strictQuery", false);

	mongoose.connect(process.env.MONGODB_URI, (err) => {
		if (err) throw err;
		console.log("Connected to mongodb");
	});

	mongoose.connection.on("disconnected", () => {
		console.log("Disconnected from mongodb");
	});

	process.on("SIGINT", () => {
		mongoose.disconnect(() => {
			console.log("Disconnected mongodb during app termination");
			process.exit(0);
		});
	});
};

module.exports.initDb = initDb;
