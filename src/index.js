// require("isomorphic-fetch");
const { default: shopifyAuth } = require("@shopify/koa-shopify-auth");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const session = require("koa-session");

const routers = require("./router");

const Koa = require("koa");

const app = new Koa();

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET_KEY } = process.env;
const PORT = process.env.PORT | 3000;

routers.forEach(router => {
  app.use(router.routes()).use(router.allowedMethods());
});

app.use(session(app)).use(
  shopifyAuth({
    apiKey: SHOPIFY_API_KEY,
    secret: SHOPIFY_API_SECRET_KEY,
    scopes: ["write_orders, write_products"],
    accessMode: "offline",
    afterAuth(ctx) {
      const { shop, accessToken } = ctx.session;

      // Save everything to db
      console.log(shop);
      console.log("We did it!", accessToken);

      ctx.redirect("/");
    }
  })
);
// .use(
//   verifyRequest({
//     // authRoute: "/shopify/auth",
//     // fallbackRoute: "/shopify/auth"
//   })
// );
// .use(ctx => {
//   ctx.body = "🎉";
// });

app.listen(PORT, () => {
  console.log(`> listening on port ${PORT}`);
});
