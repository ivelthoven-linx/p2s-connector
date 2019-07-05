require("isomorphic-fetch");
const { default: shopifyAuth } = require("@shopify/koa-shopify-auth");
const nanoid = require("nanoid");
const db = require("./dbFunctions");
const session = require("koa-session");
const Koa = require("koa");

const routers = require("./router");

//TEST
// require("./authenticationTest");

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

      const accessKey = nanoid(20);
      const secretKey = nanoid(40);

      // Save everything to db
      db.createConnection(
        "https://" + shop,
        accessToken,
        accessKey,
        secretKey
      ).catch(err => {
        console.error(err);
      });

      ctx.redirect("/");
    }
  })
);

app.listen(PORT, () => {
  console.log(`> listening on port ${PORT}`);
});
