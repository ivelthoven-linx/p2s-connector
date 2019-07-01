var MongoMock = require("mongomock");
const db = new MongoMock({
  instances: []
});

function createInstance(phomasUrl, phomasToken, shopifyUrl, shopifyToken) {
  var promise = new Promise(function(resolve, reject) {
    db.collection("instances").insert(
      {
        phomasUrl: phomasUrl,
        phomasToken: phomasToken,
        shopifyUrl: shopifyUrl,
        shopifyToken: shopifyToken
      },
      (err, res) => {
        if (err) {
          console.log(err);
          reject(err);
        }
        resolve(res);
      }
    );
  });
  return promise;
}

function readInstance(phomasToken) {
  return new Promise(function(resolve, reject) {
    db.collection("instances")
      .find({ phomasToken: phomasToken })
      .toArray(function(err, res) {
        if (err) {
          console.log(err);
          reject(err);
        }
        console.log(res);
        resolve(res);
      });
  });
}

function updateInstance(phomasToken, shopifyUrl, shopifyToken) {
  return new Promise(function(resolve, reject) {
    db.collection("instances").update(
      { phomasToken: phomasToken },
      { $set: { shopifyUrl: shopifyUrl, shopifyToken: shopifyToken } },
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      }
    );
  });
}

function deleteInstance(phomasToken) {
  return new Promise(function(resolve, reject) {
    db.collection("instances").remove(
      { phomasToken: phomasToken },
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      }
    );
  });
}

module.exports = {
  db,
  createInstance,
  readInstance,
  updateInstance,
  deleteInstance
};
