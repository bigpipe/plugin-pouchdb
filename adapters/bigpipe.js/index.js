'use strict';

var read = require('fs').readFileSync
  , join = require('path').join;

//
// Provide a custom bootstrapper for Bigpipe.JS
//
require('bigpipe.js').extend({
  bootstrap: read(join(__dirname, 'bootstrap.html'), 'utf-8')
}).on(module);