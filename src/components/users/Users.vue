<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>用户管理</el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <!-- 文本搜索区域 -->
        <el-row :gutter="20">
          <el-col :span="8">
            <!-- 搜索关键字 -->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" 
            clearable @clear="getUsersList"	>
              <!-- 绑定的数据就是之前发送请求拿到的每一行的数据 -->
              <el-button slot="append" icon="el-icon-search" @click="getUsersList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addVisible = true">添加用户</el-button>
          </el-col>
        </el-row>

        <!-- 用户列表区域 -->
        <el-table :data="userList" border stripe>
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="电话" prop="mobile"></el-table-column>
          <el-table-column label="角色" prop="role_name"></el-table-column>
          <el-table-column label="状态">
            <!-- 作用域插糟 -->
            <template slot-scope="scope">
              <!-- 修改每一列的状态，把scope.row传进来 -->
              <el-switch v-model="scope.row.mg_state" @change="Switch(scope.row)"></el-switch>
            </template>
          </el-table-column>
           <el-table-column label="操作" width="180px">
             <template slot-scope="scope">
               <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit()"></el-button>
               <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
               <el-tooltip content="分配角色"  placement="top" effect="dark" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
               </el-tooltip>
             </template>
           </el-table-column>
        </el-table>

        <!-- 分页器 -->

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 3, 5]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>

    <!-- 添加用户 -->
      <el-dialog
        :visible.sync="addVisible"
        width="50%"
        title="添加用户"
        @close="addDialogClose"
        >
        <!-- 内容主题区域 model数据绑定对象 rules验证规则对象-->
        <el-form ref="formRef" :model="addForm" label-width="70px" :rules="addFormRules">
          <el-form-item label="用户名" prop="username">
            <!-- 输入的 addForm.username自动同步到addForm中-->
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobphone">
            <el-input v-model="addForm.mobphone"></el-input>
          </el-form-item>
        </el-form>  
        <!-- 底部按钮区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑用户  -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        >
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      // 验证邮箱
      const checkEmail = (rules,value,callback) =>{
        // 正则
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if(regEmail.test(value)){ //合法
          return callback() // 跳出
        }else{ // 不合法，错误，提示错误消息
          callback(new Error('请输入正确的邮箱格式'))
        }
      }
      // 验证手机规则
      const checkMobile = (rules,value,callback) =>{
         const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
         if(regMobile.test(value)){
           return callback()
         }else{
           callback(new Error('请输入正确的手机号'))
         }
      }
      return {
        // 获取用户列表的参数对象
        queryInfo: {
          query:'',
          pagenum:1,//当前页数
          pagesize:1 // 当前每页显示多少条数据
        },
        userList:[], //用户列表数据
        total:0,
        addVisible:false, // 控制添加用户的显示与隐藏
        editDialogVisible:false, // 控制修改用户对话框的显示与隐藏
        addForm:{
          username:'',
          password:'',
          email:'',
          mobphone:'',
         
        },// 添加用户的表单数据
        // 验证规则
        addFormRules:{
          username:[
           { required: true, message: '请输入用户名称', trigger: 'blur' },
           { min: 3, max: 10, message: '用户名的长度在 3 ~ 10 个字符', trigger: 'blur' }
          ],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 15, message: '密码的长度在 3 ~ 10 个字符', trigger: 'blur' }
          ],
          email:[
            { required: true, message: '请输入邮箱名称', trigger: 'blur' },
             // 正则验证规则
            {validator:checkEmail,trigger:'blur'}
          ],
          mobphone:[
            { required: true, message: '请输入手机号', trigger: 'blur' },
            // 正则验证规则
            {validator:checkMobile ,trigger: 'blur' }
          ]
        }
      }
    },
    created(){
      this.getUsersList()
    },
    methods: {
      // 获取用户列表 (1)
      async getUsersList(){
        // 1-1.异步发送请求，get请求，路径，参数
        const res =  await this.$http.get('users',{params: this.queryInfo})
        // console.log(res)
        //1-2 根据返回数据的状态判断提示消息
        if(res.data.meta.status !== 200 ) return this.$message.error('res.data.meta.msg')
        const data = res.data.data
        // 1-3.拿到数据现在data中定义一个变量用于接收获取到的数据
        this.userList = data.users
        this.total = data.total
      },

      // 点击切换当前每页显示多少条数据
      handleSizeChange(newSize){
        this.queryInfo.pagesize = newSize
        this.getUsersList()
      },
      // 点击切换的当前页码数据
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
         this.getUsersList()
      },
      // 修改用户状态，接收参数
      async Switch(userinfo){
        
        // 发送请求拿到最新的状态
        const res = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      
        if(res.data.meta.status !== 200){ // 如果失败，弹出消息失败，并且立刻重置到之前的状态
          // 2.立刻重置
          userinfo.mg_state = !userinfo.mg_state
          // 1.失败
          return this.$message.error('更新状态失败')
        }else{ // 成功，提示成功弹框
          this.$message.success('更新状态成功')
        }
      },
    // 重置添加用户框
      addDialogClose(){
        // 拿到重置数据的哪个包裹器对象
        this.$refs.formRef.resetFields()
      },
      // 点击添加用户
      addUser(){
         this.$refs.formRef.validate(async valid =>{
           if(!valid) return //检验失败
          // 1. 成功发请求那数据   //
           const res =  await this.$http.post('users',this.addForm)
          //  console.log(res)
          //  2.判断失败和成功的操作
           if(res.data.meta.status !==201){
              this.$message.error('添加用户失败')
           }
           this.$message.success('添加用户成功')
          //  3.把对话框隐藏
           this.addVisible = false
          //  4.重新获取用户列表,调用之前发请求的函数
          this.getUsersList()
         })
      },
//    点击编辑用户
      handleEdit(){
        this.editDialogVisible = true
      }
    }
  }
</script>

<style scoped>
.el-pagination{
  margin: 20px 0;
}
.el-table{
  margin: 20px 0;
  font-size: 12px;
}
.el-card{
   margin: 20px 0;
 }
</style>
