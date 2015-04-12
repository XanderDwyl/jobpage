'use strict';
var _ = require( 'lodash' );

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
	'version' : '1.0'
};
