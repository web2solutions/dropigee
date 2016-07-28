/**
 * Please install walk before running this demo application
 * npm install walk
 */

var Dropigee = require("../src/Dropigee.js").Dropigee;

 console.log('Lets authorize ... !');
 Dropigee.authorize({
 	credential: {
 		client_id: "fc84eb5649f78ed87fcf45e0a022913486e486f037b722978f04a6cfa4933298",
 		client_secret: "f1e09b962b9da4cdb788309dde5946830c161e56e99e093fcaa2ae03f01f15aa",
 		grant_type: 'client_credentials',
 		scope: 'write:drop'
 	},
 	onSuccess: function(response) {
 		console.log('Authorized!');
 		console.log('Lets list files ... !');
 		

 		/*

			Name            Type      Description
			-------       -------   --------------
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


 		Dropigee.index_drops({
			super_cell: 'mycell',
			params : {
				q : '',
				strict_q : false,
				relevant : false,
				//tags : 'these,are,tags',
				strict_tags : false,
				private : true,
				versioned : true,
				per_page : 30,
				page : 2
			},
			onSuccess: function(response) {
				
				console.log( 'Listing Drops: ' );
				response.drops.forEach(function( drop ){
					//var drop = JSON.stringify(drop);
					console.log( drop.name  );
				});
				console.log( '--------' );
				console.log( 'Currently page: ', response.page );
				console.log( 'Total Drops in this page: ', response.drops.length );
				console.log( 'Total Drops in Supercell: ', response.total );
				console.log( '--------' );
				console.log( 'Links for pagination: ', response.links );
				
			},
			onError: function(response) {

				console.log( 'could not list drops' );
			}
		});
 	},
 	onError: function(response) {
 		console.log('Unauthorized. Can not continue');
 	},
 });