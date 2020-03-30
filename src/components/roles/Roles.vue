<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 卡片视图 -->
      <el-button type="primary" @click="rolesVisible = true">添加角色</el-button>
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="item1 in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row>

                </el-row>
              </el-col>
            </el-row>
            <pre>
          
            </pre>
          </template>
        </el-table-column>
        <!-- 索引 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" @click="handleEdit(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small" @click="handleDelete(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="small" @click="showSetDialog()">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色 -->
      <el-dialog 
        :visible.sync="rolesVisible"
        width="50%"
        title="添加角色"
        @close="rolesDialog">
        <el-form ref="rolesRef" 
          :model="rolesForm" label-width="80px"
          :rules="rolesRules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="rolesForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="rolesForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="rolesVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRoles">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 编辑角色 -->
      <el-dialog
        title="修改角色"
        :visible.sync="editRolesVisible"
        width="50%"
        @close="editDialog"
        >
        <el-form ref="editRolesRef" 
          :model="editRoles" label-width="70px" 
          :rules="rolesRules">
          <el-form-item label="角色名称">
            <el-input v-model="editRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="editRoles.roleDesc"></el-input>
          </el-form-item>
        
        </el-form> 

        <span slot="footer" class="dialog-footer">
          <el-button @click="editRolesVisible=false">取 消</el-button>
          <el-button type="primary" @click="addRolesInfo">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限 -->
      <el-dialog
        title="分配权限"
        :visible.sync="dialogSetDialogVisible"
        width="50%"
        >
         <!-- 树形结构 :default-checked-keys="defKeys"默认展开激活-->
        <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
          :props="defaultTreeProps">
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogSetDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogSetDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
     
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
         rolesForm:{
           roleName:'',
           roleDesc:''
         },
        //  验证规则
         rolesRules:{
           roleName:[
             { required: true, message: '请输入角色名称', trigger: 'blur' },
           ],
           roleDesc:[
             { required: true, message: '请输入角色描述', trigger: 'blur' },
           ]
         },
         editRolesRules:{
           roleName:[
             { required: true, message: '请输入角色名称', trigger: 'blur' },
           ],
           roleDesc:[
             { required: true, message: '请输入角色描述', trigger: 'blur' },
           ]
         },
         rolesList:[], //角色列表的数据 
         rolesVisible:false, //控制添加角色弹框的显示和隐藏
         editRolesRules:{},// 编辑验证规则
         editRoles:{}, //编辑角色数据，用于保存
         editRolesVisible:false,//编辑角色的显示和隐藏
         dialogSetDialogVisible:false, // 分配权限对话框的显示与隐藏
         rightsList:[],// 所有分配权限列表数据
         defaultTreeProps:{ // 树形控件绑定对象
            label:'authName',
            children:'children'
         },
         defKeys:[],//默认选中打开的id数组
      }
    },
    created () {
      this.getRoleslist()
    },
    methods: {
      // 获取所有角色列表(1)
      async getRoleslist(){
        const res = await this.$http.get('roles')
       
        
        if(res.data.meta.status !== 200){
          return this.$message.error('获取失败')
        }
        // 保存请求到的数据,当韩束一旦被调用的时候内部数据数据已经被销毁
        // 再次调用函数会重新创建数据，在发请求时把数据保存下来。
        this.rolesList = res.data.data
        

      },
      // 添加角色(1-1)
      addRoles(){
        // 校验
        this.$refs.rolesRef.validate(async valid =>{
          if(!valid) return //1.校验不通过
          // 2.成功的话就发送请求拿数据,url,参数
          const res = await this.$http.post('roles',this.rolesForm)
          if(res.data.meta.status !== 200){ // 失败
          this.$message.error('添加角色失败')
        }
        // 成功
        this.$message.success('添加角色成功')
        // 调用获取所有的角色列表
        this.getRolesList()
        // 把对话框隐藏
        this.rolesVisible = false
        })
      },
      // 对添加角色做重置操作(1-1-2)
     rolesDialog(){
       this.$refs.rolesRef.resetFields()
    },

      // 编辑角色(1-2)
      async handleEdit(id){
        
        // 重置对话框
        this.editRolesVisible = true
        // 发请求更新最新的数据列表
        const res = await this.$http.get('roles/' + id)
       
        if(res.data.meta.status !==200){
          this.$message.error('获取失败')
        }
        this.editRoles = res.data.data
       console.log(this.editRoles)
      },
      // 对编辑角色重置操作
      editDialog(){
        this.$refs.editRolesRef.resetFields()
      },
      // 对编辑表单提交校验(1-2-3)
      addRolesInfo(){
        this.$refs.editRolesRef.validate(async valid =>{
          // 校验不通过，直接跳出
          if(!valid) return
          // 校验通过，发请求，拿到最新的数据，调用之前请求的函数
          const res = await this.$http.put('roles/' + this.editRoles.roleId,{
            roleName:this.editRoles.roleName,
            roleDesc:this.editRoles.roleDesc
          })
          console.log(res)
           if(res.data.meta.status !== 200){ // 失败
            this.$message.error('更新角色失败')
          }
          this.$message.success('更新角色成功')
          // 隐藏对话框
          this.editRolesVisible = false
          this.getRolesList()
          
        })
      },
      // 删除(1-2-4),接收参数
      async handleDelete(id){
        const res = await this.$confirm(
          '此操作将永久删除该用户信息, 是否继续?',{
            confirmButtonText: '确定',
             cancelButtonText: '取消',
             type: 'warning',
             center: true
          }
        ).catch(error =>error)
        console.log(res)
        if(res !== 'confirm'){ //点击不相等就取消删除
          return this.$message.info('已取消删除')
        }

        // 确定删除，发请求去删除一行的数据
        const result = await this.$http.delete('roles/' + id)
        if(result.data.meta.status !== 200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        // 调用最初请求到的函数，才能完整删除一整条数据
        this.getRolesList()
      },
      // 展示分配权限的对话框
     async showSetDialog(){
        // 重置对话框为显示状态
        this.dialogSetDialogVisible = true
        // 2.获取所有权限列表的数据
      const res = await this.$http.get('rights/tree')
      if(res.data.meta.status !== 200){
        this.$message.error('获取权限列表失败')
      }
      // 获取成功，把数据保存到data中
      this.rightsList = res.data.data
         // 递归获取三级节点的id
      // this.getLeaKeys(role,this.defKeys)
      
      },


      //通过递归的形式，获取角色下所有三级权限的id。并且保存到 defKeys数组中
      // getLeaKeys(node, arr){
      //   // 如果当前节点不包含children，就是三级节点
      //   if(!node.children){
      //     // 添加到空数组中去
      //     return arr.push(node.children)
      //   }
      //   // 递归,就是反复调用自己所处在的那个函数
      //   node.children.forEach(item =>{
      //     this.getLeaKeys(item, arr)
      //   })
      // }
    }
  }
</script>

<style scoped>
.el-table{
  margin: 20px 0;
}
.el-breadcrumb{
  margin-bottom: 20px;
}
</style>
