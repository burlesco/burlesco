var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCSS = require('gulp-csso');

gulp.task('css', function(){
  return gulp.src('node_modules/bulma/bulma.sass')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(gulp.dest('build'))
});

gulp.task('default', [ 'css' ]);
