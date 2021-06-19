function isAuthenticated(req, res, next) {
	// Ako ne e authenticated go prashta na /login
	if (!req.session.token) {
		req.session.returnUrl = req.originalUrl;
		res.redirect("/login");
		return;
	}

	// Ako e vika sledvashtiq middleware
	next();
}

function isAdmin(req, res, next) {
	if(req.session.token) {
		if(req.session.token.username === "rootcheto") {
			next();
		}
		else{
			res.status(401).send("You are not allowed to view that page");
		}
	}
	else {
		res.redirect("/login");
	}
}

exports.isAuthenticated = isAuthenticated;
exports.isAdmin = isAdmin;
