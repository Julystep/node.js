const fs = require('fs')

function pReadFile(filePath) {                                             //封装读取文件
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        })
    })
}

let p1 = pReadFile('./test.txt');

p1
 .then( data => {
     console.log(data);
 }, err => {
     console.log(err);
 })