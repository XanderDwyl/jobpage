'use strict';

var gulp     = require( 'gulp-param' )( require( 'gulp' ), process.argv );
var jshint   = require( 'gulp-jshint' );
var eslint   = require( 'gulp-eslint' );
var stylish  = require( 'jshint-stylish' );
var mocha    = require( 'gulp-mocha' );
var coverage = require( 'gulp-coverage' );
var exit     = require( 'gulp-exit' );
var exec     = require( 'child_process' ).exec;

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

gulp.task( 'dropDb', function () {
	exec( 'make dropdb', function ( err ) {
		return err;
	} );
} );

gulp.task( 'test', [ 'jslint', 'eslint', 'dropDb' ], function ( pathSource, dontExit ) {

	var sourceFile  = './test/**/*.js';
	var processExit = '';

	if ( pathSource ) {
		sourceFile = pathSource;
	}

	if ( !dontExit ) {
		processExit = exit();
	}

	return gulp.src( sourceFile, {
			'read' : false,
			'base' : '/'
		} )
		.pipe(
			mocha( {
				'reporter' : 'spec'
			} )
		)
		.pipe( coverage.instrument( {
			'pattern'        : [ './api/**/*.js', './db/**/*.js', './lib/**/*.js' ],
			'debugDirectory' : 'debug'
		} ) )
		.pipe( coverage.gather() )
		.pipe( coverage.format( [ {
			'reporter' : 'html',
			'outFile'  : 'coverage.html'
		} ] ) )
		.pipe( gulp.dest( 'reports' ) )
		.pipe( processExit );

} );

gulp.task( 'watch', function () {
	gulp.watch( [ './test/**/*.js', 'gulpfile.js' ], function ( event ) {
		console.log( 'File ' + event.path + ' was  ' + event.type + ', running tasks...' );
		gulp.start( 'test --dontExit true' );
	} );
} );
