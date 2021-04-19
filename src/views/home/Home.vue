<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>电商后台管理系统</div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 左侧侧边栏 -->
      <el-aside :width="isToggle ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleClick">|||</div>
        <!--  active-text-color选中项颜色 
              unique-opened只保持一个子菜单的展开
              collapse 是否折叠
              collapse-transition 是否开启折叠动画
              router 是否开启路由模式
              default-active 当前激活菜单的 index   $route.path这里暂时不用
         -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened :collapse="isToggle" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 index值不能相同-->
          <el-submenu v-for="item in menuList" :key="item.id" :index="item.id + ''">
            <!-- 一级菜单模版 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="icons[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="'/' + subItem.path" @click="saveNavState('/' + subItem.path)">
              <!-- 二级菜单模版 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容区域 -->
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from 'network/home'

export default {
  name: 'Home',
  data() {
    return {
      //左侧菜单数据
      menuList: [],
      icons: {
        125: 'el-icon-user-solid',
        103: 'el-icon-s-grid',
        101: 'el-icon-goods',
        102: 'el-icon-s-order',
        145: 'el-icon-s-data',
      },
      //是否折叠
      isToggle: false,
      //被激活的链接地址
      activePath: '',
    }
  },
  methods: {
    //点击退出登陆
    logout() {
      window.sessionStorage.removeItem('token') //清除 token
      this.$router.push('/login') //重新跳转
    },
    //点击切换菜单折叠与展开
    toggleClick() {
      this.isToggle = !this.isToggle
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    },
  },
  created() {
    //获取菜单列表
    getMenuList().then((res) => {
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    })
    //取出存储的激活状态赋值给 activePath
    this.activePath = window.sessionStorage.getItem('activePath')
  },
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
  }

  .el-aside {
    background-color: #333744;

    .toggle-button {
      background-color: #4a5064;
      font-size: 10px;
      line-height: 24px;
      text-align: center;
      color: #fff;
      letter-spacing: 0.2em;
      cursor: pointer;
    }

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }
}
</style>
