const { config } = require("../config/db_config");
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
			console.error(err);
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
	async create(article, authorId) {
		// exec SP (article.name, arg)
		try {
			const result = await this.#db.request()
				.input("Title", NVarChar, article.title)
				.input("Content", NVarChar, article.content)
				.input("AuthorId", NVarChar, authorId)
				.execute("CreateNewArticle");
			console.log(result);
		}
		catch(err) {
			console.error(err);
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
			console.error(err);
		}
	}

	async delete(id) {
		try {
			const result = await this.#db.request()
				.input("Id", Int, id)
				.execute("DeleteArticle");
			console.log(result);
		} catch(err) {
			console.error(err);
		}
	}

	async commentOnArticle(comment, articleId, authorId) {
		try {
			const result = await this.#db.request()
				.input("Comment", NVarChar, comment)
				.input("ArticleId", Int, articleId)
				.input("AuthorId", Int, authorId)
				.execute("CommentOnArticle");
			console.log(result);
		}
		catch(err) {
			console.error(err);
		}
	}

	async getCommentsForArticle(articleId) {
		const comments = await this.#db.request().query`SELECT * FROM vGetCommentsForArticle WHERE ArticleId = ${articleId}`;
		if (comments) {
			return comments.recordset;
		}
		return "Error";
	}

	async updateViewsForArticle(articleId) {
		try {
		const result = await this.#db.request()
			.input("ArticleId", Int, articleId)
			.execute("AddViewsForArticle");
		console.log(result);
		}
		catch (err) {
			console.error(err);
		}
	}

	async approve(id) {
		try {
		const result = await this.#db.request()
			.input("Id", Int, id)
			.execute("ApproveArticle");
		console.log(result);
		}
		catch (err) {
			console.error(err);
		}
	}

	async assignTagToArticle(articleId, tagId) {
		try {
			const result = await this.#db.request()
				.input("TagId", Int, tagId)
				.input("ArticleId", Int, articleId)
				.execute("AssignTagToArticle")
			console.log(result);
		}
		catch (err) {
			console.log(err);
			return 1337;
		}
	}

	async createTag(name) {
		try {
			const result = await this.#db.request()
				.input("Name", NVarChar, name)
				.execute("CreateTag")
			console.log(result);
		}
		catch(err) {
			console.log(err);
		}
	}


	async getAllTags() {
		try {
			const tags = await this.#db.request().query`SELECT Id, Name FROM Tags ORDER BY Id ASC`
			return tags.recordset;
		}
		catch (err) {
			console.log(err)
		}
	}

	#db
}

exports.ArticleRepository = ArticleRepository;
