var glob = require('glob');
var Img = require('./models');

var ColorThief = require('color-thief');
var colorThief = new ColorThief();

glob('../../Pictures/Pics/*.{jpg,JPG}', function(err, photos) {
  photos.forEach(function(photo, index) {
    var color = colorThief.getColor(photo);
    var red = color[0];
    var green = color[1];
    var blue = color[2];

    Img.create({
      path: photo,
      red: red,
      green: green,
      blue: blue
    });

    console.log('Image #' + index + ' created');
  });
});
