const express = require("express");
const app = express();
const { Database } = require("./database");
const db = new Database("litho-prae-db", "DESKTOP-M33791J\\SQLExpress", true, false);
const PORT = process.env.PORT || 1337;

app.get("/", async function(req, res) {
	await db.connectToDB();
	const results = await db.testQuery();
	res.json(results);
});


app.listen(PORT, async () => {
	// console.log(results);
	console.log("Raboti");
});
