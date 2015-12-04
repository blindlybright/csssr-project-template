import gulp   from 'gulp';
import gutil  from 'gulp-util';
import gulpif from 'gulp-if';
import zip    from 'gulp-zip';
import paths  from '../paths';
import {name} from '../../package.json';

let correctNumber = (number) => number < 10 ? '0' + number : number;

let getDateTime = () => {
	let now = new Date();
	let year = now.getFullYear();
	let month = correctNumber(now.getMonth() + 1);
	let day = correctNumber(now.getDate());
	let hours = correctNumber(now.getHours());
	let minutes = correctNumber(now.getMinutes());

	return year + '-' + month + '-' + day + '-' + hours + '' + minutes;
};

gulp.task('zip:dist', () => {
	let zipDistName = name + '-dist-' + getDateTime() + '.zip';

	return gulp.src([
			paths.dist + '/**/*',
			'!**/*.zip'
		])
		.pipe(zip(zipDistName))
		.pipe(gulp.dest(paths.zip))
});

gulp.task('zip:app', () => {
	let zipAppName = name + '-app-' + getDateTime() + '.zip';

	return gulp.src([
		'**/*',
		'./.*',
		'!**/*.{zip,sublime-*}',
		'!{node_modules,node_modules/**/*}',
		'!{' + paths.dist + ',' + paths.dist + '/**/*}',
		'!{.git,.git/**/*}'
	])
		.pipe(zip(zipAppName))
		.pipe(gulp.dest(paths.zip))
});

gulp.task('zip', ['zip:app', 'zip:dist']);
