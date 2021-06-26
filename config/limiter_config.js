const rateLimit = require("express-rate-limit");


function configureLimiter(maxRequests, perMinutes, statusCodeOnFail = 429) {
	const apiLimiter = rateLimit({
		windowMs: perMinutes * 60 * 1000,
		max: maxRequests,
		handler: (req, res, next) => {
			res.status(statusCodeOnFail).render("error-page.ejs", {
				title: "Too many requests",
				statusCode: statusCodeOnFail,
				message: "You have exceeded your requests"
			});
		}
	});
	return apiLimiter;
}

module.exports.configureLimiter = configureLimiter;
