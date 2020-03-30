<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 通过:data="绑定数据源",展示数据在列表上 stripe隔行变色-->
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 通过 -->
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        rightsList:[], // 所有权限列表
      }
    },
    created () {
      this.getRightsList()
    },
    methods: {
      // 获取所有权限列表数据 (1)
      async getRightsList(){
         const res = await this.$http.get('rights/list')
         if(res.data.meta.status !== 200){
          //  1.失败
           this.$message.error('获取权限列表失败')
         }
        //  2.成功，把数据保存到data中变量的参数，便于传参数
        this.rightsList = res.data.data
        //  console.log(this.rightsList) 
      }
    }
  }
</script>

<style scoped>
.el-breadcrumb{
  margin-bottom: 20px;
}
 
</style>
