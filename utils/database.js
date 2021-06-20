const { NVarChar, VarBinary, TinyInt, SmallInt, Int } = require("mssql/msnodesqlv8");
const sql = require("mssql/msnodesqlv8");
const { DbEx } = require("./dbEx");
const { config } = require("./db_config");

class Database {
	constructor() {
		this.#db = DbEx.getExistingInstance();
		this.#db_config = config;
	}

	async connectToDB() {
		try{
			console.log("Connecting...");
			this.#db = await sql.connect(this.#db_config);
			console.log("Connected!!!");
		}
		catch(err) {
			console.log(err);
		}
	}

	async testQuery() {
		const resSet = await DbEx.getExistingInstance()
			.request()
			.query(`SELECT TOP 20 * FROM [${this.#db_config.database}].[dbo].[Users]; SELECT 1 AS NUMBER`);
		return resSet;
		// resSet.recordset.map((record) => {
		// 	console.log(record);
		// });
	}

	async registerUserSP(firstName, lastName, username, email, password, status) {
		try {
			const result = await this.#db.request()
				.input("FirstName", NVarChar, firstName)
				.input("LastName", NVarChar, lastName)
				.input("Username", NVarChar, username)
				.input("Email", NVarChar, email)
				.input("Password", NVarChar, password)
				.input("Status", TinyInt, status)
				.execute("RegisterAUser");
				console.log(result);
		} catch(e) {
			return 69;
		}
	}

	async verifyLoginSP(username, password) {
		try {
			const result = await this.#db.request()
				.input("Username", NVarChar, username)
				.input("Password", NVarChar, password)
				.output("IsVerified", Int)
				.output("RoleId", TinyInt)
				.output("Status", TinyInt)
				.execute("VerifyLogin")
			return {
				idVerified: result.output.IsVerified,
				roleId: result.output.RoleId,
				status: result.output.Status
			}
		} catch(e) {
			console.log("EXCEPTION THROWN!!!");
			console.log(e);
		}
	}

	// Private members
	#db_config
	#db
}

exports.Database = Database;
