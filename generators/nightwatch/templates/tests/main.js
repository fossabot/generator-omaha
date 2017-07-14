'use strict';

var {assert} = require('chai');

module.exports = {
    disabled: false,
    tags: ['sanity', 'navigation'],
    'Sanity Check': (browser) => {
        browser
            .url(browser.launch_url)
            .assert.title('Omaha Web App');
    },
    'End': (browser) => {
        browser.end();
    }
};
