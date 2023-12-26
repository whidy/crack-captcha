# 垃圾的验证码

仅用于自己研究。

请自己更换对应的[百度智能云ORC](https://console.bce.baidu.com/ai/?fromai=1#/ai/ocr/overview/index)的通用文字识别（标准版）的APP_ID，API_KEY，SECRET_KEY

## 安装必备工具

```
npm i -g pm2
```

运行服务

```
pm2 start
```

## 示例

访问：https://apaas5.wodcloud.com/apaas/manage/ui/#/login

过一会验证码会自动填入，如果失败，会自动重试，如果不准确，比如经常无法正确识别2，7这两个数字，可以点击验证码重新请求。

配合该项目的Chrome插件：[tampermonkey] + 本地的script脚本，这个自己研究去。可以自己再重新定制。

准确性`60%-70%`。