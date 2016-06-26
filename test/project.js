'use strict';

var path    = require('path');
var _       = require('underscore');
var sinon   = require('sinon');
var helpers = require('yeoman-test');
var assert  = require('yeoman-assert');
var base    = require('yeoman-generator').generators.Base;

var prompts = require('../generators/app/prompts').project;

var ALWAYS_INCLUDED = [
    'LICENSE',
    'package.json',
    'Gruntfile.js',
    '.gitignore',
    'config/default.json',
    'config/.eslintrc.js',
    'config/karma.conf.js',
    'test/config.js'
];

function verifyProjectDetails() {
    assert.fileContent('package.json', '"name": "tech"');
    assert.fileContent('package.json', '"author": "A. Developer"');
    ALWAYS_INCLUDED.forEach(file => assert.file(file));
}
function verifyProjectConfiguration(useBenchmark, useCoveralls, useJsinspect) {
    var verifyBenchmark = useBenchmark ? assert.fileContent : assert.noFileContent;
    var verifyCoveralls = useCoveralls ? assert.fileContent : assert.noFileContent;
    var verifyJsinspect = useJsinspect ? assert.fileContent : assert.noFileContent;
    (useBenchmark ? assert.file : assert.noFile)('test/benchmarks/example.benchmark.js');
    verifyBenchmark('Gruntfile.js','benchmark: ');
    verifyCoveralls('package.json', '"test-ci": "npm test && grunt coveralls"');
    verifyCoveralls('Gruntfile.js','coveralls: ');
    verifyJsinspect('package.json', '"inspect": "grunt jsinspect:app"');
    verifyJsinspect('Gruntfile.js','jsinspect: ');
}

describe('Project generator', function() {
    this.timeout(500);
    var stub;
    var SKIP_INSTALL = {skipInstall: true};
    describe('can create and configure files with prompt choices', function() {
        before(function() {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('all prompts TRUE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(prompts.defaults)
                .toPromise()
                .then(function() {
                    verifyProjectDetails();
                    verifyProjectConfiguration(true, true, true);
                });
        });
        it('all prompts FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend(_.clone(prompts.defaults), {
                    benchmark: false,
                    coveralls: false,
                    jsinspect: false
                }))
                .toPromise()
                .then(function() {
                    verifyProjectDetails();
                    verifyProjectConfiguration(false, false, false);
                });
        });
        it('only benchmark FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend(_.clone(prompts.defaults), {
                    benchmark: false
                }))
                .toPromise()
                .then(function() {
                    verifyProjectDetails();
                    verifyProjectConfiguration(false, true, true);
                });
        });
        it('only coveralls FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend(_.clone(prompts.defaults), {
                    coveralls: false
                }))
                .toPromise()
                .then(function() {
                    verifyProjectDetails();
                    verifyProjectConfiguration(true, false, true);
                });
        });
        it('only jsinspect FALSE', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(SKIP_INSTALL)
                .withPrompts(_.extend(_.clone(prompts.defaults), {
                    jsinspect: false
                }))
                .toPromise()
                .then(function() {
                    verifyProjectDetails();
                    verifyProjectConfiguration(true, true, false);
                });
        });
    });
    describe('can create and configure files with command line options', function() {
        before(function() {
            stub = sinon.stub(base.prototype.user.git, 'name');
            stub.returns(null);
        });
        after(function() {
            stub.restore();
        });
        it('--defaults', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(_.extend(_.clone(SKIP_INSTALL), {
                    defaults: true
                }))
                .toPromise()
                .then(function() {
                    verifyProjectDetails();
                    verifyProjectConfiguration(true, true, true);
                });
        });
        it('--defaults --no-benchmark', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(_.extend(_.clone(SKIP_INSTALL), {
                    defaults: true,
                    noBenchmark: true
                }))
                .toPromise()
                .then(function() {
                    verifyProjectDetails();
                    verifyProjectConfiguration(false, true, true);
                });
        });
        it('--defaults --no-coveralls', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(_.extend(_.clone(SKIP_INSTALL), {
                    defaults: true,
                    noCoveralls: true
                }))
                .toPromise()
                .then(function() {
                    verifyProjectDetails();
                    verifyProjectConfiguration(true, false, true);
                });
        });
        it('--defaults --no-jsinspect', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(_.extend(_.clone(SKIP_INSTALL), {
                    defaults: true,
                    noJsinspect: true
                }))
                .toPromise()
                .then(function() {
                    verifyProjectDetails();
                    verifyProjectConfiguration(true, true, false);
                });
        });
        it('--defaults --no-benchmark --no-coveralls --no-jsinspect', function() {
            return helpers.run(path.join(__dirname, '../generators/project'))
                .withOptions(_.extend(_.clone(SKIP_INSTALL), {
                    defaults: true,
                    noBenchmark: true,
                    noCoveralls: true,
                    noJsinspect: true
                }))
                .toPromise()
                .then(function() {
                    verifyProjectDetails();
                    verifyProjectConfiguration(false, false, false);
                });
        });
    });
});
