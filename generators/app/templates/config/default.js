'use strict';
var uuid = require('node-uuid');

module.exports = {
    grunt: {
        ports: {
            default:    1337,
            karma:      4669,
            livereload: 46692
        },
        folders: {
            web:      'web',
            client:   'client',
            app:      'app',
            config:   'config',
            assets:   'assets',
            tasks:    'tasks',
            tests:    'tests',
            specs:    'jasmine/specs',
            coverage: 'coverage',
            reports:  'reports',
            docs:     'docs'
        },
        files: {
            config: {
                jshint:  './config/.jshintrc',
                jscs:    './config/.jscsrc',
                jsdoc:   './config/.jscsrc-jsdoc',
                csslint: './config/.csslintrc',
                karma:   './config/karma.conf.js'
            },
            index:        'index.html',
            styles:       'less/**/*.less',
            scripts:      '**/*.js',
            mainScript:   'main.js',
            configScript: 'config.js',
            models:       'models/**/*.js',
            views:        'views/**/*.js',
            controllers:  'controllers/**/*.js',
            fonts:        'fonts/*.{ttf,woff,eot,svg}',
            images:       'images/**/*.{png,jpg,gif,svg}',
            templates:    'templates/**/*.hbs'
        }
    },
    execMap: {
        py: 'python',
        rb: 'ruby'
    },
    session: {
        secret: uuid.v1(),
        resave: false,
        saveUninitialized: false
    },
    websocket: {
        port: 13337
    },
    http: {
        port: process.env.PORT || 3000
    },
    log: {
        level: "error"
    },
    csp: {
        'default-src': '\'self\'',
        'script-src':  '\'self\' cdnjs.cloudflare.com'
    }
};