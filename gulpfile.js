var
  gulp        = require('gulp'),
  browserify  = require('browserify'),
  source      = require('vinyl-source-stream'),
  del         = require('del'),
  linter      = require('gulp-jshint'),
  reporter    = require('jshint-stylish'),
  concat      = require('gulp-concat'),
  jasmine     = require('gulp-jasmine-phantom'),
  fs        = require('fs'),
  path = require('path'),
  bower       = function (components) {
    return components.map(function (elem) {
      return './bower_components/' + elem + '.js'
    });
  }
;

gulp.task('default', function () {
  gulp.task('build:complete');
});

gulp.task('clean', del.bind(null, ['./build/']));

gulp.task('lint', function () {
  return gulp.src('./src/**/*.js')
    .pipe(linter())
    .pipe(linter.reporter(reporter));
});

gulp.task('build', ['lint', 'clean'], function () {
    gulp.src('./build_vendor/*')
      .pipe(gulp.dest('./build/'));
    
    var b = browserify('./src/app.js');
    b.require('./src/app.js', {expose : 'ensemble'});
    
    b.bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('./build/'));
});

gulp.task('build:vendor', function () {
  gulp.src(bower(['react/react']))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('build_vendor'));
});

gulp.task('build:full', ['build:vendor', 'build'], function(){
  // empty
});

gulp.task('test', ['lint'],  function () {
  gulp.src('./test/unit/**/*.js')
  .pipe(linter())
  .pipe(linter.reporter(reporter))
  
  gulp.src('./test/unit/**/*.js')
  .pipe(jasmine());
});

gulp.task('test:integ', ['test'], function () {
  gulp.src('./test/integ/**/*.js')
    .pipe(linter())
    .pipe(linter.reporter(reporter))
    
  gulp.src('./test/integ/**/*.js')
    .pipe(jasmine({
      integration : true,
      keepRunner : './build_test_integ/',
      vendor : ['./node_modules/polyfill-function-prototype-bind/bind.js',  // workaround : coz for phantom
      './build/vendor.js', 'build/app.js']
    }));
});



gulp.task('sample', ['test'], function () {
  gulp
    .src('./sample/**/*.js')
    .pipe(linter())
    .pipe(linter.reporter(reporter));
  
  gulp.src('./sample/**')
    .pipe(gulp.dest('build'));
})
