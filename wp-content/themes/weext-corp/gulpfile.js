//npm install --save-dev autoprefixer browser-sync css-mqpacker cssnano gulp gulp-concat gulp-deporder gulp-imagemin gulp-newer gulp-postcss gulp-sass gulp-strip-debug gulp-uglify gulp-util postcss-assets

// Gulp.js configuration
'use strict';

const

  // source and build folders
  dir = {
    src         : 'src/',
    build       : ''
  },

  // Gulp and plugins
  gulp          = require('gulp'),
  gutil         = require('gulp-util'),
  newer         = require('gulp-newer'),
  imagemin      = require('gulp-imagemin'),
  sass          = require('gulp-sass'),
  postcss       = require('gulp-postcss'),
  deporder      = require('gulp-deporder'),
  concat        = require('gulp-concat'),
  stripdebug    = require('gulp-strip-debug'),
  uglify        = require('gulp-uglify'),
  log = require('fancy-log'),
  rename = require('gulp-rename')
;

// Browser-sync
var browsersync = false;


// PHP settings
const php = {
  src           : dir.src + 'template/**/*.php',
  build         : dir.build
};

// copy PHP files
gulp.task('php', () => {
  return gulp.src(php.src)
    .pipe(newer(php.build))
    .pipe(gulp.dest(php.build));
});

// image settings
const images = {
    src         : dir.src + 'images/**/*',
    build       : dir.build + 'images/'
  };
  
  // image processing
  gulp.task('images', () => {
    return gulp.src(images.src)
      .pipe(newer(images.build))
      .pipe(imagemin())
      .pipe(gulp.dest(images.build));
  });

  // CSS settings
var css = {
    src         : dir.src + 'scss/*.scss',
    watch       : dir.src + 'scss/**/*',
    build       : dir.build,
    sassOpts: {
      outputStyle     : 'nested',
      imagePath       : images.build,
      precision       : 3,
      errLogToConsole : true
    },
    processors: [
      require('postcss-assets')({
        loadPaths: ['images/'],
        basePath: dir.build,
        baseUrl: '/'
      }),
      require('autoprefixer')({
        browsers: ['last 2 versions', '> 2%']
      }),
      require('css-mqpacker'),
      require('cssnano')
    ]
  };
  
  // CSS processing
  gulp.task('css', ['images'], () => {

    return gulp.src(css.src)
        .pipe(sass(css.sassOpts))
        .pipe(postcss(css.processors))
        .pipe(rename('style.css'))
        .pipe(gulp.dest(css.build))
        .on('end', function(){ log(css.src); })
        .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop());
  });

  // JavaScript settings
const js = {
    src         : dir.src + 'js/**/*',
    build       : dir.build + 'js/',
    filename    : 'scripts.js'
  };
  
  // JavaScript processing
  gulp.task('js', () => {
  
    return gulp.src(js.src)
      .pipe(deporder())
      .pipe(concat(js.filename))
      .pipe(stripdebug())
      .pipe(uglify())
      .pipe(gulp.dest(js.build))
      .on('end', function(){ log(js.build); })
      .pipe(browsersync ? browsersync.reload({ stream: true }) : gutil.noop());
  
  });

  // run all tasks
gulp.task('build', ['css', 'js']);