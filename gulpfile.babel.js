import { src, dest, watch, series, parallel  } from 'gulp';
import yargs from 'yargs';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import gulpif from 'gulp-if';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import imagemin from 'gulp-imagemin';
import del from 'del';
import webpack from 'webpack-stream';
import named from 'vinyl-named';
import browserSync from "browser-sync";
import concat from "gulp-concat";

const PRODUCTION = yargs.argv.prod;


export const concat_js = () => {
  return src([
        './src/js/jquery.min.js',
        './src/js/jquery.easing.min.js',
        './src/js/bootstrap.bundle.min.js',
        './src/js/jqBootstrapValidation.js',
        './src/js/contact_me.js',
        './src/js/grupo_la.js'
      ])
      .pipe(concat('grupo_la.js'))
      .pipe(dest('./dist/js'));
}

export const styles = () => {
  return src(['src/sass/style.scss'])
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, postcss([autoprefixer()])))
    .pipe(gulpif(PRODUCTION, cleanCss({compatibility:'ie8'})))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(dest('dist/css'));
}

export const images = () => {
  return src('src/images/**/*.{jpg,jpeg,png,svg,gif}')
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(dest('dist/images'));
}

export const copy = () => {
  return src(['src/**/*','!src/{images,js,sass,vendor,mail}','!src/{images,js,sass,vendor,mail}/**/*'])
    .pipe(dest('dist'));
}

export const clean = () => del(['dist']);

export const watchForChanges = () => {
  watch('src/sass/**/*.scss', series(styles, reload));
  watch('src/images/**/*.{jpg,jpeg,png,svg,gif}', series(images, reload));
  watch(['src/**/*','!src/{images,js,sass,vendor,mail}','!src/{images,js,sass,vendor,mail}/**/*'], series(copy, reload));
  watch('src/js/**/*.js', series(concat_js, reload));
  watch("**/*.php", reload);
}

const server = browserSync.create();
export const serve = done => {
  server.init({
    proxy: "http://localhost/_projetos/grupola_v1/" // put your local website link here
  });
  done();
};
export const reload = done => {
  server.reload();
  done();
};

export const dev = series(clean, parallel(styles, images, copy, concat_js), serve, watchForChanges);
export const build = series(clean, parallel(styles, images, copy, concat_js));
export default dev;