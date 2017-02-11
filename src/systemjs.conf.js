/**
 * Created by ruic on 11/02/2017.
 */


/*
 * This config is only used during development and build phase only
 * It will not be available on production
 *
 */

(function(global) {
    System.config({
        paths: {
            'n:*': './lib/*'
        },

        map: {
            'app': 'app',

            // angular bundles
            '@angular/core': 'n:@angular/core/bundles/core.umd.js',
            '@angular/common': 'n:@angular/common/bundles/common.umd.js',
            '@angular/compiler': 'n:@angular/compiler/bundles/compiler.umd.js',
            '@angular/platform-browser': 'n:@angular/platform-browser/bundles/platform-browser.umd.js',
            '@angular/platform-browser-dynamic': 'n:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
            '@angular/http': 'n:@angular/http/bundles/http.umd.js',
            '@angular/router': 'n:@angular/router/bundles/router.umd.js',
            '@angular/forms': 'n:@angular/forms/bundles/forms.umd.js',

            // angular testing umd bundles
            '@angular/core/testing': 'n:@angular/core/bundles/core-testing.umd.js',
            '@angular/common/testing': 'n:@angular/common/bundles/common-testing.umd.js',
            '@angular/compiler/testing': 'n:@angular/compiler/bundles/compiler-testing.umd.js',
            '@angular/platform-browser/testing': 'n:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
            '@angular/platform-browser-dynamic/testing': 'n:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
            '@angular/http/testing': 'n:@angular/http/bundles/http-testing.umd.js',
            '@angular/router/testing': 'n:@angular/router/bundles/router-testing.umd.js',
            '@angular/forms/testing': 'n:@angular/forms/bundles/forms-testing.umd.js',

            'rxjs': 'n:rxjs',
            'core-js': 'n:core-js',
            'ie-shim': 'n:ie-shim',
            'angular2-in-memory-web-api': 'n:angular2-in-memory-web-api',
            'moment': 'n:moment/min'
        },

        // packages tells the System loader how to load when no filename and/or no extension
        packages: {
            'app': {
                defaultExtension: 'js',
                format: 'cjs'
            },
            'rxjs': {
                defaultExtension: 'js'
            },
            'core-js': {
                defaultExtension: 'js'
            },
            'ie-shim': {
                defaultExtension: 'js',
                main: 'index.js'
            },
            'moment': {
                defaultExtension: 'js',
                main: 'moment-with-locales.min.js'
            }
        }
    });
})(this);