<template>
  <div class="order">
    <el-container>
      <el-container direction="vertical">
        <el-input  placeholder="请输入关键字" icon="search"  class="search"  v-model="search" ></el-input>
        <el-table  :data="tables" height="500" style="width: 100%" width="500">
          <el-table-column prop="medname" label="药品名称" ></el-table-column>
          <el-table-column prop="spec" label="规格"> </el-table-column>
          <el-table-column prop="sellprice"  label="零售价"></el-table-column>
          <el-table-column width="60">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="success" size="small" icon="el-icon-plus" @click="add(scope.row)" round="true"></el-button>
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
              <el-input  v-model="scope.row.number" @change="handleInput(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column  prop="medTotal" label="价钱"></el-table-column>
          <el-table-column width="60">
            <template slot-scope="scope">
              <el-button-group>
                <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteline(scope.$index)" round="true"></el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="dose-input">
          <el-input  placeholder="请输入多少付" v-model="dose" size="small"></el-input>
          <el-input  placeholder="总价" v-model="total" size="small"></el-input>
        </div>
      </el-container>
    </el-container>

<el-dialog title="收货地址" :visible.sync="dialogTableVisible">
  <el-table :data="gridData">
    <el-table-column property="date" label="日期" width="150"></el-table-column>
    <el-table-column property="name" label="姓名" width="200"></el-table-column>
    <el-table-column property="address" label="地址"></el-table-column>
  </el-table>
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
        dialogTableVisible: true
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
        this.$http.get("/api/hero").then(
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

      add: function(row) {
        if(this.ordertb.indexOf(row) === -1){
          this.$set(row,"medTotal", row.sellprice);
          this.$set(row,"number", 1);
          this.ordertb.push(row);
          if(this.dose === '')
            this.dose = 1;
        }
        else
          alert("already exist");
      },

      deleteline: function(index) {
        this.ordertb.splice(index,1);
        this.total = '';
        this.dose = 1;
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
   text-align: right;
}
</style>
