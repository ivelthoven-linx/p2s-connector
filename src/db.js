var MongoMock = require("mongomock");
const db = new MongoMock({
  connections: [
    {
      shopifyUrl: "demo-phomas.myshopify.com",
      shopifyToken: 2,
      accessKey: 5,
      secretKey: 28
    }
  ]
});

function createConnection(shopifyUrl, shopifyToken, accessKey, secretKey) {
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
}

function checkConnection(accessKey) {
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
}

// function updateConnection(shopifyToken) {
//   return new Promise(function(resolve, reject) {
//     db.collection("connections").update(
//       { shopifyToken: shopifyToken },
//       { $set: { shopifyUrl: shopifyUrl, shopifyToken: shopifyToken } },
//       (err, res) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(res);
//       }
//     );
//   });
// }

// function deleteConnection(shopifyToken) {
//   return new Promise(function(resolve, reject) {
//     db.collection("connections").remove(
//       { phomasToken: phomasToken },
//       (err, res) => {
//         if (err) {
//           reject(err);
//         }
//         resolve(res);
//       }
//     );
//   });
// }

module.exports = {
  createConnection,
  checkConnection //,
  // updateConnection,
  // deleteConnection
};
