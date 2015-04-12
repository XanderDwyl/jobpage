var _        = require( 'lodash' );
var mongoose = require( 'mongoose' );

var User = _.extend( {
	'email' : {
		'type'     : String,
		'required' : true,
		'match'    : /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
		'index'    : {
			'unique' : true
		}
	},
	/**
	 * At least one upper case english letter
	 * At least one lower case english letter
	 * At least one digit
	 * At least one special character
	 * Minimum 8 in length
	 */
	'password' : {
		'type'     : String,
		'required' : true,
		'match'    : /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
		'select'   : false
	},

	'role' : {
		'type'    : String,
		'default' : '',
		'select'  : false
	},

	'meta' : {
		'type'    : Object,
		'default' : {
			'firstName' : '',
			'lastName'  : '',
			'birthday'  : ''
		}
	}

} );

module.exports = new mongoose.Schema(User);
