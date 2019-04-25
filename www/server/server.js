const http = require('http');
const fs = require('fs');
const url = require('url');
const template = require('art-template');

let comments = [
]

const server = http.createServer();

server.on('request', (req, res) => {
    let parseObj = url.parse(req.url, true);
    let pathName = parseObj.pathname;
    const wwwDir = 'D:/www';
   
    if(pathName === '/'){
        
        fs.readFile(wwwDir + '/lib/index.html', (err, data) => {
            if(err){
                res.end('404 not found...');
            }
            let data1 = template.render(data.toString(), {
                comments : comments
            })
            
            res.end(data1);

        });
    }else if(pathName === '/post'){
        
        fs.readFile(wwwDir + '/lib/post.html', (err, data) => {
            if(err){
                res.end('404 not found...');
            }

            res.end(data);

        });
    }else if(pathName.indexOf('/public/') === 0){
        
        surl = '..' + pathName;
        var type = surl.substr(surl.lastIndexOf(".")+1,surl.length)           //因为头部的关系导致出现问题
        res.writeHead(200,{'Content-type':"text/"+type});
        fs.readFile('..' + pathName, (err, data) => {
            if(err){
                res.end('404 not found...');
            }

            res.end(data);

        });
    }else if(pathName === '/Comment'){
       
        let comment = parseObj.query;
        comment.time = new Date();
        comments.push(comment);
        
        res.statusCode = 302;                                             //暂时性的重定向
        res.setHeader('location', '/');
        
        res.end();


    }

});

server.listen(3000, () => console.log('Server is on...'));