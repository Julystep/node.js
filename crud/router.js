/**
 * 根据不同的路径请求路由
 * 
 */
const fs = require('fs');

const Students = require('./students');

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {                                          //express自己的封装方法
    Students.find((err, data) => {
        if(err){
            return res.status(500).send('Server err');
        }
        res.render('index.html',{
            fruits:[
                'pingguo',
                'xiangjiao',
                'juzi'
            ],
            students: data                           
        }); 

    });
});

router.get('/students/new', (req, res) => {
    res.render('new.html');
});

router.post('/students/new', (req, res) => {                             //文件存储方式是字符串
    let student = req.body;
    Students.save(student, err => {
        if(err){
            return res.status(500).send('Server err');
        }
        res.redirect('/');
    })
});

router.get('/students/delete', (req, res) => {
    Students.deleteById(req.query.id, err => {
        if(err){
            return res.status(500).send('Server err');
        }
        res.redirect('/');
    })
});

router.get('/students/edit', (req, res) => {
   Students.findById(parseInt(req.query.id), (err, data) => {
       if(err){
            return res.status(500).send('Server err');
       }
       res.render('edit.html', {
           student : data
       })
   });
});

router.post('/students/edit', (req, res) => {
    Students.updateById(req.body, err => {
        if(err){
            return res.status(500).send('Server err');
        }
        res.redirect('/');
    });

});


module.exports = router;
