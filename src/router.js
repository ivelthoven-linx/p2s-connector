const bodyParser = require("koa-bodyparser");
const Router = require("koa-router");
const view = require("koa-view");
const koaSend = require("koa-send");
const { verifyRequest } = require("@shopify/koa-shopify-auth");
const request = require("request-promise-native");

const authentication = require("./authentication").authentication;
const db = require("./dbFunctions");
const reqShopify = require("./reqShopify");
const publicImages = require("./publicImages");

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
        ctx.render("APIcredentials", {
          APIkey: data.accessKey,
          secretKey: data.secretKey
        });
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

/**
 * Image Uploading
 */
router.post("/upload", authentication, ctx => {
  console.log(ctx.request.body.message);
  ctx.body = ctx.request.body;
});

/**
 * Image Routes
 */
router.get("/images/(.*)", async ctx =>
  koaSend(ctx, ctx.path, {
    root: __dirname + "/../",
    immutable: true,
    maxAge: 60000
  })
);

/**
 * Views Routes
 */
router.get("/connect", ctx => {
  return ctx.render("index");
});

router.post("/connect", async ctx => {
  console.log(ctx.request.body);
  const shop = ctx.request.body.shop;

  const data = JSON.stringify({
    message: "Shopify.API.remoteRedirect",
    data: {
      location: `https://6wsfv.sse.codesandbox.io/auth/enable_cookies?shop=${shop}`
    }
  });
  return request
    .post(`https://${shop}`, data)
    .then(() => {
      ctx.redirect(`https://6wsfv.sse.codesandbox.io/auth?shop=${shop}`);
    })
    .catch(err => {
      console.error(err.name);
      console.error(err.statusCode);
      console.log("\n\n\n");
      console.error(err);
      // if err is request error (doesn't exsist) than redirect back else go to auth
      if (err.name === "RequestError" && !err.statusCode) {
        return ctx.render("index", { err: "Invalid shopify url" });
      } else {
        ctx.redirect(`https://6wsfv.sse.codesandbox.io/auth?shop=${shop}`);
      }
    });
  // return request.post(`https://${shop}`, data, (err, response, body) => {
  //   if (err) {
  //     ctx.redirect("https://6wsfv.sse.codesandbox.io/connect");
  //   } else {
  //     ctx.redirect(`https://6wsfv.sse.codesandbox.io/auth?shop=${shop}`);
  //   }
  //   console.log("error:", err); // Print the error if one occurred
  //   console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
  //   console.log("body:", body); // Print the HTML for the Google homepage.
  // });
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
