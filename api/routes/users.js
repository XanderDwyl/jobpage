'use strict';
var Hapi     = require( 'hapi' );
var mongoose = require( 'mongoose' );
var User     = mongoose.model( 'User' );
var Joi      = require( 'joi' );
var _        = require( 'lodash' );

var _error = Hapi.error;

module.exports = [
	{
		'method'  : 'GET',
		'path'    : '/v1/users',
		'handler' : function ( request, reply ) {

			User.find( function ( err, users ) {
				if ( err ) {
					return reply( err );
				}

				reply( users );
			} );
		},

		'config' : {
			'description' : 'Display all users.',
			'tags'        : [ 'api', 'user' ]
		}
	},

	{
		'method'  : 'GET',
		'path'    : '/v1/users/{id}',
		'handler' : function ( request, reply ) {

			User.findById( request.params.id, function ( err, users ) {
				if ( err ) {
					return reply( err );
				}

				if ( !users ) {
					return reply( err ).code( 400 );
				}

				reply( users );
			} );

		},

		'config' : {
			'description' : 'Display single user.',
			'tags'        : [ 'api', 'user' ],
			'validate'    : {
				'params' : {
					'id' : Joi.string()
					.required()
					.description( 'get User by id' )
				}
			}
		}
	},

	{
		'method'  : 'POST',
		'path'    : '/v1/users',
		'handler' : function ( request, reply ) {
			var payload = request.payload;

			var user = new User( payload );
			user.save( function ( error, result ) {
				var errMsg  = error && error.message;
				var message = errMsg || 'There something wrong with the server, please try again later.';
				var subMsg  = [];

				if ( errMsg && errMsg.match( /duplicate/i ) ) {
					message = 'Email already registered.';
				}

				if ( errMsg && errMsg.match( /validation/i ) ) {
					var errFields = _.keys( error.errors );

					for ( var i = 0; i < errFields.length; i++ ) {
						subMsg.push( error.errors[ errFields[ i ] ].message );
					}

				}

				if ( error ) {
					return reply( {
						'msg'        : message,
						'subMsg'     : subMsg,
						'statusCode' : 400
					} );
				}

				reply( {
					'id'    : result._id,
					'email' : result.email,
					'msg'   : 'User is successfully created.'
				} );
			} );
		},

		'config' : {
			'description' : 'create new user.',
			'tags'        : [ 'api', 'user' ],
			'validate'    : {
				'payload' : {
					'email'    : Joi.string().required().description( 'set Email Address' ),
					'password' : Joi.string().required().description( 'set User Password' )
				}
			}
		}
	}

];
