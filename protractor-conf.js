/**
 * Created by ruic on 16/03/2016.
 */

exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: [
        './src/app/components/header/header.component.e2e-spec.js',
        './src/app/components/search/search.component.e2e-spec.js'
    ],


    baseUrl: 'http://localhost:3000',

    // Special option for Angular2, to test against all Angular2 applications
    // on the page. This means that Protractor will wait for every app to be
    // stable before each action, and search within all apps when finding
    // elements.
    useAllAngular2AppRoots: true

    // Alternatively, you could specify one root element application, to test
    // against only that one:
    // rootElement: 'async-app'
};