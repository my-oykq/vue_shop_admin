<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 1 -->
      <div id="main" style="width: 600px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
// 2
import echarts from 'echarts'
import _ from 'lodash'
  export default {
    data () {
      return {
        // 需要合并的数据
         options: {
          title: {
            text: '用户来源'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              label: {
                backgroundColor: '#E9EEF3'
              }
            }
          },
         }  
      }
    },
    created () {
      
    },
    /* 
    此时页面上的元素已经渲染完毕
    */
   async mounted () {
      // 3.基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById('main'));
      // 6.发送请求
      const res = await this.$http.get('reports/type/1')
      
      if(res.data.meta.status !==200){
        return this.$message.error('获取折线图数据失败')
      }
        //4.准备数据和配置项,通过深拷贝合并两个对象
       const result =  _.merge(res.data.data,this.options)

        //5. 使用刚指定的配置项和数据显示图表。,把合并的结果展示在页面上
        myChart.setOption(result);
    },
    methods: {
      
    }
  }
</script>

<style scoped>

 
</style>
