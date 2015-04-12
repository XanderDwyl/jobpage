'use strict';

var expect = require( 'chai' ).expect;
var appDir = process.cwd();
var user   = require( appDir + '/db/schema/user' );

describe( 'DB schema - /db/schema', function () {
	describe( 'User schema', function () {
		var field = user.tree;
		it( 'expect to have all the fields', function () {
			expect( field ).to.have.property( 'email' );
			expect( field ).to.have.property( 'password' );
			expect( field ).to.have.property( 'role' );
			expect( field ).to.have.property( 'meta' );
		} );
		describe('email field', function () {
			var email = 'sample@gmail.com';
			it( 'expect field to be unique', function () {
				expect( field.email.index.unique ).to.equal( true );
			} );
			it( 'expect field to be required', function () {
				expect( field.email.required ).to.equal( true );
			} );
			it( 'expect input match in regex', function () {
				expect( email ).to.match( field.email.match );
			} );
			it( 'expect input type to be string', function () {
				expect( field.email.type ).to.equal( String );
			} );
		});
		describe('password field', function () {
			var password = 'Sample99%';
			it( 'expect field type to be string', function () {
				expect( field.password.type ).to.equal( String );
			} );
			it( 'expect field to be required', function () {
				expect( field.password.required ).to.equal( true );
			} );
			it( 'expect input match in regex', function () {
				expect( password ).to.match( field.password.match );
			} );
			it( 'expect fields to be unselected in query result', function () {
				expect( field.password.select ).to.equal( false );
			} );
		});
		describe('role field', function () {
			it( 'expect field type to be string', function () {
				expect( field.role.type ).to.equal( String );
			} );
			it( 'expect field default is empty', function () {
				expect( '' ).to.equal( field.role.default );
			} );
			it( 'expect fields to be unselected in query result', function () {
				expect( field.role.select ).to.equal( false );
			});
		});
		describe('meta field', function () {
			it( 'expect field type to be an object', function () {
				expect( field.meta.type ).to.equal( Object );
			} );
			it( 'expect field default is instanceof Object', function () {
				expect( field.meta.default ).to.be.instanceof( Object );
				expect( field.meta.default ).to.have.all.keys( 'firstName', 'lastName', 'birthday' );
			} );
		});
	} );
} );
