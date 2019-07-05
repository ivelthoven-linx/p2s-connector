const crypto = require("crypto-js");

const doc = () => {
  console.log("---------------- DOC ----------------");
  const request = getCannonicalRequest(
    "GET",
    "/",
    "Action=ListUsers&Version=2010-05-08",
    "content-type:application/x-www-form-urlencoded; charset=utf-8\nhost:iam.amazonaws.com\nx-amz-date:20150830T123600Z",
    "\ncontent-type;host;x-amz-date",
    ""
  );
  console.log("\n" + request);
  const stringToSign = getStringToSign(
    "20150830T123600Z",
    "20150830",
    "us-east-1",
    "iam",
    "aws4_request",
    request
  );
  console.log("\n" + stringToSign);
  const signingKey = getSigningKey(
    "wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY",
    "20150830",
    "us-east-1",
    "iam"
  );
  console.log("\n" + signingKey);
  const signature = crypto.HmacSHA256(stringToSign, signingKey);
  console.log("\n" + signature);
};

const postman = () => {
  console.log("---------------- POSTMAN ----------------");
  const request = getCannonicalRequest(
    "GET",
    "/shop",
    "",
    "host:qbd25.sse.codesandbox.io\nx-amz-date:20190704T093907Z",
    "\nhost;x-amz-date",
    ""
  );
  console.log("\n" + request);
  const stringToSign = getStringToSign(
    "20190704T093907Z",
    "20190704",
    "us-east-1",
    "execute-api",
    "aws4_request",
    request
  );
  console.log("\n" + stringToSign);
  const signingKey = getSigningKey(
    "secret",
    "20190704",
    "us-east-1",
    "execute-api"
  );
  console.log("\n" + signingKey);
  const signature = crypto.HmacSHA256(stringToSign, signingKey);
  console.log("\n" + signature);
  console.log(
    "775cd5a97c94ded775614cf03f186f98a2bd0cbc7bfbee2d7d8c242f81156eb1"
  );
};

const getCannonicalRequest = (
  method,
  uri,
  canonicalQueryString,
  canonicalHeaders,
  signedHeaders,
  RequestPayload
) => {
  console.log(
    `${method}\n${uri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${crypto.SHA256(
      RequestPayload
    )}`
  );
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
doc();
postman();
