'use strict';
var mongoose = require( 'mongoose' );
var User     = mongoose.model( 'User' );
var Hapi     = require( 'hapi' );

var _error = Hapi.error;

module.exports = [
	{
		'method'  : 'GET',
		'path'    : '/v1/users',
		'handler' : function ( request, reply ) {
			var user = {
				'email' : 'sample',
				'meta'  : {
					'firstname' : 'sample',
					'lastname'  : 'elpmas'
				}
			};

			reply( user );

		},

		'config' : {
			'description' : 'Display all users.',
			'tags'        : [ 'api', 'user' ]
		}
	},

	{
		'method' : 'POST',
		'path'   : '/v1/users',

		handler : function ( request, reply ) {

			var credentials = {
				email    : request.payload.email,
				password : request.payload.password
			};

			if ( !credentials.email || !credentials.password ) {
				return reply( _error.badRequest( 'Email and Password required.' ) );
			}

			var newUser = new User( credentials );

			newUser.save( function ( error, user ) {
				console.log( error.message );
				if ( error ) {
					var message = 'Registration problem. Try again later.';

					if ( error.message.match( /duplicate/i ) ) {
						message = 'Email already registered.';
					}

					var err = _error.badRequest( message );
					return reply( err );
				}
			} );
			reply( 'add user' );

		}
	}
];
