const express = require('express');

const path = require('path');

const session = require('express-session');

const app = express();

const router = require('./router');

const bodyPaser = require('body-parser');

app.use('/public/', express.static(path.join(__dirname, './public/')));

app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));

app.engine('html', require('express-art-template'));

app.use(bodyPaser.urlencoded({extended : false}));
app.use(bodyPaser.json());

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized: true
}));

app.use(router);

app.listen(3000, () => console.log('Server is running...'));