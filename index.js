
'use strict';
var Hapi     = require( 'hapi' );
var mongoose = require( 'mongoose' );
var util     = require( './lib/utils' );

var server   = new Hapi.Server( {
	'debug' : {
		'request' : [ 'error' ]
	}
} );

var _error = Hapi.error;

// start db connection
mongoose.connect( util.config( 'mongo' ) );

// set server connection
server.connection( util.config( 'server' ) );

// require all models
util.models();

// register server and start server
server.register( util.plugins(), function ( swagError ) {

	if ( swagError ) {
		console.log( [ 'error' ], 'hapi-swagger load error: ' + swagError );
	} else {
		console.log( [ 'start' ], 'hapi-swagger interface loaded' );
	}

	var start = function ( err ) {
		if ( err ) {
			return _error.badRequest( 'Unable to start server.' );
		}
		console.log( 'DB Connection     : ' + util.config( 'mongo' ) );
		console.log( 'Server started at : ' + server.info.uri );
	};

	server.start( start );

} );
