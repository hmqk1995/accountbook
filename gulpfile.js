'use strict';

var gulp       = require('gulp'),
	uglify     = require('gulp-uglify'),
	sass       = require('gulp-ruby-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	livereload = require('gulp-livereload'),
	minifyCss  = require('gulp-minify-css'),
	autoprefixer = require('gulp-autoprefixer');
	// jade       = require('gulp-jade'),
	// imagemin   = require('gulp-imagemin'),
	// pngquant   = require('imagemin-pngquant');

//处理sass文件
gulp.task('sass', function() {
	return sass('./src/css/style.scss', {sourcemap: true})
	  .on('error', function(err) {
	  	console.error('error', err.message);
	  })
	  .pipe(autoprefixer())
	  .pipe(sourcemaps.write())
	  .pipe(gulp.dest('./dist/css/'));
});

// 处理html文件
gulp.task('html', function() {
	//载入html
	gulp.src('./src/*.html')
	  .pipe(gulp.dest('./dist/'));
	//载入字体
	gulp.src('./src/fonts/*.*')
	  .pipe(gulp.dest('./dist/fonts/'));
	//载入除了sass的css
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
gulp.task('js', function(){
	gulp.src('./src/app.js')
    // .pipe(uglify())
    .pipe(gulp.dest('dist/'));
});

//总任务
gulp.task('default', ['sass', 'html', 'js'], function() {
  // livereload.listen({port: 3002});
  gulp.watch(['./src/*.html', './src/css/*.css'], ['html']);
  gulp.watch('./src/css/*.scss', ['sass']);
  gulp.watch('./src/*.js', ['js']);
});