/**
 * Created by ruic on 03/05/2016.
 */

/*global jasmine, __karma__, window*/
Error.stackTraceLimit = Infinity;
jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000;

//var distFolder = "dist/META-INF/resources";

__karma__.loaded = function () {
};

function isJsFile(path) {
    return path.endsWith('.js');
}

function isSpecFile(path) {
    return path.endsWith('.spec.js');
}

function isBuiltFile(path) {
    var builtPath = '/base/src/app/';
    return isJsFile(path) && (path.substr(0, builtPath.length) == builtPath);
}

var allSpecFiles = Object.keys(window.__karma__.files).filter(isSpecFile).filter(isBuiltFile);


// Load our SystemJS configuration.
System.config({
    baseURL: '/base'
});

var packages = {
    'app': {
        defaultExtension: 'js',
        format: 'cjs'
    },
    'rxjs': {
        defaultExtension: 'js'
    },
    'moment': {
        defaultExtension: 'js',
        main: 'moment-with-locales.min.js'
    }
};

System.config(
    {
        paths: {
            'n:*': 'node_modules/*'
        },

        map: {
            'rxjs': 'n:rxjs',
            //'@angular': 'node_modules/@angular',

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


            'angular2-in-memory-web-api': 'n:angular2-in-memory-web-api',
            'moment': 'n:moment/min',
            'app': 'src/app'
        },
        packages: packages
    });

Promise.all([
    System.import('@angular/core/testing'),
    System.import('@angular/platform-browser-dynamic/testing')
]).then(function (providers) {
    var coreTesting = providers[0];
    var browserTesting = providers[1];
    coreTesting.TestBed.initTestEnvironment( browserTesting.BrowserDynamicTestingModule, browserTesting.platformBrowserDynamicTesting());

}).then(function() {
    // Finally, load all spec files.
    // This will run the tests directly.
    return Promise.all(
        allSpecFiles.map(function (moduleName) {
            return System.import(moduleName);
        }));
}).then(__karma__.start, __karma__.error);
