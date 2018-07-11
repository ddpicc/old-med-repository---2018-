const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const Ord = require("../models/ordSchema");

const execCallback = function(p,err,data,res){
    if(err){
      res.send(err);
   }else{
     //再次查询，获取总数
     p.find().count((err,result) => {
       if (err) {
         res.send({'status':0,'data':'','message':err,'count':''});  
       } else {
         res.send({'status':1,'data':data,'message':'success','count':result});  
       }
       });
   }
  };
  
  router.post("/order", (req, res) => {
    console.log(req.body);
    Ord.create(req.body, (err, hero) => {
        if (err) {
          res.json(err);
        } else {
          res.json(hero);
        }
      });
  }
  );

  router.get('/order', function(req, res) {
    res.send('this is a sample!');
  });

  module.exports = router;