<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表单区域 -->
      <el-table :data="orderlist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" width="90px" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" width="90px" prop="pay_status">
          <template slot-scope="scope">
            <!--  判断显示已付款还是未付款， 如果状态码等于 1，就显示已付款，否则显示未付款 -->
            <el-tag type="success" v-if="scope.row.pay_status ==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" width="90px" prop="is_send">
          <template slot-scope="scope">
            {{scope.row.is_send}}
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="170px" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dataFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editOrder"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 编辑订单 -->
      <el-dialog
        title="修改地址"
        :visible.sync="orderVisible"
        width="50%"
        @close="oderClose">
        <!-- 表单 -->
        <el-form :model="addressForm" :rules="orderRules" ref="orderRuleForm" label-width="100px">
          <el-form-item label="省市区/县" prop="address1">
            <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址" prop="address2">
            <el-input v-model="addressForm.address2"></el-input>
          </el-form-item>
        </el-form>  
        <span slot="footer" class="dialog-footer">
          <el-button @click="orderVisible = false">取 消</el-button>
          <el-button type="primary" @click="orderVisible = false">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 物流信息 -->
      <el-dialog
        title="物流进度"
        :visible.sync="progressVisible"
        width="50%"
        >
      <el-timeline>
        <el-timeline-item v-for="(activity, index) in progressInfo" 
          :key="index"
          ::timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      </el-dialog>
    </el-card>
  
    
  </div>
</template>

<script type="text/ecmascript-6">
import cityData from './citydata'
  export default {
    data () {
      return {
        queryInfo:{
           query:'',//查询参数
           pagenum:1,//当前页码
           pagesize:10,//每页显示的条数
        },
        orderVisible:false,//控制编辑对话框的显示与隐藏
        progressVisible:false,//物流进度对话框的显示与隐藏
        orderlist:[],//保存请求订单数据
        total:0,//显示总条数
        addressForm:{//表单绑定值
          address1:[],// 保存级联选择器数据的数组
          address2:''
        },
        orderRules:{// 表单验证规则
          address1:[
           {required: true, message: '请选择省市区', trigger: 'blur'}
          ],
          address2:[
            {required: true, message: '请填写详细地址', trigger: 'blur'}
          ]
        },
        cityData,//省市区的数据
        progressInfo:[],//物流信息的保存
      }
    },
    created () {
      this.getOrderList()
    },
    methods: {
     async getOrderList(){
       const res = await this.$http.get('orders',{
         params:this.queryInfo
       })
       if(res.data.meta.status !==200){
         return this.$message.error('获取失败')
       }
       this.$message.success('获取成功')
       const data = res.data.data
      //  请求数据拿到数据保存到data中
       this.orderlist = data.goods
       this.total = data.total
        
    
      },
      // 监听改变的页码值，监听每页显示多少条数据-pagesize
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getOrderList()
      },
      // 监听当前pagenum改变的值,点击当前的页码可以点击
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getOrderList()
      },
      // 编辑订单
      editOrder(){
        // 把编辑对话框打开
        this.orderVisible = true
      },
      // 点击展示物流信息
     async showProgressBox(){
       const res =  await this.$http.get('/kuaidi/1106975712662')
       if(res.data.meta.status !==200){
         return this.$message.error('获取物流信息失败')
       }
      //  成功，保存数据
      this.progressInfo = res.data.data
      this.progressVisible = true

      },
      // 完成时关闭对话框
      oderClose(){
        // 2.重置
        this.$refs.orderRuleForm.resetFields()
        // 1.关闭对话框
        this.orderVisible = false
      }
    }
  }
</script>

<style scoped>
.el-pagination{
  margin-top: 20px;
}
.el-cascader{
  width: 100%;

}

</style>
