// ==UserScript==
// @name         脑残的验证码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Whidy
// @match        apaas5.testysdpaas.local/apaas/manage/ui/
// @match        cloud.ysdpaas.local/awecloud/login/
// @match        *://localhost:5173/apaas/manage/ui/
// @match        https://apaas5.ysdpaas.local/apaas/manage/ui/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=testysdpaas.local
// @grant        none
// ==/UserScript==

(function () {
  "use strict";
  console.log("start");
  let count = 0;
  window.timer = setInterval(() => {
    console.log(count++);
    let img =
      document.querySelector(".yzm_img img") ||
      document.querySelector(".yzm img");
    if (img) {
      img.addEventListener("load", function () {
        // async function getCaptchaNumber() {
        //   const response = await fetch("http://localhost:3000");
        //   const data = await response.json();
        //   console.log(data);
        // }
        // getCaptchaNumber();

        // var script = document.createElement("script");
        // script.src = `http://localhost:3000/`;
        // document.body.appendChild(script);

        // script.onload = function () {
        //   // 在这里可以认为脚本加载并执行完成
        //   console.log("Script loaded and executed");

        //   // 检查全局变量是否设置
        //   if (window.number) {
        //     console.log("Number:", window.number);
        //   }
        // };

        var iframe = document.createElement("iframe");
        iframe.src = "http://localhost:3000";
        document.body.appendChild(iframe);

        iframe.onload = function () {
          // 在这里可以认为iframe的内容已加载完成
          iframe.contentWindow.postMessage(img.src, "*");
        };

        window.addEventListener("message", function (event) {
          // 获取消息的内容
          var { numberString } = event.data;

          // 在控制台中打印消息内容
          console.log("Received message from B:", numberString);
          if (numberString.length < 4) {
            console.log("错误数据，重新获取");
            img.click();
            return;
          }
          const input =
            document.querySelector(".msg-code .el-input__inner") ||
            document.querySelector(".yzm .el-input__inner");
          input.value = numberString;
          input.dispatchEvent(new Event("input"));
        });
      });
      clearInterval(window.timer);
      window.timer = null;
    }
  }, 100);

  setTimeout(() => {
    clearInterval(window.timer);
    window.timer = null;
  }, 5000);
})();
