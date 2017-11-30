let gulp = require('gulp');
let cleanCss = require('gulp-clean-css');
let cleanHtml = require('gulp-htmlmin');

gulp.task('minify-css', () => {
    return gulp.src('./public/css/*.css')
        .pipe(cleanCss({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist'));
})

gulp.task('minify-html', () => {
    return gulp.src('./views/*.html')
        .pipe(cleanHtml({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['minify-css', 'minify-html'])