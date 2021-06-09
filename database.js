const sql = require("mssql/msnodesqlv8");

class Database {
	constructor(db_name, instance, trCnn, encrypt_) {
		this.db_config = {
			database: db_name,
			server: instance,
			pool: {
				max: 10,
				min: 0,
				idleTimeoutMillis: 30000
			},
			options: {
				trustedConnection: trCnn,
				// for Azure
				encrypt: encrypt_,
				// change to true for local dev / self-signed certs
				trustServerCertificate: false
			}
		};
		this.db = undefined;
	}

	async connectToDB() {
		try{
			console.log("Connecting...");
			this.db = await sql.connect(this.db_config);
			console.log("Connected!!!");
		}
		catch(err) {
			console.log(err);
		}
	}

	async testQuery() {
		const resSet = await this.db.request().query(`SELECT TOP 20 * FROM [${this.db_config.database}].[dbo].[Users]; SELECT 1 AS NUMBER`);
		return resSet;
		// resSet.recordset.map((record) => {
		// 	console.log(record);
		// });
	}
}

exports.Database = Database;
