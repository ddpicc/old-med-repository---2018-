<template>
<div>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-button type="text" @click="openStatement">流水详情 </el-button>
      <el-button type="text" @click="addExpenseVisible = true">添加收支项 </el-button>
    </el-col>

    <el-col :span="24" class="warp-main">
      <section class="chart-container">
        <el-row>
          <el-col :span="12">
            <div id="chartColumn" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="12">
            <div id="chartBar" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="12">
            <div id="chartLine" style="width:100%; height:400px;"></div>
          </el-col>
          <el-col :span="12">
            <div id="chartPie" style="width:100%; height:400px;"></div>
          </el-col>
        </el-row>
      </section>

    </el-col>
  </el-row>

  <el-dialog title="流水详情" center :visible.sync="dialogStatementVisible"  @close='closeDialog'>
    <span class="dataSelector">
      <el-date-picker
        v-model="dateValue"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions0"
        @change="dateChange"
        :default-time="['23:59:59', '23:59:59']">>
      </el-date-picker>
    </span>
    <el-table  :data="gridData" height="800" show-summary style="width: 100%" width="900">
      <el-table-column prop="date" label="日期" width="100"></el-table-column>
      <el-table-column prop="patient" label="名称" width="300">  </el-table-column>
      <el-table-column prop="type" label="类型" width="100">  </el-table-column>
      <el-table-column prop="total" label="价钱" width="100">  </el-table-column>
    </el-table>
    <div class="order-input">
      <el-button type="success" size="small" @click="printStatement" round> 打印</el-button>
      <el-button type="success" size="small" @click="closeDialog" round>取消</el-button>
    </div>
  </el-dialog>

  <el-dialog title="新增收支" :visible.sync="addExpenseVisible" class="addExpense" modal custom-class="addFormExpense" @close="closeAddExpense">
  <el-form :model="addEsForm">
    <el-form-item label="详情:">
      <el-col :span="22">
      <el-input v-model="addEsForm.detail"></el-input>
      </el-col>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="类型:">          
          <el-select v-model="addEsForm.type" placeholder="请选择类型">
            <el-option label="支出" value="支出"></el-option>
            <el-option label="收入" value="收入"></el-option>
          </el-select>          
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="日期:">          
          <el-date-picker type="date" placeholder="选择日期" v-model="addEsForm.date"></el-date-picker>          
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="数额:">
      <el-col :span="4">
        <el-input v-model="addEsForm.amount"></el-input>
      </el-col>
      <el-col :span="2">
        元
      </el-col>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="addExpenseVisible = false">取 消</el-button>
    <el-button type="primary" @click="addExpenseSure">确 定</el-button>
  </div>
  </el-dialog>
</div>
</template>

<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {
        currentDate: new Date(),
        chartColumn: null,
        chartBar: null,
        chartLine: null,
        chartPie: null,
        threeMonthOrdData: [],
        dialogStatementVisible: false,
        gridData: [],
        dateValue: '',
        pickerOptions0: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }
        }, 
        addExpenseVisible: false,
        addEsForm: {
          detail: '',
          type: '',
          date: '',
          amount: 0,
        }

      };
    },


    mounted: function () {
      let _totalFstMon = 0.00;
      let _profitFstMon = 0.00;

      let _totalSecMon = 0.00;
      let _profitSecMon = 0.00;

      let _totalTrdMon = 0.00;
      let _profitTrdMon = 0.00;

      let nowMonth = new Date().getMonth()+1;
      let firstMonth = (nowMonth-2) % 12;
      if(firstMonth<10)
        firstMonth = '0' + firstMonth;
      let secondMonth = (nowMonth-1) % 12;
      if(secondMonth<10)
        secondMonth = '0' + secondMonth;
      let thirdMonth = nowMonth % 12;
      if(nowMonth<10)
        thirdMonth = '0' + nowMonth;
      this.$http.get("/ordapi/getOrdinThreeMonth").then(function (data) {
        for(let item of data.body) {
          let tempMon = item.date.split('/')[1];
          tempMon = parseInt(tempMon);
          firstMonth = parseInt(firstMonth);
          secondMonth = parseInt(secondMonth);
          thirdMonth = parseInt(thirdMonth);
          switch(tempMon){
            case firstMonth:
              _totalFstMon = _totalFstMon + item.total;
              _profitFstMon = _profitFstMon + item.totalprofit;
              break;
            case secondMonth:
              _totalSecMon = _totalSecMon + item.total;
              _profitSecMon = _profitSecMon + item.totalprofit;
              break;
            case thirdMonth:
              _totalTrdMon = _totalTrdMon + item.total;
              _profitTrdMon = _profitTrdMon + item.totalprofit;
              break;
          }  
        }
        _totalFstMon = _totalFstMon.toFixed(2);
        _profitFstMon = _profitFstMon.toFixed(2);
        _totalSecMon = _totalSecMon.toFixed(2);
        _profitSecMon = _profitSecMon.toFixed(2);
        _totalTrdMon = _totalTrdMon.toFixed(2);
        _profitTrdMon = _profitTrdMon.toFixed(2);
        this.$nextTick( () => {
      //基于准备好的dom，初始化echarts实例
        this.chartColumn = echarts.init(document.getElementById('chartColumn'));

      this.chartColumn.setOption({
        title: { text: '销售统计' },
        tooltip: {},
        legend: {
            data: ['总销量','总利润']
        },
        xAxis : [{
            type : 'category',
            data : [(nowMonth-2)+'月', (nowMonth-1)+'月', nowMonth+'月', ]
        }],
        yAxis : [{
            type : 'value'
        }],
        series: [
          {
            name: '总销量',
            type: 'bar',
            data: [_totalFstMon,_totalSecMon,_totalTrdMon]
          },
          {
            name: '总利润',
            type: 'bar',
            data: [_profitFstMon,_profitSecMon,_profitTrdMon]
          }
        ]
      });
      });
      });

        this.chartBar = echarts.init(document.getElementById('chartBar'));
        this.chartLine = echarts.init(document.getElementById('chartLine'));
        this.chartPie = echarts.init(document.getElementById('chartPie'));
this.chartBar.setOption({
        title: {
          text: 'Bar Chart',
          subtext: '数据来自网络'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['2011年', '2012年']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['巴西', '印尼', '美国', '印度', '中国', '世界人口(万)']
        },
        series: [
          {
            name: '2011年',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
          },
          {
            name: '2012年',
            type: 'bar',
            data: [19325, 23438, 31000, 121594, 134141, 681807]
          }
        ]
      });

      this.chartLine.setOption({
        title: {
          text: 'Line Chart'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['邮件营销', '联盟广告', '搜索引擎']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '邮件营销',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      });

      this.chartPie.setOption({
        title: {
          text: 'Pie Chart',
          subtext: '纯属虚构',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              { value: 335, name: '直接访问' },
              { value: 310, name: '邮件营销' },
              { value: 234, name: '联盟广告' },
              { value: 135, name: '视频广告' },
              { value: 1548, name: '搜索引擎' }
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });    
      
    },
    methods: {
      openStatement: function(){
        this.dialogStatementVisible = true;
      },

      closeDialog: function(){
        this.gridData = [];//清空数据
        this.dialogStatementVisible = false;
      },

      dateChange: function(){
        var tempMon = this.dateValue[0].getMonth()+1;
        if(tempMon < 10)
          tempMon = '0' + tempMon;
        var tempYear = this.dateValue[0].getFullYear();
        var tempDay = this.dateValue[0].getDate();
        if(tempDay < 10)
          tempDay = '0' + tempDay;
        var start = tempYear + '/' + tempMon + '/' + tempDay;
        //alert(start);

        tempMon = this.dateValue[1].getMonth()+1;
        if(tempMon < 10)
          tempMon = '0' + tempMon;
        tempYear = this.dateValue[1].getFullYear();
        tempDay = this.dateValue[1].getDate();
        if(tempDay < 10)
          tempDay = '0' + tempDay;
        var end = tempYear + '/' + tempMon + '/' + tempDay;
        //alert(end);
        var dateRange = {
          startDate: start,
          endDate: end,
          };
        var that = this;
        this.axios.get("/ordapi/getOrderStatement", {params:dateRange})
        .then(
          function(response) {
            that.gridData = response.data;
          },
          function() {
            console.log("error");
          }
        );
      },

      //获取当前时间，格式YYYY-MM-DD
      getNowFormatDate(inputDate) {
      　　var date = inputDate;
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

      addExpenseSure: function(){
        //alert(this.addEsForm.detail);
        //alert(this.addEsForm.type);
        //alert(this.getNowFormatDate(this.addEsForm.date));
        //alert(this.addEsForm.amount);
        let tempTotal;
        if(this.addEsForm.type == "支出")
          tempTotal = -1 * this.addEsForm.amount;
        var addEntry = [{
          patient :this.addEsForm.detail,
          orderalias: 'new',
          type : this.addEsForm.type,
          date : this.getNowFormatDate(this.addEsForm.date),
          total : tempTotal,
          totalprofit: tempTotal,
          editable: false,
        }];

        //alert(JSON.stringify(addEntry));

        this.$http.post("/ordapi/order", addEntry).then(
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
        this.addEsForm.detail = '';
        this.addEsForm.type = '';
        this.addEsForm.date = '';
        this.addEsForm.amount = 0;
        this.addExpenseVisible = false;

      },

      // 关闭dialog的函数
      closeAddExpense: function() {
        this.addEsForm.detail = '';
        this.addEsForm.type = '';
        this.addEsForm.date = '';
        this.addEsForm.amount = 0;
      },

      printStatement: function(){

      }
    }
  }
</script>

<style>

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.chart-container {
  width: 100%;
}
.chart-container .el-col {
  padding: 30px 20px;
}
#rounded-corner
{
	font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
	font-size: 12px;
	margin: 45px;
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
