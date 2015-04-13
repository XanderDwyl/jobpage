'use strict';

var Hapi     = require( 'hapi' );
var mongoose = require( 'mongoose' );
var expect   = require( 'chai' ).expect;
var appDir   = process.cwd();
var util     = require( appDir + '/lib/utils' );
var config   = require( appDir + '/config.json' );

describe( '/lib/utils', function () {
	describe( 'Config Mongo DB', function () {
		it( 'expect return db path and have db name `jobapi`', function () {
			var dbpath = util.config( 'mongo' );
			var dbname = dbpath.split( '/' )[ 3 ];

			expect( dbpath ).to.be.a( 'string' );
			expect( dbname ).to.equal( 'jobapi' );
		} );
		it( 'connects to Mongo DB without a problem', function ( done ) {
			mongoose.connect( util.config( 'mongo' ), done );
		} );
	} );

	describe( 'Config Server', function () {
		var utilServer = util.config( 'server' );

		it( 'expect to have property host and port', function () {
			expect( utilServer ).have.property( 'host' );
			expect( utilServer ).have.property( 'port' );
		} );
		it( 'expect return server host and port', function () {
			expect( utilServer.port ).to.equal( config.server.port );
			expect( utilServer.host ).to.equal( config.server.host );
		} );
	} );

	describe( 'Config Plugins and Models', function () {
		var server = new Hapi.Server()
					.connection( );

		it( 'registers a plugin without a problem', function ( done ) {
			util.models();
			server.register( util.plugins(), done );

		} );
		it( 'adds all the plugin routes to the table', function () {
			var table = server.table()[ 0 ].table;
			expect( table ).to.have.length.above( 0 );
		} );
	} );

	describe( 'Config generateToken', function () {
		it( 'should generateToken without problem', function ( ) {
			var token = util.generateToken();

			expect( token ).to.be.a( 'string' );
		} );
	} );

	describe( 'Config generateHash', function () {
		it( 'should generateToken without problem', function ( ) {
			var tempStr = 'sample';
			var hash    = util.generateHash( tempStr );

			expect( hash ).to.be.a( 'string' );
		} );
	} );

} );
