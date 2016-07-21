/**
 * gulp
 *
 * ** ビルド
 *
 * $ gulp
 *
 * ** ローカルサーバーを立ち上げる
 *
 * $ gulp serve
 *
 * ** sprite
 *
 * $ gulp sprite
 *
 * ** 画像を圧縮
 *
 * $ gulp image
 *
 * ** スタイルガイド
 *
 * $ gulp style
 *
 * ---------------------------------------------------------------------- */

/*
 * init package
 */
var gulp = require('gulp');
var gulpSequence = require('gulp-sequence');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var size = require('gulp-size');
var postcss = require('gulp-postcss');

var events = require('events');
events.EventEmitter.defaultMaxListeners = 100;


/*
 * path
 */
var path = {
  src: 'src/',
  dist: 'dist/',
  html_src: 'src/ejs/',
  css_src: 'src/css/',
  js_src: 'src/js/',
  img_src: 'src/img/',
  sprite_src: 'src/sprite/',
  guide_src: 'styleguide/'
};


/*
 * del
 */
var del = require('del');
gulp.task('del', function () {
  return del(path.dist);
});


/*
 * sprite
 */
var spritesmith = require('gulp.spritesmith');
var replace = require('gulp-replace');
var moment = require('momentjs');
var timestamp = moment().format('YYYYMMDDhhmmss');

gulp.task('sprite', function () {
  var spriteData = gulp.src(path.sprite_src + 'sprite-common/*.png')
    .pipe(spritesmith({
      imgName: 'sprite-common.png',
      cssName: '_sprite-common.css',
      imgPath: '../img/sprite-common.png',
      cssFormat: 'scss',
      padding: 5,
      cssOpts: { // スプライト用SCSS内のmixinの記述をなくす
        functions: false
      }
    }))
  spriteData.img.pipe(gulp.dest(path.img_src));
  spriteData.css.pipe(replace(/.png/g, '.png' + '?revision=' + timestamp))
    .pipe(gulp.dest(path.css_src + 'setting/var/'))
    .pipe(size({
      title: 'size : sprite'
    }));
});


/*
 * image optim
 */
var imageOptim = require('gulp-imageoptim');
gulp.task('image', function() {
  return gulp.src(path.img_src + '**/*.{png,jpg}')
    .pipe(imageOptim.optimize())
    .pipe(gulp.dest(path.img_src));
});


/*
 * style guide
 */

// aigis
var aigis = require('gulp-aigis');

gulp.task('style', function() {
  return gulp.src(path.guide_src + 'aigis_config.yml')
    .pipe(aigis());
});


/*
 * html
 */

// ejs
var ejs = require('gulp-ejs');
gulp.task('ejs', function() {
  gulp.src([
    path.html_src + 'pages/**/*.ejs'
  ])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(ejs(
      {
        data: require('./' + path.html_src + 'data/default.json')
      },
      {
        ext: '.html'
      }
    ))
    .pipe(gulp.dest(path.dist + '/'));
});


/*
 * css
 */
// precss
// calc
// autoprefixer
var precss = require('precss');
var calc = require("postcss-calc");
var autoprefixer = require('autoprefixer');
gulp.task('precss', function () {
  return gulp.src(path.css_src + '*.css')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(postcss([
      precss(),
      calc(),
      autoprefixer ({
        browsers: ['iOS >= 4.3','Android >= 2.3'],
        cascade: false
     }),
    ]))
    .pipe(gulp.dest(path.dist + 'css/'));
 });

// cssnano
var cssnano = require('cssnano');
gulp.task('cssnano', function () {
  return gulp.src([
    path.dist + 'css/*.css',
    '!' +path.dist + 'css/*.min.css'
  ])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(postcss([
      cssnano()
    ]))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest(path.dist + 'css/'))
    .pipe(size({
      title: 'size : css'
    }));
});


/*
 * js
 */
// browserify
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
gulp.task('browserify', function(){
  return browserify({entries: [path.js_src + 'script.js']})
    .transform(babelify, {presets: ['es2015', 'react']})
    .bundle()
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(source('script.js'))
    .pipe(gulp.dest(path.dist + 'js/'));
});

// uglify
var uglify = require('gulp-uglify');
gulp.task('uglify', function () {
  return gulp.src([
    path.dist + 'js/*.js',
    '!' + path.dist + 'js/*.min.js'
  ])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest(path.dist + 'js/'))
    .pipe(size({
      title: 'size : js'
    }));
});

// copy
gulp.task('copy_lib', function () {
  return gulp.src(path.js_src + 'lib/*.js')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(gulp.dest(path.dist + 'js/lib/'))
    .pipe(size({
      title: 'size : copy_lib'
    }));
});

// eslint
var eslint = require('gulp-eslint');
gulp.task('eslint', function () {
  return gulp.src([
    path.js_src + '**/*.js',
    '!' + path.js_src + 'lib/*.js'
  ])
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});


/*
 * img
 */
// copy
gulp.task('copy_img', function () {
  return gulp.src(path.img_src + '**/*.{png,jpg}')
    .pipe(plumber({
      errorHandler: notify.onError('<%= error.message %>')
    }))
    .pipe(gulp.dest(path.dist + 'img/'))
    .pipe(size({
      title: 'size : copy_img'
    }));
});


/*
 * server
 */
var browserSync = require('browser-sync');
gulp.task('browserSync', function () {
  gulpSequence('build')();
  browserSync({
    notify: false,
    port: 8000,
    server: {
      baseDir: path.dist
    }
  });
});

gulp.task('bs-reload', function() {
  browserSync.reload();
});


/*
 * watch
 */
gulp.task('watch', ['browserSync'], function () {
  gulp.watch(path.html_src + '**/*.{ejs,json}', ['build:html']);
  gulp.watch(path.css_src + '**/*.css', ['build:css']);
  gulp.watch(path.js_src + '**/*.js', ['build:js']);
  gulp.watch(path.img_src + '**/*.{png,jpg}', ['build:img']);
  gulp.watch('gulpfile.js', ['build']);
  gulp.watch(path.src + '**/*', ['bs-reload']);
});


/*
 * task manage
 */
// build:html
gulp.task('build:html', function () {
 gulpSequence('ejs')();
});

// build:css
gulp.task('build:css', function () {
  gulpSequence('precss', 'cssnano')();
});

// build:js
gulp.task('build:js', function () {
  gulpSequence('eslint', 'browserify', 'uglify', 'copy_lib')();
});

// build:img
gulp.task('build:img', function () {
  gulpSequence('copy_img')();
});

// build
gulp.task('build', function () {
  gulpSequence('build:html', 'build:css', 'build:js', 'build:img')();
});

// default
gulp.task('default', function () {
  gulpSequence('build')();
});

// run
gulp.task('serve', function () {
  gulpSequence('build', 'watch')();
});