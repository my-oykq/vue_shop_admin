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
        <el-aside width="200px">
            <!-- 左侧 -->
            <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#409EFF"
                unique-opened>
                <!-- 一级菜单 -->
                <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                    <!-- 一级菜单的模板区域 -->
                    <template slot="title">
                    <i :class="iconlist[item.id]"></i>
                    <span>{{item.authName}}</span>
                    </template>
                    <!-- 二级菜单 -->
                    <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>{{subItem.authName}}</span>
                        </template>
                    </el-menu-item>
                </el-submenu>
            </el-menu>
        </el-aside>
        <el-main>Main</el-main>
    </el-container>
    </el-container>
</template>

<script type="text/ecmascript-6">
  export default {
      data () {
          return {
              menulist:[], //左侧菜单数据
              iconlist:{
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'
              }
          }
      },
      methods: {
        //   退出
          handleLoginout(){
            //   清楚sessionStorage中token
              window.sessionStorage.clear()
            //   跳转到登录页面
              this.$router.push('/login')
          },
          async getMenus(){
              const res  = await this.$http.get('menus')
              console.log(res)
              
            //   如果拿到的数据不等于200(不成功)，弹框
            //   if( res.data.status !== 200) return this.$message.error(res.data.meta.msg)
            //   成功拿到列表数据
            
            this.menulist = res.data.data
            console.log(this.menulist)
          }
        //   const { data: res } = await this.$http.get('menus')
        //         if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
        //         this.menulist = res.data
        //         console.log(res)
      },
      created(){
        //   调用左侧菜单列表
          this.getMenus()
      }
  }
</script>

<style scoped>
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
