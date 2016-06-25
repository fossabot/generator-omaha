'use strict';

var fs              = require('fs');
var mkdirp          = require('mkdirp');
var yeoman          = require('yeoman-generator');
var GruntfileEditor = require('gruntfile-editor');
var utils           = require('../app/utils');
var banner          = require('../app/banner');
var prompt          = require('../app/prompts').webapp;
var tasks           = require('./gruntTaskConfigs');
var footer          = require('./doneMessage');

var commandLineOptions = {
    defaults: {
        type: 'Boolean',
        desc: 'Scaffold app with no user input using default settings',
        defaults: false
    },
    scriptBundler: {
        type: 'String',
        desc: 'Choose script bundler',
        defaults: 'requirejs'
    },
    cssPreprocessor: {
        type: 'String',
        desc: 'Choose CSS pre-processor',
        defaults: 'less'
    },
    templateTechnology: {
        desc: 'Choose technology to use when pre-compiling templates',
        defaults: 'handlebars'
    },
    deployDirectory: {
        type: 'String',
        desc: 'Designate path of directory for production app files.',
        defaults: 'dist/.'
    }
};

module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        var generator = this;
        yeoman.generators.Base.apply(generator, arguments);
        Object.keys(commandLineOptions).forEach(function(option) {
            generator.option(option, commandLineOptions[option]);
        });
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
            var bundler = generator.options.scriptBundler;
            var preprocessor = generator.options.cssPreprocessor;
            var templateTechnology = generator.options.templateTechnology;
            var options = {
                useBrowserify: (bundler === 'browserify') || prompt.defaults.useBrowserify,
                useLess:       (preprocessor === 'less'),
                useSass:       (preprocessor === 'sass'),
                useHandlebars: (templateTechnology === 'handlebars')
            };
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
                var bundler = (generator.options.scriptBundler || generator.use.scriptBundler).toLowerCase();
                var preprocessor;
                if (generator.options.cssPreprocessor === commandLineOptions.cssPreprocessor.defaults) {
                    preprocessor = generator.use.cssPreprocessor.toLowerCase();
                } else {
                    preprocessor = generator.options.cssPreprocessor;
                }
                var templateTechnology;
                if (generator.options.templateTechnology === commandLineOptions.templateTechnology.defaults) {
                    templateTechnology = generator.use.templateTechnology.toLowerCase();
                } else {
                    templateTechnology = generator.options.templateTechnology;
                }
                var options = {
                    useBrowserify: (bundler === 'browserify'),
                    useLess:       (preprocessor === 'less'),
                    useSass:       (preprocessor === 'sass'),
                    useHandlebars: (templateTechnology === 'handlebars')
                };
                Object.keys(options).forEach(function(option) {
                    generator[option] = options[option];
                });
                generator.projectName = props.projectName;
                generator.styleguide = props.styleguide;
                generator.appDir = (!/\/$/.test(props.appDir)) ? props.appDir + '/' : props.appDir;
                done();
            }.bind(generator));
        }
        generator.userName = generator.config.get('userName');
        generator.deployDirectory = generator.options.deployDirectory;
        generator.config.set('appDir', generator.appDir);
    },
    writing: {
        projectFiles: function() {
            var generator = this;
            generator.template('_README.md', 'README.md');
            generator.template('tasks/build.js', 'tasks/build.js');
            generator.template('tasks/app.js', 'tasks/app.js');
        },
        appFiles: function() {
            if (this.useHandlebars) {
                this.template('helpers/handlebars.helpers.js', this.appDir + 'app/helpers/handlebars.helpers.js');
            }
            this.template('helpers/jquery.extensions.js', this.appDir + 'app/helpers/jquery.extensions.js');
            this.template('helpers/underscore.mixins.js', this.appDir + 'app/helpers/underscore.mixins.js');
            this.fs.copy(
                this.templatePath('plugins/*.js'),
                this.destinationPath(this.appDir + 'app/plugins')
            );
            this.fs.copy(
                this.templatePath('shims/*.js'),
                this.destinationPath(this.appDir + 'app/shims')
            );
            this.template('_config.js', this.appDir + 'app/config.js');
        },
        assets: function() {
            if (this.useLess) {
                mkdirp(this.appDir + 'assets/less');
            }
            if (this.useSass) {
                mkdirp(this.appDir + 'assets/sass');
            }
            mkdirp(this.appDir + 'assets/fonts');
            mkdirp(this.appDir + 'assets/images');
            mkdirp(this.appDir + 'assets/templates');
            mkdirp(this.appDir + 'assets/library');
            this.fs.copy(
                this.templatePath('library/require.min.js'),
                this.destinationPath(this.appDir + 'assets/library/require.min.js')
            );
            this.fs.copy(
                this.templatePath('techtonic.png'),
                this.destinationPath(this.appDir + 'assets/images/logo.png')
            );
        },
        boilerplate: function() {
            this.template('_index.html', this.appDir + 'app/index.html');
            this.template('_app.js', this.appDir + 'app/app.js');
            this.template('_main.js', this.appDir + 'app/main.js');
            this.template('_router.js', this.appDir + 'app/router.js');
            this.template('example.model.js', this.appDir + 'app/models/example.js');
            this.template('example.view.js', this.appDir + 'app/views/example.js');
            this.template('example.controller.js', this.appDir + 'app/controllers/example.js');
            this.template('example.webworker.js', this.appDir + 'app/controllers/example.webworker.js');
            this.template('example.template.hbs', this.appDir + 'assets/templates/example.hbs');
            if (this.useLess) {
                this.template('_reset.css', this.appDir + 'assets/less/reset.less');
                this.template('_style.less', this.appDir + 'assets/less/style.less');
            }
            if (this.useSass) {
                this.template('_reset.css', this.appDir + 'assets/sass/reset.scss');
                this.template('_style.scss', this.appDir + 'assets/sass/style.scss');
            }
            if (!(this.useLess || this.useSass)) {
                this.template('_style.css', this.appDir + 'assets/css/style.css');
            }
        }
    },
    install: function() {
        var generator = this;
        var htmlDevDependencies = [
            'grunt-contrib-htmlmin',
            'grunt-htmlhint-plus'
        ];
        var cssDevDependencies = [
            'grunt-contrib-csslint',
            'grunt-postcss',
            'autoprefixer',
            'cssnano',
            'postcss-safe-parser'
        ];
        var requirejsDevDependencies = [
            'grunt-contrib-requirejs',
            'karma-requirejs'
        ];
        var dependencies = [
            'requirejs',
            'jquery',
            'underscore',
            'backbone',
            'backbone.marionette',
            'backbone.radio'
        ];
        var devDependencies = [].concat(
            htmlDevDependencies,
            cssDevDependencies,
            requirejsDevDependencies,
            generator.useBrowserify ? ['browserify', 'browserify-shim', 'aliasify', 'deamdify', 'grunt-browserify', 'grunt-replace'] : [],
            generator.use.benchmarks ? ['grunt-benchmark'] : [],
            generator.use.jsinspect ? ['jsinspect', 'grunt-jsinspect'] : [],
            generator.use.styleguide ? ['mdcss', 'mdcss-theme-github'] : [],
            generator.use.coveralls ? ['grunt-karma-coveralls'] : [],
            generator.use.a11y ? ['grunt-a11y', 'grunt-accessibility'] : [],
            generator.use.imagemin ? ['grunt-contrib-imagemin'] :[]
        );

        devDependencies = devDependencies.concat(
            generator.useLess ? ['grunt-contrib-less'] : [],
            generator.useSass ? ['grunt-contrib-sass'] : [],
            generator.useHandlebars ? ['grunt-contrib-handlebars'] : ['grunt-contrib-jst']
        );
        generator.useHandlebars && dependencies.push('handlebars');

        generator.npmInstall();
        generator.npmInstall(dependencies, {save: true});
        generator.npmInstall(devDependencies, {saveDev: true});
    },
    end: function() {
        var generator = this;
        var appDir = (generator.appDir !== './') ? generator.appDir : '';
        var editor = new GruntfileEditor(fs.readFileSync(generator.destinationPath('Gruntfile.js')).toString());
        utils.json.extend(generator.destinationPath('package.json'), {
            scripts: {
                'test-ci': 'npm test' + (generator.use.coveralls ? ' && grunt coveralls' : '')
            }
        });
        if (generator.useBrowserify) {
            editor.insertConfig('browserify', tasks.browserify);
            editor.insertConfig('replace', tasks.replace);
            editor.insertConfig('uglify', tasks.uglify);
            utils.json.extend(generator.destinationPath('package.json'), {
                browser: {
                    underscore: './node_modules/underscore/underscore-min.js'
                },
                browserify: {
                    transform: ['deamdify', 'browserify-shim', 'aliasify']
                },
                'browserify-shim': {
                    underscore: '_'
                },
                aliasify: {
                    aliases: {
                        app:       './' + appDir + 'app/app',
                        router:    './' + appDir + 'app/router',
                        templates: './' + appDir + 'app/templates'
                    },
                    replacements: {
                        'models/(\\w+)':      './' + appDir + 'app/models/$1',
                        'views/(\\w+)':       './' + appDir + 'app/views/$1',
                        'controllers/(\\w+)': './' + appDir + 'app/controllers/$1',
                        'plugins/(\\w+)':     './' + appDir + 'app/plugins/$1'
                    }
                }
            });
        }
        if (generator.useLess) {
            editor.insertConfig('less', tasks.less);
            utils.json.extend(generator.destinationPath('config/default.json'), {
                grunt: {
                    files: {
                        styles: "less/**/*.less"
                    }
                }
            });
        }
        if (generator.useSass) {
            editor.insertConfig('sass', tasks.sass);
            utils.json.extend(generator.destinationPath('config/default.json'), {
                grunt: {
                    files: {
                        styles: "sass/**/*.scss"
                    }
                }
            });
        }
        if (generator.use.a11y) {
            editor.insertConfig('a11y', tasks.a11y);
            editor.insertConfig('accessibility', tasks.accessibility);
        }
        if (generator.use.benchmarks) {
            editor.insertConfig('benchmark', tasks.benchmark);
        }
        if (generator.use.coveralls) {
            editor.insertConfig('coveralls', tasks.coveralls)
        }
        if (generator.useHandlebars) {
            editor.insertConfig('handlebars', tasks.handlebars);
        } else {
            editor.insertConfig('jst', tasks.jst);
        }
        if (generator.use.imagemin) {
            editor.insertConfig('imagemin', tasks.imagemin);
            editor.insertConfig('copy', tasks.copy);
        }
        editor.insertConfig('htmlhintplus', tasks.htmlhintplus);
        editor.insertConfig('htmlmin', tasks.htmlmin);
        if (generator.use.jsinspect) {
            editor.insertConfig('jsinspect', tasks.jsinspect);
            utils.json.extend(generator.destinationPath('package.json'), {
                scripts: {
                    inspect: 'grunt jsinspect:app'
                }
            });
        }
        editor.insertConfig('postcss', tasks.postcss(appDir));
        fs.writeFileSync(generator.destinationPath('Gruntfile.js'), editor.toString());
        generator.log(footer(generator));
    }
});