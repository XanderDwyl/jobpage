'use strict';

var expect = require( 'chai' ).expect;
var appDir = process.cwd();

describe( '/api/index', function () {
	describe( 'API register', function () {

		require( appDir + '/lib/utils' ).models();

		var api  = require( appDir + '/api/index' );

		it( 'expect to have a register property', function () {
			expect( api ).to.have.property( 'register' );
		} );

		it( 'expect to have a attributes property and its value are correct', function () {
			expect( api.register ).to.have.property( 'attributes' );
			expect( api.register.attributes.name ).to.equal( 'api' );
			expect( api.register.attributes.version ).to.equal( '1.0' );
		} );

	} );
} );
