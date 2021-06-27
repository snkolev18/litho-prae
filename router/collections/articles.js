const express = require("express");
const router = express.Router();
const Middlewares = require("../../middlewares/auth");
const { ArticleRepository } = require("../../repositories/ArticleRepository");
const { DbEx } = require("../../utils/dbEx");
const limiter = require("../../config/limiter_config");
let articles = undefined;

router.get("/view/:id", limiter.configureLimiter(5, 0.5), async function(req, res) {
	if(isNaN(req.params.id)) {
		res.status(400).render("error-page.ejs", {
			title: "Invalid article",
			statusCode: 400,
			message: "Invalid article ID."
		});
	}
	else {
		const id = parseInt(req.params.id);
		const article = await articles.getArticleById(id);
		if(!article) {
			res.status(404).render("error-page.ejs", {
				title: "Article not found",
				statusCode: 404,
				message: "We can't find the article you're looking for."
			});
		}
		else {
			// req.session.token.commenttingOnId = article.Id;
			const comments = await articles.getCommentsForArticle(article.Id);
			await articles.updateViewsForArticle(article.Id);
			res.render("test_viewArticle.ejs", {
				article: article,
				comments: comments,
				id: id
			});
		}
	}
});

router.post("/view/comment", Middlewares.isAuthenticated, limiter.configureLimiter(5, 5), async function(req, res) {
	const comment = req.body;

	const article = await articles.getArticleById(comment.articleId);
	if (!article) {
		res.status(404).render("error-page.ejs", {
			title: "Article not found",
			statusCode: 404,
			message: "We can't find the article you're looking for."
		});
		return;
	}

	const result = await articles.commentOnArticle(comment.comment, comment.articleId, req.session.token.id);
	console.log(result);
	res.redirect(`/articles/view/${comment.articleId}`);
	// delete req.session.token.commenttingOnId;
});

router.get("/new", Middlewares.isAuthenticated, async function(req, res) {
	res.render("test_createArticle.ejs");
});

router.post("/new", Middlewares.isAuthenticated, limiter.configureLimiter(10, 5), async function(req, res) {
	const article = req.body;
	console.log(`Receiving new article: ${article}`);
	await articles.create(article, new Date(), req.session.token.id);
});

router.get("/edit/:id", Middlewares.isAuthenticated, async function(req, res) {
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
			res.end();
			return;
		}
		if (req.session.token.id != articleForEdit.AuthorId) {
			res.status(404).render("error-page.ejs", {
				title: "Error occured",
				statusCode: 403,
				message: "Forbidden"
			});
			res.end();
			return;
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

router.post("/articles/edit", Middlewares.isAuthenticated, limiter.configureLimiter(3, 9), async function(req, res) {
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


module.exports = router;


(async () => {
	const s = await DbEx.getInstance();
	articles = new ArticleRepository();
	console.log("Connected");
})();
