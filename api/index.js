'use strict';
var _    = require( 'lodash' );
var pack = require( '../package' );

// add your routes here
var routes = _.union(
	require( './routes/users' )
);

exports.register = function ( plugin, options, next ) {
	plugin.route( routes );
	next();
};

exports.register.attributes = {
	'name'    : 'api',
	'version' : pack.version
};
