<!--><template>
    <el-table
    :data="tableData6"
    border
    :summary-method="getSummaries"
    show-summary
    style="width: 100%; margin-top: 20px">
    <el-table-column
      prop="id"
      label="ID"
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名">
    </el-table-column>
    <el-table-column
      prop="amount1"
      label="数值 1（元）">
    </el-table-column>
    <el-table-column
      prop="amount2"
      label="数值 2（元）">
    </el-table-column>
    <el-table-column
      prop="amount3"
      label="数值 3（元）">
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    data() {
      return {
        tableData6: [{
          id: '12987122',
          name: '王小虎',
          amount1: '234',
          amount2: '3.2',
          amount3: 10
        }, {
          id: '12987123',
          name: '王小虎',
          amount1: '165',
          amount2: '4.43',
          amount3: 12
        }, {
          id: '12987124',
          name: '王小虎',
          amount1: '324',
          amount2: '1.9',
          amount3: 9
        }, {
          id: '12987125',
          name: '王小虎',
          amount1: '621',
          amount2: '2.2',
          amount3: 17
        }, {
          id: '12987126',
          name: '王小虎',
          amount1: '539',
          amount2: '4.1',
          amount3: 15
        }]
      };
    },
    methods: {
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总价';
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
            sums[index] += ' 元';
          } else {
            sums[index] = 'N/A';
          }
        });

        return sums;
      }
    }
  };
</script> <-->
<template>
  <div class="table">
    <el-input   placeholder="请输入关键字" icon="search"  class="search"  v-model="search" ></el-input>
    <el-table  :data="tables" height="250" border style="width: 100%">
      <el-table-column  prop="medname" label="名称"></el-table-column>
      <el-table-column prop="spec" label="规格"> </el-table-column>
      <el-table-column   prop="sellprice"  label="单价"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data: function() {
    return {
        search: '',  //搜索
        tableData: []
          //{medname: '菊花',spec: '5g',sellprice: '2.5'},
          //{medname: '枸杞',spec: '2g',sellprice: '3.2'},
          //{medname: '姜黄',spec: '7g',sellprice: '1.8'},
        //]  //表格内容
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
        return this.tableData
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
    },

    //页面初始化进来查询数据
    mounted: function() {
      this.getAll();
    }
};
</script>

<style lang="css">
.tableHeader {
  color: #000;
}
</style>
