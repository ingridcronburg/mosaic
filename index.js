//Promises
var Promise = require("bluebird");
var fs = require('fs');
var readFile = Promise.promisify(fs.readFile);

//Setting up canvas
var Canvas = require('canvas');
var Image = Canvas.Image;
var canvas = new Canvas(300, 300);
var ctx = canvas.getContext('2d');

//Setting up image-to-slices
var imageToSlices = require('image-to-slices');
imageToSlices.configure({
    clipperOptions: {
        canvas: require('canvas')
    }
});

//setting up color-thief
var ColorThief = require('color-thief');
var colorThief = new ColorThief();

//testing color-thief
// var color = colorThief.getColor('img/cat.jpg');
// console.log('color is', color);

//testing image-to-slices
// imageToSlices('img/cat.jpg', [100, 200], [100, 200], {
//     saveToDir: 'img/sections'
// }, function() {
//     console.log('Image has been sliced!');
// });

//loop through the tiles and log the color of each tile
var tiles = [];

for (var i = 1; i <= 9; i++) {
  var tileColor = colorThief.getColor('img/sections/section-' + i + '.jpg');

  if (!tileColor) {
    tileColor = [255, 255, 255];
  }

  var tileObj = {
    path: 'img/sections/section-' + i,
    color: tileColor
  };

  tiles.push(tileObj);
}

//build array of potential replacement tiles
var replacements = [];

//manually adding objects to the replacements array for testing
replacements.push({path: 'img/replacements/1.jpg', color: [71, 62, 61]});
replacements.push({path: 'img/replacements/2.jpg', color: [61, 46, 45]});
replacements.push({path: 'img/replacements/3.jpg', color: [255, 255, 255]});
replacements.push({path: 'img/replacements/4.jpg', color: [97, 87, 88]});
replacements.push({path: 'img/replacements/5.jpg', color: [216, 211, 211]});
replacements.push({path: 'img/replacements/6.jpg', color: [80, 60, 53]});
replacements.push({path: 'img/replacements/7.jpg', color: [238, 236, 236]});
replacements.push({path: 'img/replacements/8.jpg', color: [222, 220, 219]});
replacements.push({path: 'img/replacements/9.jpg', color: [59, 47, 44]});

//search for color matches between the two arrays
var newTiles = [];

tiles.forEach(function(tile) {
  replacements.forEach(function(replacement) {
    if (replacement.color.toString() === tile.color.toString()) {
      newTiles.push(replacement.path);
    }
  });
});

//recreating image with replacement tiles
var mosaicArray = [];

for (var i = 0; i < newTiles.length; i++) {
  mosaicArray.push(readFile(newTiles[i]));
}

Promise.all(mosaicArray)
.then(function(images) {
  images.forEach(function(image, index) {
    var img = new Image();
    img.src = image;

    var xVal = (index * 100) % 300;
    var yVal;

    if (index < 3) {
      yVal = 0;
    } else if (index >=3 && index < 6) {
      yVal = 100;
    } else {
      yVal = 200;
    }

    ctx.drawImage(img, xVal, yVal, 100, 100);
  });
})
.then(function() {
  return fs.writeFile('img/finals/cat-mosaic.jpg', canvas.toBuffer());
});
