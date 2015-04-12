var mongoose   = require( 'mongoose');
var UserSchema = require( '../schema/user' );

// registers a new model named `User`
mongoose.model( 'User', UserSchema );
