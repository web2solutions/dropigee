/*jslint devel: true */
var Client = require('node-rest-client').Client,
	fs = require('fs'),
	request = require('request');
exports.Dropigee = (function() {
	'strict';
	var _private,
		_public;

	_private = {
			api_url: "https://api.dropigee.com/",
			auth_url: "https://www.dropigee.com/",
			authorized: false,
			credential: {
				client_id: null,
				client_secret: null,
				grant_type: null,
				scope: null
			},
			OAuth2: null,
			client: new Client(),
			auth_required_fields: ['client_id', 'client_secret', 'grant_type'],
			default_headers: function() {
				return {
					"Authorization": "Bearer " + _private.OAuth2.access_token,
					"Content-Type": "application/json",
					"Accept": "application/vnd.dropigee.v1+json"
				};
			},
			isArray: function(what) {
				return Object.prototype.toString.call(what) === '[object Array]';
			},
			isObject: function(what) {
				return ((typeof what == "object") && (what !== null) && (Object.prototype.toString.call(what) !== '[object Array]'));
			},
			error: function(response, data) {
				var str_message = '',
					code = response.statusCode || 0;

				if (code === 404)
					str_message = 'Not found';
				else if (code === 422)
					str_message = 'Invalid parameter specified';
				else if (code === 401)
					str_message = 'Unauthorized';
				else if (code === 412)
					str_message = 'Precondition Failed';
				else if (code === 400)
					str_message = 'Bad request. Imcomplete file body';
				else
					str_message = response.statusMessage;

				this.message = str_message;
				this.response = response;
				this.status = 'error';
				this.statusMessage = response.statusMessage || '';
				this.statusCode = response.statusCode;
				if (data) {
					data = data.toString('utf8');
				}
				this.data = data || null;
			},
			paginator: function( payload ) {
				this.url = '';
				if( Object.keys(payload).length > 0 )
				{
					this.url = this.url + "?";
				}

				for( var i in payload )
				{
					if( payload[i] != '')
						this.url = this.url + i + "=" + payload[i] + "&";
				}

				if( Object.keys(payload).length > 0 )
				{
					this.url = this.url.substring(0, this.url.length - 1)
				}
			},
			set_credential: function(credential) {
				var self = _private;
				if (!self.isObject(credential)) {
					throw 'credential must be a valid JSON object';
				}
				this.auth_required_fields.forEach(function(field) {
					if (typeof credential[field] === 'undefined') {
						throw 'credential.' + field + ' must be provided';
					}
				});

				credential.scope = credential.scope || '';

				if (credential.grant_type != "client_credentials" && credential.grant_type != "authorization") {
					throw 'The grant type must be equal to client_credentials or authorization';
				}

				if (credential.scope !== "" && credential.scope != "read:drop" && credential.scope != "write:drop") {
					throw 'The scope must be write:drop, read:drop or "" (empty - defaut.). Default is read:drop.';
				}
				self.credential = credential;
			},
			authorize: function(c) {
				var self = _private,
					args;

				if (c.credential) {
					if (self.isObject(c.credential)) {
						self.set_credential(c.credential);
					}
				}

				for (x = 0; x < self.auth_required_fields.length; x++) {
					var field = self.auth_required_fields[x];
					if (self.credential[field] === null) {
						if (c.onError) {
							//console.log( self.credential );
							c.onError({
								message: 'credential.' + field + ' is required. Please call set_credentials() method first.',
								data: 'api not called yet',
								response: {},
								status: 'error',
								statusMessage: 'api not called yet',
								statusCode: 'api not called yet'
							});
						}
						//throw 'credential.'+field+' is required. Please call set_credentials() method first.';
						return;
					}
				}

				args = {
					data: {
						client_id: self.credential.client_id,
						client_secret: self.credential.client_secret,
						grant_type: self.credential.grant_type,
						scope: self.credential.scope
					},
					headers: {
						"Content-Type": "application/json",
						"Accept": "application/vnd.dropigee.v1+json"
					}
				};

				self.client.post(self.auth_url + "oauth/token/", args, function(data, response) {
					if (response.statusCode == 200) {
						var dataObject = JSON.parse(data.toString('utf8'));
						self.OAuth2 = dataObject;
						//console.log( self.OAuth2 );
						if (c.onSuccess) {
							c.onSuccess({
								message: 'Authorized',
								data: dataObject,
								response: response,
								status: 'success',
								statusMessage: response.statusMessage,
								statusCode: response.statusCode
							});
						}
						self.authorized == true;
					} else {
						if (c.onError) {
							c.onError(new _private.error(response, data));
						}
					}
				});
			},

			show_drop: function(c) {
				var self = _private,
					args,
					end_point;
				/**
				 * c = {
				 * 	super_cell : '',
				 * 	id : '',
				 * 	onSuccess : function( response ){
				 * 	
				 * 	},
				 * 	onError : function( response ){
				 * 	
				 * 	}
				 * }
				 */

				if (typeof c.super_cell === 'undefined') {
					throw 'the super_cell parameter is missing';
				}
				if (typeof c.id === 'undefined') {
					throw 'the id parameter is missing';
				}

				args = {
					headers: self.default_headers()
				};

				end_point = self.api_url + "supercells/" + encodeURIComponent(c.super_cell) + "/drops/" + encodeURIComponent(c.id) + "/";

				self.client.get(end_point, args, function(data, response) {
					if (response.statusCode == 200) {
						var dataObject = JSON.parse(data.toString('utf8'));
						if (c.onSuccess) {
							c.onSuccess({
								message: 'Found',
								data: dataObject,
								response: response,
								status: 'success',
								statusMessage: response.statusMessage,
								statusCode: response.statusCode,
								drop: dataObject.drop
							});
						}
					} else {
						if (c.onError) {
							c.onError(new _private.error(response, data));
						}
					}
				});
			},
			index_drops: function(c) {
				var self = _private,
					args,
					end_point;
				/**
				 * c = {
				 * 	super_cell : '',
				 * 	params : {
				 * 		q : '',
				 * 		strict_q : false,
				 * 		relevant : false,
				 * 		tags : '',
				 * 		strict_tags : false,
				 * 		private : false,
				 * 		versioned : false,
				 * 		per_page : 30,
				 *		page : 1
				 * 	},
				 * 	onSuccess : function( response ){
				 * 	
				 * 	},
				 * 	onError : function( response ){
				 * 	
				 * 	}
				 * }
				 */

				/*
				
				q              string    Keywords that can match either the name, mime_type or source of a Drop. (e.g. press pdf chrome)
				strict_q       boolean   Default: false. True, Drops matching ALL Keywords will be returned. False, Drops matching ANY Keyword will be returned.
				relevant       boolean   Default: false. True, Drops are sorted by their relevance to the Keywords in descending order. False, Drops are sorted by created_at in descending order.
				tags           string    A comma separated list of terms that identify a group of Drops. (e.g. these,are,tags)
				strict_tags    boolean   Default: false. True, Drops matching ALL Tags will be returned. False, Drops matching ANY Tag will be returned.
				private        boolean   Only Private Drops will be returned.
				versioned      boolean   Only Versioned Drops will be returned.
				per_page       int       How much results to return per request. Default is 30. Maximum is 100.
				page           int       From which page to start returning results. Default is 1 - first page.

				 */
				
				c.params = c.params || {};
				c.params.page = c.params.page || 1;
				c.params.per_page = c.params.per_page || 30;

				if (typeof c.super_cell === 'undefined') {
					throw 'the super_cell parameter is missing';
				}

				args = {
					headers: self.default_headers()
				};

				end_point = self.api_url + "supercells/" + encodeURIComponent(c.super_cell) + "/drops/" 
					+ ( new _private.paginator( c.params ).url );

				self.client.get(end_point, args, function(data, response) {
					if (response.statusCode == 200) {
						var dataObject = JSON.parse(data.toString('utf8'));
						var links = {};
						var links_list = response.headers.link.split(',');

						links_list.forEach(function( link_string ){
							var link = link_string.match("<(.*)>")[1];
							var rel = link_string.match('rel="(.*)"')[1];
							links[rel] = link;
						});						

						if (c.onSuccess) {
							c.onSuccess({
								message: 'Found',
								data: dataObject,
								response: response,
								status: 'success',
								statusMessage: response.statusMessage,
								statusCode: response.statusCode,
								drops: dataObject.drops,
								total: response.headers.total,
								'per-page' : response.headers['per-page'],
								links : links,
								page : c.params.page
							});
						}
					} else {
						if (c.onError) {
							c.onError(new _private.error(response, data));
						}
					}
				});
			},
			all_drops: function(c) {
				var self = _private,
					args,
					end_point;
				/**
				 * c = {
				 * 	super_cell : '',
				 * 	params : {
				 * 		q : '',
				 * 		strict_q : false,
				 * 		relevant : false,
				 * 		tags : '',
				 * 		strict_tags : false,
				 * 		private : false,
				 * 		versioned : false
				 * 	},
				 * 	onSuccess : function( response ){
				 * 	
				 * 	},
				 * 	onError : function( response ){
				 * 	
				 * 	}
				 * }
				 */

				/*
				
				q              string    Keywords that can match either the name, mime_type or source of a Drop. (e.g. press pdf chrome)
				strict_q       boolean   Default: false. True, Drops matching ALL Keywords will be returned. False, Drops matching ANY Keyword will be returned.
				relevant       boolean   Default: false. True, Drops are sorted by their relevance to the Keywords in descending order. False, Drops are sorted by created_at in descending order.
				tags           string    A comma separated list of terms that identify a group of Drops. (e.g. these,are,tags)
				strict_tags    boolean   Default: false. True, Drops matching ALL Tags will be returned. False, Drops matching ANY Tag will be returned.
				private        boolean   Only Private Drops will be returned.
				versioned      boolean   Only Versioned Drops will be returned.
				per_page       int       How much results to return per request. Default is 30. Maximum is 100.
				page           int       From which page to start returning results. Default is 1 - first page.

				 */

				if (typeof c.super_cell === 'undefined') {
					throw 'the super_cell parameter is missing';
				}

				args = {
					headers: self.default_headers()
				};

				end_point = self.api_url + "supercells/" + encodeURIComponent(c.super_cell) + "/drops/" 
					+ ( new _private.paginator( c.params ).url );

				console.log( end_point );

				self.client.get(end_point, args, function(data, response) {
					console.log(response.headers.link);
					//console.log(response.headers.total);
					//console.log(response.headers['per-page']);
					if (response.statusCode == 200) {
						var dataObject = JSON.parse(data.toString('utf8'));
						if (c.onSuccess) {
							c.onSuccess({
								message: 'Found',
								data: dataObject,
								response: response,
								status: 'success',
								statusMessage: response.statusMessage,
								statusCode: response.statusCode,
								drops: dataObject.drops,
								total: response.headers.total,
								'per-page' : response.headers['per-page']
							});
						}
					} else {
						if (c.onError) {
							c.onError(new _private.error(response, data));
						}
					}
				});
			},
			sendS3: function(c, data) {
				var dIfileObject = JSON.parse(data.toString('utf8'));
				var formData = {};
				formData.AWSAccessKeyId = dIfileObject.parameters.AWSAccessKeyId;
				formData.key = dIfileObject.parameters.key;
				formData.policy = dIfileObject.parameters.policy;
				formData.signature = dIfileObject.parameters.signature;
				formData.success_action_redirect = dIfileObject.parameters.success_action_redirect;
				formData['x-amz-server-side-encryption'] = dIfileObject.parameters['x-amz-server-side-encryption'];

				formData.file = fs.createReadStream(c.file);

				request.post({
					url: 'https://data.supercell.io/',
					headers: {
						"Authorization": "Bearer " + _private.OAuth2.access_token,
						//"Content-Type": "application/json",
						"Accept": "application/vnd.dropigee.v1+json"
					},
					formData: formData,
					followAllRedirects: true
				}, function(error, response, data) {
					//console.log(arguments);

					if( error )
					{
						if (c.onError) {
							c.onError(new _private.error({}, data));
						}
						return;
					}

					if (response.statusCode == 200) {
						var dataObject = JSON.parse(data.toString('utf8'));
						c.onSuccess({
							message: 'Created',
							data: data,
							response: response,
							status: 'success',
							statusMessage: response.statusMessage,
							statusCode: response.statusCode,
							drop: dataObject.drop
						});
					} else {
						if (c.onError) {
							c.onError(new _private.error(response, data));
						}
					}
				});
			},
			create_drop: function(c) {
				var self = _private,
					args,
					end_point,
					data = {};
				/**
				 * c = {
				 * 	super_cell : '',
				 * 	file : 'path/to/file/photo.jpg',
				 * 	tags : 'these,are,tags',
				 * 	private : true/false,
				 * 	versioned : true, 
				 * 	onSuccess : function( response ){
				 * 	
				 * 	},
				 * 	onError : function( response ){
				 * 	
				 * 	}
				 * }
				 */

				if (typeof c.super_cell === 'undefined') {
					throw 'the super_cell parameter is missing';
				}
				if (typeof c.file !== 'string') {
					throw 'the file parameter shall to be a string pointing to the file path';
				}

				// set drop data
				if (typeof c.versioned !== 'undefined' && c.versioned === true) {
					data.versioned = true;
				} else if (typeof c.versioned !== 'undefined' && c.versioned === false) {
					data.versioned = false;
				} else {
					data.versioned = null;
				}

				if (typeof c.private !== 'undefined' && c.private === true) {
					data.private = true;
				} else if (typeof c.private !== 'undefined' && c.private === false) {
					data.private = false;
				} else {
					data.private = null;
				}

				if (typeof c.tags !== 'undefined' && c.tags !== '') {
					data.tags = c.tags;
				} else {
					data.tags = null;
				}
				// set drop data


				args = {
					data: data,
					headers: self.default_headers()
				};

				end_point = self.api_url + "supercells/" + encodeURIComponent(c.super_cell) + "/drops/";

				self.client.post(end_point, args, function(data, response) {
					//console.log(  response.statusCode );
					//console.log(  data.toString('utf8') );
					if (response.statusCode == 200) { // created on dropigee
						self.sendS3(c, data);
					} else {
						if (c.onError) {
							c.onError(new _private.error(response, data));
						}
					}
				});
			},
			update_drop: function(c) {
				var self = _private,
					args,
					end_point,
					data = {};
				/**
				 * c = {
				 * 	super_cell : '',
				 * 	id : '',
				 * 	tags : '',
				 * 	private : true/false,
				 * 	versioned : true, 
				 * 	onSuccess : function( response ){
				 * 	
				 * 	},
				 * 	onError : function( response ){
				 * 	
				 * 	}
				 * }
				 */

				if (typeof c.super_cell === 'undefined') {
					throw 'the super_cell parameter is missing';
				}
				if (typeof c.id === 'undefined') {
					throw 'the id parameter is missing';
				}

				// set update data
				if (typeof c.versioned !== 'undefined' && c.versioned === true) {
					data.versioned = true;
				}
				// Cannot be False when updating because Drops can't be unversioned
				else {
					data.versioned = null;
				}

				if (typeof c.private !== 'undefined' && c.private === true) {
					data.private = true;
				} else if (typeof c.private !== 'undefined' && c.private === false) {
					data.private = false;
				} else {
					data.private = null;
				}

				if (typeof c.tags !== 'undefined' && c.tags !== '') {
					data.tags = c.tags;
				} else {
					data.tags = null;
				}
				// set update data

				args = {
					data: data,
					headers: self.default_headers()
				};

				end_point = self.api_url + "supercells/" + encodeURIComponent(c.super_cell) + "/drops/" + encodeURIComponent(c.id) + "/";

				self.client.put(end_point, args, function(data, response) {

					if (response.statusCode == 200) {
						var dataObject = JSON.parse(data.toString('utf8'));
						if (c.onSuccess) {
							c.onSuccess({
								message: 'Updated',
								data: dataObject,
								response: response,
								status: 'success',
								statusMessage: response.statusMessage,
								statusCode: response.statusCode,
								drop: dataObject.drop
							});
						}
					} else {
						if (c.onError) {
							c.onError(new _private.error(response, data));
						}
					}
				});
			},
			destroy_drop: function(c) {
				var self = _private,
					args,
					end_point,
					data = {};
				/**
				 * c = {
				 * 	super_cell : '',
				 * 	id : '',
				 * 	onSuccess : function( response ){
				 * 	
				 * 	},
				 * 	onError : function( response ){
				 * 	
				 * 	}
				 * }
				 */

				if (typeof c.super_cell === 'undefined') {
					throw 'the super_cell parameter is missing';
				}
				if (typeof c.id === 'undefined') {
					throw 'the id parameter is missing';
				}

				args = {
					headers: self.default_headers()
				};

				end_point = self.api_url + "supercells/" + encodeURIComponent(c.super_cell) + "/drops/" + encodeURIComponent(c.id) + "/";

				self.client.delete(end_point, args, function(data, response) {
					if (response.statusCode == 204) {
						if (c.onSuccess) {
							c.onSuccess({
								message: 'Destroyed',
								response: response,
								status: 'success',
								statusMessage: response.statusMessage,
								statusCode: response.statusCode
							});
						}
					} else {
						if (c.onError) {
							c.onError(new _private.error(response, data));
						}
					}
				});
			}
		},
		_public = {
			authorize: _private.authorize,
			set_credential: _private.set_credential,
			authorized: _private.authorized,
			show_drop: _private.show_drop,
			index_drops: _private.index_drops,
			update_drop: _private.update_drop,
			destroy_drop: _private.destroy_drop,
			create_drop: _private.create_drop
		};

	return _public;
})();