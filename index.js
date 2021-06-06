const express = require("express");
const app = express();

app.get("/", function(req, res) {
	res.send("");
});


app.listen(1337, () => {
	console.log("Raboti");
});
