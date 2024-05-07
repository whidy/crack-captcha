// ==UserScript==
// @name         脑残的验证码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Whidy
// @match        cloud.ysdpaas.local/awecloud/login/
// @match        cloud.wodcloud.com/awecloud/login/
// @match        so.wodcloud.com/xc/core/ui/
// @match        bgapi.wodcloud.com/web/
// @match        *://localhost:5173/apaas/manage/ui/
// @match        *://localhost:5173/unify-dev-platform/manage/ui/
// @match        https://apaas5.ysdpaas.local/apaas/manage/ui/
// @match        apaas5.testysdpaas.local/apaas/manage/ui/
// @match        apaas5.test2ysdpaas.local/apaas/manage/ui/
// @match        sxxxy-apaas.wodcloud.com/unify-dev-platform/manage/ui/
// @match        apaas5.wodcloud.com/apaas/manage/ui/
// @match        https://usma.wodcloud.com/usma/login/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=testysdpaas.local
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  const DEBUG = false;
  const BGAPI_PASSWORD = "bg123456";
  const TIMEOUT = 3000;
  const MAX_RETRY = 5;
  const domain = location.host;
  let retry = 0;
  DEBUG && console.log("start: ", domain);
  let count = 0;
  window.timer = setInterval(() => {
    DEBUG && console.log(count++);
    let img = null;
    switch (domain) {
      case "bgapi.wodcloud.com":
        img = document.querySelector(".v_code_img");
        break;
      case "cloud.wodcloud.com":
      case "cloud.ysdpaas.local":
        img = document.querySelector(".yzm .yzm_img");
        break;
      case "so.wodcloud.com":
        img = document.querySelector(".login-form img");
        break;
      case "usma.wodcloud.com":
        img = document.querySelector(".bg-identify canvas");
        break;
      default:
        // apaas
        img = document.querySelector(".yzm_img img");
        break;
    }
    DEBUG && console.log(img);
    if (img) {
      img.addEventListener("load", function () {
        var iframe = document.createElement("iframe");
        iframe.src = "http://localhost:3000";
        document.body.appendChild(iframe);
        iframe.style.display = "none";

        iframe.onload = function () {
          let imgBase64 = "";
          if (img.tagName === "CANVAS") {
            imgBase64 = img.toDataURL("image/png");
          } else if (img.tagName === "IMG") {
            if (img.src.startsWith("data:image")) {
              imgBase64 = img.src;
            } else if (img.src.startsWith("http")) {
              const canvas = document.createElement("canvas");

              // 设置 Canvas 的宽高与图像相同
              canvas.width = img.width;
              canvas.height = img.height;

              // 获取 Canvas 的 2D 上下文
              const context = canvas.getContext("2d");

              // 在 Canvas 上绘制图像
              context.drawImage(img, 0, 0);

              // 将 Canvas 内容转换为 Base64 数据
              imgBase64 = canvas.toDataURL("image/png");
            }
          }

          DEBUG && console.log(imgBase64);
          // 在这里可以认为iframe的内容已加载完成
          iframe.contentWindow.postMessage(imgBase64, "*");
        };

        const fillIn = (event) => {
          // 获取消息的内容
          var { numberString } = event.data;

          if (numberString === undefined) {
            return;
          }

          // 在控制台中打印消息内容
          console.log("Received message from B:", numberString);
          if (numberString.length < 4) {
            console.log("错误数据，重新获取");
            retry += 1;
            if (retry > MAX_RETRY) {
              console.log("超过最大重试次数，退出");
              window.location.reload();
              return;
            }
            img.click();
            return;
          }
          let vcodeInput = null;
          let passwordInput = null;
          switch (domain) {
            case "bgapi.wodcloud.com":
              // 输入文档查看密码
              passwordInput = document.querySelector("input[type=password]");
              passwordInput.value = BGAPI_PASSWORD;
              passwordInput.dispatchEvent(new Event("input"));
              img = document.querySelector(".v_code_img");
              vcodeInput =
                img.previousElementSibling.querySelector(".el-input__inner");
              break;
            case "cloud.wodcloud.com":
            case "so.wodcloud.com":
              vcodeInput = document.querySelector(
                "input[placeholder=请输入验证码]"
              );
              break;
            case "cloud.ysdpaas.local":
              vcodeInput = document.querySelector(".yzm .el-input__inner");
              break;
            // case "usma.wodcloud.com":
            //   vcodeInput = document.querySelector(".msg-code .el-input__inner");
            //   break;
            default:
              // apaas
              vcodeInput = document.querySelector(".msg-code .el-input__inner");
              break;
          }

          vcodeInput.value = numberString;
          vcodeInput.dispatchEvent(new Event("input"));
          window.removeEventListener("message", fillIn, false);
          // vcodeInput.dispatchEvent(
          //   new KeyboardEvent("keypress", {
          //     bubbles: true,
          //     cancelable: true,
          //     key: "Enter",
          //   })
          // );
        };

        window.addEventListener("message", fillIn, false);
      });
      clearInterval(window.timer);
      window.timer = null;
    }
  }, 100);

  setTimeout(() => {
    clearInterval(window.timer);
    window.timer = null;
  }, TIMEOUT);
})();
