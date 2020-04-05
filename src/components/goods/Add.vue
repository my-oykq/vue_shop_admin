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
                <!-- 渲染表单 -->
                <el-form-item :label="item.attr_name" v-for="item in tabManyData" :key="item.attr_id">
                  <el-checkbox-group v-model="item.attr_vals">
                    <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
                <el-form-item :label="item.attr_name" v-for="item in tabOnlyData" :key="item.attr_id">
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品照片" name="3">
              <!-- action地址 on-preview指定 预览 on-remove点击x删除图片
              list-type预览图片的方式,on-success请求服务器拿到的数据-->
              <el-upload
                :action="uploadURL"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :headers="headerObj"
                :on-success="handleSuccess">
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <!-- 富文本编辑器 -->
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button type="primary" @click="add">添加商品</el-button>
            </el-tab-pane>
        </el-tabs>
      </el-form>  
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
       <img :src="previewPath" alt="" class="preview-image"> 
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import _ from 'lodash'
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
                goods_cat:[],//以为','分割的分类列表 
                pics:[],//图片的数组
                goods_introduce:'',//商品的详情描述,介绍
                attrs:[],//商品的参数（数组），包含 `动态参数` 和 `静态属性`
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
              tabOnlyData:[],//静态属性数据
              uploadURL:'http://127.0.0.1:8888/api/private/v1/upload',//上传地址
              headerObj:{
                // Authorization为每一次上传图片提供一个token验证
                Authorization:window.sessionStorage.getItem('token')
              },//图片上传组件的header请求头对象
              previewPath:'',//保存到真正图片的地址
              previewVisible:false,//控制图片预览弹框的显示与隐藏
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
            
          },
        //   监听级联菜单
          handleChange(){
            //   控制级联菜单选择范围，如果goods_cat.length !==3，那么选不上
              if(this.addForm.goods_cat.length !==3){
                  this.addForm.goods_cat = []
              }
              
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
            
              // 拿到返回数据，通过遍历拿到每一项
              res.data.data.forEach(item =>{
                // item每一项身上有一个属性：attr_vals，判断attr_vals的数组是不是等于0，等于0拿到第一个数组的信息，如果有空数组就显示空数组，不是空数组就显示并且
                // 把字符串切割成数组
                item.attr_vals = 
                item.attr_vals.length === 0 ? []: item.attr_vals.split(' ')
                 
                
              })
              // 成功，保存动态参数数据
              this.tabManyData = res.data.data
              console.log(res)
            }else if(this.activeIndex === '2'){
              const result = await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{sel:'only'}
              })
              if(result.data.meta.status !== 200){
                return this.$message.error('获取静态属性列表失败')
              }
              // 成功，保存静态属性数据
              this.tabOnlyData = result.data.data
              
            }
            
          },
          // 监听图片上传成功的事件, // 将临时路径保存到表单上
          handleSuccess(response){
            // 1.拼接到一个图片信息对象
            const picsInfo = {pic:response.data.tmp_path}
            // 2.将图片信息对象push到pics数组中
           this.addForm.pics.push(picsInfo)
           
           
          },
          // 处理图片预览事件
          handlePreview(file){
           
            // 保存真正的url,把真正的url保存到data中，并且绑定到img动态的src中
            this.previewPath = file.response.data.url
            // 将弹框显示
            this.previewVisible = true
          },
          // 处理移除图片
          handleRemove(file){
            // 1.获取将要删除的图片临时路径
            const filePath = file.response.data.tmp_path
            // 2.从pics数组中找到这个图片对应的索引值--用findIndex查找对应的index
            const i = this.addForm.pics.findIndex(x =>{
              x.pic === filePath
            })
            // 3.调用数组的splice方法，把图片的信息对象从pics数组中移除
            this.addForm.pics.splice(i, 1)
          },
          // 添加商品
          add(){
            // 1.先校验是否都填写完整
            this.$refs.addRefs.validate(async valid =>{
              if (!valid) {
                return this.$message.error('请填写必要的表单项！')
              }
           /* 
           深拷贝:把addForm对象复制出新的一份，下载lodash，调用cloneDeep函数，
           传入需要复制的值
           */
             const form =  _.cloneDeep(this.addForm)
              // 1.把goods_cat转换成字符串
             form.goods_cat = form.goods_cat.join(',')

              // 2.处理动态参数和静态属性，通过遍历拿到动态参数的值
              this.tabManyData.forEach(item =>{
                // 2-1拿到这两个值
                const newInfo = {
                  attr_id:item.attr_id,
                  attr_value:item.attr_vals.join(' ')
                  }
                // 2-2添加到attrs数组中
                this.addForm.attrs.push(newInfo)
              })
              // 3.处理静态属性
              this.tabOnlyData.forEach(item =>{
                const newInfo = {
                  attr_id:item.attr_id,
                  attr_value:item.attr_vals
                  }
                  this.addForm.attrs.push(newInfo)
              })
              // 4.把添加的attrs赋值给form
                form.attrs = this.addForm.attrs
               

              // this.tabManyData.forEach(item => {
              //   const newInfo = {
              //     attr_id: item.attr_id,
              //     attr_value: item.attr_vals.join(' ')
              //   }
              //   this.addForm.attrs.push(newInfo)
              // })
              // // 处理静态属性
              // this.tabOnlyData.forEach(item => {
              //   const newInfo = { attr_id: item.attr_id,
              //   attr_value: item.attr_vals }
              //   this.addForm.attrs.push(newInfo)
              // })
              // form.attrs = this.addForm.attrs
              // console.log(form)

              // 成功，发请求，添加商品
              const res = await this.$http.post('goods',form)
              if(res.data.meta.status !== 201){
                return this.$message.error('创建商品失败')
              }
              // 成功
              this.$message.success('添加商品成功')
              // 跳转到goods商品页面
              this.$router.push('/goods')
              console.log(res)

            })
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
.el-checkbox{
  margin: 0 10px 0 0 !important
}
.preview-image{
  width: 100%;
}
.el-button{
  margin-top: 15px;
}
</style>
