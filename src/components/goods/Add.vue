<template>
  <div>
     <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon>
      </el-alert>
      <el-steps align-center :space="200" :active="activeIndex-0" finish-status="success">
        <el-step title="基本信息" ></el-step>
        <el-step title="商品参数" ></el-step>
        <el-step title="商品属性" ></el-step>
        <el-step title="商品照片" ></el-step>
        <el-step title="商品内容" ></el-step>
        <el-step title="完成" ></el-step>
      </el-steps>
      <!-- 联动，点击tabs时，steps也会对应跟着切换，v-model绑定，通过绑定activeIndex -->
      <el-form :model="addForm" :rules="addFormRules" 
        ref="addRefs" label-width="100px" 
        label-position="top"
        >
        <el-tabs :tab-position="tabPosition" 
        style="height:100%;" v-model="activeIndex"
        :before-leave="beforeTabLeave" @tab-click="tabCilked">
            <el-tab-pane label="基本信息" name="0">
               <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="addForm.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="goods_price">
                    <el-input v-model="addForm.goods_price" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品重量" prop="goods_weight">
                    <el-input v-model="addForm.goods_weight" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品数量" prop="goods_number">
                    <el-input v-model="addForm.goods_number" type="number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类" prop="goods_cat">
                    <el-cascader 
                        v-model="addForm.goods_cat"
                        :options="catelist" 
                        expand-trigger="hover" 
                        :props="cateProps"
                        @change="handleChange"></el-cascader>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
                
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
                
            </el-tab-pane>
            <el-tab-pane label="商品照片" name="3">
                
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
                
            </el-tab-pane>
        </el-tabs>
      </el-form>  
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
      data () {
          return {
              catelist:[],//级联菜单分类数据
              activeIndex:'0',// 动态联动效果
              tabPosition:'left',
            //   数据源，需要绑定的数据对象
              addForm:{
                goods_name:'',//名称
                goods_price:0,//价格
                goods_weight:0,// 重量
                goods_number:0,//数量
                goods_cat:[]
              },//添加商品的表单对象
              addFormRules:{ //表单验证规则
                goods_name:[
                  { required: true, message: '请输入商品名称', trigger: 'blur' },
                ],
                goods_price:[
                  { required: true, message: '请输入商品价格', trigger: 'blur' },
                ],
                goods_weight:[
                  { required: true, message: '请输入商品重量', trigger: 'blur' },
                ],
                goods_number:[
                  { required: true, message: '请输入商品数量', trigger: 'blur' }, 
                ],
                goods_cat:[
                  { required: true, message: '请输入商品分类', trigger: 'blur' }, 
                ]
              },
              //prop配置对象
              cateProps:{
                value:'cat_id',//选中的那个值
                label:'cat_name',//名称,看到的值
                children:'children'//父子嵌套的数据
              },//指定配置对象
              selectCateKeys:[],//// 级联选择框双向绑定到的数组
              tabManyData:[],//保存的是获取三级菜单的数据
          }
      },
      computed: {
        // 当前选中的三级 商品分类id
        cateId(){
           // 如果当前选中的索引等于3，选中了三级分类
          if(this.addForm.goods_cat.length == 3){
             //返回 goods_cat数组中最后一项
            return this.addForm.goods_cat[2]
          }
          // 没有选中,返回一个空
          return null
        }
      },
      created () {
          this.getCateList()
      },
      methods: {
        //   获取所有商品的分类数据---级联菜单的数据
         async getCateList(){
            const res = await this.$http.get('categories')
            if(res.data.meta.status !==200){
               return this.$message.error('获取分类数据失败')
            }
            // 成功
            this.catelist = res.data.data
            console.log(res)
          },
        //   监听级联菜单
          handleChange(){
            //   控制级联菜单选择范围，如果goods_cat.length !==3，那么选不上
              if(this.addForm.goods_cat.length !==3){
                  this.addForm.goods_cat = []
              }
              console.log(this.addForm.goods_cat)
          },
          // 点击标签页的切换，oldActiveName即将离开的标签页，
          // activeName即将进入的标签页
          beforeTabLeave(activeName,oldActiveName){
         
            if(oldActiveName === '0'&& this.addForm.goods_cat.length !==3){
              this.$message.error('请选择商品分类')
              return false
            }
          },
          // 点击激活显示对应的模板
         async tabCilked(){
            if(this.activeIndex === '1'){
              const res = await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{sel:'many'}
              })
              if(res.data.meta.status !== 200){
                return this.$message.error('获取动态参数列表失败')
              }
              // 成功
              this.tabManyData = res.data.data
              console.log(res)
            }
            
          }
      }
  }
</script>

<style scoped>
.el-tabs{
    margin-top: 10px;
}
.el-card{
    margin-top: 20px;
}
.el-steps {
    margin-top: 20px;
    font-size: 13px;
}
</style>
