var gulp = require('gulp'),
	istanbul = require('gulp-istanbul'),
	jasmine = require('gulp-jasmine'),
	jshint = require('gulp-jshint');

gulp.task( 'lint', function() {
	return gulp.src( ['gulpfile.js', 'lib/**/*.js', 'spec/**/*.js' ] )
		.pipe( jshint() )
		.pipe( jshint.reporter('default') );
} );

gulp.task( 'default', ['lint'], function( cb ) {

	gulp.src( ['lib/**/*.js'] )
		.pipe( istanbul() )
		.on( 'finish', function() {
			gulp.src( ['spec/**/*.js'] )
				.pipe( jasmine() )
				.pipe( istanbul.writeReports() )
				.on( 'end', cb )
		} );

} );
