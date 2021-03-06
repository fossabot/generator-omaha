/**
 * @description Static HTTP Server
 * @see [Using Express.js Middleware]{@link http://expressjs.com/guide/using-middleware.html}
 * @see [Third-Party Middleware]}@link http://expressjs.com/resources/middleware.html}
 * @see [krakenjs/lusca]{@link https://github.com/krakenjs/lusca}
 * @see [helmetjs/helmet]{@link https://github.com/helmetjs/helmet}
**/
'use strict';
<% if (markdownSupport) { %>
var fs         = require('fs-extra');<% } %>
var config     = require('config');
var express    = require('express');
var session    = require('express-session');
var lusca      = require('lusca');
var helmet     = require('helmet');
var compress   = require('compression');<% if (markdownSupport) { %>
var hljs       = require('highlight.js');
var Remarkable = require('remarkable');

var md = new Remarkable({
    highlight: function(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) {}
        }
        try {
            return hljs.highlightAuto(str).value;
        } catch (err) {}
        return '';
    }
});
<% } %>

var NINETY_DAYS_IN_MILLISECONDS = 7776000000;

var app = express()
    .engine('html', require('ejs').renderFile)<% if (markdownSupport) { %>
    .engine('md', function(path, options, fn) {
        fs.readFile(path, 'utf8', function(err, str) {
            if (err) return fn(err);
            try {
                var html = md.render(str);
                fn(null, html);
            } catch (err) {
                fn(err);
              }
        });
    })<% } %>
    .set('view engine', 'html')
    .set('views', __dirname + '/client')
    .use(session(config.get('session')))
    .use(function (req, res, next) {
        res.set('X-CSRF', req.sessionID);
        return next();
    })
    .disable('x-powered-by')                /** Do not advertise Express **/
    .use(lusca.csrf())                      /** Cross Site Request Forgery **/
    .use(lusca.csp({policy: config.csp}))   /** Content Security Policy **/
    .use(lusca.xframe('SAMEORIGIN'))        /** Helps prevent Clickjacking **/
    .use(lusca.hsts({maxAge: 31536000}))
    .use(lusca.xssProtection(true))
    .use(helmet.noSniff())
    .use(helmet.ieNoOpen())
    .use(helmet.referrerPolicy({policy: 'no-referrer'}))
    .use(helmet.hpkp({
        maxAge: NINETY_DAYS_IN_MILLISECONDS,
        sha256s: ['base64==', 'base64=='],  /** Needs to be changed **/
        includeSubdomains: true
    }))
    .use(compress())                        /** Use gzip compression **/
    .use(express.static(__dirname));        /** Serve static files **/
app.get('/', function(req, res) {
    if (res.get('X-CSRF') === req.sessionID) {
        res.render('index', {message: 'The server is functioning properly!'});
    } else {
        res.status(412).end();
    }
});

module.exports = app;
