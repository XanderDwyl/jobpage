'use strict';

var Hapi     = require( 'hapi' );
var expect   = require( 'chai' ).expect;
// var sinon    = require( 'sinon' );
// var mongoose = require( 'mongoose' );
// var User     = mongoose.model( 'User' );
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

					expect( body.statusCode ).to.equal( 400 );
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

					expect( body.statusCode ).to.equal( 400 );
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

					expect( body.statusCode ).to.equal( 400 );
					expect( body.msg ).to.equal( 'User validation failed' );
					expect( body.subMsg[ 0 ] ).to.equal( 'Path `password` is invalid (' + inputedPassword + ').' );

					done();
				} );

			} );
		} );

	} );

	describe( 'GET users - routes', function () {
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
		it( 'returns a single user', function ( done ) {
			var _id = insertedId;

			var options = {
				'method' : 'GET',
				'url'    : '/v1/users/' + _id
			};

			server.inject( options, function ( res ) {
				var body = JSON.parse( res.payload );

				expect( res.statusCode ).to.equal( 200 );
				expect( body ).to.be.a( 'object' );

				done();
			} );
		} );
	} );

} );
