const { config } = require("../utils/db_config");
const sql = require("mssql/msnodesqlv8");

class ArticleRepository {
	constructor() {
		this.options = config;
		this.connectToDB();
	}

	async connectToDB() {
		try{
			console.log("Connecting...");
			this.db = await sql.connect(this.options);
			console.log("Connected!!!");
		}
		catch(err) {
			console.log(err);
		}
	}

	async getAll() {
		const result = await this.db.request().query("SELECT * FROM vAllArticles");
		// return result
		return result.recordset;
	}

	// TO DO
	async create(article) {
		// exec SP (article.name, arg)
	}

	// TO DO: Implement SQL View to get a particular article
}

exports.ArticleRepository = ArticleRepository;
