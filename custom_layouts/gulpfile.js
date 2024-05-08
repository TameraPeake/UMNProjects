'use strict';

const {
    src,
    dest,
    parallel,
    series,
    watch
} = require('gulp');

/* define paths */
const sass_input = 'sass/*.scss';
const sass_output = 'css/custom_layouts.css';
const js_input = './js/dev/**/*.js';
const js_output = 'js/prod';


/* load plugins */
const sass = require('gulp-sass')(require('sass'));
sass.compiler = require('sass');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const changed = require('gulp-changed');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const jshint = require('gulp-jshint');
const jshintstylish = require('jshint-stylish');


/* build CSS */
function buildStyles() {
  return src(sass_input)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([ autoprefixer(), cssnano() ]))
    .pipe(sourcemaps.write('./maps'))
    .pipe(dest(sass_output));
};

/* build JS */
function buildScripts(){
  return src(js_input)
  .pipe(changed(js_input))
  .pipe(uglify())
  .pipe(rename({
      extname: ".min.js"
    }))
  .pipe(dest(js_output));
};

/* jshint */
function debugJS(){
  return src(js_input)
  .pipe(jshint())
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(jshint.reporter('fail'));
};

/* Watch CSS */
function watchCSS() {
    watch(sass_input, buildStyles);
}

/* Watch JS */
function watchJS() {
    watch(js_input, series(debugJS, buildScripts));
}

exports.buildStyles = buildStyles;
exports.buildScripts = buildScripts;
exports.debugJS = debugJS;
exports.watchCSS = watchCSS;
exports.watchJS = watchJS;
exports.default = parallel(watchJS, watchCSS);
