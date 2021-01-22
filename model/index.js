const { Shoe, Color, Size, Quantity, Shoecolor, Shoesize } = require('../db/index.js');
const { Op } = require('sequelize');

let get = {
  colors: (id) => {
    return new Promise((resolve, reject) => {
      Shoecolor.findAll({
        where: {
          shoe_id: id
        }
      })
      .then (shoeColors => {
        return shoeColors.map(x => x.dataValues.color_id);
      })
      .then(colorIDs => {
        Color.findAll({
          where: {
            id: {
              [Op.or]: colorIDs
            }
          }
        })
        .then(results => {
          resolve(results.map(x => x.dataValues));
        })
      })
      .catch(err => {
        reject(err);
      });
    });
  },
  sizes: (id) => {
    return new Promise((resolve, reject) => {
      Shoesize.findAll({
        where: {
          shoe_id: id
        }
      })
      .then (shoesizes => {
        return shoesizes.map(x => x.dataValues.size_id);
      })
      .then(sizeIDs => {
        Size.findAll({
          where: {
            id: {
              [Op.or]: sizeIDs
            }
          }
        })
        .then(results => {
          resolve(results.map(x => x.dataValues));
        })
      })
      .catch(err => {
        reject(err);
      });
    });
  },
  quantity: (shoeID, colorID) => {
    return new Promise((resolve, reject) => {
      Quantity.findAll({
        where: {
          shoe_id: shoeID,
          color_id: colorID
        }
      })
      .then(results => {
        resolve(results.map(x => ({ size_id: x.dataValues.size_id, quantity: x.dataValues.quantity })));
      })
      .catch(err => {
        reject(err);
      });
    });
  }
}

let create = (shoeData) => {
  return Shoe.create({name: shoeData.name, model: shoeData.model})
.then(() => {
  Shoecolor.bulkCreate(shoeData.colors);
})
.then(() => {
  Shoesize.bulkCreate(shoeData.sizes);
})
.then(() => {
  Quantity.bulkCreate(shoeData.quantities);
})
.catch(err => {
  console.error(err);
});
}

  module.exports = {
    get: get,
    create: create
  }
