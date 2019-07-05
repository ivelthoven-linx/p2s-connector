const db = require("./dbFunctions");
const crypto = require("crypto-js");

exports.authentication = async (ctx, next) => {
  const authorization = ctx.get("Authorization");
  if (authorization) {
    const authorizationPieces = authorization.replace(",", "").split(" ");
    const credential = authorizationPieces
      .find(opt => {
        return opt.startsWith("Credential");
      })
      .replace("Credential=", "")
      .split("/");
    const receivedSignature = authorizationPieces
      .find(opt => {
        return opt.startsWith("Signature=");
      })
      .replace("Signature=", "");

    const accessKey = credential[0];

    if (accessKey && receivedSignature) {
      await db
        .checkConnectionPhomas(accessKey)
        .then(async res => {
          const signedHeaders = authorizationPieces
            .find(opt => {
              return opt.startsWith("SignedHeaders=");
            })
            .replace("SignedHeaders=", "")
            .replace(",", "");

          const amzDate = ctx.get("X-Amz-Date");
          const host = ctx.get("Host"); // Wrong Host?

          const authDate = credential[1];
          const regionName = credential[2];
          const serviceName = credential[3];
          const requestType = credential[4];
          if (
            amzDate &&
            host &&
            authDate &&
            regionName &&
            serviceName &&
            requestType
          ) {
            const request = getCannonicalRequest(
              ctx.method,
              "/shop",
              "",
              `host:qbd25.sse.codesandbox.io\nx-amz-date:${amzDate}`,
              "\n" + signedHeaders,
              ""
            );
            // console.log("\n" + request);
            const stringToSign = getStringToSign(
              amzDate,
              authDate,
              regionName,
              serviceName,
              requestType,
              request
            );
            // console.log("\n" + stringToSign);
            const signingKey = getSigningKey(
              res.secretKey,
              authDate,
              regionName,
              serviceName
            );
            // console.log("\n" + signingKey);
            const createdSignature = crypto.HmacSHA256(
              stringToSign,
              signingKey
            );

            // console.log("\n" + createdSignature);
            // console.log(receivedSignature == createdSignature);
            if (createdSignature == receivedSignature) {
              ctx.shopify = { url: res.shopifyUrl, token: res.shopifyToken };
              ctx.credentials = {
                accessKey: res.accessKey,
                secretKey: res.secretKey
              };
              await next();
            } else {
              ctx.body = "not authorized";
            }
          }
        })
        .catch(err => {
          console.error(err);
          ctx.body = "not authorized";
        });
    } else {
      ctx.body = "not authorized";
    }
  } else {
    ctx.body = "not authorized";
  }
};

const getCannonicalRequest = (
  method,
  uri,
  canonicalQueryString,
  canonicalHeaders,
  signedHeaders,
  RequestPayload
) => {
  return crypto.SHA256(
    `${method}\n${uri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${crypto.SHA256(
      RequestPayload
    )}`
  );
};
const getStringToSign = (
  amzDate,
  authDate,
  regionName,
  serviceName,
  requestType,
  cannonicalRequest
) => {
  return `AWS4-HMAC-SHA256\n${amzDate}\n${authDate}/${regionName}/${serviceName}/${requestType}\n${cannonicalRequest}`;
};
const getSigningKey = (key, dateStamp, regionName, serviceName) => {
  var kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
  var kRegion = crypto.HmacSHA256(regionName, kDate);
  var kService = crypto.HmacSHA256(serviceName, kRegion);
  var kSigning = crypto.HmacSHA256("aws4_request", kService);
  return kSigning;
};
