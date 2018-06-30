const express = require('express');
const med = require('./router/medrouter')
const mongoose = require("mongoose");

const bodyParser = require("body-parser")




//这一句是连接上数据库
 var db = mongoose.connect('mongodb://localhost:27017/myDbs');

//这里的myDbs是数据库的名字，不是表的名字



const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api',med)
app.all("*",(req,res,next) => {
    res.header("Access-Control-Allow-Credentials", "ture");
    res.header("Access-Control-Allow-Origin", req.header.origin);
    res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,Option");
    res.header("Access-Control-Allow-Headers", "Content-Type,username");
    next();
});

app.listen(3000,() => {
    console.log('app listening on port 3000.')
})


