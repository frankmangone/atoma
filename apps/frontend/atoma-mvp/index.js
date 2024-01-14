const express = require("express");

const app = express();

const PORT = process.env.PORT || 3005;

app.get("/", async (_, res) => {
	return res.sendFile(__dirname + "/index.html");
});

app.listen(PORT, () => {
	console.log(`Service endpoint = http://localhost:${PORT}`);
});
