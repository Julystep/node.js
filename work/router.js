const express = require('express');

const User = require('./modules/user')

const md5 = require('blueimp-md5')

const router = express.Router();

router.get('/', (req, res) => {
    res.render('index.html');
});

router.get('/login', (req, res) => {
    res.render('login.html');
});

router.post('/login', (req, res) => {

});

router.get('/register', (req, res) => {
    res.render('register.html');
});

router.post('/register',async (req, res) => {
    body  =req.body;
try{
    if(await User.findOne({email : body.email })){
        return res.status(200).json({
            err_code : 1,
            message : 'email is exist'
        });
    }
    if(await User.findOne({nickname : body.nickname})){
        return res.status(200).json({
            err_code : 2,
            message : 'nickname is exist'
        });
    }

    body.password = md5(md5(body.password));

    await new User(body).save();

    res.status(200).json({
        err_code : 0,
        message : 'success'
    });

    req.session.user = user;
}catch(err){
    res.status(500).json({
        err_code: 500,
    message: err.message
});
}
});

module.exports = router;