module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('process-styles', [
        <% if(useLess) { %>'less:main',/*pre-process */<% } %><% if(useSass) { %>'sass:main',/*pre-process */<% } %>
        'postcss'   /*post-process*/
    ]);
    grunt.registerTask('precompile-templates', [
        'handlebars:main'
    ]);
    grunt.registerTask('bundle-scripts', [
        'requirejs:bundle'
    ]);
    grunt.registerTask('compile', [
        'clean:compile',
        'process-styles',
        'precompile-templates'
    ]);
    grunt.registerTask('build', [
        'clean:build',
        'compile',
        'bundle-scripts',
        'htmlmin',<% if(props.compressImages) { %>
        'imagemin:build',<% } %>
        'copy'
    ]);
    grunt.registerTask('demo', 'Build code and open in browser', [
        'build',
        'open:demo',
        'express:demo'
    ]);
    grunt.registerTask('docs', 'Generate documentation with JSDoc3', [
        'clean:docs',
        'jsdoc:app'
    ]);
    grunt.registerTask('reports', 'Generate code coverage, plato report and documentation - then open all in browser', [
        'docs',
        'plato',
        'cover',
        'open:docs',
        'open:coverage',
        'open:plato'
    ]);
};
