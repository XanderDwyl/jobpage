'use strict';

var gulp    = require( 'gulp' );
var jshint  = require( 'gulp-jshint' );
var eslint  = require( 'gulp-eslint' );
var stylish = require( 'jshint-stylish' );
var mocha   = require( 'gulp-mocha' );
var exit    = require( 'gulp-exit' );

gulp.task( 'jslint', function () {
	return gulp.src( [ './*.js', './test/**/*.js' ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( stylish ) )
		.pipe( jshint.reporter( 'fail' ) );
} );

gulp.task( 'eslint', function () {
	return gulp.src( [ './*.js', './test/**/*.js' ] )
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failOnError() );
} );

gulp.task( 'test', [ 'jslint', 'eslint' ], function ( ) {
	/**
	 * Set `read` to false so gulp passes the file
	 * references straight to mocha without reading
	 * them. This will help speed things up.
	 */
	return gulp.src( './test/**/*.js', {
			'read' : false,
			'base' : '/'
		} )
		.pipe(
			mocha( {
				'reporter' : 'spec'
			} )
		)
		.pipe( exit() );
} );
