'use strict';

var BigPipeJS = require('bigpipe.js')
  , read = require('fs').readFileSync
  , join = require('path').join;

//
// Provide a custom bootstrapper for Bigpipe.JS
//
BigPipeJS.extend({
  //
  // PouchDB plugin options.
  // @type {Object}
  //
  pouchdb: {},

  /**
   * Bootstrap templater extension that includes the provided PouchDB options
   * when BigPipe.JS is intialized.
   *
   * @param {Object} data Data provided from Bootstrap-Pagelet.
   * @return {String} Rendered template
   * @api public
   */
  bootstrap: function (data) {
    data.pouchdb = this.pouchdb;

    //
    // Call the original bootstrap template with all provided data
    // but now including PouchDB options.
    //
    return this.get.call(BigPipeJS.prototype, 'bootstrap', data);
  }
}).on(module);