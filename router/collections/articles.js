const express = require("express");
const router = express.Router();
const Middlewares = require("../../middlewares/auth");
const { ArticleRepository } = require("../../repositories/ArticleRepository");
const { DbEx } = require("../../utils/dbEx");
let articles = undefined;

router.get("/view/:id", Middlewares.isAuthenticated, async function(req, res) {
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

router.post("/view/comment", Middlewares.isAuthenticated, async function(req, res) {
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

router.get("/new", Middlewares.isAuthenticated, async function(req, res) {
	res.render("test_createArticle.ejs");
});

router.post("/new", Middlewares.isAuthenticated, async function(req, res) {
	const article = req.body;
	console.log(`Receiving new article: ${article}`);
	await articles.create(article, new Date(), req.session.token.id);
});

router.get("/edit/:id", Middlewares.isAuthenticated, async function(req, res) {
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

router.post("/articles/edit", Middlewares.isAuthenticated, async function(req, res) {
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
