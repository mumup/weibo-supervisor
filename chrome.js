let timer = null
let index = 0
let successNums = 0
let failNums = 0
let block_url = 'http://weibo.com/aj/filter/block?ajwvr=6'
let listUrl = 'https://lahei.xyz/api/v1/public/get-supervisor-list'
let userList
let last = localStorage.getItem('last_block') || 0

function fetch(url, model) {
    return new Promise((resolve, reject) => {
        if (userList && index >= userList.length) {
            console.log(`任务完成\n成功：${successNums}\n 失败：${failNums}`);
            localStorage.setItem('last_block', parseInt(Date.now() / 1000))
            return clearInterval(timer)
        }
        let http = new XMLHttpRequest()
        if (model === 'GET') {
            http.open('GET', url, true)
            http.send()
        }
        if (model === 'POST') {
            http.open('POST', url, true)
            http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            http.send('uid=' + userList[index].uid + '&filter_type=1&status=1&interact=1&follow=1')
        }
        http.onreadystatechange = function () {
            if (http.readyState === 4 && http.status === 200) {
                let res
                try {
                    res = JSON.parse(http.responseText)
                } catch (e) {
                    console.log('网络错误');
                }
                if (model === 'GET' && res) {
                    resolve(res.data)
                }
                if (model === 'POST' && res.code === '100000') {
                    console.log(`拉黑成功,第${index + 1}个`)
                    successNums++
                    index++
                    resolve()
                } else {
                    if (model === 'POST') {
                        console.log(`拉黑失败,第${index + 1}个`)
                        failNums++
                        index++
                        reject()
                    }
                }
            }
        };
    })
}

;
(async() => {
    userList = await fetch(`${listUrl}?last=${last}`, 'GET')
    if (userList.length === 0) {
        return alert('列表没有更新')
    }
    timer = setInterval(function () {
        fetch(block_url, 'POST')
    }, 2000)
})()