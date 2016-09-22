var ColorThief = require('color-thief');
var colorThief = new ColorThief();

var color = colorThief.getColor('img/blue.jpg');
console.log('color is', color);
