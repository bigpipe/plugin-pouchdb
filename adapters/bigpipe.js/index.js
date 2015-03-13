'use strict';

var debug = require('diagnostics')('plugin:pouchdb')
  , BigPipeJS = require('bigpipe.js')
  , read = require('fs').readFileSync
  , join = require('path').join;

//
// Provide a custom bootstrapper for Bigpipe.JS
//
BigPipeJS.extend({
  //
  // PouchDB options that should be provided to the client.
  //
  pouchdb: {},

  //
  // Replace the default bootstrap HTML template.
  //
  poucher: read(join(__dirname, 'bootstrap.html'), 'utf-8'),

  /**
   * Bootstrap templater extension that includes the provided PouchDB options
   * when BigPipe.JS is intialized.
   *
   * @param {Object} data Data provided from Bootstrap-Pagelet.
   * @return {String} Rendered template
   * @api public
   */
  bootstrap: function (data) {
    try {
      data.pouchdb = JSON.stringify(this.pouchdb);
    } catch(error) {
      debug('Failed to JSON.stringify the PouchDB options: %s,', error.message);
      data.pouchdb = '{}';
    }

    //
    // Call the original bootstrap template with all provided data
    // but now including PouchDB options.
    //
    return this.get('poucher', data);
  }
}).on(module);