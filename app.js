"use strict";
/**
 * 2017年10月11日18:31:28
 * by pmumu
 * 微博登录模块来自xiaomingplus(https://github.com/xiaomingplus/weibo-simulation-api)
 * 
 */
const weiboLogin = require('./lib/weibo_login.js').weiboLogin;
const config = require('./config')
const request = require('request');
const fs = require('fs');

let position = 0
let successNum = 0
let failNum = 0
let cookies

// let userPage = `http://weibo.com/p/1006066264005608/follow?from=page_100505&wvr=6&mod=headfollow#place`
let addFeedUrl = `https://weibo.com/aj/filter/block?__rnd=${getUnxTime()}`
// let delFeedUrl = `http://account.weibo.com/set/aj5/filter/delfeeduser?__rnd=${getUnxTime()}`

;
(async() => {
    if (!config.username && !config.password) {
        return console.log('用户或密码不能为空, 请编辑目录下的config.js ,填上相应参数');
    }
    try {
        fs.statSync('cookies.txt')
        console.log(`cookies文件存在，直接进行操作`);
    } catch(err) {
        console.log(`正在进行登录操作...`);
        await new weiboLogin(config.username, config.password).init();
    }
    cookies = fs.readFileSync('./cookies.txt');
    let svList = JSON.parse(await getSupervisorList()).data
    console.log(`获取列表成功，共${svList.length}个`);
    console.log(`正在进行拉黑操作...`);
    addBlackListFn(svList)
    fs.writeFileSync('time.txt', parseInt(getUnxTime() / 1000));
})()

//  获取监督员列表
function getSupervisorList() {
    let lastTime
    try {
        fs.statSync('time.txt')
        lastTime = fs.readFileSync('./time.txt').toString()
    } catch (error) {
        
    }
    return new Promise((resolve, reject) => {
        request(`https://lahei.xyz/api/v1/public/get-supervisor-list?last=${lastTime || ''}`, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(response.body);
            } else {
                reject(error);
            }
        })
    })
}

//  添加进黑名单
async function addBlackListFn(list) {
    if (position < list.length) {
        let s = JSON.parse(await addPost(list[position].nickname)).code
        s == 100000 ? successNum++ : failNum++
            await wait(1)
        position++
        addBlackListFn(list)
    } else {
        console.log(`全部完成\n成功：${successNum}个\n失败：${failNum}个`);
    }
}

async function addPost(nickname) {
    console.log(`第${position + 1}个...`);
    let headers = {
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:48.0) Gecko/20100101 Firefox/48.0",
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Connection': 'Keep-Alive',
        'cookie': cookies.toString(),
        'Referer': 'http://account.weibo.com/set/shield',
        'Origin': 'http://account.weibo.com'
    };
    let options = {
        method: 'POST',
        url: addFeedUrl,
        headers: headers,
        gzip: true,
        form: {
            status: 1,
            interact: 1,
            follow: 1,
            nickname: nickname,
            screen_name: nickname,
            _t: 0
        }
    }
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                response.setEncoding('utf-8');
                resolve(response.body);
            } else {
                reject(error);
            }
        })
    })
}

function wait(t) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), t * 1000)
    })
}

function getUnxTime() {
    return Date.now()
}