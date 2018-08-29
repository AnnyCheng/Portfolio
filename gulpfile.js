'use strict';

// 引用 gulp plugin
var gulp = require('gulp'); // 載入 gulp
var injectPartials = require('gulp-inject-partials'); // template partial
var browserSync = require('browser-sync').create(); // 載入 browser-sync, 多瀏覽器同時瀏覽
var sass = require('gulp-sass'); // 載入 gulp-sass, 編譯sass
var autoprefixer = require('gulp-autoprefixer'); //載入autoprefixer, 自動增加各瀏覽器前墜
var sourcemaps = require('gulp-sourcemaps'); //載入sourcemaps, 指出程式所在檔案位置
var uglify = require('gulp-uglify'); // 載入 gulp-uglify, 醜化js
//var sprity = require('sprity'); //載入sprity, 壓縮圖片成一張
var minifyCSS = require('gulp-minify-css'); //載入minifyCss, 最小化css
var gulpif = require('gulp-if');
var concat = require('gulp-concat'); //將所有js整合成一支all.js檔
var rename = require("gulp-rename"); //將最小化後的檔案重新命名為 *.min.js
var plumber = require("gulp-plumber");


var paths = {
  sass: ['./app/scss/**/*.scss'],
  js: ['./app/js/**/*.js'],
  html: ['./app/**/*.html', '!./app/build/**/*', './*.html'],
  copy: ['./app/build/**'],
  images: [
    './app/images/**/*.{png,jpg,gif}',
    '!./app/images/**/bg-*.*',
    '!./app/images/**/*@2x.*',
    '!./app/images/**/*@3x.*'
  ],
};


// static server + watching js/scss/html/image files
gulp.task('serve', ['partials', 'js', 'sass', 'watch', 'copy'], function () {
    browserSync.init({
        server: {
            baseDir: "./app/build/"
        },
    });   
});

gulp.task('copy', ['copy'], function(){
    browserSync.init({
        server: {
            baseDir: "./"
        },
    }); 
})


//watch
gulp.task('watch', function(){
	gulp.watch(paths.html, ['partials']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.images, ['sprites']);
    gulp.watch(['./app/build/**'], browserSync.reload);
    gulp.watch(paths.copy, ['copy']);
})



// partials
gulp.task('partials', function () {
  gulp.src('./app/*.html')
           .pipe(injectPartials())
           .pipe(gulp.dest('./app/build'))
});


// Javascript最小化
gulp.task('js', function() {
    gulp.src('./app/js/*.js') // 指定要處理的原始 JavaScript 檔案目錄
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(concat('all.js'))
        .pipe(uglify()) // 將 JavaScript 做最小化
        .pipe(rename({ extname: '.min.js' }))
        .pipe(sourcemaps.write()) 
        .pipe(gulp.dest('./app/build/js')) // 指定最小化後的 JavaScript 檔案目錄
});


// SCSS 檔案編譯為 CSS
gulp.task('sass', function() {
    gulp.src('./app/scss/**/*.scss') // 指定要處理的 Scss 檔案目錄
    	.pipe(sourcemaps.init())
    	.pipe(plumber())
        .pipe(sass()) // 編譯 Scss
        .pipe(autoprefixer({
	      //browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'firefox esr', 'opera 12.1', 'ios 6', 'android 4']
	      browsers: ['last 2 version', '> 1%']
	    }))
	    .pipe(minifyCSS({
	      keepSpecialComments: 0
	    }))
	    .pipe(rename({ extname: '.min.css' }))
	    .pipe(sourcemaps.write())
        .pipe(gulp.dest('./app/build/css')) // 指定編譯後的 css 檔案目錄
});

gulp.task('copy', function(){
    gulp.src('./app/build/**')
    .pipe(gulp.dest('./'))
});
 

// 建立預設gulp task，執行serve
gulp.task('default', ['serve']);