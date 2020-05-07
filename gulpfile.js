var gulp = require('gulp');
var sass = require('gulp-sass');
var uglifycss = require('gulp-uglifycss');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');

var htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');

const { series } = require('gulp');

// compile scss to css
gulp.task('sass', function () {
    return gulp.src('./scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public'));
});

// return all css files uglified (per folder)
// add "min" in new file
// Important: ignore minified files --> duplication *.min.min.css
gulp.task('uglify-css', function () {
    return gulp.src(['./public/*.css', '!./public/*.min.css'])
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./public'));
});


// return all js files in one
gulp.task('concat-js', function() {
    return gulp.src('./js/*.js')
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./public'));
});


// return js files uglified
gulp.task('uglify-js', function() {
    return gulp.src('public/main.js')
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest('public'));
});

// see changes in several tabs simultaneously
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: "localhost:64266/Project/index.html"
    });
});

// return html files uglified
gulp.task('uglify-html', () => {
    return gulp.src('./*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('public'));
});

// return images minified to save space
gulp.task('minify-img', () => {
    return gulp.src('./img/**')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/images'));
});

// adds browser specific prefixes in your css files
gulp.task('autoprefix', () => {
    return gulp.src('./public/*.css')
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('./public'));
});


gulp.task('run', gulp.series('sass', 'uglify-css', 'concat-js', 'uglify-js'));


// watches your files for any changes
gulp.task('watch' ,function () {
    gulp.watch('./scss/**/*.scss', { ignoreInitial: false }, series('sass', 'uglify-css'));
    gulp.watch(['./js/**/*.js', './js/*.js'], { ignoreInitial: false }, series('concat-js', 'uglify-js'));
    gulp.watch('./*.html', 'uglify-html');
});