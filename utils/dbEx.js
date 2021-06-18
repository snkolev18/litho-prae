const { config } = require("./db_config");
const sql = require("mssql/msnodesqlv8");

let dbInstance = null;

class DbEx {
	static async getInstance() {
		if (dbInstance === null) {
			console.log("Creating new instance of DbEx");
			dbInstance = await sql.connect(config);
		}
		else {
			console.log("Returning existing instance of DbEx");
		}

		return dbInstance;
	}

	static getExistingInstance() {
		return dbInstance;
	}
}

exports.DbEx = DbEx;
