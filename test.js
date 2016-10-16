Img.findAll({where: {
  red: {between: [tile.red - 10, tile.red + 10]},
  green: {between: [tile.green - 10, tile.green + 10]},
  blue: {between: [tile.blue - 10, tile.blue + 10]}
}})
.then(function(images) {
  var smallestDist;
  var bestMatch;

  images.forEach(function(image) {
    image.dist = Math.sqrt(Math.pow((tile.red - image.red), 2)
                + Math.pow((tile.green - image.green), 2)
                + Math.pow((tile.blue - image.blue), 2));

    if (!smallestDist || image.dist < smallestDist) {
      smallestDist = image.dist;
      bestMatch = image;
    }
  });

  results.push(bestMatch.path);
});
