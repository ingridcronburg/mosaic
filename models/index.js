var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/mosaic', {logging: false});

  var Image = db.define('image', {
      path: {
          type: Sequelize.STRING,
          allowNull: false
      },
      red: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      green: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      blue: {
        type: Sequelize.INTEGER,
        allowNull: false
      }
  });

  module.exports = Image;
