require("isomorphic-fetch");
const { default: shopifyAuth } = require("@shopify/koa-shopify-auth");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");
const Koa = require("koa");

const routers = require("./router");

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY } = process.env;
const PORT = process.env.PORT | 3000;

const app = new Koa();
app.keys = [SHOPIFY_API_SECRET_KEY];

routers.forEach(router => {
  app.use(router.routes()).use(router.allowedMethods());
});

app.proxy = true;
app.use(session(app)).use(
  shopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_API_SECRET_KEY,
    scopes: ["write_orders, write_products"],
    afterAuth(ctx) {
      const { shop, accessToken } = ctx.session;

      // Save everything to db
      console.log(shop);
      console.log(accessToken);
      // Create New API Keys

      ctx.redirect("/");
    }
  })
);

app.listen(PORT, () => {
  console.log(`> listening on port ${PORT}`);
});
