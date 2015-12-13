// WARNING: Order matters!
var config = require('config').get('grunt');
var scripts = config.folders.app + '/' + config.files.scripts;       //app source
var templates = config.folders.assets + '/' + config.files.templates;//templates
module.exports = function(karmaConfig) {
    karmaConfig.set({
        basePath: '../',
        frameworks: [ 'requirejs', 'jasmine'],// WARNING: Order matters!
        files: [// WARNING: Order matters! (I think)
            {pattern: config.folders.tests + '/test-main.js'},
            {pattern: scripts, included: false},
            {pattern: templates, included: false},
            {pattern: config.folders.tests + '/' + config.folders.specs + '/**/*.js', included: false},//Jasmine Specs
            {pattern: config.folders.tests + '/data/modules/*.js',                    included: false},//Data modules
            {pattern: 'node_modules/sinon/pkg/sinon.js',                              included: false},//SinonJS
            {pattern: 'node_modules/jquery/dist/jquery.js',                           included: false},//jQuery
            {pattern: 'node_modules/handlebars/dist/handlebars.js',                   included: false},//Handlebars
            {pattern: 'node_modules/underscore/underscore.js',                        included: false},//Underscore
            {pattern: 'node_modules/backbone/backbone.js',                            included: false},//Backbone
            {pattern: 'node_modules/backbone.radio/build/backbone.radio.js',          included: false},//Backbone.Radio
            {pattern: 'node_modules/backbone.marionette/lib/backbone.marionette.js',  included: false} //Marionette
        ],
        exclude: [config.folders.app + '/config.js'],
        reporters: ['progress', 'coverage'],
        preprocessors: {
            [scripts]: ['coverage']
        },
        coverageReporter: {
            dir: config.folders.reports + '/' + config.folders.coverage,
            includeAllSources: true,
            reporters: [// WARNING: Order matters! (I think)
                {type: 'text-summary',subdir: '.', file: 'text-summary.txt'},
                {type: 'html', subdir: 'report-html'},
                {type: 'text-summary'},
                {type: 'lcov', subdir: 'report-lcov'},
                {type: 'cobertura', subdir: '.', file: 'report-cobertura.txt'}//Jenkins compatible
            ]
        },
        colors: true,
        logLevel: 'INFO',        //DISABLE, ERROR, WARN, INFO, DEBUG
        browsers: ['PhantomJS'], //Chrome, ChromeCanary, Firefox, Opera, IE (Win), Safari (Mac)
        captureTimeout: 60000,
        singleRun: true
    });
};