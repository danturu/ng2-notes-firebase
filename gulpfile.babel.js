import del          from 'del'
import gulp         from 'gulp';
import autoprefixer from 'gulp-autoprefixer'
import connect      from 'gulp-connect'
import sass         from 'gulp-sass'
import sequence     from 'gulp-sequence'
import ts           from 'gulp-typescript'

let env = process.env.NODE_ENV || 'development'

let config = {
  ext: {
    sass: "{scss,css}", ts: "{ts,js}"
  },

  libs: [
    "systemjs/dist/system.js",
    "systemjs/dist/system.js.map",
    "angular2/bundles/angular2.dev.js",
    "angular2/bundles/router.dev.js",
    "angular2/bundles/router.dev.js.map",
  ],

  src: 'app', dest: 'public/assets'
}

let tsProject = ts.createProject('tsconfig.json', {
  typescript: require('typescript')
});

gulp.task('default', ['watch', 'serve']);

// Reset

gulp.task('reset', (done) =>
  del(config.dest, done)
);

// Build.

gulp.task('build.libs', () =>
  gulp.src(config.libs.map(lib => `node_modules/${lib}`)).pipe(gulp.dest(config.dest)).pipe(connect.reload())
);

gulp.task('build.sass', () =>
  gulp.src(`${config.src}/app.scss`)
    .pipe(sass({ includePaths: 'node_modules' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload())
);

gulp.task('build.ts', () => {
  let tsResult = gulp.src(`${config.src}/**/*.${config.ext.ts}`).pipe(ts(tsProject));

  return tsResult.js
    .pipe(gulp.dest(config.dest))
    .pipe(connect.reload());
})

gulp.task('build', (done) =>
  sequence('reset', 'build.libs', 'build.sass', 'build.ts', done)
);

// Watch.

gulp.task('watch.ts', () =>
  gulp.watch(`${config.src}/**/*.${config.ext.ts}`, ['build.ts'])
);

gulp.task('watch.sass', () =>
  gulp.watch(`${config.src}/**/*.${config.ext.sass}`, ['build.sass'])
)

gulp.task('watch', (done) =>
  sequence('build', ['watch.sass', 'watch.ts'], done)
);

// Serve.

gulp.task('serve', () => {
  connect.server({ port: '8000', root: 'public', livereload: true });
});

