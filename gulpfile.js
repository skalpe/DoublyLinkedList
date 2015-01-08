var gulp = require('gulp');
var pipe = require('pipe/gulp');
var traceur = require('gulp-traceur');
var connect = require('gulp-connect');


var path = {
  src: './src/**/*.js',
  pkg: './package.json'
};


// TRANSPILE ES6
gulp.task('build_source_amd', function() {
  gulp.src(path.src)
      .pipe(traceur(pipe.traceur()))
      .on('error', function(err){console.log(err)})
      .pipe(gulp.dest('dist/amd/transpile'))
      .on('error', function(err){console.log(err)});
});

gulp.task('build', ['build_source_amd']);

// WATCH FILES FOR CHANGES
gulp.task('watch', function() {
  gulp.watch(path.src, ['build']);
});

// WEB SERVER
gulp.task('serve', connect.server({
  root: [__dirname],
  port: 8000,
  open: {
    browser: 'chrome'
  }
}));
