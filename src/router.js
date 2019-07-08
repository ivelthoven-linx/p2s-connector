const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const view = require("koa-view");
const koaSend = require("koa-send");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const authentication = require("./authentication").authentication;
const db = require("./dbFunctions");
const reqShopify = require("./reqShopify");
var Cookies = require("cookies");

/**
 * General Router
 */
const router = new Router();

router.use(bodyParser());
router.use(view(__dirname + "/../views")); // Views with nunjucks

router.get(
  "/",
  verifyRequest({ authRoute: "/auth", fallbackRoute: "/connect" }),
  ctx => {
    const { accessToken } = ctx.session;
    console.log(accessToken);
    return db
      .checkConnectionShopify(accessToken)
      .then(data => {
        ctx.body = data.accessKey + "\n" + data.secretKey;
      })
      .catch(err => {
        console.error(err);
        // ctx.body = err;
        // ctx.status = 500;
        ctx.redirect("/connect");
      });
  }
);

router.get("/all", ctx => {
  return db
    .getAll()
    .then(data => {
      ctx.body = data;
    })
    .catch(err => {
      console.error(err);
      ctx.body = err;
      ctx.status = 500;
    });
});

router.get("/shop", authentication, ctx => {
  return reqShopify
    .getShop(ctx.shopify)
    .then(data => {
      ctx.body = data;
    })
    .catch(err => {
      console.error(err);
      ctx.body = err;
      ctx.status = 500;
    });
});

router.post("/upload", authentication, ctx => {
  console.log(ctx.request.body.message);
  ctx.body = ctx.request.body;
});

/**
 * Image Route
 */
router.get("/images/(.*)", async ctx =>
  koaSend(ctx, ctx.path, {
    root: __dirname + "/../",
    immutable: true,
    maxAge: 60000
  })
);
/**
 * Views Route
 */
router.get("/connect", ctx => {
  return ctx.render("index");
});

// router.post("/connect", ctx => {
//   const ShopifyURL = ctx.request.body;
//   // ctx.cookies.set("ShopifyURL", ctx.request, { ShopifyURL: ShopifyURL });
//   // ctx.cookies.get("ShopifyURL");
//   console.log(ShopifyURL);
//   const cookies = new Cookies(ctx.request, ctx.res, {
//     ShopifyURL: ctx.cookies
//   });
//   cookies.set("ShopifyURL", ShopifyURL);
//   console.log(cookies.get("ShopifyURL"));
//   return ShopifyURL;
// });
module.exports = [router];
