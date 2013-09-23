# level-geo
A geospatial index for LevelDB.

**Work in progress**

## Features

* GeoJSON Support
* R-Tree Index

## Install

```
$ npm install level-geo --save
```

## Usage

``` javascript
var level = require('levelup');
var Geo = require('level-geo');

var db = Geo(level('./db'));

var points = [
  { name: 'Pedro', lat: 6.233608, lng: -75.577697 }, // Medellin
  { name: 'Juan', lat:  6.155215, lng: -75.60395 }, // Sabaneta
  { name: 'Mario', lat: 6.137221 , lng: -75.386350 }, // Rionegro
  { name: 'Camilo', lat: 26.832983, lng: -80.889393 } // USA
];

var count = '0';
points.forEach(function (d) {
  db.put('myIndex_' + count++, d, function (err) {});
});

// BBox Search 
var bbox = [[-75.86, 5.99],[-75.20, 6.35]]; // Medellin Region
db.createSearchStream({
  bbox: bbox
}).on('data', console.log);

// { key: 'myIndex_2',
//   value: { name: 'Mario', lat: 6.137221, lng: -75.38635 } }
// { key: 'myIndex_1',
//   value: { name: 'Juan', lat: 6.155215, lng: -75.60395 } }
// { key: 'myIndex_0',
//   value: { name: 'Pedro', lat: 6.233608, lng: -75.577697 } }

```


### The MIT License (MIT)

Copyright (c) 2013 Julián Duque

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
