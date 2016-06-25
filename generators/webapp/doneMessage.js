var chalk = require('chalk');
var LETS_GET_STARTED = 'npm start';
var doneMessage = function(generator) {
    var SPACE = ' ';
    function yes(str) {return chalk.green.bold('✔ ') + chalk.white.bold(str);}
    function no(str) {return chalk.gray.bold('✗ ' + str);}
    var cssPreprocessor;
    var scriptBundler;
    if (generator.useSass) {
        cssPreprocessor = chalk.magenta.bold('Sass');
    } else if (generator.useLess) {
        cssPreprocessor = chalk.blue.bold('Less');
    } else {
        cssPreprocessor = chalk.gray.bold('none');
    }
    var message = '' +
        '\nApplication Name:  ' + chalk.inverse.bold(SPACE + generator.projectName + SPACE) +
        '\nScript Bundler:    ' + chalk[generator.useBrowserify ? 'yellow' : 'red'].bold(generator.useBrowserify ? 'Browserify' : 'r.js') +
        '\nCSS pre-processor: ' + cssPreprocessor +
        '\nTemplate renderer: ' + chalk[generator.useHandlebars ? 'yellow' : 'blue'].bold(generator.useHandlebars ? 'Handlebars' : 'Underscore') +
        '\n' +
        '\n' + (generator.use.jsinspect  ? yes : no)('Find duplicate code with JSInspect') +
        '\n' + (generator.use.a11y       ? yes : no)('Lint HTML with a11y') +
        '\n' + (generator.use.imagemin   ? yes : no)('Compress production images with imagemin') +
        '\n' + (generator.use.benchmarks ? yes : no)('Install benchmarks.js support') +
        '\n' + (generator.styleguide     ? yes : no)('Generate living styleguide with mdcss') +
        '\n' + (generator.use.coveralls  ? yes : no)('Integrate Coveralls.io support') +
        '\n' +
        '\n' + chalk.green.bold('All done!') +
        '\n' + chalk.white('Try out your shiny new app by running ') + chalk.bgBlack.white(SPACE + LETS_GET_STARTED + SPACE) +
        '\n';
    return message;
};

module.exports = doneMessage;