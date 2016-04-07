/**
 * @file Application Core
 * @author <%= userName %>
 * @version 1.0.0
 * @license MIT
 * @module app
 * @exports app
**/
define(function(require, exports, module) {
    'use strict';

    var Backbone   = require('backbone');
    var Marionette = require('backbone.marionette');

    require('./shims/marionette.radio.shim');<% if (useHandlebars) { %>
    require('./helpers/handlebars.helpers');<% } %>
    require('./helpers/jquery.extensions');
    require('./helpers/underscore.mixins');

    /**
     * @class ApplicationModel
     * @extends Backbone.Model
     * @prop {object} default
     * @prop {string} default.name='<%= projectName %>'
    **/
    var ApplicationModel = Backbone.Model.extend({
        defaults: {
            name: '<%= projectName %>'
        }
    });
    var App = new Marionette.Application();
    App.model = new ApplicationModel();
    App.regions = new Marionette.RegionManager({
        regions: {
            'root': 'body'
        }
    });

    module.exports = App;
});
