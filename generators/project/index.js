'use strict';

var yeoman = require('yeoman-generator');
var utils  = require('../app/utils');
var banner = require('../app/banner');
var prompt = require('../app/prompts').project;

var commandLineOptions = {
    defaults: {
        type: 'Boolean',
        desc: 'Scaffold app with no user input using default settings',
        defaults: false
    },
    deployDirectory: {
        type: 'String',
        desc: 'Designate path of directory for production app files.',
        defaults: 'dist/.'
    }
};

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        var generator = this;
        generator.config.set('userName', generator.user.git.name() ? generator.user.git.name() : 'John Doe');
    },
    prompting: function() {
        var done = this.async();
        var generator = this;
        !generator.config.get('hideBanner') && generator.log(banner);
        if (generator.options.defaults) {
            generator.use = prompt.defaults;
            Object.keys(prompt.defaults).forEach(function(option) {
                generator[option] = prompt.defaults[option];
            });
            var options = {};
            Object.keys(options).forEach(function(option) {
                generator[option] = options[option];
            });
            done();
        } else {
            function isUnAnswered(option) {
                return !!!generator.options[option.name] || (generator.options[option.name] === commandLineOptions[option.name].defaults);
            }
            generator.prompt(prompt.questions.filter(isUnAnswered), function (props) {
                generator.use = props;
                var options = {};
                Object.keys(options).forEach(function(option) {
                    generator[option] = options[option];
                });
                generator.projectName = props.projectName;
                generator.appDir = (!/\/$/.test(props.appDir)) ? props.appDir + '/' : props.appDir;
                done();
            }.bind(generator));
        }
        generator.deployDirectory = 'dist/.'
        generator.config.set('appDir', generator.appDir);
    },
    writing: {
        projectFiles: function() {
            var generator = this;
            generator.userName = generator.config.get('userName');
            generator.appDir = './';
            generator.template('_LICENSE', 'LICENSE');
            generator.template('_package.json', 'package.json');
            generator.template('_Gruntfile.js', 'Gruntfile.js');
            generator.template('config/_gitignore', '.gitignore');
            generator.template('config/_default.json', 'config/default.json');
            generator.template('config/_csslintrc', 'config/.csslintrc');
            generator.template('config/_eslintrc.js', 'config/.eslintrc.js');
            generator.template('config/_karma.conf.js', 'config/karma.conf.js');
        },
        testFiles: function() {
            var generator = this;
            generator.template('test/config.js', 'test/config.js');
            generator.fs.copy(
                generator.templatePath('test/data/**/*.*'),
                generator.destinationPath('test/data')
            );
            generator.fs.copy(
                generator.templatePath('test/jasmine/**/*.*'),
                generator.destinationPath('test/jasmine')
            );
            if (generator.use.benchmarks) {
                generator.template('test/example.benchmark.js', 'test/benchmarks/example.benchmark.js');
            }
        },
    }
});