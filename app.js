// 服务器
let http = require("http");
// 生成路径
let path = require("path");
// 引入插件mime
let mime = require("mime");
// 引入url
let url = require("url")
// 引入文件库
let fs = require("fs");
// 引入字符串模块
let querystring = require("querystring");
// 配置网站根目录
let rootPath = path.join(__dirname, "www");
// console.log(rootPath);

// 开启服务
http.createServer((request, response) => {
    // 实现get功能
    // 解析url
    let parseUrl = url.parse(request.url);
    console.log(parseUrl);
    // 获取get的数据
    let result = querystring.parse(parseUrl.query);
    console.log(result);
    // console.log("你来了");
    // 生成绝对路径 转换中文编码
    let filePath = path.join(rootPath, querystring.unescape(request.url));
    // console.log(filePath);
    // 判断访问的这个目录是否存在
    let isExit = fs.existsSync(filePath);
    if (isExit) {
        //如果存在
        // 只有存在才需要继续走
        // 生成文件列表
        fs.readdir(filePath, (err, files) => {
            // 如果是文件
            if (err) {
                // console.log(err);
                // 读取文件
                fs.readFile(filePath, (err, data) => {
                    // 直接返回
                    // 设置头用插件设置头
                    // console.log(mime.getType(filePath));
                    response.writeHead(200, {
                        'content-type': mime.getType(filePath)
                    })
                    response.end(data)
                })
            } //如果是文件夹 
            else {
                console.log(files);
                // 判断是否有首页
                if (files.indexOf("index.html") != -1) { //说明有首页
                    console.log("有首页");
                    fs.readFile(path.join(filePath, 'index.html'), (err, data) => {
                        if (err) {
                            // console.log(err);
                        } else {

                            response.end(data);
                        }
                    })
                } else { //说明没有首页
                    // 拼接
                    let backdata = '';

                    for (var i = 0; i < files.length; i++) {
                        // 生成标签并换行 拼接链接
                        backdata += `<h2><a href="${request.url=='/'?'':request.url}/${files[i]}">${files[i]}</a></h2>`
                    }
                    response.writeHead(200, {
                        'content-type': 'text/html;charset=utf-8'
                    })

                    response.end(backdata)
                }
            }
        })
    } else {
        // 如果不存在
        response.writeHead(404, {
            'content-type': 'text/html;charset=utf-8'
        })
        response.end(` <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
        <html><head>
        <title>404 Not Found</title>
        </head><body>
        <h1>Not Found</h1>
        <p>The requested URL /index.hththt was not found on this server.</p>
        </body></html>`)
    }
    // console.log(filePath, isExit);
    // response.end('you come');
}).listen(80, "127.0.0.1", function () {
    console.log('开始监听 127.0.0.1:80');
})