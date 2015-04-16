'use strict';

var Hapi     = require( 'hapi' );
var expect   = require( 'chai' ).expect;
var sinon    = require( 'sinon' );
var mongoose = require( 'mongoose' );
var User     = mongoose.model( 'User' );
var appDir   = process.cwd();
var util     = require( appDir + '/lib/utils' );

// mongoose.connect( util.config( 'mongo' ) );

describe( 'User Resource - /api/routes/users', function () {

	var inputedEmail = 'jander@gmail.com';
	var insertedId;

	var server = new Hapi
				.Server()
				.connection( util.config( 'server' ) );

	util.models();

	server.route( require( appDir + '/api/routes/users' ) );

	it( 'adds a /user resource to the server\'s table routes', function () {
		var table = server.table()[ 0 ].table;

		expect( table ).to.have.length.above( 0 );
	} );
	describe( 'POST /users', function () {
		describe( 'valid fields', function ( ) {
			var body;
			var result;

			var credentials = {
				'email'    : inputedEmail,
				'password' : 'Gaydeon99%'
			};

			var options = {
				'method'  : 'POST',
				'url'     : '/v1/users',
				'payload' : JSON.stringify( credentials )
			};

			before( function ( done ) {
				server.inject( options, function ( res ) {

					body   = JSON.parse( res.payload );
					result = res;
					done();
				} );
			} );

			it( 'creates a new User', function ( done ) {
				insertedId = body.id;
				expect( result.statusCode ).to.equal( 200 );
				expect( body ).to.be.a( 'object' );
				expect( body.email ).to.equal( credentials.email );
				expect( body.msg ).to.equal( 'User is successfully created.' );

				done();
			} );
		} );

		describe( 'invalid fields', function ( ) {
			var body;

			var credentials = {
				'email'    : inputedEmail,
				'password' : 'Gaydeon99%'
			};

			var options = {
				'method'  : 'POST',
				'url'     : '/v1/users',
				'payload' : JSON.stringify( credentials )
			};

			it( 'return duplicate users', function ( done ) {

				server.inject( options, function ( res ) {

					body = JSON.parse( res.payload );

					expect( body.statusCode ).to.equal( 200 );
					expect( body.msg ).to.equal( 'Email already registered.' );

					done();
				} );

			} );
			it( 'return invalid email', function ( done ) {
				inputedEmail = 'inputedEmail@gmail';

				credentials = {
					'email'    : inputedEmail,
					'password' : 'Gaydeon99%'
				};

				options = {
					'method'  : 'POST',
					'url'     : '/v1/users',
					'payload' : JSON.stringify( credentials )
				};

				server.inject( options, function ( res ) {
					body = JSON.parse( res.payload );

					expect( body.statusCode ).to.equal( 200 );
					expect( body.msg ).to.equal( 'User validation failed' );
					expect( body.subMsg[ 0 ] ).to.equal( 'Path `email` is invalid (' + inputedEmail + ').' );

					done();
				} );

			} );
			it( 'return invalid password', function ( done ) {
				var inputedPassword = 'gaydeo';
				inputedEmail    = 'sample@gmail.com';
				credentials     = {
					'email'    : inputedEmail,
					'password' : inputedPassword
				};

				options = {
					'method'  : 'POST',
					'url'     : '/v1/users',
					'payload' : JSON.stringify( credentials )
				};

				server.inject( options, function ( res ) {
					body = JSON.parse( res.payload );

					expect( body.statusCode ).to.equal( 200 );
					expect( body.msg ).to.equal( 'User validation failed' );
					expect( body.subMsg[ 0 ] ).to.equal( 'Path `password` is invalid (' + inputedPassword + ').' );

					done();
				} );

			} );
		} );

	} );

	describe( 'GET users - routes', function () {
		describe( 'all users', function () {
			it( 'returns all users', function ( done ) {
				var options = {
					'method' : 'GET',
					'url'    : '/v1/users'
				};

				server.inject( options, function ( res ) {
					var body = JSON.parse( res.payload );

					expect( res.statusCode ).to.equal( 200 );
					expect( body ).to.be.a( 'array' );

					done();
				} );
			} );
			it( 'expect to return An internal server error occurred', function ( done ) {
				sinon.stub( User, 'find', function ( callback ) {
					callback( new Error( 'Internal Server Error' ) );
				} );

				var options = {
					'method' : 'GET',
					'url'    : '/v1/users'
				};

				server.inject( options, function ( res ) {
					User.find.restore();

					expect( res.result.statusCode ).to.equal( 500 );
					expect( res.result.error ).to.equal( 'Internal Server Error' );

					done();
				} );
			} );
		} );
		describe( 'single users', function () {
			it( 'returns single user', function ( done ) {

				var options = {
					'method' : 'GET',
					'url'    : '/v1/users/' + insertedId
				};

				server.inject( options, function ( res ) {
					var body = JSON.parse( res.payload );

					expect( res.statusCode ).to.equal( 200 );
					expect( body ).to.be.a( 'object' );

					done();
				} );
			} );
			it( 'expect to return User not found', function ( done ) {

				var options = {
					'method' : 'GET',
					'url'    : '/v1/users/552f45bd47bf18977268e1e3'
				};

				server.inject( options, function ( res ) {

					expect( res.result.statusCode ).to.equal( 200 );
					expect( res.result.message ).to.equal( 'User not found.' );

					done();
				} );
			} );
			it( 'expect to return An internal server error occurred', function ( done ) {

				var id = ( insertedId + 1 );

				var options = {
					'method' : 'GET',
					'url'    : '/v1/users/' + id
				};

				server.inject( options, function ( res ) {

					expect( res.result.statusCode ).to.equal( 500 );
					expect( res.result.error ).to.equal( 'Internal Server Error' );

					done();
				} );
			} );
		} );
	} );

} );
