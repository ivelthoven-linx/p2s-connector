require("isomorphic-fetch");
const { default: shopifyAuth } = require("@shopify/koa-shopify-auth");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");
const db = require("./db");
const router = require("./router");

const Koa = require("koa");

const app = new Koa();

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY } = process.env;

app.use(router.routes()).use(router.allowedMethods());

app
  .use(session(app))
  .use(
    shopifyAuth({
      prefix: "/shopify",
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET_KEY,
      scopes: ["write_orders, write_products"],
      accessMode: "offline",
      afterAuth(ctx) {
        const { shop, accessToken } = ctx.session;

        console.log(shop);
        console.log("We did it!", accessToken);

        ctx.redirect("/");
      }
    })
  )
  .use(
    verifyRequest({
      // path to redirect to if verification fails
      // defaults to '/auth'
      authRoute: "/shopify/auth",
      // path to redirect to if verification fails and there is no shop on the query
      // defaults to '/auth'
      fallbackRoute: "/shopify/auth"
    })
  )
  .use(ctx => {
    ctx.body = "🎉";
  });

app.listen(3000);

module.exports = app;
