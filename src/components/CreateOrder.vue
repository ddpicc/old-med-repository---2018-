<template>
<div class="create-order"> 
<el-row class="patientName">
  <el-input  placeholder="请输入病人名字" v-model="patient"></el-input>
</el-row>
<table id="rounded-corner" summary="2007 Major IT Companies' Profit">
    <thead>
    	<tr>
        	<th scope="col" class="MedName1"> 药品名称</th>
          <th scope="col" class="MedNm1"> 数量</th>
          <th scope="col"> 操作</th>
          <th scope="col" class="MedName2"> 药品名称</th>
          <th scope="col" class="MedNm2"> 数量</th>
          <th scope="col"> 操作</th>
          <th scope="col" class="MedName3"> 药品名称</th>
          <th scope="col" class="MedNm3"> 数量</th>
          <th scope="col"> 操作</th>
      </tr>
    </thead>
      <tfoot>
        <tr>
        	<td colspan="7"> </td>
          <td class="rounded-foot-left">每付价钱</td>
        	<td class="rounded-foot-right">{{ordSellTotal}} 元 </td>
        </tr>
    	  <tr>
          <td colspan="6"></td>
        	<td class="inputCount"> <input v-model="orderCount" @focus="focus($event)"> </td>
        	<td class="rounded-foot-right">合计 </td>
          <td> <input v-model="total" @focus="focus($event)"></td>
        </tr>
      </tfoot>
    <tbody>
    	<tr v-for="(item, index) in items" :key="item.id">
        	<td> {{item.MedName1}} </td>
          <td> {{item.MedNm1}} </td>
          <td> <i class="el-icon-delete" @click="deleteFirst(index)"></i> </td>
          <td> {{item.MedName2}} </td>
          <td> {{item.MedNm2}} </td>
          <td> <i class="el-icon-delete" @click="deleteSecond(index)"></i> </td>
          <td> {{item.MedName3}} </td>
          <td> {{item.MedNm3}} </td>
          <td> <i class="el-icon-delete" @click="deleteThird(index)"></i> </td>
      </tr>
    </tbody>
</table>
<div class="confirmBtn">
  <el-button type="success" size="small" @click="postOrdToDbSure" round>确认</el-button>
</div>
<el-row>
  <div class="typein">
  <el-autocomplete
      class="my-autocomplete"
      v-model="state2"
      autofocus
      :fetch-suggestions="querySearch"
      placeholder="请输入内容"
      :trigger-on-focus="false"
      @keyup.enter.native="moveFocusToDose"
      @focus="focus($event)"
      ref="mark1">
      <template slot-scope="{ item }">
        <div class="name">{{ item.alias }}    {{ item.value }}</div>
      </template>
    </el-autocomplete>
    <el-input  
      placeholder="数量" 
      @keyup.enter.native="postToTb" 
      v-model="inputDose" 
      ref="mark"
      @focus="focus($event)">
    </el-input>
    <el-button type="success" icon="el-icon-plus" circle @click="postToTb"></el-button>
  </div>
</el-row>
<el-row class="medInfo">
  <el-tag type="success" style="width:15%">库存</el-tag>
  <el-tag type="success" style="width:15%">{{remainInv}}袋</el-tag>
  <el-tag type="success" style="width:15%">单价</el-tag>
  <el-tag type="success" style="width:15%">{{singlePrice}}元</el-tag>
    <el-tag type="success" style="width:15%">含量</el-tag>
  <el-tag type="success" style="width:15%">{{singleG}}克</el-tag>
</el-row>
</div>
</template>

<script>
  export default {
    data: function() {
      return {
          items: [],
          medsToShow: [],
          orderMed: [],
          inputDose: 1,
          state2: '',
          newLine: true,
          curCountPerLine: 1,
          ordBaseTotal: 0,
          ordSellTotal: 0,
          orderCount: '',
          total: '',
          patient: '',
          remainInv: '',
          singlePrice: '',
          singleG: ''

      }
    },
    methods: {
      moveFocusToDose: function(){
        let searchStr = this.state2;
        if(searchStr === ""){
          alert("不能为空");
          return;
        }
        
        //check if it is exist
        let existInDb = this.medsToShow.find(function(p){
            return p.value === searchStr;
        });

        if(typeof(existInDb)=="undefined"){
            alert("药品库中没有这种药，请重输");
            return;
        }

        //check if already exist in table
        let existInTable = this.orderMed.find(function(p){
            return p.medname === searchStr;
        });
        if(typeof(existInTable)!="undefined"){
            alert("不能重复添加药品");
            return;
        }

        this.remainInv = existInDb.inventory;
        this.singlePrice = existInDb.sellprice;
        this.singleG = existInDb.spec;
        //move focus to input dose
        this.$refs.mark.$el.querySelector('input').focus();
      },

      deleteAndDisplay(indexToDel){
        this.orderMed.splice(indexToDel,1);
        this.curCountPerLine = 1;
        this.newLine = true;
        this.items = [];

        for(let item of this.orderMed){
          if(this.newLine == false){
            if(this.curCountPerLine == 1){
              this.$set(this.items[this.items.length-1],"MedName2", item.medname);
              this.$set(this.items[this.items.length-1],"MedNm2", item.count);
              this.curCountPerLine = this.curCountPerLine + 1;
            }
            else if(this.curCountPerLine == 2){
              this.$set(this.items[this.items.length-1],"MedName3", item.medname);
              this.$set(this.items[this.items.length-1],"MedNm3", item.count);
              this.newLine = true;
              this.curCountPerLine = this.curCountPerLine + 1;
            }
          }
          else{
            this.items.push({MedName1:item.medname, MedNm1:item.count});
            this.newLine = false;
            this.curCountPerLine = 1;
          }
        }
      },

      deleteFirst(index){
        var indexToDel = index * 3 + 0;
        this.deleteAndDisplay(indexToDel);
      },

      deleteSecond(index){
        var indexToDel = index * 3 + 1;
        this.deleteAndDisplay(indexToDel);
      },

      deleteThird(index){
        var indexToDel = index * 3 + 2;
        this.deleteAndDisplay(indexToDel);
      },

      postToTb: function(){

        //this.$store.dispatch('addNumCount', 5);
        let searchStr = this.state2;
        if(searchStr === ""){
          alert("不能为空");
          this.$refs.mark1.$el.querySelector('input').focus();
          return;
        }
        
        //check if it is exist
        let existInDb = this.medsToShow.find(function(p){
            return p.value === searchStr;
        });
        if(typeof(existInDb)=="undefined"){
            alert("药品库中没有这种药，请重输");
            this.$refs.mark1.$el.querySelector('input').focus();
            return;
        }

        //check if already exist in table
        let existInTable = this.orderMed.find(function(p){
            return p.medname === searchStr;
        });
        if(typeof(existInTable)!="undefined"){
            alert("不能重复添加药品");
            this.$refs.mark1.$el.querySelector('input').focus();
            return;
        }
        //update table
        if(this.newLine == false){
          if(this.curCountPerLine == 1){
            this.$set(this.items[this.items.length-1],"MedName2", this.state2);
            this.$set(this.items[this.items.length-1],"MedNm2", this.inputDose);
            this.curCountPerLine = this.curCountPerLine + 1;
          }
          else if(this.curCountPerLine == 2){
            this.$set(this.items[this.items.length-1],"MedName3", this.state2);
            this.$set(this.items[this.items.length-1],"MedNm3", this.inputDose);
            this.newLine = true;
            this.curCountPerLine = this.curCountPerLine + 1;
          }
        }
        else{
          this.items.push({MedName1:this.state2, MedNm1:this.inputDose});
          this.newLine = false;
          this.curCountPerLine = 1;
        }

        //update orderMed
        this.orderMed.push({
            medname: this.state2,
            count: this.inputDose,
            baseprice: existInDb.baseprice,
            sellprice: existInDb.sellprice
          })
        if(this.orderCount === '')
          this.orderCount = 1;
        this.$refs.mark1.$el.querySelector('input').focus();
        this.inputDose = 1;
      },

      //select text when get focus
      focus(event) {
        event.currentTarget.select();
      },
      querySearch(queryString, cb) {
        var allMeds = this.medsToShow;
        var results = queryString ? allMeds.filter(this.createFilter(queryString)) : allMeds;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (allMed) => {
          return (allMed.alias.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        console.log(item);
      },
      getAll: function() {
        this.loading = true;
        this.$http.get("/medapi/hero").then(
          function(response) {
            this.loading = false;
            //load the med name and alias to the filter
            for (let i=0;i<response.body.length;i++){
              this.medsToShow.push(
                  {
                    "value": response.body[i].medname,
                    "alias":  response.body[i].alias,
                    "baseprice": response.body[i].baseprice,
                    "sellprice": response.body[i].sellprice,
                    "inventory": response.body[i].count,
                    "spec": response.body[i].spec,
                  }
              );
            }
            this.unpackOrdVuex();
          },
          function() {
            this.loading = false;
            console.log("error");
          }
        );
      },

      //获取当前时间，格式YYYY-MM-DD
      getNowFormatDate() {
      　　var date = new Date();
      　　var seperator1 = "/";
      　　var year = date.getFullYear();//年
      　　var month = date.getMonth() + 1;//月
      　　var strDate = date.getDate(); //日
      　　if (month >= 1 && month <= 9) {
      　　　　month = "0" + month;
      　　}
      　　if (strDate >= 0 && strDate <= 9) {
      　　　　strDate = "0" + strDate;
      　　}
      　　var currentdate = year + seperator1 + month + seperator1 + strDate;
      　　return currentdate;
      },

      postOrdToDbSure:function(){
        let orderToDb = [];
        let mydate = this.getNowFormatDate();

        if(this.orderMed.length == 0){
          alert("订单为空");
          return;
        }
        //alert(this.$store.state.count);
        var index=1;
        for(let item of this.orderMed) {
          if(index==1){
            orderToDb.push({
              medname1: item.medname,
              count1: item.count,
            })
            index = index+1;
          }
          else if(index==2){
            orderToDb[orderToDb.length-1].medname2 = item.medname;
            orderToDb[orderToDb.length-1].count2 = item.count;
            index = index+1;
          }
          else if(index==3){
            orderToDb[orderToDb.length-1].medname3 = item.medname;
            orderToDb[orderToDb.length-1].count3 = item.count;
            index = index+1;
          }
          else if(index==4){
            orderToDb[orderToDb.length-1].medname4 = item.medname;
            orderToDb[orderToDb.length-1].count4 = item.count;
            index = 1;
          }
        }
        var addOrd = [{
          patient :this.patient,
          orderalias: 'new',
          type : '收入',
          date : mydate,
          med : orderToDb,
          dose : this.orderCount,
          total : parseFloat(this.total),
          totalprofit : (parseFloat(this.total) - parseFloat((this.ordBaseTotal * this.orderCount).toFixed(2))).toFixed(2),
          editable: true,
        }];

        //alert(JSON.stringify(addOrd));

        this.$http.post("/ordapi/order", addOrd).then(
          function(response) {
            if (response.ok) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
            }
            this.loading = true;
          },
          function() {
            // this.loading = false;
          }
        );
        this.items = [];
        this.orderMed = [];
        this.orderCount = '';
        this.total = '';
        this.state2 = '';
        this.ordSellTotal = 0;
        this.ordBaseTotal = 0;
        this.inputDose = 1;
        this.newLine = true;
        this.curCountPerLine = 1;
        this.patient = ''
        this.inventory = '';
        this.singlePrice = '',
        this.singleG = ''
        this.$store.dispatch("setOrderToVuex",[]);
      },

      unpackOrdVuex: function(){
        let ordVuex = this.$store.getters.getOrder;
        
        if(ordVuex.length == 0)
          return;
        
        this.patient = ordVuex.patient;
        //unpack to orderMed
        for(let item of ordVuex.med) {
          if(typeof(item.medname1) == 'undefined')
            break;
          else{
            let existInDb = this.medsToShow.find(function(p){
            return p.value === item.medname1;
            })
            this.orderMed.push({
            medname: item.medname1,
            count: item.count1,
            baseprice: existInDb.baseprice,
            sellprice: existInDb.sellprice
            })
          }
          if(typeof(item.medname2) == 'undefined')
            break;
          else{
            let existInDb = this.medsToShow.find(function(p){
            return p.value === item.medname2;
            })
            this.orderMed.push({
            medname: item.medname2,
            count: item.count2,
            baseprice: existInDb.baseprice,
            sellprice: existInDb.sellprice
            })
          }
          if(typeof(item.medname3) == 'undefined')
            break;
          else{
            let existInDb = this.medsToShow.find(function(p){
            return p.value === item.medname3;
            })
            this.orderMed.push({
            medname: item.medname3,
            count: item.count3,
            baseprice: existInDb.baseprice,
            sellprice: existInDb.sellprice
            })
          }
          if(typeof(item.medname4) == 'undefined')
            break;
          else{
            let existInDb = this.medsToShow.find(function(p){
            return p.value === item.medname4;
            })
            this.orderMed.push({
            medname: item.medname4,
            count: item.count4,
            baseprice: existInDb.baseprice,
            sellprice: existInDb.sellprice
            })
          }
        }
        //alert(JSON.stringify(this.orderMed));
        //unpack and display to table
        this.curCountPerLine = 1;
        this.newLine = true;
        this.items = [];

        for(let item of this.orderMed){
          if(this.newLine == false){
            if(this.curCountPerLine == 1){
              this.$set(this.items[this.items.length-1],"MedName2", item.medname);
              this.$set(this.items[this.items.length-1],"MedNm2", item.count);
              this.curCountPerLine = this.curCountPerLine + 1;
            }
            else if(this.curCountPerLine == 2){
              this.$set(this.items[this.items.length-1],"MedName3", item.medname);
              this.$set(this.items[this.items.length-1],"MedNm3", item.count);
              this.newLine = true;
              this.curCountPerLine = this.curCountPerLine + 1;
            }
          }
          else{
            this.items.push({MedName1:item.medname, MedNm1:item.count});
            this.newLine = false;
            this.curCountPerLine = 1;
          }
        }
      }

    },
    watch: {
      orderMed: function(){
        this.ordBaseTotal = 0;
        this.ordSellTotal = 0;
        for(let item of this.orderMed) {
          let basePriceOfMed = item.baseprice;
          let sellPriceOfMed = item.sellprice;
          let medDose = item.count;
          this.ordBaseTotal = parseFloat((this.ordBaseTotal + parseFloat((basePriceOfMed*medDose).toFixed(2))).toFixed(2));
          this.ordSellTotal = parseFloat((this.ordSellTotal + parseFloat((sellPriceOfMed*medDose).toFixed(2))).toFixed(2));
          let temp = (this.ordSellTotal * this.orderCount).toFixed(2);
          temp += ' 元';
          this.total = temp;
        }
      },
      
      orderCount: function(val) {
        if(val != ''){
          this.orderCount = val;
        }
        let temp = (this.ordSellTotal * this.orderCount).toFixed(2);
        temp += ' 元';
        this.total = temp;
      }, 

    },
    mounted() {
      this.getAll();
      
      //this.restaurants = this.loadToQuery();
    }
  };


</script>

<style>
body
{
	line-height: 1.6em;
}

.typein
{
  display:flex;
  margin: 45px;
  width: 1100px;
  margin-bottom: 20px;
}

.inputCount
{
  width: 10px;
}

.confirmBtn
{
  text-align:right;
  width: 1100px;
  margin: 45px;
  margin-bottom: 0px;
}

.patientName{
  margin: 45px;
  margin-top: 20px;
  margin-bottom: 0px;
  width: 1100px;
}

.my-autocomplete{
  width: 1500px;
  margin-bottom: 0px;
}

.medInfo{
  width: 1100px;
  margin: 45px;
  margin-top: 0px;
}



#rounded-corner
{
	font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
	font-size: 12px;
	margin: 45px;
  margin-top: 0px;
	width: 1100px;
	text-align: left;
	border-collapse: collapse;
}
#rounded-corner tbody 
{
	background: #b9c9fe;
}
#rounded-corner th
{
	padding: 8px;
	font-weight: normal;
	font-size: 13px;
	color: #039;
	background: #b9c9fe;
}
#rounded-corner td
{
	padding: 8px;
	background: #e8edff;
	border-top: 1px solid #fff;
	color: #669;
}

#rounded-corner tfoot td.rounded-foot-left
{
	background: #e8edff;

}
#rounded-corner tfoot td.rounded-foot-right
{
	background: #e8edff;
}
#rounded-corner tbody tr:hover td
{
	background: #d0dafd;
}

</style>