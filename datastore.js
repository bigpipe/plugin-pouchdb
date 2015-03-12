'use strict';

var fuse = require('fusing')
  , crypto = require('crypto');

/**
 * DataStore constructor that will always operate relative to the
 * provided pagelet.
 *
 * @Constructor
 * @param {Pagelet} pagelet Instance of pagelet.
 * @api public
 */
function DataStore(pagelet) {
  if (!this) return new DataStore(pagelet);

  this.fuse();

  this.readable('_pagelet', pagelet);
  this.readable('_pouchdb', pagelet._bigpipe.pouchdb);
  this.readable('_name', crypto.createHash('md5').update(pagelet.name).digest('hex'));

  pagelet.debug('Connected to datastore for %s', pagelet.id);
}

//
//  Provide readable and writable methods to DataStore to ensure
//  developers will be warned when they accidently override any
//  of the default methods.
//
fuse(DataStore);

/**
 * Generate the document ID from the pagelet name.
 *
 * @TODO add user session persistence in through cookie/session id
 *
 * @return {String} Md5 checksums of the pagelet name and sessions persistence id.
 * @api private
 */
DataStore.get('_id', function id() {
  return this._name; // + this._req.session.id;
});


/**
 * Fetch a document from the PouchDB database.
 *
 * @param {Object} options Set of options that pouchdb.get accepts.
 * @param {Function} callback Optional completion callback.
 * @api public
 */
DataStore.readable('get', function get(options, callback) {
  var id = this._id;

  this._pagelet.debug('Fetching from DataStore document: %s', id);
  this._pouchdb.get(id, options, callback);
});

/**
 * Store a document in the PouchDB database.
 *
 * @param {Object} options Set of options that pouchdb.get accepts.
 * @param {Function} callback Optional completion callback.
 * @api public
 */
DataStore.readable('put', function put(doc, rev, options, callback) {
  var id = this._id
    , n = Object.keys(doc).length;

  this._pagelet.debug('Storing %d properties in DataStore document: %s', n, id);
  this._pouchdb.post(doc, this._id, rev, options, callback);
});

//
// Expose the DataStore.
//
module.exports = DataStore;