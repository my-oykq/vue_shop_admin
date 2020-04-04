<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>参数列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-alert
          title="注意：只允许为第三级分类这是相关操作！"
          type="warning"
          show-icon>
        </el-alert>
        <!-- 选择商品分类区 -->
        <el-row class="cat-opt">
          <el-col>
            <span>选择商品分类:</span>
            <!-- props指定配置对象 -->
             <el-cascader
              v-model="selectCateKeys"
              :props="cateProps"
              :options="cateList"
              expand-trigger="hover"
              @change="handleChange">
             </el-cascader> 
          </el-col>
        </el-row>
        <!-- tabs标签页,点击切换数据 -->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" size="small" :disabled="isBtnClick" @click="addDialogVisible = true">动态参数</el-button>
            <!-- 动态表格 -->
            <el-table :data="ManyDate" border stripe>
              <el-table-column type="expand"></el-table-column>
              <el-table-column type="index" label="#"></el-table-column>
              <el-table-column label="参数名称" prop="attr_name"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <!-- 把一行的数据也就是id传递过去，才知道点击编辑时是编辑的那一行的数据 -->
                  <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row.attr_id)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" size="mini" @click="editDelete(scope.row.attr_id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
             <el-button type="primary" size="small" :disabled="isBtnClick" @click="addDialogVisible = true">静态属性</el-button>
            <!-- 静态属性表格 -->
             <el-table :data="OnlyDate" border stripe>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="handleEdit(scope.row.attr_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="editDelete(scope.row.attr_id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
      <!-- 添加参数的对话框 -->
      <el-dialog
        :title=" '添加'+ titleText"
        :visible.sync="addDialogVisible"
        @close="addDialogClose"
        width="50%"
        >
        <el-form ref="paramForm" 
        :model="addForm" label-width="80px" :rules="paramsRules">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>  
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleClick">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑 -->
      <el-dialog
        :title=" '编辑'+ titleText"
        :visible.sync="editDialogVisible"
        @close="editDialogClose"
        width="50%"
        >
        <el-form ref="paramForm" 
        :model="editForm" label-width="80px" :rules="editParamsRules">
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>  
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editHandleClick">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        activeName:'many',//被激活的标签
        cateList:[] ,//保存下拉框的数据
        // 级联选择框的配置对象
        cateProps:{
          value:'cat_id',//选中的那个值
          label:'cat_name',//名称,看到的值
          children:'children'//父子嵌套的数据
        },
        selectCateKeys:[],// 级联选择框双向绑定到的数组
        ManyDate:[],//动态参数的数据
        OnlyDate:[],//静态属性是数据
        addDialogVisible:false,//控制动态添加参数的对话框的显示与隐藏
        addForm:{//添加表单数据的对象
          attr_name:''
        },
        paramsRules:{// 验证规则对象
          attr_name:[
            {required:true,message:'请输入参数名称',trigger:'blur'}
          ]
        },
        editDialogVisible:false,//控制编辑对话框的显示与隐藏
        editForm:{},//修改表单对象
        editParamsRules:{ //编辑表单的验证规则
          attr_name:[
            {required:true,message:'请输入参数名称',trigger:'blur'}
          ]
        }
      }
    },
    // 当依赖于一个属性的变化来改变时用计算属性,依赖于selectCateKeys
    // 来控制激活还是禁用(true),激活返回false
    computed:{
      isBtnClick(){
        if(this.selectCateKeys.length !==3){
          return true
        }
        return false
      },
      // 当前选中的三级 分类id
      cateId(){
        // 如果当前选中的索引等于3，选中了三级分类
        if(this.selectCateKeys.length === 3){
          //返回 selectCateKeys数组中最后一项
          return this.selectCateKeys[2]
        }
        // 没有选中,返回一个空
        return null
      },
      // 动态计算标题文本,根据activeName这个属性来做计算属性，
      titleText(){
          if(this.activeName === 'many'){
            return '动态参数'
          }
          return '静态属性'
      }

    },
    created () {
      this.getCateList()
    },
    methods:{
      // 所有的请求函数
      async getCateList(){
        const res =  await this.$http.get('categories')
        if(res.data.meta.status !==200){
          return this.$message.error('获取失败')
        }
        // 成功
        this.cateList = res.data.data
        // console.log(res)
      },
      // 选择级联菜单请求函数
      async getParamsDate(){
        // 如果不是选择三级分类菜单就把选中的哪个selectCateKeys清空
        if(this.selectCateKeys.length !==3){
          // 清空
          this.selectCateKeys = []
          return
        }
        // 如果选择了三级分类,发送请求，拿到信息,请求方式，请求路径，请求参数
        const res = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{ sel: this.activeName}
        })
        if(res.data.meta.status !== 200){ //失败
          return this.$message.error('获取失败')
        }
        // 成功,把数据保存到data中,在这里要先判断获取到的数据数据是属于哪个表格，从而挂载到对应的表格中
        if(this.activeName === 'many'){ //动态参数的数据
          this.ManyDate = res.data.data
        }else{
          this.OnlyDate = res.data.data
        }
        // console.log(res)
      },
      // 点击选择框中选项变化，触发这个函数，控制选择范围
      handleChange(){
        this.getParamsDate()
        
      },
      // 点击tabs标签页切换
      handleTabClick(){
        this.getParamsDate()
      },
      // 添加参数
      addParams(){
        this.addDialogVisible = true
      },
      // 监听添加对话框的关闭事件
      addDialogClose(){
        // 重置
        this.$refs.paramForm.resetFields()
      },
      // 点击确定校验表单
      handleClick(){
        this.$refs.paramForm.validate(async valid =>{
          if(!valid) return
          // 发送请求，请求方式，请求路径，参数放在请求体中
          const res = await this.$http.post(`categories/${this.cateId}/attributes`,{
            attr_name: this.addForm.attr_name,
            attr_sel:this.activeName
          })
          if(res.data.meta.status !== 201){
            return this.$message.error('添加失败')
          }
          // 添加成功
          this.$message.success('添加成功')
          this.addDialogVisible = false
          this.getParamsDate()
          // console.log(res)
        })
      },
      // 编辑,接收传递过来的数据
     async handleEdit(attr_id){
        this.editDialogVisible = true
        // 发送请求,查询当前参数的信息
        const res = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{
          params:{attr_sel:this.activeName}
        })
        if(res.data.meta.status !== 200){
          return this.$message.error('获取参数信息失败')
        }
        // 成功
        this.editForm = res.data.data
        // console.log(this.editForm)
      },
      editDialogClose(){
        // 重置
        this.$refs.paramForm.resetFields()
        
      },
      // 表单验证,根据id查询
      editHandleClick(){
        this.editDialogVisible = false
        this.$refs.paramForm.validate(async valid =>{
          if(!valid) return //失败
          const res = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{
            attr_name:this.editForm.attr_name,
            attr_sel:this.activeName
          })
          if(res.data.meta.status !==200){
            return this.$message.error('更新失败')
          }
          this.$message.success('更新成功')
          // 调用级联菜单
          this.getParamsDate()
        })
      },
      // 
     async editDelete(attr_id){
        const confirmUrl = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        // 用户取消删除操作
        if(confirmUrl !=='confirm'){
          return this.$message.info('已取消删除')
        }
        const res = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if(res.data.meta.status !== 200){
          return this.$message.error('删除失败')
        }
        this.$message.success('删除成功')
        this.getParamsDate()
      }
    }
  }
</script>

<style scoped>

.el-breadcrumb{
  margin-bottom: 20px;
}
.cat-opt{
  margin: 20px 0;
}
.el-cascader{
  padding-left: 10px;
}
.el-button{
  margin-bottom: 20px;
}
</style>
