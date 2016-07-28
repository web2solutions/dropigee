# Dropigee.js

Dropigee API wrapper for Node (https://www.dropigee.com/)


##  How to Test this library?

If you want to run and test the code, you will need the following softwares:

 - Node.js
 - Mocha
 - Chai

Download this repository and uncompress to a given directory, lets assume: ***/Users/MyName/Desktop/dropigee.js/***


#### Step 1

Now, on terminal, navigate to the project directory:

    $ cd /Users/MyName/Desktop/dropigee.js/

Install dependencies:

    $ npm install node-rest-client

    $ npm install request

    $ npm install -g mocha

    $ npm install chai


Now start lets runs the test

	$ mocha test/t.js


##  How to use this library?

You can follow all previously steps, or just type:

    $ npm install

Now, create your Node.js application.

Now import the Dropigee module. Inside the code, put:


    var Dropigee = require("../src/Dropigee.js").Dropigee;


Note:

    Before calling any method from Dropigee API, please call Dropigee.authorize() first

## Dropigee API

The Javascript Dropigee API is fully assync. Then, on every call, you may pass 2 callbacks: 

 - function onSuccess( response ){}
 - function onError( response ){}

### Callbacks

#### onSuccess

Triggered when the request was successful

Scope: response

Properties:

    response.message -> message. String
    response.data -> end point response body. JSON object
    response.statusCode -> http number. Number
    response.statusMessage -> http message. String

    // Other properties

    response.drop -> Returned drop when call show_drop(). Array
    response.drops -> Returned drops when call index_drops(). JSON object

#### onError

Triggered when the request returned error

Scope: response

Properties:

    response.message -> error message. String
    response.statusCode -> http error number. Number
    response.statusMessage -> http error message. String
    

### Methods

#### authorize()

Authorize over Dropigee using Oauth2

````javascript
            
            var valid_credential = {
                client_id: "xxxx",
                client_secret: "xxx",
                grant_type: 'client_credentials',
                scope: 'write:drop'
            };

            Dropigee.authorize({
                onSuccess: function(response) {
                    console.log( response.message );
                    console.log( response.statusMessage );
                    console.log( response.statusCode );
                    console.log( response.data );
                },
                onError: function(response) {
                   console.log( response.message );
                    console.log( response.statusMessage );
                    console.log( response.statusCode );
                },
                credential: valid_credential
            });
````

#### index_drops()

Return a list of Drops.

##### Parameters
    Name            Type      Description
    -------       -------   --------------
    - q              string    Keywords that can match either the name, mime_type or source of a Drop. (e.g. press pdf chrome)
    - strict_q       boolean   Default: false. True, Drops matching ALL Keywords will be returned. False, Drops matching ANY Keyword will be returned.
    - relevant       boolean   Default: false. True, Drops are sorted by their relevance to the Keywords in descending order. False, Drops are sorted by created_at in descending order.
    - tags           string    A comma separated list of terms that identify a group of Drops. (e.g. these,are,tags)
    - strict_tags    boolean   Default: false. True, Drops matching ALL Tags will be returned. False, Drops matching ANY Tag will be returned.
    - private        boolean   Only Private Drops will be returned.
    - versioned      boolean   Only Versioned Drops will be returned.
    - per_page       int       How much results to return per request. Default is 30. Maximum is 100.
    - page           int       From which page to start returning results. Default is 1 - first page.

````javascript
                    Dropigee.index_drops({
                        super_cell: 'myCellName',
                        params : {
                            q : '',
                            strict_q : false,
                            relevant : false,
                            //tags : 'these,are,tags',
                            strict_tags : false,
                            private : true,
                            versioned : true,
                            per_page : 30,
                            page : 1
                        },
                        onSuccess: function(response) {
                            console.log( response.message );
                            console.log( response.statusMessage );
                            console.log( response.statusCode );
                            console.log( response.data );
                            console.log( response.drops ); // array containing drops of the currently page
                            console.log( response.total ); // total returned drops
                            console.log( response.per_page ); // total returned drops per page
                            console.log( response.links ); // links provided for pagination
                        },
                        onError: function(response) {
                            console.log( response.message );
                            console.log( response.statusMessage );
                            console.log( response.statusCode );
                        }
                    });
````

#### show_drop()

Get and return a specific Drop.

````javascript
            
                    Dropigee.show_drops({
                        super_cell: 'myCellName',
                        id: 'xkhz-n0',
                        onSuccess: function(response) {
                            console.log( response.message );
                            console.log( response.statusMessage );
                            console.log( response.statusCode );
                            console.log( response.data );
                            console.log( response.drop );
                        },
                        onError: function(response) {
                            console.log( response.message );
                            console.log( response.statusMessage );
                            console.log( response.statusCode );
                        }
                    });
````

#### create_drop()

Create a new Drop.

````javascript
            
                    Dropigee.create_drop({
                        super_cell: 'MyCellName',
                        file: __dirname + '/db.xml', // file path
                        tags: 'these,are,tags',
                        private: true,
                        versioned: true,
                        onSuccess: function(response) {
                            console.log( response.message );
                            console.log( response.statusMessage );
                            console.log( response.statusCode );
                            console.log( response.data );
                            console.log( response.drop );
                        },
                        onError: function(response) {
                            console.log( response.message );
                            console.log( response.statusMessage );
                            console.log( response.statusCode );
                        }
                    });
````

#### udpate_drop()

Update a existing Drop. 
The versioned parameter can not be false here.

````javascript
            
                    Dropigee.update_drop({
                        super_cell: 'MyCellName',
                        id: 'xkhz-n0', // drop id
                        tags: 'these,are,tags',
                        private: true,
                        versioned: true,
                        onSuccess: function(response) {
                            console.log( response.message );
                            console.log( response.statusMessage );
                            console.log( response.statusCode );
                            console.log( response.data );
                            console.log( response.drop );
                        },
                        onError: function(response) {
                            console.log( response.message );
                            console.log( response.statusMessage );
                            console.log( response.statusCode );
                        }
                    });
````

#### destroy_drop()

Destroy a drop.

````javascript
                    Dropigee.destroy_drop({
                        super_cell: 'MyCellName',
                        id: 'd2m9r00', // drop id
                        onSuccess: function(response) {
                            console.log( response.message );
                            console.log( response.statusMessage );
                            console.log( response.statusCode );
                        },
                        onError: function(response) {
                            console.log( response.message );
                            console.log( response.statusMessage );
                            console.log( response.statusCode );
                        }
                    });
````

### Demos

| --- demo/
    | ----- list_drops.js -> list drops of a Supercell
    | ----- multiple_upload.js -> upload all files from a folder to a Supercell
