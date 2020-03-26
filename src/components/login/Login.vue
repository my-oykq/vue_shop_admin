<template>
  <div class="login-container">
      <div class="login-box">
        <div class="avater">
          <img src="../../assets/timg.jpg" alt="">
        </div>
        <el-form label-width="0px" class="login-form" :model="form" :rules="rules" ref="loginFormRef">
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input prefix-icon="iconfont icon-user" v-model="form.username"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
           <el-input prefix-icon="iconfont icon-3702mima" v-model="form.password" type="password"></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" size="mini" @click="handleLogin">登录</el-button>
            <el-button type="info" size="mini" @click="handleLofinReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    data () {
      return {
        form:{
          username:'admin',
          password:'123456'
        },
        // 校验规则
        rules:{
          username:[
            {required:true,message:'请输入用户名',trigger: 'blur'},
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
          password:[
            {required:true,message:'请输入密码',trigger: 'blur'},
            { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
          ] 
        }
      }
    },
    
    /* 
    把token保存到seesionStorage中，因为sessionStorage是会话机制，关闭浏览器数据就不存在了，只有在当前的网站打开期间生效，
    localStorage是持久化机制，如果不是手动删除的话数据依然存在

    
    
    */
    methods: {
      handleLogin(){
        this.$refs.loginFormRef.validate(async valid =>{
          // 验证不正确直接退出
          if(!valid) return
          // 登录请求,从请求中结构拿到data，重新定义data为res
          const {data: res} = await this.$http.post("login", this.form)
       
          if(res.meta.status !==200){
            // 弹框效果
            this.$message.error('登录失败')
          }else{
            this.$message.success('登录成功')
          }
          // 将token保存在seesionStorage中名字  ，  拿到的真正的token
          window.sessionStorage.setItem('token',res.data.token)
          this.$router.push('/home')
        })
      },
      // 重置验证
      handleLofinReset(){
        // 拿到表单对象调用表单方法重置
        this.$refs.loginFormRef.resetFields()
        }
    }
  }
</script>

<style scoped>
.login-form{
  /* 把文本框的位置移动到中间 */
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.btns{
  display: flex;
  /* 尾部对齐 */
  justify-content: flex-end;
}
.login-container{
  background: #2b4b6b;
  height: 100%;

}
.login-box{
  width: 450px;
  height: 300px;
  background-color: #ffffff;
  border-radius: 4px;
  /* 位置居中 */
  position: absolute;
  left:50%;
  top: 50%;
  transform: translate(-50%,-50%);
}
.avater{
  width: 110px;
  height: 110px;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #dddddd;
  /* 位置移动到中间 */
  position: absolute;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #ffffff;
}
.avater img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eeeeee;
}
 
</style>
