const { request, GraphQLClient } = require("graphql-request");
const queries = require("./queries");

const { SHOPIFY_API_SECRET_KEY } = process.env;

const SHOPIFY_ENDPOINT =
  "https://demo-phomas.myshopify.com/admin/api/2019-04/graphql.json";

const client = new GraphQLClient(SHOPIFY_ENDPOINT, {
  headers: {
    "X-Shopify-Access-Token": SHOPIFY_API_SECRET_KEY
  }
});

exports.getShop = () => {
  return new Promise((res, rej) => {
    client
      .request(queries.GET_SHOP)
      .then(data => {
        res(data);
      })
      .catch(err => rej(err));
  });
};
