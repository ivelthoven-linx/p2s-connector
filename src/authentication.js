const db = require("./db");
const crypto = require("crypto-js");
const v4 = require("aws-signature-v4");
const aws4Signature = require("aws4-signature");

// function getAmzDate(dateStr) {
//   var chars = [":", "-"];
//   for (var i = 0; i < chars.length; i++) {
//     while (dateStr.indexOf(chars[i]) != -1) {
//       dateStr = dateStr.replace(chars[i], "");
//     }
//   }
//   dateStr = dateStr.split(".")[0] + "Z";
//   return dateStr;
// }

// var amzDate = getAmzDate(new Date().toISOString());
// var authDate = amzDate.split("T")[0];

// console.log(amzDate, authDate);

exports.authentication = async (ctx, next) => {
  const authorization = ctx.get("Authorization");
  const authorizationPieces = authorization.replace(",", "").split(" ");

  const method

  const credential = authorizationPieces
    .find(opt => {
      return opt.startsWith("Credential");
    })
    .replace("Credential=", "")
    .split("/");

  const signature = authorizationPieces
    .find(opt => {
      return opt.startsWith("Signature=");
    })
    .replace("Signature=", "");

  const amzDate = ctx.get("X-Amz-Date");

  const accessKey = credential[0];
  const authDate = credential[1];
  const regionName = credential[2];
  const serviceName = credential[3];
  const requestType = credential[4];
  // console.log(amzDate);

  // const date = new Date(
  //   amzDate.substring(0, 4),
  //   amzDate.substring(4, 6),
  //   amzDate.substring(6, 8),
  //   amzDate.substring(9, 11),
  //   amzDate.substring(11, 13),
  //   amzDate.substring(13, 15)
  // );
  // console.log(date);
  // console.log(date.toISOString());

  // console.log(authorization);
  // console.log(signature);
  // console.log(credential);

  // console.log(getSignatureKey(accessKey, dateStamp, regionName, serviceName));

  if (accessKey && signature) {
    await db
      .checkConnection(accessKey)
      .then(async res => {
        // console.log(res.secretKey);

        // const canonicalReqHash = crypto.SHA256(canonicalReq).toString();
        // const stringToSign =
        //   "AWS4-HMAC-SHA256\n" +
        //   amzDate +
        //   "\n" +
        //   authDate +
        //   "/" +
        //   regionName +
        //   "/" +
        //   serviceName +
        //   "/aws4_request\n" +
        //   canonicalReqHash;
        // const signingKey = getSignatureKey(
        //   accessKey,
        //   authDate,
        //   regionName,
        //   serviceName
        // );
        const request = v4.createCanonicalRequest(
          ctx.method,
          "/",
          null,
          {},
          "UNSIGNED-PAYLOAD"
        );
        const date = new Date(
          amzDate.substring(0, 4),
          amzDate.substring(4, 6) - 1,
          amzDate.substring(6, 8),
          amzDate.substring(9, 11),
          amzDate.substring(11, 13),
          amzDate.substring(13, 15)
        );
        const stringToSign = `

        `

        // const dbSignature = v4.createSignature(
        //   res.secretKey,
        //   date,
        //   regionName,
        //   serviceName,
        //   stringToSign
        // );

        // "AWS4-HMAC-SHA256
        // \n20110909T233600Z
        // \n20110909/us-east-1/iam/aws4_request\n
        // 3511de7e95d28ecd39e9513b642aee07e54f4941150d8df8bf94b328ef7e55e2"
        console.log(stringToSign);
        const dbSignature = aws4Signature(
          res.secretKey,
          date,
          regionName,
          serviceName,
          stringToSign
        );
        // const dbSignature = crypto.HmacSHA256(res.secretKey, stringToSign);

        // dbSignature.update(signingKey, "utf8");

        console.log(dbSignature);
        console.log(signature);
        // console.log(crypto.SHA256.decrypt(dbSignature, signature));
        // ctx.shopify = res;
        // await next();
      })
      .catch(err => {
        console.log(err);
        ctx.body = "invalid token";
      });
  } else {
    ctx.body = "invalid signature";
  }
};

const getSignatureKey = (key, dateStamp, regionName, serviceName) => {
  var kDate = crypto.HmacSHA256(dateStamp, "AWS4" + key);
  var kRegion = crypto.HmacSHA256(regionName, kDate);
  var kService = crypto.HmacSHA256(serviceName, kRegion);
  var kSigning = crypto.HmacSHA256("aws4_request", kService);
  return kSigning;
};
