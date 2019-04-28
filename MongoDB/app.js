/**
 * 配置服务器基本文件
 */
const express = require('express');

const bodyParser = require('body-parser');

const router = require('./router');

const app = express();

app.engine('html',require('express-art-template'));

app.use('/node_modules/', express.static('./node_modules/'));

app.use('/public/', express.static('./public/'));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use(router);

app.listen(3000, () => console.log('running...'));