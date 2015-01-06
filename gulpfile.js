/*
 * Mithril.js Starter Kit
 * Copyright (c) 2014 Phil Toms (@philtoms)
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

'use strict';

// Include Gulp and other build automation tools and utilities
// See: https://github.com/gulpjs/gulp/blob/master/docs/API.md

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var pagespeed = require('psi');
var extend = require('extend');
var fs = require('fs');
var url = require('url');
var argv = require('minimist')(process.argv.slice(2));

// Settings
var DEST = './build';                         // The build output folder
var RELEASE = !!argv.release;                 // Minimize and optimize during a build?
var GOOGLE_ANALYTICS_ID = 'UA-XXXXX-X';       // https://www.google.com/analytics/web/
var AUTOPREFIXER_BROWSERS = [                 // https://github.com/ai/autoprefixer
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var src = {};
var watch = false;
var pkgs = (function() {
  var pkgs = {};
  var map = function(source) {
    for (var key in source) {
      pkgs[key.replace(/[^a-z0-9]/gi, '')] = source[key].substring(1);
    }
  };
  map(require('./package.json').dependencies);
  return pkgs;
}());

// The default task
gulp.task('default', ['serve']);

// Clean up
gulp.task('clean', del.bind(null, [DEST]));

// 3rd party libraries
gulp.task('vendor', function() {
  src.vendor = [
  'bower_components/todomvc-common/base.{js,css}',
  'bower_components/todomvc-common/bg.png'
  ];
  return merge(
    gulp.src(src.vendor)
      .pipe(gulp.dest(DEST + '/vendor')),
    gulp.src('./node_modules/bootstrap/dist/fonts/**')
      .pipe(gulp.dest(DEST + '/fonts'))
  );
});

// Static files
gulp.task('assets', function() {
  src.assets = [
  'src/assets/**', 
  'src/pages/index.html'
  ];
  return gulp.src(src.assets)
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'assets'}));
});

// Images
gulp.task('images', function() {
  src.images = 'src/images/**';
  return gulp.src(src.images)
    .pipe($.changed(DEST + '/images'))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(DEST + '/images'))
    .pipe($.size({title: 'images'}));
});

// HTML pages
gulp.task('pages', function() {
  src.pages = ['src/pages/**/*.js', 'src/pages/index.html', 'src/pages/404.html'];

  return gulp.src(src.pages)
    .pipe($.changed(DEST, {extension: '.html'}))
    .pipe($.replace('UA-XXXXX-X', GOOGLE_ANALYTICS_ID))
    .pipe($.if(!RELEASE, $.replace('.min.js', '.js')))
    .pipe($.if(RELEASE, $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      minifyJS: true
    }), $.jsbeautifier()))
    .pipe(gulp.dest(DEST))
    .pipe($.size({title: 'pages'}));
});

// CSS style sheets
gulp.task('styles', function() {
  src.styles = 'src/styles/**/*.{css,less}';
  return gulp.src('src/styles/app.less')
    .pipe($.plumber())
    .pipe($.less({
      sourceMap: !RELEASE,
      sourceMapBasepath: __dirname
    }))
    .on('error', console.error.bind(console))
    .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe($.if(RELEASE, $.minifyCss()))
    .pipe(gulp.dest(DEST + '/css'))
    .pipe($.size({title: 'styles'}));
});

// Bundle
gulp.task('bundle', function(cb) {
  var options = require('./config/webpack.js')(RELEASE,watch);
  gulp.src('./src/app.js')
    .pipe($.webpack(options))
    .pipe(gulp.dest('./build/'));
  cb(null);
});

// Build the app from source code
gulp.task('build', ['clean'], function(cb) {
  runSequence(['vendor', 'assets', 'images', 'styles', 'bundle'], cb);
});

// Launch a lightweight HTTP Server
gulp.task('serve', function(cb) {

  watch = true;

  runSequence('build', function() {
    browserSync({
      notify: false,
      // Customize the BrowserSync console logging prefix
      logPrefix: 'MSK',
      // Run as an https by uncommenting 'https: true'
      // Note: this uses an unsigned certificate which on first access
      //       will present a certificate warning in the browser.
      // https: true,
      server: {
        baseDir: DEST,
        // Allow web page requests without .html file extension in URLs
        middleware: function(req, res, cb) {
          var uri = url.parse(req.url);
          if (uri.pathname.length > 1 &&
            path.extname(uri.pathname) === '' &&
            fs.existsSync(DEST + uri.pathname + '.html')) {
            req.url = uri.pathname + '.html' + (uri.search || '');
          }
          cb();
        }
      }
    });

    gulp.watch(src.vendor, ['vendor']);
    gulp.watch(src.assets, ['assets']);
    gulp.watch(src.images, ['images']);
    gulp.watch(src.pages, ['pages']);
    gulp.watch(src.styles, ['styles']);
    gulp.watch(DEST + '/**/*.*', function(file) {
      browserSync.reload(path.relative(__dirname, file.path));
    });
    cb();
  });
});

// run jest tests
// gulp.task('jest', function () {
//     return gulp.src('src/**/__tests__').pipe($.jest({
//         unmockedModulePathPatterns: [
//         ],
//         testDirectoryName: "src",
//         testPathIgnorePatterns: [
//             "node_modules",
//             "spec/support"
//         ],
//         moduleFileExtensions: [
//             "js",
//             "json",
//             "msx"
//         ]
//     }));
// });

var jest = require('jest-cli');
var chalk = require('chalk');
gulp.task('jest', function (callback) {
  var onComplete = function (result) {
    // if (result) {
    // } else {
    //   console.log(chalk.bgYellow('!!! Jest tests failed! You should fix them soon. !!!'));
    // }
    callback();
  }
  jest.runCLI({}, __dirname, onComplete);
});

gulp.task('tdd', function () {
  gulp.watch('src/**/*.js', ['jest']);
});

gulp.task('bdd', function () {
  gulp.watch('src/**/*.js', ['jest']);
});

// Deploy to GitHub Pages
gulp.task('deploy', function() {

  // Remove temp folder
  if (argv.clean) {
    var os = require('os');
    var path = require('path');
    var repoPath = path.join(os.tmpdir(), 'tmpRepo');
    $.util.log('Delete ' + $.util.colors.magenta(repoPath));
    del.sync(repoPath, {force: true});
  }

  return gulp.src(DEST + '/**/*')
    .pipe($.if('**/robots.txt', !argv.production ? $.replace('Disallow:', 'Disallow: /') : $.util.noop()))
    .pipe($.ghPages({
      remoteUrl: 'https://github.com/{name}/{name}.github.io.git',
      branch: 'master'
    }));
});

// Run PageSpeed Insights
// Update `url` below to the public URL for your site
gulp.task('pagespeed', pagespeed.bind(null, {
  // By default, we use the PageSpeed Insights
  // free (no API key) tier. You can use a Google
  // Developer API key if you have one. See
  // http://goo.gl/RkN0vE for info key: 'YOUR_API_KEY'
  url: 'https://example.com',
  strategy: 'mobile'
}));
