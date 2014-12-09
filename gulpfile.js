var
  gulp        = require('gulp'),
  browserify  = require('browserify'),
  source      = require('vinyl-source-stream'),
  del         = require('del'),
  linter      = require('gulp-jshint'),
  reporter    = require('jshint-stylish'),
  concat      = require('gulp-concat'),
  jasmine     = require('gulp-jasmine-phantom'),
  mbf         = require('main-bower-files')
;

gulp.task('default', function () {
  gulp.task('build:complete');
});

gulp.task('clean', del.bind(null, ['./build/']));
gulp.task('clean:js', del.bind(null, ['./build/js']));
gulp.task('clean:vendor', del.bind(null, ['./build/lib']));

gulp.task('lint', function () {
  return gulp.src('./src/**/*.js')
    .pipe(linter())
    .pipe(linter.reporter(reporter));
});

gulp.task('build', ['lint', 'clean:js'], function () {
    gulp.src('./build_vendor/*')
      .pipe(gulp.dest('./build/'));
    
    var b = browserify('./src/js/app/app.js');
    b.require('./src/js/app/app.js', {expose : 'hamwheel'});
    
    b.bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('./build/js'));
});

gulp.task('build:vendor', ['clean:vendor'], function () {
  gulp.src(mbf())
    .pipe(gulp.dest('build/lib'));
});

gulp.task('build:page', function () {
  
  gulp.src('./src/html/**')
    .pipe(gulp.dest('build'));
});

gulp.task('build:full', ['build:vendor', 'build', 'build:page']);

gulp.task('test', ['build'],  function () {
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
