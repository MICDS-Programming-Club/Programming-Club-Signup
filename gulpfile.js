const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');

// Clean the contents of the distribution directory
gulp.task('clean', function() {
	return del('src/public/**/*');
});

// Compile Sass
gulp.task('sass', function() {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('src/public/css'));
});

gulp.task('default', ['sass']);

var watcher = gulp.watch(['src/scss/**/*.scss'], ['sass']);
watcher.on('change', function(event) {
	console.log('File ' + event.path + ' was ' + event.type);
});
