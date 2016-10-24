//Database
var Img = require('./models');
//Img.sync({force: true});

//Promises
var Promise = require("bluebird");
var fs = require('fs');

//Canvas
var Canvas = require('canvas');
var Image = Canvas.Image;
var size = 800;
var canvas = new Canvas(size, size);
var ctx = canvas.getContext('2d');

//Setting up image-to-slices
var imageToSlices = require('image-to-slices');
imageToSlices.configure({clipperOptions: {canvas: require('canvas')}});

//setting up color-thief
var ColorThief = require('color-thief');
var colorThief = new ColorThief();

var imgPath = '../../Desktop/20141226145427.jpg';
var numTiles = 5000;
var length = Math.floor(Math.sqrt(numTiles));

var grid = [];

for (var i = 1; i <= length; i++) {
  grid.push(i * size/length);
}

imageToSlices(imgPath, grid, grid, {saveToDir: '../../Desktop/Photos/Tiles'}, mosaic);

//build array of tile objects (each object contains path and color)
function mosaic() {
  var tiles = [];

  for (var i = 1; i <= grid.length * grid.length; i++) {
    var color = colorThief.getColor('../../Desktop/Photos/Tiles/section-' + i + '.jpg');

    tiles.push({
      path:  '../../Desktop/Photos/Tiles/section-' + i + '.jpg',
      red:   color[0],
      green: color[1],
      blue:  color[2]
    });
  }

  // look for matches
  var getImagesFromTiles = function(tiles, results, cb) {
    if (typeof results == "function") {
      cb = results;
      results = [];
    }

    if (!tiles.length) {
      cb(results);
      return;
    }

    var tile = tiles.shift();
    var range = 10;
    bfunction(range);

    function bfunction(range) {
      Img.findAll({where: {
        red: {between: [tile.red - range, tile.red + range]},
        green: {between: [tile.green - range, tile.green + range]},
        blue: {between: [tile.blue - range, tile.blue + range]}
      }})
      .then(afunction);
    }

    function afunction(images) {
      if ( ! images.length) {
        range = range + 10;
        return bfunction(range);
      }

      var smallestDist;
      var bestMatch;

      images.forEach(function(image) {
        image.dist = Math.sqrt(Math.pow((tile.red - image.red), 2) + Math.pow((tile.green - image.green), 2) + Math.pow((tile.blue - image.blue), 2));

        if (!smallestDist || image.dist < smallestDist) {
          smallestDist = image.dist;
          bestMatch = image;
        }
      });

      results.push(bestMatch.path || images.shift().path);
      getImagesFromTiles(tiles, results, cb);
    }
  };

  getImagesFromTiles(tiles, function(paths) {
    var length = Math.floor(Math.sqrt(paths.length));
    var tile = size/length;
    var counter = 0;

    for (var y = 0; y < length; y++) {
      for (var x = 0; x < length; x++) {
        var img = new Image();
        img.src = paths[counter++];
        console.log("counter", counter);
        ctx.drawImage(img, x * tile, y * tile, tile, tile);
      }
    }

    fs.writeFile('../../Desktop/Photos/mosaic.jpg', canvas.toBuffer());
  });
}
