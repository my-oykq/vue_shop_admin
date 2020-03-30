<template>
  <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>商品管理</el-breadcrumb-item>
          <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-row>
          <el-col>
            <el-button type="primary" size="small" @click="handleAddCate">添加分类</el-button>
          </el-col>
        </el-row>
        <!-- 表格区域 -->
        <tree-table class="tree-table" :data="categoryList" 
          :columns="columns"
          :selection-type="props.selectionType"
          :expand-type="false"
          show-index
          index-text="#"
          border>
              <!-- 引用columns定义的模板和模板名称 slot-scope="scope"接收这一行的数据，通过scope
              来拿到这一行的确定数据,比如：scope.$index可以拿到索引下标-->
            <template slot="isok" slot-scope="scope">
              <!-- 图标 -->
              <i class="el-icon-success" 
              v-if="scope.row.cat_deleted === false" style="color:lightgreen;"></i>
              <i class="el-icon-error" v-else style="color:red;"></i>
            </template>
            <!-- 排序 -->
            <template slot="order" slot-scope="scope">
              <!-- 通过v-if来判断显示一级还是二级、三级 -->
              <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
              <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
              <el-tag type="warning" v-else>三级</el-tag>
            </template>
            <!-- 操作 -->
            <template slot="opt" slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </template>
        </tree-table>
        <!-- 分页 page-sizes每页显示多少条数据-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 3, 5,10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-card>

      <!-- 添加分类 -->
      <el-dialog
        title="添加分类"
        :visible.sync="cateDialogVisible"
        width="50%"
        @close="cateDialog">
        <el-form ref="CategoryRef" :model="categForm" label-width="80px"
          :rules="CategRules">
          <!-- prop="cat_name"绑定的 cat_name，会根据这个去验证-->
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="categForm.cat_name"></el-input>
          </el-form-item>
         <el-form-item label="父级分类:">
           <!-- options用来指定数据源 ,props用来指定配置对象-->
            <el-cascader
              v-model="selectKeys"
              :options="parenCateList"
              expand-trigger="hover"
              :props="cascaderProps"
              clearable change-on-select
              @change="parentChange">
            </el-cascader>
         </el-form-item>
        </el-form>  
        <span slot="footer" class="dialog-footer">
          <el-button @click="cateDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCate">确 定</el-button>
        </span>
      </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    name:"Categories",
    data () {
      return {
        // 定义参数
        queryInfo:{
          type:3,
          pagenum:1,//当前页码值 
          pagesize:5,//每页显示5条数据
        },
        categoryList:[],// 商品分类列表数据
        total:0,//总数据
        props: {
          selectionType: false,

        },
        // 为table指定列的定义
        columns:[
          {label:'分类名称',prop:'cat_name'},
           
          {
            label:'是否有效',
            type:'template',//表示当前列定义为模版
            template:'isok' //表示当前这一列使用模板名称
          },
          {
            label:'排序',
            type:'template',
            template:'order'
          },
          {
            label:'操作',
            type:'template',
            template:'opt'
          }
        ],
        cateDialogVisible:false,//添加分类对话框
        categForm:{ //添加分类的绑定数据
          cat_name:'',// 分类名称
          cat_pid:0,// 父类分类id
          cat_level:0,//默认添加等级分类
        },
        CategRules:{
          cat_name:[
            {required: true, message: '请输入分类名称', trigger: 'blur'}
          ]
        },
        // cateOptios:{

        // },
        parenCateList:[],// 父级分类数据
        cascaderProps:{// 指定级联选择器
          value:'cat_id',//选中的值
          label:'cat_name',//名称,看到的值
          children:'children',//父子嵌套的数据
        },
        selectKeys:[],//选中的父级分类id数组
      }
    },
    created(){
      this.getCategory()
    },
    methods: {
      // 请求拿到分类的数据
      async getCategory(){
        const res = await this.$http.get('categories',{params:this.queryInfo})
        
         if(res.data.meta.status !==200){
           this.$message.error('获取失败')
         }
        //  console.log(res)
        //  成功把数据保存到data
         this.categoryList = res.data.data.result
        //  console.log(this.categoryList)
        //  拿到总数据
         this.total = res.data.data.total
           
      },
        //监听改变的页码值 
      handleSizeChange(newSize){
        // 把当前改变的页码值赋值给data中的数据
        this.queryInfo.pagenum = newSize
        // 调用函数
        this.getCategory()
      },
      // 监听当前pagenum改变的值
      handleCurrentChange(newPage){
        this.queryInfo.pagenum = newPage
        this.getCategory()
      },
      // 添加分类
      handleAddCate(){
        // 2
        this.getParentCate()
        // 1
        this.cateDialogVisible = true
      },
      // 获取父类的二级分类id
     async getParentCate(){
      //  type:2指定获取前二级分类
       const res = await this.$http.get('categories',{params:{type:2}})
       if(res.data.meta.status !== 200){
         return this.$message.error('回去父级分类数据失败')
       }
      //  成功，把数据保存到data中
      this.parenCateList = res.data.data
      // console.log(this.parenCateList)
      },
      // 选择选项选中变化触发这个函数
      parentChange(){
        // 如果selectKeys.length > 0证明是选中的父级分类，反之就说明没有选中任何父级分类
        if(this.selectKeys.length > 0){ //选中
        // 把选中最后一项当做父级分类的id，比如：大家电/电视，把电视当作是父级分类的id
          this.categForm.cat_pid = this.selectKeys[this.selectKeys.length -1]
          // 把当前的分类赋值，cat_level和数组的长度是保持一致的
          this.categForm.cat_level = this.selectKeys.length
          return
        }else{ //没选中,重置
        this.categForm.cat_pid= 0
        this.categForm.cat_level = 0

        }
      },
      // 点击确定
      async addCate(){
        this.$refs.CategoryRef.validate(valid =>{
          if(!valid) return
        })
        // 校验通过，发请求，添加数据

        const res = await this.$http.post('categories',this.categForm)
        if(res.data.meta.status !==201){
          return this.$message.error('添加数据失败')

        }
        // 成功
        this.$message.success('添加数据成功')
        // 调用getCategory(),添加数据到列表中
        this.getCategory()
        // 把对话框隐藏
        this.cateDialogVisible =  false
      },
      // 重置表单数据resetFields()
      cateDialog(){
        this.$refs.CategoryRef.resetFields()
        this.selectKeys = []
        this.categForm.cat_pid= 0
        this.categForm.cat_level = 0
      }    
    }
  }
</script>

<style scoped>
  .el-button{
    margin: 20px 0;
  }
  .el-button{
    margin: 0 8px;
  }
  .el-card{
    margin: 20px 0;
  }
  .tree-table{
    margin-top: 15px;
  }
  .el-pagination{
    margin-top: 14px;
  }
  .el-cascader{
    width: 100%;
  }
</style>
