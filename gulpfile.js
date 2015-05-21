'use strict';

var gulp = require('gulp'),
plugins = require('gulp-load-plugins')();

gulp.task('coffee', function () {
	gulp.src('src/*.coffee')
	.pipe(plugins.coffee({ bare: true }).on('error', plugins.util.log))
	.pipe(gulp.dest('./'))
	.pipe(plugins.eslint({
		globals: {
			'jQuery': true
		},
		env: {
			browser: true
		}
	}))
	.pipe(plugins.eslint.format())
	.pipe(plugins.size());
});

gulp.task('minify', function() {
	gulp.src('jquery.phoenix.js')
	.pipe(plugins.uglify())
	.pipe(plugins.rename(function (path) {
		if(path.extname === '.js') {
			path.basename += '.min';
		}
	}))
	.pipe(gulp.dest('./'))
	.pipe(plugins.size());
});

gulp.task('build', ['coffee', 'minify']);
gulp.task('default', ['build']);

gulp.task('watch', function () {
	gulp.watch('src/*.coffee', ['coffee']);
});
