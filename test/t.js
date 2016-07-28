var expect = require("chai").expect;
var Dropigee = require("../src/Dropigee.js").Dropigee;

var valid_credential = {
	client_id: "fc84eb5649f78ed87fcf45e0a022913486e486f037b722978f04a6cfa4933298",
	client_secret: "f1e09b962b9da4cdb788309dde5946830c161e56e99e093fcaa2ae03f01f15aa",
	grant_type: 'client_credentials',
	scope: 'write:drop'
};


var invalid_credential = {
	client_id: "xxxxxx",
	client_secret: "zzzzzz",
	grant_type: 'client_credentials',
	scope: ''
};


describe("Dropigee.js test suite", function() {
	describe("\n - check out public API", function() {
		it("should have a public authorize method", function() {
			expect(Dropigee).to.have.any.keys("authorize");
		});

		it("authorize should be a function", function() {
			expect(Dropigee.authorize).to.be.a('function');
		});

		it("should have a public set_credential method", function() {
			expect(Dropigee).to.have.any.keys("set_credential");
		});

		it("set_credential should be a function", function() {
			expect(Dropigee.set_credential).to.be.a('function');
		});


		it("should have a public index_drops method", function() {
			expect(Dropigee).to.have.any.keys("index_drops");
		});

		it("index_drops should be a function", function() {
			expect(Dropigee.index_drops).to.be.a('function');
		});


		it("should have a public show_drop method", function() {
			expect(Dropigee).to.have.any.keys("show_drop");
		});

		it("show_drop should be a function", function() {
			expect(Dropigee.show_drop).to.be.a('function');
		});

		it("should have a public index_drops method", function() {
			expect(Dropigee).to.have.any.keys("index_drops");
		});

		it("index_drops should be a function", function() {
			expect(Dropigee.index_drops).to.be.a('function');
		});

		it("should have a public update_drop method", function() {
			expect(Dropigee).to.have.any.keys("update_drop");
		});

		it("update_drop should be a function", function() {
			expect(Dropigee.update_drop).to.be.a('function');
		});

		it("should have a public destroy_drop method", function() {
			expect(Dropigee).to.have.any.keys("destroy_drop");
		});

		it("destroy_drop should be a function", function() {
			expect(Dropigee.destroy_drop).to.be.a('function');
		});

		it("should have a public create_drop method", function() {
			expect(Dropigee).to.have.any.keys("create_drop");
		});

		it("create_drop should be a function", function() {
			expect(Dropigee.create_drop).to.be.a('function');
		});
	});

	describe("\n - call Dropigee.authorize() with a valid credential", function() {
		var statusCode = 0,
			statusMessage = '';
		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {


					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				onError: function(response) {

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: valid_credential
			});
		});

		it("statusCode should be 200", function() {
			expect(statusCode).to.be.equal(200);
		});

		it("statusMessage should be OK", function() {
			expect(statusMessage).to.be.equal('OK');
		});
	});


	describe("\n - call Dropigee.authorize() with a invalid credential", function() {
		var statusCode = 0,
			statusMessage = '';
		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				onError: function(response) {

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: invalid_credential
			});
		});

		it("statusCode should be 401", function() {
			expect(statusCode).to.be.equal(401);
		});

		it("statusMessage should be Unauthorized", function() {
			expect(statusMessage).to.be.equal('Unauthorized');
		});
	});




	describe("\n - call Dropigee.index_drops()", function() {
		var statusCode = 0,
			statusMessage = '',
			drops = null;
		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {

					Dropigee.index_drops({
						super_cell: 'mycell',
						onSuccess: function(response) {

							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							drops = response.drops;

							done();
						},
						onError: function(response) {

							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							done();
						}
					});



					//console.log( response.response );
				},
				onError: function(response) {
					//console.log( response.message );
					//console.log( response.data );
					//console.log( response.statusCode );
					//console.log( response.statusMessage );
					//console.log( response.status );

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: valid_credential
			});
		});

		it("statusCode should be 200", function() {
			expect(statusCode).to.be.equal(200);
		});
		it("returned drops should be array", function() {
			expect(drops).to.be.instanceof(Array);
		});

	});


	describe("\n - call Dropigee.index_drops() with a invalid supercell", function() {
		var statusCode = 0,
			statusMessage = '',
			drops = null;

		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {

					Dropigee.index_drops({
						super_cell: 'mycel',
						onSuccess: function(response) {

							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							drops = response.drops;

							done();
						},
						onError: function(response) {

							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							done();
						}
					});



					//console.log( response.response );
				},
				onError: function(response) {
					//console.log( response.message );
					//console.log( response.data );
					//console.log( response.statusCode );
					//console.log( response.statusMessage );
					//console.log( response.status );

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: valid_credential
			});
		});

		it("statusCode should be 404", function() {
			expect(statusCode).to.be.equal(404);
		});

	});


	describe("\n - call Dropigee.show_drop()", function() {
		var statusCode = 0,
			statusMessage = '',
			drop = null;

		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {

					Dropigee.show_drop({
						super_cell: 'mycell',
						id: 'xkhz-n0',
						onSuccess: function(response) {

							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							drop = response.drop;


							done();
						},
						onError: function(response) {
							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							done();
						}
					});

				},
				onError: function(response) {

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: valid_credential
			});
		});

		it("statusCode should be 200", function() {
			expect(statusCode).to.be.equal(200);
		});
		it("returned drop should be object", function() {
			expect(drop).to.be.an('object');
		});

	});


	describe("\n - call Dropigee.show_drop() with a invalid id", function() {
		var statusCode = 0,
			statusMessage = '',
			drop = null;

		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {

					Dropigee.show_drop({
						super_cell: 'mycell',
						id: '9r-hj7',
						onSuccess: function(response) {

							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							drop = response.drop;


							done();
						},
						onError: function(response) {
							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							done();
						}
					});

				},
				onError: function(response) {

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: valid_credential
			});
		});

		it("statusCode should be 404", function() {
			expect(statusCode).to.be.equal(404);
		});


	});

	describe("\n - call Dropigee.show_drop() with a invalid supercell", function() {
		var statusCode = 0,
			statusMessage = '',
			drop = null;

		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {

					Dropigee.show_drop({
						super_cell: 'mycel',
						id: 'xkhz-n0',
						onSuccess: function(response) {

							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							drop = response.drop;


							done();
						},
						onError: function(response) {
							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							done();
						}
					});

				},
				onError: function(response) {

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: valid_credential
			});
		});

		it("statusCode should be 404", function() {
			expect(statusCode).to.be.equal(404);
		});


	});



	describe("\n - call Dropigee.update_drop()", function() {
		var statusCode = 0,
			statusMessage = '',
			drop = null;

		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {

					Dropigee.update_drop({
						super_cell: 'mycell',
						id: 'xkhz-n0',
						tags: 'these,are,tags',
						private: true,
						versioned: true,
						onSuccess: function(response) {

							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							drop = response.drop;


							done();
						},
						onError: function(response) {
							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							done();
						}
					});

				},
				onError: function(response) {

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: valid_credential
			});
		});

		it("statusCode should be 200", function() {
			expect(statusCode).to.be.equal(200);
		});
		it("returned drop should be object", function() {
			expect(drop).to.be.an('object');
		});

	});


	describe("\n - call Dropigee.create_drop()", function() {
		var statusCode = 0,
			statusMessage = '',
			drop;
		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {

					Dropigee.create_drop({
						super_cell: 'mycell',
						file: __dirname + '/db.xml',
						tags: 'these,are,tags',

						onSuccess: function(response) {
							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							drop = response.drop;
							done();
						},
						onError: function(response) {
							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							done();
						}
					});

				},
				onError: function(response) {

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: valid_credential
			});
		});

		it("statusCode should be 200", function() {
			expect(statusCode).to.be.equal(200);
		});

		it("returned drop should be object", function() {
			expect(drop).to.be.an('object');
		});


	});

	describe("\n - create new drop AND call Dropigee.create_destroy()", function() {
		var statusCode = 0,
			statusMessage = '',
			drop;
		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {

					Dropigee.create_drop({
						super_cell: 'mycell',
						file: __dirname + '/db.xml',
						tags: 'these,are,tags',

						onSuccess: function(response) {
							//statusMessage = response.statusMessage;
							//statusCode = response.statusCode;
							drop = response.drop;

							Dropigee.destroy_drop({
								super_cell: 'mycell',
								id: drop.id,
								onSuccess: function(response) {
									statusMessage = response.statusMessage;
									statusCode = response.statusCode;
									done();
								},
								onError: function(response) {
									statusMessage = response.statusMessage;
									statusCode = response.statusCode;
									done();
								}
							});
						},
						onError: function(response) {
							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							done();
						}
					});

				},
				onError: function(response) {

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: valid_credential
			});
		});

		it("statusCode should be 204", function() {
			expect(statusCode).to.be.equal(204);
		});
	});

	describe("\n - call Dropigee.destroy_drop() with a invalid id", function() {
		var statusCode = 0,
			statusMessage = '';
		this.timeout(15000);
		beforeEach(function(done) {
			Dropigee.authorize({
				onSuccess: function(response) {

					Dropigee.destroy_drop({
						super_cell: 'mycell',
						id: 'd2m9r00',
						onSuccess: function(response) {
							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							done();
						},
						onError: function(response) {
							statusMessage = response.statusMessage;
							statusCode = response.statusCode;
							done();
						}
					});

				},
				onError: function(response) {

					statusMessage = response.statusMessage;
					statusCode = response.statusCode;
					done();
				},
				credential: valid_credential
			});
		});

		it("statusCode should be 404", function() {
			expect(statusCode).to.be.equal(404);
		});


	});
});