var sublevel = require('level-sublevel'),
    geoUtils = require('./lib/geo-utils'),
    rTree    = require('rtree');

module.exports = function (_db) {
  function Geo() {}

  _db = sublevel(_db);

  Geo.prototype = _db.sublevel('data');

  var _index    = _db.sublevel('index'),
      db        = new Geo(),
      rtree     = rTree();
  //
  // Override put
  //
  var put = db.put;
  db.put = function (key, val, cb) {
    if (geoUtils.isGeo(val)) {
      geoUtils.getGeoJSON(key, val, function (json) {
        rtree.geoJSON(json);
        _saveIndex();
      });
    }

    put.call(db, key, val, { valueEncoding: 'json'}, cb);
  };
  //
  // Override get
  //
  var get = db.get;
  db.get = function (key, cb) {
    get.call(db, key, { valueEncoding: 'json' }, cb);
  };

  function _saveIndex() {
    _index.put('_index', rtree.getTree(), function (err) {});
  }

  return db;
};

