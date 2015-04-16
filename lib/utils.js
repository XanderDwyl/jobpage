'use strict';
var pack   = require( '../package' );
var config = require( '../config' );
var Path   = require( 'path' );
var crypto = require( 'crypto' );

var swaggerOptions = {
	'apiVersion'     : pack.version,
	'pathPrefixSize' : 2,
	'payloadType'    : 'form'
};

var utils = { };

/**
 * [get the config options]
 * @param  {[type]} options [a string that will set which config options to be return]
 * @return {[type]}         [a server options or mongo options]
 */
utils.config = function ( options ) {

	var setup = {
		'mongo'  : function () {
			return [ 'mongodb://', config.mongo.username, ':', config.mongo.password, '@', config.mongo.host, ':', config.mongo.port, '/', config.mongo.database, ].join( '' );
		},
		'server' : function ( ) {
			return {
				'host' : config.server.host,
				'port' : config.server.port
			};
		}
	};

	return setup[ options ]();
};

/**
 * add registered plugins here
 * @return {[type]} all the registered plugins
 */
utils.plugins = function () {
	return [ {
		'register' : require( '../api/' )
	}, {
		'register' : require( 'hapi-swagger' ),
		'options'  : swaggerOptions
	} ];
};

/**
 * add all models here
 * @return {[type]} all models added
 */
utils.models = function () {
	return [
		require( '../db/models/User' )
	];
};
/**
 * generate a `sha256` hash
 * @return {[type]} a token in hash string
 */
utils.generateToken = function () {
	return crypto.createHash( 'sha1' ).update( Date.now().toString() ).digest( 'hex' );
};

/**
 * generate a `md5` hash
 * @return {[type]} a token in hash string
 */
utils.generateHash = function ( text ) {
	return crypto.createHash( 'md5' ).update( text + Date.now().toString() ).digest( 'hex' );
};

module.exports = utils;
