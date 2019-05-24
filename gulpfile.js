const
    gulp = require('gulp'),
    pug = require('gulp-pug'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    del = require('del'),
    gulpWebpack = require('gulp-webpack'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    browserSync = require('browser-sync').create();

const paths = {
    root: './build',
    templates: {
        pages: './src/views/pages/*pug',
        src: './src/views/**/*.pug',
        dest: './build/'
    },
    styles:{
        main: './src/assets/styles/main.scss',
        src: './src/assets/styles/**/*.scss',
        dest: './build/assets/styles'
    },
    scripts:{
        src: './src/assets/scripts/*.js',
        dest: './build/assets/scripts/'
    }
}

//watch
function watch() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.scripts.src, scripts);
}

//следим за build и релоадим браузер
function server() {
    browserSync.init({
        server: paths.root
    });
    browserSync.watch(paths.root + '**/*.*', browserSync.reload);
}

//clean
function clean() {
    return del(paths.root);
}

//pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(paths.root));
}
//scss
function styles() {
    return gulp.src(paths.styles.main)
        .pipe(sourcemaps.init())
        .pipe(postcss(require('./postcss.config')))
        .pipe(sourcemaps.write())
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest(paths.styles.dest))
}

//webpack
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest))
}

exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;
exports.default = gulp.series(clean, gulp.parallel(styles, templates, scripts), gulp.parallel(watch,server));
