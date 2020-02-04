const http = require('http')


/*
返回字符串
*/

// http.createServer(function (req, res) {
//     if (req.url == '/favicon.ico') {
//         res.writeHead(200);
//         res.end();
//         return;
//     }

//     console.log(req.url);
//     res.writeHead(200);
//     res.end('hello node.js')
// }).listen(3000)

const fs = require('fs');

/*
返回网页
*/
 
http.createServer(function (req, res) {
    if (req.url == '/favicon.ico') {
        res.writeHead(200);
        res.end();
        return;
    }

    res.writeHead(200);
    fs.createReadStream(__dirname + '/index.html').pipe(res)
}).listen(3000)


