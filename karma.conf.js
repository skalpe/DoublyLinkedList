var sharedConfig = require('pipe/karma');

module.exports = function(config) {
  config.set({
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    // list of files / patterns to load in the browser
    files: [
      {pattern: 'src/**/*.js'},
      {pattern: 'test/**/*.js'}
    ]
  });

  //config.sauceLabs.testName = 'di.js';
};
