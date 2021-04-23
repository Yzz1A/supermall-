<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 2.为 ECharts 准备一个具备大小（宽高）的 DOM -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
//1.导入 echarts 包
import echarts from 'echarts'

import _ from 'lodash'

import { getReport } from 'network/report'

export default {
  name: 'Report',
  data() {
    return {
      //需要合并的数据
      options: {
        tooltip: {},
        legend: {
          data: ['销量'],
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子'],
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20],
          },
        ],
      },
    }
  },
  created() {},
  //此时页面内的元素已经被渲染完毕了
  mounted() {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    getReport().then((res) => {
      if (res.meta.status !== 200) {
        return this.$message.error('获取统计报表数据失败')
      }

      //4.准备数据和配置项
      const result = _.merge(res.data, this.options)
      //const result = Object.assign(this.options, res.data)
      console.log(result)

      // 5.使用刚指定的配置项和数据显示图表。
      myChart.setOption(result)
    })
  },
  methods: {},
}
</script>

<style lang="less" scoped></style>
