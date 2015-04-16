'use strict';

var mongoose   = require( 'mongoose' );
var UserSchema = require( '../schema/user' );

UserSchema.pre( 'save', function ( next ) {
	next();
} );

// registers a new model named `User`
mongoose.model( 'User', UserSchema );
