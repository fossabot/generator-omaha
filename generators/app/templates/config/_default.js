'use strict';
var uuid = require('node-uuid');

module.exports = {
    grunt: {
        ports: {
            server:     1337,
            karma:      4669,
            livereload: 46692
        },
        folders: {
            config:   'config',
            client:   'client',
            dist:     'dist',
            app:      '<%= appDir %>app',
            assets:   '<%= appDir %>assets',
            tasks:    '<%= appDir %>tasks',
            reports:  '<%= appDir %>reports',
            test:     '<%= appDir %>test',
            specs:    'jasmine/specs',
            coverage: 'coverage',
            docs:     'docs'
        },
        files: {
            config: {
                jshint:  './config/.jshintrc',
                eslint:  './config/.eslintrc.js',
                csslint: './config/.csslintrc',
                karma:   './config/karma.conf.js'
            },
            index:        'index.html',
            <% if (useLess) { %>styles:       'less/**/*.less',<% } %>
            <% if (useSass) { %>styles:       'sass/**/*.scss',<% } %>
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
    }
};
