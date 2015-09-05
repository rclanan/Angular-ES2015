module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        files: [
            'node_modules/babel-core/browser-polyfill.js',
            'app/bower_components/angular/angular.js',
            'app/*.js',
            'app/components/**/*.js'
        ],
        exclude: [

        ],
        preprocessors: {
        },
        reporters: ['coverage'],
        port: 7891,
        colors: true,
        logLevel: config.LOG_INFO,
        browsers: ['PhantomJS'],
        singleRun: false
    });
};
