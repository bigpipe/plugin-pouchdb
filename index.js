'use strict';

var PouchDB = require('pouchdb')
  , DataStore = require('./datastore');

//
// Plugin name.
//
exports.name = 'pouchdb';

/**
 * The server-side plugin for BigPipe which initialized the named database
 * and provides a datastore proxy to each pagelet with the correct references.
 *
 * Options.pouchdb is required, also provide a `name` property through options.
 *
 * @param {BigPipe} pipe The BigPipe instance.
 * @param {Object} options Optional options.
 * @api public
 */
exports.server = function server(bigpipe, options) {
  options = options('pouchdb', {});

  if (!options.name) return bigpipe.emit('error', new Error(
    'Missing database name or CouchDB proxy address'
  ));

  //
  // Initialize the database, providing a CouchDB address will setup a proxy.
  // Properties in `pouchdb` will be provided directly to the PouchDB instance.
  //
  bigpipe.pouchdb = new PouchDB(options);

  //
  // Extend the pagelet and provide a DataStore during construction.
  //
  bigpipe.on('transform:pagelet:after', function optimized(Pagelet, next) {
    var DataStorePagelet = Pagelet.extend({
      /**
       * Create a new datastore that proxies to a per user/per pagelet
       * document in pouchdb.
       */
      constructor: function constructor() {
        Pagelet.prototype.constructor.apply(this, arguments);

        this.data = new DataStore(this);
      }
    });

    next(null, DataStorePagelet);
  });
};

/**
 * The client-side plugin for BigPipe which adds XHR functionality.
 *
 * @param {BigPipe} pipe The BigPipe instance.
 * @param {Object} options Optional options.
 * @api public
 */
exports.client = function client(bigpipe, options) {
  // @TODO include library.
  options = options('pouchdb', {});

  if (!options.name) return bigpipe.emit('error', new Error(
    'Missing database name or CouchDB proxy address'
  ));

  //
  // Initialize the database, providing a CouchDB address will setup a proxy.
  // Properties in `pouchdb` will be provided directly to the PouchDB instance.
  //
  bigpipe.pouchdb = new PouchDB(options);

  //
  // Setup DataStore on pagelet.
  // @TODO merge in already existing data.
  //
  bigpipe.on('create', function created(pagelet) {
    pagelet.data = new DataStore(pagelet);
  });
};