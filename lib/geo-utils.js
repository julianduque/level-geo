var GeoJSON = require('geojson');
GeoJSON.defaults = { 'Point': ['lat', 'lng'], 'LineString': 'line', 'Polygon': 'polygon' };

exports.isGeo = function (obj) {
  if (obj === null) return false;

  if (typeof obj !== 'object') return false;

  if (obj.lat && obj.lng) return true;
  if (obj.poygon) return true;
  if (obj.line) return true;

  return false;
};

exports.getGeoJSON = function (key, json, cb) {
  var obj = {};
  obj['_key'] = key;

  if (json.lat) obj.lat = json.lat;
  if (json.lng) obj.lng = json.lng;
  if (json.line) obj.line = json.line;
  if (json.polygon) obj.polygon = json.polygon;

  GeoJSON.parse([ obj ], {}, function (geo) {
    cb(geo);
  });
};
