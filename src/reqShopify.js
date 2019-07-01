const { request, GraphQLClient } = require("graphql-request");
const queries = require("./queries");

const SHOPIFY_GRAPHQL_EXT = "/admin/api/2019-04/graphql.json";

const getClient = (url, token) => {
  return new GraphQLClient(url + SHOPIFY_GRAPHQL_EXT, {
    headers: {
      "X-Shopify-Access-Token": token
    }
  });
};

exports.getShop = shopify => {
  return new Promise((res, rej) => {
    const client = getClient(shopify.url, shopify.token);
    client
      .request(queries.GET_SHOP)
      .then(data => {
        res(data);
      })
      .catch(err => rej(err));
  });
};

exports.appendImage = (shopify, productId, altText, tmpFilename) => {
  return new Promise((res, rej) => {
    const client = getClient(shopify.url, shopify.token);
    client
      .request(queries.APPEND_IMAGE, {
        input: {
          id: productId,
          images: [
            {
              id: null,
              altText: altText,
              src: "https://9zfne.sse.codesandbox.io/images/" + tmpFilename
            }
          ]
        }
      })
      .then(data => {
        res(data);
      })
      .catch(err => rej(err));
  });
};
