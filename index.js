/**
 * https://cloud.baidu.com/doc/OCR/s/rkibizxtw
 * https://console.bce.baidu.com/ai/?_=1700631908301#/ai/ocr/overview/resource/list
 */

// const request = require("request");
// var AipOcrClient = require("baidu-aip-sdk").ocr;

// var APP_ID = "43445660";
// var API_KEY = "8Br2GGsBoohIcxhZjtcEHMbm";
// var SECRET_KEY = "2p6zkq9NP2XPBYz0xYlsfKHuaBsi9mua";

const Koa = require("koa");
const Router = require("koa-router");
const { bodyParser } = require("@koa/bodyparser");
const app = new Koa();
const router = new Router();
app.use(bodyParser());
const AipOcrClient = require("baidu-aip-sdk").ocr;
const APP_ID = "43445660";
const API_KEY = "8Br2GGsBoohIcxhZjtcEHMbm";
const SECRET_KEY = "2p6zkq9NP2XPBYz0xYlsfKHuaBsi9mua";

router.get("/", async (ctx) => {
  ctx.body = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>omg</title>
  </head>

  <body>
    fuck captcha
    <script>
    async function postData(url = "", data = {}) {
      // Default options are marked with *
      const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      });
      return response.json(); // parses JSON response into native JavaScript objects
    }
    window.addEventListener("message", receiveMessage, false);
    function receiveMessage(event) {
      console.log("Message received:", event.data);
      postData("http://localhost:3000/crackCaptcha", {
        data: event.data,
        origin: event.origin
      }).then((res) => {
        console.log(res)
        event.source.postMessage(res, event.origin);
      })
    }
    </script>
  </body>

  </html>
  `;
});

router.post("/crackCaptcha", async (ctx) => {
  const client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
  const { data, origin } = ctx.request.body;
  const result = await client.generalBasic(data);
  console.log(result)
  let numberString = result.words_result.map((i) => i.words).join("");
  console.log(result.words_result, numberString, origin);
  if (!origin.includes("cloud.ysdpaas.local")) {
    console.log("transform!");
    numberString = numberString.toLowerCase();
    numberString = numberString
      .replace(/o/g, "0")
      .replace(/z/g, "2")
      .replace(/i/g, "1");
  }
  console.log(typeof numberString);
  ctx.body = {
    original: result,
    numberString,
  };
});
app.use(router.routes());
app.listen(3000);
