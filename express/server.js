const express = require('express');
const fs = require('fs');
const template = require('art-template');
const bodyParser = require('body-parser');

const app = express();

let comments = [];

app.use('/public/', express.static('./public/'));                   //请求内部的资源，随便用

app.engine('html', require('express-art-template'));               //配置模板引擎,不进行配置则文件无法解析

/* 解析post中的数据专用 */
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index.html', {
        comments : comments
    });
});

app.get('/post', (req, res) => {
    res.render('post.html');
});

app.post('/post', (req, res) => {
    
    let comment = req.body;                                       //只能拿get请求参数
    console.log(comment);
    comment.time = new Date();
    comments.unshift(comment);
    res.redirect('/');

});



app.listen(3000, () => {
    console.log('running...');
})