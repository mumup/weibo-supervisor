# weibo-supervisor
微博监督员一键拉黑 - 云名单版

# 维护监督员列表
一次肯定拉不完的，所以我们需要云拉黑，不断更新列表
云拉黑提交网址：https://lahei.xyz
方法：
 * PC => 直接点ta头像进首页, 然后复制链接即可
 * 客户端 => 点ta头像, 然后点主页右上角, 复制链接
 * 前期需要链接才能拉黑, 根据nikename拉黑的功能还在做

# JS脚本方式
 * 特征：简单方便, 支持增量拉黑
 * 注意：微博需要登录, 不能在无痕/小号模式中使用, 会使增量拉黑失效
 * 使用：复制上面chrome.js里的代码, 粘贴到浏览器的Console中,然后猛敲回车即可。

# Nodejs版
 * 特征：增量拉黑
 * 注意：Nodejs版本需>=8.0

# api接口文档
域名: https://lahei.xyz/

#### 获取监督员列表
 - 请求方式：GET
 - 请求地址：https://lahei.xyz/api/v1/public/get-supervisor-list

|参数 | 类型 | 必须 |描述
| ------------- |:-------------:| :-----:|  :-----: |
| last          | string        | 否    |时间戳(10位),上次请求的时间|
 - 返回示例
  ```json
 {
        "status": 0,
        "error": false,
        "data": [{
            "uid": 123,
            "sex": "m",
            "nikename": "用户"
        }]
 }
 ```

#### 检查用户
 - 请求方式：GET
 - 请求地址：https://lahei.xyz/api/v1/public/check-supervisor
 - 描述：检查用户是否为微博监督员,并记录
 - 返回示例
 ```json
 {
        "status": 0,
        "error": false,
        "msg": "记录成功"
 }
 ```

 #### 获取已记录监督员数量
 - 请求方式：GET
 - 请求地址：https://lahei.xyz/api/v1/public/get-supervisor-nums
 - 描述：获取当前记录的监督员数量
 - 返回示例
  ```json
 {
    "status": 0,
    "error": false,
    "data": 407
}
 ```