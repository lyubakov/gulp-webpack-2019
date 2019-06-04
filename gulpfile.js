const
    gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    pug = require('gulp-pug'),
    sass= require('gulp-sass'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    rename = require('gulp-rename'),
    svgSprite = require('gulp-svg-sprite'),
    tinypng = require('gulp-tinypng-compress'),
    del = require('del'),
    gulpWebpack = require('gulp-webpack'),
    webpack = require('webpack'),
    webpackConfig = require('./webpack.config.js'),
    browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

const paths = {
    root: './build',
    templates: {
        pages: './src/views/pages/*.pug',
        src: './src/views/**/*.pug',
        dest: './build/'
    },
    styles:{
        pages: './src/assets/styles/stylesheets/*.sass',
        src: './src/assets/styles/**/*.sass',
        dest: './build/assets/styles'
    },
    scripts:{
        src: './src/assets/scripts/*.js',
        dest: './build/assets/scripts/'
    },
    fonts:{
        src: './src/assets/fonts/*',
        dest: './build/assets/fonts/'
    },
    images:{
        src: './src/assets/images/**/*.{jpg,jpeg,png}',
        dest: './build/assets/images/'
    },
    svg:{
        src: './src/assets/images/svg/*.svg',
        dest: './build/assets/images/svg/'
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
    browserSync.watch(paths.styles.src, browserSync.reload);
}

//clean
function clean() {
    return del(paths.root);
}

//pug
function templates() {
    return gulp.src(paths.templates.pages)
        .pipe(plumber())
        .pipe(pug({pretty: true}))
        .pipe(gulp.dest(paths.root));
}
//scss
function styles() {
    return gulp.src(paths.styles.pages)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(require('./postcss.config')))
        .pipe(sourcemaps.write())
        .pipe(rename(function(path){
            path.basename += ".min";
            path.extname = ".css";
        }))
        .pipe(gulp.dest(paths.styles.dest))
}

//images
function imagemove() {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        .pipe(gulp.dest(paths.images.dest))
}
function images() {
    return gulp.src(paths.images.src)
        .pipe(plumber())
        .pipe(tinypng({
            key: 'NFwd3gHobo7hcmje4Yl12wb0lya70pqv',
            sigFile: 'images/.tinypng-sigs',
            log: true
        }))
        .pipe(gulp.dest(paths.images.dest))
}

//SVG
svgConfig = {
    mode: {
        stack: {
            sprite: "sprite.svg"
        },
        shape: {
            spacing: {
                padding: 10
            }
        }
    }
}
function svg() {
    return gulp.src(paths.svg.src)
        .pipe(plumber())
        .pipe(svgSprite(svgConfig))
        .pipe(gulp.dest(paths.svg.dest))
}


//move fonts to build folder
function fonts() {
    return gulp.src(paths.fonts.src)
        .pipe(gulp.dest(paths.fonts.dest))
}
//webpack
function scripts() {
    return gulp.src(paths.scripts.src)
        .pipe(plumber())
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest))
}

exports.templates = templates;
exports.styles = styles;
exports.scripts = scripts;
exports.clean = clean;
exports.fonts = fonts;
exports.images = images;
exports.svg = svg;
exports.default = gulp.series(clean, gulp.parallel(styles, templates, scripts, fonts, imagemove, svg), gulp.parallel(watch,server));
exports.build = gulp.series(clean, gulp.parallel(styles, templates, scripts, fonts, images));