const MongoMock = require("mongomock");

module.exports = new MongoMock({
  connections: [
    {
      shopifyUrl: "https://demo-phomas.myshopify.com",
      shopifyToken: 2,
      accessKey: "key",
      secretKey: "secret"
    }
  ]
});

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

// module.exports = {
//   createConnection,
//   checkConnection //,
//   // updateConnection,
//   // deleteConnection
// };
