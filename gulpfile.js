const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const livereload = require('gulp-livereload');
// Minify JS
gulp.task('js', () =>
  gulp.src('src/js/*.js')
    .pipe(babel({ presets: ['minify'] }))
    .pipe(gulp.dest('public/js'))
);

// Compile SCSS
gulp.task('sass', () => 
  gulp.src('src/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ grid: true }))
    .pipe(cssmin())
    .pipe(gulp.dest('public/css'))
);

gulp.task('default', () => {
  livereload.listen()
  gulp.watch('src/scss/**/*.scss', ['sass']);
  gulp.watch('src/js/*.js', ['js']);
});
