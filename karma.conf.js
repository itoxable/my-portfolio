var conf = require('./config/conf.json');

module.exports = function(config) {

    var appBase   = './src/';      // transpiled app JS files
    var appAssets ='/base/src/app/'; // component assets fetched by Angular's compiler

    /**
     * This is for allowing to pass which browsers test as parameters (e.g: ...browsers-all, ...browsers-chrome-firefox)
     * if none if passed phantomJS will be selected
     *
     *
     */
    var browsers = [];
    for(var i= 0; i < process.argv.length; i++){
        var name = process.argv[i];
        if(name.startsWith('browsers')){
            var brws = name.split('-');

            if(brws[1] == 'all'.toLowerCase()){
                for(key in conf.existingBrowsers){
                    browsers.push(conf.existingBrowsers[key]);
                }
            }else{
                for(var j = 1; j < brws.length; j++){
                    var browser = conf.existingBrowsers[brws[j].toLowerCase()];
                    if(browser){
                        browsers.push(browser);
                    }else{
                        console.warn("Browser named '"+brws[j]+"' does not exist");
                    }
                }
            }
        }
    }

    if(browsers.length == 0){
        browsers.push(conf.existingBrowsers['phantomjs']);
    }
    //*****************************************
    
    config.set({

        basePath: '',
        frameworks: ['jasmine'],
        distFolder: conf.testDistFolder,

        files: [
            // Polyfills.
            'node_modules/core-js/client/shim.js',
            'node_modules/ie-shim/index.js',

            'node_modules/reflect-metadata/Reflect.js',

            // System.js for module loading
            'node_modules/systemjs/dist/system-polyfills.js',
            'node_modules/systemjs/dist/system.src.js',

            // Zone.js dependencies
            'node_modules/zone.js/dist/zone.js',
            'node_modules/zone.js/dist/long-stack-trace-zone.js',
            'node_modules/zone.js/dist/proxy.js',
            'node_modules/zone.js/dist/sync-test.js',
            'node_modules/zone.js/dist/jasmine-patch.js',
            'node_modules/zone.js/dist/async-test.js',
            'node_modules/zone.js/dist/fake-async-test.js',

            // RxJs.
            { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
            { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },
            
            //Moment JS
            { pattern: 'node_modules/moment/min/moment-with-locales.min.js', included: false, watched: false },

            {pattern: 'karma-test-shim.js', included: true, watched: true},
            //{pattern: 'built/test/matchers.js', included: true, watched: true},

            // paths loaded via module imports
            // Angular itself
            {pattern: 'node_modules/@angular/**/*.js', included: false, watched: true},
            {pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: true},
///Users/ruic/Projects/webdev/my-portfolio/node_modules/angularfire2
            {pattern: 'node_modules/angularfire2/**/*.js', included: false, watched: true},
            // {pattern: 'node_modules/angularfire2/**/*.js.map', included: false, watched: true},

            {pattern: 'node_modules/firebase/**/*.js', included: false, watched: true},

            // Our built application code
            {pattern: appBase+'**/*.js', included: false, watched: false},
            {pattern: appBase+'**/*.js.map', included: false, watched: true},

            // paths loaded via Angular's component compiler
            // (these paths need to be rewritten, see proxies section)
            {pattern: appBase+'**/*.html', included: false, watched: true},
            {pattern: appBase+'**/*.css', included: false, watched: true},

            // paths to support debugging with source maps in dev tools
            {pattern: appBase+'**/*.ts', included: false, watched: true},
            {pattern: appBase+'**/*.js.map', included: false, watched: false},
            {pattern: appBase+'images/*.*', included: false, watched: false}
        ],

        // proxied base paths
        proxies: {
            // required for component assests fetched by Angular's compiler
            "/app/": appAssets,
        },

        reporters: ['progress', 'html'],

        // HtmlReporter configuration
        htmlReporter: {
            // Open this file to see results in browser
            //outputFile: '_test-output/tests_'+date.toString()+'.html',
            outputFile: '_test-output/tests.html',
            // Optional
            pageTitle: 'Services frontend Unit Tests',
            subPageTitle: __dirname
        },

        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: browsers,
        singleRun: true,
        browserNoActivityTimeout: 30000

})
}