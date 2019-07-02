const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const reqShopify = require("./reqShopify");
const view = require("koa-view");
const koaSend = require("koa-send");
const authentication = require("./authentication").authentication;
// db.checkConnection(5, 20).then(res => {
//   console.log(res);
// });
/**
 * General Router
 */
const router = new Router();

router.use(bodyParser());
router.use(view(__dirname + "/../views")); // Views with nunjucks

router.get("/", ctx => {
  ctx.body = "P2S Connector";
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

module.exports = [router];
