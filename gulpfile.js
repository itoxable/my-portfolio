var gulp = require('gulp');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var gulpSequence = require('gulp-sequence');
var template = require('gulp-template');
var plumber = require('gulp-plumber');
var uglify = require('gulp-uglify');
var del = require('del');

var connect = require('gulp-connect');
var $ = require('gulp-load-plugins')();
var iconfont = require('gulp-iconfont');
var url = require('url');
var proxy = require('proxy-middleware');
var iconfontCss = require('gulp-iconfont-css');
var gulpTypescript = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var filter = require("stream-filter");
var cleanCSS = require('gulp-clean-css');
var tslint = require('gulp-tslint');
var fileSystem = require('fs');
var path = require('path');
var angularCompilerCLI = require('@angular/compiler-cli');
var SystemJsBuilder = require('systemjs-builder');
require('reflect-metadata');
var tscWrapped = require('@angular/tsc-wrapped');
var angularCompiler = require('@angular/compiler-cli');

var concat = require('gulp-concat');

var conf = require('./config/conf.json');

var tsProject = gulpTypescript.createProject('tsconfig.json');


gulp.task('styles', function (cb) {
    gulpSequence('sass','fonts','images',
        cb);
});

gulp.task('sass',function() {
    return gulp.src(['./src/styles/style.scss', './src/styles/ie9-style.scss'])

        .pipe(plumber(function(err){
            console.log("*** Style Error ***");
            console.log(err);
        }))
        .pipe(sass())
        .pipe(csso())
        .pipe(plumber.stop())
        .pipe(autoprefixer({browsers: ['last 1 version']}))
        .pipe(gulp.dest('tmp/styles'))

        .pipe(gulp.dest(conf.distFolder+'/styles'))
        .pipe(browserSync.reload({stream: true}));
});


gulp.task('fonts',function() {
    return gulp.src(['./node_modules/**/*.{eot,svg,ttf,woff,woff2}'])
        .pipe($.flatten())
        .pipe(gulp.dest(conf.distFolder+'/styles/fonts'))
        .pipe(gulp.dest('tmp/styles/fonts'));
});

gulp.task('images', function() {
    return gulp.src('src/images/**/*')
        .pipe(gulp.dest('tmp/images'))
        .pipe(gulp.dest(conf.distFolder+'/images'));
});

gulp.task('tslint', function() {
    return gulp.src("src/**/*.ts")
        .pipe(tslint())
        .pipe(tslint.report('prose'));
});

//Deprecated
gulp.task('typescript-parse',function() {
    return gulp.src(['src/**/*.ts','!src/**/*.spec.ts'])
    //.pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(gulp.dest('./src/'))
        .pipe(gulp.dest('tmp/'))
        .pipe(uglify())
        //.pipe(gulp.dest(conf.distFolder));

});

gulp.task('typescript-parse-dev',function() {
    return gulp.src(['src/**/*.ts','!src/**/*.spec.ts'])
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(gulp.dest('./src/'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('tmp/'))
        //.pipe(uglify())
        .pipe(gulp.dest(conf.distFolder));

});

gulp.task('components', function (cb) {
    gulpSequence('typescript-parse',
        'styles',
        cb);
});

gulp.task('lib', function() {
    var arrDev = [
        './node_modules/es6-shim/es6-shim.min.js',
        './node_modules/systemjs/dist/system-polyfills.js',
        './node_modules/systemjs/dist/system.src.js',
        './node_modules/rxjs*/**/*.js',
        './node_modules/@angular*/**/*.js',
        './node_modules/reflect-metadata/Reflect.js',
        './node_modules/zone.js/dist/zone.js',
        './node_modules/ie-shim*/index.js',
        './node_modules/core-js*/client/shim.js',
        './node_modules/angular2-in-memory-web-api*/index.js',
        './node_modules/moment*/min/moment-with-locales.min.js',
        './node_modules/intl*/dist/Intl.min.js',
        './node_modules/intl*/locale-data/jsonp/en-GB.js',

        './node_modules/es6-shim/es6-shim.map',
        './node_modules/systemjs/dist/system-polyfills.map',
        './node_modules/systemjs/dist/system.src.map',
        './node_modules/rxjs*/**/*.map',
        './node_modules/@angular*/**/*.map',
        './node_modules/reflect-metadata/Reflect.js.map',
        './node_modules/zone.js/dist/zone.min.map',
        './node_modules/proj4/dist/proj4-src.map',
        './node_modules/openlayers/dist/ol-debug.map',
        './node_modules/intl*/dist/Intl.min.js.map'
    ];

    gulp.src(arrDev)
        .pipe(gulp.dest('tmp/lib/'));

    gulp.src(arrDev)
        .pipe(gulp.dest(conf.distFolder+'/lib'))

});

gulp.task('clean', del.bind(null, ['tmp', 'dist']));

gulp.task('systemjs-conf', function() {
    return gulp.src('./src/systemjs.conf.js')
        .pipe(gulp.dest('tmp/'));
});

gulp.task('build:tests', function() {
    return gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject()).pipe(gulp.dest('./src/'))

});

gulp.task('lib:prod', function() {
    var arrDev = [
        './node_modules/proj4/dist/proj4.js',
        './node_modules/openlayers/dist/ol.js',
    ];
    gulp.src(arrDev)
        .pipe(gulp.dest(conf.distFolder+'/lib'))
});

gulp.task('build:dev', function (cb) {
    gulpSequence('clean', 'lib', 'components',
        'systemjs-conf',
        cb);
});

gulp.task('build:normal', function (cb) {
    gulpSequence('build:dev', 'copy-temp', cb);
});

gulp.task('copy-temp', function (cb) {
    return gulp.src('./tmp/**').pipe(gulp.dest(conf.distFolder));
});

gulp.task('clean:prod', function (cb) {
    gulpSequence('clean','clean:aot', cb);
});

gulp.task('build:prod', function (cb) {
    gulpSequence('clean:prod', 'compile:aot', 'bundle:app', 'bundle:shims', 'lib:prod', 'styles', 'copy:aot-index', cb);
});

gulp.task('bundle:shims',function(done){
    var shims = ['./node_modules/core-js/client/shim.min.js', './node_modules/intl/dist/Intl.min.js', './node_modules/zone.js/dist/zone.js'];
    return gulp.src(shims)
        .pipe(concat('shims.js'))
        .pipe(gulp.dest(conf.distFolder+'/lib'));
});

gulp.task('bundle:app',function(done){
    var options = {
        format: 'cjs',
        minify: true,
        mangle: false
    };
    var builder = new SystemJsBuilder({
        base: './',
        defaultJSExtensions: true,
        paths: {
            'n:*': 'node_modules/*',
        },
        map: {
            'app': 'src/app',
            '@angular': 'n:@angular',
            'rxjs': 'n:rxjs',
            'moment': 'n:moment'
        },
        packages: {
            'app': { main: 'main-aot', defaultExtension: 'js' },
            '@angular/common': { main: 'index.js', defaultExtension: 'js' },
            '@angular/compiler': { main: 'index.js', defaultExtension: 'js' },
            '@angular/core/testing': { main: 'index.js', defaultExtension: 'js' },
            '@angular/core': { main: 'index.js', defaultExtension: 'js' },
            '@angular/forms': { main: 'index.js', defaultExtension: 'js' },
            '@angular/http': { main: 'index.js', defaultExtension: 'js' },
            '@angular/platform-browser': { main: 'index.js', defaultExtension: 'js' },
            '@angular/platform-browser-dynamic': { main: 'index.js', defaultExtension: 'js' },
            '@angular/router': { main: 'index.js', defaultExtension: 'js' },
            'rxjs': { main: 'Rx', defaultExtension: 'js' },
            'moment': { defaultExtension: 'js', main: './moment' }
        }
    });
    builder.buildStatic('app', conf.distFolder+'/lib/app.js', options)
        .then(function () {
            return done();
        })
        .catch(function (error) {
            return done(error);
        });
});

gulp.task('clean:aot', del.bind(null, ['./aot']));

gulp.task('copy:aot-index',function(done){
    return gulp.src('./config/index.html').pipe(gulp.dest(conf.distFolder));
});

gulp.task('compile:aot',function(done){
    return compile({ _: [], p: 'tsconfig.aot.json' }, done);
})

function codegen(ngOptions, cliOptions, program, host) {
    return angularCompiler.CodeGenerator.create(ngOptions, cliOptions, program, host).codegen();
}

function compile(args, callback) {
    var project = args.p || args.project || '.';
    var cliOptions = new tscWrapped.NgcCliOptions(args);
    return tscWrapped.main(project, cliOptions, codegen).then(function () {
        return callback;

    }).catch(function (e) {
        if (e instanceof tscWrapped.UserError || e instanceof angularCompiler.SyntaxError) {
            console.error(e.message);
            return Promise.resolve(1);
        }
        else {
            console.error(e.stack);
            console.error('Compilation failed');
            return Promise.resolve(1);
        }
    });
}
gulp.task('serve', function() {
    browserSync.init({
        server: {
            port: 3000,
            baseDir: ["./src","./tmp/"],
            middleware: [
                {
                    route: '/help',
                    handle: function (req, res, next) {
                        forward(req, res, next);
                    }
                },
                {
                    route: '/404',
                    handle: function (req, res, next) {
                        forward(req, res, next);
                    }
                },
                {
                    route: '/forbidden',
                    handle: function (req, res, next) {
                        forward(req, res, next);
                    }
                }
            ]
        }
    });
    gulp.watch('src/**/*.scss',['sass']);
    gulp.watch('src/**/*.ts').on('change', browserSync.reload);
    gulp.watch('src/**/*.html').on('change', browserSync.reload);
});
gulp.task('serve:prod', function() {
    browserSync.init({
        server: {
            port: 3000,
            baseDir: [conf.distFolder],
            middleware: [
                {
                    route: '/help',
                    handle: function (req, res, next) {
                        forward(req, res, next);
                    }
                },
                {
                    route: '/404',
                    handle: function (req, res, next) {
                        forward(req, res, next);
                    }
                },
                {
                    route: '/forbidden',
                    handle: function (req, res, next) {
                        forward(req, res, next);
                    }
                }
            ]
        }
    })
});


function forward(req, res, next) {
    fileSystem.readFile('./src/index.html', 'utf8', function (err, data) {
        if (err) {
            res.statusCode = 401;
        }else{
            res.setHeader("Content-Type", "text/html; charset=UTF-8");
            res.write(data);
        }
        res.end();
    });
}

gulp.task('tests-serve', function() {
    browserSync.init({
        server:{
            port: 3000,
            baseDir: ["./src","./node_modules/","./tmp/"],
            middleware: []
        }
    });
    gulp.watch('src/**/*test.ts').on('change', browserSync.reload);
});

gulp.task('default', function (cb) {
    gulpSequence('build:dev', 'serve', cb);
});
