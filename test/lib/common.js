'use strict';

const _      = require('lodash');
const assert = require('yeoman-assert');

const browserifyContent = [
    ['package.json', '"browser":'],
    ['package.json', '"browserify":'],
    ['package.json', '"aliasify":'],
    ['Gruntfile.js', 'browserify'],
    ['Gruntfile.js', 'uglify:']
];
const ariaContent = [
    ['Gruntfile.js', 'a11y: '],
    ['Gruntfile.js', 'accessibility: '],
    ['Gruntfile.js', 'aria-audit']
];

let verifyLessConfigured = _.partial(verifyPreprocessorConfigured, 'less');
let verifySassConfigured = _.partial(verifyPreprocessorConfigured, 'sass');

module.exports = {
    verifyCoreFiles,
    verifyNativeFiles,
    verifyBoilerplateFiles,
    verifyDefaultConfiguration,
    verifyNativeConfiguration,
    verifyDefaultTasksConfiguration,
    verifySassConfigured
};

function verifyCoreFiles() {
    let ALWAYS_INCLUDED = [
        'README.md',
        'Gruntfile.js',
        'config/default.json',
        'config/karma.conf.js',
        'config/stylelint.config.js',
        'tasks/webapp.js'
    ];
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
function verifyNativeFiles(isWebapp) {
    let ALWAYS_INCLUDED = [
        'bin/preload.js',
        'index.js',
        isWebapp ? 'renderer/app/index.html' : 'renderer/index.html'
    ];
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
function verifyBoilerplateFiles(sourceDirectory) {
    [
        'app/index.html',
        'app/app.js',
        'app/main.js',
        'app/config.js',
        'app/router.js',
        'assets/images/logo.png',
        'app/controllers/example.webworker.js',
        'app/helpers/jquery.extensions.js',
        'app/plugins/radio.logging.js',
        'app/plugins/redux.state.js',
        'app/shims/mn.morphdom.renderer.shim.js'
    ]
        .map(fileName => sourceDirectory + fileName)
        .forEach(file => assert.file(file));
}
function verifyDefaultConfiguration(sourceDirectory) {
    verifyCoreFiles();
    verifyLessConfigured(sourceDirectory);
    assert.fileContent(ariaContent);
    assert.fileContent('Gruntfile.js', 'imagemin: ');
    assert.noFileContent(browserifyContent); // script bundler
    assert.noFileContent('Gruntfile.js', 'jst'); // template technology
    assert.fileContent('Gruntfile.js', 'handlebars');// template technology
}
function verifyNativeConfiguration(isWebapp) {
    let startScript = isWebapp ? '"grunt compile && electron index"' : '"electron index"';
    assert.fileContent('package.json', `"start": ${startScript}`);
}
function verifyDefaultTasksConfiguration() {
    var defaultTaskConfigs = [
        ['Gruntfile.js', 'browserSync: {'],
        ['Gruntfile.js', 'clean: {'],
        ['Gruntfile.js', 'jsdoc: {'],
        ['Gruntfile.js', 'jsonlint: {'],
        ['Gruntfile.js', 'karma: {'],
        ['Gruntfile.js', 'open: {'],
        ['Gruntfile.js', 'requirejs: {'],
        ['Gruntfile.js', 'options: { spawn: false }'], // watch task
        ['Gruntfile.js', 'configFile: \'<%= files.config.eslint %>\''], // eslint task
        ['Gruntfile.js', 'eslint: require(config.files.config.eslint)']// plato task
    ];
    assert.fileContent(defaultTaskConfigs);
}
function verifyPreprocessorConfigured(type, sourceDirectory) {
    var EXT_LOOKUP = {
        less: 'less',
        sass: 'scss'
    };
    var ext = EXT_LOOKUP[type];
    var notType = _(EXT_LOOKUP)
        .omit(type)
        .keys()
        .head();
    var notExt = EXT_LOOKUP[notType];
    var customPath = sourceDirectory || '';
    assert.fileContent('Gruntfile.js', 'postcss: ');
    assert.file(`${customPath}assets/${type}/reset.${ext}`);
    assert.file(`${customPath}assets/${type}/style.${ext}`);
    assert.fileContent('Gruntfile.js', `${type}: `);
    assert.noFile(`${customPath}assets/${notType}/style.${notExt}`);
    assert.noFileContent('Gruntfile.js', `${notType}: `);
}
