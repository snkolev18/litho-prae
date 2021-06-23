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

	#db
	// TO DO: Implement SQL View to get a particular article
}

exports.ArticleRepository = ArticleRepository;
