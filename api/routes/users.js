'use strict';
var mongoose = require( 'mongoose' );
var User     = mongoose.model( 'User' );
var Hapi     = require( 'hapi' );

var _error = Hapi.error;

module.exports = [
	{
		'method' : 'GET',
		'path'   : '/v1/users',

		handler : function ( request, reply ) {

			reply( 'get users' );

		}
	},

	{
		method : 'POST',
		path   : '/v1/users',

		handler : function ( request, reply ) {

			var credentials = {
				email    : request.payload.email,
				password : request.payload.password
			};

			if ( !credentials.email || !credentials.password ) {
				return reply( _error.badRequest( 'Email and Password required.' ) );
			}

			var newUser = new User( credentials );

			reply( 'add user' );

		}
	}
];
