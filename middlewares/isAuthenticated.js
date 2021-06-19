function isAuthenticated(req, res, next) {
	if (!req.session.token) {
		req.session.returnUrl = req.originalUrl;
		res.redirect("/login");
		return;
	}
	next();
}

module.exports.isAuthenticated = isAuthenticated;
