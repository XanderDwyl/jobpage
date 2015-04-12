'use strict';

var Hapi     = require( 'hapi' );
// var mongoose = require( 'mongoose' );
var expect   = require( 'chai' ).expect;
var appDir   = process.cwd();
var util     = require( appDir + '/lib/utils' );

describe( 'User Resource - /api/routes/users', function () {

	var server = new Hapi
				.Server()
				.connection( util.config( 'server' ) );

	var userResource = require( appDir + '/api/routes/users' );
	server.route( userResource );

	it( 'adds a /user resource to the server\'s table routes', function () {
		var table = server.table()[ 0 ].table;

		expect( table ).to.have.length.above( 0 );
	} );

	describe( 'GET users - routes', function () {
		it( 'returns all the users', function ( done ) {
			var options = {
				'method' : 'GET',
				'url'    : '/users'
			};

			// simulate server
			server.inject( options, function ( res ) {
				var body;

				try {
					body = JSON.parse( res.payload );
				}catch ( e ) {
					body = 'can\'t parse it...';
				}

				expect( res.statusCode ).to.equal( 200 );
				expect( body ).to.be.a( 'array' );
				expect( body ).to.have.length.above( 0 );

				done();
			} );
		} );
	} );
} );
