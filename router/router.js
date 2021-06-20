module.exports = function(app) {
	app.use("/contact", require("./collections/contact"));
	// app.use("/register", require("./collections/register"));
};
