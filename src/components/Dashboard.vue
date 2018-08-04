<template>
  <el-row class="warp">
    <el-col :span="24" class="warp-breadcrum">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }"><b>首页</b></el-breadcrumb-item>
      </el-breadcrumb>
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
</template>
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
</style>

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
        threeMonthOrdData: []
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
      this.$http.get("/ordapi/getOrdinThreeMonth").then(function (data) {
        //alert(JSON.stringify(data.body));
        for(let item of data.body) {
          let tempMon = item.date.split('/')[1];
          //alert(typeof(tempMon));
          switch(tempMon){
            case (nowMonth-2).toString():
              _totalFstMon = _totalFstMon + item.total;
              _profitFstMon = _profitFstMon + item.totalprofit;
              break;
            case (nowMonth-1).toString():
              _totalSecMon = _totalSecMon + item.total;
              _profitSecMon = _profitSecMon + item.totalprofit;
              break;
            case nowMonth.toString():
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
        title: { text: 'Column Chart' },
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
    }
  }
</script>
