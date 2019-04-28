/**
 * students.js
 * 只关心文件操作，不关心业务
 */

const fs = require('fs');

const dbPath = './db.json';

exports.find = callback => {
    fs.readFile(dbPath, (err, data) => {                                     //异步操作结果需要靠回调函数获取,回调函数操作异步操作的结果
        if(err){
            return callback(err);
        }
        callback(null, JSON.parse(data).students);                          //null代表的是err,代表没err
    });
}

exports.findById = (id, callback) => {
    fs.readFile(dbPath, (err, data) => {                                     
        if(err){
            return callback(err);
        }
        let students = JSON.parse(data).students;
        let ret = students.find(item => {
            return item.id === id;
        });   
        callback(null,ret);
    });
}

exports.save = (student, callback) => {
    fs.readFile(dbPath, (err, data) => {                                     
        if(err){
            callback(err);
        }
        let students =  JSON.parse(data).students;
        student.id = students[students.length - 1].id + 1;
        students.push(student);
        let fileData = JSON.stringify({
            students: students
        });
        fs.writeFile(dbPath, fileData, err => {
            if(err){
                callback(err);
            }
            callback(null);
        });
    });
}

exports.deleteById = (id, callback) => {
    fs.readFile(dbPath, (err, data) => {
        if(err){
            return callback(err);
        }
        let students = JSON.parse(data).students;
        let stu = students.findIndex(item => {
            return item.id === parseInt(id);
        });
        students.splice(stu, 1);
        let fileData = JSON.stringify({
            students: students
        });
        fs.writeFile(dbPath, fileData, err => {
            if(err){
                return callback(err);
            }
            callback(null);
        });
    });
}

exports.updateById = (student, callback) => {
    fs.readFile(dbPath, (err, data) => {                                     
        if(err){
            callback(err);
        }
        let students =  JSON.parse(data).students;
        
        let stu = students.find(item => {
            return item.id === parseInt(student.id);
        });
        for(let key in student) {
            stu[key] = student[key];
        }
        stu.id = parseInt(stu.id);     //id改成数字类型才行
        let fileData = JSON.stringify({
            students: students
        });
        fs.writeFile(dbPath, fileData, err => {
            if(err){
                callback(err);
            }
            callback(null);
        });
    });
}