var	gulp    	= require('gulp'),
	scss        = require('gulp-sass'),
	browserSync = require('browser-sync'),
	uglify      = require('gulp-uglifyjs'),
	cssnano     = require('gulp-cssnano'),
	rename      = require('gulp-rename'),
	del         = require('del'),
	imagemin    = require('gulp-imagemin'),
	pngquant    = require('imagemin-pngquant'),
	autoprefixer= require('gulp-autoprefixer'),
	svgSprite = require('gulp-svg-sprite'),
	cheerio = require('gulp-cheerio'),
	replace = require('gulp-replace');

var config = {
	shape: {
		dimension: {         // Set maximum dimensions
			maxWidth: 500,
			maxHeight: 500
		},
		spacing: {         // Add padding
			padding: 0
		}
	},
	mode: {
		symbol: {
			dest : '.'
		}
	}
};
				
gulp.task('svg-sprite', function (cb) {
	return gulp.src('app/icons/*.svg')
		.pipe(svgSprite(config))	
		.pipe(cheerio({
						run: function($, file) {
								$('[fill]:not([fill="currentColor"])').removeAttr('fill');
								$('[stroke]').removeAttr('stroke');
						},
						parserOptions: { xmlMode: true }
				}))
		.pipe(replace('&gt;', '>'))
		.pipe(rename({ basename: 'sprite' }))
		.pipe(gulp.dest('app'))
});	

gulp.task('scss', function() {
	return gulp.src('app/scss/main.scss')
	.pipe(scss().on( 'error', function( error )
      {console.log( error );} )
	)
	.pipe(autoprefixer(['last 4 versions'], {cascade:true}))
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'})) 
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function() {
	return   gulp.src('app/js/main.js')
			.pipe(rename({suffix: '.min'}))
			.pipe(uglify()) 
			.pipe(gulp.dest('app/js'))
			.pipe(browserSync.reload({ stream: true }));
});
		
gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: false
	});
});

gulp.task('clean', function(){
	return del.sync('dist');
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	}))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'clean', 'scss', 'js'], function() {
	gulp.watch('app/icons/*.svg', ['svg-sprite']);
	gulp.watch('app/scss/**/*.scss', ['scss']);
	gulp.watch('app/js/main.js', ['js']);
});

gulp.task('build', ['clean',  'scss', 'img', 'js'], function() {
	var buildIndex = gulp.src('app/index.html')
	.pipe(gulp.dest('dist'));
	
	var buildCss = gulp.src('app/css/main.min.css')
	.pipe(gulp.dest('dist/css'));
	
	var buildJS = gulp.src('app/js/main.min.js' )
	.pipe(gulp.dest('dist/js'));
});


// Default Task
gulp.task('default', ['watch']);
