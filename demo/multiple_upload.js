/**
 * Please install walk before running this demo application
 * npm install walk
 */
var Dropigee = require("../src/Dropigee.js").Dropigee,
	walk    = require('walk'),
	files   = [],
	walker  = walk.walk('./files', { followLinks: false }),
	process_queue = function(){
		if( files.length > 0 )
		{
			var file = files.shift();

			if( file.indexOf('.DS_Store') > -1 )
			{
				console.log('skipping .DS_Store');
				process_queue();
				return;
			}

			console.log('Uploading ' + file);
			Dropigee.create_drop({
				super_cell: 'mycell',
				file: file,
				tags: 'tag',
				onSuccess: function(response) {
					console.log(file + ' uploaded');
					process_queue();
				},
				onError: function(response) {
					console.log(response.statusCode);
					console.log('could not upload ' + file);
					console.log('Lets continue ... ');
					process_queue();
				}
			});
		}
	};

walker.on('file', function(root, stat, next) {
    files.push(__dirname+ '/files/' + stat.name);
    next();
});


walker.on('end', function() {
    console.log('list of files is done!');
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
			console.log('Lets process list of files ... !');
			process_queue ();
		},
		onError: function(response) {
			console.log('Unauthorized. Can not continue');
		},
	});
});