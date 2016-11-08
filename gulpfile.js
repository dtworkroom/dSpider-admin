var config = require("./build.config")
var gulp = require("gulp")
var sass = require('gulp-sass');
var path = require("path")
var babel = require("gulp-babel");
var postcss = require("gulp-postcss")
var autoprefixer = require('autoprefixer')
var postasset = require("postcss-assets")
var cssnano = require('cssnano')
var webpack = require("webpack");
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var uglify = require('gulp-uglify');
var cache = require('gulp-cache');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('gulp-browserify');
//var util = require("./build_script/utils");
//var rename = require("gulp-rename")
var log = console.log.bind(console);

//注册任务
css()
css(":r")
js()
js(":r")
gulp.task("default", ["r"]);
gulp.task("d", ["js", "css"]);
gulp.task("r", ["js:r", "css:r"]);

function js(type) {
    gulp.task("js" + (type || ""), function () {
        var stream = gulp.src(config.jsSrc)
            .pipe(sourcemaps.init())
            .pipe(babel({
                presets: ['es2015']
            }))
            .pipe(browserify({
                debug: false
            }))
        if (type == ":r") {
            stream = stream.pipe(uglify({
                compress: {warnings: true}
            }));
        }
        stream = stream.pipe(sourcemaps.write("./sources_maps"))
            .pipe(gulp.dest(config.jsDist));

        return stream;
    });
}
function css(type) {
    var processors = [
        postasset,
        autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.1'],
            cascade: true,
            remove: true
        })
    ];
    var depend = [];
    if (type == ":r") {
        processors.push(cssnano());
        depend[0] = "img"
    }
    gulp.task('css' + (type || ""), depend, function () {
        return gulp.src(config.cssSrc)
            .pipe(sass())
            .pipe(postcss(processors))
            //.pipe(rename(function (path) {
            //    path.extname = ".css"
            //}))
            .pipe(gulp.dest(config.cssDist));
    });
}

gulp.task('img', function () {
    gulp.src(config.imgSrc)
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(config.imgDist));
});

gulp.task('img:clear', function (done) {
    return cache.clearAll(done);
});
gulp.task('w', function () {
    var watcher = gulp.watch(config.cssSrc, ['css']);
    log("watching " + config.cssSrc
        + "... [crtl+c to stop.]");
    watcher.on('change', function (event) {
       log(JSON.stringify(event));
        log('File ' + event.path + ' was '
            + event.type + ', running tasks...');
    });
});



