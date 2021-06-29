module.exports = function(app) {
	app.use("/contact", require("./collections/contact"));
	app.use("/register", require("./collections/register"));
	app.use("/articles", require("./collections/articles"));
	app.use("/helping-form", require("./collections/help"));
};
