var gulp = require('gulp');
var connect = require("gulp-connect");
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var Builder = require('systemjs-builder');
var runSequence = require('run-sequence').use(gulp);
var jshint = require('gulp-jshint');
var path = require('path');
var source = require('vinyl-source-stream');

var config = {
    files : ['!./app/**/*-test.js', './app/*.js', './app/components/**/*.js'],
    dist : 'systemBuild',
    dist_file : 'dist/bundle.js'
};

var options = {
    config : {
        baseURL : path.resolve('systemBuild')
    }
};

gulp.task('watch', function () {

    gulp.watch(config.files, ['build', 'hint']);
    gulp.watch('./app/index.html', ['build', 'hint']);
    gulp.watch('./app/components/**/*.html', ['build', 'hint']);
});

gulp.task('hint', function() {
    return gulp
        .src(config.files)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('babel', function () {

    return gulp.src(config.files, {"base" : "./app"})
        .pipe(babel({
            modules : "system"
        }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('systemjs-build', function () {

    var builder = new Builder({
        baseURL : path.resolve(config.dist),

        // opt in to Babel for transpiling over Traceur
        transpiler: 'babel'
    });

    builder.buildSFX('app', config.dist_file, options)
        .then(function() {
            gutil.log('Build Bundle', gutil.colors.cyan('done'));
        })
        .catch(function(err) {
            gutil.log('Build Bundle Err', gutil.colors.red(err));
        });
});

gulp.task('move', function() {
    gulp.src('./app/index.html')
        .pipe(gulp.dest('dist/'));

    gulp
        .src(['./app/components/**/*.html'])
        .pipe(gulp.dest('./dist/components'));
    
    gulp
        .src(['./app/css/*.css'])
        .pipe(gulp.dest('./dist/css'))
});

gulp.task('connect', function () {

    // Uses gulp-connect plugin to start up a server
    connect.server({
        root: ['dist'],
        port: 9000
    });
});

gulp.task('build', function(cb) {
    runSequence('babel', ['systemjs-build'], 'move', cb);
});

gulp.task('default', ['build', 'move', 'watch', 'connect']);
