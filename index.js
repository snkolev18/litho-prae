const express 		= require("express");
const bodyParser 	= require("body-parser");
const session 		= require("express-session");
const app 			= express();
// const { Database } 	= require("./utils/database");
const { log } 		= require("./log/logging");
const { ArticleRepository } = require("./repositories/ArticleRepository");
const { DbEx } = require("./utils/dbEx");
const { UserRepository } = require("./repositories/UserRepository");
const inputValidation = require("./utils/validation");
const Middlewares = require("./middlewares/auth");
const helmet 		= require("helmet");
let db 			= undefined;
let articles = undefined;
const PORT 			= process.env.PORT || 1337;

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));
app.disable("x-powered-by");
// app.use(helmet());
app.use(helmet.contentSecurityPolicy(
	{
		useDefaults: false,
		directives: {

			/* ["'self'"]*/
			defaultSrc: helmet.contentSecurityPolicy.dangerouslyDisableDefaultSrc,
			scriptSrc: ["'self'", "https://unpkg.com/", "'unsafe-inline'"],
			objectSrc: ["'none'"],
			upgradeInsecureRequests: [],
			imgSrc: ["'self'", "https://i.imgur.com/", "https://media.giphy.com/media/Y4K9JjSigTV1FkgiNE/giphy.gif"],
			fontSrc: ["'self'", "https://fonts.gstatic.com/", "https://fonts.googleapis.com/", "https://cdn.jsdelivr.net/", "https://unpkg.com/", "data:"],
			childSrc: ["'none'"],
			styleSrc: ["'self'", "https://cdn.jsdelivr.net/", "https://i.imgur.com/", "https://unpkg.com/", "https://fonts.gstatic.com/", "https://fonts.googleapis.com/"]
		}
	}
), helmet.crossOriginResourcePolicy());


app.use("/styles", express.static("views/styles"));
app.use("/js", express.static("views/js"));

// Configuring express to look for .ejs file in ./public directory
app.set("views", "./views");

app.use(session({
	secret: "keyboard cat",
	secure: true,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// Expires after 1 day
		expires: 24 * 60 * 60 * 1000
	}
}));

require("./router/router")(app);

app.get("/", async function(req, res) {
	// const results = await db.testQuery();
	// res.json(results);
	res.render("index.ejs");
});

app.get("/register", function(req, res) {
	log.info("Invoking register");
	const errors = req.session.errors;
	res.render("test_register.ejs", { errors });
});

app.post("/registerUser", async function(req, res) {

	const usrData = req.body;
	log.info(usrData, `Trying to register a user ${usrData.email}`);
	console.log(usrData);
	const errors = inputValidation.checkUserRegistrationData(usrData);
	if (errors.length) {
		req.session.errors = errors;
	}
	else {
		req.session.errors = [];
		const sc = await db.registerUserSP(usrData.fname, usrData.lname, usrData.usr, usrData.email, usrData.psw, 0);
		if (sc) req.session.errors.push({ message : "Account with this username or email already exist!" });
	}
	res.redirect("/register");
});

app.get("/articles", Middlewares.isAuthenticated, async function(req, res) {
	const _articles_ = await articles.getAll();
	res.json(_articles_);
});

app.get("/login", function(req, res) {
	if(req.session.token) {
		req.session.token = null;
	}
	res.render("test_login.ejs");
});

app.post("/login", async function(req, res) {
	const loginUsrData = req.body;
	console.log(loginUsrData);
	const result = await db.verifyLoginSP(loginUsrData.usr, loginUsrData.psw);
	console.log(result);

	if (result.idVerified) {
		req.session.token = {
			id: result.idVerified,
			username: loginUsrData.usr,
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
	console.log(_articles_);
	res.render("test_adminArticles.ejs", {
		articles: _articles_
	});
});

app.get("/taenpanel/articles/edit/:id", Middlewares.isAdmin, async function(req, res) {
	if(isNaN(req.params.id)) {
		res.render("404-page.ejs", { title: "Invalid article" });
	}
	else {
		const id = parseInt(req.params.id);
		const articleForEdit = await articles.getArticleById(id);
		if(!articleForEdit) {
			res.status(404).render("404-page.ejs", { title: "Article not found" });
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

// /articles/:id/comments/:commentId

app.get("/articles/view/:id", Middlewares.isAuthenticated, async function(req, res) {
	if(isNaN(req.params.id)) {
		res.render("404-page.ejs", { title: "Invalid article" });
	}
	else {
		const id = parseInt(req.params.id);
		const article = await articles.getArticleById(id);
		if(!article) {
			res.status(404).render("404-page.ejs", { title: "Article not found" });
		}
		else {
			req.session.token.commenttingOnId = article.Id;
			const comments = await articles.getCommentsForArticle(article.Id);
			res.render("test_viewArticle.ejs", {
				article: article,
				comments: comments,
				id: id
			});
		}
	}
});

app.post("/articles/view/comment", Middlewares.isAuthenticated, async function(req, res) {
	const comment = req.body;

	const article = await articles.getArticleById(comment.articleId);
	if (!article) {
		res.status(404).render("404-page.ejs", { title: "Article not found" });
		return;
	}

	const result = await articles.commentOnArticle(comment.comment, comment.articleId, req.session.token.id);
	console.log(result);
	res.redirect(`/articles/view/${comment.articleId}`);
	delete req.session.token.commenttingOnId;
});

app.get("/articles/new", Middlewares.isAuthenticated, async function(req, res) {
	res.render("test_createArticle.ejs");
});

app.post("/articles/new", Middlewares.isAuthenticated, async function(req, res) {
	const article = req.body;
	console.log(`Receiving new article: ${article}`);
	await articles.create(article, new Date(), req.session.token.id);
});

app.get("/articles/edit/:id", Middlewares.isAuthenticated, async function(req, res) {
	if(isNaN(req.params.id)) {
		res.render("404-page.ejs", { title: "Invalid article" });
	}
	else {
		const id = parseInt(req.params.id);
		const articleForEdit = await articles.getArticleById(id);
		if(!articleForEdit) {
			res.status(404).render("404-page.ejs", { title: "Article not found" });
			res.end();
			return;
		}
		if (req.session.token.id != articleForEdit.AuthorId) {
			res.redirect("/");
		}
		else{
			req.session.token.articleAuthorId = articleForEdit.AuthorId;
			res.render("test_editArticleUser.ejs", {
				article: articleForEdit,
				articleId: articleForEdit.Id,
				authorId: articleForEdit.AuthorId
			});
		}
	}
});

app.post("/articles/edit", Middlewares.isAuthenticated, async function(req, res) {
	console.log(`${req.session.token.id} --- ${req.body.authorId}`);
	if (req.session.token.id == req.body.authorId) {
		const article = req.body;
		console.log(req.body);

		const result = await articles.update(article);
		console.log(result);

		res.send("Bombata");
	}
	else {
		res.send("Ne mojesh da editnesh tozi article");
	}
});


app.get("*", function(_, res) {
	res.status(404).render("404-page.ejs", { title: "Page not found" });
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
