const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();
const { ArticleRepository } = require("./repositories/ArticleRepository");
const { DbEx } = require("./utils/dbEx");
const { UserRepository } = require("./repositories/UserRepository");
const Middlewares = require("./middlewares/auth");
const helmet = require("helmet");
let db = undefined;
let articles = undefined;
const PORT = process.env.PORT || 1337;
const limiter = require("./config/limiter_config");
const inputValidation = require("./utils/validation");


// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.disable("x-powered-by");
app.use(helmet.contentSecurityPolicy(
	{
		useDefaults: false,
		directives: {

			/* ["'self'"]*/
			defaultSrc: helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
			scriptSrc: ["'self'", "https://unpkg.com/", "'unsafe-inline'"],
			objectSrc: ["'none'"],
			upgradeInsecureRequests: [],
			imgSrc: ["'self'", "https://i.imgur.com/", "https://media.giphy.com/media/Y4K9JjSigTV1FkgiNE/giphy.gif", "data:"],
			fontSrc: ["'self'", "https://fonts.gstatic.com/", "https://fonts.googleapis.com/", "https://cdn.jsdelivr.net/", "https://unpkg.com/", "data:"],
			childSrc: ["'none'"],
			styleSrc: ["'self'", "https://cdn.jsdelivr.net/", "https://i.imgur.com/", "https://unpkg.com/", "https://fonts.gstatic.com/", "https://fonts.googleapis.com/"]
		}
	}
), helmet.crossOriginResourcePolicy());


app.use("/styles", express.static("views/styles"));
app.use("/js", express.static("views/js"));
app.use("/img", express.static("views/img"));

// Configuring express to look for .ejs file in ./public directory
app.set("views", "./views");

app.use(session({
	secret: process.env.SESSION_SECRET,
	secure: true,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// Expires after 1 day
		expires: 24 * 60 * 60 * 1000
	}
}));

app.use(limiter.configureLimiter(60, 1));

require("./router/router")(app);

app.get("/", async function(req, res) {
	const sortedArticles = await articles.sortByViews();
	console.log(sortedArticles);
	if(req.session.token) {
		res.render("index.ejs", {
			logged: true,
			sortedArticles: sortedArticles
		});
	}
	else {
		res.render("index.ejs", {
			logged: true,
			sortedArticles: sortedArticles
		});
	}
});

app.get("/articles", async function(req, res) {
	const _articles_ = await articles.getAll();
	if(req.session.token) {
		res.render("articles.ejs", {
			articles: _articles_,
			logged: true
		});
	}
	else {
		res.render("articles.ejs", {
			articles: _articles_,
			logged: false
		});
	}
});

app.get("/login", function(req, res) {
	if(req.session.token) {
		res.render("login.ejs", { logged: true });
	}
	else {
		res.render("login.ejs", { logged: false });
	}
});

app.post("/login", async function(req, res) {
	const loginUsrData = req.body;
	console.log(loginUsrData);
	const result = await db.verifyLoginSP(loginUsrData.username, loginUsrData.password);
	console.log(result);

	if (result.idVerified) {
		req.session.token = {
			id: result.idVerified,
			username: loginUsrData.username,
			roleId: result.roleId,
			status: result.status
		};

		console.log(req.session.token);

		if (req.session.returnUrl) {
			res.redirect(req.session.returnUrl);
		}
		else {
			res.send("Qsha, lognat si");
			console.log(`Current user ${req.session.token.username}`);
		}
	}
	else {
		res.send("Qsha, Ne si lognat");
	}
});

app.get("/taenpanel", Middlewares.isAdmin, async function(req, res) {
	res.send("Opa shefe");
});

app.get("/taenpanel/articles", Middlewares.isAdmin, async function(req, res) {
	const _articles_ = await articles.getAll();
	const tags = await articles.getAllTags();
	console.log(_articles_);
	res.render("test_adminArticles.ejs", {
		articles: _articles_,
		tags: tags
	});
});

app.get("/taenpanel/articles/edit/:id", Middlewares.isAdmin, async function(req, res) {
	if(isNaN(req.params.id)) {
		res.status(400).render("error-page.ejs", {
			title: "Invalid article",
			statusCode: 400,
			message: "Invalid article ID."
		});
	}
	else {
		const id = parseInt(req.params.id);
		const articleForEdit = await articles.getArticleById(id);
		if(!articleForEdit) {
			res.status(404).render("error-page.ejs", {
				title: "Article not found",
				statusCode: 404,
				message: "We can't find the article you're looking for."
			});
		}
		else{
			res.render("test_editArticle.ejs", {
				article: articleForEdit,
				id: id
			});
		}
	}
});

app.post("/taenpanel/articles/edit", Middlewares.isAdmin, async function(req, res) {
	const article = req.body;
	console.log(`Trying to edit article: ${article}`);

	const result = await articles.update(article);
	console.log(result);

	res.redirect("/taenpanel/articles");
});

app.post("/taenpanel/articles/delete", Middlewares.isAdmin, async function(req, res) {
	const articleForDelete = await articles.getArticleById(req.body.id);
	console.log(articleForDelete);
	if(!articleForDelete) {
		res.status(404).render("error-page.ejs", {
			title: "Article not found",
			statusCode: 404,
			message: "We can't find the article you're looking for."
		});
		return;
	}

	const result = await articles.delete(req.body.id);
	console.log(`Result of article deletion: ${result}`);
	res.redirect("/taenpanel/articles");
});

app.post("/taenpanel/articles/approve", Middlewares.isAdmin, async function(req, res) {
	const id = req.body.id;

	const article = await articles.getArticleById(id);
	if(!article) {
		res.status(404).render("error-page.ejs", {
			title: "Article not found",
			statusCode: 404,
			message: "We can't find the article you're looking for."
		});
		return;
	}
	const result = await articles.approve(id);
	console.log(`Successfully approved article with id ${id}`);
	res.redirect("/taenpanel/articles");
});

app.get("/taenpanel/articles/tags", Middlewares.isAdmin, function(req, res) {
	const errors = req.session.tagErrors;
	res.render("createTag.ejs", {
		errors: errors
	});
});

app.post("/taenpanel/articles/tags", Middlewares.isAdmin, async function(req, res) {
	const tagName = req.body.tag;
	const errors = inputValidation.checkTagData(tagName);
	console.log(errors);
	if (errors.length) {
		req.session.tagErrors = errors;
		console.log(req.session.tagErrors);
	}
	else {
		req.session.tagErrors = [];
		const result = await articles.createTag(tagName);
		console.log(result);
	}
	res.redirect("/taenpanel/articles/tags");
});

app.get("/aboutus", function(req, res) {
	if(req.session.token) {
		res.render("about-us.ejs", { logged: true });
	}
	else {
		res.render("about-us.ejs", { logged: false });
	}
});

app.get("/logout", function(req, res) {
	req.session.token = null;
	res.redirect("/");
});

app.get("*", function(_, res) {
	res.status(404).render("error-page.ejs", {
		title: "Page not found",
		statusCode: 404,
		message: "We can't find the page you're looking for."
	});
});


app.use(async (req, res, next) => {
	console.log("DEFAULT EXCEPTION HANDLER");
	next();
});

app.listen(PORT, async () => {
	// console.log(results);
	console.log("Connecting to DB...");
	// await db.connectToDB();
	console.log("Raboti");
	const s = await DbEx.getInstance();
	// const s2 = await DbEx.getInstance();
	db = new UserRepository();
	articles = new ArticleRepository();
});
