<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 实现搜索关键字 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="goAddShop">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="90px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="170px">
          <template slot-scope="scope">
            {{scope.row.add_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteClick(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>  
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        queryInfo:{ //查询参数对象
          query:'',//查询参数
          pagenum:1,//当前的页码
          pagesize:10 //显示10条数据
        },
        goodslist:[],//商品列表
        total:0,//显示总条数
      }
    },
    created () {
      this.getGoodsList()
    },
    methods: {
     async getGoodsList(){
       const res = await this.$http.get('goods',{
         params:this.queryInfo
       })
       const result = res.data.data
       if(res.data.meta.status !==200){
         return this.$message.error('获取失败')
       }
       this.$message.success('获取成功')
       this.total = result.total
       this.goodslist = result.goods
       console.log(res )
      },
      // 监听改变的页码值，监听每页显示多少条数据
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
        // console.log('handleSizeChange')
      },  
      //  监听当前pagenum改变的值,点击当前的页码可以点击
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
        // console.log('handleCurrentChange')
      },
      // 点击删除
     async deleteClick(goods_id){
       const confirmUrl = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmUrl !=='confirm'){
          return this.$message.info('已取消删除')
        }
        // 点击确定删除，那么就得发送请求来删除到一整条数据
        const res = await this.$http.delete(`goods/${goods_id}`)
        if(res.data.meta.status !== 200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getGoodsList()
        console.log(res)
      },
      // 添加商品跳转到添加商品界面
      goAddShop(){
        this.$router.push('/goods/add')
      }
     
    }
  }
</script>

<style scoped>
.el-pagination{
  margin-top: 20px;
}
.el-row{
  padding: 10px 0;
}
.el-card{
  margin-top: 20px;
}
.el-table{
  margin-top: 20px;
}
</style>
