'use strict';

var gulp       = require('gulp'),
	uglify     = require('gulp-uglify'),
	sass       = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	livereload = require('gulp-livereload'),
	minifyCss  = require('gulp-minify-css');
	// jade       = require('gulp-jade'),
	// imagemin   = require('gulp-imagemin'),
	// pngquant   = require('imagemin-pngquant');

//处理sass文件
gulp.task('sass', function() {
	return sass('./src/css/style.scss', {sourcemap: true})
	  .on('error', function(err) {
	  	console.error('error', err.message);
	  })
	  .pipe(sourcemaps.write())
	  .pipe(gulp.dest('./dist/css/'));
});

// 处理html文件
gulp.task('html', function() {
	gulp.src('./src/*.html')
	  .pipe(gulp.dest('./dist/'));
	  gulp.src('./src/css/*.css')
    .pipe(minifyCss())
    .pipe(gulp.dest('./dist/css/'));
});

//使用jade模版引擎
// gulp.task('jade', function() {
// 	var LOCAL_SET = {};
// 	gulp.src('./src/*.jade')
// 	  .pipe(jade({
// 	  	locals: LOCAL_SET
// 	  }))
// 	  .pipe(gulp.dest('./dist/'));
// });


//总任务
gulp.task('default', ['sass', 'html'], function() {
  gulp.src('./src/app.js')
    .pipe(uglify())
    .pipe(gulp.dest('dist/'));

  livereload.listen({port: 3002});
  gulp.watch(['./src/*.html', './src/css/*.css'], ['html']);
  gulp.watch('./src/css/*.scss', ['sass']);
});