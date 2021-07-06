<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="myBreadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">数据统计</a></el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="myCard">
      <div id="main" style="width: 600px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import _ from "lodash";
// Vue.use(echarts)
export default {
  data() {
    return {
      // 指定图表的配置项和数据
      option: {
        title: {
          text: "数据报表",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        tooltip: {},
        legend: {},
        xAxis: {
          data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
          boundaryGap: false,
        },
        yAxis: {},
        series: [],
      },
      //后台获取到的报表数据
      chartData: {},
    };
  },
  methods: {},
  created() {},
  mounted() {
    this.$axios.get("reports/type/1").then((res) => {
      if (res.data.meta.status !== 200)
        return this.$message.error("获取数据报表失败！");
      this.chartData = _.merge(res.data.data, this.option);
      console.log(this.chartData);
      const myChart = echarts.init(document.getElementById("main"));
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(this.chartData);
    });
  },
};
</script>

<style scoped lang='less'>
</style>
