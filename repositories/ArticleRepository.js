const { config } = require("../utils/db_config");
const sql = require("mssql/msnodesqlv8");
const { NVarChar, DateTime2, TinyInt, Int } = require("mssql/msnodesqlv8");
const { DbEx } = require("../utils/dbEx");

class ArticleRepository {
	constructor() {
		this.options = config;
		this.#db = DbEx.getExistingInstance();
		console.log("ArticleRepository ctor");
	}

	async connectToDB() {
		try{
			console.log("Connecting...");
			this.#db = await sql.connect(this.options);
			console.log("Connected!!!");
		}
		catch(err) {
			console.log(err);
		}
	}

	async getAll() {
		const result = await this.#db.request().query("SELECT * FROM vAllArticles");
		// return result
		return result.recordset;
	}

	async getArticleById(id) {
		const articleOut = await this.#db.request().query`SELECT * FROM vAllArticles WHERE Id = ${id}`;
		if (articleOut) {
			return articleOut.recordset[0];
		}
		return "Article not found";
	}

	// TO DO
	async create(article, time, authorId) {
		// exec SP (article.name, arg)
		try {
			const result = await this.#db.request()
				.input("Title", NVarChar, article.title)
				.input("Content", NVarChar, article.content)
				.input("AuthorId", NVarChar, authorId)
				.input("CreatedAt", DateTime2, time)
				.execute("CreateNewArticle");
			console.log(result);
		}
		catch(err) {
			console.log(err);
		}
	}

	async update(article) {
		try {
			const result = await this.#db.request()
				.input("Id", Int, article.id)
				.input("Title", NVarChar, article.title)
				.input("Content", NVarChar, article.content)
				.execute("UpdateArticle");
			console.log(result);
		}
		catch(err) {
			console.log(err);
		}
	}

	async delete(id) {
		try {
			const result = await this.#db.request()
				.input("Id", Int, id)
				.execute("DeleteArticle")
				console.log(result);
		} catch(err) {
			console.log(err);
		}
	}

	async commentOnArticle(comment, articleId, authorId) {
		try {
			const result = await this.#db.request()
				.input("Comment", NVarChar, comment)
				.input("ArticleId", Int, articleId)
				.input("AuthorId", Int, authorId)
				.execute("CommentOnArticle")
				console.log(result);
		}
		catch(err) {
			console.log(err);
		}
	}

	async getCommentsForArticle(articleId) {
		const comments = await this.#db.request().query`SELECT * FROM vGetCommentsForArticle WHERE ArticleId = ${articleId}`;
		if (comments) {
			return comments.recordset;
		}
		return "Error";
	}

	#db
}

exports.ArticleRepository = ArticleRepository;
