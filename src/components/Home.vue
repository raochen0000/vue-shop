<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <h3>电商后台管理系统</h3>
      <el-button type="danger" class="logout" @click="logout"> 退出 </el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :style="isCollapse ? 'width: 66px' : 'width: 240px'">
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <div class="toggle" @click="isCollapse = !isCollapse">|||</div>
          <el-submenu
            :index="item.id + ''"
            v-for="item in manuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template>
                <i class="el-icon-s-grid"></i>
                {{ subItem.authName }}
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体结构 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      manuList: [],
      iconObj: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false,
      activePath: "",
    };
  },
  created() {
    this.getManuList();
    this.activePath = sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
    },
    async getManuList() {
      const { data: res } = await this.$axios.get("/menus");
      if (res.meta.status !== 200)
        return this.$message.error("获取权限列表失败！");
      this.manuList = res.data;
      // console.log(this.manuList);
    },
    saveNavState(path) {
      sessionStorage.setItem("activePath", path);
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  h3 {
    color: #fff;
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.el-menu {
  border-right: none;
}
.iconfont {
  margin-right: 5px;
}
.toggle {
  height: 20px;
  background-color: #555;
  color: #fff;
  text-align: center;
  font-size: 12px;
  letter-spacing: 0.2rem;
  cursor: pointer;
}
</style>