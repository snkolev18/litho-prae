const { should } = require("chai");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../router/collections/contact");

chai.should();
chai.use(chaiHttp);

describe("Testing the application routes", () => {

	describe("GET / (main route)", () => {
		it("It should make a GET request to the main route", (done) => {
			chai.request(app).get("/contact").end((err, res) => {
				res.should.have.status(200);
			});
		});
	});

});
