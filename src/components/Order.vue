<template>
  <div class="order">
    <el-container>
      <el-container direction="vertical">
        <el-input  placeholder="请输入关键字" icon="search"  class="search"  v-model="search" ></el-input>
        <el-table  :data="tables" height="500" style="width: 100%" width="1200">
          <el-table-column prop="medname" label="药品名称" ></el-table-column>
          <el-table-column prop="alias"   label="别名">  </el-table-column>
          <el-table-column prop="spec" label="规格"> </el-table-column>
          <el-table-column prop="sellprice"  label="零售价"></el-table-column>
          <el-table-column width="60">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="success" size="small" icon="el-icon-plus" @click="add(scope.row)" round></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </el-container>
      <el-container direction="vertical">
        <el-table  :data="ordertb" height="400" border show-summary :summary-method="getSummary" style="width: 100%">
          <el-table-column  prop="medname" label="名称"></el-table-column>
          <el-table-column  label="数量">        
            <template slot-scope="scope">
              <el-input  @focus="focus($event)" v-model="scope.row.number" @change="handleInput(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column  prop="medTotal" label="价钱"></el-table-column>
          <el-table-column width="60">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteline(scope.$index)" round></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="dose-input">
          <el-input  placeholder="请输入多少付" v-model="dose" size="small" @focus="focus($event)"></el-input>
          <el-input  placeholder="总价" v-model="total" size="small" @focus="focus($event)"></el-input>
          <el-button type="success" size="small" @click="postorder" round>生成订单</el-button>
        </div>
      </el-container>
    </el-container>

    <el-dialog title="订单" center :visible.sync="dialogTableVisible"  @close='closeDialog'>
      <el-table  :data="gridData" height="300" style="width: 100%" width="900">
        <el-table-column prop="mednameFirst"></el-table-column>
        <el-table-column prop="countFirst">  </el-table-column>
      </el-table>
      <div class="order-input">
        <el-tag type="success">{{'共' + dose + '付'}}</el-tag>
        <el-tag type="success">{{total}}</el-tag>
        <el-input  placeholder="请输入病人名字" v-model="patient" size="small"></el-input>
        <el-input  placeholder="地址" v-model="address" size="small"></el-input>
        <el-button type="success" size="small" @click="postOrdToDbSure" round> 确认</el-button>
        <el-button type="success" size="small" @click="closeDialog" round>取消</el-button>
      </div>
    </el-dialog>
  </div>  
</template>

<script>
export default {
  data: function() {
    return {
        search: '',  //搜索
        tableData: [],
        ordertb: [],
        totalPerOrder: 0,
        dose: '',
        total: '',
        dialogTableVisible: false,
        gridData: [],
        patient: '',
        address: ''
      }
    },
    computed:{
      tables:function(){
        var search=this.search;
        if(search){
          return  this.tableData.filter(function(dataNews){
            return Object.keys(dataNews).some(function(key){
              return String(dataNews[key]).toLowerCase().indexOf(search) > -1
            })
          })
        }
        return this.tableData;
      }
    },
    methods: {
      getAll: function() {
        this.loading = true;
        this.$http.get("/medapi/hero").then(
          function(response) {
            this.loading = false;
            this.tableData = response.body;
          },
          function() {
            this.loading = false;
            console.log("error");
          }
        );
      },

    //select text when get focus
      focus(event) {
        event.currentTarget.select();
      },

      add: function(row) {
        //alert(this.ordertb.length);
        if(this.ordertb.indexOf(row) === -1){
          this.$set(row,"medTotal", row.sellprice);
          this.$set(row,"number", 1);
          this.ordertb.push(row);
          this.search = '';
          if(this.dose === '')
            this.dose = 1;
        }
        else
          alert("already exist");
      },

      deleteline: function(index) {
        this.ordertb.splice(index,1);
        this.total = '';
        if(this.ordertb.length === 0)
          this.dose = '';
      },

      getSummary(param){
        
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = "每付价钱";
            return;
          }
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            this.totalPerOrder = sums[index].toFixed(2);
            let temp = (this.totalPerOrder * this.dose).toFixed(2);
            temp += ' 元';
            this.total = temp;
            sums[index] = this.totalPerOrder + ' 元';
          } else {
            sums[index] = '--';
          }
        });
        return sums;
      },

      handleInput:function(value){
        if( value.number===""){
          value.number=1;
        }
        value.medTotal=(value.number*value.sellprice).toFixed(2);//保留两位小数
      },

      postorder:function(){
        this.dialogTableVisible = true;
        for(let item of this.ordertb) {
          //alert(JSON.stringify(item));
          this.gridData.push({
            mednameFirst: item.medname,
            countFirst: item.number
          })
        }
        
      },

      closeDialog:function(){
        this.gridData = [];//清空数据
        this.dialogTableVisible = false;
      },

      postOrdToDbSure:function(){
        let orderMed = [];
        let ordProfit = 0.00;
        for(let item of this.ordertb) {
          //alert(JSON.stringify(item));
          ordProfit = parseFloat((ordProfit + item.profit).toFixed(2));
          orderMed.push({
            medname: item.medname,
            count: item.number,
          })
        }
        ordProfit = parseFloat((ordProfit * this.dose).toFixed(2));
        var addOrd = [{
          patient :this.patient,
          orderalias: 'new',
          address : this.address,
          med : orderMed,
          dose : this.dose,
          total : parseFloat(this.total),
          totalprofit : ordProfit,
          editable: true,
        }];

      this.dialogTableVisible = false;

      this.$http.post("/ordapi/order", addOrd).then(
        function(response) {
          if (response.ok) {
            this.$message({
              message: "添加成功",
              type: "success"
            });
          }
        },
        function() {
          // this.loading = false;
        }
      );
      this.ordertb = [];
      this.gridData = [];
      this.dose = '';
      this.total = '';
      }


    },

    watch: {
      dose: function(val) {
        if(val != ''){
          this.dose = val;
        }
        let temp = this.totalPerOrder * this.dose;
        temp += ' 元';
        this.total = temp;
        //alert(this.dose * this.totalPerOrder);
      }, 

    },

    //页面初始化进来查询数据
    mounted: function() {
      this.getAll();
    }
}
</script>

<style lang="css">
.tableHeader {
  color: #000;
}
.dose-input {
    display:flex;
}


</style>
