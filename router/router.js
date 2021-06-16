module.exports = function (app) {
	app.use("/contact", require("./collections/contact"));
};
