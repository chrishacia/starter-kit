/*
----
All plugins between sourcemaps.init() and sourcemaps.write() need to support gulp-sourcemaps.
Check compatibility here:
https://github.com/floridoo/gulp-sourcemaps/wiki/Plugins-with-gulp-sourcemaps-support
----
*/

'use strict';

// Node (built-in)
let os = require('os');

// Modules we'll use
let PrettyError = require('pretty-error'); // Shows nice-looking errors in console
let gulp = require('gulp');
let $ = require('gulp-load-plugins')();
let minimist = require('minimist');
let beep = require('beepbeep');

let prettyError = new PrettyError();
prettyError.start();

let beepError = function (err) {
    beep();
    console.error(prettyError.render(err));
};

// ----
// Parse CLI Parameters
// ----

let knownOptions = {
    string: 'env',
    default: { env: 'dev' }
};

// process is a Node global
let options = minimist(process.argv.slice(2), knownOptions);
let IS_PROD = options.env === 'prod';

// Compile and Automatically Prefix Stylesheets
gulp.task('styles', function () {
    // For best performance, don't add Sass partials to `gulp.src`
    return gulp.src('src/styles/*.scss')
        .pipe($.plumber({ errorHandler: beepError }))
        .pipe($.if(IS_PROD, $.sourcemaps.init()))
        .pipe($.sass({
            // Precision required by Bootstrap
            // https://github.com/twbs/bootstrap-sass#sass-number-precision
            precision: 8,
            onError: console.error.bind(console, 'Sass error:'),
            includePaths: ['node_modules/bootstrap-sass/assets/stylesheets', 'node_modules/font-awesome/scss']
        }))
        .pipe($.if(IS_PROD, $.autoprefixer({browsers: ['last 2 versions']})))

        // Minify and optimize CSS structure. This is excruciatingly slow. Only use in production
        .pipe($.if(IS_PROD, $.cleanCss()))
        .pipe($.if(IS_PROD, $.sourcemaps.write('.')))
        .pipe(gulp.dest('dist/styles/'))
        .pipe($.size({title: 'styles'}));
});

gulp.task('icons', function() {
    return gulp.src('node_modules/font-awesome/fonts/**.*')
        .pipe(gulp.dest('dist/fonts'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**.*')
        .pipe(gulp.dest('dist/images'));
});

// Watch Files For Changes & Reload
gulp.task('watch', ['default'], function () {
    gulp.watch(['src/styles/**/*.{scss,css}'], ['styles']);
});

// ----
// Default
// ----

// Build Production Files, the Default Task
gulp.task('default', ['styles', 'icons', 'images']);
