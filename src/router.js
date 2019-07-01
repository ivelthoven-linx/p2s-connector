const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const reqShopify = require("./reqShopify");

const serve = require("koa-router-static");

/**
 * General Router
 */
const router = new Router();

router.use(bodyParser());

const authentication = async (ctx, next) => {
  const phomasToken = ctx.get("X-Phomas-Access-Token");
  if (phomasToken) {
    ctx.shopify = { url: "https://demo-phomas.myshopify.com", token: 2 };
    await next();
  } else {
    ctx.body = "invalid token or account not linked";
  }
};

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

// router.get(
//   "/images/*",
//   (ctx, next) => {
//     console.log("images");
//     next();
//   },
//   serve("../html/")
// );
// router.get(
//   "/connect/*",
//   (ctx, next) => {
//     console.log("connect");
//     next();
//   },
//   serve("../html/")
// );

/**
 * Static Html Router
 */
// const htmlRouter = new Router({
//   prefix: "/connect"
// });
// htmlRouter.get("/test", ctx => {
//   ctx.body = "test";
// });
// const path = require("path").dirname("../html");
// console.log(path);
// Serve(`/html`, htmlRouter);

// /**
//  * Static Image Router
//  */
// const imageRouter = new Router({
//   prefix: "/images"
// });
// imageRouter.use(serve("../images"));

module.exports = [router];
