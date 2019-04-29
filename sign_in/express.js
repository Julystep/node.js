const express  = require('express');

const app = express();

app.engine('html',require('express-art-template'));

app.use('/public/', express.static('./public/'));

app.use('/node_modules/', express.static('./node_modules/'));

app.get('/', (req, res) => {
    res.render('login.html')
})

app.listen(4000, () => console.log('running...'));