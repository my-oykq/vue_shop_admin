<template>
    <el-container class="home-container">
        <el-header>
            <div class="home-info">
                <img src="../../assets/timg.jpg" class="home-image" alt="">
                <span>电商管理系统</span>
            </div>
            <el-button type="info" size="mini" @click="handleLoginout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width="isCollapse? '64px': '200px'">
                <div class="toggle-button" @click="Toggle">|||</div>
                <!-- 左侧 -->
                <el-menu
                    background-color="#333744"
                    text-color="#fff"
                    active-text-color="#409EFF"
                    unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    :default-active="activePath"
                    router>
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id" >
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title">
                        <i :class="iconlist[item.id]"></i>
                        <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" 
                        v-for="subItem in item.children" 
                        :key="subItem.id"
                            @click="savaNavState('/' + subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
        
    </el-container>
    
</template>

<script type="text/ecmascript-6">
  export default {
      data () {
          return {
              menulist:[], //左侧菜单数据
            //   自定义图标，通过没个item.id作为标记进行渲染
              iconlist:{
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
              },
              isCollapse:false,
              activePath:''
          }
      },
      methods: {
        //   把左侧菜单导航的数据保存到sessionStorage中保持激活状态
          savaNavState( activePath ){
              window.sessionStorage.setItem('activePath', activePath)
              this.activePath = activePath
          },
        //   点击按钮进行折叠
          Toggle(){
              this.isCollapse = !this.isCollapse
          },
        //   退出
          handleLoginout(){
            //   清楚sessionStorage中token
              window.sessionStorage.clear()
            //   跳转到登录页面
              this.$router.push('/login')
          },
          async getMenus(){
              const res  = await this.$http.get('menus')
            
              
            //   如果拿到的数据不等于200(不成功)，弹框
            //   if( res.data.status !== 200) return this.$message.error(res.data.meta.msg)
            //   成功拿到列表数据
            
            this.menulist = res.data.data
          
          }
        
      },
      created(){
        //   调用左侧菜单列表
          this.getMenus()
        //   取值,保持激活状态
        this.activePath = window.sessionStorage.getItem('activePath')
      }
  }
</script>

<style scoped>
.el-container{
    /* 内容区的高 */
    height: calc(100% - 60px);
}
.toggle-button{
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #ffffff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
.el-menu{
    border-right: none;
}
.iconfont{
    margin-right: 10px;
}
.home-info{
    display: flex;
    /* 文字居中对齐 */
    align-items: center;

}
.home-info span{
    margin-left: 15px;
}
.home-image{
    width: 50px;
    height: 50px;
    border-radius: 50%;
}
.home-container{
    height: 100%;
}
.el-header{
    background-color: #373d41;
    /* 浮动 */
    display: flex;
    /* position: fixed;
    left: 0;
    bottom: 0;
    top: 0;
    right: 0; */
    /* 左右两边分开 */
    justify-content: space-between;
    padding-left: 10px;
    align-items: center;
    color: #ffffff;
    font-size: 20px;
    
}
.el-aside{
    background-color: #333744;
}
.el-main{
    background-color: #eeeeee;
}
</style>
