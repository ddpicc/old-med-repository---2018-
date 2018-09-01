const express = require("express");
//定义路由级中间件
const router = express.Router();
//引入数据模型模块
const Ord = require("../models/ordSchema");
const Med = require("../models/medSchema");

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

 //查找所有订单
router.get("/order", (req, res) => {
  Ord.find({})
    .sort({ update_at: -1 })
    .then(heros => {
      res.json(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
);

 //查找最近三个月的订单
router.get("/getOrdinThreeMonth", (req, res) => {
  let nowdate = new Date();
  let startMon = nowdate.getFullYear() + '/' + (nowdate.getMonth()-1);
  let endMon = nowdate.getFullYear() + '/' + (nowdate.getMonth()+2);
  Ord.find({"date":{$gte: startMon,$lte: endMon},
            "editable": false})
    .sort({ update_at: -1 })
    .then(heros => {
      res.json(heros);
      console.log(heros);
    })
    .catch(err => {
      console.log(2);
      res.json(err);
    });
  }
);

  //删除一条订单数据
router.delete("/order/:id", (req, res) => {
  Ord.findOneAndRemove({
    _id: req.params.id
  })
    .then(hero => res.send(`${hero.title}删除成功`))
    .catch(err => res.json(err));
  }
);

//更新订单状态
router.put("/updateOrdstatus/:id", (req, res) => {
  Ord.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        editable: false,
      }
    },
    {
      new: true
    }
  )
    .then(hero => res.json(hero))
    .catch(err => res.json(err));
});

//更新药品的库存
router.put("/order", (req, res) => {
  let errstr;
  let dose = req.body.dose;
  let arr = [];
  arr = req.body.medary;
  arr.forEach(element => {
    //console.log(element.medname);
    Med.findOneAndUpdate({
      medname: element.medname},
      {$inc: {count: -1*element.count*dose}})
      .then(hero => console.log('update count -' + element.medname))
      .catch(err => {
        errstr = err;
        console.log(err);
      });
    })
  if(errstr){
    res.json(errstr);
  }
  else{
    res.send('更新成功');
  }
  
  
  /*Med.findOneAndUpdate(
    { _id: req.params.id },
    {
      $set: {
        medname: req.body.medname,
        alias: req.body.alias,
        spec: req.body.spec,
        count: req.body.count,
        baseprice: req.body.baseprice,
        sellprice: req.body.sellprice,
        profit: req.body.profit
      }
    },
    {
      new: true
    }
  )
    .then(hero => res.json(hero))
    .catch(err => res.json(err));*/
});

module.exports = router;