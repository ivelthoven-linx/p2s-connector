const MongoMock = require("mongomock");
const db = new MongoMock({
  connections: [
    {
      shopifyUrl: "https://demo-phomas.myshopify.com",
      shopifyToken: 2,
      accessKey: "key",
      secretKey: "secret"
    }
  ]
}); //require("./db");

exports.createConnection = (shopifyUrl, shopifyToken, accessKey, secretKey) => {
  var promise = new Promise(function(resolve, reject) {
    db.collection("connections").insert(
      {
        shopifyUrl: shopifyUrl,
        shopifyToken: shopifyToken,
        accessKey: accessKey,
        secretKey: secretKey
      },
      (err, res) => {
        if (err) {
          reject(err);
        }
        resolve(res);
      }
    );
  });
  return promise;
};

exports.checkConnectionPhomas = accessKey => {
  return new Promise(function(resolve, reject) {
    db.collection("connections")
      .find({ accessKey: accessKey })
      .toArray(function(err, res) {
        if (err) {
          reject(err);
        }
        if (res.length === 1) {
          resolve(res[0]);
        } else {
          reject(new Error("wrong credentials"));
        }
      });
  });
};

exports.checkConnectionShopify = shopifyToken => {
  return new Promise(function(resolve, reject) {
    db.collection("connections")
      .find({ shopifyToken: shopifyToken })
      .toArray(function(err, res) {
        if (err) {
          reject(err);
        }
        if (res.length === 1) {
          resolve(res[0]);
        } else {
          reject(new Error("wrong credentials"));
        }
      });
  });
};

exports.getAll = () => {
  return new Promise(function(resolve, reject) {
    db.collection("connections").toArray((err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
};
