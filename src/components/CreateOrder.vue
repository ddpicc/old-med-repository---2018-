<template>
<div> 
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
          <td> {{total}} </td>
        </tr>
      </tfoot>
    <tbody>
    	<tr v-for="(item, index) in items" :key="item.id">
        	<td> {{item.MedName1}} </td>
          <td> {{item.MedNm1}} </td>
          <td> <i class="el-icon-delete" @click="deleteMed(index)"></i> </td>
          <td> {{item.MedName2}} </td>
          <td> {{item.MedNm2}} </td>
          <td> <i class="el-icon-delete" @click="deleteMed(index)"></i> </td>
          <td> {{item.MedName3}} </td>
          <td> {{item.MedNm3}} </td>
          <td> <i class="el-icon-delete" @click="deleteMed(index)"></i> </td>
      </tr>
    </tbody>
</table>
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
  </div>
</el-row>
<el-row class="medInfo">
  <el-tag type="success" style="width:20%">库存</el-tag>
  <el-tag type="success" style="width:20%">{{remainInv}}</el-tag>
  <el-tag type="success" style="width:20%">单价</el-tag>
  <el-tag type="success" style="width:20%">{{singlePrice}}</el-tag>
</el-row>
<el-row class="patientName">
  <el-input  placeholder="请输入病人名字" v-model="patient"></el-input>
</el-row>
<span class="confirmButton">
  <el-button type="success" size="small" @click="postOrdToDbSure" round>确认</el-button>
</span>
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
          singlePrice: ''

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
        //move focus to input dose
        this.$refs.mark.$el.querySelector('input').focus();
      },

      deleteMed(index){
        //alert(this.items[index].MedName2);
        let indexToDel = index * 3 + 1;
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

      postToTb: function(){
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
                    "inventory": response.body[i].count
                  }
              );
            }
          },
          function() {
            this.loading = false;
            console.log("error");
          }
        );
      },

      postOrdToDbSure:function(){
        let orderToDb = [];
        let ordProfit = 0.00;
        let mydate = new Date();
        let dateary = mydate.toLocaleDateString().split('/');
        if(dateary[1].length == 1){
          dateary[1] = '0' + dateary[1];
          mydate = dateary.join('/');
        } else{
          mydate = dateary.join('/');
        }

        for(let item of this.orderMed) {
          orderToDb.push({
            medname: item.medname,
            count: item.count,
          })
        }
        ordProfit = (this.ordSellTotal - this.ordBaseTotal).toFixed(2);
        var addOrd = [{
          patient :this.patient,
          orderalias: 'new',
          address : this.address,
          date : mydate,
          med : orderToDb,
          dose : this.orderCount,
          total : parseFloat(this.ordSellTotal),
          totalprofit : parseFloat(ordProfit),
          editable: true,
        }];

        alert(JSON.stringify(addOrd));

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
        this.singlePrice = ''
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
.name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
.alias {
      font-size: 12px;
      color: #b4b4b4;
    }
.name .alias {
      display:flex;
      float: left;
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

.confirmbutton
{
  margin: 45px;
  width: 1100px;
  align-content: right;
}

.patientName{
  margin: 45px;
  margin-top: 20px;
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